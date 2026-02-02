const normalizeText = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

const toWords = (text) =>
  normalizeText(text)
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);

const analyzeAnswerQuality = (answerRaw) => {
  const answer = normalizeText(answerRaw);
  if (!answer) {
    return { lowEffort: true, reason: "empty" };
  }

  // Very short answers are almost always non-answers.
  if (answer.length < 25) {
    return { lowEffort: true, reason: "too-short" };
  }

  const words = toWords(answer);
  const unique = new Set(words);

  // 3 words like "stack array" should not score points.
  if (words.length <= 4 || unique.size <= 3) {
    return { lowEffort: true, reason: "keyword-only" };
  }

  // If it's mostly non-letters (gibberish / symbols), treat as low effort.
  const letters = (answer.match(/[a-z]/gi) || []).length;
  if (letters > 0) {
    const ratio = letters / Math.max(1, answer.length);
    if (ratio < 0.4) {
      return { lowEffort: true, reason: "gibberish" };
    }
  }

  return { lowEffort: false };
};

module.exports = {
  analyzeAnswerQuality,
  normalizeText,
};
