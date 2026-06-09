---
name: structured-prompt-compiler
description: Convert rough plain-language requests into structured Prompt Cards, Codex-ready implementation prompts, evaluation plans, writing briefs, analysis prompts, or AI risk review checklists. Use when the user asks to translate, improve, clarify, structure, rewrite, or operationalize a messy prompt, product idea, coding request, eval idea, AI use case, or vague task before giving it to another AI or coding agent.
---

# Structured Prompt Compiler

## Overview

Use this skill to turn an underspecified human request into a clear, reviewable Prompt Card. Preserve the user's intent, surface missing information, add safety boundaries, and produce a prompt that another AI or coding agent can act on.

## Workflow

1. Identify the request type: `general`, `coding`, `writing`, `analysis`, `ai-risk`, or `evaluation`.
2. Extract the user's real intent, known inputs, desired outputs, constraints, and success criteria.
3. Separate facts from assumptions. Mark assumptions explicitly.
4. Add safety boundaries for privacy, confidentiality, regulated advice, harmful instructions, and human review.
5. Decide whether to ask a question:
   - Ask only when a missing detail materially changes the work.
   - Otherwise proceed with a clearly labeled assumption.
6. Produce a Prompt Card using the schema in `references/prompt-card-schema.md`.
7. For mode-specific prompts, load only the needed reference:
   - Coding, writing, analysis, AI risk, and evaluation templates: `references/mode-templates.md`
   - Safety language and refusal boundaries: `references/safety-boundaries.md`
   - Example inputs and outputs: `references/examples.md`

## Output Rules

- Keep the output concise enough to be used directly.
- Do not invent source facts, customer details, credentials, data, citations, or business claims.
- Use mock or public examples when examples are needed.
- Do not include jailbreak, bypass, evasion, or unsafe operational instructions.
- For coding work, include implementation goal, expected files or components, tests, edge cases, and manual verification.
- For evaluation work, include expected behavior and observable pass/fail criteria.

## Default Output Shape

When the user does not request another format, return:

```markdown
## Prompt Card

**Intent**
...

**Context**
...

**Inputs**
...

**Outputs**
...

**Constraints**
...

**Acceptance Criteria**
...

**Open Questions**
...

**Safety Boundaries**
...

**Final Prompt**
...
```

## Quality Check

Before finalizing, verify:

- The final prompt is specific and actionable.
- Missing context is either asked about or labeled as an assumption.
- The output format is explicit.
- Safety boundaries are visible.
- A human can evaluate whether the result succeeded.
