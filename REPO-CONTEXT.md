# REPO-CONTEXT — TTGCollector

## Purpose
Full-stack application for pulling, saving, recalling, and editing information about a personal board game collection.

## Tech stack
- Frontend (`client/`): React, Vite, Bootstrap, react-select
- Backend (`server/`): Node.js, Express, Sequelize ORM, PostgreSQL, Express Session
- External data: BoardGameGeek (via backend routes)

## Run / build / test
- `npm run dev` — run server + client together (concurrently)
- `npm run build` — build the client
- `npm run seed` — seed the database
- `npm start` — start the server
- `npm run install` — install client + server dependencies
- No automated tests yet (`server`'s `npm test` is a stub).

## Deployment
Deployed via GitHub Actions (`.github/workflows/deploy.yml`) using repository secrets: `SERVER_HOST`, `SERVER_USER`, `SERVER_PORT`, `SERVER_PATH`, `SSH_PRIVATE_KEY`, `SERVER_KNOWN_HOSTS`.

## Relationships
- Showcased in the `portfolio` site.
- One of the four active repos in the multi-repo workspace (see the matching `.code-workspace` file).
