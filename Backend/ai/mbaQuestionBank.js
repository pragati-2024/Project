// Curated MBA interview question bank (Q + reference answer templates).
// These are short coaching-style answers so the UI can show a reference.

const MBA_COMMON_QUESTIONS = [
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

const MBA_SPECIALIZATION_QUESTIONS = {
  marketing: [
    {
      question: "How would you launch a new product in a competitive market?",
      answer:
        "Start with target segment + pain point, then positioning, pricing, channels, and a launch plan (teasers → launch → retention). Define success metrics (CAC, conversion, retention) and run A/B tests to iterate.",
      tags: ["mba", "marketing"],
    },
    {
      question: "What is STP (Segmentation, Targeting, Positioning)?",
      answer:
        "Segmentation: divide the market by needs/behavior/demographics. Targeting: pick the segments with best fit and profitability. Positioning: craft a clear value proposition so customers remember why you are different.",
      tags: ["mba", "marketing"],
    },
    {
      question: "How do you measure a digital marketing campaign?",
      answer:
        "Define objective first (awareness/leads/sales). Track key metrics like CTR, CPC, conversion rate, CAC, ROAS, and retention. Use attribution carefully and compare against benchmarks + cohort performance.",
      tags: ["mba", "marketing"],
    },
    {
      question: "How would you do market research for a new city/region?",
      answer:
        "Combine secondary research (reports, competitors) + primary research (surveys, interviews, pilots). Estimate market size, buying triggers, pricing sensitivity, and channel reach. Validate assumptions via a small pilot.",
      tags: ["mba", "marketing"],
    },
    {
      question:
        "Tell me about a time you influenced someone without authority.",
      answer:
        "Use STAR: align on the goal, show data/customer insight, propose options, and get buy-in through communication and follow-ups. Close with measurable result.",
      tags: ["mba", "marketing", "behavioral"],
    },
  ],
  finance: [
    {
      question: "Explain NPV and IRR in simple terms.",
      answer:
        "NPV is the value today of future cash flows minus investment, using a discount rate. IRR is the discount rate where NPV becomes zero. Prefer NPV for comparing projects; IRR can be misleading with non-standard cash flows.",
      tags: ["mba", "finance"],
    },
    {
      question:
        "What is the difference between revenue, profit, and cash flow?",
      answer:
        "Revenue is total sales. Profit is revenue minus expenses (accounting view). Cash flow is actual cash movement; a company can be profitable but still have poor cash flow due to receivables/inventory.",
      tags: ["mba", "finance"],
    },
    {
      question: "How do you evaluate a company’s financial health?",
      answer:
        "Look at profitability (margins), liquidity (current ratio), leverage (debt/equity), efficiency (inventory/receivable days), and cash flow. Compare trends over time and against peers.",
      tags: ["mba", "finance"],
    },
    {
      question: "Explain budgeting and forecasting.",
      answer:
        "Budgeting is planning targets (revenue/cost/cash) for a period. Forecasting updates expectations based on actuals and new information. Good forecasting helps manage risk and resource allocation.",
      tags: ["mba", "finance"],
    },
    {
      question:
        "Tell me about a time you worked with numbers/data to make a decision.",
      answer:
        "Describe the dataset, what you analyzed (trend/cost/ROI), your recommendation, and the outcome. Mention how you validated assumptions and communicated to stakeholders.",
      tags: ["mba", "finance", "behavioral"],
    },
  ],
  hr: [
    {
      question: "What is your approach to recruitment and selection?",
      answer:
        "Start with role clarity (JD + success metrics), source candidates, screen for skills and culture fit, use structured interviews, and close with fair offers. Track quality-of-hire and time-to-fill.",
      tags: ["mba", "hr"],
    },
    {
      question: "How would you reduce employee attrition?",
      answer:
        "Diagnose root causes using exit data and manager feedback, improve onboarding, career paths, recognition, and manager capability. Measure by attrition rate, engagement scores, and internal mobility.",
      tags: ["mba", "hr"],
    },
    {
      question: "Explain performance management.",
      answer:
        "It’s a continuous cycle: set goals, ongoing feedback, coaching, mid-year check-ins, and fair evaluation. Focus on development plans and alignment to business outcomes.",
      tags: ["mba", "hr"],
    },
    {
      question: "How do you handle a conflict between two employees?",
      answer:
        "Listen to both sides, focus on facts and shared goals, mediate possible solutions, agree on behaviors, and follow up. Document if needed and ensure fairness.",
      tags: ["mba", "hr"],
    },
    {
      question: "What is organizational behavior and why is it important?",
      answer:
        "OB studies how people behave in organizations—motivation, teams, leadership, culture. It matters because it directly impacts performance, retention, and change adoption.",
      tags: ["mba", "hr"],
    },
  ],
  operations: [
    {
      question: "How would you improve a slow process in operations?",
      answer:
        "Map the process, identify bottlenecks (time, defects, handoffs), prioritize high-impact fixes, implement standard work, and track KPIs like cycle time, defect rate, and throughput.",
      tags: ["mba", "operations"],
    },
    {
      question: "What is supply chain management?",
      answer:
        "It’s managing the flow from suppliers to customers: procurement, production, inventory, logistics, and demand planning. Goal is right product, right time, right cost.",
      tags: ["mba", "operations"],
    },
    {
      question: "Explain inventory management basics.",
      answer:
        "Balance service levels vs holding cost. Use demand forecasting, reorder points, safety stock, and ABC analysis. Reduce stockouts while avoiding excess inventory.",
      tags: ["mba", "operations"],
    },
    {
      question: "What is quality control and how do you ensure it?",
      answer:
        "Define quality standards, measure defects, use root-cause analysis (5 Whys, fishbone), implement preventive actions, and audit continuously. Track DPMO and customer complaints.",
      tags: ["mba", "operations"],
    },
    {
      question: "Tell me about a time you improved efficiency.",
      answer:
        "Use STAR with a metric: baseline time/cost, actions you took (process change, automation, standardization), and the measured improvement.",
      tags: ["mba", "operations", "behavioral"],
    },
  ],
  "business-analytics": [
    {
      question: "How would you use data to solve a business problem?",
      answer:
        "Clarify the objective, define KPIs, gather/clean data, analyze patterns, test hypotheses, and recommend actions. Validate with a pilot and monitor impact.",
      tags: ["mba", "business-analytics"],
    },
    {
      question: "What KPIs would you track for a sales funnel?",
      answer:
        "Leads → MQL → SQL → conversion. Track conversion rates, CAC, cycle time, win rate, average deal size, and churn/retention. Segment by channel and cohort.",
      tags: ["mba", "business-analytics"],
    },
    {
      question: "Explain how you would build a dashboard for leadership.",
      answer:
        "Start with decisions leaders need to make, choose 5–8 key KPIs, show trends and drill-downs, define data freshness, and ensure metric definitions are consistent. Keep it simple and actionable.",
      tags: ["mba", "business-analytics"],
    },
    {
      question: "What is the difference between correlation and causation?",
      answer:
        "Correlation means variables move together; causation means one causes the other. To claim causation, you need experiments or strong identification strategies, not just correlation.",
      tags: ["mba", "business-analytics"],
    },
    {
      question: "How do you ensure data quality?",
      answer:
        "Define data ownership, validation rules, monitoring (nulls/outliers), and reconciliation with source systems. Document definitions and create alerts for anomalies.",
      tags: ["mba", "business-analytics"],
    },
  ],
};

const shuffle = (arr) => {
  const out = Array.isArray(arr) ? [...arr] : [];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const getMbaQuestionBank = ({ count, specialization } = {}) => {
  const wanted = Math.max(
    1,
    Math.min(20, Number(count) || MBA_COMMON_QUESTIONS.length),
  );

  const key = String(specialization || "")
    .trim()
    .toLowerCase();
  const specPool = MBA_SPECIALIZATION_QUESTIONS[key] || [];
  const pool = shuffle([...MBA_COMMON_QUESTIONS, ...specPool]);
  return pool.slice(0, wanted);
};

const normalizeQuestion = (q) =>
  String(q || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const findMbaAnswerByQuestion = ({ question, specialization } = {}) => {
  const q = normalizeQuestion(question);
  if (!q) return null;

  const key = String(specialization || "")
    .trim()
    .toLowerCase();
  const specPool = MBA_SPECIALIZATION_QUESTIONS[key] || [];

  const pool = [...MBA_COMMON_QUESTIONS, ...specPool];
  const hit = pool.find((item) => normalizeQuestion(item?.question) === q);
  return hit && hit.answer ? String(hit.answer) : null;
};

module.exports = {
  getMbaQuestionBank,
  findMbaAnswerByQuestion,
  MBA_COMMON_QUESTIONS,
  MBA_SPECIALIZATION_QUESTIONS,
};
