---
trigger: model_decision
description: When integrate the new API or services that calling external APIs
---

# API Layer Responsibilities

Use this rule whenever mapping API docs/specs into repo layers.

## Layer Placement

| Layer     | Folder                                                       | Responsibility                                                                      |
| --------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Service   | `app/services/<feature>-service.ts`                          | `createService` endpoint descriptors and pure domain helpers                        |
| Errors    | `app/lib/serviceFactory.ts`                                  | `isApiError` / `isCanceledApiError` guards over the `ErrorApiResponseType` envelope |
| Types     | `app/types/<feature>.ts`                                     | Request and response types for the API contract by default                          |
| Schema    | `app/schemas/<feature>.ts`                                   | Zod schemas only when a trust boundary or form validation needs them                |
| Constants | `app/constants/<feature>.ts`, `queryKeyId.ts`, `pagePath.ts` | Enums, option maps, query keys, path builders                                       |
| API Hook  | `app/hooks/use-<feature>.ts`                                 | TanStack Query wrappers plus transform/form-init hooks                              |
| Provider  | `app/providers/<feature>-provider.tsx`                       | Shared data context or form provider when multiple consumers need one mount point   |

## Types vs Schema

- Default request and response declarations live in `app/types/<feature>.ts`.
- Do not create Zod schemas just to mirror every request/response contract.
- Use Zod in `app/schemas/` when:
    - a form needs validation,
    - external input crosses a trust boundary,
    - or the request shape is intentionally shared with validated form input.
- When form input and request shape are the same, infer the request type from the Zod schema instead of duplicating it.

## Provider Rule
d
- Skip the provider layer when only one feature component consumes the data.
- Add a provider when multiple components share derived API state or when a form spans components.

## Reuse Rule

- Check `docs/registries/providers-hooks.json` before creating a new provider or hook.
- Extend an existing service before creating a parallel one.
- Custom non-API hooks in `app/hooks/` must not import services.