# Reused semantic content icons

Approved extraction of existing raster art; no new artwork or SVG substitutes.

Source: base-sprites.png and its original base-sprites.css are preserved alongside this record. Crop rectangles in scripts/assets/import-generated-art.ts start from known stylesheet cells and were expanded after visual inspection to retain complete silhouettes without labels or neighbors. Intermediate crops are in content-crops/.

| Registered name      | Existing source metaphor         |
| -------------------- | -------------------------------- |
| content-note         | journal / open book              |
| content-warning      | notification exclamation balloon |
| content-remember     | backpack                         |
| content-quest        | world map                        |
| content-reward       | trophy                           |
| content-badge        | gold badge                       |
| content-success      | star fragment                    |
| content-locked       | state badge with lock            |
| content-current      | home                             |
| content-terminal     | code icon                        |
| content-architecture | database                         |
| content-resource     | course book                      |

Method: boundary-connected light-neutral background flood removal, binary alpha, tight foreground bounds, aspect-preserving nearest-neighbor fit within 28x28 on a transparent 32x32 canvas, bottom-center anchor (50,100), two-pixel bottom margin. All are honestly declared static one-frame loop:false sequences; duration is inert metadata, not a claimed animation.

Review: content-extraction-review.png inspected at 4x on emerald; no section labels or neighboring icons. White enclosed pages / highlights remain. The small original pixel-edge shading remains source art; no added antialiasing. No runtime atlas coordinates were hand-written.
