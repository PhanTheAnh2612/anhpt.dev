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

<!-- ::start:trainer-tip pose="think" -->

Ask which component needs to change a value. Keep that value there, then pass only what its children need through props.
<!-- ::end:trainer-tip -->

```tsx title="ProjectCount.tsx"
export function ProjectCount({ count }: { count: number }) {
  return <strong>{count} projects shipped</strong>
}
```

## Finish line

<!-- ::start:quest difficulty="beginner" -->

Build a keyboard-friendly project filter and deploy the updated frontend.
<!-- ::end:quest -->

<!-- ::start:exercise -->

Try a filter with no matching projects. Keep the filter controls available and explain the empty state in ordinary text.
<!-- ::end:exercise -->

<!-- ::start:reward -->

Your practice goal is a small interface whose state, component boundaries, and keyboard behavior you can explain—not a score to collect.
<!-- ::end:reward -->
