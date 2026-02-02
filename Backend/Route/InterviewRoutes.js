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
const { getMbaQuestionBank } = require("../ai/mbaQuestionBank");
const { analyzeAnswerQuality } = require("../ai/answerQuality");
const questionRoutes = require("./QuestionRoutes");

const buildEncouragement = ({ score }) => {
  if (typeof score !== "number") {
    return "Keep going — you’re improving with every question.";
  }
  if (score >= 8) {
    return "Excellent — you’re doing really well. Keep the same structure and add 1 concrete example/metric to make it even stronger.";
  }
  if (score >= 5) {
    return "Good job — you’re on the right track. For a higher score, add 1–2 key details (example, metric, trade-off) and keep answers structured.";
  }
  if (score >= 1) {
    return "Don’t worry — this is normal in practice. Focus on structure first, then add one clear example to support your points.";
  }
  return "No problem — let’s improve. Avoid 1–3 word answers; aim for a short, structured explanation (6–10 lines) with one example.";
};

const buildStudyResources = ({ track, focusArea, question }) => {
  const t = String(track || "")
    .trim()
    .toLowerCase();
  const fa = String(focusArea || "")
    .trim()
    .toLowerCase();
  const q = String(question || "").trim();

  const resources = [];

  if (t === "mba" || fa === "behavioral") {
    resources.push({
      label: "STAR Method (Interview Structure)",
      url: "https://www.indeed.com/career-advice/interviewing/star-method",
    });
    resources.push({
      label: "Behavioral Interview Tips",
      url: "https://www.themuse.com/advice/behavioral-interview-questions-answers-examples",
    });
  }

  if (t === "mba") {
    resources.push({
      label: "MBA Interview Prep (Goals / Why MBA / Leadership)",
      url: "https://www.mba.com/explore-programs/mba-programs/mba-interviews",
    });
  }

  if (fa === "technical") {
    resources.push({
      label: "GeeksforGeeks (Search this topic)",
      url: makeGfgSearchUrl(q || "interview question"),
    });
  }

  // Always add a general structure resource.
  resources.push({
    label: "How to give better interview answers (structure + examples)",
    url: "https://www.indeed.com/career-advice/interviewing/how-to-answer-interview-questions",
  });

  // Cap to keep payload small.
  return resources.slice(0, 3);
};

const getQuestionText = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") return String(item.question || item.q || "");
  return "";
};

const getAnswerText = (item) => {
  if (!item || typeof item !== "object") return "";
  return String(item.answer || item.a || "");
};

const makeGfgSearchUrl = (query) =>
  `https://www.geeksforgeeks.org/?s=${encodeURIComponent(String(query || "").trim())}`;

const withGfgReferences = (item, secondaryQuery) => {
  const q = getQuestionText(item);
  const answer = getAnswerText(item);
  const tags = Array.isArray(item?.tags) ? item.tags : [];
  const secondary =
    String(secondaryQuery || "").trim() ||
    (tags.length ? tags.join(" ") : "") ||
    q;

  return {
    question: q,
    answer,
    difficulty: item?.difficulty,
    tags,
    references: [
      { label: "GFG (Search)", url: makeGfgSearchUrl(q) },
      { label: "GFG (Topic)", url: makeGfgSearchUrl(secondary) },
    ],
  };
};

const shuffleInPlace = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const pickUnique = (pool, count, used) => {
  const out = [];
  for (const item of pool) {
    if (out.length >= count) break;
    const key = getQuestionText(item).toLowerCase();
    if (!key) continue;
    if (used.has(key)) continue;
    used.add(key);
    out.push(item);
  }
  return out;
};

