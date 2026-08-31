---
name: provider-hook-storybook-docs
description:
    Write or update the Storybook MDX reference for a provider or hook in app/providers/** or app/hooks/**. Produces the
    standardized 5-section doc (Purpose, How to use, Selection Guide, Restriction / Dependency, Context value reference
    table) and registers it in the matching _index.mdx. Use whenever a provider/hook is added or its context/return
    shape, dependencies, or usage changes — and whenever another skill points here for provider/hook docs.
argument-hint: Provider/hook name, file path, or "all providers" / "all hooks"
---

# Provider / Hook Storybook Docs

The single source of truth for documenting a **provider** (`app/providers/**`) or **hook** (`app/hooks/**`) in
Storybook. This supersedes the generic MDX template in `api-doc-service-provider-hook` for the provider/hook layer.

Target: $ARGUMENTS

## Procedure

1. **Read the source** of the provider/hook and its real usages. Do not invent behavior — every claim must be backed by the
   code.
2. **Extract the context/return shape**:
    - Provider: the `createContext<…>` type (or the `Context` interface) and the `value={…}` object actually passed.
    - Hook: the `return { … }` object / declared return type.
    - For each field capture: **name**, **type** (the real TS type, simplified but accurate), **default** (initial
      context value, destructured default, or `—` if always supplied), **description** (what it is / when it changes).
3. **Determine restrictions & dependencies**: required wrapping provider(s), other hooks/providers it consumes, services
   hit, `QUERY_KEY_ID`s, the mount boundary (page vs feature), and any "must be used within X" guard.
4. **Write the MDX** at the correct path (below) with exactly the 5 sections, in order.
5. **Register** the doc in the matching `_index.mdx` learning path.
6. For `all providers` / `all hooks`, repeat per file; keep each doc self-contained.

## Output location & title

| Layer                                       | File                                   | `<Meta title>`                | Index                          |
| ------------------------------------------- | -------------------------------------- | ----------------------------- | ------------------------------ |
| Provider (`app/providers/<x>-provider.tsx`) | `stories/providers/<ProviderName>.mdx` | `Az Providers/<ProviderName>` | `stories/providers/_index.mdx` |
| Hook (`app/hooks/use-<x>.ts(x)`)            | `stories/hooks/<HookName>.mdx`         | `Az Hooks/<HookName>`         | `stories/hooks/_index.mdx`     |

`<ProviderName>` / `<HookName>` match the exported symbol casing (e.g. `CampaignsProvider`, `useCampaigns`). Create
`stories/hooks/` and `stories/hooks/_index.mdx` if missing (mirror the providers `_index.mdx` structure).

## Required MDX shape (exactly these 5 H2 sections, in order)

```mdx
import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Az Providers/ExampleProvider" />
{/* hooks: <Meta title="Az Hooks/useExample" /> */}

# ExampleProvider

## Purpose

- 1–3 bullets: what this layer owns and the problem it solves. What it explicitly does NOT own.

## How to use

- The wrapping contract + the consumer hook, as a minimal compilable snippet.
- **Imports:** follow `.agent-rules/shared/module-import-convention.md`.

\`\`\`tsx import { ExampleProvider, useExampleProvider } from '~/providers/example-provider';

function Content() { const { data, isLoading } = useExampleProvider(); return <div>{isLoading ? 'Loading…' :
data.length}</div>; }

export function Example() {
    return (
        <ExampleProvider>
            <Content />
        </ExampleProvider>
    );
}
\`\`\`

## Selection Guide

- When to reach for this vs. the alternatives (e.g. provider vs. calling the hook directly; this provider vs. a
  sibling). A short decision table is encouraged:

| Scenario                               | Use                                       |
| -------------------------------------- | ----------------------------------------- |
| Many components share the derived data | `ExampleProvider` + `useExampleProvider`  |
| One component needs the data once      | call the hook directly, skip the provider |

## Restriction / Dependency

- Required wrapping (e.g. "must be inside `AzProvider` + a `QueryClientProvider`").
- Providers/hooks/services it consumes; `QUERY_KEY_ID`(s) it reads/invalidates.
- Mount boundary (page/feature only, never inside primitives) and the `must be used within …` guard.
- Known constraints / partial-data or failure states consumers must handle.

## Context value reference

`useExampleProvider()` returns / the context value:

| Name        | Type                   | Default | Description                                      |
| ----------- | ---------------------- | ------- | ------------------------------------------------ |
| `data`      | `TransformedExample[]` | `[]`    | Derived rows; recomputed when `rawData` changes. |
| `isLoading` | `boolean`              | `false` | True while the underlying query is fetching.     |
| `refetch`   | `() => void`           | `—`     | Forces a refetch of the source query.            |

(For a hook, this table documents the **returned object**. List every public field — no omissions.)
```

## Rules

- **Exactly these 5 H2s, in this order**: `Purpose`, `How to use`, `Selection Guide`, `Restriction / Dependency`,
  `Context value reference`. Do not add or rename sections; extend an existing one instead.
- The **Context value reference is a table** with columns `Name | Type | Default | Description` covering **100%** of
  public context/return fields. Use `—` when there is no default (always supplied) or it is required.
- Examples must follow `.agent-rules/shared/module-import-convention.md`.
- `<Meta title>` casing matches the exported symbol. One MDX per provider, one per hook.
- Update the matching `_index.mdx`: add the new entry under the correct phase and keep numbering contiguous. If
  `stories/hooks/_index.mdx` does not exist, create it mirroring `stories/providers/_index.mdx`.
- Keep bullets one line; the docs are scanned, not read. Every statement must be verifiable in the source.

## Review checklist

- [ ] File at the correct path with the correct `<Meta title>` casing
- [ ] The 5 required H2 sections, in the exact order, nothing added/renamed
- [ ] Context value reference table covers every public field with Name/Type/Default/Description
- [ ] How-to-use snippet compiles and uses deep imports (no barrels)
- [ ] Restriction / Dependency names the required wrapping, consumed providers/hooks/services, and `QUERY_KEY_ID`s
- [ ] Registered in the matching `_index.mdx` with contiguous numbering
