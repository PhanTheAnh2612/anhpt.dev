---
trigger: always_on
---

# Feature Architecture Rules

Use this rule whenever planning or implementing a feature component.

## Layer Placement

- Reusable primitives belong in `app/components/shared`.
- Domain-specific composition belongs in `app/components/features/`.
- Service calls belong in `app/services/`.
- Shared async orchestration belongs in `app/providers/`.
- Reusable consumer access belongs in `app/hooks/`.
- Validation for external input belongs in `app/schemas/` when needed.

## Form Architecture

- Follow `.agents/rules/react-hook-form-feature.md` for feature-form architecture.
- Default to a provider-owned `useForm()` for multi-section or domain-level forms.
- A simple, self-contained form may keep `useForm()` local inside the component when it does not need shared provider
  orchestration.

## Page Shape

- Pages belong in `app/pages/` and stay thin.
- Pages compose feature components, wire providers, and read route params only.
- Domain logic belongs below the page layer, not inline in the route/page module.

## Import Convention

- Follow `.agents/rules/module-import-convention.md` for all imports.
- Use dedicated module files, never top-level barrels from repo code.
