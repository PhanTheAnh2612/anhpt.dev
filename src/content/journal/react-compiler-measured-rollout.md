---
title: Adopt React Compiler with a measured rollout
date: 2026-09-10
description: Introduce React Compiler safely with current lint rules, incremental coverage, interaction tests, profiling, and reversible deployment gates.
tags: ReactJS
thumbnail: /assets/journal/react-components/compiler-rollout.webp
---

# Adopt React Compiler with a measured rollout

React Compiler 1.0 is stable, but “stable” does not mean “enable it and delete every `memo` call.” The compiler automatically memoizes compatible components and Hooks at build time. A safe adoption starts by enforcing the Rules of React, establishes behavioral and performance baselines, then expands compiled coverage through a reversible rollout.

![Component tiles pass through an optimization machine while one incompatible tile follows a safe unchanged bypass lane.](/assets/journal/react-components/compiler-rollout.webp)

_A skipped component still runs normally. Optimization coverage can expand after correctness and measurement are trustworthy._

A highlighted [r/reactjs thread about the Rust port of React Compiler](https://www.reddit.com/r/reactjs/comments/1tvdyvy/official_rust_port_of_the_react_compiler_is_now/) reflects real interest in faster, simpler build integration. Treat that port as evolving tooling, not as the reason to adopt. The production contract is the stable compiler described in the official [React Compiler 1.0 announcement](https://react.dev/blog/2025/10/07/react-compiler-1).

## Begin with code the compiler can trust

Compiler optimizations assume components and Hooks follow the Rules of React:

- rendering is pure and idempotent;
- props and state are treated as immutable snapshots;
- Hooks run unconditionally at the top level;
- side effects remain outside render;
- manual memoization is not secretly carrying correctness.

Upgrade `eslint-plugin-react-hooks` and resolve the compiler-powered diagnostics before chasing coverage. A component the compiler cannot optimize should still behave correctly; optimization is not a repair mechanism.

## Establish a baseline before rollout

Select several interactions that represent real cost: editing a large form, filtering a list, changing a dashboard control, and navigating between data-heavy routes. Record React Profiler traces, user-visible behavior, and end-to-end tests before enabling the compiler.

Do not expect every render count to fall. A render can be cheap, and network, layout, or an oversized list may dominate the interaction. The question is whether the measured user interaction improves without changing behavior.

## Roll out incrementally

For an established application, start with a feature or use annotation mode to opt in selected components:

```js title="babel.config.js"
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler',
      {
        compilationMode: 'annotation',
      },
    ],
  ],
}
```

Then mark a component or module with `"use memo"` while measuring the result. React's [incremental adoption guide](https://react.dev/learn/react-compiler/incremental-adoption) also documents directory-based rollout and runtime gating. Prefer project-level configuration; directives are temporary controls, not decoration for every function.

Keep the production `panicThreshold` at its recommended `none` value so unsupported components are skipped instead of breaking the build. Use `"use no memo"` narrowly when a known integration needs exclusion, and leave a reason that can be removed later.

## Keep manual memoization until evidence replaces it

Existing `memo`, `useMemo`, and `useCallback` calls may encode assumptions elsewhere—especially an Effect dependency that expects stable identity. Enable the compiler, run the behavioral suite, profile, and remove manual memoization in small batches.

Manual memoization remains useful for demonstrated boundaries, third-party APIs that require a stable reference, and computations whose performance has been measured. It should not be scattered through new components as a default ritual.

## Pin upgrades when coverage is weak

React recommends exact compiler versions when an application lacks strong test coverage because future compiler releases may change memoization decisions. Teams with continuous end-to-end coverage can upgrade through the usual tested dependency process; teams without it should pin and review upgrades intentionally.

The compiler targets React 19 by default. React 17 and 18 require the separate runtime package and an explicit target. Verify the current [compiler target configuration](https://react.dev/reference/react-compiler/target) before treating an older application like a React 19 build.

<!-- ::start:quest difficulty="advanced" -->

Choose one expensive interaction. Capture a baseline trace and behavioral test, compile only its feature, repeat the trace, and compare the result. Expand coverage only if behavior is unchanged; remove one manual memoization at a time and keep the rollback path until production evidence is stable.

<!-- ::end:quest -->

This completes the syllabus: design visible states, assign ownership, replace legacy patterns deliberately, choose delivery and loading boundaries, measure the real route, and optimize only after correctness is observable.
