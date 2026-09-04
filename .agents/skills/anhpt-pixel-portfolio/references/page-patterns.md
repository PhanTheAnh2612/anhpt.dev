# Page and component patterns

## Shared UI

- `src/components/shared/pixel-bubble.tsx`: icon-and-label bubble for map markers
  and Journal tag controls.
- `src/components/shared/pixel-scene.tsx`: responsive registered scene renderer
  with typed overlay anchors.
- `src/components/shared/pixel-sprite.tsx`: registered static-frame and
  generated step-animation renderers.

Reuse these before creating page-local equivalents.

## Journey

`src/lib/learning-path.ts` is the single source for route order, category slug,
title, compact icon label, map class, and description.

Each island marker must:

- show a title and pixel icon;
- reveal its short description on hover and keyboard focus;
- remain a real TanStack Router `Link`;
- navigate to `/courses` with the typed `category` search parameter;
- remain represented in the accessible map legend.

Courses may render the selected category but should not display the tag-filter
bar. Journal owns tag filtering.

## Guild Hall

The current professional portfolio structure is:

1. Guild console title and subtitle.
2. Scene stage with editable dialogue.
3. Ranger profile and qualitative stats rail.
4. Role overview, engineering impact, and team contribution briefs.
5. Strengths, approved achievement, and confidentiality note.
6. Core values footer.

On laptop, the scene and ranger rail sit side by side. On mobile, dialogue leads
into the scene, profile and stats form a compact row when space permits, and
professional briefs stack vertically.

Use qualitative levels for self-assessment unless the user supplies verified
numbers. The achievement may display `APA Score · 4/5` and
`5 Consecutive Years` because those values were explicitly supplied.

Do not add an About Me section, an old project showcase, or internal dashboard
facsimiles to Guild Hall.
