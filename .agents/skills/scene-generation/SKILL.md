---
name: scene-generation
description: Use when creating or reviewing an anhpt.dev responsive scene pair, normally environment-only, or the explicitly approved Guild Hall integrated-character hero scene.
---

# Scene Generation

Create static background pairs. Scenes establish atmosphere and composition;
DOM overlays provide all interaction and copy. They are environment-only except
for the narrowly defined integrated-character mode below.

## Before prompting

1. Read [the shared art direction](../anhpt-art-direction/SKILL.md), then only
   the palette, composition, and originality references needed for the scene.
2. Inspect approved scenes and their generation records so the requested
   location is distinct and compatible with the registered visual language.
3. State the exact output paths and metadata before generation:
   `assets-src/scenes/<scene>/desktop/<scene>.desktop.png`,
   `assets-src/scenes/<scene>/mobile/<scene>.mobile.png`,
   `assets-src/scenes/<scene>/<scene>.scene.json`, and
   `assets-src/generation-records/<scene>.md`. The scene metadata records both
   variant dimensions, focal area, overlay safe zones, character anchors,
   prompt, references, and review notes.

## Choose the scene mode

- **Environment-only** is the default for every scene. Registered sprites supply
  character activity when needed.
- **Integrated-character** is allowed only when the user explicitly requests a
  named page hero whose character and environment must share one lighting,
  scale, and rendering pass. Record that approval in the generation record.
  Guild Hall is the only currently approved integrated scene. Remove its
  scene-level sprite overlay after registration; unrelated character UI may
  continue using registered sprites.

## Generate one scene pair

Generate exactly one location pair at a time: a 1536x1024 desktop PNG and a
1024x1280 mobile PNG. Preserve the same location, time, palette, lighting,
and focal hierarchy across both variants. Reserve calm areas for HTML overlays
and registered sprite anchors; the background must remain useful when
animation is disabled.

Permanent terrain, buildings, furniture, shelving, trees, and ambient decor
are allowed. In environment-only mode, never include Anh or NPCs. In approved
integrated-character mode, include only the declared character and preserve the
canonical Anh identity. Neither mode may include UI, menus, labels, dialogue,
readable text, copied interfaces, or watermarks.

## Validate and register

Run the asset validation workflow for the scene pair. Confirm the required
dimensions, opaque PNG output, shared visual identity, safe areas, focal area,
and either absence of characters or exact approved character identity, plus
absence of UI and generated text. Stop for
visual review before approving or registering either production output.

After approval, hand the accepted source files and metadata to
`asset-atlas-pipeline`; do not invent atlas coordinates or ship unreviewed
intermediates to `public/`.
