---
title: React interfaces
date: 2026-08-31
description: Turn a static page into a clear, accessible component system.
order: 2
category: react
---

# React interfaces

Learn components, props, state, events, and effects by adding an interactive project list to your website.

## First checkpoint

Keep state close to the component that owns it. Derive values during render when you can.

```tsx title="ProjectCount.tsx"
export function ProjectCount({ count }: { count: number }) {
  return <strong>{count} projects shipped</strong>
}
```

## Finish line

Build a keyboard-friendly project filter and deploy the updated frontend.
