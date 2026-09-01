# Base sprite atlas

## Source of truth

- Atlas: `public/assets/sprites/base-sprites.png`
- Dimensions: 1536×1024 RGB PNG
- Consumer: `src/components/shared/base-sprite.tsx`

The atlas is a labeled sheet with an opaque light background. Consume it with
CSS background crops. Do not render the complete sheet, and do not assume it
has transparency.

## Current crop registry

`BaseSprite` currently exposes:

| Name           |    x |   y | width | height | Intended use                     |
| -------------- | ---: | --: | ----: | -----: | -------------------------------- |
| `anhFront`     |   34 |  67 |    70 |    128 | Dialogue/profile character       |
| `anhThumbsUp`  | 1072 | 236 |    72 |    116 | Positive CTA or completion state |
| `guildHall`    |  558 | 510 |    56 |     58 | Guild Hall route/panel identity  |
| `qualityBadge` |  824 | 500 |    68 |     76 | Quality achievement              |

Coordinates use the original 1536×1024 image. Scaling must multiply the crop,
sheet size, and negative background position together. Keep this calculation in
`BaseSprite` rather than repeating inline CSS in routes.

## Adding a crop

1. Inspect the atlas at original resolution.
2. Choose a tight crop that excludes section labels, grid borders, and adjacent
   frames.
3. Add one named entry to the `sprites` registry in `base-sprite.tsx`.
4. Render it through `BaseSprite`; never add page-specific background-position
   CSS.
5. Visually inspect at every scale used. Reject the crop if atlas labels or
   neighboring sprites bleed into the box.

Use `image-rendering: pixelated`. A cream or muted panel background is suitable
when the crop retains the atlas's opaque light pixels.

## Boundary with sprite generation

This reference covers consuming the existing atlas. Use the separate
`sprite-generation` skill only when the user explicitly requests new sprite
art or new animation frames. Do not regenerate assets merely to build a page
that the current atlas supports.
