---
name: prepare-test-coverage
description:
    Prepare a test coverage spec for a feature component AFTER an approved plan and BEFORE implementation. Turns the
    approved reuse matrix, decision log, implementation plan, and API architecture into a single markdown table of
    coverage test cases for manual review. Does not generate any test files, does not run tests/type-check/build, and
    never writes product code to make tests pass.
argument-hint: Approved plan path, checklist doc path, or feature name
---

# Prepare Test Coverage

Use this skill in the gap between planning and implementation. The plan is already approved by the user via
`/plan-feature-component`; implementation has **not** started yet (`/implement-feature-component` runs after this).

Your job is to convert the approved plan into a reviewable **test coverage table** so a human can confirm "these are the
right cases to verify" before any feature code exists.

Approved plan / checklist doc / feature name: $ARGUMENTS

## Sources of Truth

Read these before producing anything — do not invent requirements:

- The approved reuse matrix and decision log
- The approved implementation plan (exact files expected to change)
- The checklist doc from planning (usually `docs/plans/features/<feature-name>.md`)
- Finalized markdown requirements, linked docs, and images

## Non-Negotiable Constraints

- DO NOT generate `*.test.ts` / `*.test.tsx` files or any test scaffold for providers, hooks, components, schemas, or
  anything else. The only deliverable is the coverage table doc.
- DO NOT run `npm run test`, Vitest, `npm run type-check`, `npm run lint`, builds, or any validation. The user verifies
  the cases manually.
- DO NOT write feature/product implementation or test code.
- DO NOT edit product source under `app/`, `stories/`, `public/`, or build config.
- DO NOT reopen planning. If the plan is missing a blocker-level detail for testability, add it to the Open Questions
  list and stop — do not redesign.
- ONLY produce: the test coverage doc and the checklist update.

## Procedure

1. **Derive behavior slices.** From the reuse matrix `requirements`/`mapping` and the requirements doc, list every
   observable behavior the feature must exhibit. Separate UI behavior from data/async behavior.
2. **Classify each slice by test layer**, matching the repo's boundaries:
    - Primitive/unit — reused or new `app/components/shared` primitive behavior (rare; usually already covered).
    - Feature composition — `app/components/features/<domain>/` rendering, interaction, and wiring.
    - Hook — `app/hooks/` behavior and state transitions.
    - Provider / async — `app/providers/` orchestration: loading, success, error, refetch, cache.
    - Schema boundary — `app/schemas/` zod parse of every external input named in the API architecture plan.
3. **Enumerate concrete test cases** per slice. Always include, where applicable: happy path, empty/zero state, loading
   state, error/failure state, boundary/invalid input, accessibility (role/name/keyboard), and any decision-log edge
   cases. Each row = one test case with a one-line expected outcome.
4. **Name the target unit** for each case (the component/hook/provider/schema under test and its file path) — for
   reviewer context only. Do not create that test file.
5. **Write the test coverage doc** (see Output Contract) at `docs/plans/features/<feature-name>.test-plan.md`, beside
   the planning checklist.
6. **Update the checklist doc.** Add a "Test coverage" section that links the test-plan doc.

## Output Contract

### Test Plan Doc

A markdown doc at `docs/plans/features/<feature-name>.test-plan.md` containing, in order:

1. A title and a link back to the planning checklist and requirements.
2. A `Status: pending — not run, no test files generated, no implementation` line.
3. The **coverage table** — every test case as one row. Last column is a manual checkbox:

| ID   | Behavior slice         | Layer   | Target unit (file)                                                 | Test case (expected outcome)                                             | Type        | Source                | Done  |
| ---- | ---------------------- | ------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------ | ----------- | --------------------- | ----- |
| TC-1 | Submit enrichment form | feature | `app/components/features/lead-enrichment/lead-enrichment-form.tsx` | Submitting valid input calls the enrich mutation with the parsed payload | happy-path  | reuse-matrix req #3   | `[ ]` |
| TC-2 | Submit enrichment form | schema  | `app/schemas/lead-enrichment.ts`                                   | Payload missing required email is rejected with a zod error              | boundary    | api-architecture plan | `[ ]` |
| TC-3 | Enrichment list        | feature | `app/components/features/lead-enrichment/lead-enrichment-list.tsx` | Empty result renders the empty state, not a spinner                      | empty-state | requirements.md §4    | `[ ]` |

- One row per test case. Keep `Test case` to a single asserting outcome.
- `Type` — pick exactly one, the dominant intent of the case:
    - `happy-path` — primary success flow with valid input and expected wiring (the feature does what it should).
    - `empty-state` — zero/no-data result renders the empty UI, not a spinner or a crash.
    - `loading` — pending/in-flight state shows the loading affordance and disables conflicting actions.
    - `error` — failed request, rejected mutation, or thrown error renders the error UI and recovery path.
    - `boundary` — input at or past a limit / schema edge: empty string, max length, zero, negative, malformed payload,
      missing required field (zod parse rejects with the expected error).
    - `a11y` — accessibility contract: correct role/name, label association, focus management, keyboard operation
      (Tab/Enter/Esc/arrows), `aria-*` state.
    - `edge` — a decision-log or requirement edge case that is not one of the above: race conditions, stale cache,
      concurrent actions, permission/feature-flag gating, timezone/locale, idempotent retries.
- `Done` column MUST be a literal `[ ]` so the user can tick it to `[x]` manually during verification.

4. An **Open Questions** section listing any testability gaps in the plan (empty list if none).

### Checklist Update

- Add a "Test coverage" section to the planning checklist with a link to the test-plan doc and a single unchecked task:
  "Review and confirm the test coverage table".

### Confirmation

- Confirm: no test files generated, no tests run, no feature code written.
- Ask the user to review the coverage table and tick / amend rows.
- State the next step is `/implement-feature-component`, which makes these cases real and green.

## References

- Planning chain: `/plan-feature-component` → `/prepare-test-coverage` → `/implement-feature-component`
- [Reuse planning skill](../component-reuse-planning/SKILL.md)
- [API mapping skill](../api-doc-service-provider-hook/SKILL.md)
