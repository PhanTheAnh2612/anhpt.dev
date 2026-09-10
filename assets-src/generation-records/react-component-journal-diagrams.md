# React component journal diagrams

Created as explanatory figures for the React component design series. These
SVGs intentionally use a clean editorial style instead of the site's pixel-art
scene language so labels, arrows, and relationships remain legible in an
article.

## Shared specification

- Canvas: responsive 1200×720 SVG with an intrinsic 5:3 view box.
- Palette: warm paper, charcoal, emerald for allowed/data flow, muted red for
  events, errors, or blocked dependencies.
- Typography: system sans-serif; all essential meaning also appears in the
  article's alternative text and caption.
- Accessibility: every SVG includes a concise `title` and explanatory `desc`.
- Avoided: decorative textures, logos, gradients, tiny labels, and unexplained
  arrows.

## Outputs

| Output                             | Teaching purpose                                        |
| ---------------------------------- | ------------------------------------------------------- |
| `interface-state-gallery.svg`      | Compare the visible states designed before JSX          |
| `props-and-events-flow.svg`        | Show props down, events up, and one authoritative owner |
| `composition-vs-booleans.svg`      | Compare boolean configuration with explicit slots       |
| `dependency-direction.svg`         | Mark allowed and blocked imports between layers         |
| `client-server-async-boundary.svg` | Trace load, optimistic mutation, and confirmed refresh  |
