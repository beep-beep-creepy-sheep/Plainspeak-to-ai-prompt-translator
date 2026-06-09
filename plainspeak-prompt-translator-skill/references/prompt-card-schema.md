# Prompt Card Schema

Version: `PromptCard v0.1`

A Prompt Card is the normalized output of the PlainSpeak Prompt Translator workflow. It records what the user asked, how the assistant interpreted it, what is missing, what assumptions are safe to make, and the final compiled prompt.

## Schema

| Field | Required | Description |
| --- | --- | --- |
| `original_request` | Yes | The user's raw request, preserved without rewriting. |
| `interpreted_intent` | Yes | A concise explanation of what the user appears to want. |
| `mode` | Yes | One of `General`, `Coding`, `Writing`, `Analysis`, `AI Risk`, or `Evaluation`. |
| `context` | Yes | Background needed to understand the request. Use only provided, mock, or public context. |
| `inputs` | Yes | Materials or inputs the task depends on, such as text, files, data, product idea, audience, or target platform. |
| `desired_outputs` | Yes | What the user wants produced. |
| `constraints` | Yes | Requirements, limits, non-goals, style rules, tools, platforms, or safety restrictions. |
| `assumptions` | Yes | Assumptions the assistant will use if proceeding without clarification. |
| `critical_missing_information` | Yes | Missing information that materially changes the output, blocks implementation, or creates safety risk. |
| `nice_to_have_information` | Yes | Useful but non-blocking details. These should not stop progress. |
| `acceptance_criteria` | Yes | Observable conditions that define a good answer or completed implementation. |
| `risks` | Yes | Likely failure modes, misuse risks, uncertainty, or quality risks. |
| `safety_boundaries` | Yes | Boundaries that keep the task safe and appropriate. |
| `open_questions` | Yes | Questions to ask the user. Keep this short and focus on critical items. |
| `output_format` | Yes | The requested or recommended final output structure. |
| `compiled_prompt` | Yes | The final prompt that can be copied into an AI assistant or coding agent. |

## Critical vs Nice-To-Have

`critical_missing_information` should trigger clarification when the assistant cannot safely or usefully proceed.

Examples:

- Target platform is unknown for a coding deployment task.
- Output format is unknown when the user explicitly needs a structured deliverable.
- Source material is missing for a summarization or analysis task.
- The task appears to involve private, regulated, or safety-sensitive data.

`nice_to_have_information` should not block progress. Proceed with labeled assumptions.

Examples:

- Preferred color palette for a simple demo webpage.
- Exact tone for a low-risk draft.
- Optional citation style when citations were not required.
- Future integration preferences for a v1 static app.

## Small Example

```yaml
original_request: "Can you make my rough idea into a prompt for Codex? I want a recipe page for tomato eggs."
interpreted_intent: "The user wants a Codex-ready prompt for building a small recipe tutorial webpage."
mode: "Coding"
context: "The user wants a static web page demo, likely deployable without a backend."
inputs:
  - "Dish idea: tomato eggs"
  - "Target: recipe tutorial webpage"
desired_outputs:
  - "Codex-ready implementation prompt"
  - "Prompt Card"
constraints:
  - "Keep v1 static and simple"
  - "Use mock/public recipe content"
assumptions:
  - "Use plain HTML, CSS, and JavaScript unless a framework is explicitly requested"
critical_missing_information: []
nice_to_have_information:
  - "Preferred visual style"
  - "Serving size"
acceptance_criteria:
  - "Prompt names files likely to change"
  - "Prompt includes manual verification steps"
risks:
  - "Recipe quantities may need human review"
safety_boundaries:
  - "No medical or dietary claims"
  - "Use common cooking guidance only"
open_questions: []
output_format:
  - "Prompt Card"
  - "Codex-ready prompt"
compiled_prompt: "Build a static recipe tutorial webpage for tomato eggs..."
```
