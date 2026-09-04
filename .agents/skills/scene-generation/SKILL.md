---
name: scene-generation
description: Use when creating or reviewing an anhpt.dev environment-only desktop and mobile background pair with scene metadata.
---

# Scene Generation

Create static environment-only background pairs. Scenes establish atmosphere
and composition; DOM overlays and registered sprites provide all interaction,
copy, and character activity.

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

## Generate one scene pair

Generate exactly one location pair at a time: a 1536x1024 desktop PNG and a
1024x1280 mobile PNG. Preserve the same location, time, palette, lighting,
and focal hierarchy across both variants. Reserve calm areas for HTML overlays
and registered sprite anchors; the background must remain useful when
animation is disabled.

Permanent terrain, buildings, furniture, shelving, trees, and ambient decor
are allowed. This skill is environment-only: never include Anh, NPCs, dynamic
props, UI, menus, labels, dialogue, or readable text.

## Validate and register

Run the asset validation workflow for the scene pair. Confirm the required
dimensions, opaque PNG output, shared visual identity, safe areas, focal area,
and absence of characters, dynamic objects, UI, and generated text. Stop for
visual review before approving or registering either production output.

After approval, hand the accepted source files and metadata to
`asset-atlas-pipeline`; do not invent atlas coordinates or ship unreviewed
intermediates to `public/`.
