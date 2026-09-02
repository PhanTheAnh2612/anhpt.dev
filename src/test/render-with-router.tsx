import type { ReactNode } from 'react'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'

export async function renderWithRouter(ui: ReactNode, initialPath = '/') {
  const root = createRootRoute({ component: () => <>{ui}</> })
  const index = createRoute({ getParentRoute: () => root, path: '/' })
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    routeTree: root.addChildren([index]),
  })

  await router.load()

  return render(<RouterProvider router={router} />)
}
