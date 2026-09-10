# Editable content model

For content planning, drafting, editorial review, and SEO rules, also use
`../../anhpt-content-authoring/SKILL.md`. This reference remains the concise
implementation contract for portfolio pages.

## General rule

Portfolio text belongs in source content, not inside raster images or CSS
pseudo-elements. CSS-generated decoration may use symbols, but meaningful text
must remain in the DOM.

For a data-heavy standalone page, centralize editable content in `src/content/`
and let the route map it to semantic sections. The Guild Hall example uses:

- content: `src/content/guild-profile.ts`
- composition: `src/routes/guild-hall.tsx`

Keep personal claims modest, specific, and safe to publish. Exclude internal
product names, customer details, dashboard screenshots, unreleased features,
and private performance records beyond facts the user explicitly approved.

## Markdown frontmatter

Syllabus lessons in `src/content/courses/` belong to exactly one Journey
category. The directory name is a content-storage contract and does not imply a
public `/courses` route:

```yaml
---
title: React interfaces
date: 2026-08-31
description: Build a clear, accessible component system.
order: 2
category: react
---
```

Valid course categories come from `src/lib/learning-path.ts`.

Journal entries can have multiple comma-separated tags:

```yaml
---
title: Starting a learning quest
date: 2026-08-31
description: Notes from the first route.
tags: learning, typescript
---
```

Syllabus lessons use `category`; Journal uses `tags`. Journal posts may be
mapped into a syllabus by their tag and route configuration. Do not reintroduce
the ambiguous `topic` field.

## Rendering

`src/lib/content.ts` parses frontmatter and renders Markdown with TanStack
Markdown and TanStack Highlight. Extend its typed `ContentEntry` contract when
adding a maintained field. Invalid course categories should resolve to an empty
category rather than being trusted blindly.

Use the registered `architecture` directive for semantic, text-native flows,
timelines, and trust boundaries. Keep meaningful labels in Markdown so the
explanation remains available without imagery. Reserve raster assets for visual
explanation that cannot be expressed clearly through structured content.
