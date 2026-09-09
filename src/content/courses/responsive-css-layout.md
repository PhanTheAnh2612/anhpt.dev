---
title: Create a responsive CSS layout
date: 2026-09-09
description: Style the Hotel Manager with a small reusable layout that adapts from a narrow phone screen to a two-column desktop.
order: 3
category: fundamentals
level: core
---

# Create a responsive CSS layout

CSS should support the document rather than compensate for unclear HTML. Begin with readable defaults, then add a wider layout only when space allows.

## Add the small-screen foundation

```css title="styles.css"
:root {
  color-scheme: light dark;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

main {
  width: min(100% - 2rem, 64rem);
  margin-inline: auto;
  padding-block: 2rem;
}

form {
  display: grid;
  gap: 0.75rem;
}

input,
textarea,
button {
  min-height: 2.75rem;
  padding: 0.65rem;
  font: inherit;
}

textarea {
  min-height: 8rem;
  resize: vertical;
}

:focus-visible {
  outline: 3px solid #0f766e;
  outline-offset: 3px;
}
```

Use relative units so text and spacing respond to reader preferences. A visible focus indicator makes keyboard location clear.

## Add one meaningful breakpoint

```css title="styles.css"
@media (min-width: 48rem) {
  main {
    display: grid;
    grid-template-columns: minmax(16rem, 24rem) 1fr;
    gap: 3rem;
  }

  main > h1,
  main > p {
    grid-column: 1 / -1;
  }
}
```

The layout has one column by default and two columns when both remain usable. Avoid choosing breakpoints from device names; resize until the content needs a change.

## Checkpoint

Inspect the page at 390 pixels wide and at a laptop width. Confirm there is no horizontal scrolling, clipped focus ring, or unreadably long line.

## Keep learning

- [MDN: Responsive web design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
- [MDN: CSS Grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)
