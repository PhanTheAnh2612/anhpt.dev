# Character idle

- Approved raw source: exec-8fb6ac8b-a7a2-4650-bc79-0b87ed86b6c4.png, retained unchanged in this directory.
- Prompt direction: Front-facing neutral, open eyes, arms at rest; preserve Anh's red cap, black glasses, dark-red shirt, white cargo pants, black-orange shoes, backpack, and watch. Exact image-generation prompt remains in the parent task.
- Reference: approved idle identity; non-idle sources use it for wardrobe/proportion continuity.
- Extraction: boundary-connected light-neutral flood fill removes the painted checkerboard while preserving enclosed white trousers. Alpha is binary. Foreground is cropped and nearest-neighbor fitted to 64x96 with a two-pixel margin, common bottom baseline y=94, anchor (50,100). No artwork redrawing.
- Sequence: two distinct images (open and closed eyes), 3000ms loop: nine repeated references to the same open image encode a 2700ms hold, followed by 300ms closed. References are timing holds, not fabricated new art frames.
- Review: silhouette and identity inspected, with preserved white trousers, transparent surrounding canvas, no checkerboard or labels. Review composite records 4x pixel rendering on emerald. Final application animation/crop review belongs to integration QA.
