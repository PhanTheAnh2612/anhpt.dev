# SEO editorial rules

Optimize for the reader's question first. Search readiness comes from a clear
topic, useful coverage, semantic structure, accurate metadata, and connected
content—not repeated keyphrases.

## Search intent and topic choice

- Define one primary query-shaped question and the reader who asks it. Record a
  secondary question only when the same page can answer it without losing focus.
- Inspect existing courses and journal entries before drafting. Expand or link
  an existing page when a new page would target substantially the same intent.
- Prefer a narrow page that resolves a task over a broad survey that merely
  names many technologies.
- Do not invent search-volume, ranking, or competitor claims. Use actual research
  when the user requests keyword or competitive analysis; otherwise make a
  clearly labeled editorial inference from the topic and audience.

## On-page requirements

- Put the subject and differentiating outcome naturally in the title, first
  paragraph, and at least one useful section heading. Exact repetition is not
  required.
- Use one descriptive `h1` and nested headings that form a useful outline. A
  reader scanning only the headings should understand the lesson's progression.
- Answer the central question early, then add explanation, examples, edge cases,
  and tradeoffs. Avoid delaying the answer for a long narrative introduction.
- Use lists, tables, or code only when they make a relationship easier to
  understand. Add adjacent prose that explains their purpose.
- Link to relevant Journey, lesson, journal, or mastery pages using descriptive
  anchor text. Avoid forced links and orphaned content. Prefer the canonical
  internal URL and do not add tracking parameters.
- Cite authoritative primary sources for specifications, APIs, security advice,
  and version-sensitive framework behavior. Link directly to the supporting
  page, not a search result.

## Metadata contract

For Markdown content, the existing `title` and `description` frontmatter are the
source editorial fields. Keep each combination unique across published pages.

- SEO title direction: specific topic + useful distinction; normally about
  50–60 characters when natural. The UI title may remain shorter if the route
  later adds a separate maintained SEO field.
- Meta description direction: a truthful summary and outcome, normally about
  120–160 characters. It is preview copy, not a list of keywords or a guarantee
  that a search engine will display it.
- Slug: human-readable, lowercase, hyphenated, stable, and free of dates unless
  the date is essential to the topic. Avoid stop-word removal that makes it
  cryptic.
- Dates: use real publication or meaningful revision dates consistently. Never
  update a date solely to imply freshness.

The current dynamic course and journal routes may not emit entry-specific title,
description, canonical, Open Graph, or structured data. When publishing or
auditing content, inspect the route implementation. Report missing emission as
an implementation gap; do not claim the frontmatter alone completes technical
SEO. Add new frontmatter fields only by deliberately extending and consuming the
typed `ContentEntry` contract.

## Trust, freshness, and structured data

- Show first-hand value through original examples, constraints, observations,
  and explicit tradeoffs. Do not simulate personal experience or credentials.
- Date-sensitive claims must name the relevant version or be rechecked against a
  current primary source. Flag content whose accuracy depends on future review.
- Do not add FAQ, Course, Article, Person, or other JSON-LD merely to pursue rich
  results. Structured data must match visible content and the page's real type;
  its implementation belongs in route/code work, not hidden Markdown.
- Do not claim a lesson is a formal course, credential, or award unless the user
  actually provides that program and the page satisfies the claim.

## Accessibility and indexable quality

- Preserve meaningful text in HTML/Markdown rather than images, CSS, or
  client-only interactions. Examples should remain understandable without the
  decorative scene.
- Use descriptive headings and link text, text alternatives for meaningful
  images, captions or transcripts for instructional media, and tables with real
  headers.
- Avoid near-duplicate pages, empty category pages, placeholder copy, and pages
  whose useful information exists only after an interaction.

## SEO review output

For each reviewed page, report:

1. Primary reader intent and whether the page satisfies it.
2. Proposed title, description, and slug only when a change is useful.
3. Missing or weak sections, unsupported claims, and duplication risk.
4. Relevant internal links and primary external sources.
5. Technical gaps separately from editorial changes; do not promise ranking.
