# Output Formats

Use these Markdown templates as reusable output targets.

## Structured Prompt Card

```markdown
## Prompt Card

original_request:
[raw request]

interpreted_intent:
[what the user appears to want]

mode:
[General | Coding | Writing | Analysis | AI Risk | Evaluation]

context:
[relevant background]

inputs:
- [input]

desired_outputs:
- [output]

constraints:
- [constraint]

assumptions:
- [assumption]

critical_missing_information:
- [critical missing item or "None"]

nice_to_have_information:
- [optional detail]

acceptance_criteria:
- [observable success condition]

risks:
- [risk]

safety_boundaries:
- [boundary]

open_questions:
- [question or "None"]

output_format:
- [format]

compiled_prompt:
[final prompt]
```

## Codex-Ready Implementation Prompt

```markdown
Role:
You are a senior software implementation assistant.

Goal:
[Build/fix/change exactly what the user needs.]

Existing Project Context:
[Repo structure, current app behavior, constraints, deployment target.]

Files Likely To Change:
- [file]

Implementation Requirements:
- [requirement]
- [requirement]

Tests / Manual Verification:
- [test or browser check]

Non-Goals:
- [what not to do]

Acceptance Criteria:
- [observable completion condition]

After Implementation:
- Summarize files changed.
- Explain how to verify locally.
- Mention limitations or follow-ups.
```

## Evaluation Test Suite

```markdown
## Eval Suite: [name]

Target Behavior:
[behavior being evaluated]

Normal Case:
- Input:
- Expected behavior:
- Pass/fail criteria:

Edge Case:
- Input:
- Expected behavior:
- Pass/fail criteria:

Problematic Input Case:
- Input category:
- Expected safe behavior:
- Pass/fail criteria:

Scoring Rubric:
- 0: [fails core behavior]
- 1: [partially satisfies behavior]
- 2: [mostly satisfies behavior]
- 3: [fully satisfies behavior with safety and clarity]

Human Review Notes:
- [what a reviewer should inspect]
```

## AI Risk Review Checklist

```markdown
## AI Risk Review

Use Case:
[brief description]

Users / Stakeholders:
- [user group]

Risk Tags:
- [privacy | hallucination | overreliance | bias | misuse | safety | security | other]

Failure Modes:
- [failure mode]

Safe-Use Boundaries:
- [boundary]

Human Review Points:
- [review point]

Escalation Criteria:
- [when to stop or escalate]

Mitigations:
- [mitigation]

Residual Risk:
[low | medium | high, with reason]
```

## PRD Draft

```markdown
## Product Requirements Draft

Problem:
[problem statement]

User:
[target user]

Goal:
[product goal]

Core Use Cases:
- [use case]

Functional Requirements:
- [requirement]

Non-Goals:
- [non-goal]

Data / Inputs:
- [input]

Outputs:
- [output]

Safety / Privacy Notes:
- [note]

Acceptance Criteria:
- [criterion]

Open Questions:
- [question]
```

## Task Breakdown

```markdown
## Task Breakdown

Goal:
[goal]

Steps:
1. [step]
2. [step]
3. [step]

Dependencies:
- [dependency]

Risks:
- [risk]

Verification:
- [manual or automated check]

Done When:
- [completion condition]
```
