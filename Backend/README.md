# Backend (Express API)

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Auth (login/register)
- CORS + dotenv
- Gemini (optional) for interview AI via `GEMINI_API_KEY` with safe fallback

## Setup

1. Install deps:

- `cd Backend`
- `npm install`

2. Create `.env` (copy from `.env.example`) and fill values.

Required / recommended:

- `PORT=5600`
- `MONGODB_URI=mongodb://127.0.0.1:27017/moketonDB` (or your Atlas URI)
- `JWT_SECRET=...`
- `FRONTEND_ORIGIN=http://localhost:5173,http://localhost:5174` (optional)
- `GEMINI_API_KEY=...` (optional; if missing, server uses fallback logic)
- `GEMINI_MODEL=gemini-flash-latest` (optional; recommended if you override models)

3. Run:

- Dev: `npm run dev`
- Prod: `npm start`

## API

- `GET /api/health`
- Users: `/api/users/*`
- Interview (AI):
  - `POST /api/interview/questions`
  - `POST /api/interview/check-answer`
  - `POST /api/interview/feedback`
- Question bank:
  - `GET /api/questions/topics`
  - `GET /api/questions/:topic`

## Auth (JWT)

Login/register returns a JWT token. Protected endpoints require:

- Header: `Authorization: Bearer <token>`

Currently protected:

- Interview practice: `POST /api/interview/questions`, `POST /api/interview/check-answer`, `POST /api/interview/feedback`
- Question bank: `GET /api/questions/topics`, `GET /api/questions/:topic`

## Production

If you build the frontend at `ai-based-project/dist`, the backend will serve it automatically when:

- `NODE_ENV=production`

## End-to-End Flows

### 1) Auth Flow

- Frontend calls `/api/users/*` (register/login)
- Backend validates + returns JWT
- Frontend stores token and uses it for protected routes (where implemented)

### 2) Interview AI Flow

- Frontend calls `POST /api/interview/questions` with `{ jobRole, level, focusArea, company?, count? }`
- Backend generates questions:
  - Gemini if `GEMINI_API_KEY` configured
  - Fallback generator if Gemini not available/fails

For `focusArea: "Technical"`, questions may be returned as objects with answers and reference links:

- `{ question, answer, difficulty?, tags?, references?: [{ label, url }] }`

These references are typically GFG search URLs (1–2 options).

- Frontend collects answers (typed or speech-to-text)
- Frontend calls `POST /api/interview/feedback` with `{ questions, answers, ...context }`
- Backend returns placement-oriented feedback + score + tips

### 3) Question Bank Flow

- Frontend opens `/questions/:topic`
- Calls `GET /api/questions/:topic` to fetch curated Q&A (each item includes `question` and `answer`)

Note: these endpoints return `401` if the JWT token is missing/invalid.

## Troubleshooting (Gemini)

- If you see: `Gemini API 404: models/<name> is not found...`, your `GEMINI_MODEL` is not supported for the current API.
- Fix: set `GEMINI_MODEL=gemini-flash-latest` (or another model returned by the ListModels API) and restart the backend.
