---
name: asset-atlas-pipeline
description: Use when validating approved anhpt.dev source assets, packing deterministic atlases, generating manifests, or previewing registered animations.
---

# Asset Atlas Pipeline

This skill validates and mechanically assembles accepted source assets; it
does not generate artwork. It owns deterministic packing, generated metadata,
and animation previews—not prompting, scene design, or character posing.

## Before packing

1. Read [the shared art direction](../anhpt-art-direction/SKILL.md), then only
   the palette, character, composition, typography, and originality references
   needed to validate the approved asset type.
2. Inspect approved source assets, their generation records, and declared
   sequence/directive metadata before packing. Reject missing approval or
   incomplete metadata instead of reconstructing it.
3. State the exact outputs and metadata before running the pipeline:
   `public/assets/atlases/character.png`,
   `public/assets/atlases/content.png`, and, when reusable world objects
   exist, `public/assets/atlases/world.png`; generated scene/sprite manifests,
   TypeScript types, and CSS custom properties. Metadata records atlas
   dimensions, frame rectangles, anchors, sequence order, duration, and loop
   behavior.

## Validate, pack, and preview one accepted batch

Process one accepted scene pair, animation sequence, or semantic asset family
at a time. Run the asset validation workflow before packing: verify scene
dimensions and opacity; PNG alpha and transparent margins for sprites/content;
equal canvas dimensions and anchor positions within each animation sequence;
and required source metadata.

Pack deterministically from declared registry order. The pipeline may use
different rectangles for different sequences, but it generates every atlas
coordinate and CSS offset. Never manually edit production atlas coordinates.
Generate manifests and preview each animation at its declared frame duration
to confirm sequence order and coherence.

Stop for visual review before registering production output. If review rejects
an input, return it to the focused generation skill with the failure notes;
never modify the artwork in the pipeline.
