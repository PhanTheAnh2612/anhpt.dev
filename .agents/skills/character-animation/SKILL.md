---
name: character-animation
description: Use when creating or reviewing a named anhpt.dev Anh animation sequence or extending the approved character-state library.
---

# Character Animation

Maintain one coherent, extensible Anh character library. Create or revise one
named animation sequence at a time; accepted sequences never require unrelated
frames to be regenerated.

## Registered initial states

The initial state registry is `idle`, `blink`, `talk`, `think`, `question`,
`point`, `teach`, `code`, `read`, `celebrate`, `success`, `error`, and
`run-loading`. Add a new state only when its name, purpose, and consuming UI
are declared before generation.

## Before prompting

1. Read [the shared art direction](../anhpt-art-direction/SKILL.md), then only
   the character, palette, composition, and originality references needed for
   the requested sequence.
2. Inspect accepted Anh sequences, character metadata, and generation records
   before prompting to preserve the approved adult identity, wardrobe,
   proportions, and lighting.
3. State the exact output paths and metadata before generation:
   `assets-src/character/<sequence>/<frame>.png` and
   `assets-src/generation-records/character-<sequence>.md`. Declare the
   sequence name, ordered frame list, transparent canvas dimensions,
   bottom-center anchor, duration, loop behavior, prompt, references, and
   review notes.

## Generate and validate one sequence

Generate one named animation sequence at a time. Every frame in that sequence
must use the identical transparent canvas, bottom-center anchor, lighting,
proportions, and palette. Review frames individually for silhouette clarity,
identity continuity, transparent margins, and pose continuity at their intended
display size.

Never ask the image model to pack the atlas or assign final coordinates. The
pipeline creates production atlases mechanically after visual approval.

Run the asset validation workflow to check PNG alpha, transparent corners and
margins, no halos/checkerboards/labels/neighbor bleed, and equal frame canvas
and anchor values. Stop for visual review before registering production output
or handing accepted frames to `asset-atlas-pipeline`.
