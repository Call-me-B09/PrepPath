# PrepPath

PrepPath is a full-stack app with a Node/Express backend and a React Native / Expo frontend. The backend registers routes in `backend/app.js` and boots in `backend/server.js`. 

## Quick start

- Create a `.env` with `MONGO_URI` and `GOOGLE_API_KEY`.
- Backend:
  - npm install
  - npm run start (server connects DB then starts) 
- Frontend:
  - Start the Expo app in `frontend/`; API base URL uses `EXPO_PUBLIC_API_URL`. 

## Repository structure

- backend/: Express app, controllers, routes, models, services (AI, OCR).   
- frontend/: Expo React Native app, contexts, screens, `frontend/services/api.ts`.   
- scripts: `seedUser.js`, `seedMockData.js`, `resetDB.js` for local dev. 

## Architecture notes

- Auth: `mockAuth` middleware injects `uid` from the `x-auth-uid` header for dev. Frontend syncs Clerk auth to backend via `/user/sync`.   
- Roadmap generation: backend accepts PDF uploads, runs OCR, then calls the AI service (Gemini) to produce a JSON roadmap. See `backend/controllers/roadmap.controller.js` and `backend/services/ai.service.js`. fileciteturn1file8fileciteturn1file8  
- Models: `User`, `Roadmap`, `Step`, `SyllabusSection`, `Plan` in `backend/models`. 

## API

- Create Roadmap — POST `/roadmap/create`  
  Accepts `multipart/form-data` with optional `syllabusFile` and `pyqFile`. Handled in `backend/controllers/roadmap.controller.js`. 

- Get Active Roadmap — GET `/roadmap/active`  
  Returns active roadmap and steps. 

- Toggle Step — PATCH `/roadmap/step/:stepId`  
  Toggles completion and updates syllabus counts. 

- Reset Roadmap — DELETE `/roadmap/reset`  
  Deletes roadmap, steps, syllabus, and resets user flags. 

- Dashboard Overview — GET `/dashboard/overview`  
  Returns dashboard summary used by the frontend. 

- User Sync — POST `/user/sync`  
  Upserts frontend-authenticated user into backend. 

## Important files

- `backend/controllers/roadmap.controller.js` — upload handling, OCR, AI prompt, DB save.   
- `backend/services/ai.service.js` — Gemini prompt and JSON parsing.   
- `backend/services/ocr.service.js` — PDF text extraction helper.   
- `frontend/services/api.ts` — client wrappers used by the UI. 

## Dev helpers

Use `seedUser.js`, `seedMockData.js`, and `resetDB.js` for seeding and resetting the local DB during development. 

## Notes

- Ensure `MONGO_URI` and `GOOGLE_API_KEY` are set for DB and AI features. AI uses Gemini via `backend/services/ai.service.js`.****
