---
trigger: model_decision
description: Use this rule whenever planning or implementing form state in feature work. All form must utilize React Hook Form although it's just a small feature
---

# React Hook Form Feature Rules

Use this rule whenever planning or implementing form state in feature work.

## Default Pattern

Use the repo’s settled feature-form pattern:

- A domain Context provider in `app/providers/` owns one `useForm()` instance.
- Validation uses `zodResolver` with schemas in `app/schemas/`.
- Feature form sections render through reusable `*Field` components in `app/components/`.
- The page stays thin and wires submit to the relevant hook/mutation.

## Simple Form Exception

If the form is not complicated, it may stay local inside the component instead of creating a Context/provider.

Use a local form when all of these are true:

- The form is single-purpose and self-contained.
- It does not span multiple feature sections or sibling components.
- It does not need shared domain handlers or cross-section orchestration.
- It does not need page-level provider wrapping for reuse.

Even for local forms:

- Use `zodResolver`.
- Prefer existing `*Field` components.
- Follow `.agent/rules/module-import-convention.md`.

## Non-Negotiable Rules

1. Use one `useForm()` per form.
2. For multi-section or domain-level forms, `useForm()` lives in a provider.
3. Do not use `register()` for feature-form fields; use `Controller` directly or through existing `*Field` wrappers.
4. Do not use `FormProvider` / `useFormContext`; access form state through the domain hook for provider-based forms.
5. Read values with `useWatch(...)`, not `form.watch()` in render.
6. Programmatic writes belong in provider handlers for provider-based forms, not scattered across feature components.
7. Validation is zod-first.
8. Keep page render paths thin and pure.

## Reuse Rule

Before adding field UI, check whether an existing `*Field` already fits. Extend existing field primitives before adding
new ones.
