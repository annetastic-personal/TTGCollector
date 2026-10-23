# Full Codebase Refactor Plan

Created: 2026-10-23

This is the master plan for issue #8 ("Full codebase refactor analysis"). It lays out
everything we plan to do, in order, before we create any GitHub issues.

## Purpose

This document is the implementation plan for issue #8, a full refactor of the TTGCollector
codebase. A refactor restructures existing code to improve its structure, readability, and
maintainability without changing its external behavior.

The application works today, but it has accumulated technical debt that makes it harder to
extend and riskier to change:

- Business logic is concentrated in route handlers rather than a dedicated layer.
- The authentication check is duplicated across routes instead of centralized.
- Error handling is inconsistent.
- The database schema is defined in two places that have drifted apart.
- There is no automated test coverage.

The plan addresses these in two phases, in a deliberate order: add tests, then reorganize the
code. The bug fixes uncovered during analysis are tracked as separate issues, done after the
reorganization lands. Behavior is intended to stay unchanged throughout the two phases; the
tests added in the first phase are what make that a safe promise.

## Structure and workflow

- **Epic:** issue #8 is the umbrella for the refactor.
- **Stories:** the two phases are Story-type sub-issues of #8 (Add tests, Reorganize the code).
- **Task issues:** every item in a phase is its own Task-type issue, nested under its story.
- **Bug issues:** the bug fixes are standalone Bug-type issues, tracked outside #8 (and linked to the existing bug reports where they apply).
- **Branch per issue:** each task is worked on in a dedicated branch, tied to its issue by number. Branch names use the form `<issue-number>-<short-slug>` (for example, `9-add-test-harness`); the slug is listed under each issue and the number is added when the issue is created.
- **Implementation checklist:** each issue carries a checklist of the concrete steps to finish it.

## The big picture

The umbrella issue is **#8 — Full codebase refactor analysis**. We work in this order, and here is why:

```
#8  Full codebase refactor  (Epic)
│
├── Add tests            (Story — 7 tasks)
└── Reorganize the code  (Story — 10 tasks)

Standalone bug fixes (Bug, outside #8):
├── Allow games that are missing details   (closes #2)
├── Save new categories/mechanics by hand  (closes #3)
└── Friendly BoardGameGeek error message
```

**Tests first** means we record how the app behaves *right now*. Then when we reorganize,
the tests immediately tell us if we accidentally changed anything. The bug fixes come last,
on clean, tested code.

---

## Phase 1 — Add tests (Story)

Write tests that capture how the app behaves today, so future changes are safe. Each item
below is a Task-type issue.

### Issue: Set up a safe way to run tests
**Branch:** `add-test-harness`

*Summary:* a disposable test database and the tooling to run tests, so tests never touch real data.

**Implementation checklist:**
- [ ] Add a test framework (Jest) and Supertest to the server.
- [ ] Create a dedicated test database plus a config that points at it during tests.
- [ ] Add a `npm test` script to the server.
- [ ] Add one example test that boots the app and hits an endpoint, proving the harness works.
- [ ] Reset the test database before each run.

### Issue: Tests for accounts
**Branch:** `auth-tests`

*Summary:* cover account creation, login, logout, session restore, wrong passwords, and duplicate accounts.

**Implementation checklist:**
- [ ] Signup succeeds and returns the user (without the password).
- [ ] Signup rejects missing fields and duplicate email or username.
- [ ] Login succeeds with email and with username; a wrong password is rejected.
- [ ] Logout clears the session.
- [ ] Session restore returns the user when logged in and 401 when not.

### Issue: Tests for the game collection
**Branch:** `collection-tests`

