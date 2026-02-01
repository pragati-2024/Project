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
   - `/api/interview/feedback` returns score + strengths + improvements + communication tips
4. Question bank flow:
   - `/api/questions/:topic` returns curated questions per topic

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

## Production

- Build frontend: `cd ai-based-project && npm run build`
- Start backend with `NODE_ENV=production`

Backend serves `ai-based-project/dist` automatically in production mode.

## Notes

- Do NOT put Gemini keys in frontend.
- Configure backend `.env` with `GEMINI_API_KEY` to enable real Gemini output.
- `legacy-static/` is optional and not used by the SPA.

## UI Notes

- Social icons are rendered via `react-icons` (Font Awesome CDN is not required).