const EXTRA_TECHNICAL = [
  {
    question: "What is time complexity? Explain Big-O with an example.",
    answer:
      "Time complexity describes how runtime grows as input size n grows. Big-O gives an upper bound (worst-case growth rate).\n\nExample:\n- Linear search is O(n) because in worst case you check all elements.\n- Binary search is O(log n) because you halve the search space each step.\n\nIn interviews, also mention space complexity when relevant.",
    difficulty: "easy",
    tags: ["dsa", "complexity"],
  },
  {
    question: "Explain HashMap vs HashSet in Java.",
    answer:
      "HashMap stores key→value pairs; HashSet stores only unique values (it’s typically backed by a HashMap internally). Use HashMap when you need mapping; use HashSet when you only need fast membership/uniqueness checks. Average-case operations are O(1), but depend on good hashing.",
    difficulty: "easy",
    tags: ["java", "collections"],
  },
  {
    question:
      "What is the difference between ArrayList and LinkedList in Java?",
    answer:
      "ArrayList is backed by a dynamic array: fast random access O(1), insert/delete in middle can be O(n) due to shifting. LinkedList is node-based: insert/delete at ends is O(1) (with pointers), but random access is O(n). In practice, ArrayList is more commonly used unless you truly need frequent inserts/removals at known positions.",
    difficulty: "medium",
    tags: ["java", "dsa"],
  },
  {
    question: "What is REST? What makes an API RESTful?",
    answer:
      "REST is an architectural style for building APIs around resources. A RESTful API typically uses: meaningful resource URLs, standard HTTP methods (GET/POST/PUT/PATCH/DELETE), appropriate status codes, stateless requests, and consistent representations (usually JSON).",
    difficulty: "easy",
    tags: ["backend", "http"],
  },
  {
    question: "Explain the difference between PUT and PATCH.",
    answer:
      "PUT typically replaces the full resource representation (or is treated as full update), while PATCH applies a partial update. PUT is usually idempotent; PATCH can be idempotent depending on implementation.",
    difficulty: "easy",
    tags: ["backend", "http"],
  },
  {
    question:
      "What is an index in a database and why does it speed up queries?",
    answer:
      "An index is a data structure (often a B-tree) that helps the database locate rows faster without scanning the whole table. It speeds up reads for indexed columns, but adds overhead to writes (INSERT/UPDATE/DELETE) because the index must be maintained. Good indexing is about selecting the right columns and avoiding too many indexes.",
    difficulty: "medium",
    tags: ["backend", "dbms"],
  },
];

const buildTechnicalQuestionSet = ({ count, jobRole, level }) => {
  const safeCount = Math.max(1, Math.min(20, Number(count) || 5));
  const bank = (questionRoutes && questionRoutes.QUESTIONS) || {};

  const dsa = Array.isArray(bank["dsa-java"]) ? bank["dsa-java"] : [];
  const java = Array.isArray(bank["java"]) ? bank["java"] : [];
  const backend = []
    .concat(Array.isArray(bank.node) ? bank.node : [])
    .concat(Array.isArray(bank.express) ? bank.express : [])
    .concat(Array.isArray(bank.dbms) ? bank.dbms : [])
    .concat(Array.isArray(bank.os) ? bank.os : [])
    .concat(Array.isArray(bank.networking) ? bank.networking : []);

  const used = new Set();
  const out = [];

  const dsaNeed = safeCount >= 5 ? 2 : 1;
  const backendNeed = safeCount >= 5 ? 2 : Math.max(0, safeCount - dsaNeed - 1);
  const coreNeed = Math.max(0, safeCount - dsaNeed - backendNeed);

  out.push(...pickUnique(shuffleInPlace([...dsa]), dsaNeed, used));
  out.push(
    ...pickUnique(
      shuffleInPlace([...java, ...EXTRA_TECHNICAL]),
      coreNeed,
      used,
    ),
  );
  out.push(
    ...pickUnique(
      shuffleInPlace([...backend, ...EXTRA_TECHNICAL]),
      backendNeed,
      used,
    ),
  );

  // If still short, fill from everything we have.
  const everything = []
    .concat(dsa)
    .concat(java)
    .concat(backend)
    .concat(EXTRA_TECHNICAL);
  out.push(
    ...pickUnique(
      shuffleInPlace([...everything]),
      safeCount - out.length,
      used,
    ),
  );

  const secondaryQuery =
    `${jobRole || "Software"} ${level || ""} interview technical`.trim();
  return out
    .slice(0, safeCount)
    .map((item) => withGfgReferences(item, secondaryQuery));
};

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

router.post("/questions", requireAuth, async (req, res) => {
  const {
    company = "",
    jobRole,
    level,
    focusArea,
    count,
    track,
  } = req.body || {};

  if (!jobRole || !level || !focusArea) {
    return res
      .status(400)
      .json({ message: "jobRole, level, focusArea are required" });
  }

  const normalizedTrack = String(track || "")
    .trim()
    .toLowerCase();
  if (normalizedTrack === "mba") {
    const safeCount = Number.isFinite(Number(count)) ? Number(count) : 10;
    return res.json({
      source: "mba-bank",
      questions: getMbaQuestionBank({ count: safeCount }),
    });
  }

  // Company-specific question banks should apply across modes (video/chat/voice).
  // If user typed Google/Amazon/Microsoft, return that set even if focusArea is technical.
  const bank = getQuestionBank(company);
  if (bank && bank.length) {
    const limit = Number.isFinite(Number(count)) ? Number(count) : bank.length;
    return res.json({ source: "bank", questions: bank.slice(0, limit) });
  }

  // For Technical mode we return curated Q&A with references
  // (so chat/voice/video interview can show ideal answers + GFG links).
  if (String(focusArea).toLowerCase() === "technical") {
    const safeCount = Number.isFinite(Number(count)) ? Number(count) : 5;
    const questions = buildTechnicalQuestionSet({
      count: safeCount,
      jobRole,
      level,
    });
    return res.json({ source: "topic-bank", questions });
  }

  const prompt = buildQuestionPrompt({
    company,
    jobRole,
    level,
    focusArea,
    count,
    track,
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
      track,
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
      track,
    });
    return res.json({ source: "fallback", questions, warning: err.message });
  }
});

