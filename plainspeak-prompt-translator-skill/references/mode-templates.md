# Mode Templates

Use these templates after identifying the user's raw intent.

## General

**Purpose:** Convert a vague request into a clear, structured AI instruction.

**Typical user requests:**

- "Make this better."
- "Help me ask ChatGPT this."
- "Turn my idea into a prompt."

**Extraction focus:**

- Intent
- Task
- Context
- Output format
- Constraints
- Missing information
- Safety boundaries

**Default assumptions:**

- The user wants a practical prompt, not a long essay.
- If risk is low, proceed with labeled assumptions.

**Output structure:**

- Prompt Card
- Final compiled prompt
- Optional clarification questions

**Quality checklist:**

- Is the user's meaning preserved?
- Is the task actionable?
- Are assumptions visible?
- Is the output format clear?

## Coding

**Purpose:** Create an implementation-ready prompt for Codex or another coding agent.

**Typical user requests:**

- "Build me a small dashboard."
- "Make a recipe tutorial website."
- "I want an app that uploads PDFs and turns them into a quiz site."

**Extraction focus:**

- Product goal
- Existing project context
- Target platform
- File structure
- Features
- Data model
- Non-goals
- Tests and manual verification
- Deployment expectations

**Default assumptions:**

- Prefer the existing project style.
- Keep v1 scoped.
- Use static files if the user asks for GitHub Pages or a no-backend demo.
- Ask only if missing information blocks implementation or verification.

**Output structure:**

- Prompt Card
- Codex-ready implementation prompt
- Acceptance criteria
- Manual verification steps

**Codex-ready prompt structure:**

```markdown
Role:
You are a senior software implementation assistant.

Goal:
[Specific implementation goal.]

Existing Project Context:
[Framework, file structure, constraints, deployment target.]

Files Likely To Change:
- [file or directory]

Implementation Requirements:
- [requirement]
- [requirement]

Tests / Manual Verification:
- [test or manual check]

Non-Goals:
- [what not to build in v1]

Acceptance Criteria:
- [observable success condition]
```

**Quality checklist:**

- Can Codex act without guessing core requirements?
- Are files likely to change named?
- Are non-goals clear?
- Are tests or manual checks included?
- Is the scope small enough for a first implementation?

## Writing

**Purpose:** Clarify audience, tone, purpose, structure, and call to action.

**Typical user requests:**

- "Make this sound more professional."
- "Write a short announcement."
- "Turn this into a LinkedIn post."

**Extraction focus:**

- Audience
- Purpose
- Tone
- Length
- Channel
- Key points
- Claims that need support

**Default assumptions:**

- Preserve the user's intent.
- Avoid inventing credentials, names, results, or private details.
- Ask only when audience or purpose changes the writing materially.

**Output structure:**

- Prompt Card
- Writing prompt
- Optional draft outline

**Quality checklist:**

- Is the audience named?
- Is the tone appropriate?
- Are claims supportable?
- Is the requested length or format clear?

## Analysis

**Purpose:** Structure analysis without overclaiming or giving inappropriate advice.

**Typical user requests:**

- "Review this report for logic issues."
- "Check whether this analysis makes sense."
- "Summarize the evidence and flag uncertainty."

**Extraction focus:**

- Source material
- Analytical question
- Evidence
- Assumptions
- Uncertainty
- Decision context
- Sensitive data boundaries

**Default assumptions:**

- Use only provided or public information.
- Flag uncertainty.
- Separate observations from recommendations.
- Avoid investment, legal, or medical advice unless framed as general educational information.

**Output structure:**

- Prompt Card
- Analysis prompt
- Review checklist

**Quality checklist:**

- Does the prompt require evidence?
- Does it avoid unsupported conclusions?
- Are sensitive data boundaries clear?
- Are uncertainties and limitations explicit?

## AI Risk

**Purpose:** Classify risks, failure modes, and safe-use controls for an AI use case.

**Typical user requests:**

- "Is this AI classroom use case safe?"
- "What can go wrong with this AI feature?"
- "Create a risk checklist."

**Extraction focus:**

- Users
- Context
- Model behavior
- Failure modes
- Misuse risk
- Privacy risk
- Human review
- Escalation criteria

**Default assumptions:**

- Keep examples educational and defensive.
- Do not include jailbreaks, bypasses, evasion, or harmful instructions.
- Prefer review checklists over alarmist language.

**Output structure:**

- Prompt Card
- AI risk review checklist
- Safe-use boundaries

**Quality checklist:**

- Are risks practical and specific?
- Are human review points clear?
- Are unsafe details avoided?
- Are mitigations realistic?

## Evaluation

**Purpose:** Convert a feature or AI behavior into eval cases and scoring criteria.

**Typical user requests:**

- "Turn this use case into evals."
- "How do I test whether the assistant does this well?"
- "Create pass/fail criteria."

**Extraction focus:**

- Target behavior
- Normal cases
- Edge cases
- Problematic or unsafe inputs at a safe abstract level
- Expected behavior
- Scoring rubric
- Human review notes

**Default assumptions:**

- Use mock/public data.
- Include both quality and safety checks.
- Make pass/fail criteria observable.

**Evaluation output structure:**

```markdown
Eval Suite:
[name]

Normal Case:
- Input:
- Expected behavior:
- Pass/fail criteria:

Edge Case:
- Input:
- Expected behavior:
- Pass/fail criteria:

Unsafe or Problematic Input Case:
- Input category:
- Expected safe behavior:
- Pass/fail criteria:

Scoring Rubric:
- 0:
- 1:
- 2:
- 3:

Human Review Notes:
- [review guidance]
```

**Quality checklist:**

- Are expected behaviors measurable?
- Does the suite include normal and edge cases?
- Are unsafe cases described safely?
- Is human review included?
