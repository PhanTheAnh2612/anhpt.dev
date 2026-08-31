---
name: component-storybook-docs
description:
    Write or update Storybook stories and a design guideline MDX doc for a primitive component. Produces 6 required
    stories and a 6-section design doc.
---

# Component Storybook and Docs

Use this skill whenever a primitive component needs Storybook stories and a design guideline document, or when existing
stories need to be brought up to the full required standard.

Component to document: $ARGUMENTS

## Output Contract

This skill produces two files:

| File         | Location                                         |
| ------------ | ------------------------------------------------ |
| Stories file | `stories/components/<ComponentName>.stories.tsx` |
| Design doc   | `stories/document/<ComponentName>.mdx`           |

Check `stories/components/` and `stories/document/` to confirm file naming conventions before writing.

## Procedure

### Step 1 — Read the Component Source

Read the component file (`app/components/shared/<component>.tsx`) and collect:

- All exported props and their types
- All CVA variants and their allowed values
- The compound sub-components (if any)
- Any Radix primitive it wraps (for accessibility notes)

### Step 2 — Write the Stories File

Create a CSF 3 stories file at `stories/components/<ComponentName>.stories.tsx`.

Required stories (minimum 6):

1. **Default** — minimal props, shows the base appearance
2. **All Variants** — one story per CVA variant axis OR a single `AllVariants` story using a grid layout
3. **States** — disabled, loading, error, empty, or other relevant states
4. **Composition** — demonstrate the compound sub-component API (if the component has one)
5. **Data-driven** — demonstrate the simple props API (if the component has one)
6. **Edge Cases** — long text overflow, missing optional props, boundary inputs

Story file skeleton:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '~/components/component-name';

const meta: Meta<typeof ComponentName> = {
    title: 'Components/ComponentName',
    component: ComponentName,
    tags: ['autodocs'],
    argTypes: {
        // document key props with controls
    },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
    args: {
        /* minimal */
    },
};
```

### Step 3 — Write the Design Guideline Doc

Create an MDX file at `stories/document/<ComponentName>.mdx` with **all six sections** in order:

#### Section 1: Usage

- One-paragraph description of what the component is and why it exists, and to show the component purpose and overview
- When to use it vs. related alternatives.
- Code snippets for each available API style (Composition API, Compound Component API, Data-Driven/Simple Props API).

#### Section 2: Anatomy

Show a table having two columns (Element and Description) - highlight main element of component.

For example: the anatomy for `Badge` component
| Element                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| Icon        | An optional leading icon that helps identify the badge type at a glance.               |
| Label       | <b>Required</b>: The text or number shown inside the badge.                       |

#### Section 3: API Selection Guide

A decision table telling consumers which API to reach for in which scenario:

| Scenario                 | Recommended API        |
| ------------------------ | ---------------------- |
| Static, simple usage     | Simple props API       |
| Need custom slot content | Composition API        |
| Full layout control      | Compound component API |

#### Section 4: Props Reference

A full table for every public prop including compound sub-component props in separate labelled tables.

| Prop      | Type     | Default | Description |
| --------- | -------- | ------- | ----------- |
| `variant` | `string` | —       | …           |

#### Section 5: Best Practices

- Table listing every Guidance (`Do` or `Don't`) and Practices
  
  
For example: the best practices of `Badge` component
| Guidance                 | Practices                                                                                                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Do`                     | Use a badge only when it adds meaning or context to a data point. Avoid using badges as decorative elements or to highlight common states that users can already infer from the interface. |
| `Don't`                  | Apply a "success" badge to every healthy/active/normal item. If all rows show green "Active" badges, none stand out; the badge adds noise, not information. Show only the states that need user attention (errors, warnings, pending actions). |


#### Section 6: Examples

Code snippets covering all realistic use cases — every variant combination that matters, accessibility attributes
(`aria-label`, `role`), keyboard interaction notes, and integration with form libraries if the component is an input.

## Quality Checks

- [ ] Stories file uses CSF 3 format with `tags: ['autodocs']`
- [ ] Minimum 6 stories covering: default, variants, states, composition, data-driven, edge cases
- [ ] Design doc contains all 6 required sections in order
- [ ] Props reference table covers 100% of public props including compound sub-components
- [ ] CSS variable table is complete and matches the component's theming step output
- [ ] No hard-coded mock data that would become stale — prefer simple inline fixtures
- [ ] Accessibility and keyboard interaction notes are present for interactive components
- [ ] Stories/MDX follow `.agent/rules/module-import-convention.md`
