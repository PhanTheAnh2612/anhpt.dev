---
trigger: model_decision
description: Use this rule whenever planning or implementing API-backed services, hooks, or providers.
---

# API Service and Query Conventions

Use this rule whenever planning or implementing API-backed services, hooks, or providers.

## Core Rules

- TanStack React Query is mandatory for API calls.
- Never call services directly from primitive or feature UI components.
- Always go through `useService(SomeService)` from `~/hooks/use-service` inside API hooks.
- Always use `QUERY_KEY_ID` from `~/constants/queryKeyId.ts` for `queryKey` arrays.
- Always narrow a service result with `isApiError` from `~/lib/serviceFactory` — never an inline
  `'errorCode' in response`.
- Toast failures with `toastV2` using the existing repo copy style.

## Service Rule

- Services live in `app/services/<feature>-service.ts`.
- Services use `createService`.
- Services may co-locate pure domain helpers, but no React logic.
- Every action carries a 30s default timeout. Set `timeout` on an action only when it is genuinely long-running (report
  generation, bulk upload); use `0` to opt out entirely.
- Leave `parallel` unset (the dedupe default) for anything driven by user input — typeahead, search, validation. Set
  `parallel: true` only when concurrent calls to the same action must all complete.

## Error Handling Rule

Service methods **never reject**. A failed request resolves with an `ErrorApiResponseType`, so every result must be
narrowed before use:

```ts
import { isApiError } from '~/lib/serviceFactory';

const response = await exampleService.get<ExampleResponse>({ path: { id } });
if (isApiError(response)) {
    toastV2.error(response.message);
    return null;
}
return response; // narrowed to ExampleResponse
```

- Never hand-roll the check. `'errorCode' in response` throws a `TypeError` on primitive payloads (`string`, `number`,
  `Blob`) and misfires on any payload that legitimately carries an `errorCode` field.
- Branch on `response.kind` (`http` | `timeout` | `network` | `canceled` | `unknown`) rather than parsing
  `response.message`.
- Use `isCanceledApiError(response)` to bail out quietly. A `canceled` result means the request was superseded by a
  newer call on a `parallel: false` action — it is not a failure and must not toast.
- `errorCode` is the HTTP status for `kind: 'http'`, `408` for timeouts, and `0` when no response arrived.

## Hook Rule

- API hooks live in `app/hooks/use-<feature>.ts`.
- Queries use `useQuery` / `useInfiniteQuery`.
- Mutations use `useMutation`.
- API hooks own service access, query keys, invalidation, and error-envelope handling.
- Heavy derived mapping belongs in sibling transform hooks, not in components.

## Query and Mutation Conventions

- Guard `enabled` with `Boolean(...)` when params may be absent.
- Prefer returning `{ isLoading, data }` at the consumer boundary.
- Invalidate queries with the same `QUERY_KEY_ID` family used by the read hooks.
- `refetchType: 'none'` is the default invalidation choice unless the spec requires immediate refetch.
- Handle both error envelopes (via `isApiError`) and thrown errors explicitly.
