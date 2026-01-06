PrepPath — Documentation
A ready-to-copy developer README for the PrepPath repository. It includes setup, structure, architecture notes, and full API endpoint blocks. Files cited are part of the repository.

Project overview
PrepPath is a full-stack app with a Node/Express backend and a React Native / Expo frontend. The backend registers routes in backend/app.js and starts in backend/server.js.

Quick start
Create a .env with MONGO_URI and GOOGLE_API_KEY.
Backend:
npm install
npm run start (server connects DB then starts)
Frontend:
Start the Expo app in frontend/; API base URL uses EXPO_PUBLIC_API_URL.
Repository structure
backend/: Express app, controllers, routes, models, services (AI, OCR).
frontend/: Expo React Native app, contexts, screens, services/api.ts.
scripts: seedUser.js, seedMockData.js, resetDB.js for local dev data management. fileciteturn1file8fileciteturn1file8
Architecture notes
Auth: mockAuth middleware injects uid from x-auth-uid header for dev. Frontend syncs Clerk auth to backend via /user/sync. fileciteturn1file3fileciteturn1file3
Roadmap generation: backend accepts PDFs, runs OCR, then calls AI (Gemini) to produce JSON roadmap. See roadmap controller and AI service. fileciteturn1file2fileciteturn1file2
Models: User, Roadmap, Step, SyllabusSection, Plan; see backend/models.
API — Create Roadmap (POST)
/roadmap/create accepts multipart/form-data with optional PDFs. Route defined in backend/routes/roadmap.routes.js and handled by backend/controllers/roadmap.controller.js. fileciteturn1file8fileciteturn1file8

Create Roadmap
Export to Postman
Create a study roadmap. Accepts multipart/form-data with optional syllabus and pyq PDFs.

POST
http://localhost:5000/roadmap/create
Headers
x-auth-uid
string • header
required
test-firebase-uid-123

Content-Type
string • header
required
multipart/form-data

Request body
Form data parameters for this request.

examName
JEE Advanced
required
days
10
required
hours
required
minutes
required
level
Beginner
required
commitment
2 hours/day
required
syllabusFile
file (application/pdf)
pyqFile
file (application/pdf)
Code examples
curl -X POST "http://localhost:5000/roadmap/create" \
  -H "x-auth-uid: test-firebase-uid-123" \
  -H "Content-Type: multipart/form-data" \
  -d "examName=JEE Advanced\" \
  -d "days=10\" \
  -d "hours=0\" \
  -d "minutes=0\" \
  -d "level=Beginner\" \
  -d "commitment=2 hours/day\" \
  -d "syllabusFile=file (application/pdf)\" \
  -d "pyqFile=file (application/pdf)\"
Responses
200
400
500
Success

{
  "roadmapId": "<id>",
  "planId": "<id>",
  "message": "AI Roadmap created successfully"
}
Bad Request

{ "message": "Missing required fields" }
Server Error

{ "message": "Server Error", "error": "..." }
API — Get Active Roadmap (GET)
/roadmap/active returns the active roadmap and ordered steps. Route and controller implemented in backend.

Get Active Roadmap
Export to Postman
Retrieve the user's active roadmap and ordered steps.

GET
http://localhost:5000/roadmap/active
Headers
x-auth-uid
string • header
required
test-firebase-uid-123

Code examples
curl -X GET "http://localhost:5000/roadmap/active" \
  -H "x-auth-uid: test-firebase-uid-123"
Responses
200
404
Success

{
  "roadmap": { /* roadmap object */ },
  "steps": [ /* ordered steps */ ]
}
No active roadmap

{ "message": "No active roadmap" }
API — Toggle Step (PATCH)
/roadmap/step/:stepId toggles a step's completed state and updates syllabus counts. See roadmap controller.

Toggle Step
Export to Postman
Toggle completion state of a roadmap step by ID.

PATCH
http://localhost:5000/roadmap/step/:stepId
Headers
x-auth-uid
string • header
required
test-firebase-uid-123

Path parameters
stepId
string • path
required
Step ObjectId

Code examples
curl -X PATCH "http://localhost:5000/roadmap/step/:stepId" \
  -H "x-auth-uid: test-firebase-uid-123"
Responses
200
404
Success

{ "message": "Step updated" }
Not found

{ "message": "Step not found" }
API — Reset Roadmap (DELETE)
/roadmap/reset deletes roadmap, steps, syllabus, and resets user flags. See controller deleteRoadmap.

Reset Roadmap
Export to Postman
Delete user's roadmap and related data (reset).

DELETE
http://localhost:5000/roadmap/reset
Headers
x-auth-uid
string • header
required
test-firebase-uid-123

Code examples
curl -X DELETE "http://localhost:5000/roadmap/reset" \
  -H "x-auth-uid: test-firebase-uid-123"
Responses
Success

{ "message": "Roadmap reset" }
API — Dashboard Overview (GET)
/dashboard/overview returns dashboard summary including next steps and syllabus progress. Frontend uses services/api.ts to call this endpoint. fileciteturn1file2fileciteturn1file2

Dashboard Overview
Export to Postman
Fetch dashboard summary including next steps and syllabus progress.

GET
http://localhost:5000/dashboard/overview
Headers
x-auth-uid
string • header
required
test-firebase-uid-123

Code examples
curl -X GET "http://localhost:5000/dashboard/overview" \
  -H "x-auth-uid: test-firebase-uid-123"
Responses
Success

{
  "hasRoadmap": true|false,
  "examName": "",
  "examDate": "",
  "examTimeLeftDays": 0,
  "tasks": [],
  "syllabus": [],
  "userProfile": { "name": "...", "email": "..." }
}
API — User Sync (POST)
/user/sync upserts a user from frontend auth. See backend/controllers/user.controller.js and frontend AuthContext syncing. fileciteturn1file3fileciteturn1file3

Sync User
Export to Postman
Create or update user in backend using frontend auth details.

POST
http://localhost:5000/user/sync
Headers
Content-Type
string • header
required
application/json

Request body
JSON payload required for this request.

{
  "uid": "clerk-or-mock-uid",
  "email": "user@example.com",
  "name": "User Name",
  "photoURL": "https://..."
}
Code examples
curl -X POST "http://localhost:5000/user/sync" \
  -H "Content-Type: application/json" \
  -H "Content-Type: application/json" \
  -d '{
  \"uid\": \"clerk-or-mock-uid\",
  \"email\": \"user@example.com\",
  \"name\": \"User Name\",
  \"photoURL\": \"https://...\"
}'
Responses
Success

{ "message": "User synced" }
Important files
backend/controllers/roadmap.controller.js — upload, OCR, AI prompt, DB save.
backend/services/ai.service.js — Gemini prompt and JSON parsing.
backend/services/ocr.service.js — PDF text extraction helper.
frontend/services/api.ts — client wrapper used by UI.
Dev helpers
seedUser.js, seedMockData.js, resetDB.js for seeding and resetting local DB. Use them during development. fileciteturn1file8fileciteturn1file8
If you want this saved as README.md in the repo, or want per-file docs or a Mermaid architecture diagram, tell me which format to generate next.
