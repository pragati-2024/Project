const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const generateFallbackQuestions = ({
  jobRole,
  level,
  focusArea,
  count = 5,
}) => {
  const role = jobRole || "Software Engineer";
  const lvl = level || "mid";
  const area = focusArea || "technical";

  const templates = {
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

  const pool = templates[area] || templates.technical;
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
  const avgLen = answered.length
    ? Math.round(
        answered.reduce((sum, p) => sum + (p.answer || "").trim().length, 0) /
          answered.length,
      )
    : 0;

  let score = 4;
  if (answered.length >= Math.max(1, Math.floor(pairs.length * 0.8)))
    score += 2;
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
