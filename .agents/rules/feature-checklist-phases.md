---
trigger: model_decision
description: Use this rule whenever a feature plan or implementation checklist is created or updated.
---

# Feature Checklist Phases

Use this rule whenever a feature plan or implementation checklist is created or updated.

## Required Structure

Organize checklist work into explicit phases with clear review boundaries.

```md
## Phase 1 — <phase name>

### Implementation

Short prose describing what this phase changes, why the work is grouped together, and what must be true before moving to
the next phase.

### TODO

- [ ] T1.1 <task>
- [ ] T1.2 <task>

## Phase 2 — <phase name>

### Implementation

Short prose for the second phase.

### TODO

- [ ] T2.1 <task>
```

## Rules

- Include a prose implementation section for every phase.
- Include a checkbox TODO section for every phase.
- Use stable task IDs in `T{phase}.{sequence}` format.
- Keep task IDs stable once assigned.
- Make phase boundaries clear enough that implementation can stop for review after each phase.
- Do not merge tasks from different phases into one checklist block.
- Exact file changes may be listed inside the relevant phase when helpful.

## Implementation Handshake

- Planning creates the phased checklist.
- Implementation works one phase at a time.
- Completed tasks are ticked from `[ ]` to `[x]`.
- Later phases remain untouched until the current phase is reviewed and approved.