router.post("/check-answer", requireAuth, async (req, res) => {
  const {
    company = "",
    jobRole,
    level,
    focusArea,
    track,
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

  const quality = analyzeAnswerQuality(answer);
  if (quality.lowEffort) {
    const resources = buildStudyResources({ track, focusArea, question });
    return res.json({
      source: "rule",
      verdict: "Weak",
      score: 0,
      encouragement: buildEncouragement({ score: 0 }),
      resources,
      good: [],
      improve: [
        "Your answer is too short / keyword-only. Expand with a clear explanation.",
        "Add 1 example or evidence (project, situation, metric).",
      ],
      keyMissing: ["Basic explanation", "Example / detail"],
      improvedAnswer:
        "Give a 1-line definition, then 2–3 supporting points, and one concrete example.",
      oneLinerTip: "Avoid 1–3 word answers; explain in 6–10 lines.",
      feedback:
        "Verdict: Weak\nScore: 0/10\n\nWhat to improve:\n- Answer is too short/keyword-only.\n- Add explanation + example.",
      blockedBy: quality.reason,
    });
  }

  const prompt = buildAnswerCheckPrompt({
    company,
    jobRole,
    level,
    focusArea,
    track,
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
        // Safety net: if an answer is low-effort, force 0 even if the model returns higher.
        const guardedScore = quality.lowEffort ? 0 : structured.score;
        const resources = buildStudyResources({ track, focusArea, question });
        return res.json({
          source: "ai",
          ...structured,
          ...(typeof guardedScore === "number" ? { score: guardedScore } : {}),
          ...(quality.lowEffort
            ? { verdict: "Weak", blockedBy: quality.reason }
            : {}),
          encouragement: buildEncouragement({
            score:
              typeof guardedScore === "number"
                ? guardedScore
                : structured.score,
          }),
          resources,
          raw: String(ai.text),
        });
      }

      const resources = buildStudyResources({ track, focusArea, question });
      return res.json({
        source: "ai",
        feedback: ai.text,
        encouragement: buildEncouragement({ score: undefined }),
        resources,
      });
    }

    const { score, feedback } = evaluateFallback({
      qa: [{ question: String(question || ""), answer: String(answer || "") }],
    });
    const verdict = score >= 8 ? "Strong" : score >= 5 ? "Okay" : "Weak";
    const resources = buildStudyResources({ track, focusArea, question });
    return res.json({
      source: "fallback",
      feedback,
      score,
      verdict,
      encouragement: buildEncouragement({ score }),
      resources,
      warning: ai.ok ? undefined : ai.error,
    });
  } catch (err) {
    const { score, feedback } = evaluateFallback({
      qa: [{ question: String(question || ""), answer: String(answer || "") }],
    });
    const verdict = score >= 8 ? "Strong" : score >= 5 ? "Okay" : "Weak";
    const resources = buildStudyResources({ track, focusArea, question });
    return res.json({
      source: "fallback",
      feedback,
      score,
      verdict,
      encouragement: buildEncouragement({ score }),
      resources,
      warning: err.message,
    });
  }
});

router.post("/feedback", requireAuth, async (req, res) => {
  const {
    company = "",
    jobRole,
    level,
    focusArea,
    track,
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

  // If most answers are low-effort, short-circuit with a strict 0/10 feedback.
  const signals = pairs.map((p) => analyzeAnswerQuality(p?.answer || ""));
  const lowEffortCount = signals.filter((s) => s.lowEffort).length;
  if (lowEffortCount >= Math.max(1, Math.ceil(pairs.length * 0.6))) {
    const feedback = [
      "Score: 0/10",
      "",
      "Strengths:",
      "- You attempted to respond.",
      "",
      "Improvements:",
      "- Many answers are too short or keyword-only.",
      "- Expand each answer with explanation + example (STAR for behavioral).",
      "",
      "Communication Tips:",
      "- Start with a 1-line summary, then 2–3 supporting points.",
      "- Include one metric or concrete outcome when possible.",
      "",
      "Next Steps:",
      "- Practice expanding each answer to at least 80–150 characters.",
    ].join("\n");
    return res.json({ source: "rule", feedback, score: 0 });
  }

  const prompt = buildFeedbackPrompt({
    company,
    jobRole,
    level,
    focusArea,
    qa: pairs,
    track,
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
      track = "",
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
      track: String(track || "").slice(0, 20),
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
