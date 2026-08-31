# anhpt.dev — Foundation Plan

## Status

**Approved.** The Git repository at this directory is the single project root.

## Scope: full

### Source-of-truth findings

- The implementation target is a TanStack Start + TypeScript + React site, deployed with SSR to Cloudflare Workers.
- Articles, course lessons, and journal entries are local Markdown files; the first release has no application API, database, authentication, or mutation flows.
- `docs/registries/components.json` has one primitive (`Accordion`) and no feature compositions. `docs/registries/providers-hooks.json` has no usable provider or hook entries.
- The checked-out Git repository is `anhpt.dev/`, whereas this repository-standard material (`.agents/`, `app/`, and `docs/`) currently lives one directory above it. This must be resolved before scaffolding so the code and its standards live in one versioned project.

### Reuse Matrix

```json
{
  "mapping": [
    {
      "requirement": "Expandable course-module and FAQ content",
      "candidate": "Accordion",
      "id": "accordion",
      "source": "app/components/shared/accordion.tsx",
      "type": "primitive",
      "score": 70,
      "decision": "reuse",
      "usage_constraint": "none",
      "why_reuse": "Its expandable/collapsible, single- and multi-expand semantics fit module and FAQ disclosures.",
      "why_not_reuse": "The source file is not currently present and its final API must be validated after the repository-root decision.",
      "customization": "Apply the RPG visual treatment with the shared design tokens; do not change disclosure semantics."
    }
  ],
  "missing": [
    "Application shell and responsive navigation",
    "Pixel-style action/link control",
    "Dialogue panel and stat card compositions",
    "Route/page loading skeletons",
    "Course map and route card compositions",
    "Markdown lesson renderer and syntax-highlighted code block",
    "Search result list and empty state",
    "Badge, guild-hall, and journal card compositions"
  ]
}
```

### Decision Log

| Decision | Outcome |
| --- | --- |
| Requested feature | Initial, production-ready foundation for the anhpt.dev pixel-RPG portfolio and Markdown learning blog. |
| Reused components | `Accordion` for future expandable content, once its source exists in the chosen project root. |
| New components allowed | Yes. The registry contains no fitting primitives or feature components for the requested product surfaces. Each primitive will be planned and documented before implementation. |
| Data architecture | Filesystem Markdown is the source of truth. Build-time content indexing supplies routes, metadata, search, and adjacent navigation; no service, provider, or API layer is introduced for content. |
| State architecture | TanStack Query is initialized at the application boundary for future client-side cache needs, but no queries are created without a remote/read-only data source. React Context is limited to shared presentational UI state such as navigation/dialogue preferences. No forms are in scope. |
| Rendering architecture | TanStack Start owns file-based routes and full SSR. Static, content-only routes are prerendered when supported by the Cloudflare adapter; interactive enhancements hydrate progressively. |
| Deployment architecture | Cloudflare Workers + static assets, with GitHub Actions for quality gates and deployment. |

## Root Decision

The documented rules refer to `app/**`, while a fresh TanStack Start project conventionally uses `src/**`; neither currently exists inside the Git repository. Before writing product code, choose one of these layouts:

1. **Recommended:** make `anhpt.dev/` the only project root and move/copy the standards into it, adapting the documented `app/**` architecture to `src/**` while retaining the same layers.
2. Keep the outer directory as the project root and initialize Git there, importing the nested repository history.

The recommended layout has been accepted. The standards, planning artifacts, and seed source tree now live inside this Git repository. New TanStack Start source will use `src/**`; the original `app/**` material is preserved as a reference until its useful utilities are migrated or retired deliberately.

## Test coverage

- [ ] Review and confirm the [foundation test coverage table](./anhpt-blog-foundation.test-plan.md).

## Implementation Plan

## Phase 1 — Repository and platform foundation

### Implementation

Choose the project root, scaffold the official Cloudflare TanStack Start template inside it, then install React, TypeScript, TanStack Router/Start/Query/Markdown/Highlight, and Tailwind CSS v4. Run TanStack Intent after package installation so its package-shipped skills are mapped for this project. Configure the Cloudflare Vite plugin, Worker entrypoint, typed bindings, SSR, and prerendering.

Expected files: project-root `package.json`, `vite.config.ts`, `wrangler.jsonc`, `tsconfig.json`, `src/router.tsx`, `src/routes/**`, `src/styles/**`, intent-skill mapping file, and root-level tooling configuration.

