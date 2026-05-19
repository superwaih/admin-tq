# Web App

Role-based web client for student, counselor, and parent experiences.

Current state:
- minimal Next.js runtime scaffold
- Docker-first local execution
- no feature routes or authentication yet

Authentication routing:
- canonical auth landing is `/auth/*`
- legacy `/login` route is redirected to `/auth`
- removed duplicate `app/(auth)` auth subtree to avoid split-login flows

Technical debt:
- shared UI components currently contain sample identity placeholders and should be updated with real auth session data before Sprint 2 integration.
