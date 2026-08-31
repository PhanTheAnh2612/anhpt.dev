# anhpt.dev Foundation — Test Coverage Plan

Plan: [anhpt-blog-foundation.md](./anhpt-blog-foundation.md)

Status: pending — not run, no test files generated, no implementation

| ID | Behavior slice | Layer | Target unit (file) | Test case (expected outcome) | Type | Source | Done |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-1 | Content metadata | schema | `src/lib/content/frontmatter.ts` | A valid lesson frontmatter record parses into the typed content model. | happy-path | Phase 2, T2.1 | [ ] |
| TC-2 | Content metadata | schema | `src/lib/content/frontmatter.ts` | A Markdown file missing its title or slug is rejected with a useful validation error. | boundary | Phase 2, T2.1 | [ ] |
| TC-3 | Content index | unit | `src/lib/content/content-index.ts` | The index returns published lessons sorted by the declared order. | happy-path | Phase 2, T2.2 | [ ] |
| TC-4 | Content index | unit | `src/lib/content/content-index.ts` | A lookup for an unknown slug returns no document rather than throwing. | empty-state | Phase 2, T2.2 | [ ] |
| TC-5 | Markdown lesson | feature | `src/components/features/lesson/lesson-content.tsx` | A lesson renders its heading, prose, and syntax-highlighted code fence. | happy-path | Phase 2, T2.5 | [ ] |
| TC-6 | Site navigation | feature | `src/components/features/site-shell/site-navigation.tsx` | Each primary route has an accessible link with its visible name. | a11y | Phase 3, T3.3 | [ ] |
| TC-7 | Mobile navigation | feature | `src/components/features/site-shell/site-navigation.tsx` | Opening and closing the mobile navigation updates the expanded state and focusable links. | a11y | Phase 3, T3.3 | [ ] |
| TC-8 | Course disclosure | primitive | `src/components/shared/accordion.tsx` | Keyboard activation toggles a course module and exposes the correct expanded state. | a11y | reuse matrix | [ ] |
| TC-9 | Course route | feature | `src/routes/courses/$courseSlug.tsx` | A known course route renders its module list and lesson links from indexed Markdown. | happy-path | Phase 4, T4.2 | [ ] |
| TC-10 | Search | feature | `src/components/features/search/search-results.tsx` | A matching query returns the relevant lesson or journal entry. | happy-path | Phase 4, T4.4 | [ ] |
| TC-11 | Search | feature | `src/components/features/search/search-results.tsx` | A query with no matches renders the empty state. | empty-state | Phase 4, T4.4 | [ ] |
| TC-12 | Not found route | feature | `src/routes/$404.tsx` | An unmatched URL renders the custom RPG not-found screen. | happy-path | Phase 4, T4.4 | [ ] |
| TC-13 | Motion preferences | feature | `src/styles/global.css` | Reduced-motion preferences disable nonessential animated effects. | a11y | Phase 4, T4.5 | [ ] |
| TC-14 | Worker build | integration | `wrangler.jsonc` | The configured Worker passes Wrangler validation and builds an SSR output. | happy-path | Phase 5, T5.4 | [ ] |
| TC-15 | CI quality gate | integration | `.github/workflows/ci.yml` | A pull request runs linting, type checks, tests, and the production build. | happy-path | Phase 5, T5.2 | [ ] |

## Open Questions

None. The first release has no remote data source, credentials, forms, or mutation flows.
