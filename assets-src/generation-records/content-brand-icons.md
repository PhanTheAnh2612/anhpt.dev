# Badge archive brand icon family

Status: accepted for production registration.

## Output contract

| Icon name               | Source path                                         | Canvas | Anchor | Intended display |
| ----------------------- | --------------------------------------------------- | ------ | ------ | ---------------- |
| content-brand-knorex    | assets-src/content/content-brand-knorex/icon.png    | 32x32  | 50,100 | 40-48 CSS px     |
| content-brand-educative | assets-src/content/content-brand-educative/icon.png | 32x32  | 50,100 | 40-48 CSS px     |
| content-brand-other     | assets-src/content/content-brand-other/icon.png     | 32x32  | 50,100 | 40-48 CSS px     |

Each icon is one transparent, static frame with two pixels of clear margin.
The family decorates semantic issuer text on the Badges page and never carries
the issuer name itself.

## Brand interpretation

- Knorex: an original interconnected signal/growth crest, informed by Knorex's
  public emphasis on cross-channel advertising, partnership, and its refreshed
  coral/orange identity. It must not copy the Krest mark.
- Educative: an original open learning console/book with a small code cursor,
  informed by Educative's blue developer-learning identity. It must not copy
  the Educative browser-window logo.
- Other: a neutral gold academy shield with a small star, usable for any
  remaining certificate issuer.

## Generation prompt

Create one horizontal sprite sheet containing exactly three separate compact
icons in this order: Knorex-inspired signal crest, Educative-inspired learning
console/book, generic academy shield. Original polished 16-bit-inspired pixel
art; crisp square pixel clusters; stepped dark outlines; restrained deep
emerald, forest green, warm cream, sparing gold, and muted red palette; one warm
directional light source; clear readable silhouettes at 32x32; transparent
background and generous separation between icons. The Knorex symbol uses coral
and orange linked signal nodes; the Educative symbol uses blue on an open book
or compact coding console; the generic symbol uses a gold shield and small
star. No gradients, blur, antialiasing, painterly texture, photorealism,
readable text, letters, logos, copied marks, copied interfaces, or watermark.

## Review notes

Generated with ChatGPT in Chrome on 2026-09-08. The accepted 2172x724 RGBA
source is preserved as `chatgpt-badge-brand-icons.png`; exact 724x724 source
cells are preserved in `content-brand-crops/`. Mechanical alpha normalization
produced foregrounds of 28x26, 28x21, and 25x28 on transparent 32x32 canvases.

Reviewed at source size and at 32x32. All three icons have clean transparent
margins, crisp stepped silhouettes, coherent upper-left highlights, and remain
distinct at intended display size. They contain no brand names, copied marks,
watermarks, or meaningful embedded copy. The angle-bracket cursor in the book
is a decorative coding glyph; issuer names remain semantic HTML.
