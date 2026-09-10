---
title: Design React streaming, hydration, and Server Components
date: 2026-09-10
description: Place Suspense, streaming HTML, hydration, Server Components, and Client Components around meaningful reveal and interaction boundaries.
tags: ReactJS
thumbnail: /assets/journal/react-components/streaming-hydration-rsc.webp
---

# Design React streaming, hydration, and Server Components

Streaming, hydration, and React Server Components solve different parts of delivery. Streaming sends server-rendered HTML in stages. Hydration attaches client behavior to matching HTML. Server Components render outside the browser and can reduce client code. A good architecture connects them without pretending that every boundary is free.

![A server workshop sends an early page shell and later content parcels across a stream, while only interactive controls receive glowing client connections.](/assets/journal/react-components/streaming-hydration-rsc.webp)

_Reveal useful regions as they become ready, and hydrate only the interaction model your framework actually sends to the browser._

## Design the shell first

The shell is the useful content that can appear before slower regions finish: page identity, navigation, headings, stable controls, and layout. A Suspense fallback should reserve the final space and explain what is pending. It should not replace the whole page because one secondary request is slow.

React’s server streaming API can send the shell at `onShellReady`, then reveal nested Suspense regions as their content completes. The official [`renderToPipeableStream` guide](https://react.dev/reference/react-dom/server/renderToPipeableStream) also distinguishes Node streams from Web Streams runtimes.

## Keep hydration deterministic

Hydration expects the client’s first output to match the server HTML. Avoid branching during render on `window`, generating random IDs manually, or formatting time differently on server and browser. Use `useId` for stable React IDs, serialize the same initial data, and isolate genuinely browser-only content.

Do not silence a mismatch until you understand it. A mismatch can leave the visible HTML and event behavior describing different state.

## Server Components are not SSR components

A Server Component executes in the server build environment and is not sent as component JavaScript to the browser. It may read server-side data and pass serializable props to Client Components. A traditional component rendered by SSR may still ship and hydrate on the client.

The framework owns the Server Component bundler, protocol, routing, and cache integration. React’s [Server Components reference](https://react.dev/reference/rsc/server-components) documents the model; application code should follow its framework’s stable integration rather than assemble the transport manually.

Use a Client Component where browser state, event handlers, Effects, or browser-only APIs begin. Keep that boundary lower than an entire page when only a small control is interactive, but do not fragment the tree into dozens of tiny files solely to minimize a directive.

## Place Suspense around a reveal sequence

Good boundaries match how a reader understands the page:

```tsx
<ArticleShell>
  <ArticleBody article={article} />
  <Suspense fallback={<RelatedArticlesSkeleton />}>
    <RelatedArticles articleId={article.id} />
  </Suspense>
</ArticleShell>
```

The primary article does not disappear while recommendations load. Nested boundaries may reveal independently when that improves comprehension. Too many boundaries cause visual flicker and make error ownership unclear.

## Follow one request from response to interaction

<!-- ::start:architecture -->

```text
request
  ↓
server renders route
  ├─ article body ───────── ready
  └─ recommendations ───── pending behind Suspense
  ↓
HTML shell streams ───────> browser paints readable article
  ↓
recommendations resolve ──> server streams boundary content
  ↓
Client Component code ────> bookmark button hydrates and becomes interactive
```

<!-- ::end:architecture -->

The server API makes the shell boundary visible. This Node example streams ordinary SSR HTML; it does not implement the framework-owned React Server Component transport:

```tsx title="article-handler.tsx"
import type { IncomingMessage, ServerResponse } from 'node:http'
import { renderToPipeableStream } from 'react-dom/server'

export function handleArticle(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const stream = renderToPipeableStream(<ArticleRoute />, {
    onShellReady() {
      response.statusCode = 200
      response.setHeader('content-type', 'text/html; charset=utf-8')
      stream.pipe(response)
    },
    onShellError(error) {
      response.statusCode = 500
      response.end('The article could not be rendered.')
      reportRenderError(error)
    },
    onError(error) {
      reportRenderError(error)
    },
  })

  request.on('aborted', () => stream.abort())
}
```

`ArticleRoute` and `reportRenderError` are application-owned route and telemetry functions. The handler deliberately shows only the streaming lifecycle.

When the route uses Server Components, apply the same visible sequence but let the framework own Flight serialization, module references, caching, and client reconstruction. Do not copy this SSR handler and call it an RSC implementation.

## Plan failure and cancellation with the happy path

Streaming can fail before the shell, after the shell, or inside one boundary. Decide the HTTP status policy, the fallback users retain, and the logging context for each stage. Abort work when a request disconnects or exceeds its usefulness. A progressive interface is trustworthy only when its partial states are designed.

<!-- ::start:quest difficulty="advanced" -->

Draw one route as a shell plus reveal regions. Mark which components execute on the server, which ship client behavior, what data crosses the boundary, and what remains visible when each region is slow or fails.

<!-- ::end:quest -->

The next article compares this full-tree model with islands and other forms of partial interactivity.
