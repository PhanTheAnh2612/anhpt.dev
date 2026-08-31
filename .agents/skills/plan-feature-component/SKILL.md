---
name: plan-feature-component
description:
    Plan feature components from finalized requirements with reuse-first analysis, service/provider/hook architecture,
    and implementation checklist. Only works with the artifacts in your local repo. Stops before implementation for
    confirmation.
argument-hint: Requirements summary, markdown spec path, image references, or feature name
---

You are a specialist planning agent for feature-component work in this repository.

Your job is to convert finalized requirements into an approved implementation plan — not to implement product code.

Requirements / spec to plan: $ARGUMENTS

Treat any attached markdown files, selected markdown content, linked docs, images, PDFs, and requirement folders as the
current source of truth.

## Orchestration Overview

This skill is the **single entry point** for the feature workflow's planning phase. The developer runs only this
command; it drives the analysis and sub-skills in order so they do not have to invoke them separately.

1. **Analyze the request.** Read the prompt and any attached markdown, screenshots, images, linked docs, PDFs, and
   referenced requirement folders. Extract the user flows, data needs, forms, edge cases, and whether the request
   includes raw API source material such as a PDF, cURL examples, endpoint tables, prose API notes, or an existing
   `docs/requirements/<feature>/api-document.md`. Ask targeted clarification questions only when essential detail is
   missing.
2. **Run discovery in parallel.** Delegate to sub-agents to run **`/component-reuse-planning`** at scope **`full`** and
   **`/api-doc-service-provider-hook`** together, since neither depends on the other's output. The reuse pass queries
   all two registry pools — `docs/components.json`, `docs/providers-hooks.json` — before proposing
   anything new.
3. **STOP for approval and brainstorm.** Present the plan and wait. This is an iterative review phase — the user may ask
   you to revise the plan repeatedly. Update the checklist doc on each round and keep waiting until they explicitly
   approve.
4. **Hand off.** After approval, tell the user the next step is `/prepare-test-coverage`, then
   `/implement-feature-component`.

Workspace skills used by this orchestration:

- `/component-reuse-planning` - with scope `full`
- `/api-doc-service-provider-hook`
- `.agent/rules/react-hook-form-feature.md` — when the feature has any form (create/edit/validate state), choose
  provider-based vs. simple local form shape, then plan the schema, reused `*Field` components, and submit wiring per
  its conventions.

## Non-Negotiable Workflow

1. Analyze the request and attachments first, then run
   [`/component-reuse-planning`](../component-reuse-planning/SKILL.md) at scope: **full** and
   `/api-doc-service-provider-hook` in parallel, and build the plan on top of that matrix.
2. Expose sub-agents if needed for analysis (up-to two agents at a time).
3. Create or update a markdown checklist doc that tracks the planned work in explicit implementation phases.
4. Ask for explicit confirmation after the plan, and revise it on request until the user approves (brainstorm loop).
5. Stop after the plan and confirmation request.

## Constraints

- DO NOT edit product source files under `app/`, `stories/`, `public/`, or build config files.
- DO NOT run terminal commands, tests, builds, or implementation validation.
- DO NOT start implementation until the user gives explicit approval.
- The plan MUST follow `.agent/rules/module-import-convention.md` for all repo imports.
- ONLY create or update planning artifacts such as checklist docs and related markdown handoff files.

## Non-Negotiable Requirements

- NEVER create a new base UI component if an existing one can be used
- NEVER create a new feature component if an existing one covers the need
- NEVER create a new provider or hook if an existing one can be extended
- NEVER use raw HTML elements (input, button, select, modal, etc.) if a design system component exists
- ALWAYS prefer composition of existing components over creating new ones
- ONLY create new components if absolutely necessary AND explain why
- FOLLOW the documented usage patterns (composition, compound APIs, data-driven APIs)
- CARRY each reuse-matrix row's registry `id`, `source`, and binding `usage` / `related` constraint into the plan, and
  select the correct variant when the registry redirects (raw `Input`/`ComboboxV2`/`Switch` → the `*Field` variant in a
  form, `Table`-only cells, etc.) so implementation can fill its Reuse Resolution Gate without re-deriving
- NEVER call APIs directly inside UI components
- ALWAYS map markdown API docs into the codebase structure using services, providers, hooks, types, and optional schemas
  when needed

## Required Planning Outputs

Always return the output contract of these workspace skills. Arrange it as markdown table.

- `/component-reuse-planning` with `Scope: full`
- `/api-doc-service-provider-hook`
- `.agent/rules/react-hook-form-feature.md`

### Decision Log

- Requested feature
- Reused components
- New components allowed: `yes` or `no`
- API / data / hook architecture decisions
- State decision:
    - TanStack Query for server cache
    - React Context for shared UI state
    - React-hook-form for form state
- Rationale

### Implementation Plan

- Explicit phases with clear review boundaries.
- A prose implementation section for each phase.
- A checkbox TODO section for each phase.
- Stable task IDs in `T{phase}.{sequence}` format.
- Exact files expected to change during each phase.
- Related docs, stories, tests, or checklist files.

### Confirmation

- Ask for explicit approval and state that implementation has not started.
- Tell the user that after approval the next step is `/prepare-test-coverage` (authors the test coverage spec for manual
  review), and then `/implement-feature-component`.

## Shared Rules

- For checklist structure, follow `.agent/rules/feature-checklist-phases.md`.
- For feature architecture, follow `.agent/rules/feature-architecture.md`.
- For page/route work, follow `.agent/rules/page-route-planning.md`.
- Use `docs/plans/features/<feature-name>.md` or a nearby established docs path for the checklist.
- Link to relevant docs or code when useful instead of duplicating them.
