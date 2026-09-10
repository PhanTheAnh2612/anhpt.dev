---
title: Structure React projects by feature and dependency direction
date: 2026-09-10
description: Organize React code around product features, route boundaries, shared primitives, and one-way dependencies instead of universal folder folklore.
tags: ReactJS
thumbnail: /assets/journal/react-components/feature-structure.webp
---

# Structure React projects by feature and dependency direction

There is no official React folder structure because React does not know your product boundaries, router, data layer, or deployment model. A useful structure makes likely changes local and makes dependency direction visible. Start small, then group by feature when the code has earned a feature boundary.

![Feature districts each keep their component, hook, test, and data symbols near a small shared foundation.](/assets/journal/react-components/feature-structure.webp)

_Features own decisions; the shared layer stays small enough to remain genuinely shared._

## Use routes and features as change boundaries

A medium application might grow toward this shape:

```text
src/
├─ routes/
│  ├─ products.tsx
│  └─ products.$productId.tsx
├─ features/
│  └─ products/
│     ├─ components/
│     │  ├─ ProductCard.tsx
│     │  └─ ProductCard.test.tsx
│     ├─ product-query.ts
│     ├─ product-types.ts
│     └─ format-product-price.ts
├─ components/
│  └─ shared/
│     ├─ Button.tsx
│     └─ TextField.tsx
└─ lib/
   └─ money.ts
```

Routes compose a page and own route-specific loading. A feature contains the product language and decisions that usually change together. Shared components are domain-neutral primitives used by multiple features. `lib` contains small technical utilities, not a second dumping ground.

## Prefer inward dependencies

Use a simple rule:

```text
route → feature → shared primitive / technical library
```

![Application routes may import checkout and account features, and features may import shared code; cross-feature internals and reverse imports are blocked.](/assets/journal/react-components/diagrams/dependency-direction.svg)

_Imports flow toward code with fewer product-specific assumptions. A feature exposes a narrow public surface instead of letting another feature reach into its internals._

A shared `Button` must not import a checkout feature. A feature can import the button. When two features need the same domain behavior, first ask whether one feature actually owns it. Extract only after the shared meaning is stable.

Avoid barrels that make every import appear to come from one root while creating circular dependencies and broad rebuilds. Import from the defining module unless the package boundary deliberately exposes a public entry point.

## Keep related tests and styles close

Colocation reduces the distance between a contract and its proof. A component test next to the component is easier to discover during a change. End-to-end tests can live at the application boundary because they span multiple features.

Do not split one small component across `components/`, `hooks/`, `types/`, `utils/`, and `tests/` merely to satisfy file-type folders. That structure optimizes for what a file is instead of why it changes.

## Let the framework own framework boundaries

Modern React applications often rely on a framework for routing, data loading, streaming, Server Components or Functions, metadata, and bundling. Follow the chosen framework's server/client and route conventions rather than inventing parallel abstractions.

Create React App should no longer be the default recommendation for a new project. React officially deprecated it for new apps in 2025 and recommends a framework or a build tool such as Vite, Parcel, or Rsbuild when a framework is not appropriate. See [Sunsetting Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app).

Choose the project foundation from requirements:

- use a React framework when routing, server rendering, data loading, streaming, or server functions are product needs;
- use a focused client build when the application is client-only and you can own the missing production decisions;
- use a test sandbox only for examples, not as the architecture of a production app.

## Add rules only when they protect decisions

Useful automated boundaries include:

- features cannot import route modules;
- shared UI cannot import feature modules;
- server-only modules cannot enter a client bundle;
- public package entry points are explicit;
- circular dependencies fail the build.

An architecture diagram that is not enforced will drift. A rule that blocks ordinary work without protecting a decision will be bypassed. Keep both small.

<!-- ::start:quest difficulty="intermediate" -->

Take one feature change from the last month and list every file it touched. Move only the files that share that change reason into a feature boundary. Confirm dependencies point toward shared primitives, not back into routes or unrelated features.

<!-- ::end:quest -->

The next article chooses CSR, SSR, static rendering, or revalidation for each route before assigning data caches.
