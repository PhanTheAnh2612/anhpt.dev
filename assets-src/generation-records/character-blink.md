# Character blink — unified refresh

- Shared source: `character-master-v3.png`, supplied and explicitly selected by the user as the canonical ten-pose sheet.
- Cell: row 1, column 2. Same idle identity and stance with eyes closed.
- Extraction: largest connected alpha silhouette, nearest-neighbor fit to transparent 192x256, two-pixel bottom margin, bottom-centre anchor (50,100).
- Sequence: nine open-frame timing holds followed by one closed frame; 3000ms loop.
- Review: blink reads at display size without identity, wardrobe, or baseline drift.
