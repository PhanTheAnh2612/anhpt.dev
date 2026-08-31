---
title: Starting a learning quest
date: 2026-08-31
description: Why this site treats notes as routes instead of a backlog of bookmarks.
---

# Starting a learning quest

Learning sticks when it leaves a trail. This site is my map: each route starts with a question, collects practical notes, and ends with something I can build or explain.

## A tiny rule

Write the next useful thing down before chasing the next shiny thing.

```tsx title="quest.tsx"
export const nextQuest = (question: string) => ({
  question,
  outcome: 'A small, working experiment',
})
```

The goal is not to complete every route. It is to keep moving with intention.
