# Registered sprite atlases

## Source of truth

- Reviewed source frames and metadata: `assets-src/character/` and
  `assets-src/content/`
- Production atlases: `public/assets/atlases/character.png` and
  `public/assets/atlases/content.png`
- Generated registry: `src/generated/sprite-manifest.ts`
- Generated layout rules: `src/generated/sprite-atlases.css`
- Consumers: `PixelSprite` and `PixelAnimation` in
  `src/components/shared/pixel-sprite.tsx`

The asset pipeline validates approved source records and packs production
atlases deterministically. It owns every frame rectangle, atlas dimension, CSS
offset, and animation keyframe. Never edit generated coordinates or add
page-local background-position rules.

## Consuming a registered sprite

Use `PixelSprite` for an explicit static frame and `PixelAnimation` for a
registered sequence. The generated manifest makes sprite names type-safe and
the runtime rejects unknown names or invalid frame indices. Supply a meaningful
`label` only when the artwork conveys content; otherwise the renderer keeps it
decorative with `aria-hidden`.

Scale through the component's `scale` prop. Keep layout, borders, and panel
backgrounds in the owning component's CSS rather than changing the generated
atlas stylesheet.

## Adding or changing artwork

1. Request new character frames through `character-animation` or semantic
   content art through `content-element-generation`.
2. Review and register the accepted source images and metadata under
   `assets-src/`.
3. Run `pnpm assets:validate`.
4. Run `pnpm assets:build` to regenerate atlases, manifests, and CSS.
5. Render the registered name through the shared runtime component and inspect
   every used scale on laptop and mobile.

Image generation produces source artwork only. It must never compose the
production atlas or assign final coordinates. The obsolete labeled base sprite
sheet and `BaseSprite` crop component are not part of the runtime.
