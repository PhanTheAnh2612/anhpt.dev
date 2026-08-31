---
name: component-reuse-planning
description:
    Reuse-first planning for both shared primitives and full feature/page work. Picks a `primitives` or `full` scope,
    scores existing components, and stops with a clear recommendation before implementation.
---

# Component Reuse Planning

Requirement to analyze or plan: $ARGUMENTS

Use this skill before creating or extending UI in this repository. It combines primitive-only reuse analysis and
feature-level component reuse planning into one workflow with two scopes.

## Pick the Scope

State the chosen scope at the top of the output.

| Scope        | Inventory                                                                                                                | Use when                                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `primitives` | `docs/registries/components.json` with field `primitives`.                                                                          | Called from `generate-component`, or any request to build / extend a shared primitive.                                                                                          |
| `full`       | `docs/registries/components.json` registry pool first with both field name `primitives` and `features`.                             | Called from `plan-feature-component` / `implement-feature-component`, or any feature / page work — a domain composition may already exist that subsumes the primitive question. |

If the scope is ambiguous, default to `full` when the requirement mentions a domain and `primitives` otherwise.

## Rules

- Start from registries before source files.
- Reuse beats rewrite.
- Score behavior and semantics first; styling deltas alone do not block reuse.
- Read the full registry record for each candidate, not just its name: `description` + `capabilities` for fit, and
  `usage` / `related` for hard constraints and the correct variant to pick.
- When a candidate's registry `usage` / `related` redirects to a sibling for the requirement's context — especially the
  react-hook-form `*Field` variants (`input` → `inputField`, `combobox-v2` → `selectField`, `switch` → `switchField`,
  `tagsInput` → `tagsInputField`) and `Table`-only cells — make that variant the candidate, not the raw primitive.
- Capture each chosen candidate's registry `id`, `source` path, and the binding `usage` / `related` constraint in the
  matrix so implementation can resolve it without re-deriving.
- Every import recommendation must follow `.agent/rules/module-import-convention.md`.
- Do not edit product code during this analysis/planning step.

## Search Order

1. `docs/registries/components.json` as the registry pool for picking reusable components
2. Only the relevant source folders for the requirement:
    - `app/components/shared/` for primitives components
    - `app/components/features/<domain>/` for domain components

Source inspection only refines or fills gaps after the registry pass.

## Scoring

Use one scoring format for both scopes: `0-100`.

| Score    | Meaning                                                          |
| -------- | ---------------------------------------------------------------- |
| `90-100` | Direct fit — reuse as-is                                         |
| `75-89`  | Strong fit — reuse with small extension or composition           |
| `50-74`  | Partial fit — useful base, reference, or wrapper target          |
| `25-49`  | Weak fit — similar surface area but wrong semantics or structure |
| `0-24`   | No fit — build new                                               |

## Scoring Decisions

| Decision | Meaning                                                                                                                          |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `reuse`  | Use the existing component or feature as-is, possibly with theme overrides using `className`, CSS variables, or Tailwind tokens. |
| `extend` | Modify the existing source with a focused API, behavior, or structure addition.                                                  |
| `wrap`   | Compose on top without touching the source, including wrapping a raw primitive when needed.                                      |
| `skip`   | Do not reuse this candidate for the requirement.                                                                                 |

## Styling Rule

Styling-only differences are never enough to reject reuse. Separate behavioral gaps from visual gaps:

1. Prefer `className` for layout and spacing deltas.
2. Prefer CSS variable overrides for color/theme deltas.
3. Add a new variant only when the styling repeats in multiple places and represents new semantics.

## Procedure

1. Choose `primitives` or `full`.
2. Break the requirement into reusable slices.
3. Collect candidates in scope order.
4. Score each candidate and explain both sides:
    - why it can satisfy the requirement
    - why it cannot fully satisfy the requirement as-is
5. Mark the reuse decision for each slice.
6. Turn the matrix into a recommendation:
    - `primitives`: whether to reuse, extend, wrap, or create a new primitive
    - `full`: which primitives and feature components to reuse, extend, or wrap, and whether any new files are justified

- If the feature adds a new page/route, the plan must include:
    - `app/components/loaders/<page>-skeleton.tsx` or an explicit reused skeleton
    - the `pageIdMapSkeleton` entry in `app/components/loaders/index.tsx`
    - the `routePatterns` entry in `app/components/loaders/index.tsx`
    - the exact route `id` from `app/routes.ts`
- Keep page modules thin; domain logic belongs in feature components, with non-component architecture handled by their
  dedicated skills.

## Output Contract

Use the same output structure for both scopes.

Start with:

```md
Scope: primitives
```

or

```md
Scope: full
```

#### Reuse Matrix

```json
{
    "mapping": [
        {
            "requirement": "text input inside the form",
            "candidate": "InputField",
            "id": "inputField",
            "source": "app/components/input-field.tsx",
            "type": "primitive",
            "score": 90,
            "decision": "reuse",
            "usage_constraint": "react-hook-form variant of Input; use it instead of wiring raw Input + Controller (registry usage/related).",
            "why_reuse": "Semantics and API already match the form field need.",
            "why_not_reuse": "N/A",
            "customization": "Theme override only if needed via className, CSS variables, or Tailwind tokens."
        }
    ],
    "missing": []
}
```

`type` must be one of `primitive` or `feature`. Each mapping row must carry the registry `id` and `source` path, and an
`usage_constraint` summarizing the binding `usage` / `related` note (or `"none"` when the registry entry has no
constraint). These feed the implementation skill's Reuse Resolution Gate directly.

#### Decision Log

- Requested requirement or feature
- Reused components
- New components allowed: `yes` or `no` - with rationale
- Rationale


## Quality Checks

- [ ] Scope was declared at the top
- [ ] Correct registries were consulted before source files
- [ ] Each candidate includes both reuse and non-reuse reasoning
- [ ] Styling-only gaps were not treated as behavioral blockers
- [ ] Import recommendations use dedicated module files, not barrels
- [ ] Every requirement slice has a clear decision
- [ ] Every candidate has both a `why_reuse` and `why_not_reuse` reason
- [ ] Each mapping row carries the registry `id`, `source`, and `usage_constraint`
- [ ] No product code was edited during this step
