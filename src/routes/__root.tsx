import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles/index.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { SiteNavigation } from '../components/features/site-shell/site-navigation'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'anhpt.dev — Frontend Ranger',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <main className="page-shell not-found-page">
      <section className="dialogue-box not-found-dialogue">
        <div className="avatar-crop" aria-hidden="true">
          <img src="/assets/art/anh-front-idle-v3.png" alt="" />
        </div>
        <div>
          <p className="eyebrow">A WILD 404 APPEARED!</p>
          <h1>This route is not on the map.</h1>
          <p>The trail ends here, but your learning journey does not.</p>
          <div className="hero-actions">
            <Link className="pixel-button" to="/journey">
              Back to world map
            </Link>
            <Link className="text-link" to="/">
              Return home →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <SiteNavigation />
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
