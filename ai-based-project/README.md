# AI Mock Interview (Frontend)

React + Vite frontend for the Mock Interview project.

Live:

- Frontend (Vercel): https://project-eta-six-65.vercel.app/
- Backend API (Render): https://project-emqa.onrender.com/

## Tech Stack

- React
- Vite
- React Router
- Tailwind (via project config)
- Fetch/Axios style API calls (project uses `fetch` for interview routes)

## Setup

1. Install deps:

- `cd ai-based-project`
- `npm install`

2. (Optional) Create `.env` based on `.env.example`

Recommended dev default (no env needed):

- Frontend calls backend via `/api/*` and Vite proxies to `http://localhost:5600`

3. Run:

- `npm run dev`

Vite will start on `http://localhost:5173` (or next free port).

## GitHub / No node_modules

- Don’t push `node_modules/` to GitHub.
- After cloning the repo, run: `cd ai-based-project && npm install`

## Backend Connection

- Dev default: frontend calls `/api/*` and Vite proxies to `http://localhost:5600`
- If you deploy separately, set `VITE_API_BASE_URL` (example in `.env.example`)

## Routes

- `/interviewsetup`
- `/chat-interview`
- `/video-interview`
- `/voice-interview`
- `/question` (Question Bank list)
- `/questions/:topic` (topic questions)

## Login Required (Protected Routes)

These routes require login. If `localStorage.token` is missing, the app redirects to `/login`.

- Interview practice: `/interviewsetup`, `/chat-interview`, `/video-interview`, `/voice-interview`
- Question bank: `/question`, `/questions/:topic`
- App pages: `/dashboard`, `/reports`, `/profile`, `/settings`

When logged in, the frontend sends `Authorization: Bearer <token>` for protected `/api/*` calls.

## Notes

- Do not put API keys in the frontend.
- Gemini key should be configured on the backend as `GEMINI_API_KEY`.
- If Gemini calls fail with a 404 model error, update backend `GEMINI_MODEL` to `gemini-flash-latest` and restart the backend.

## End-to-End Flows

### 1) Start Interview Flow

- Home "Get started" → `/interviewsetup`
- Choose Chat / Video / Voice → navigates to the selected route

### 2) Chat / Video / Voice Interview Flow

- Frontend requests questions from backend:
  - `POST /api/interview/questions`
- Some focus areas (like `Technical`) may return question objects:
  - `{ question, answer, difficulty?, tags?, references?: [{ label, url }] }`
  - UI can show a "Reference Answer" panel and up to 2 GFG search links.
- Candidate answers:
  - Chat/Video: type answers
  - Voice: type or use speech-to-text; questions are also spoken via TTS
  - Voice also supports mic monitoring (hear your voice) + recording + playback
- Frontend requests feedback:
  - `POST /api/interview/feedback`
- Feedback saved in `localStorage` and shown on Dashboard
