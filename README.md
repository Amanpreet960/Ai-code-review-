# AI Code Review Pro

A stateless multi-language code review app with React, Monaco, Express and OpenAI. No accounts or database are used.

Run `npm install`, `npm run install:all`, then `npm run dev`. Add `OPENAI_API_KEY` to `server/.env` for AI analysis; the API includes a local safety-analysis fallback when it is absent.
