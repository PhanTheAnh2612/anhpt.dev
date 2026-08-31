---
trigger: model_decision
description: Use this rule whenever implementing an approved phased feature checklist.
---

# Feature Phase Execution

Use this rule whenever implementing an approved phased feature checklist.

## Core Rule

Implementation proceeds one phase at a time.

## Execution Contract

- Read the checklist doc and identify the next incomplete phase.
- Expose sub-agents if possible to implement phases that can be done independently. (max 2 sub agents)
- Complete only the tasks assigned to that phase.
- Tick only the completed checklist items in that phase from `[ ]` to `[x]`.
- Always try to use `/loop` to validate the result by using generated test cases before moving to the next phase.

## Validation Scope

- Run the narrowest relevant validation for the current phase first.
- Do not broaden validation beyond the current phase unless the current phase depends on it.

## Phase Handoff

Every phase handoff should report:

1. Current phase completed
2. Checklist items ticked in that phase
4. Validation results for that phase

## Route / Page Work

- When route or page work is part of the current phase, also follow `.agent/rules/page-route-planning.md`.
