---
title: Load React features on visibility, interaction, or intent
date: 2026-09-10
description: Choose lazy-loading and prefetch triggers from interaction risk, network cost, freshness, accessibility, and the likelihood that a user needs the resource.
tags: ReactJS
thumbnail: /assets/journal/react-components/loading-triggers.webp
---

# Load React features on visibility, interaction, or intent

After splitting code, decide when to start loading it. Visibility, interaction, hover or focus intent, idle time, and navigation prediction have different confidence and urgency. The right trigger minimizes waiting without spending bandwidth, leaking private intent, or causing a server-side action before the user asks.

![Resource parcels wait at three clear gates marked by an eye, a hand, and a forward trail, each opening at a different confidence level.](/assets/journal/react-components/loading-triggers.webp)

_Match loading cost to evidence: visible content is likely, a direct action is certain, and predicted navigation is useful only when it is safe._

## Load on visibility for near-future content

An `IntersectionObserver` can request code or data shortly before a below-the-fold region enters the viewport. Use a root margin so the resource arrives before the reader reaches it. Keep placeholders sized and informative, and disconnect observers after the load begins.

Visibility is a poor trigger for a primary hero or essential navigation: those resources should already be discoverable. It is useful for heavy demonstrations, secondary charts, comments, or media below the initial reading path.

## Load on interaction without losing the action

Interaction loading fits an expensive editor, picker, or preview that opens rarely. Prefer starting on `pointerenter` and keyboard `focus`, then render on click. If click is the first signal, preserve the click’s intent and show immediate pending feedback while the module loads.

Never make a keyboard user pay a later load than a pointer user. Focus is intent. Touch devices lack hover, so the direct activation path must remain complete.

## Prefetch when intent is likely

Route links can prefetch code and data on hover, focus, viewport entry, or a router-specific intent signal. Use cache freshness rules so a prefetched response is reusable. Cancel or deprioritize work where the platform supports it, and respect data-saving conditions.

Do not prefetch URLs whose GET request logs out, consumes a quota, sends a one-time password, or changes server state. GET must be safe independently of optimization. MDN’s [Speculation Rules guide](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API) also notes that the API remains limited in browser availability and distinguishes document speculation from subresource prefetching.

## Preload only critical known resources

Preload raises priority for a resource needed by the current page. Too many preloads compete with the truly critical chain and can make performance worse. Use it for a measured late-discovered font, image, style, or module—not as a list of everything the app may need.

React DOM exposes resource-hint APIs including `preconnect`, `preload`, `preloadModule`, and `preinitModule`; frameworks may call them for you. Review current [React DOM resource APIs](https://react.dev/reference/react-dom) before emitting duplicate hints.

## Record the trigger as part of the feature

For each deferred resource, document size, trigger, fallback, cache lifetime, and unsafe conditions. Revisit the decision with field data. A feature that becomes popular may graduate from click loading to intent prefetching; a large rarely used tool may move later.

<!-- ::start:quest difficulty="advanced" -->

Inventory five deferred resources. Assign each to immediate, visibility, focus/hover intent, activation, idle, or no preload. Test keyboard, touch, data-saver, cold-cache, and failed-download behavior for the most important boundary.

<!-- ::end:quest -->

The next article removes unused delivery work and controls the DOM cost of data that genuinely must remain available.
