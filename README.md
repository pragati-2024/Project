# Mockneto – AI Mock Interview (Full Stack)

This repository contains a full-stack mock interview platform.

## Folder Structure

- `ai-based-project/` – React + Vite frontend (SPA)
- `Backend/` – Node/Express API + MongoDB + Interview AI
- `legacy-static/` – Old static HTML/CSS/JS version (kept for reference)

## Tech Stack

**Frontend**

- React, Vite, React Router
- Tailwind/CSS (existing UI kept)

**Backend**

- Node.js, Express
- MongoDB, Mongoose
- JWT auth
- Interview AI via Gemini (optional) + fallback

## How It Works (Overall Flow)

1. User opens the SPA (frontend)
2. Frontend talks to backend using `/api/*`
3. Interview flow:
   - `/api/interview/questions` generates placement-style questions (Gemini if configured, fallback otherwise)
   - User answers (typed or voice-to-text)

- `/api/interview/check-answer` returns instant per-question feedback + score + a full sample improved answer
- `/api/interview/feedback` returns score + strengths + improvements + communication tips

4. Question bank flow:
   - `/api/questions/:topic` returns curated questions per topic

## Tracks (Tech vs MBA)

Interview endpoints support a `track` field:

- `track: "tech"` (default): technical / behavioral / system-design
- `track: "mba"`: MBA-style questions only (no DSA/stack/array questions)

### MBA Specialization

When `track` is `"mba"`, you can optionally pass:

- `mbaSpecialization`: `"marketing" | "finance" | "hr" | "operations" | "business-analytics"`

This helps the app generate MBA questions and resources aligned to the specialization.

Example payload for MBA questions:

```json
{
  "track": "mba",
  "mbaSpecialization": "marketing",
  "jobRole": "Management Trainee",
  "level": "Fresher",
  "count": 10
}
```

## Access Control (Login Required)

The following features are now protected and require a valid JWT token:

- Interview Practice (Chat/Video/Voice)
- Question Bank (topics + questions)

If a user is not logged in, the frontend redirects to `/login`.

Backend endpoints for these features return `401` when the token is missing/invalid.

## Run Locally (Dev)

### 1) Backend

- `cd Backend`
- `npm install`
- Copy `.env.example` → `.env` and set values
- Run: `npm run dev`

Backend runs on `http://localhost:5600`

### 2) Frontend

- `cd ai-based-project`
- `npm install`
- Run: `npm run dev`

Frontend runs on `http://localhost:5173` (or next available port)

Vite proxies `/api` → `http://localhost:5600`

## GitHub / Fresh Install Notes

- Do NOT upload `node_modules/` to GitHub (it should be ignored).
- After cloning, run installs again:
  - `cd Backend && npm install`
  - `cd ai-based-project && npm install`

## Environment / Secrets

- Backend uses `.env` for secrets (keep it private, don’t commit).
- Use `Backend/.env.example` as the template.
- Optional AI: set `GEMINI_API_KEY` in backend `.env` (frontend never stores keys).
- Optional model override: `GEMINI_MODEL=gemini-flash-latest`.

If you see a Gemini 404 about `models/<name> is not found`, your model name is outdated; switch `GEMINI_MODEL` to a supported model (e.g. `gemini-flash-latest`) and restart the backend.

## Production

Live deployment:

- Frontend (Vercel): https://project-eta-six-65.vercel.app/
- Backend (Render): https://project-emqa.onrender.com/
  - Health check: https://project-emqa.onrender.com/api/health

Hosting notes:

- Frontend is deployed on **Vercel**.
- Backend API is deployed on **Render**.

- Build frontend: `cd ai-based-project && npm run build`
- Start backend with `NODE_ENV=production`

Backend serves `ai-based-project/dist` automatically in production mode.

## Notes

- Do NOT put Gemini keys in frontend.
- Configure backend `.env` with `GEMINI_API_KEY` to enable real Gemini output.
- `legacy-static/` is optional and not used by the SPA.

## UI Notes

- Social icons are rendered via `react-icons` (Font Awesome CDN is not required).

## Scoring & Feedback Notes

- Very short / keyword-only answers are treated as low-effort and scored strictly (0/10).
- `/api/interview/check-answer` returns `encouragement`, `resources` (links), and `improvedAnswer` (a full sample strong answer).
- `/api/interview/feedback` also returns `score` and may include `encouragement` + `resources`.
