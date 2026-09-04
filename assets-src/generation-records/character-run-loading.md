# Character run-loading sequence

- Reviewed source: `chatgpt-character-actions-sheet-transparent.png`, a combined 4x2 RGBA action sheet generated in the ChatGPT browser and supplied by the parent agent. The earlier opaque draft remains only as provenance and is not a runtime source.
- Frames: top-third and top-fourth cells, in that order. The bottom alternates were not needed for the compact two-step loading loop.
- Purpose: a brisk two-frame running loop used while route content is loading.
- Normalization: each reviewed 384x512 transparent cell is separated mechanically and nearest-neighbor fit onto a transparent 96x96 canvas with a two-pixel bottom margin.
- Metadata: bottom-center anchor (50,100), 360ms, looping, fallback frame 0.
- Review: both frames were inspected individually at source size and normalized size. Identity and wardrobe are consistent, foot positions alternate clearly, transparent margins are clean, and no labels or neighboring-cell pixels remain.
