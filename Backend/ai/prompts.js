const buildQuestionPrompt = ({ company, jobRole, level, focusArea, count }) => {
  const safeCount = Number.isFinite(count) ? count : 5;
  const isPlacement = String(level || "").toLowerCase() === "entry";
  return `You are a senior technical interviewer.

Task: Generate exactly ${safeCount} interview questions.

Context:
- Role: ${jobRole}
- Level: ${level}
- Focus area: ${focusArea}
- Company (optional): ${company || "N/A"}

Goal:
- Make questions suitable for placement / campus interview preparation (especially for entry level), focusing on real interview patterns.

Guidance:
- Include a balanced mix based on focus area.
- If focus area is "technical", prioritize: DSA basics, OOP, DBMS, OS, networking, debugging, projects.
- If focus area is "behavioral", prioritize: teamwork, conflict, ownership, communication, STAR answers.
- If focus area is "system-design", prioritize: scalable design, trade-offs, APIs, database choices.
- Keep each question clear and actionable.

Rules:
- Output ONLY the questions.
- One question per line.
- No numbering, no bullet characters, no extra text.
- Keep questions concise, realistic, and interview-appropriate.
`;
};

const buildFeedbackPrompt = ({ company, jobRole, level, focusArea, qa }) => {
  const qaText = (qa || [])
    .map((item, idx) => {
      const q = item?.question || "";
      const a = item?.answer || "";
      return `Q${idx + 1}: ${q}\nA${idx + 1}: ${a || "(no answer)"}`;
    })
    .join("\n\n");

  return `You are an interview coach.

Provide feedback and a score for the candidate.

Context:
- Role: ${jobRole}
- Level: ${level}
- Focus area: ${focusArea}
- Company (optional): ${company || "N/A"}

Candidate responses:
${qaText}

Output format (IMPORTANT):
- First line: "Score: X/10" where X is an integer 0-10
- Then a short sectioned feedback with headings:
  "Strengths:" (2-4 bullets)
  "Improvements:" (2-4 bullets)
  "Communication Tips:" (2-4 bullets)
  "Next Steps:" (2-4 bullets)

Additional requirements:
- Keep feedback placement-oriented (what recruiters expect).
- Suggest 1 improved sample answer snippet (3-6 lines) under heading "Sample Improved Answer:" for the weakest answer.

Keep it concise and actionable.
`;
};

const buildAnswerCheckPrompt = ({
  company,
  jobRole,
  level,
  focusArea,
  question,
  answer,
}) => {
  const q = String(question || "").trim();
  const a = String(answer || "").trim();

  return `You are an interview coach.

Task: Evaluate the candidate's answer to ONE interview question and give immediate coaching.

Context:
- Role: ${jobRole}
- Level: ${level}
- Focus area: ${focusArea}
- Company (optional): ${company || "N/A"}

Question:
${q}

Candidate Answer:
${a || "(no answer)"}

Rules:
- Be specific to the question.
- If correct but vague, ask for the 1-2 most important missing details (metrics, example, trade-offs).
- If wrong/confused, correct it briefly and show the right direction.
- Keep it short and actionable.

OUTPUT FORMAT (CRITICAL):
- Output ONLY valid JSON.
- No markdown, no code fences, no extra text.
- Use double quotes for all strings.
- Arrays must contain plain strings.

Return this JSON shape:
{
  "verdict": "Strong" | "Okay" | "Weak",
  "score": 0-10,
  "good": ["..."],
  "improve": ["..."],
  "keyMissing": ["..."],
  "improvedAnswer": "3-6 lines, concise",
  "oneLinerTip": "..."
}

Constraints:
- verdict must be one of Strong/Okay/Weak.
- score must be an integer 0-10.
- good: 1-3 items; improve: 1-3 items; keyMissing: 0-2 items.
- improvedAnswer must directly answer the question.
`;
};

module.exports = {
  buildQuestionPrompt,
  buildFeedbackPrompt,
  buildAnswerCheckPrompt,
};
