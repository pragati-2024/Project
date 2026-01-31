import React, { useEffect, useRef, useState } from "react";

const VideoInterview = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [interviewDetails, setInterviewDetails] = useState({
    company: "",
    jobRole: "Software Engineer",
    level: "mid",
    focusArea: "technical",
  });

  const [permissionError, setPermissionError] = useState("");
  const [isPreviewOn, setIsPreviewOn] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answerCheck, setAnswerCheck] = useState(null);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const lastCheckedRef = useRef({ questionIndex: -1, answer: "" });
  const [interviewStage, setInterviewStage] = useState("setup");
  const [feedback, setFeedback] = useState("");

  const verdictStyles = (verdict) => {
    const v = String(verdict || "").toLowerCase();
    if (v === "strong") return "bg-green-600/20 text-green-200 border border-green-500/40";
    if (v === "okay") return "bg-yellow-600/20 text-yellow-200 border border-yellow-500/40";
    if (v === "weak") return "bg-red-600/20 text-red-200 border border-red-500/40";
    return "bg-gray-600/20 text-gray-200 border border-gray-500/40";
  };

  const isBuiltInCompany = (company) => {
    const normalized = String(company || "").trim().toLowerCase();
    return normalized === "google" || normalized === "amazon" || normalized === "microsoft";
  };

  const persistHistoryToServer = async (payload) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await fetch("/api/interview/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      // ignore
    }
  };

  const attachVideoStream = async (stream, videoEl) => {
    const el = videoEl || videoRef.current;
    if (!el) return;
    el.srcObject = stream;
    el.muted = true;
    el.playsInline = true;

    // Some browsers need metadata before play()
    await new Promise((resolve) => {
      const done = () => {
        el.removeEventListener("loadedmetadata", done);
        resolve();
      };
      el.addEventListener("loadedmetadata", done);
      // If metadata already loaded
      if (el.readyState >= 1) {
        el.removeEventListener("loadedmetadata", done);
        resolve();
      }
    });

    try {
      await el.play();
    } catch {
      // If autoplay is blocked, user can hit Start Preview/Start Interview again
    }
  };

  const setVideoElementRef = (el) => {
    videoRef.current = el;
    // When stage changes, React mounts a new <video>. Re-attach active stream.
    if (el && streamRef.current) {
      void attachVideoStream(streamRef.current, el);
    }
  };

  const appendFeedbackToHistory = (text) => {
    const entry = {
      date: new Date().toISOString(),
      text,
      mode: "video",
      company: interviewDetails.company,
      jobRole: interviewDetails.jobRole,
      level: interviewDetails.level,
      focusArea: interviewDetails.focusArea,
    };

    try {
      const stored = localStorage.getItem("interviewFeedback");
      const existing = stored ? JSON.parse(stored) : [];
      const history = Array.isArray(existing) ? existing : [];
      history.unshift(entry);
      localStorage.setItem("interviewFeedback", JSON.stringify(history.slice(0, 20)));
    } catch {
      localStorage.setItem("interviewFeedback", text);
    }

    void persistHistoryToServer(entry);
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsPreviewOn(false);
  };

  const startPreview = async () => {
    setPermissionError("");
    try {
      // Stop any previous stream first
      stopStream();

      // Try preferred constraints first, then fallback
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      }

      if (!stream.getVideoTracks().length) {
        throw new Error("No camera video track available.");
      }
      streamRef.current = stream;

      await attachVideoStream(stream);
      setIsPreviewOn(true);
    } catch (err) {
      setPermissionError(
        err?.message || "Camera/Microphone permission denied or unavailable.",
      );
      stopStream();
    }
  };

  useEffect(() => {
    // Clean up when leaving page
    return () => stopStream();
  }, []);

  const handleDetailChange = (field, value) => {
    setInterviewDetails((prev) => ({ ...prev, [field]: value }));
  };

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const useBank = isBuiltInCompany(interviewDetails.company);
      const response = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: interviewDetails.company,
          jobRole: interviewDetails.jobRole,
          level: interviewDetails.level,
          focusArea: interviewDetails.focusArea,
          ...(useBank ? {} : { count: 5 }),
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || `Failed to fetch questions (${response.status})`);
      }

      const data = await response.json();
      const qs = Array.isArray(data?.questions) ? data.questions : [];
      if (!qs.length) throw new Error("No questions received");

      // Ensure preview is running for video interview
      if (!isPreviewOn) await startPreview();

      setQuestions(qs);
      setInterviewStage("interview");
      setAnswers([]);
      setCurrentQuestionIndex(0);
      setCurrentAnswer("");
      setAnswerCheck(null);
      lastCheckedRef.current = { questionIndex: -1, answer: "" };
    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to start video interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (interviewStage !== "interview") return;
    setCurrentAnswer(answers[currentQuestionIndex] || "");
    setAnswerCheck(null);
    lastCheckedRef.current = { questionIndex: -1, answer: "" };
  }, [currentQuestionIndex, interviewStage]);

  const checkCurrentAnswer = async () => {
    if (isCheckingAnswer) return;

    const question = questions[currentQuestionIndex];
    const answer = String(currentAnswer || "").trim();
    if (!answer) {
      alert("Please provide an answer.");
      return;
    }

    if (
      answerCheck &&
      lastCheckedRef.current.questionIndex === currentQuestionIndex &&
      lastCheckedRef.current.answer === answer
    ) {
      return;
    }

    setIsCheckingAnswer(true);
    try {
      const response = await fetch("/api/interview/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: interviewDetails.company,
          jobRole: interviewDetails.jobRole,
          level: interviewDetails.level,
          focusArea: interviewDetails.focusArea,
          question,
          answer,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || `Failed to check answer (${response.status})`);
      }

      const data = await response.json();
      setAnswerCheck(data);
      lastCheckedRef.current = { questionIndex: currentQuestionIndex, answer };
    } catch (err) {
      console.error("Answer check failed:", err);
      setAnswerCheck({
        source: "error",
        feedback: "Failed to check answer. Please try again.",
        warning: err?.message,
      });
    } finally {
      setIsCheckingAnswer(false);
    }
  };

  const submitAnswer = async () => {
    const answer = String(currentAnswer || "").trim();
    if (!answer) {
      alert("Please provide an answer.");
      return;
    }

    const alreadyChecked =
      !!answerCheck &&
      lastCheckedRef.current.questionIndex === currentQuestionIndex &&
      lastCheckedRef.current.answer === answer;

    if (!alreadyChecked) {
      await checkCurrentAnswer();
      return;
    }

    const updated = [...answers];
    updated[currentQuestionIndex] = answer;
    setAnswers(updated);
    setCurrentAnswer("");
    setAnswerCheck(null);
    lastCheckedRef.current = { questionIndex: -1, answer: "" };

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const generateFeedback = async (finalAnswers = answers) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: interviewDetails.company,
          jobRole: interviewDetails.jobRole,
          level: interviewDetails.level,
          focusArea: interviewDetails.focusArea,
          questions,
          answers: finalAnswers,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || `Failed to fetch feedback (${response.status})`);
      }

      const data = await response.json();
      const generatedFeedback = data?.feedback || "No feedback generated";
      setFeedback(generatedFeedback);
      appendFeedbackToHistory(generatedFeedback);
      setInterviewStage("feedback");
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedback(
        "Failed to generate feedback. Here's a basic analysis:\n\n" +
          questions
            .map((q, i) => `Q${i + 1}: ${q}\nA: ${finalAnswers[i] || "No answer"}\n`)
            .join("\n"),
      );
      setInterviewStage("feedback");
    } finally {
      setIsLoading(false);
      stopStream();
    }
  };

  const submitFinalAnswer = async () => {
    const answer = String(currentAnswer || "").trim();
    if (!answer) {
      alert("Please provide an answer.");
      return;
    }

    const alreadyChecked =
      !!answerCheck &&
      lastCheckedRef.current.questionIndex === currentQuestionIndex &&
      lastCheckedRef.current.answer === answer;

    if (!alreadyChecked) {
      await checkCurrentAnswer();
      return;
    }

    const updated = [...answers];
    updated[currentQuestionIndex] = answer;
    setAnswers(updated);
    await generateFeedback(updated);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {interviewStage === "setup" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Video Interview</h1>

            <div className="grid gap-4 mb-6">
              <div>
                <label className="block mb-2 text-gray-300">Company (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Amazon"
                  value={interviewDetails.company}
                  onChange={(e) => handleDetailChange("company", e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Job Role</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={interviewDetails.jobRole}
                  onChange={(e) => handleDetailChange("jobRole", e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Experience Level</label>
                <select
                  value={interviewDetails.level}
                  onChange={(e) => handleDetailChange("level", e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Focus Area</label>
                <select
                  value={interviewDetails.focusArea}
                  onChange={(e) => handleDetailChange("focusArea", e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="system-design">System Design</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="bg-gray-700 rounded border border-gray-600 p-3 w-full md:w-2/5">
                <div className="text-gray-300 text-sm mb-2">Camera Preview</div>
                <video
                  ref={setVideoElementRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded bg-black aspect-video"
                />
                {permissionError && (
                  <div className="text-red-300 text-sm mt-2">{permissionError}</div>
                )}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={startPreview}
                    className="flex-1 bg-gray-600 py-2 rounded hover:bg-gray-500 transition-colors"
                  >
                    Start Preview
                  </button>
                  <button
                    onClick={stopStream}
                    className="flex-1 bg-gray-600 py-2 rounded hover:bg-gray-500 transition-colors"
                  >
                    Stop
                  </button>
                </div>
              </div>

              <div className="w-full md:w-3/5">
                <button
                  onClick={generateQuestions}
                  disabled={isLoading}
                  className="w-full bg-blue-600 py-3 rounded hover:bg-blue-500 disabled:opacity-50 transition-colors font-medium"
                >
                  {isLoading ? "Starting..." : "Start Video Interview"}
                </button>
                <p className="text-gray-400 text-sm mt-3">
                  Tip: Allow camera & mic when prompted.
                </p>
              </div>
            </div>
          </div>
        )}

        {interviewStage === "interview" && questions.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-gray-700 rounded border border-gray-600 p-3">
                <div className="text-gray-300 text-sm mb-2">Live Video</div>
                <video
                  ref={setVideoElementRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded bg-black aspect-video"
                />
                {permissionError && (
                  <div className="text-red-300 text-sm mt-2">{permissionError}</div>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <div className="text-gray-400 text-sm">
                    {interviewDetails.jobRole} ({interviewDetails.level})
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded mb-6 min-h-24 border border-gray-600">
                  <p className="text-lg">{questions[currentQuestionIndex]}</p>
                </div>

                <div className="mb-6">
                  <label className="block mb-2 text-gray-300">Your Answer:</label>
                  <textarea
                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    rows={6}
                    value={currentAnswer}
                    onChange={(e) => {
                      const next = e.target.value;
                      setCurrentAnswer(next);
                      if (answerCheck) {
                        const normalized = String(next || "").trim();
                        if (
                          lastCheckedRef.current.questionIndex === currentQuestionIndex &&
                          lastCheckedRef.current.answer !== normalized
                        ) {
                          setAnswerCheck(null);
                        }
                      }
                    }}
                    placeholder="Type your answer here..."
                  />
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    onClick={checkCurrentAnswer}
                    disabled={isCheckingAnswer || !String(currentAnswer || "").trim()}
                    className="flex-1 bg-indigo-600 py-2 rounded hover:bg-indigo-500 transition-colors disabled:opacity-50"
                  >
                    {isCheckingAnswer ? "Checking..." : "Check Answer"}
                  </button>
                  {answerCheck && (
                    <button
                      onClick={() => {
                        setAnswerCheck(null);
                        lastCheckedRef.current = { questionIndex: -1, answer: "" };
                      }}
                      className="flex-1 bg-gray-600 py-2 rounded hover:bg-gray-500 transition-colors"
                    >
                      Clear Check
                    </button>
                  )}
                </div>

                {answerCheck && (
                  <div className="bg-gray-700 p-4 rounded mb-6 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-300 text-sm">
                        Answer Check{answerCheck?.source ? ` (${answerCheck.source})` : ""}
                      </div>
                      {typeof answerCheck?.score === "number" && (
                        <div className="text-gray-200 text-sm">Score: {answerCheck.score}/10</div>
                      )}
                    </div>
                    {answerCheck?.verdict && (
                      <div className="mb-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs ${verdictStyles(
                            answerCheck.verdict,
                          )}`}
                        >
                          Verdict: {String(answerCheck.verdict)}
                        </span>
                      </div>
                    )}
                    {answerCheck?.warning && (
                      <div className="text-yellow-200 text-xs mb-2">{String(answerCheck.warning)}</div>
                    )}

                    {(Array.isArray(answerCheck?.good) || Array.isArray(answerCheck?.improve)) && (
                      <div className="space-y-3">
                        {Array.isArray(answerCheck?.good) && answerCheck.good.length > 0 && (
                          <div>
                            <div className="text-gray-200 text-sm mb-1">What’s good</div>
                            <ul className="text-gray-100 text-sm list-disc pl-5 space-y-1">
                              {answerCheck.good.slice(0, 3).map((item, idx) => (
                                <li key={`good-${idx}`}>{String(item)}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {Array.isArray(answerCheck?.improve) && answerCheck.improve.length > 0 && (
                          <div>
                            <div className="text-gray-200 text-sm mb-1">What to improve</div>
                            <ul className="text-gray-100 text-sm list-disc pl-5 space-y-1">
                              {answerCheck.improve.slice(0, 3).map((item, idx) => (
                                <li key={`imp-${idx}`}>{String(item)}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {Array.isArray(answerCheck?.keyMissing) && answerCheck.keyMissing.length > 0 && (
                          <div>
                            <div className="text-gray-200 text-sm mb-1">Key missing points</div>
                            <ul className="text-gray-100 text-sm list-disc pl-5 space-y-1">
                              {answerCheck.keyMissing.slice(0, 2).map((item, idx) => (
                                <li key={`miss-${idx}`}>{String(item)}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {answerCheck?.improvedAnswer && (
                          <div>
                            <div className="text-gray-200 text-sm mb-1">Suggested improved answer</div>
                            <pre className="whitespace-pre-wrap font-sans text-gray-100 text-sm bg-gray-800/50 p-3 rounded border border-gray-600">
                              {String(answerCheck.improvedAnswer)}
                            </pre>
                          </div>
                        )}

                        {answerCheck?.oneLinerTip && (
                          <div className="text-gray-200 text-sm">
                            <span className="text-gray-300">One-liner tip:</span>{" "}
                            {String(answerCheck.oneLinerTip)}
                          </div>
                        )}
                      </div>
                    )}

                    {!Array.isArray(answerCheck?.good) && !Array.isArray(answerCheck?.improve) && (
                      <pre className="whitespace-pre-wrap font-sans text-gray-100">
                        {answerCheck?.feedback || "No feedback"}
                      </pre>
                    )}
                  </div>
                )}

                <div className="flex justify-between gap-4">
                  {currentQuestionIndex > 0 && (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                      className="flex-1 bg-gray-600 py-2 rounded hover:bg-gray-500 transition-colors"
                    >
                      Previous
                    </button>
                  )}

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={submitAnswer}
                      disabled={isCheckingAnswer}
                      className={`flex-1 bg-blue-600 py-2 rounded hover:bg-blue-500 transition-colors ${
                        currentQuestionIndex > 0 ? "" : "ml-auto"
                      } disabled:opacity-50`}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={submitFinalAnswer}
                      disabled={isLoading || isCheckingAnswer}
                      className="flex-1 bg-green-600 py-2 rounded hover:bg-green-500 transition-colors disabled:opacity-50"
                    >
                      {isLoading
                        ? "Generating Feedback..."
                        : isCheckingAnswer
                          ? "Checking Answer..."
                          : "Submit Final Answer"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {interviewStage === "feedback" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Interview Feedback</h1>

            <div className="bg-gray-700 p-4 rounded mb-6 border border-gray-600">
              <pre className="whitespace-pre-wrap font-sans">{feedback}</pre>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setInterviewStage("setup");
                  setQuestions([]);
                  setAnswers([]);
                  setCurrentQuestionIndex(0);
                  setFeedback("");
                }}
                className="flex-1 bg-blue-600 py-3 rounded hover:bg-blue-500 transition-colors font-medium"
              >
                New Interview
              </button>

              <button
                onClick={() => {
                  setInterviewStage("interview");
                  setCurrentQuestionIndex(0);
                }}
                className="flex-1 bg-gray-600 py-3 rounded hover:bg-gray-500 transition-colors font-medium"
              >
                Review Answers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoInterview;
