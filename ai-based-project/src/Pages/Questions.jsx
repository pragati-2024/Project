import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const Questions = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMap, setOpenMap] = useState({});

  const title = useMemo(() => {
    const t = String(topic || "");
    const pretty = t
      .split("-")
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
    return pretty ? `${pretty} Questions` : "Questions";
  }, [topic]);

  const normalized = useMemo(() => {
    const list = Array.isArray(questions) ? questions : [];
    return list
      .map((item) => {
        if (typeof item === "string") {
          return { question: item, answer: "" };
        }
        if (!item || typeof item !== "object") return null;
        const question = String(item.question || item.q || "").trim();
        if (!question) return null;
        return {
          question,
          answer: String(item.answer || item.a || "").trim(),
          difficulty: item.difficulty,
          tags: Array.isArray(item.tags) ? item.tags : [],
        };
      })
      .filter(Boolean);
  }, [questions]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return normalized;
    return normalized.filter((item) => {
      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = (item.answer || "").toLowerCase().includes(q);
      const inTags = (item.tags || []).some((t) => String(t).toLowerCase().includes(q));
      return inQuestion || inAnswer || inTags;
    });
  }, [normalized, searchTerm]);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/questions/${encodeURIComponent(topic || "")}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login", { replace: true });
            return;
          }
          const errText = await response.text().catch(() => "");
          throw new Error(errText || `Failed to load questions (${response.status})`);
        }
        const data = await response.json();
        setQuestions(Array.isArray(data?.questions) ? data.questions : []);
      } catch (e) {
        setError(e?.message || "Failed to load questions");
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [topic, navigate]);

  return (
    <div className="flex min-h-screen bg-transparent text-slate-900 dark:bg-gray-900 dark:text-white radial-background">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
              <p className="text-slate-600 dark:text-gray-300">Important interview questions with answers.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/question")}
              className="px-4 py-2 rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-black/10 hover:bg-white/80 dark:hover:bg-black/20 transition"
            >
              Back to Topics
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search question / answer / tag..."
              className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 border border-slate-200/70 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {isLoading && (
            <div className="bg-white/60 dark:bg-gray-800 border border-slate-200/70 dark:border-white/10 rounded-lg p-4">Loading...</div>
          )}

          {error && (
            <div className="bg-white/60 dark:bg-gray-800 border border-red-500 rounded-lg p-4 text-red-600 dark:text-red-200">
              {error}
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="bg-white/60 dark:bg-gray-800 border border-slate-200/70 dark:border-white/10 rounded-lg p-4 text-slate-700 dark:text-gray-300">
              No questions available for this topic.
            </div>
          )}

          {!isLoading && !error && filtered.length > 0 && (
            <div className="space-y-4">
              {filtered.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 dark:bg-gray-800 border border-slate-200/70 dark:border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-pink-700 dark:text-purple-300 font-semibold mb-2">Question {idx + 1}</div>
                      <div className="text-slate-900 dark:text-gray-100 font-medium">{item.question}</div>
                      {(item.difficulty || (item.tags && item.tags.length > 0)) && (
                        <div className="mt-2 text-xs text-slate-600 dark:text-gray-300">
                          {item.difficulty ? <span className="mr-2">Difficulty: {item.difficulty}</span> : null}
                          {item.tags && item.tags.length > 0 ? <span>Tags: {item.tags.join(", ")}</span> : null}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMap((prev) => ({
                          ...prev,
                          [idx]: !prev[idx],
                        }))
                      }
                      className="shrink-0 px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-purple-600 dark:hover:bg-purple-700 hover:bg-slate-800 transition text-sm"
                    >
                      {openMap[idx] ? "Hide" : "Show"} Answer
                    </button>
                  </div>

                  {openMap[idx] && (
                    <div className="mt-4 rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-black/20 p-4">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Answer</div>
                      <div className="text-sm text-slate-700 dark:text-gray-200 whitespace-pre-wrap">
                        {item.answer || "Answer will be added soon."}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questions;
