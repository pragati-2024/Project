const express = require("express");
const router = express.Router();

const { requireAuth } = require("../Middleware/auth");
const UserModel = require("../Models/user");

const {
  buildQuestionPrompt,
  buildFeedbackPrompt,
  buildAnswerCheckPrompt,
} = require("../ai/prompts");
const { callGeminiText } = require("../ai/gemini");
const {
  generateFallbackQuestions,
  evaluateFallback,
} = require("../ai/fallback");
const { getQuestionBank } = require("../ai/questionBank");

const normalizeLines = (text) =>
  String(text || "")
    .split("\n")
    .map((line) => line.replace(/^\s*[-*\d.]+\s*/, "").trim())
    .filter(Boolean);

const MAX_HISTORY = 50;

const normalizeDate = (value) => {
  try {
    const d = value ? new Date(value) : null;
    if (d && !Number.isNaN(d.getTime())) return d;
  } catch {
    // ignore
  }
  return new Date();
};

router.post("/questions", async (req, res) => {
  const { company = "", jobRole, level, focusArea, count } = req.body || {};

  if (!jobRole || !level || !focusArea) {
    return res
      .status(400)
      .json({ message: "jobRole, level, focusArea are required" });
  }

  const bank = getQuestionBank(company);
  if (bank && bank.length) {
    const limit = Number.isFinite(Number(count)) ? Number(count) : bank.length;
    return res.json({ source: "bank", questions: bank.slice(0, limit) });
  }

  const prompt = buildQuestionPrompt({
    company,
    jobRole,
    level,
    focusArea,
    count,
  });

  try {
    const ai = await callGeminiText({
      prompt,
      temperature: 0.5,
      maxOutputTokens: 800,
    });
    if (ai.ok) {
      const questions = normalizeLines(ai.text).slice(0, Number(count) || 5);
      if (questions.length) return res.json({ source: "ai", questions });
    }

    const questions = generateFallbackQuestions({
      company,
      jobRole,
      level,
      focusArea,
      count,
    });
    return res.json({
      source: "fallback",
      questions,
      warning: ai.ok ? undefined : ai.error,
    });
  } catch (err) {
    const questions = generateFallbackQuestions({
      company,
      jobRole,
      level,
      focusArea,
      count,
    });
    return res.json({ source: "fallback", questions, warning: err.message });
  }
});

router.post("/check-answer", async (req, res) => {
  const {
    company = "",
    jobRole,
    level,
    focusArea,
    question,
    answer,
  } = req.body || {};

  if (!jobRole || !level || !focusArea) {
    return res
      .status(400)
      .json({ message: "jobRole, level, focusArea are required" });
  }
  if (!String(question || "").trim()) {
    return res.status(400).json({ message: "question is required" });
  }
  if (!String(answer || "").trim()) {
    return res.status(400).json({ message: "answer is required" });
  }

  const prompt = buildAnswerCheckPrompt({
    company,
    jobRole,
    level,
    focusArea,
    question: String(question).slice(0, 800),
    answer: String(answer).slice(0, 4000),
  });

  const safeParseJson = (text) => {
    const raw = String(text || "").trim();
    if (!raw) return null;

    // Strip common code fences
    const withoutFences = raw
      .replace(/^```(json)?/i, "")
      .replace(/```$/i, "")
      .trim();

    // Try direct parse first
    try {
      return JSON.parse(withoutFences);
    } catch {
      // continue
    }

    // Try extracting first JSON object block
    const firstBrace = withoutFences.indexOf("{");
    const lastBrace = withoutFences.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace)
      return null;

    const sliced = withoutFences.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(sliced);
    } catch {
      return null;
    }
  };

  const formatStructuredCheck = (obj) => {
    if (!obj || typeof obj !== "object") return null;

    const verdict = ["Strong", "Okay", "Weak"].includes(obj.verdict)
      ? obj.verdict
      : null;
    const score = Number.isFinite(obj.score)
      ? Math.max(0, Math.min(10, Math.trunc(obj.score)))
      : null;
    const good = Array.isArray(obj.good)
      ? obj.good.filter(Boolean).map(String)
      : [];
    const improve = Array.isArray(obj.improve)
      ? obj.improve.filter(Boolean).map(String)
      : [];
    const keyMissing = Array.isArray(obj.keyMissing)
      ? obj.keyMissing.filter(Boolean).map(String)
      : [];
    const improvedAnswer = obj.improvedAnswer ? String(obj.improvedAnswer) : "";
    const oneLinerTip = obj.oneLinerTip ? String(obj.oneLinerTip) : "";

    const lines = [];
    if (verdict) lines.push(`Verdict: ${verdict}`);
    if (score !== null) lines.push(`Score: ${score}/10`);
    if (good.length) {
      lines.push("", "What’s good:");
      good.slice(0, 3).forEach((g) => lines.push(`- ${g}`));
    }
    if (improve.length) {
      lines.push("", "What to improve:");
      improve.slice(0, 3).forEach((i) => lines.push(`- ${i}`));
    }
    if (keyMissing.length) {
      lines.push("", "Key missing points:");
      keyMissing.slice(0, 2).forEach((k) => lines.push(`- ${k}`));
    }
    if (improvedAnswer.trim()) {
      lines.push("", "Suggested improved answer:");
      lines.push(improvedAnswer.trim());
    }
    if (oneLinerTip.trim()) {
      lines.push("", `One-liner tip: ${oneLinerTip.trim()}`);
    }
    return {
      verdict,
      score: score !== null ? score : undefined,
      good,
      improve,
      keyMissing,
      improvedAnswer,
      oneLinerTip,
      feedback: lines.join("\n").trim(),
    };
  };

  try {
    const ai = await callGeminiText({
      prompt,
      temperature: 0.4,
      maxOutputTokens: 700,
    });
    if (ai.ok && ai.text) {
      const parsed = safeParseJson(ai.text);
      const structured = formatStructuredCheck(parsed);
      if (structured) {
        return res.json({
          source: "ai",
          ...structured,
          raw: String(ai.text),
        });
      }

      return res.json({ source: "ai", feedback: ai.text });
    }

    const { score, feedback } = evaluateFallback({
      qa: [{ question: String(question || ""), answer: String(answer || "") }],
    });
    const verdict = score >= 8 ? "Strong" : score >= 5 ? "Okay" : "Weak";
    return res.json({
      source: "fallback",
      feedback,
      score,
      verdict,
      warning: ai.ok ? undefined : ai.error,
    });
  } catch (err) {
    const { score, feedback } = evaluateFallback({
      qa: [{ question: String(question || ""), answer: String(answer || "") }],
    });
    const verdict = score >= 8 ? "Strong" : score >= 5 ? "Okay" : "Weak";
    return res.json({
      source: "fallback",
      feedback,
      score,
      verdict,
      warning: err.message,
    });
  }
});

