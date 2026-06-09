# Prompt Card Schema

Use this schema as the default mental model. Omit sections only when they are irrelevant.

```json
{
  "schemaVersion": 2,
  "intent": {
    "type": "general | coding | writing | analysis | ai-risk | evaluation",
    "summary": "What the user really wants"
  },
  "context": "Known background and operating assumptions",
  "inputs": ["Known inputs or source materials"],
  "outputs": ["Expected deliverables"],
  "constraints": ["Hard requirements and limits"],
  "acceptanceCriteria": ["Observable success checks"],
  "openQuestions": ["Questions that materially affect the work"],
  "safety": {
    "boundaries": ["Do-not-cross rules"],
    "risks": ["Likely failure or misuse risks"],
    "reviewRequired": true
  },
  "finalPrompt": "The ready-to-use prompt"
}
```

## Question Policy

Ask a clarifying question when a missing answer changes:

- the task scope
- the target audience
- the output format
- safety or privacy handling
- implementation architecture
- acceptance criteria

Proceed with assumptions when the missing information only affects polish.
