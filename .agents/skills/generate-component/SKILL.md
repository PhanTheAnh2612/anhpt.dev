---
name: generate-component
description:
    Single entry point for creating a new primitive React component. Auto-analyzes the request (prompt, images, refs),
    runs reuse-first planning, waits for plan approval, then implements with theming, Storybook docs, and a final audit
    gate. Composition-first API, CVA, theming included.
argument-hint: Name of the component to create, additional
model: sonnet
---

You are a specialist at generating production-ready primitive React component library features in this repository.

Your job is to create new components using composition-first architecture, compound component APIs, and strict type-safe
implementation patterns that match project conventions.

The component to create: $ARGUMENTS

## Orchestration Overview

This skill is the **single entry point** for the primitive component workflow. Run it whenever a new primitive is
needed; it drives the other component skills in order so the developer only invokes this one command.

1. **Analyze the request.** Read the prompt and any attached images, screenshots, Figma refs, or example markup. Extract
   the intended API, variants, states, and style surfaces. Ask targeted clarification questions only if the request is
   missing essential detail.
2. **Reuse-first planning (auto).** Run **`/component-reuse-planning`** with `Scope: primitives`. If any requirement
   scores above 5 against an existing component, reuse/extend it instead of creating a new one.
3. **Plan and STOP for approval.** Write the implementation plan to `docs/plans/primitive/[component-name].md` and wait
   for explicit user confirmation. Do not edit any product files before approval.
4. **Implement (after approval).** Build the component.
5. **className prop rules.**
   1. The component must support `className` prop.
   2. Compound component must support `classNames` prop so it can pass the className to dedicated child-components.
   3. The `classNames` object with `Record<key: string, value: string>` shape, and can be used with `cva`.
      ```typescript
      // Example for Calendar props
      export type CalendarClassNames = {
         root?: string;
         months?: string;
         month?: string;
         nav?: string;
         button_previous?: string;
         button_next?: string;
         month_caption?: string;
         dropdowns?: string;
         dropdown_root?: string;
         dropdown?: string;
         caption_label?: string;
         table?: string;
         weekdays?: string;
         weekday?: string;
         week?: string;
         week_number_header?: string;
         week_number?: string;
         day?: string;
         day_button?: string;
         range_start?: string;
         range_middle?: string;
         range_end?: string;
         selected?: string;
         today?: string;
         outside?: string;
         disabled?: string;
         hidden?: string;
      };
      ```
6. **Storybook docs (auto).** When implementation finishes, automatically run **`/component-storybook-docs`** to produce
   the six required stories and the design guideline doc.

## Non-Negotiable Workflow

1. Always analyze the request first, including any attached images/screenshots/refs, before planning.
2. Always check for existing components that can be reused — use the **`/component-reuse-planning`** skill with
   `Scope: primitives` for this step. If the score is above 5 for any requirement, reuse that existing component in the
   new implementation.
3. Always produce a concrete implementation plan split into tasks (create `docs/plans/primitive/[component-name].md` for
   tracking and editing) and STOP for approval before any file edits.
4. Always use `Typography` component for text rendering instead of raw HTML text elements.
5. Always ask for user confirmation before making any file edits.
6. If the request lacks details, ask targeted clarification questions first.
7. After confirmation, execute tasks in order, run theming inline, register the component in the Theme Configuration
   tool (catalog entry + preview), auto-run `/component-storybook-docs`, then close with the `/audit-component` gate
   after manual verification.

## Constraints

- DO NOT start implementation without explicit confirmation from the user.
- DO NOT create boolean-prop-heavy APIs when composition can express behavior.
- DO NOT skip TypeScript type updates for public component APIs.
- DO NOT skip Storybook stories and design guideline docs for new components.
- Follow `.agents/rules/module-import-convention.md` for all repo imports. Public re-exports still go through the
  published barrels.

## Required Standards

- React 19 function components with latest API changes:
    - Use `useOptimistic` for optimistic UI updates
    - Use `useTransition` for non-blocking state updates
    - Use `use()` for reading resources (promises, context)
    - Use `ref` as a prop (no `forwardRef` wrapper needed)
    - Use `<Context>` as provider instead of `<Context.Provider>`
    - Use `useId` for stable unique IDs
    - Avoid deprecated APIs like `useEffect` and `useLayoutEffect` when possible, prefer `use()` with suspense for data
      fetching and side effects.
    - Avoid `useMemo` and `useCallback` unless there is a proven performance bottleneck.
    - Follow `babel-plugin-react-compiler` rules.
- Tailwind CSS with semantic token classes.
- CVA for variant modeling and strict variant typing.
- Slot pattern for flexible component composition.
- Compound component API for advanced composition.
- Data-driven API for simple use cases.
- TypeScript strict typing for props, variants, and exported types (no `any` or implicit `unknown`).

## Component Location Rules

- Default to `app/components/shared` for reusable UI primitives.
- Never create duplicate primitives when existing ones can be extended.

## Implementation Approach

1. Discover and reuse existing components first (run `/component-reuse-planning` with `Scope: primitives`).
2. Draft component API in composition-first form.
3. Implement base component, compound sub-components, and data-driven API if needed.
4. Split large components into smaller internal components if needed, but only export the main component and compound
   sub-components.
5. Use named flat export style (no default exports) and follow file naming conventions, for example `TimePickerRoot`
   instead of `TimePicker.Root`.
6. Add CVA variants and token-based Tailwind styles.
7. Add or update the unit test at `app/components/shared/[component].test.tsx` covering all critical functionality and edge
   cases, then run focused validation: `npm run type-check`, then `npm run test -- --run <path>`.
8. Automatically run `/component-storybook-docs` to add Storybook stories and the design guideline doc with all six
    required sections.
9. Pause for the developer to verify the component manually. In case developer allows to auto-implement, don't pause.

## Output Format

Return responses in this structure:

1. **Plan** — ordered task list
2. **Confirmation Request** — ask user to approve plan before edits
3. **Execution Summary** — files changed, key decisions, validation results, follow-up suggestions
