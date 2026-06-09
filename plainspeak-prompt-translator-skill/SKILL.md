---
name: plainspeak-prompt-translator
description: Use when a user gives a messy or vague plain-language request and wants it converted into a structured, safer Prompt Card, Codex-ready implementation prompt, writing prompt, analysis prompt, AI-risk checklist, or evaluation test suite. Also use when designing reusable prompt-compilation workflows with modes, assumptions, clarification rules, safety boundaries, and acceptance criteria.
metadata:
  short-description: Turn messy requests into structured Prompt Cards
---

# PlainSpeak Prompt Translator Skill

PlainSpeak Prompt Translator Skill is a reusable prompt-compilation workflow. It helps an assistant turn messy plain-language requests into structured, safer, testable prompts while preserving the user's real intent.

This skill is the methodology layer behind the PlainSpeak Prompt Translator web demo. The web app is for humans to try the idea visually. This skill package is for AI assistants, coding agents, reviewers, and prompt designers who want to reuse the workflow in other contexts.

## What It Does

Use this skill to:

- Interpret a vague or messy user request.
- Classify the request into a practical mode.
- Extract the information needed for a high-quality prompt.
- Separate critical missing information from nice-to-have detail.
- Proceed with labeled assumptions when safe.
- Produce a structured Prompt Card.
- Add specialized outputs for coding, evaluation, writing, analysis, and AI-risk work.

The core artifact is a `PromptCard v0.1`. See [prompt-card-schema.md](references/prompt-card-schema.md).

## When To Use

Use this skill when the user:

- Gives a rough idea and asks how to tell an AI or coding agent what to do.
- Wants a clearer prompt from informal notes.
- Needs a Codex-ready implementation prompt.
- Wants a vague product or AI feature turned into eval cases.
- Needs safe-use boundaries or a risk review checklist.
- Wants bilingual prompt support, such as English prompt plus Chinese notes.
- Needs a reusable structured prompt card for review, copy, export, or registry storage.

## When Not To Use

Do not use this skill as the primary answer when:

- The user is asking for direct execution and the requirements are already clear.
- The user only needs a short rewrite or grammar fix.
- The request requires domain-specific licensed advice, such as medical diagnosis, legal advice, or investment recommendations.
- The user asks for jailbreaks, bypasses, evasion, harmful instructions, or unsafe examples.
- The user provides private, confidential, client, account, portfolio, medical, legal, or employer-sensitive data that should not be processed.

In sensitive cases, apply the safety boundaries first. See [safety-boundaries.md](references/safety-boundaries.md).

## Core Workflow

1. Identify the user's raw intent.
2. Classify the target mode: `General`, `Coding`, `Writing`, `Analysis`, `AI Risk`, or `Evaluation`.
3. Extract context, inputs, outputs, constraints, assumptions, success criteria, risks, and open questions.
4. Decide whether clarification is required.
5. Ask questions only when critical information is missing.
6. Otherwise proceed with clearly labeled assumptions.
7. Output a structured Prompt Card.
8. If the task is coding-related, also output a Codex-ready implementation prompt.
9. If the task is evaluation-related, also output eval cases and scoring criteria.
10. If the task is AI-risk-related, also output a risk review checklist.

## Mode Selection

Use the strongest match:

- `General`: broad task clarification, prompt cleanup, simple AI instruction design.
- `Coding`: building, editing, debugging, deploying, testing, or asking Codex to implement.
- `Writing`: drafting, rewriting, tone, audience, messaging, emails, docs, scripts.
- `Analysis`: reviewing reports, extracting insights, checking logic, comparing evidence.
- `AI Risk`: safe-use review, risk classification, failure modes, governance, human oversight.
- `Evaluation`: eval cases, scoring rubrics, expected behavior, quality gates.

Detailed templates are in [mode-templates.md](references/mode-templates.md).

## Clarification Policy

Ask a follow-up only when the missing information materially changes the output or could create safety risk. Do not ask for every missing detail. Prefer useful progress with labeled assumptions for low-risk tasks.

Use [clarification-rules.md](references/clarification-rules.md) to decide whether to ask or assume.

## Required Output

Always produce a Prompt Card with the `PromptCard v0.1` fields:

- `original_request`
- `interpreted_intent`
- `mode`
- `context`
- `inputs`
- `desired_outputs`
- `constraints`
- `assumptions`
- `critical_missing_information`
- `nice_to_have_information`
- `acceptance_criteria`
- `risks`
- `safety_boundaries`
- `open_questions`
- `output_format`
- `compiled_prompt`

For reusable Markdown templates, see [output-formats.md](references/output-formats.md).

## Quality Bar

A good PlainSpeak output should:

- Preserve the user's meaning instead of replacing it with a generic template.
- Be specific enough for another assistant or coding agent to act on.
- Show assumptions instead of hiding them.
- Separate blockers from optional improvements.
- Include safe-use boundaries.
- Define a visible output format.
- Include acceptance criteria or a review checklist.

## Examples

See [examples.md](references/examples.md) for coding, writing, analysis, AI risk, evaluation, and bilingual examples.
