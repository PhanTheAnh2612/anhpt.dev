# Project Structure

`~/` resolves to `app/`
Use PNPM for packages management

## Top-level `app/` layout

| Path                                            | Purpose                                                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `app/components/shared`                         | Primitives (CVA + Tailwind). Composition-first APIs.                                      |
| `app/components/features/<domain>/`             | Domain compositions,          |
| `app/components/loaders/`                       | **Per-page loading skeletons**                             |
| `app/providers/`                                | React context + async orchestration (TanStack Query, forms).                                      |
| `app/hooks/`                                    | Reusable hooks;                                        |
| `app/services/`                                 | API clients (axios) via `createService`.                                                          | 
| `app/schemas/`                                  | Zod schemas for forms and other trust-boundary validation when needed.                            | 
| `app/types/`                                    | Domain request/response and shared TypeScript types.                                              |
| `app/constants/`                                | Enums, option maps, `QUERY_KEY_ID`, `PAGE_PATH`, `API`.                                           | 
| `app/utils/`                                      | utility functions                                                     | 
| `app/middlewares/`                              | middlewares                                                                        | 
| `app/styles/`                                   | CSS-variable theme pipeline and component styles. For handling global tailwind styles                                               |
| `app/layouts/**`                                 | Indicate that the group of all pages that sharing the same layouts, that can be reused in different pages. |
| `app/pages/**`                                  | Page bodies (thin shells that compose feature components).                                        |

## Import convention (enforced everywhere)

Repo code imports the **dedicated module file**, never an aggregating barrel: `~/components/button`,
`~/hooks/use-campaigns`, `~/providers/campaigns-provider`, `~/constants/queryKeyId`, `~/lib/serviceFactory` — never
`~/components` / `~/hooks` / `~/providers` / `~/schemas` / `~/constants`, etc.

### Page & layout hierarchy (mirror of `app/routes.ts`)

Blue = layout module (renders `<Outlet/>`, no own URL). Grey = page; its `[route id]` is the key used by
`pageIdMapSkeleton`. `:param` segments are dynamic; `…` is the inherited parent prefix.

## Per-page loading skeleton convention ⚠️ required

Every page route has a **loading skeleton** wired through `app/components/loaders/`. This is non-optional: a new page
without a registered skeleton silently falls back to a generic `<SplashScreen/>`.

A skeleton is a small presentational component built from primitives (`~/components/widget`, `~/components/skeleton`, …)
and/or an existing feature skeleton. Dedicated page skeletons
live in `app/components/loaders/<page>-skeleton.tsx` exporting `<Page>Skeleton`;

```tsx
import { CampaignCardSkeleton } from '~/components/features/campaign/campaign-card-skeleton';
import { Widget, WidgetContent, WidgetTitle } from '~/components/widget';

export const CampaignsDashboardSkeleton = () => (
    <Widget id="campaigns-dashboard-skeleton">
        <WidgetTitle title=" " />
        <WidgetContent>{/* skeleton blocks */}</WidgetContent>
    </Widget>
);
```

### Rule: a new page ⇒ a new loader skeleton

When a feature adds a **new page/route**, the plan and implementation MUST include:

1. A skeleton component — a new `app/components/loaders/<page>-skeleton.tsx` (deep imports only), **or** an explicit
   decision to reuse an existing feature/loader skeleton (state which and why).
2. Register it in `app/components/loaders/index.tsx`: add the `routeId → SkeletonComponent` entry to `pageIdMapSkeleton`
   **and** the `{ path, id }` entry to `routePatterns`, using the exact route `id` declared in `app/routes.ts`.

The skeleton's visual layout should mirror the loaded page (same widgets/regions) so there is no layout shift on
hydration.