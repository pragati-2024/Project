const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const { analyzeAnswerQuality } = require("./answerQuality");

const generateFallbackQuestions = ({
  jobRole,
  level,
  focusArea,
  track,
  count = 5,
}) => {
  const role = jobRole || "Software Engineer";
  const lvl = level || "mid";
  const area = focusArea || "technical";

  const templates = {
    mba: [
      "Tell me about yourself.",
      "Why do you want to pursue an MBA?",
      "What are your career goals?",
      "What are your strengths and weaknesses?",
      "Describe a challenge you’ve overcome.",
      "How do you handle conflict in a team?",
      "Describe feedback you received and how you responded.",
      "How do you handle pressure and deadlines?",
      "What is your most significant accomplishment?",
      "Do you have any questions for us?",
    ],
    technical: [
      `For placement prep: Describe one project you built and your exact contribution (tech stack + impact).`,
      `Explain time complexity and space complexity with an example.`,
      `What is the difference between stack and queue? Give a real use-case for each.`,
      `Explain OOP pillars (encapsulation, inheritance, polymorphism, abstraction) with examples.`,
      `Explain normalization in DBMS and why it matters.`,
      `What happens when you type a URL in the browser?`,
      `Explain one challenging bug you fixed recently in a ${role} context.`,
      `How would you optimize a slow API endpoint? Describe your approach step-by-step.`,
      `What are common performance bottlenecks in web applications and how do you detect them?`,
      `Describe how you would design a scalable authentication system.`,
      `What trade-offs do you consider when choosing a database for a new feature?`,
      `How do you ensure code quality and reliability in production?`,
    ],
    behavioral: [
      `Tell me about a time you handled a difficult stakeholder or teammate.`,
      `Describe a situation where you made a mistake. What did you learn?`,
      `How do you prioritize tasks when everything feels urgent?`,
      `Tell me about a time you took ownership of a problem end-to-end.`,
      `How do you handle feedback or code review comments you disagree with?`,
    ],
    "system-design": [
      `Design a URL shortener service. What components would you include?`,
      `Design a real-time chat system. How would you handle scale and reliability?`,
      `Design a file upload service with virus scanning and resumable uploads.`,
      `Design an interview practice platform like this one. What are the key services?`,
      `How would you ensure observability (logs/metrics/traces) in a microservices setup?`,
    ],
  };

  const isMbaTrack = String(track || "").toLowerCase() === "mba";
  const pool = isMbaTrack
    ? templates.mba
    : templates[area] || templates.technical;
  const wanted = clamp(Number(count) || 5, 1, 10);
  const questions = Array.from(
    { length: wanted },
    (_, i) => pool[i % pool.length],
  );

  // Slightly adjust wording by level
  if (lvl === "entry") {
    return questions.map((q) =>
      q.replace(/scalable|trade-offs|observability/gi, "basic"),
    );
  }
  if (lvl === "senior") {
    return questions.map((q) => `${q} Include trade-offs and edge cases.`);
  }
  return questions;
};

const evaluateFallback = ({ qa }) => {
  const pairs = Array.isArray(qa) ? qa : [];
  const answered = pairs.filter((p) => (p?.answer || "").trim().length > 0);

  // If every provided answer is low-effort, score must be 0.
  const effortSignals = pairs.map((p) => analyzeAnswerQuality(p?.answer || ""));
  const lowEffortAnswered = effortSignals.filter((s, idx) => {
    const has = (pairs[idx]?.answer || "").trim().length > 0;
    return has && s.lowEffort;
  });
  if (answered.length > 0 && lowEffortAnswered.length === answered.length) {
    const feedback = [
      "Score: 0/10",
      "",
      "Strengths:",
      "- You attempted to respond.",
      "",
      "Improvements:",
      "- Answers are too short / keyword-only. Add a clear explanation and one example.",
      "- Use a structure (STAR for behavioral, or Definition → Example → Impact).",
      "",
      "Communication Tips:",
      "- Start with a 1-line summary, then give 2–3 supporting points.",
      "- Avoid single-word or 2-word answers.",
      "",
      "Sample Improved Answer:",
      "- First, I would define the concept in one line. Then I would give a simple example and explain why it matters.",
      "",
      "Next Steps:",
      "- Practice expanding each answer to 6–10 lines with one real example.",
    ].join("\n");
    return { score: 0, feedback };
  }
  const avgLen = answered.length
    ? Math.round(
        answered.reduce((sum, p) => sum + (p.answer || "").trim().length, 0) /
          answered.length,
      )
    : 0;

  // Start from 0 so trivial answers don't accidentally score points.
  let score = 0;
  if (answered.length >= Math.max(1, Math.floor(pairs.length * 0.8)))
    score += 3;
  if (avgLen > 80) score += 2;
  if (avgLen > 160) score += 2;
  if (avgLen > 320) score += 1;
  score = clamp(score, 0, 10);

  const feedback = [
    `Score: ${score}/10`,
    "",
    "Strengths:",
    "- You attempted the majority of questions.",
    "- Answers show reasonable effort and clarity.",
    "",
    "Improvements:",
    "- Add concrete examples (projects, metrics, outcomes).",
    "- Structure answers using STAR (Situation, Task, Action, Result).",
    "",
    "Communication Tips:",
    "- Speak slower, add short pauses, and keep answers structured.",
    "- Avoid filler words; start with a 1-line summary, then details.",
    "",
    "Sample Improved Answer:",
    "- I handled a similar situation by clarifying the goal, proposing a plan, and sharing progress updates.",
    "- Result: reduced rework and delivered on time (mention exact impact/metric).",
    "",
    "Next Steps:",
    "- Practice 2 questions daily and review weak areas.",
    "- Do one timed mock interview per week and iterate.",
  ].join("\n");

  return { score, feedback };
};

module.exports = {
  generateFallbackQuestions,
  evaluateFallback,
};
