const express = require("express");
const router = express.Router();
const { requireAuth } = require("../Middleware/auth");

router.use(requireAuth);

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
    {
      question:
        "Does Express have a default port? What port do people commonly use?",
      answer:
        "Express itself does not have a fixed default port. You choose the port in `app.listen(...)`. By convention many apps run on 3000 in local development, but any free port works.\n\nExample:\n```js\nconst express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => res.send('Hello'));\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => console.log('Server on', PORT));\n```",
      difficulty: "easy",
      tags: ["basics"],
    },
    {
      question: "What is routing in Express?",
      answer:
        "Routing is how your app maps an HTTP method + path to a handler. Example: `app.get('/home', ...)` handles GET requests for `/home`. Routers (`express.Router()`) help you split routes into modules.",
      difficulty: "easy",
      tags: ["routing"],
    },
    {
      question: "What does `next()` do in middleware?",
      answer:
        "`next()` passes control to the next middleware/handler in the chain. If you don’t call `next()` (and you also don’t send a response), the request will hang.\n\nPatterns:\n- `return res.status(...).json(...)` to finish the request.\n- `return next()` to continue.\n- `return next(err)` to send to error middleware.",
      difficulty: "easy",
      tags: ["middleware"],
    },
    {
      question: "Difference between `app.use()` and `app.get()`?",
      answer:
        "`app.use()` mounts middleware for *all* HTTP methods (optionally under a path prefix). `app.get()` registers a handler for only GET requests to a specific path.\n\nExample:\n```js\napp.use('/api', authMiddleware);\napp.get('/api/health', (req, res) => res.json({ ok: true }));\n```",
      difficulty: "easy",
      tags: ["basics", "middleware", "routing"],
    },
    {
      question: "Difference between Node.js and Express.js?",
      answer:
        "Node.js is the runtime that executes JavaScript on the server. Express is a web framework on top of Node that gives you routing and middleware patterns to build APIs faster.\n\nYou *can* build an HTTP server with only Node, but Express makes common tasks (routing, middleware composition) much easier.",
      difficulty: "easy",
      tags: ["basics"],
    },
    {
      question: "List some key features of Express.js.",
      answer:
        "Common Express features: routing, middleware pipeline, request/response helpers, static file serving (`express.static`), error-handling middleware, and an ecosystem of third-party middleware (helmet, cors, morgan, etc.).",
      difficulty: "easy",
      tags: ["framework"],
    },
    {
      question: "What are popular alternatives to Express.js?",
      answer:
        "Popular alternatives include Koa, Fastify, Hapi, NestJS (framework on top of Express/Fastify), and Sails. In interviews, mention trade-offs like performance, DX, and ecosystem.",
      difficulty: "easy",
      tags: ["framework"],
    },
    {
      question:
        "Which tools/libraries are commonly integrated with Express apps?",
      answer:
        "Common integrations: databases (MongoDB/Mongoose, PostgreSQL/Prisma), auth (Passport, JWT libraries), validation (Zod/Joi/express-validator), logging (morgan/winston), security (helmet, rate limiting), templating (EJS/Pug) and API docs (Swagger/OpenAPI).",
      difficulty: "easy",
      tags: ["ecosystem"],
    },
    {
      question: "What is a `.env` file used for in Node/Express projects?",
      answer:
        "`.env` stores environment variables (secrets + config) outside code, like DB URLs, API keys, and JWT secrets. You load it with `dotenv` and read via `process.env`.\n\nImportant: never commit real secrets to git.",
      difficulty: "easy",
      tags: ["config", "security"],
    },
    {
      question: "What is JWT and how is it used in Express authentication?",
      answer:
        "JWT (JSON Web Token) is a signed token that carries claims (like user id) and expiry. Typical flow: user logs in → server issues JWT → client sends it in `Authorization: Bearer <token>` → middleware verifies signature + expiry and authorizes requests.\n\nBest practice: keep token expiry reasonable, verify on every protected request, and avoid putting sensitive data in the payload.",
      difficulty: "medium",
      tags: ["auth"],
    },
    {
      question:
        "Write a simple Express middleware to validate a user/auth token.",
      answer:
        "Example pattern (assumes a token was decoded earlier or you decode inside this middleware):\n```js\nfunction requireUser(req, res, next) {\n  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });\n  return next();\n}\n\napp.get('/profile', requireUser, (req, res) => {\n  res.json({ user: req.user });\n});\n```",
      difficulty: "easy",
      tags: ["middleware", "auth"],
    },
    {
      question: "What is bcrypt used for?",
      answer:
        "bcrypt hashes passwords securely. It’s intentionally slow and includes a salt to resist brute-force and rainbow table attacks. Store only the bcrypt hash in the database; never store plain passwords.",
      difficulty: "easy",
      tags: ["security", "auth"],
    },
    {
      question: "Why separate the Express app and the server (listen) code?",
      answer:
        "Separating `app` creation from `server.listen` improves testability and modularity. You can import the Express `app` in tests without starting a real server, and you can reuse the same app in different deployment setups.",
      difficulty: "medium",
      tags: ["architecture", "testing"],
    },
    {
      question: "What is ESLint and why is it used in Express/Node projects?",
      answer:
        "ESLint is a linting tool that detects problematic patterns and enforces consistent style. It reduces bugs (unused vars, unsafe patterns) and keeps a codebase consistent across a team.",
      difficulty: "easy",
      tags: ["tooling"],
    },
    {
      question: "Explain the test pyramid (unit vs integration vs E2E).",
      answer:
        "Test pyramid suggests: lots of fast unit tests at the bottom, fewer integration tests in the middle, and the fewest slow end-to-end tests at the top. This gives confidence while keeping the suite fast and maintainable.",
      difficulty: "medium",
      tags: ["testing"],
    },
    {
      question: "Difference between `res.send()` and `res.json()`?",
      answer:
        "`res.send()` can send many types (string/Buffer/object). If you pass an object it will serialize as JSON, but `res.json()` is the explicit API for JSON responses and sets JSON-related headers. For APIs, `res.json(...)` is usually clearer.",
      difficulty: "easy",
      tags: ["responses"],
    },
    {
      question: "What is scaffolding in Express?",
      answer:
        "Scaffolding is generating a starter project structure automatically (folders, boilerplate routes, configs). It saves setup time and keeps structure consistent.",
      difficulty: "easy",
      tags: ["tooling"],
    },
    {
      question: "How to generate an Express skeleton app from terminal?",
      answer:
        "You can use `express-generator`:\n```bash\nnpm install -g express-generator\nexpress my-app\ncd my-app\nnpm install\nnpm start\n```",
      difficulty: "easy",
      tags: ["tooling"],
    },
    {
      question: "What is Yeoman and how is it used for scaffolding?",
      answer:
        "Yeoman is a scaffolding tool that runs generators to create project structures. You install `yo` and a generator package, then run `yo` to generate a project. It’s a general scaffolding ecosystem (not only Express).",
      difficulty: "easy",
      tags: ["tooling"],
    },
    {
      question: "What is CORS and why do Express apps need it?",
      answer:
        "CORS (Cross-Origin Resource Sharing) is a browser security policy that controls which origins can call your API. If your frontend and backend are on different origins, you must allow the frontend origin via CORS headers (often via the `cors` middleware).",
      difficulty: "medium",
      tags: ["security"],
    },
    {
      question: "What are built-in middlewares in Express?",
      answer:
        "Common built-in middleware in Express includes: `express.json()` (parse JSON), `express.urlencoded()` (parse form data), and `express.static()` (serve static files). Express also provides `express.Router()` for modular routing.",
      difficulty: "easy",
      tags: ["middleware"],
    },
    {
      question: "How do you set configuration/properties in Express?",
      answer:
        "Use `app.set(key, value)` and `app.get(key)` to read it back. Example: `app.set('trust proxy', 1)` or `app.set('view engine', 'pug')`.",
      difficulty: "easy",
      tags: ["config"],
    },
    {
      question: "Which template engines can Express use?",
      answer:
        "Express can work with many template engines (EJS, Pug, Handlebars, etc.) as long as they follow the expected render function interface. You typically set one with `app.set('view engine', 'pug')`.",
      difficulty: "easy",
      tags: ["templating"],
    },
    {
      question: "How do you debug an Express app on Windows/Linux?",
      answer:
        "Common approaches: `console.log`, Node inspector (`node --inspect`), VS Code debugger (launch config), and the `debug` npm package for scoped logs. For production issues, rely on structured logs + request IDs + error tracking.",
      difficulty: "medium",
      tags: ["debugging"],
    },
    {
      question: "How do you render plain HTML in Express?",
      answer:
        "Simplest: `res.send('<html>...</html>')` for small responses, or `res.sendFile(...)` to serve an HTML file. For larger apps you typically use a template engine or serve a frontend build.\n\nExample:\n```js\napp.get('/', (req, res) => {\n  res.send('<html><body><h1>Hello</h1></body></html>');\n});\n```",
      difficulty: "easy",
      tags: ["responses"],
    },
    {
      question: "What does `res.cookie()` do?",
      answer:
        "`res.cookie(name, value, options)` sets an HTTP cookie on the response. It’s commonly used for session identifiers or refresh tokens. Use secure flags in production: `httpOnly`, `secure`, and `sameSite`.",
      difficulty: "medium",
      tags: ["security"],
    },
    {
      question: "Why can a CORS request fail?",
      answer:
        "Typical reasons: missing CORS headers, origin not allowed, method/headers not allowed, failing preflight OPTIONS, or using credentials with wildcard origins. Always check preflight in the browser network tab.",
      difficulty: "medium",
      tags: ["security"],
    },
    {
      question:
        "What is input sanitization in Express and why is it important?",
      answer:
        "Sanitization removes/neutralizes dangerous input to prevent attacks like XSS and injection. You typically validate & sanitize request body/query/params, and you also use parameterized queries for databases. Never trust client input.",
      difficulty: "medium",
      tags: ["security"],
    },
    {
      question: "How do you secure an Express app (high level checklist)?",
      answer:
        "Use HTTPS, set security headers (helmet), validate inputs, sanitize, rate limit, secure CORS, keep dependencies updated, store secrets in env, use proper auth, and avoid leaking stack traces in responses. Add logging + monitoring.",
      difficulty: "medium",
      tags: ["security"],
    },
    {
      question: "What are the types of middleware in Express?",
      answer:
        "Common categories: application-level middleware (`app.use`), router-level middleware (`router.use`), error-handling middleware (`(err, req, res, next)`), built-in middleware (`express.json`, `express.static`, ...), and third-party middleware (cors, helmet, morgan, ...).",
      difficulty: "easy",
      tags: ["middleware"],
    },
    {
      question: "What is `express.Router()` used for?",
      answer:
        "`express.Router()` creates a mini-router you can mount under a path prefix. It helps you organize routes by feature/module and apply middleware to only a subset of routes.",
      difficulty: "easy",
      tags: ["routing"],
    },
    {
      question: "What are common HTTP methods used in APIs?",
      answer:
        "Most common methods: GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove). In interviews, mention idempotency: GET/PUT/DELETE are typically idempotent; POST usually isn’t.",
      difficulty: "easy",
      tags: ["http"],
    },
    {
      question: "What arguments are available in an Express route handler?",
      answer:
        "Route handlers typically receive `(req, res, next)`. `req` holds request data, `res` is used to send the response, and `next` passes control to the next middleware (or error handler).",
      difficulty: "easy",
      tags: ["basics"],
    },
    {
      question: "How does error handling work in Express?",
      answer:
        "You forward errors with `next(err)` (or throw inside an async wrapper) and handle them in a centralized error middleware: `(err, req, res, next)`. This keeps error formatting, logging, and status codes consistent.",
      difficulty: "medium",
      tags: ["errors"],
    },
    {
      question: "`app.route()` vs `app.use()` — what’s the difference?",
      answer:
        "`app.route('/path')` groups multiple HTTP methods for the *same* path (GET/POST/PUT...). `app.use()` mounts middleware or a router for a path prefix (and can affect many routes and methods).",
      difficulty: "medium",
      tags: ["routing"],
    },
    {
      question: "What is dynamic routing (route params) in Express?",
      answer:
        "Dynamic routes use parameters like `/users/:id`. The value is available via `req.params.id`.\n\nExample:\n```js\napp.get('/users/:userId', (req, res) => {\n  res.send('User ' + req.params.userId);\n});\n```",
      difficulty: "easy",
      tags: ["routing"],
    },
    {
      question: "How do you serve static files in Express?",
      answer:
        "Use `express.static` to expose a folder.\n\nExample:\n```js\napp.use('/public', express.static('public'));\n```",
      difficulty: "easy",
      tags: ["static"],
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

  "dsa-java": [
    {
      question: "Explain what a linked list is and implement it in Java.",
      answer:
        "A linked list is a linear structure made of nodes. Each node stores data plus a reference to the next node. It grows dynamically but has O(n) access by index because traversal is needed.\n\nBasic singly linked list (append + insertAtHead):\n```java\npublic class SinglyLinkedList {\n  static class Node {\n    int data;\n    Node next;\n    Node(int data) { this.data = data; }\n  }\n\n  private Node head;\n\n  public void insertAtHead(int data) {\n    Node n = new Node(data);\n    n.next = head;\n    head = n;\n  }\n\n  public void append(int data) {\n    Node n = new Node(data);\n    if (head == null) { head = n; return; }\n    Node cur = head;\n    while (cur.next != null) cur = cur.next;\n    cur.next = n;\n  }\n}\n```",
      difficulty: "easy",
      tags: ["linked-list", "implementation"],
    },
    {
      question: "Explain the difference between an array and a linked list.",
      answer:
        "Array: contiguous memory and O(1) random access by index, but insert/delete in the middle is O(n) due to shifting. Java arrays are fixed-size.\n\nLinked list: nodes are not contiguous; access by index is O(n) (traversal), but insert/delete at head or after a known node is O(1).",
      difficulty: "easy",
      tags: ["arrays", "linked-list"],
    },
    {
      question: "What is a stack and how does it work?",
      answer:
        "A stack follows LIFO (Last In, First Out). Operations: push (add), pop (remove), peek (top). Common uses: call stack, undo, backtracking, expression evaluation.",
      difficulty: "easy",
      tags: ["stack"],
    },
    {
      question: "Implement a stack using an array in Java.",
      answer:
        '```java\npublic class IntStack {\n  private final int[] a;\n  private int top = -1;\n\n  public IntStack(int capacity) {\n    a = new int[capacity];\n  }\n\n  public void push(int x) {\n    if (top == a.length - 1) throw new IllegalStateException("Stack overflow");\n    a[++top] = x;\n  }\n\n  public int pop() {\n    if (top == -1) throw new IllegalStateException("Stack underflow");\n    return a[top--];\n  }\n\n  public int peek() {\n    if (top == -1) throw new IllegalStateException("Empty stack");\n    return a[top];\n  }\n}\n```',
      difficulty: "easy",
      tags: ["stack", "implementation"],
    },
    {
      question: "What is recursion? Give a Java example.",
      answer:
        "Recursion is when a function calls itself to solve smaller subproblems until a base case. Ensure: (1) base case, (2) progress toward it.\n\nExample (factorial):\n```java\npublic class Factorial {\n  static long fact(int n) {\n    if (n < 0) throw new IllegalArgumentException();\n    if (n == 0) return 1;\n    return n * fact(n - 1);\n  }\n}\n```",
      difficulty: "easy",
      tags: ["recursion"],
    },
    {
      question: "What are time complexity and space complexity?",
      answer:
        "Time complexity estimates how runtime grows with input size n (Big-O). Space complexity estimates extra memory usage. In interviews, mention worst-case/average-case and amortized costs when relevant.",
      difficulty: "easy",
      tags: ["complexity"],
    },
    {
      question: "What is a Binary Search Tree (BST) and how does it work?",
      answer:
        "A BST is a binary tree with ordering: left subtree < node < right subtree. Search/insert/delete take O(h) where h is height (O(log n) if balanced, O(n) worst-case if skewed).",
      difficulty: "medium",
      tags: ["tree", "bst"],
    },
    {
      question: "BFS vs DFS: what’s the difference?",
      answer:
        "BFS explores level-by-level using a queue (good for shortest path in unweighted graphs). DFS explores depth-first using recursion/stack (good for cycle detection, components, topological ordering). Both are O(V+E) with adjacency lists.",
      difficulty: "easy",
      tags: ["graph"],
    },
    {
      question: "Write Java code to perform BFS on a graph (adjacency list).",
      answer:
        "```java\nimport java.util.*;\n\npublic class GraphBFS {\n  private final List<List<Integer>> adj;\n\n  public GraphBFS(int n) {\n    adj = new ArrayList<>(n);\n    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n  }\n\n  public void addEdge(int u, int v) {\n    adj.get(u).add(v);\n  }\n\n  public List<Integer> bfs(int start) {\n    boolean[] vis = new boolean[adj.size()];\n    Queue<Integer> q = new ArrayDeque<>();\n    List<Integer> order = new ArrayList<>();\n\n    vis[start] = true;\n    q.add(start);\n\n    while (!q.isEmpty()) {\n      int u = q.poll();\n      order.add(u);\n      for (int v : adj.get(u)) {\n        if (!vis[v]) {\n          vis[v] = true;\n          q.add(v);\n        }\n      }\n    }\n    return order;\n  }\n}\n```",
      difficulty: "medium",
      tags: ["graph", "bfs", "implementation"],
    },
    {
      question: "What is a hash table and how does it work?",
      answer:
        "A hash table stores key-value pairs. A hash function maps a key to an array index (bucket). Average-case operations are O(1). Collisions are handled via chaining (list per bucket) or open addressing.",
      difficulty: "medium",
      tags: ["hashing"],
    },
    {
      question: "What is a priority queue (heap)? How do you use it in Java?",
      answer:
        "A priority queue returns the element with highest/lowest priority first. Java’s `PriorityQueue` is a min-heap by default. Common uses: Dijkstra, scheduling, k-th element problems.\n\nExample:\n```java\nimport java.util.*;\n\nPriorityQueue<Integer> min = new PriorityQueue<>();\nmin.add(3); min.add(1); min.add(2);\nSystem.out.println(min.poll()); // 1\n```",
      difficulty: "easy",
      tags: ["heap", "priority-queue"],
    },
    {
      question: "What is dynamic programming?",
      answer:
        "Dynamic programming (DP) solves problems with overlapping subproblems by storing results of subproblems (memoization/tabulation). Interview steps: define state, transitions, base cases, and final answer.",
      difficulty: "medium",
      tags: ["dp"],
    },
    {
      question: "What is a trie and where is it commonly used?",
      answer:
        "A trie (prefix tree) stores strings character-by-character along paths. It supports fast prefix queries in O(L) where L is the word length. Used for autocomplete, dictionary search, and spell-check.",
      difficulty: "medium",
      tags: ["trie"],
    },
    {
      question: "What is divide and conquer? Give a classic example.",
      answer:
        "Divide and conquer splits a problem into smaller independent parts, solves them recursively, then combines results. Classic example: merge sort (time O(n log n), space O(n)).",
      difficulty: "easy",
      tags: ["divide-and-conquer"],
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
// Allow other routes (e.g., interview simulation) to reuse the same curated bank.
module.exports.QUESTIONS = QUESTIONS;
