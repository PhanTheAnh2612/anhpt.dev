---
title: Use islands when most of a page is not interactive
date: 2026-09-10
description: Evaluate islands and partial interactivity against a full React application using page behavior, shared state, navigation, and JavaScript budgets.
tags: ReactJS
thumbnail: /assets/journal/react-components/islands-interactivity.webp
---

# Use islands when most of a page is not interactive

Islands architecture renders mostly static HTML and hydrates isolated interactive regions. It is a strong fit for content-led pages with a search box, menu, carousel, or configurator—not an automatic upgrade for an application whose regions coordinate continuously.

![A calm static archipelago contains a few illuminated interactive workshops connected only where shared behavior requires it.](/assets/journal/react-components/islands-interactivity.webp)

_Static content forms the landscape; JavaScript activates the few places where interaction begins._

## Start from the interaction map

Mark every region that needs browser state, event handlers, live subscriptions, or client navigation. Everything else is a candidate for server-rendered or static HTML. Then mark which interactive regions share state.

Independent newsletter signup, theme switcher, and code playground can be separate islands. A kanban board with shared drag state, keyboard navigation, optimistic mutations, and global filters is usually one application boundary even if its screen contains many boxes.

## Compare islands with React boundaries

An island is a framework-level hydration root. A React Server/Client Component boundary is part of one React application and framework protocol. Suspense is a reveal boundary. They may look similar in a diagram, but they have different ownership and communication costs.

Astro’s [islands documentation](https://docs.astro.build/en/concepts/islands/) describes independent UI components on an otherwise static page and hydration directives that choose when client JavaScript loads. Other frameworks implement partial hydration differently; verify their guarantees before reusing Astro terminology.

## Choose a hydration trigger intentionally

An interactive element visible at first paint may need immediate or idle hydration. A heavy visualization below the fold can wait for visibility. A rarely opened tool can load on interaction. The loading trigger must not block a basic action: a menu button that ignores the first click while its code downloads has a broken contract unless the trigger captures and completes that intent.

Keep an accessible HTML baseline. A product card should remain a link before its enhancement loads. Static article content should never require hydration to become readable.

## Budget communication between islands

Separate roots do not share React Context. They communicate through URL state, server state, DOM events, or an external store. Each bridge adds synchronization and testing work. If islands exchange frequent fine-grained state, the boundary is probably misplaced.

Also count duplicated runtime and library code. Framework tooling may deduplicate shared chunks, but do not assume ten islands mean ten free components. Inspect the production bundle and network trace.

## Use the architecture for a page, not a slogan

Choose islands when static content dominates, interactive regions are few and independent, and the framework can emit resilient HTML. Choose a cohesive React application when interaction dominates and state crosses the screen. Hybrid sites can use both on different routes.

<!-- ::start:quest difficulty="intermediate" -->

Print one page and circle every region that truly needs JavaScript. Draw lines between regions that share live state. Propose island boundaries, then reject any boundary whose communication or first-interaction cost exceeds the JavaScript it saves.

<!-- ::end:quest -->

The next article measures the resulting page with current Core Web Vitals and a critical loading sequence.
