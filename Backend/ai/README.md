# AI Module (Gemini + Fallback)

This folder keeps all AI-related logic on the server side (so API keys are never exposed to the client).

## Files

- `prompts.js`: prompt builders (questions + feedback)
- `gemini.js`: Gemini HTTP client using `GEMINI_API_KEY`
- `fallback.js`: safe fallback question generation + heuristic evaluation

## Env

- `GEMINI_API_KEY`: optional (recommended for best results)
- `GEMINI_MODEL`: optional (defaults to `gemini-flash-latest` in code)

## Endpoints

- `POST /api/interview/questions`
  - body: `{ company?, jobRole, level, focusArea, count? }`
  - returns: `{ questions: (string | { question: string, answer?: string, references?: { label: string, url: string }[] })[] }`

- `POST /api/interview/feedback`
  - body: `{ company?, jobRole, level, focusArea, questions: string[], answers: string[] }`
  - returns: `{ feedback: string }`

## Common Issue

If Gemini returns a 404 like: `models/<name> is not found...`, update `GEMINI_MODEL` to a supported value (example: `gemini-flash-latest`) and restart the backend.
