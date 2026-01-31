const normalizeCompany = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const GOOGLE_QUESTIONS = [
  "Tell me about yourself.",
  "Why do you want to work at Google?",
  "What are your strengths and weaknesses?",
  "Tell me about a time you faced a challenge at work and how you handled it.",
  "How do you handle feedback and criticism?",
  "Can you explain a complex technical concept in simple terms?",
  "Tell me about a time you worked on a team project. What was your role?",
  "How would you improve an existing Google product?",
  "Describe a time when you disagreed with a team member. How did you resolve it?",
  "What is your approach to learning new technologies?",
  "How would you design a URL shortening service like bit.ly?",
  "What happens when you enter a URL in a web browser?",
  "How do you work as part of a remote team?",
  "Tell me about a time you used data to solve a problem.",
  "What is your biggest achievement?",
  "What are your salary expectations?",
  "That’s the end of your Google phone interview. Do you have any questions?",
];

const AMAZON_QUESTIONS = [
  "Tell me about yourself.",
  "Why Amazon?",
  "What do you know about Amazon?",
  "Tell me about a time when you faced a difficult problem that had several possible solutions.",
  "Tell me about a time when you took the lead on a project.",
  "Tell me about a time when you made a mistake.",
  "Tell me about a time when you used data to develop a project plan or strategy.",
  "Tell me about a time when you went above and beyond to meet the needs of a customer.",
  "Give an example of when you invented something or improved a process.",
  "What are your strengths and weaknesses?",
  "Describe a time when you made a decision with incomplete information. How did you make the right decision?",
  "Tell me about a conflict you had at work and how you resolved it.",
  "Tell me about a time when you achieved great results with minimal resources.",
  "Tell me about a time when you refused to compromise on standards even though it was easier to do so.",
  "Tell me about a time when you went above and beyond for a customer.",
  "Why should we hire you?",
  "That’s the end of your Amazon phone interview. Do you have any questions?",
];

const MICROSOFT_QUESTIONS = [
  "Tell me about yourself?",
  "Why do you want to work at Microsoft?",
  "What do you think the top 3 qualities needed to work at Microsoft are?",
  "Tell me a time when you had to work with a difficult team member?",
  "How would you deal with external developers and contractors whilst working at Microsoft?",
  "Tell me about a product you think is marketed really well and why?",
  "Give me an example of a project you were involved in where your initial assumptions were incorrect?",
  "What’s your favorite Microsoft product and why?",
  "Tell me a time when you went above and beyond for a customer or a client?",
  "Describe a situation at work when you failed?",
  "What’s your biggest weakness?",
  "Where do you see yourself in five years’ time?",
  "Describe a time when you overcame a difficult challenge at work?",
  "Why should we give the job to you and what makes you the standout candidate?",
  "Which do you prefer, working as part of a team or on your own?",
  "Tell me a time when you experienced conflict with somebody at work?",
  "What would you do if you realized soon after starting working at Microsoft it wasn’t for you?",
  "In your opinion, what makes a good team?",
  "What will you dislike the most about working at Microsoft?",
  "What are your salary expectations in this Microsoft role?",
  "That’s the end of your Microsoft interview. Do you have any questions you’d like to ask us?",
];

const getQuestionBank = (companyRaw) => {
  const company = normalizeCompany(companyRaw);
  if (!company) return null;

  if (company.includes("google")) return GOOGLE_QUESTIONS;
  if (company.includes("amazon")) return AMAZON_QUESTIONS;
  if (company.includes("microsoft") || company.includes("ms"))
    return MICROSOFT_QUESTIONS;

  return null;
};

module.exports = {
  getQuestionBank,
};
