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
const {
  getMbaQuestionBank,
  findMbaAnswerByQuestion,
} = require("../ai/mbaQuestionBank");
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

const buildStudyResources = ({
  track,
  focusArea,
  question,
  mbaSpecialization,
}) => {
  const t = String(track || "")
    .trim()
    .toLowerCase();
  const fa = String(focusArea || "")
    .trim()
    .toLowerCase();
  const q = String(question || "").trim();
  const spec = String(mbaSpecialization || "")
    .trim()
    .toLowerCase();

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
    // One specialization-friendly resource (kept short; we cap to 3 links).
    if (spec === "marketing") {
      resources.push({
        label: "Marketing basics (Segmentation/Positioning)",
        url: "https://blog.hubspot.com/marketing/segmentation-targeting-positioning",
      });
    } else if (spec === "finance") {
      resources.push({
        label: "Finance basics (NPV/IRR, statements)",
        url: "https://www.investopedia.com/terms/n/npv.asp",
      });
    } else if (spec === "hr") {
      resources.push({
        label: "HR basics (recruitment, performance)",
        url: "https://www.shrm.org/topics-tools",
      });
    } else if (spec === "operations") {
      resources.push({
        label: "Operations/Supply chain basics",
        url: "https://www.investopedia.com/terms/s/supplychain.asp",
      });
    } else if (spec === "business-analytics") {
      resources.push({
        label: "Business analytics (Power BI intro)",
        url: "https://learn.microsoft.com/power-bi/fundamentals/power-bi-overview",
      });
    }
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

const isLikelyTemplateAnswer = (text) => {
  const t = String(text || "").trim();
  if (!t) return true;
  const lower = t.toLowerCase();
  if (t.length < 80) return true;
  if (lower.includes("___")) return true;
  if (
    lower.includes("1-line") ||
    lower.includes("2–3") ||
    lower.includes("2-3")
  )
    return true;
  if (lower.includes("supporting points") && lower.includes("example"))
    return true;
  return false;
};

const hydrateMbaTemplate = ({ template, mbaSpecialization }) => {
  const spec = String(mbaSpecialization || "")
    .trim()
    .toLowerCase();

  const replacementsBySpec = {
    marketing: [
      "an MBA candidate specializing in Marketing",
      "consumer insights and digital marketing",
      "a go-to-market project and a campaign analysis",
      "improving conversion rates and customer engagement",
      "move into a brand/marketing role",
      "communication",
      "data-driven decision making",
      "a clear target segment",
      "positioning",
      "measurable KPIs",
    ],
    finance: [
      "an MBA candidate specializing in Finance",
      "financial analysis and budgeting",
      "a budgeting/forecasting assignment and a valuation case",
      "improving cost visibility and decision quality",
      "move into a finance analyst/FP&A role",
      "structured thinking",
      "attention to detail",
      "cash flow focus",
      "risk awareness",
      "stakeholder communication",
    ],
    hr: [
      "an MBA candidate specializing in HR",
      "recruitment, performance management, and employee engagement",
      "a hiring workflow improvement and a policy research project",
      "better candidate experience and team productivity",
      "move into an HR generalist/talent acquisition role",
      "empathy",
      "process discipline",
      "structured interviews",
      "clear role expectations",
      "fair and consistent evaluation",
    ],
    operations: [
      "an MBA candidate specializing in Operations",
      "process improvement and supply chain fundamentals",
      "a process mapping project and a capacity planning case",
      "reducing cycle time and defects",
      "move into an operations/production role",
      "ownership",
      "problem solving",
      "standard work",
      "root-cause analysis",
      "continuous improvement",
    ],
    "business-analytics": [
      "an MBA candidate specializing in Business Analytics",
      "data analysis and dashboarding",
      "a KPI dashboard and a funnel analysis",
      "turning data into actionable recommendations",
      "move into a business analyst role",
      "analytical thinking",
      "communication",
      "clear KPI definition",
      "data validation",
      "impact measurement",
    ],
  };

  const replacements = replacementsBySpec[spec] || [
    "an MBA candidate",
    "business fundamentals",
    "a couple of academic/live projects",
    "measurable impact",
    "a business role",
    "communication",
    "problem solving",
  ];

  let i = 0;
  return String(template || "").replace(/___/g, () => {
    const next = replacements[i] || replacements[replacements.length - 1] || "";
    i += 1;
    return next;
  });
};

const buildSampleAnswer = ({
  track,
  focusArea,
  question,
  mbaSpecialization,
}) => {
  const t = String(track || "")
    .trim()
    .toLowerCase();
  const fa = String(focusArea || "")
    .trim()
    .toLowerCase();
  const q = String(question || "").trim();
  const ql = q.toLowerCase();

  if (t === "mba") {
    // First try: curated bank (if it matches exactly), then hydrate blanks.
    const bankTemplate = findMbaAnswerByQuestion({
      question: q,
      specialization: mbaSpecialization,
    });
    if (bankTemplate) {
      const hydrated = hydrateMbaTemplate({
        template: bankTemplate,
        mbaSpecialization,
      });
      if (!isLikelyTemplateAnswer(hydrated)) return hydrated.trim();
    }

    if (ql.includes("tell me about yourself")) {
      const spec = String(mbaSpecialization || "")
        .trim()
        .toLowerCase();
      const focus =
        spec === "marketing"
          ? "Marketing"
          : spec === "finance"
            ? "Finance"
            : spec === "hr"
              ? "HR"
              : spec === "operations"
                ? "Operations"
                : spec === "business-analytics"
                  ? "Business Analytics"
                  : "Business";
      return (
        `I’m an MBA candidate specializing in ${focus}. I enjoy working on problems where I can combine structured thinking with clear communication.\n\n` +
        `Recently, I worked on a project where we analyzed a real business scenario, identified the key drivers, and proposed a practical plan with measurable KPIs. I’m comfortable collaborating with teams, presenting insights, and taking ownership of outcomes.\n\n` +
        `I’m now looking for an entry-level role where I can learn fast, contribute to execution, and grow into a role that drives business impact.`
      ).trim();
    }

    if (ql.includes("why") && ql.includes("mba")) {
      return (
        "I want to pursue an MBA to build a stronger business foundation and become confident in making cross-functional decisions. I’ve seen that good outcomes need a mix of strategy, numbers, and people skills.\n\n" +
        "An MBA gives me structured learning through cases and projects, exposure to different perspectives, and opportunities to practice leadership. In the short term, I want to start in a role where I can work on real problems, learn from senior stakeholders, and deliver measurable results."
      ).trim();
    }

    if (ql.includes("strength") && ql.includes("weakness")) {
      return (
        "One of my strengths is structured problem solving. For example, in a recent project I broke a vague problem into clear steps, aligned the team on priorities, and delivered a solution on time.\n\n" +
        "A weakness I’ve been working on is being overly detail-oriented, which sometimes slows me down. To improve, I time-box analysis, define ‘good enough’ criteria early, and share quick drafts to get feedback sooner."
      ).trim();
    }

    if (ql.includes("conflict") || ql.includes("disagree")) {
      return (
        "When there’s conflict in a team, I first listen to understand both viewpoints and clarify the shared goal. Then I separate people from the problem and focus on facts, constraints, and what success looks like.\n\n" +
        "I propose 2–3 options, align on a decision with the team/manager, and confirm the next steps in writing so we don’t repeat the same issue. I also follow up after execution to make sure the relationship stays positive."
      ).trim();
    }

    // Specialization-aware default sample.
    const spec = String(mbaSpecialization || "")
      .trim()
      .toLowerCase();
    if (spec === "marketing") {
      return (
        "I would start by clearly defining the target customer segment and the problem we’re solving. Then I’d craft a positioning statement and value proposition that is easy to communicate.\n\n" +
        "Next, I’d choose the right channels (digital, partnerships, retail, etc.), set a realistic budget, and define success metrics like CAC, conversion rate, retention, and ROAS. Finally, I’d run small experiments (A/B tests), learn quickly, and scale what works."
      ).trim();
    }
    if (spec === "finance") {
      return (
        "I would approach it by identifying the key financial drivers: revenue, costs, working capital, and cash flow. Then I’d build a simple model to compare scenarios and understand sensitivity to assumptions.\n\n" +
        "I’d communicate the recommendation using NPV/ROI where relevant, highlight risks, and suggest a practical action plan—what to do now, what to monitor, and what would change the decision."
      ).trim();
    }
    if (spec === "hr") {
      return (
        "I would start with role clarity—what success looks like in 90 days—and align the JD, screening criteria, and interview questions to that.\n\n" +
        "I’d use structured interviews to reduce bias, track metrics like time-to-fill and quality-of-hire, and continuously improve the process using feedback from candidates and hiring managers."
      ).trim();
    }
    if (spec === "operations") {
      return (
        "I would map the current process end-to-end, measure where time or defects happen, and identify the biggest bottleneck.\n\n" +
        "Then I’d prioritize one or two high-impact fixes (standard work, removing handoffs, improving layout, basic automation), and track KPIs like cycle time, throughput, and defect rate to confirm the improvement."
      ).trim();
    }
    if (spec === "business-analytics") {
      return (
        "I would begin by clarifying the business objective and defining the KPIs that represent success. Then I’d gather the relevant data sources, clean/validate the data, and explore patterns to find the key drivers.\n\n" +
        "After that, I’d test hypotheses (segments/cohorts), build a simple dashboard for visibility, and recommend actions with expected impact. I’d validate with a small pilot and monitor results over time."
      ).trim();
    }

    return (
      "I would answer this by (1) clarifying the goal, (2) explaining my approach in 2–3 steps, and (3) giving one concrete example of how I would apply it.\n\n" +
      "I would also mention what I would measure to confirm success and how I would communicate progress to stakeholders."
    ).trim();
  }

  // Non-MBA (tech / general)
  if (fa === "behavioral") {
    return (
      "Situation: Briefly set the context and why it mattered.\n" +
      "Task: State your responsibility and goal.\n" +
      "Action: Explain 2–3 key actions you took (communication, prioritization, execution).\n" +
      "Result: Give a measurable outcome (time saved, quality, user impact) and what you learned."
    ).trim();
  }

  if (ql.includes("time complexity") || ql.includes("big o")) {
    return (
      "Time complexity describes how the runtime of an algorithm grows as the input size increases, usually expressed with Big-O notation.\n\n" +
      "For example, a single loop over n items is O(n), a nested loop over n items is typically O(n^2), and binary search is O(log n) because it halves the search space each step. When comparing approaches, Big-O helps us understand scalability and trade-offs."
    ).trim();
  }

  if (fa === "system-design") {
    return (
      "I would start by clarifying requirements (users, QPS, latency, data size, core features). Then I’d propose a high-level architecture with components, data model, and APIs.\n\n" +
      "Next I’d discuss scaling (caching, load balancing, sharding), reliability (retries, queues, rate limits), and trade-offs. Finally, I’d outline monitoring and failure scenarios."
    ).trim();
  }

  return "I would answer by defining the concept, explaining how it works in simple terms, and then giving a small example. Finally, I’d mention one edge case or trade-off.".trim();
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
    mbaSpecialization,
  } = req.body || {};

  const normalizedTrack = String(track || "")
    .trim()
    .toLowerCase();
  if (normalizedTrack === "mba") {
    if (!jobRole || !level) {
      return res
        .status(400)
        .json({ message: "jobRole and level are required" });
    }
    const safeCount = Number.isFinite(Number(count)) ? Number(count) : 10;
    return res.json({
      source: "mba-bank",
      questions: getMbaQuestionBank({
        count: safeCount,
        specialization: mbaSpecialization,
      }),
    });
  }

  if (!jobRole || !level || !focusArea) {
    return res
      .status(400)
      .json({ message: "jobRole, level, focusArea are required" });
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
    mbaSpecialization,
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
    mbaSpecialization,
    question,
    answer,
  } = req.body || {};

  const normalizedTrack = String(track || "")
    .trim()
    .toLowerCase();
  const effectiveFocusArea =
    normalizedTrack === "mba" ? String(focusArea || "mba") : focusArea;

  if (
    !jobRole ||
    !level ||
    (!effectiveFocusArea && normalizedTrack !== "mba")
  ) {
    return res.status(400).json({ message: "jobRole and level are required" });
  }
  if (!String(question || "").trim()) {
    return res.status(400).json({ message: "question is required" });
  }
  if (!String(answer || "").trim()) {
    return res.status(400).json({ message: "answer is required" });
  }

  const quality = analyzeAnswerQuality(answer);
  if (quality.lowEffort) {
    const resources = buildStudyResources({
      track,
      focusArea: effectiveFocusArea,
      question,
      mbaSpecialization,
    });
    const improvedAnswer = buildSampleAnswer({
      track,
      focusArea: effectiveFocusArea,
      question,
      mbaSpecialization,
    });
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
      improvedAnswer,
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
    focusArea: effectiveFocusArea,
    track,
    mbaSpecialization,
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
        const resources = buildStudyResources({
          track,
          focusArea: effectiveFocusArea,
          question,
          mbaSpecialization,
        });

        const sampleIfNeeded = buildSampleAnswer({
          track,
          focusArea: effectiveFocusArea,
          question,
          mbaSpecialization,
        });
        const useSample = isLikelyTemplateAnswer(structured.improvedAnswer);
        const patched = useSample
          ? {
              ...structured,
              improvedAnswer: sampleIfNeeded,
              feedback: String(structured.feedback || "").trim()
                ? `${String(structured.feedback || "").trim()}\n\nSample strong answer:\n${sampleIfNeeded}`
                : `Sample strong answer:\n${sampleIfNeeded}`,
            }
          : structured;

        return res.json({
          source: "ai",
          ...patched,
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

      const resources = buildStudyResources({
        track,
        focusArea: effectiveFocusArea,
        question,
        mbaSpecialization,
      });
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
    const resources = buildStudyResources({
      track,
      focusArea: effectiveFocusArea,
      question,
      mbaSpecialization,
    });
    return res.json({
      source: "fallback",
      feedback,
      score,
      verdict,
      encouragement: buildEncouragement({ score }),
      resources,
      improvedAnswer: buildSampleAnswer({
        track,
        focusArea: effectiveFocusArea,
        question,
        mbaSpecialization,
      }),
      warning: ai.ok ? undefined : ai.error,
    });
  } catch (err) {
    const { score, feedback } = evaluateFallback({
      qa: [{ question: String(question || ""), answer: String(answer || "") }],
    });
    const verdict = score >= 8 ? "Strong" : score >= 5 ? "Okay" : "Weak";
    const resources = buildStudyResources({
      track,
      focusArea: effectiveFocusArea,
      question,
      mbaSpecialization,
    });
    return res.json({
      source: "fallback",
      feedback,
      score,
      verdict,
      encouragement: buildEncouragement({ score }),
      resources,
      improvedAnswer: buildSampleAnswer({
        track,
        focusArea: effectiveFocusArea,
        question,
        mbaSpecialization,
      }),
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
    mbaSpecialization,
    questions,
    answers,
    qa,
  } = req.body || {};

  const normalizedTrack = String(track || "")
    .trim()
    .toLowerCase();
  const effectiveFocusArea =
    normalizedTrack === "mba" ? String(focusArea || "mba") : focusArea;

  if (
    !jobRole ||
    !level ||
    (!effectiveFocusArea && normalizedTrack !== "mba")
  ) {
    return res.status(400).json({ message: "jobRole and level are required" });
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

    const resources = buildStudyResources({
      track,
      focusArea: effectiveFocusArea,
      question: pairs?.[0]?.question || "",
      mbaSpecialization,
    });
    return res.json({
      source: "rule",
      feedback,
      score: 0,
      encouragement: buildEncouragement({ score: 0 }),
      resources,
    });
  }

  const prompt = buildFeedbackPrompt({
    company,
    jobRole,
    level,
    focusArea: effectiveFocusArea,
    qa: pairs,
    track,
    mbaSpecialization,
  });

  try {
    const ai = await callGeminiText({
      prompt,
      temperature: 0.7,
      maxOutputTokens: 1200,
    });
    if (ai.ok && ai.text) {
      const { score } = evaluateFallback({ qa: pairs });
      const resources = buildStudyResources({
        track,
        focusArea: effectiveFocusArea,
        question: pairs?.[0]?.question || "",
        mbaSpecialization,
      });
      return res.json({
        source: "ai",
        feedback: ai.text,
        score,
        encouragement: buildEncouragement({ score }),
        resources,
      });
    }

    const { score, feedback } = evaluateFallback({ qa: pairs });
    const resources = buildStudyResources({
      track,
      focusArea: effectiveFocusArea,
      question: pairs?.[0]?.question || "",
      mbaSpecialization,
    });
    return res.json({
      source: "fallback",
      feedback,
      score,
      encouragement: buildEncouragement({ score }),
      resources,
      warning: ai.ok ? undefined : ai.error,
    });
  } catch (err) {
    const { score, feedback } = evaluateFallback({ qa: pairs });
    const resources = buildStudyResources({
      track,
      focusArea: effectiveFocusArea,
      question: pairs?.[0]?.question || "",
      mbaSpecialization,
    });
    return res.json({
      source: "fallback",
      feedback,
      score,
      encouragement: buildEncouragement({ score }),
      resources,
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
      mbaSpecialization = "",
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
      mbaSpecialization: String(mbaSpecialization || "").slice(0, 40),
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
