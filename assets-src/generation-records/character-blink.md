# Character blink

- Approved raw source: exec-eddc1e37-4679-4546-aa94-5d66e540b932.png, retained unchanged in this directory.
- Prompt direction: Matched idle silhouette with closed eyes; preserve Anh's red cap, black glasses, dark-red shirt, white cargo pants, black-orange shoes, backpack, and watch. Exact image-generation prompt remains in the parent task.
- Reference: approved idle identity; non-idle sources use it for wardrobe/proportion continuity.
- Extraction: magenta chroma-key including interior gaps and dark magenta edge spill. Alpha is binary. Foreground is cropped and nearest-neighbor fitted to 64x96 with a two-pixel margin, common bottom baseline y=94, anchor (50,100). No artwork redrawing.
- Sequence: two distinct images (open and closed eyes), 3000ms loop: nine repeated references to the same open image encode a 2700ms hold, followed by 300ms closed. References are timing holds, not fabricated new art frames.
- Review: silhouette and identity inspected, with preserved white trousers, transparent surrounding canvas, no checkerboard or labels. Review composite records 4x pixel rendering on emerald. Final application animation/crop review belongs to integration QA.