router.post("/feedback", async (req, res) => {
  const {
    company = "",
    jobRole,
    level,
    focusArea,
    questions,
    answers,
    qa,
  } = req.body || {};

  if (!jobRole || !level || !focusArea) {
    return res
      .status(400)
      .json({ message: "jobRole, level, focusArea are required" });
  }

  const pairs = Array.isArray(qa)
    ? qa
    : Array.isArray(questions)
      ? questions.map((q, i) => ({
          question: q,
          answer: (answers || [])[i] || "",
        }))
      : [];

  if (!pairs.length) {
    return res
      .status(400)
      .json({ message: "Provide qa[] or questions[] + answers[]" });
  }

  const prompt = buildFeedbackPrompt({
    company,
    jobRole,
    level,
    focusArea,
    qa: pairs,
  });

  try {
    const ai = await callGeminiText({
      prompt,
      temperature: 0.7,
      maxOutputTokens: 1200,
    });
    if (ai.ok && ai.text) {
      return res.json({ source: "ai", feedback: ai.text });
    }

    const { score, feedback } = evaluateFallback({ qa: pairs });
    return res.json({
      source: "fallback",
      feedback,
      score,
      warning: ai.ok ? undefined : ai.error,
    });
  } catch (err) {
    const { score, feedback } = evaluateFallback({ qa: pairs });
    return res.json({
      source: "fallback",
      feedback,
      score,
      warning: err.message,
    });
  }
});

// Persistent Interview History (per-user)
router.get("/history", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select(
      "interviewHistory",
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    const history = Array.isArray(user.interviewHistory)
      ? user.interviewHistory
      : [];
    // newest first
    history.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return res.json({ history: history.slice(0, MAX_HISTORY) });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err?.message || "Failed to load history" });
  }
});

router.post("/history", requireAuth, async (req, res) => {
  try {
    const {
      date,
      mode = "",
      company = "",
      jobRole = "",
      level = "",
      focusArea = "",
      text = "",
      score,
    } = req.body || {};

    if (!String(text || "").trim()) {
      return res.status(400).json({ message: "text is required" });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.interviewHistory = Array.isArray(user.interviewHistory)
      ? user.interviewHistory
      : [];

    user.interviewHistory.unshift({
      date: normalizeDate(date),
      mode: String(mode || "").slice(0, 30),
      company: String(company || "").slice(0, 80),
      jobRole: String(jobRole || "").slice(0, 80),
      level: String(level || "").slice(0, 30),
      focusArea: String(focusArea || "").slice(0, 40),
      text: String(text || "").slice(0, 20000),
      score: typeof score === "number" ? score : undefined,
    });

    user.interviewHistory = user.interviewHistory.slice(0, MAX_HISTORY);
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err?.message || "Failed to save history" });
  }
});

router.delete("/history", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.interviewHistory = [];
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err?.message || "Failed to clear history" });
  }
});

module.exports = router;