*Summary:* cover adding games, duplicates, and user isolation (one person never sees another's games).

**Implementation checklist:**
- [ ] Adding a game returns it and links it to the logged-in user.
- [ ] Adding a duplicate game returns a clear response instead of crashing.
- [ ] The games list returns only the current user's games.
- [ ] Unauthenticated requests to collection routes are rejected with 401.

### Issue: Tests for BoardGameGeek
**Branch:** `bgg-tests`

*Summary:* cover BoardGameGeek being down, slow, or returning missing or odd data.

**Implementation checklist:**
- [ ] A mocked BGG failure produces a friendly error instead of a crash.
- [ ] Missing or malformed BGG data is handled gracefully.
- [ ] The BGG-to-game mapping is verified against a sample payload.

### Issue: Tests for the visible screens
**Branch:** `client-tests`

*Summary:* cover the game list, login screen, search, and add-game form.

**Implementation checklist:**
- [ ] The game list renders a card for each game.
- [ ] The login screen shows an error for bad credentials.
- [ ] The search flow populates the add-game form.
- [ ] The add-game form submits and triggers a refresh.

### Issue: One full walkthrough test
**Branch:** `e2e-smoke-test`

*Summary:* one end-to-end test that mimics a real person using the whole app.

**Implementation checklist:**
- [ ] Sign in.
- [ ] Add a game.
- [ ] See the game in the collection.
- [ ] Log out.

### Issue: Make tests run automatically before deploying
**Branch:** `ci-test-gate`

*Summary:* block a deploy when tests fail.

**Implementation checklist:**
- [ ] Add a CI step that installs dependencies and runs the tests.
- [ ] Require tests to pass before the deploy step runs.
- [ ] Add a lint step alongside the tests.

---

## Phase 2 — Reorganize the code (Story)

Tidy the messy files into smaller, clearly-named pieces. No behavior changes — the tests
from Phase 1 confirm this. Each item below is a Task-type issue.

### Issue: Split the server's one big file into small files
**Branch:** `split-server-routes`

*Summary:* break the 247-line "junk drawer" file into small files that each do one job.

**Implementation checklist:**
- [ ] Move the add-game, categories, mechanics, and games-list handlers into separate route files.
- [ ] Move the add-game business logic into a controller or service function.
- [ ] Keep route files thin (parse the request, call the logic, send the response).
- [ ] Confirm the Phase 1 tests still pass after the split.

### Issue: Write the "am I logged in?" check once and reuse it
**Branch:** `auth-middleware`

*Summary:* one place for the login check instead of three copies, applied before any work happens.

**Implementation checklist:**
- [ ] Add an authentication middleware that checks the session.
- [ ] Apply it to the routes that require login (add-game and games list).
- [ ] Make the add-game route reject unauthenticated requests before touching the database.
- [ ] Remove the copy-pasted inline checks.

### Issue: Set up one consistent way to report errors
**Branch:** `central-error-handling`

*Summary:* all error messages come from one place and look the same.

**Implementation checklist:**
- [ ] Add a central error-handling middleware.
- [ ] Standardize the error response shape across all routes.
- [ ] Update routes to use it instead of ad-hoc try/catch and 500 responses.

### Issue: Untangle the BoardGameGeek lookup code
**Branch:** `refactor-bgg`

*Summary:* simplify the BGG search so it's readable and asks for only what it needs.

**Implementation checklist:**
- [ ] Replace the nested XML callbacks with async/await.
- [ ] Move BGG-specific parsing into its own helper module.
- [ ] Paginate on the BGG side instead of fetching everything and slicing.

### Issue: Decide on one single "blueprint" for the database
**Branch:** `single-schema-source`

*Summary:* keep the list of tables and columns in exactly one place, and fix the drifted copy.

**Implementation checklist:**
- [ ] Choose the source of truth (Sequelize models, or proper migrations).
- [ ] Fix or remove the broken `schema.sql` (the trailing comma and the drifted columns).
- [ ] Reconcile `name` uniqueness and field nullability between the model and the schema.
- [ ] Record the decision in this file.

### Issue: Put all the "talk to the server" code in one place
**Branch:** `client-api-module`

*Summary:* one tidy file for how the app talks to the server, and no copied helpers.

**Implementation checklist:**
- [ ] Create a client API module with one function per endpoint.
- [ ] Replace the scattered fetch calls with those functions.
- [ ] Replace the duplicated `getCategoryName` and `getMechanicName` helpers with one shared version.

### Issue: Split the giant add-game form into smaller pieces
**Branch:** `split-add-game-form`

*Summary:* break the 500-line add-game form into smaller components.

**Implementation checklist:**
- [ ] Extract the search section into its own component.
- [ ] Extract the manual-entry fields into their own component.
- [ ] Extract the selected-game summary into its own component.
- [ ] Extract shared form state into a hook where it reduces duplication.

### Issue: Remove leftover unused code and noisy debug messages
**Branch:** `cleanup-dead-code`

*Summary:* delete dead code and spammy console messages.

**Implementation checklist:**
- [ ] Delete the dead `loading` and `error` branches in the Games component.
- [ ] Remove commented-out `console.log` calls.
- [ ] Remove or quiet the debug logging in the server routes.

### Issue: Remove the default or placeholder login secret
**Branch:** `fail-fast-config`

*Summary:* require the real secret, and fail loudly if it's missing.

**Implementation checklist:**
- [ ] Require `SESSION_SECRET` at startup (outside tests).
- [ ] Update local setup docs and the deployment environment.

### Issue: Remove unused packages and fix the broken "seed" command
**Branch:** `dependency-cleanup`

*Summary:* clear out unused tools and repair (or remove) the broken setup command.

**Implementation checklist:**
- [ ] Remove the unused `dot-env` and `cors` packages.
- [ ] Fix the seed script or remove the broken command.
- [ ] Verify install and the scripts still work.

---

## Standalone bug fixes (Bug, outside #8)

These are real defects, not refactoring, so they are tracked as standalone Bug-type issues.
They are done after the reorganization lands.

### Issue: Allow games that are missing details
**Branch:** `allow-missing-fields`

*Summary:* games with missing player count, play time, or age should save instead of breaking.

**Implementation checklist:**
- [ ] Relax the player-count, play-time, and age fields to allow null.
- [ ] Confirm BGG imports with missing values save correctly.
- [ ] Confirm the UI shows a placeholder when a value is missing.

### Issue: Save new categories or mechanics typed by hand
**Branch:** `find-or-create-categories`

*Summary:* a brand-new category or mechanic should be created, not dropped.

**Implementation checklist:**
- [ ] Find-or-create each category when adding a game.
- [ ] Find-or-create each mechanic when adding a game.
- [ ] Add a test that a brand-new category is created and linked.

### Issue: Show a friendly message when BoardGameGeek is down or slow
**Branch:** `friendly-bgg-errors`

*Summary:* replace raw technical error text with a clear, human message.

**Implementation checklist:**
- [ ] Replace raw external error details with a clear user-facing message.
- [ ] Keep technical detail in the server logs only.
- [ ] Add a test for the friendly-error path.

---

## How the work depends on each other

- Phase 1 must come first: it builds the safety net everything else relies on.
- Phase 2 depends on Phase 1: the tests are what let us reorganize without fear.
- The bug fixes come last, after the reorganization lands, and the tests prove each fix works and stays fixed.

## Not in this plan (separate future work)

These are real features, not refactoring, so they are deliberately left out and will be
tracked separately later:

- A "game details" page for viewing a full game record.
- The ability to edit an existing game entry.
- More sorting options (playtime, player count, name, etc.).
- Pagination/virtualization for very large collections.