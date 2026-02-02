// Curated MBA interview question bank (Q + reference answer templates).
// These are short coaching-style answers so the UI can show a reference.

const MBA_QUESTIONS = [
  {
    question: "Tell me about yourself.",
    answer: `Present: I’m currently ___ (role/student) with experience in ___.
Past: I’ve worked on ___ and achieved ___ (numbers/impact).
Future: I want to pursue an MBA to build strong business foundations and move into ___.
Close: My strengths are ___ and ___.`,
    tags: ["mba", "intro"],
  },
  {
    question: "Why do you want to pursue an MBA?",
    answer:
      "My goal is to transition into ___ where I can influence business decisions. An MBA will help me strengthen skills in strategy, finance, marketing, and leadership. It’s the right time because I’ve gained enough exposure to know my direction, and now I need structured learning + a strong peer network.",
    tags: ["mba", "motivation"],
  },
  {
    question: "Why did you choose this school/university?",
    answer:
      "I chose this program because of (1) ___ (specialization/faculty), (2) ___ (case studies/live projects), and (3) ___ (alumni + placements). These map directly to my career plan in ___ and the learning style that suits me.",
    tags: ["mba", "school-fit"],
  },
  {
    question: "What are your career goals?",
    answer:
      "Short term: I want to work as a ___ in ___ industry focused on ___. Long term: I want to move into leadership where I can drive ___ (growth/operations/strategy) at scale. The MBA bridges the gap by building my business toolkit and improving leadership/communication.",
    tags: ["mba", "goals"],
  },
  {
    question: "What are your strengths and weaknesses?",
    answer:
      "Strength: ___ (example + result). Another strength: ___. Weakness: ___ (non-fatal), and I’m improving it by ___ (specific steps) with progress shown by ___.",
    tags: ["mba", "self-awareness"],
  },
  {
    question: "Describe a challenge you’ve overcome.",
    answer:
      "Use STAR: Situation + Task in 1–2 lines, then 2–3 Actions (prioritize, re-plan, communicate), and Result with a metric. End with the learning (resilience/adaptability).",
    tags: ["mba", "behavioral"],
  },
  {
    question: "How do you handle conflict in a team?",
    answer:
      "I first listen to both sides, clarify the shared goal, and separate people from the problem. Then I propose options, align on a decision, and document next steps. I follow up to ensure the conflict doesn’t repeat.",
    tags: ["mba", "teamwork"],
  },
  {
    question: "What do you like about your current job / work?",
    answer:
      "I like ___ because it uses my strengths in ___ and gives me exposure to ___. I enjoy collaborating cross-functionally and owning deliverables end-to-end. It motivates me because I can see measurable impact.",
    tags: ["mba", "work"],
  },
  {
    question: "How would you characterize your leadership approach?",
    answer:
      "My leadership is collaborative and outcome-focused: set clarity on goals, assign ownership, unblock quickly, and keep communication transparent. I try to coach people and give credit, while holding high standards.",
    tags: ["mba", "leadership"],
  },
  {
    question: "Can you discuss a time when you failed?",
    answer:
      "Pick a real failure, keep it professional, and focus on what changed afterward. Explain what you learned, what you fixed (process/skill), and how results improved in the next project.",
    tags: ["mba", "learning"],
  },
  {
    question: "How would an MBA help you advance in your career?",
    answer:
      "It will help me build a strong base in core subjects, sharpen decision-making, and gain exposure through case studies and projects. The network + career services will also support my transition into ___.",
    tags: ["mba", "motivation"],
  },
  {
    question:
      "Describe feedback or criticism you received and how you responded.",
    answer:
      "State the feedback, acknowledge it, explain the specific actions you took (tool/process/training), and the outcome (better performance/feedback/metric). Keep tone positive and growth-focused.",
    tags: ["mba", "feedback"],
  },
  {
    question: "How do you manage work-life balance?",
    answer:
      "I set clear boundaries, plan work weekly, prioritize high-impact tasks, and communicate early if something will slip. I use a calendar + task manager and take breaks to avoid burnout.",
    tags: ["mba", "productivity"],
  },
  {
    question: "What is your most significant accomplishment?",
    answer:
      "Choose one achievement with a clear problem, your actions, and measurable result (%, revenue, time saved). Mention what skill it demonstrates (leadership, analytics, ownership).",
    tags: ["mba", "achievement"],
  },
  {
    question: "How do you handle pressure and deadlines?",
    answer:
      "I break work into smaller tasks, prioritize by impact + deadline, communicate risks early, and ask for support when needed. Staying calm helps me make better decisions under pressure.",
    tags: ["mba", "pressure"],
  },
  {
    question: "What if you don’t get placed immediately after MBA?",
    answer:
      "I’d stay proactive: internships, certifications, networking, and projects aligned to my target role. I’d also use feedback to improve interviewing and keep applying consistently.",
    tags: ["mba", "resilience"],
  },
  {
    question: "What are your thoughts on ethical leadership?",
    answer:
      "Ethical leadership builds trust and long-term performance. It means transparency, fairness, and accountability—even when it’s difficult. Leaders set the tone for culture and decision quality.",
    tags: ["mba", "ethics"],
  },
  {
    question: "Do you have any questions for us?",
    answer:
      "Ask 2–3 thoughtful questions: curriculum flexibility, internship support, live projects, alumni outcomes, placement process, and how success is measured in the first year.",
    tags: ["mba", "closing"],
  },
];

const getMbaQuestionBank = ({ count } = {}) => {
  const wanted = Math.max(
    1,
    Math.min(20, Number(count) || MBA_QUESTIONS.length),
  );
  return MBA_QUESTIONS.slice(0, wanted);
};

module.exports = {
  getMbaQuestionBank,
  MBA_QUESTIONS,
};
