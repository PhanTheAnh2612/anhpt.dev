# Visual system

## Character

The site is an Emerald-inspired professional portfolio, not a game clone. Use
pixel-art borders, cream dialogue panels, dark emerald surfaces, compact status
labels, and occasional gold/red accents. Keep hierarchy modern and readable.

The active palette is defined in `src/styles/index.css`:

- ink: `#14211d`
- deep emerald: `#061f1b`, `#07352d`
- cream: `#f5ecd8`
- gold: `#e8b949`
- red: `#a93d31`

Use the CSS custom properties already declared in `:root` rather than copying
hex values into new components when a matching token exists.

## Panel grammar

- Outer console: dark emerald surface, 3px dark border, green inner highlight,
  hard offset shadow.
- Content panel: cream background, dark 2–3px border, compact headings.
- Dialogue: cream panel with an optional portrait and red continuation marker.
- Achievement: deep emerald panel with gold border and cream fact chips.
- Labels: uppercase, compact, high contrast. Body copy remains sentence case.

Do not apply pixel styling to every element. Large art, text blocks, and spacing
provide calm areas between detailed panels.

## Responsive behavior

Existing breakpoints are `860px` and `560px`.

- Laptop: use multi-column scene/rail and summary grids when content remains
  readable.
- Tablet: collapse the main scene/rail vertically; profile and stats may remain
  two columns.
- Mobile: stack portfolio briefs and lower panels, keep text at readable line
  lengths, and ensure `documentElement.scrollWidth === innerWidth`.
- It is acceptable for intentionally large maps to scroll inside their own
  viewport; the document itself must not overflow horizontally.

Use CSS layout changes for mobile. Do not maintain separate desktop and mobile
copies of the same portfolio text.
