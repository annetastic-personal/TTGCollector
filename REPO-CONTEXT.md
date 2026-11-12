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
- `npm test` — run the Jest tests (fresh `ttgcollector_test` DB each run via global setup; needs local PostgreSQL)

## Style / test conventions
- Use the nearest sibling test as the template — match its assignment style, `.send()`, naming, and assertions exactly.
- Assign the helper's whole return to one named variable when you need more than one of its fields (e.g. `const existingAccount = await makeLoggedInUser();` → `existingAccount.user.email`, `existingAccount.password`); destructure when you only need a single nested object (e.g. `const { user: existingUser } = await makeLoggedInUser();`).
- `.send({ ... })` — one field per line, trailing comma.
- Test names read "returns `<code>` with `<what>`".
- Assert the `message` field when the endpoint returns one.

## Deployment
Deployed via GitHub Actions (`.github/workflows/deploy.yml`) using repository secrets: `SERVER_HOST`, `SERVER_USER`, `SERVER_PORT`, `SERVER_PATH`, `SSH_PRIVATE_KEY`, `SERVER_KNOWN_HOSTS`.

## Relationships
- Showcased in the `portfolio` site.
- One of the four active repos in the multi-repo workspace (see the matching `.code-workspace` file).
