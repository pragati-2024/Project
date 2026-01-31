const express = require("express");
const router = express.Router();

const QUESTIONS = {
  html: [
    {
      question: "What is semantic HTML and why is it important?",
      answer:
        "Semantic HTML uses meaningful tags (header, nav, main, article, section, footer). It improves accessibility, SEO, and makes the DOM easier to maintain and style.",
      difficulty: "easy",
      tags: ["a11y", "seo"],
    },
    {
      question: "What is the difference between <div> and <section>/<article>?",
      answer:
        "div is a generic container (no meaning). section groups related content with a heading; article is standalone, reusable content (blog post, card, comment). Use semantic tags for structure and accessibility.",
      difficulty: "easy",
      tags: ["semantics"],
    },
    {
      question: "Which meta tags are commonly essential on real websites?",
      answer:
        "Typically: charset, viewport, description, title, and (optionally) Open Graph/Twitter tags for sharing. Viewport is critical for responsive behavior on mobile.",
      difficulty: "easy",
      tags: ["seo", "mobile"],
    },
    {
      question: "How does the browser render HTML + CSS at a high level?",
      answer:
        "Parses HTML to DOM, CSS to CSSOM, combines into render tree, calculates layout, then paints pixels and composites layers. JS can block parsing/layout if it manipulates DOM/CSS.",
      difficulty: "medium",
      tags: ["rendering"],
    },
    {
      question: "What is accessibility (a11y) and how do you improve it?",
      answer:
        "Make UI usable with keyboard/screen readers: semantic tags, correct labels, focus states, aria-* only when needed, proper contrast, heading order, alt text, and test with keyboard + Lighthouse.",
      difficulty: "medium",
      tags: ["a11y"],
    },
    {
      question: "Explain forms best practices for production apps.",
      answer:
        "Use label+id, name attributes, HTML validation where possible, server-side validation always, accessible error messages, disable submit while loading, and prevent double-submit.",
      difficulty: "medium",
      tags: ["forms", "a11y"],
    },
  ],

  css: [
    {
      question: "Explain the CSS box model.",
      answer:
        "Each element has content, padding, border, and margin. By default width/height apply to content-box; with box-sizing: border-box width includes padding+border.",
      difficulty: "easy",
      tags: ["layout"],
    },
    {
      question: "What is flexbox and when would you use it?",
      answer:
        "Flexbox is 1D layout for aligning items in a row/column (e.g., navbars, cards in a row, centering). Use Grid for 2D page layouts.",
      difficulty: "easy",
      tags: ["layout"],
    },
    {
      question:
        "Difference between position: relative / absolute / fixed / sticky?",
      answer:
        "relative offsets element while keeping space. absolute removes from flow and positions to nearest positioned ancestor. fixed positions to viewport. sticky behaves like relative until a threshold then sticks.",
      difficulty: "easy",
      tags: ["layout"],
    },
    {
      question: "Explain specificity and how conflicts are resolved.",
      answer:
        "More specific selectors win; if equal specificity, later rule wins. !important overrides normal rules but should be avoided for maintainability.",
      difficulty: "medium",
      tags: ["specificity"],
    },
    {
      question: "How do you design responsive layouts?",
      answer:
        "Use fluid units (%, rem), flexible layout (flex/grid), and media queries for breakpoints. Prefer mobile-first and test real devices.",
      difficulty: "medium",
      tags: ["responsive"],
    },
    {
      question: "What causes layout shift and how do you prevent it?",
      answer:
        "CLS happens when content loads late (images, fonts, ads) and pushes layout. Set image dimensions, reserve space, use font-display, avoid inserting UI above current content.",
      difficulty: "medium",
      tags: ["performance"],
    },
  ],

  javascript: [
    {
      question: "Explain the event loop and microtasks vs macrotasks.",
      answer:
        "The event loop executes the call stack, then drains microtasks (Promises/queueMicrotask), then takes the next macrotask (setTimeout, I/O). Microtasks run before the next render tick.",
      difficulty: "medium",
      tags: ["async"],
    },
    {
      question: "Difference between var, let, and const?",
      answer:
        "var is function-scoped and hoisted; let/const are block-scoped with TDZ. const prevents reassignment (but objects can still be mutated).",
      difficulty: "easy",
      tags: ["basics"],
    },
    {
      question: "What are closures? Give a practical example.",
      answer:
        "A closure is when a function remembers variables from its outer scope even after the outer function returns (e.g., factory functions, private state, callbacks in loops).",
      difficulty: "medium",
      tags: ["functions"],
    },
    {
      question: "What is prototypal inheritance?",
      answer:
        "Objects can inherit from other objects via the prototype chain. Property lookup walks up the chain. Classes are syntax sugar over prototypes.",
      difficulty: "medium",
      tags: ["objects"],
    },
    {
      question: "How do you handle async errors in JavaScript?",
      answer:
        "Use try/catch with async/await; use .catch with Promises. In Node/Express, forward errors to error middleware; avoid unhandled promise rejections.",
      difficulty: "medium",
      tags: ["async"],
    },
    {
      question: "Explain debounce vs throttle.",
      answer:
        "Debounce delays execution until a pause (search input). Throttle limits execution to once per interval (scroll/resize).",
      difficulty: "easy",
      tags: ["performance"],
    },
  ],

  react: [
    {
      question: "What is the difference between state and props?",
      answer:
        "Props are inputs from parent (read-only). State is internal, mutable data that triggers re-render when updated.",
      difficulty: "easy",
      tags: ["basics"],
    },
    {
      question: "Explain useEffect common pitfalls.",
      answer:
        "Missing dependencies causes stale values; too many dependencies can cause loops. Cleanup is needed for subscriptions/timers. Don’t derive state from props inside effects unless necessary.",
      difficulty: "medium",
      tags: ["hooks"],
    },
    {
      question: "How does React reconciliation work (high level)?",
      answer:
        "React compares previous vs next virtual DOM, then applies minimal DOM updates. Keys help React match items in lists and avoid incorrect re-use.",
      difficulty: "medium",
      tags: ["rendering"],
    },
    {
      question: "How do you optimize performance in React apps?",
      answer:
        "Avoid unnecessary renders (memo/useMemo/useCallback), split code (lazy), virtualize big lists, keep state local, and profile with React DevTools.",
      difficulty: "medium",
      tags: ["performance"],
    },
    {
      question: "Controlled vs uncontrolled components?",
      answer:
        "Controlled: React state is the source of truth (value+onChange). Uncontrolled: DOM holds state (refs). Controlled is easier to validate; uncontrolled can be simpler for small forms.",
      difficulty: "easy",
      tags: ["forms"],
    },
    {
      question: "What are common React Router patterns for auth?",
      answer:
        "Use protected routes (RequireAuth wrapper), store token securely, redirect after login, and fetch /me on app load to hydrate the user. Avoid trusting only client-side checks.",
      difficulty: "medium",
      tags: ["routing", "auth"],
    },
  ],

  node: [
    {
      question: "What is Node.js and why is it good for APIs?",
      answer:
        "Node.js runs JS on the server with an event-driven, non-blocking I/O model, which is great for I/O-heavy APIs (DB/network).",
      difficulty: "easy",
      tags: ["runtime"],
    },
    {
      question: "What is JWT and how does auth work end-to-end?",
      answer:
        "Server issues a signed token after login. Client stores it (often in memory/secure storage) and sends it via Authorization header. Server verifies signature + expiry and authorizes requests.",
      difficulty: "medium",
      tags: ["auth"],
    },
    {
      question: "How do you handle errors in production APIs?",
      answer:
        "Use centralized error middleware, consistent error responses, log with request IDs, avoid leaking stack traces, and return correct HTTP status codes.",
      difficulty: "medium",
      tags: ["errors"],
    },
    {
      question: "How do you secure an API (high level)?",
      answer:
        "Validate inputs, rate-limit, set secure CORS, use helmet, sanitize, store secrets in env, hash passwords, least-privilege DB users, and monitor logs.",
      difficulty: "medium",
      tags: ["security"],
    },
    {
      question: "What is a process manager and why use it (PM2, systemd)?",
      answer:
        "Keeps your Node app running, restarts on crash, manages logs and env, and can run multiple instances for scaling.",
      difficulty: "easy",
      tags: ["deployment"],
    },
    {
      question: "How would you structure a scalable Node project?",
      answer:
        "Separate routes/controllers/services, keep config in one place, validate requests, isolate DB layer, and add tests + logging. Keep feature folders consistent.",
      difficulty: "medium",
      tags: ["architecture"],
    },
  ],

  express: [
    {
      question: "What is Express.js and what problem does it solve?",
      answer:
        "Express is a minimal Node.js web framework that provides routing, middleware, and request/response helpers to build APIs and web apps quickly.",
      difficulty: "easy",
      tags: ["framework"],
    },
    {
      question: "Explain middleware in Express.",
      answer:
        "Middleware are functions that run in order for a request (e.g., auth, logging, validation). They can modify req/res, end the response, or call next() to continue.",
      difficulty: "easy",
      tags: ["middleware"],
    },
    {
      question: "How do you implement request validation in Express?",
      answer:
        "Validate body/query/params (e.g., Zod/Joi/express-validator) before hitting controller logic. Return 400 with clear errors; never trust client input.",
      difficulty: "medium",
      tags: ["validation"],
    },
    {
      question: "How does error-handling middleware work?",
      answer:
        "Error middleware has signature (err, req, res, next). You call next(err) or throw in async (with wrapper). Centralize formatting + logging there.",
      difficulty: "medium",
      tags: ["errors"],
    },
    {
      question: "How do you protect routes (JWT auth) in Express?",
      answer:
        "Create requireAuth middleware: read Authorization: Bearer token, verify JWT, attach user info to req, and call next(). Use it on protected routes.",
      difficulty: "medium",
      tags: ["auth"],
    },
    {
      question: "How do you handle CORS correctly in Express?",
      answer:
        "Allow only trusted origins, set credentials only if needed, and avoid wildcard origins with cookies. Configure per environment and test preflight OPTIONS.",
      difficulty: "medium",
      tags: ["security"],
    },
  ],

  python: [
    {
      question: "What are Python decorators and when would you use them?",
      answer:
        "A decorator wraps a function to add behavior (logging, auth, caching) without changing the original code. Implemented as higher-order functions.",
      difficulty: "medium",
      tags: ["functions"],
    },
    {
      question: "Explain list comprehensions.",
      answer:
        "A compact way to build lists: [expr for x in iterable if cond]. It’s often clearer and faster than manual loops for simple transformations.",
      difficulty: "easy",
      tags: ["basics"],
    },
    {
      question: "What is a virtual environment and why is it important?",
      answer:
        "It isolates dependencies per project so versions don’t conflict. Tools: venv, pipenv, poetry.",
      difficulty: "easy",
      tags: ["tooling"],
    },
    {
      question: "Deep copy vs shallow copy?",
      answer:
        "Shallow copy copies the container but references nested objects; deep copy recursively copies nested objects too.",
      difficulty: "easy",
      tags: ["memory"],
    },
    {
      question: "How do you handle exceptions and create custom exceptions?",
      answer:
        "Use try/except/finally, raise for errors, and define custom exceptions by subclassing Exception to communicate specific failure types.",
      difficulty: "easy",
      tags: ["errors"],
    },
  ],

  devops: [
    {
      question: "What is CI/CD and what are its benefits?",
      answer:
        "CI runs automated tests/builds on every change; CD automates deploys. Benefits: faster releases, fewer regressions, consistent deployments.",
      difficulty: "easy",
      tags: ["pipeline"],
    },
    {
      question: "Explain Docker images vs containers.",
      answer:
        "An image is a packaged filesystem + metadata; a container is a running instance of an image with its own process, network, and writable layer.",
      difficulty: "easy",
      tags: ["docker"],
    },
    {
      question: "What is blue/green deployment?",
      answer:
        "You run two environments (blue and green). Deploy to the idle one, test, then switch traffic. It reduces downtime and makes rollback easy.",
      difficulty: "medium",
      tags: ["deployment"],
    },
    {
      question: "How do you monitor an app in production?",
      answer:
        "Use metrics (CPU/memory/latency), logs, and tracing. Add alerts (SLOs), dashboards, and error tracking (e.g., Sentry).",
      difficulty: "medium",
      tags: ["observability"],
    },
    {
      question: "What is Infrastructure as Code (IaC)?",
      answer:
        "Managing infrastructure via versioned code (Terraform, CloudFormation). Enables repeatable provisioning, reviews, and rollbacks.",
      difficulty: "medium",
      tags: ["iac"],
    },
  ],

  "ai-ml": [
    {
      question: "Explain overfitting and how to prevent it.",
      answer:
        "Overfitting is when a model memorizes training data and fails to generalize. Prevent with more data, regularization, simpler models, dropout, and proper validation.",
      difficulty: "easy",
      tags: ["ml"],
    },
    {
      question: "Supervised vs unsupervised learning?",
      answer:
        "Supervised learns from labeled data (classification/regression). Unsupervised finds structure in unlabeled data (clustering, dimensionality reduction).",
      difficulty: "easy",
      tags: ["ml"],
    },
    {
      question: "What is an embedding and where is it used?",
      answer:
        "An embedding maps text/images to vectors capturing meaning. Used for semantic search, recommendations, clustering, and Retrieval-Augmented Generation (RAG).",
      difficulty: "medium",
      tags: ["nlp"],
    },
    {
      question: "How do you evaluate classification models?",
      answer:
        "Common metrics: accuracy, precision/recall, F1, ROC-AUC. Choose based on costs of false positives/negatives and class imbalance.",
      difficulty: "medium",
      tags: ["ml"],
    },
    {
      question: "What is prompt engineering and why does it matter?",
      answer:
        "Designing prompts to reliably get correct output: clear role, constraints, examples, structured output, and safety rules. It reduces hallucinations and improves consistency.",
      difficulty: "easy",
      tags: ["llm"],
    },
    {
      question: "What is model drift?",
      answer:
        "When real-world data changes over time and model performance degrades. Detect via monitoring, and mitigate via retraining and feedback loops.",
      difficulty: "medium",
      tags: ["mlops"],
    },
  ],

  "ai-integration": [
    {
      question: "How do you integrate AI into a real product (high level)?",
      answer:
        "Define the use-case + success metric, choose model (hosted vs self), build an API layer, add guardrails/validation, log prompts/results, evaluate quality, and iterate.",
      difficulty: "easy",
      tags: ["product"],
    },
    {
      question: "What is RAG and when would you use it?",
      answer:
        "Retrieval-Augmented Generation: retrieve relevant docs from a vector store and provide them to the model. Use it when answers must be grounded in your private/company data.",
      difficulty: "medium",
      tags: ["rag", "embeddings"],
    },
    {
      question: "Where should AI calls live: frontend or backend?",
      answer:
        "Usually backend, to protect API keys, enforce rate limits, validate inputs, log safely, and apply consistent safety policies. Frontend can call your backend.",
      difficulty: "easy",
      tags: ["security"],
    },
    {
      question: "How do you reduce latency and cost for LLM features?",
      answer:
        "Cache responses, use smaller models when possible, limit tokens, stream output, batch requests, and do retrieval to reduce context size.",
      difficulty: "medium",
      tags: ["performance"],
    },
    {
      question: "How do you evaluate AI output quality?",
      answer:
        "Use offline test sets, automated checks (schema/grounding), human review for edge cases, and production monitoring. Track hallucination rate and user satisfaction.",
      difficulty: "medium",
      tags: ["evaluation"],
    },
    {
      question: "What security concerns matter for AI features?",
      answer:
        "Prompt injection, data leakage, PII handling, unsafe outputs, and abuse. Apply input/output filtering, least-privilege tools, audit logs, and strict system prompts.",
      difficulty: "medium",
      tags: ["security"],
    },
  ],

  hr: [
    {
      question: "Tell me about yourself (HR round).",
      answer:
        "Use a 60–90 sec structure: Present (current role/skills), Past (relevant experience/projects), Future (why this role/company). End with 1 key strength aligned to job.",
      difficulty: "easy",
      tags: ["intro", "communication"],
    },
    {
      question: "Why do you want to join our company?",
      answer:
        "Show alignment: (1) product/mission, (2) role scope + growth, (3) how your skills match. Mention 1–2 specific things (tech stack, team culture, domain).",
      difficulty: "easy",
      tags: ["motivation"],
    },
    {
      question: "What are your strengths and weaknesses?",
      answer:
        "Strength: pick one with proof (example). Weakness: pick a real but non-fatal one + show improvement plan and progress.",
      difficulty: "easy",
      tags: ["self-awareness"],
    },
    {
      question: "Describe a time you handled conflict in a team.",
      answer:
        "Use STAR: Situation, Task, Action, Result. Focus on listening, aligning goals, proposing options, and documenting decisions.",
      difficulty: "medium",
      tags: ["behavioral", "teamwork"],
    },
    {
      question: "Why should we hire you?",
      answer:
        "Summarize 2–3 reasons: relevant skills, proven results/projects, and cultural fit. Map each reason to job requirements.",
      difficulty: "easy",
      tags: ["closing"],
    },
    {
      question: "Where do you see yourself in 2–3 years?",
      answer:
        "Keep realistic and role-aligned: improving core skills, owning features/modules, mentoring, and contributing to impact. Avoid saying ‘MBA’ or ‘startup’ unless it matches.",
      difficulty: "easy",
      tags: ["career"],
    },
    {
      question: "What salary are you expecting?",
      answer:
        "Answer with a range based on market + your level, and show flexibility: ‘Based on my skills and market, I expect X–Y, but I’m open to discuss overall compensation.’",
      difficulty: "medium",
      tags: ["salary"],
    },

    // Common HR Interview Questions – extracted list
    {
      question: "Tell me something about yourself.",
      answer:
        "Use a short intro: who you are, what you’ve done, and why you’re here. Keep it 60–90 seconds and job-relevant.",
      difficulty: "easy",
      tags: ["intro"],
    },
    {
      question:
        "Tell me something about yourself which is not mentioned in your resume.",
      answer:
        "Share a positive trait with proof: a hobby, volunteer work, leadership, or a learning habit that connects to the role.",
      difficulty: "easy",
      tags: ["intro", "personality"],
    },
    {
      question: "Describe yourself.",
      answer:
        "Pick 2–3 qualities (e.g., disciplined, curious, team-focused) and give one short example for each.",
      difficulty: "easy",
      tags: ["personality"],
    },
    {
      question: "Describe yourself in one line.",
      answer:
        "One line = role + strength + impact. Example: ‘I’m a problem-solver who builds clean, user-friendly apps.’",
      difficulty: "easy",
      tags: ["intro"],
    },
    {
      question: "Describe yourself in three words.",
      answer:
        "Choose words that match the job: ‘Curious, reliable, collaborative’ (then be ready to justify each with examples).",
      difficulty: "easy",
      tags: ["intro"],
    },
    {
      question: "Describe yourself in two words.",
      answer:
        "Pick two job-aligned strengths: ‘Adaptable’ + ‘Accountable’ (briefly explain).",
      difficulty: "easy",
      tags: ["intro"],
    },
    {
      question: "Describe yourself in one word.",
      answer:
        "Pick one strong word you can prove: ‘Consistent’, ‘Curious’, or ‘Resilient’.",
      difficulty: "easy",
      tags: ["intro"],
    },
    {
      question: "Tell me something about yourself that isn’t on your resume.",
      answer:
        "Talk about an achievement/learning outside resume that shows soft skills: communication, discipline, leadership, responsibility.",
      difficulty: "easy",
      tags: ["intro"],
    },
    {
      question: "Tell me about your family background.",
      answer:
        "Keep it short and professional; focus on values you learned (discipline, support, independence). Avoid oversharing.",
      difficulty: "easy",
      tags: ["background"],
    },
    {
      question: "How has college life changed you?",
      answer:
        "Mention growth areas: confidence, communication, time management, teamwork, and any projects/internships.",
      difficulty: "easy",
      tags: ["background"],
    },
    {
      question: "Who is your role model?",
      answer:
        "Choose someone whose values/skills you actually follow and relate it to your own behavior (work ethic, learning, integrity).",
      difficulty: "easy",
      tags: ["values"],
    },
    {
      question: "What are your strengths?",
      answer:
        "Pick 1–2 strengths relevant to role and back them with examples/results.",
      difficulty: "easy",
      tags: ["self-awareness"],
    },
    {
      question: "What is your weakness?",
      answer:
        "Pick a real weakness, explain impact, and show what you’re doing to improve (tools, routine, feedback).",
      difficulty: "easy",
      tags: ["self-awareness"],
    },
    {
      question: "Do you like to work in a team or individually?",
      answer:
        "Say you can do both; give examples of teamwork + independent ownership. Mention communication and accountability.",
      difficulty: "easy",
      tags: ["teamwork"],
    },
    {
      question: "Will you lie for the benefit of the company?",
      answer:
        "No. Emphasize integrity and long-term trust. You can say you would communicate issues honestly and propose solutions.",
      difficulty: "medium",
      tags: ["ethics"],
    },
    {
      question: "What will you do if you are not selected?",
      answer:
        "Stay positive: ask feedback, improve weak areas, keep applying, and continue learning. Show resilience.",
      difficulty: "easy",
      tags: ["attitude"],
    },
    {
      question: "How do you spend your day?",
      answer:
        "Share a balanced routine: study/work, practice, health, and consistency. Keep it realistic.",
      difficulty: "easy",
      tags: ["habits"],
    },
    {
      question: "Tell me your daily schedule.",
      answer:
        "Give a structured schedule showing planning + discipline, and mention time for learning and fitness.",
      difficulty: "easy",
      tags: ["habits"],
    },
    {
      question: "Why should we hire you?",
      answer:
        "Connect your skills + projects + attitude to the job requirements. End with how you’ll add value quickly.",
      difficulty: "easy",
      tags: ["closing"],
    },
    {
      question: "Where do you see yourself 5 years from now?",
      answer:
        "Keep it role-aligned: growing into a strong engineer, owning modules, mentoring, and delivering business impact.",
      difficulty: "easy",
      tags: ["career"],
    },
    {
      question: "Are you ready to relocate?",
      answer:
        "If yes: confirm flexibility. If unsure: explain constraints politely and show openness to discuss.",
      difficulty: "easy",
      tags: ["flexibility"],
    },
    {
      question: "Are you ready to sign a bond?",
      answer:
        "Ask for details (duration, amount, conditions). If comfortable, say you’re open; otherwise be honest and professional.",
      difficulty: "medium",
      tags: ["flexibility"],
    },
  ],

  "gd-rounds": [
    {
      question: "What is a Group Discussion (GD) round?",
      answer:
        "GD is a structured discussion where a group talks about a topic. Companies evaluate communication, clarity, teamwork, leadership, listening, and logical thinking.",
      difficulty: "easy",
      tags: ["gd"],
    },
    {
      question: "What do interviewers evaluate in GD?",
      answer:
        "Key signals: content quality (facts + examples), structure, confidence, listening, collaboration (building on others), leadership (summarize/drive), and respect.",
      difficulty: "easy",
      tags: ["gd", "evaluation"],
    },
    {
      question: "How do you start a GD confidently?",
      answer:
        "Start with definition + 1–2 points. Keep it short (20–30 sec). Example: ‘I’ll define the topic, then share two key impacts.’ Don’t dominate.",
      difficulty: "medium",
      tags: ["gd", "opening"],
    },
    {
      question: "How do you handle an aggressive participant?",
      answer:
        "Stay calm, don’t interrupt. Use polite entry: ‘I’d like to add a point’ / ‘Let’s hear everyone’. Bring discussion back to topic.",
      difficulty: "medium",
      tags: ["gd", "conflict"],
    },
    {
      question: "How do you conclude or summarize a GD?",
      answer:
        "Summarize consensus + key arguments, mention any balanced view, and close with 1 actionable insight. This shows leadership and clarity.",
      difficulty: "medium",
      tags: ["gd", "summary"],
    },
    {
      question: "Common GD topics to prepare (examples).",
      answer:
        "Tech: AI in education, data privacy. Business: remote work, gig economy. Social: social media impact, climate change. Practice pros/cons + examples.",
      difficulty: "easy",
      tags: ["gd", "topics"],
    },
  ],
};

router.get("/topics", (req, res) => {
  const topics = Object.keys(QUESTIONS);
  const meta = topics.map((t) => ({
    id: t,
    count: Array.isArray(QUESTIONS[t]) ? QUESTIONS[t].length : 0,
  }));
  return res.json({ topics, meta });
});

router.get("/:topic", (req, res) => {
  const topic = String(req.params.topic || "").toLowerCase();
  const items = QUESTIONS[topic];
  if (!items) {
    return res.status(404).json({ message: "Unknown topic" });
  }
  return res.json({ topic, questions: items });
});

module.exports = router;
