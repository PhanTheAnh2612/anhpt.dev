# Character idle — unified refresh

- Shared source: `character-master-v3.png`, supplied and explicitly selected by the user as the canonical ten-pose sheet.
- Cell: row 1, column 1. Relaxed front-facing idle with eyes open.
- Extraction: largest connected alpha silhouette, nearest-neighbor fit to transparent 192x256, two-pixel bottom margin, bottom-centre anchor (50,100). Runtime density normalization preserves the prior display footprint while retaining the higher-detail source.
- Review: identity, outfit, alpha margins, silhouette, and integration scale pass.
