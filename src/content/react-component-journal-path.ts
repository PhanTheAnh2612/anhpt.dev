export const reactComponentJournalPath = [
  {
    slug: 'react-components-design-from-states',
    reason:
      'Start with user-visible states and a small data model before drawing component boundaries.',
  },
  {
    slug: 'react-components-plan-boundaries',
    reason:
      'Turn the interface and data model into boundaries with explicit state ownership.',
  },
  {
    slug: 'react-components-design-composition-apis',
    reason:
      'Shape flexible component APIs with composition instead of multiplying configuration props.',
  },
  {
    slug: 'react-components-implement-accessibly',
    reason:
      'Implement the contract with semantic HTML, TypeScript, and complete interaction states.',
  },
  {
    slug: 'react-effects-synchronization-not-control-flow',
    reason:
      'Separate render calculations, user events, and synchronization with external systems.',
  },
  {
    slug: 'react-context-external-stores-subscriptions',
    reason:
      'Choose local state, Context, or an external-store subscription from explicit ownership and lifetime.',
  },
  {
    slug: 'react-events-reducers-middleware-commands',
    reason:
      'Translate Observer, Mediator, Middleware, and Command into visible events, pure transitions, and named effects.',
  },
  {
    slug: 'react-javascript-patterns-prototypes-factories-flyweights',
    reason:
      'Keep legacy JavaScript patterns as reading skills while preferring functions, modules, composition, and measurement.',
  },
  {
    slug: 'react-project-structure-by-feature',
    reason:
      'Place the finished component near the feature that owns its decisions and tests.',
  },
  {
    slug: 'react-rendering-modes-csr-ssr-static-isr',
    reason:
      'Choose client, request-time, static, or revalidated rendering from each route’s freshness and interaction contract.',
  },
  {
    slug: 'react-router-query-cache-ownership',
    reason:
      'Coordinate route intent with one cache owner before designing async reveal boundaries.',
  },
  {
    slug: 'react-components-async-boundaries',
    reason:
      'Design async, server, and client boundaries that keep every outcome understandable.',
  },
  {
    slug: 'react-streaming-hydration-server-components',
    reason:
      'Place streaming, hydration, Suspense, and Server Components around meaningful reveal and interaction boundaries.',
  },
  {
    slug: 'react-islands-partial-interactivity',
    reason:
      'Use partial interactivity when static content dominates and interactive regions can remain independent.',
  },
  {
    slug: 'react-core-web-vitals-loading-sequence',
    reason:
      'Measure LCP, INP, CLS, and the critical loading sequence before selecting an optimization.',
  },
  {
    slug: 'react-code-splitting-boundaries',
    reason:
      'Split code at route and optional-capability boundaries with stable pending and error states.',
  },
  {
    slug: 'react-load-visibility-interaction-intent',
    reason:
      'Load deferred code and data from visibility, interaction, or predicted intent according to cost and risk.',
  },
  {
    slug: 'react-tree-shaking-budgets-virtualization',
    reason:
      'Control shipped modules, route budgets, and mounted DOM before enabling build-time optimization.',
  },
  {
    slug: 'react-compiler-measured-rollout',
    reason:
      'Finish by adopting automatic memoization through linting, measurement, and a reversible rollout.',
  },
] as const

export const getReactComponentJournalOrder = (slug: string) =>
  reactComponentJournalPath.findIndex((step) => step.slug === slug)
