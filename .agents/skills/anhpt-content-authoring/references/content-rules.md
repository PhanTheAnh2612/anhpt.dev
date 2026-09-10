# Content rules

## Shared voice

Write as an experienced engineer teaching from practice: calm, specific,
compact, and honest about tradeoffs. Address the reader directly when giving an
action. Prefer plain English and concrete verbs. Use the RPG language as light
navigation flavor—lesson, route, checkpoint, quest, finish line—not as a layer
that obscures technical meaning.

Avoid inflated authority, motivational filler, fake urgency, keyword repetition,
and phrases such as “ultimate guide,” “master instantly,” or “best practice”
without context. Expand an acronym on first use unless the intended reader can
reasonably be expected to know it.

## Syllabus lessons (`src/content/courses/*.md`)

Required frontmatter:

```yaml
---
title: Clear lesson title
date: YYYY-MM-DD
description: One specific outcome or problem the lesson addresses.
order: 1
category: fundamentals
---
```

- The filename is the public slug: lowercase, hyphenated, stable, descriptive,
  and normally 3–6 words. Changing it changes the URL; preserve existing slugs
  unless redirects are in scope.
- `category` must be one value from `src/lib/learning-path.ts`. `order` is the
  lesson's sequence inside that category.
- `title` should name the actual topic or outcome, usually 45–65 characters and
  never padded merely to reach a length.
- `description` should stand alone in cards and search snippets. Aim for roughly
  120–160 characters when natural; describe a concrete benefit, task, or
  distinction without repeating the title word for word.
- Use one Markdown `#` heading matching the visible title, then descriptive `##`
  sections in a logical sequence. Do not skip heading levels.
- Open with the reader's problem, desired result, and scope. Teach the minimum
  concepts needed, then show a complete-enough example and a realistic edge or
  failure case.
- End with an actionable checkpoint. When a mastery entry exists, make the
  lesson checkpoint and mastery tasks reinforce the same outcome rather than
  duplicate identical wording.

Useful lesson shape, adaptable rather than mandatory:

1. Outcome and prerequisites.
2. A small mental model.
3. A working example.
4. A boundary, failure mode, or tradeoff.
5. A checkpoint the reader can verify.

## Journal entries (`src/content/journal/*.md`)

Required frontmatter:

```yaml
---
title: Specific observation or technique
date: YYYY-MM-DD
description: The question answered and why it matters.
tags: ReactJS, Accessibility
---
```

- Use comma-separated canonical display tags already present in the repository,
  such as `ReactJS` and `Auth`. Prefer 2–5 precise terms over synonyms added
  only for search coverage; tag matching is case-sensitive.
- A journal entry may be narrower, more exploratory, or more opinionated than a
  lesson, but it must make the evidence and limits of the conclusion clear.
- State version or date context when framework behavior is version-sensitive.
- Review a related tag or syllabus as a set before expanding individual posts.
  Deepen the entries where a reader cannot yet reproduce the method, trace the
  workflow, or reason about failure. Leave focused entries compact when they
  already answer their question.
- For security content, make trust boundaries, token or credential ownership,
  state transitions, replay behavior, and recovery paths explicit. Never imply
  that a browser, backend, identity provider, or workload owns secret material
  that the chosen architecture assigns elsewhere.
- For React performance and rendering content, show at least one observable
  path from trigger or request to user-visible result. Distinguish framework
  behavior from portable React or browser behavior.

## Journey categories and public skills

- Category copy describes a coherent learning route, not a proficiency claim.
  Give the domain, learner outcome, and boundary in one or two sentences.
- Skill copy should describe observable capability: what Anh can design, build,
  diagnose, explain, or improve. Pair technology names with decisions and
  outcomes; avoid self-ratings, vague adjectives, and unsupported mastery.
- Distinguish “uses,” “has practiced,” “completed coursework in,” and “delivered
  professionally.” Do not silently upgrade one level into another.
- Keep labels consistent with canonical technology spelling, such as React,
  TypeScript, NestJS, PostgreSQL, and Cloudflare.

## Mastery challenges and rewards

- Use 2–4 tasks that progress from build, to test, to explain or evaluate.
- Every task needs an observable completion condition. Include normal, empty,
  failure, accessibility, or security cases when relevant.
- A reward is the practical artifact or understanding produced—not points,
  certification, employment proof, or a skill the site claims to award.
- Keep each title short and each description to one concrete action plus its
  verification condition.

## Badges and credentials

- Publish only user-supplied or independently verifiable issuer, title, date,
  credential URL, and status.
- Describe exactly what the badge recognizes. Do not infer rank, expertise,
  score, or professional impact from the credential.
- Link to the most specific public verification page available. Do not publish
  private credential identifiers unless the user explicitly approves them.

## Markdown and examples

- Use registered directives only: `trainer-tip`, `note`, `warning`, `remember`,
  `quest`, `challenge`, `exercise`, `quiz`, `reward`, `badge`, `success`,
  `locked`, `current`, `code-example`, `terminal`, `architecture`, and
  `resource`. Inspect `src/lib/markdown-extensions.ts` for allowed attributes.
- A directive supplements the prose; it must not contain the only explanation
  of a prerequisite, warning, or task.
- Give code fences the correct language and a useful filename when supported.
  Keep samples focused, internally consistent, accessible, and free of secrets.
- Explain why the example works and what it omits. Include destructive commands
  only when necessary, clearly scoped, and paired with the relevant caution.
- Use an `architecture` directive for text-native workflows and trust-boundary
  diagrams. Keep labels semantic and understandable in the raw Markdown; a
  diagram must clarify sequence or ownership rather than decorate the page.
- Prefer one complete-enough vertical slice over several disconnected snippets.
  Name app-owned helpers and framework-specific assumptions. Pair security and
  asynchronous examples with at least one failure, cancellation, expiry, or
  retry path when that behavior changes correctness.
- Worked traces and comparison tables must label illustrative measurements as
  examples, not as observed production results.
- Use descriptive link text that makes sense out of context. Do not use repeated
  “click here” links.

## Editorial acceptance check

- Frontmatter parses and matches the correct content type.
- Dates and public claims are verified; placeholders are obvious.
- The title, introduction, headings, and checkpoint describe the same intent.
- Examples support the stated audience and have no unexplained critical step.
- High-risk concepts have an implementation, workflow, worked trace, or failure
  matrix chosen for comprehension—not a quota—and code is coherent at its
  stated scope.
- Series entries complement rather than repeat one another; intentionally
  omitted detail is either unnecessary for the question or routed elsewhere.
- Nearby content is linked or consolidated when the new draft would duplicate it.
- Language is inclusive, readable, and free of needless idiom.
