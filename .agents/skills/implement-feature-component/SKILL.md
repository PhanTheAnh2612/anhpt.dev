---
name: implement-feature-component
description:
    Implement an approved feature component plan end-to-end. Assumes planning is complete — consumes the approved reuse
    matrix, decision log, checklist doc, and API architecture plan.
argument-hint: Approved plan path, checklist doc path, feature name, or implementation summary
agent: agent
---

# Implement Feature Component

Use this command when an approved feature-component plan already exists and implementation should proceed. Assumes the
planning phase is already complete and approved.

Approved plan / checklist doc / feature name: $ARGUMENTS

## Sources of Truth During Implementation

- The approved reuse matrix
- The approved decision log
- The checklist doc created during planning
- Registry pool entries for every reused or extended primitive / feature / provider / hook:
    - `docs/registries/components.json`
    - `docs/registries/providers-hooks.json`
- For every reused or extended entry, read its full registry record, not just the name:
    - `description` + `capabilities` — confirm the entry actually fits the slice.
    - `usage` — hard constraints and "use X instead" guidance. Treat `usage` as binding.
    - `related` — the correct sibling/variant to use instead.
    - `source` — the component/provider/hook source file. This is the **authoritative API/prop contract**: read its
      exported props/types and any `*Demo` story before wiring it.
    - `document` — the linked MDX (`stories/document/<ComponentName>.mdx`, `stories/providers/<ProviderName>.mdx`,
      `stories/hooks/<HookName>.mdx`). Treat it as the **design-guideline and usage intent** contract. When the MDX is
      thin or silent on a prop, the `source` file wins.
- The approved test coverage table from `/prepare-test-coverage` (`docs/plans/features/<feature-name>.test-plan.md`) —
  make every case pass in actual test files during implementation
- Finalized markdown requirements, linked docs, and images
- The approved API architecture plan when sample API docs are involved

## Implementation Rules

1. Before editing code for a phase, complete the **Reuse Resolution Gate** below for that phase. No gate table, no code.
   Resolve every reused or extended primitive / feature / provider / hook against the registry pools, read its `usage` /
   `related` / `source` / `document`, and treat the `source` file as the authoritative prop contract and the `usage`
   field as binding. Use the linked MDX for design intent; fall back to `source` whenever the MDX is thin, incomplete,
   or out of date.
2. **Honor the reuse matrix; do not silently diverge.** Build exactly what each matrix row says (`reuse` / `extend` /
   `wrap`). Do not hand-roll a component, raw HTML control (`<input>`, `<button>`, `<select>`, `<dialog>`, etc.), or a
   one-off when a registry entry covers it. If you believe a matrix row is wrong or a needed component is absent from
   both the matrix and its `missing[]`, STOP and flag the deviation for the developer instead of improvising.
3. **Use the correct registry variant.** When an entry's `usage`/`related` points to a different component for your
   context — especially the react-hook-form `*Field` variants (`InputField`, `SelectField`, `SwitchField`,
   `TagsInputField`) and `Table`-only cells — use that one. Never wire a raw control into a form when a `*Field` exists.
4. When the approved plan still needs a missing primitive, pause implementation, run `/generate-component` to create it,
   then continue with the feature plan once that primitive is in place.
5. Do not reopen broad planning unless the approved plan is missing a blocker-level detail.
6. Keep reusable primitives in `app/components/` and domain-specific composition in `app/components/features/`.
7. When API work is part of the approved plan, keep transport logic in `app/services/`, shared async orchestration in
   `app/providers/`, reusable access in `app/hooks/`, and validation in `app/schemas/` when external input crosses a
   boundary.
    - **Imports:** follow `.agent/rules/module-import-convention.md`.
    - **Architecture: follow `.agent/rules/feature-architecture.md`.**
8. When the feature involves any form (create/edit/validate state), follow
   `.agent/rules/react-hook-form-feature.md` for the chosen form shape: provider-based for multi-section/domain
   forms, or local component form when the simple-form exception applies.
9. Implement strictly phase-by-phase using the approved checklist doc.
    - Follow `.agent/rules/feature-checklist-phases.md`.
    - Follow `.agent/rules/feature-phase-execution.md`.
10. Update related docs, stories, and tests only when they belong to the current phase.

## Reuse Resolution Gate (run per phase, before writing code)

For the phase you are about to implement, emit this table and resolve every row before editing any source file. Each row
binds a checklist task to its approved reuse-matrix decision and the registry record that governs it.

| Task ID | Matrix decision (`reuse`/`extend`/`wrap`) | Target entry (`id`) | `source` read | Key `usage` / `related` constraint | Required props / compound shape |
| ------- | ----------------------------------------- | ------------------- | ------------- | ---------------------------------- | ------------------------------- |

Rules for the gate:

- Every component/provider/hook the phase touches must appear, mapped to a checklist task ID and a matrix row.
- If a task has no matching matrix row and the target is not in the matrix `missing[]`, STOP — this is an unplanned
  divergence (see Implementation Rule 2).
- If `usage`/`related` redirects to a variant (a `*Field`, a `Table`-only cell, a preferred sibling), the target entry
  must be that variant.
- Do not start editing code until every row is filled.

## Implementation Guardrails

- Treat the approved plan, reuse matrix, and decision log as binding unless a blocker forces re-planning.
- Treat registry-linked MDX docs as the first source for component/provider/hook usage conventions, prop patterns,
  accessibility expectations, and design guidelines when they exist.
- Reuse and architecture decisions come from the planning phase plus the referenced skills/rules, rather than being
  restated here.
- If implementation discovers a true missing primitive, hand it off to `/generate-component` before continuing.
- If implementation discovers a blocker-level plan gap, stop and ask for re-planning instead of improvising.
- Follow `.agent/rules/feature-phase-execution.md` for phase sequencing and handoff.
- Follow `.agent/rules/feature-architecture.md` for architecture boundaries.

### Constraints

- DO NOT put API calls, schema parsing, or domain branching directly inside the page component — push them down into
  features, hooks, providers, or services.
- DO NOT bypass `PAGE_PATH` — every cross-page link must use the constants module.
- DO NOT ship a new page route without a loader skeleton registered in `app/components/loaders/index.tsx` by its route
  `id` (else it silently degrades to `<SplashScreen/>`).
- DO NOT duplicate layout chrome. Reuse `app/layouts/**` and add a new layout only when explicitly approved.

## Expected Output

### After each phase

1. Current phase completed
2. Checklist items ticked in that phase
3. **Reuse compliance** — one line per reuse-matrix row touched in this phase: `honored` (component actually used as the
   matrix decided) or `deviated` (+ reason and what was built instead). Flag any unplanned new component or raw HTML
   control here.

### Reuse Quality Checks (confirm before each phase handoff)

- [ ] The Reuse Resolution Gate table was completed before code was written.
- [ ] Every reused/extended entry's `source` file (and `*Demo` story when present) was read for its prop contract.
- [ ] Every matrix row was honored, or each deviation is reported with a reason.
- [ ] No raw HTML control was used where a registry primitive exists.
- [ ] Every form field uses the react-hook-form `*Field` variant named in the entry's `usage`/`related`.
- [ ] Imports use dedicated module files, never top-level barrels.

### After the final phase (finalization)

1. Registry pools updated (`docs/components.json`, `docs/providers-hooks.json`)
2. Storybook docs updated (`/provider-hook-storybook-docs`, `/component-storybook-docs`)
