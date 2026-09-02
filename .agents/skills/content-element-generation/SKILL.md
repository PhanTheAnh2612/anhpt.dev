---
name: content-element-generation
description: Use when creating or reviewing reusable anhpt.dev transparent content decorations for registered Markdown directives or compact topic icons.
---

# Content Element Generation

Create reusable transparent artwork that decorates typed React/Markdown
components. It is not a scene or character workflow, and it must not replace
editable semantic content.

## Registered semantic directives

The initial directive registry is `trainer-tip`, `note`, `warning`,
`remember`, `quest`, `challenge`, `exercise`, `quiz`, `reward`, `badge`,
`success`, `locked`, `current`, `code-example`, `terminal`, `architecture`,
and `resource`, plus decorative dividers and compact topic icons. Do not create
an asset for an unregistered directive without first declaring the directive,
its allowed attributes, and its consuming component.

## Before prompting

1. Read [the shared art direction](../anhpt-art-direction/SKILL.md), then only
   the palette, typography, composition, and originality references needed for
   the semantic asset family.
2. Inspect the registered directive/component, approved content assets, and
   generation records before prompting so the new family is reusable and does
   not duplicate an accepted element.
3. State the exact output paths and metadata before generation:
   `assets-src/content/<element>/<variant>.png` and
   `assets-src/generation-records/content-<element>.md`. Declare the
   directive or icon name, variants, transparent canvas dimensions, anchors,
   intended display sizes, prompt, references, and review notes.

## Generate and validate one family

Generate one semantic asset family at a time. Produce transparent decorative
artwork only; never embed headings, body text, code, difficulty labels, reward
values, readable text, or UI state that belongs in React/HTML.

Run the asset validation workflow for alpha, transparent margins, crisp pixel
edges, palette consistency, clear silhouettes, and intended display sizes.
Stop for visual review before registering production output or passing accepted
source files and metadata to `asset-atlas-pipeline`.
