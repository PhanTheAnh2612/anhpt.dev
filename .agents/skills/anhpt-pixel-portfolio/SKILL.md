---
name: anhpt-pixel-portfolio
description: Build or revise anhpt.dev pages and shared components using its Emerald-inspired pixel RPG portfolio system, editable content model, responsive layouts, and base sprite atlas. Use for Journey, Courses, Journal, Guild Hall, badges, character panels, or new pages that must match this site. Do not use for unrelated React applications.
---

# anhpt.dev Pixel Portfolio

Preserve the site's professional frontend-portfolio purpose while presenting it
through a restrained pixel RPG visual language.

## Non-negotiable outcomes

- Keep meaningful text as editable, semantic React/HTML. Images provide
  atmosphere and must not contain the only copy of headings, descriptions,
  scores, navigation, or portfolio claims.
- Reuse existing artwork and shared components before generating or duplicating
  assets.
- Keep pages SSR-safe, keyboard accessible, and usable at laptop and 390px
  mobile widths.
- Do not expose confidential projects, dashboards, customer data, or internal
  implementation details. Prefer responsibilities, practices, values, and
  outcomes that are safe to publish.
- Avoid fabricated business metrics. Only render scores, dates, streaks, or
  achievements supplied by the user or existing approved content.

## Route to the relevant reference

- For visual hierarchy, panels, breakpoints, or responsive composition, read
  [references/design-system.md](references/design-system.md).
- When using `base-sprites.png` or adding a sprite crop, read
  [references/sprite-atlas.md](references/sprite-atlas.md).
- For portfolio copy, course Markdown, journal Markdown, or editable content,
  read [references/content-model.md](references/content-model.md).
- For Journey or Guild Hall composition and shared UI patterns, read
  [references/page-patterns.md](references/page-patterns.md).
- Before handing off a code change, follow
  [references/verification.md](references/verification.md).

## Implementation boundaries

- Shared primitives belong in `src/components/shared/`.
- Route composition belongs in `src/routes/`; keep large editable copy or data
  structures in `src/content/` or `src/lib/`.
- Import from the defining file, not a new barrel.
- Keep sprite-atlas use scoped through `BaseSprite`; do not import a global atlas
  stylesheet or replace unrelated page artwork.
- Treat screenshots and generated mockups as structural references. Extract
  hierarchy and interaction patterns, not baked-in text or confidential-looking
  dashboard details.

## Working approach

1. Inspect the target route, its current content source, shared components, and
   relevant styles before editing.
2. Reduce visual references to the smallest useful information architecture.
3. Put reusable behavior or visuals in shared components and page-specific
   composition in the route.
4. Keep copy centralized and editable.
5. Verify production SSR output and both laptop/mobile presentation.
