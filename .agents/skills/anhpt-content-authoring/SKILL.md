---
name: anhpt-content-authoring
description: Write or revise trustworthy, SEO-ready anhpt.dev learning and portfolio content, including courses, lessons, journal entries, skills, badges, mastery challenges, and category copy. Use when content must fit the repository's editable content model and teaching voice. Do not use for visual asset generation or unrelated product copy.
---

# anhpt.dev Content Authoring

Create useful public content that demonstrates Anh's engineering judgment while
remaining clear to learners and legible to search engines.

## Preserve the content model

- Inspect the target content source and its consuming component before writing.
- Treat files in `src/content/courses/` as individual lessons. `category` groups
  them into the Journey routes defined by `src/lib/learning-path.ts`; do not
  describe the category and lesson as if both were independent courses.
- Keep Journal entries in `src/content/journal/`, public skill/category copy in
  its existing typed content module, badges in `src/content/badges.ts`, and
  mastery tasks in `src/content/mastery-challenges.ts` unless the application
  model is deliberately being changed.
- Keep meaningful text editable and semantic. Never bake headings, labels,
  instructions, claims, or metadata into imagery.
- Reuse registered Markdown directives. Do not invent directive syntax or an
  unsupported frontmatter field.

Read [references/content-rules.md](references/content-rules.md) before creating
or substantially revising content. Read
[references/seo-editorial.md](references/seo-editorial.md) when the request
includes a new public page, search optimization, metadata, or a content audit.

## Evidence and integrity

- Use current primary documentation for technical claims that may have changed.
  Prefer specifications and official framework or platform documentation.
- Separate verified behavior, personal experience, recommendation, and opinion.
- Never invent employment details, credentials, dates, outcomes, performance
  numbers, client information, or completion status. Ask for facts that are
  essential; otherwise use neutral language or an explicit placeholder.
- Do not expose confidential systems, customers, dashboards, unreleased work,
  credentials, secrets, or exploitable security details.
- Make code examples coherent and runnable at the promised scope. State what is
  simulated, omitted, or environment-dependent.

## Authoring workflow

1. Identify the content type, reader intent, repository source, and existing
   related pages. Confirm whether the task is a draft, edit, review, or publish.
2. Choose one primary reader question and the smallest useful learning outcome.
   Gather evidence for unstable technical claims before drafting.
3. Draft using the relevant content contract and the site's direct, practical
   teaching voice. Prefer concrete examples, boundary cases, and tradeoffs over
   broad claims or RPG-flavored filler.
4. For technical Journal content, audit the whole related series before adding
   depth. Strengthen only entries with a real comprehension gap, using the
   smallest useful combination of an implementation, workflow diagram, worked
   trace, or failure matrix; do not lengthen every entry uniformly.
5. Apply the SEO editorial rules without keyword stuffing or weakening the
   lesson. Link to relevant internal content only when it helps the reader.
6. Check frontmatter, heading hierarchy, directive syntax, code, accessibility,
   factual support, privacy, and duplication against nearby content.
7. Run the repository's relevant checks when files changed. Report any content
   that is metadata-ready but not emitted by the current route implementation.

## Definition of done

The content answers a recognizable reader question, teaches or proves something
specific, matches its repository schema, makes only supportable public claims,
and has a unique search title/description direction. A technical series also
has enough concrete implementation and workflow evidence to explain its
highest-risk concepts without duplicating the same example across posts. It
remains useful when read without the pixel-RPG decoration.
