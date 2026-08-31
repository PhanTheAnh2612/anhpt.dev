---
trigger: always_on
---

# Page and Route Planning Rules

Use this rule whenever the requirement creates or changes a page, route, or top-level screen.

## Trigger

Apply this rule when the requirement says "create a new page", "add a route", or names a top-level screen such as
`PageX`, `PageXDashboard`, or `PageXDetails`.

## Planning Checklist

1. **Pick the page shape** based on complexity.
    - Use a folder like `app/pages/SpaceX/PageX/index.tsx` for multi-section screens or screens likely to grow helpers
      and sub-files.
2. **Pick the layout** from the existing `app/routes.ts` tree and `app/layouts/**`.
    - Add a new layout only when the plan explicitly needs new shared chrome.
3. **Plan the route registration** in `app/routes.ts`.
    - Use the `@react-router/dev/routes` helpers such as `route`, `index`, `layout`, and `prefix`.
    - Define exact `path`, params, nesting, and any unique route `id`.
    - Note any exported `handle` needed for layout selection, breadcrumbs, or route metadata.
4. **Plan the loading skeleton** for every new page.
    - Use a new `app/components/loaders/<page>-skeleton.tsx` or explicitly reuse an existing skeleton.
    - Register the skeleton in `app/components/loaders/index.tsx` through both `pageIdMapSkeleton` and `routePatterns`.
    - Key registration by the exact route `id` from `app/routes.ts`.
5. **Plan the `PAGE_PATH` entry** in `app/constants/pagePath.ts`.
    - Cross-links from feature components must use `PAGE_PATH`, never inline route strings.
6. **Wire providers at the page boundary**, not inside features.
7. **Compose feature components only** in the page body.

## Required Output

When page/route scope is involved, include:

- Page shape decision with rationale.
- Selected layout and parent route.
- Exact `app/routes.ts` route entry to add, including unique route `id`.
- Loading skeleton decision and exact `pageIdMapSkeleton` + `routePatterns` entries.
- `PAGE_PATH` key and signature to add.
- Provider wrapping plan and hook usage.
- Feature components reused vs. needing creation.
