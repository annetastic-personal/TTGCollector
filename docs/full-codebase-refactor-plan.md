# Full Codebase Refactor Plan

Created: 2026-10-23

This is the plan for issue #8 ("Full codebase refactor analysis"). The issues
themselves, their checklists, and progress live on GitHub (see #8); this file
records only the rationale and conventions that GitHub can't express.

## Purpose

This document is the implementation plan for issue #8, a full refactor of the TTGCollector
codebase. The application works today, but it has accumulated technical debt that makes it harder to
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

## Conventions

- **Types:** Epic (umbrella) → Story (phase) → Task (work) / Bug (defect fix), derived from content.
- **Branches:** one per issue, named `<issue-number>-<short-slug>` (e.g. `11-add-test-harness`).
- **Bug fixes are standalone** — outside the refactor epic, because refactoring preserves behavior while bug fixes change it.
- **Target structure:** routes (thin) → controllers → models. No service layer.

## Structure

- #8  Full codebase refactor analysis (Epic)
  - #9  Phase 1: Add tests (Story)
  - #10 Phase 2: Reorganize the code (Story)
- #28, #29, #30 — standalone bug fixes (Bug)
- #31 — low-priority enhancement: cache BoardGameGeek responses

Detailed checklists and progress live in the issues themselves.

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
