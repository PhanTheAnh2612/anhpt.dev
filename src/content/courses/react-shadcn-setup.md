---
title: Start React with shadcn/ui
date: 2026-09-09
description: Create the Hotel Manager React project, initialize shadcn/ui, and build an accessible application shell from owned components.
order: 1
category: react
level: core
---

# Start React with shadcn/ui

React describes the interface as components. shadcn/ui supplies accessible component source code that becomes part of your project; it is not a sealed package whose design decisions you cannot inspect.

## Create and initialize the app

```sh title="terminal"
pnpm create vite hotel-manager --template react-ts
cd hotel-manager
pnpm install
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card badge table
pnpm dev
```

Accept the Vite and TypeScript defaults. The CLI creates `components.json`, installs the styling dependencies, and adds components under your configured UI path. Commit these files: your team owns and can modify them.

## Build the application shell

```tsx title="src/App.tsx"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function App() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header>
        <Badge variant="secondary">Front desk</Badge>
        <h1 className="mt-2 text-3xl font-semibold">Hotel Manager</h1>
        <p className="text-muted-foreground">
          Review rooms and manage guest stays.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Today</CardTitle>
        </CardHeader>
        <CardContent>No reservations loaded.</CardContent>
      </Card>
    </main>
  )
}
```

Keep page-specific components outside `components/ui`. That folder is for the primitives added by shadcn/ui; hotel concepts belong in feature folders such as `src/features/rooms`.

## Checkpoint

Reload the app, navigate with a keyboard, and locate the generated `Button` source. Change one style token and verify that the interface changes.

## Keep learning

- [shadcn/ui installation](https://ui.shadcn.com/docs/installation)
- [React: Your first component](https://react.dev/learn/your-first-component)
