# Character point — unified refresh

- Shared source: `character-master-v3.png`, supplied and explicitly selected by the user as the canonical ten-pose sheet.
- Cells: row 1, columns 3–4, ordered A then B.
- Extraction: largest connected alpha silhouette removes neighbouring-cell overlap; nearest-neighbor fit to transparent 192x256, two-pixel bottom margin, bottom-centre anchor (50,100).
- Sequence: 800ms looping two-frame point.
- Review: arm change is readable, scale and identity remain coherent, and no neighbouring pixels remain.