### TODO

- [ ] T1.1 Approve the Git/project-root layout.
- [ ] T1.2 Scaffold the official TanStack Start Cloudflare Workers template.
- [ ] T1.3 Install approved runtime and development dependencies, then wire package-shipped TanStack agent skills.
- [ ] T1.4 Configure Tailwind v4, SSR, Worker static assets, strict TypeScript, linting, formatting, and test tooling.
- [ ] T1.5 Add the base query-client provider without inventing a content API.

## Phase 2 — Content and routing contract

### Implementation

Create a typed Markdown content contract and build-time index. Add SSR-first routes for the landing page, journey, courses, course/module/lesson pages, journal, Guild Hall, badges, Secret Base, search, and not-found state. Each route gets route metadata and a page-specific loading skeleton. This project uses TanStack Start file routes, so the existing React Router-specific `app/routes.ts` / `PAGE_PATH` convention must be replaced with a typed TanStack Router navigation module after approval.

Expected files: `src/content/**`, `src/lib/content/**`, `src/routes/**`, `src/components/loaders/**`, `src/lib/navigation.ts`, and test fixtures under `src/content/**` or `src/test/**`.

### TODO

- [ ] T2.1 Define frontmatter schema and content collection conventions.
- [ ] T2.2 Build the server-safe content index, ordering, related-content, and local search index.
- [ ] T2.3 Add typed SSR routes and route metadata.
- [ ] T2.4 Add loader skeletons that mirror each route’s final layout.
- [ ] T2.5 Render Markdown with TanStack Markdown and code fences with TanStack Highlight.

## Phase 3 — Shared RPG design system

### Implementation

Plan and add the missing shared primitives through the repository’s primitive workflow, then compose the application shell, responsive navigation, dialogue UI, cards, map controls, accessible focus states, reduced-motion behavior, and original asset pipeline. The visual language is Emerald-era pixel-RPG inspired but uses original names, artwork, sprites, and UI treatment.

Expected files: `src/components/shared/**`, `src/components/features/site-shell/**`, `src/styles/**`, `public/assets/**`, Storybook stories/docs, and component registry updates.

### TODO

- [ ] T3.1 Plan each missing primitive with the component-generation workflow.
- [ ] T3.2 Implement and document approved shared primitives.
- [ ] T3.3 Build the site shell, responsive navigation, and accessible dialogue interactions.
- [ ] T3.4 Add original, optimized sprites/illustrations and non-visual fallbacks.
- [ ] T3.5 Update component documentation and the registry.

## Phase 4 — Product surfaces

### Implementation

Compose the landing experience, interactive journey map, course progression, lesson page, journal, Guild Hall, badges, Secret Base, search, and 404 page from the approved primitives and feature compositions. Keep page modules thin; content parsing and navigation helpers stay outside page modules.

Expected files: `src/components/features/**`, `src/pages/**` only if retained by the chosen architecture, `src/routes/**`, content fixtures, route skeletons, and feature tests.

### TODO

- [ ] T4.1 Build the landing page and trainer-guided entry experience.
- [ ] T4.2 Build the map, course overview, and lesson progression surfaces.
- [ ] T4.3 Build Markdown tutorial rendering and journal experience.
- [ ] T4.4 Build Guild Hall, badges, Secret Base, search, and not-found experiences.
- [ ] T4.5 Validate semantic HTML, keyboard support, mobile layout, and motion preferences.

## Phase 5 — Quality, CI/CD, and deployment

### Implementation

Add GitHub Actions for formatting, linting, type-checking, unit tests, and production build verification. Add the Cloudflare deployment workflow and document required repository secrets/permissions without committing credentials. Validate Worker SSR, static prerendering, asset delivery, and deployment previews before connecting `anhpt.dev`.

Expected files: `.github/workflows/**`, `README.md`, deployment docs, and Worker configuration.

### TODO

- [ ] T5.1 Add focused unit and route/content integration tests.
- [ ] T5.2 Add GitHub Actions quality gates.
- [ ] T5.3 Add Cloudflare Workers deployment workflow and required secret documentation.
- [ ] T5.4 Validate local Worker preview, SSR, prerendering, and production build.
- [ ] T5.5 Configure the custom domain after the deployment target is available.

## Approval

Approved by the project owner on 2026-08-31. Implementation may proceed phase by phase.
