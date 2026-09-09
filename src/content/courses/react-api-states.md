---
title: Connect React to the hotel API
date: 2026-09-09
description: Load rooms and reservations, submit a booking, and show explicit loading, empty, success, and failure states.
order: 4
category: react
level: core
---

# Connect React to the hotel API

Network requests can be slow or fail. Treat those outcomes as interface states instead of logging errors and leaving the screen ambiguous.

## Centralize the API boundary

```ts title="src/lib/api.ts"
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}
```

Only variables prefixed with `VITE_` are intentionally exposed to Vite browser code. The API base URL is public configuration, not a secret.

## Load with an effect

Use an effect because the component is synchronizing with a network system. Do not use an effect to derive filtered rooms from existing state.

```tsx title="src/features/rooms/useRooms.ts"
useEffect(() => {
  const controller = new AbortController()
  api<Room[]>('/rooms', { signal: controller.signal })
    .then(setRooms)
    .catch((error) => {
      if (error.name !== 'AbortError') setError(error.message)
    })
  return () => controller.abort()
}, [])
```

After creating a reservation, request the affected lists again. This is deliberately simple and keeps the server as the source of truth.

Use shadcn/ui `Skeleton` while loading, `Alert` for a failure, and a plain explanatory message for an empty list.

## Checkpoint

Run the UI with the API available, stopped, slow, and returning an empty array. None of those states should produce a blank panel or unhandled promise rejection.

## Keep learning

- [React: Synchronizing with effects](https://react.dev/learn/synchronizing-with-effects)
- [shadcn/ui components](https://ui.shadcn.com/docs/components)
