# Examples

All examples use mock or public information only.

## 1. Coding: Small Static Web App

**Raw request:**  
"I want a simple page where I type a messy idea and it turns into a clearer prompt. No backend, just something I can put on GitHub Pages."

**Mode:** Coding

**Clarification needed:** No.

**Assumptions:**

- Use plain HTML, CSS, and JavaScript.
- Store no user data.
- Keep v1 static and deployable on GitHub Pages.

**Final Prompt Card:**

```yaml
original_request: "I want a simple page where I type a messy idea and it turns into a clearer prompt. No backend, just something I can put on GitHub Pages."
interpreted_intent: "The user wants a static prompt-translator demo webpage."
mode: "Coding"
context: "The user wants a no-backend GitHub Pages demo."
inputs:
  - "Messy plain-language idea"
desired_outputs:
  - "Clearer structured prompt"
  - "Static web UI"
constraints:
  - "No backend"
  - "No framework required"
assumptions:
  - "Use browser-only JavaScript"
critical_missing_information: []
nice_to_have_information:
  - "Preferred visual style"
acceptance_criteria:
  - "User can enter text and generate a structured prompt"
  - "Copy button works"
risks:
  - "Rule-based output may miss nuanced intent"
safety_boundaries:
  - "Do not store private data"
open_questions: []
output_format:
  - "Codex-ready implementation prompt"
compiled_prompt: "Build a static GitHub Pages-friendly prompt translator..."
```

**Final compiled prompt:**

```markdown
Role:
You are a senior software implementation assistant.

Goal:
Build a static prompt-translator demo where a user enters a messy idea and receives a clearer structured prompt.

Existing Project Context:
Create a no-backend GitHub Pages-compatible app using plain HTML, CSS, and JavaScript.

Implementation Requirements:
- Create `index.html`, `style.css`, and `script.js`.
- Add a textarea, generate button, clear button, copy button, and output area.
- Keep the compiler deterministic for v1.
- Do not store or transmit user input.

Tests / Manual Verification:
- Open `index.html`.
- Enter a messy idea.
- Confirm a structured prompt appears.
- Confirm copy and clear work.

Non-Goals:
- No backend.
- No account system.
- No external framework.
```

## 2. Writing: Vague Rewrite Request

**Raw request:**  
"Make this sound more professional: can you send me the numbers when you get a chance?"

**Mode:** Writing

**Clarification needed:** No.

**Assumptions:**

- The audience is a colleague.
- The tone should be polite and concise.

**Final Prompt Card:**

```yaml
original_request: "Make this sound more professional: can you send me the numbers when you get a chance?"
interpreted_intent: "The user wants a more polished version of a short workplace request."
mode: "Writing"
context: "Short professional message."
inputs:
  - "Original sentence"
desired_outputs:
  - "Professional rewrite"
constraints:
  - "Do not add unsupported details"
assumptions:
  - "Audience is a colleague"
critical_missing_information: []
nice_to_have_information:
  - "Deadline"
acceptance_criteria:
  - "Rewrite is polite, clear, and concise"
risks:
  - "Adding urgency could change the tone"
safety_boundaries:
  - "Do not invent context"
open_questions: []
output_format:
  - "One polished sentence"
compiled_prompt: "Rewrite the sentence in a concise professional tone..."
```

**Final compiled prompt:**

```markdown
Rewrite this sentence in a concise professional tone for a workplace colleague. Preserve the meaning and do not invent a deadline:

"Can you send me the numbers when you get a chance?"

Return one polished version and one slightly warmer alternative.
```

## 3. Analysis: Report Review Without Financial Advice

**Raw request:**  
"Check this mock portfolio report for logic problems and tell me if the conclusion is supported."

**Mode:** Analysis

**Clarification needed:** Yes, if the report text is not provided.

**Assumptions:**

- The report is mock or public.
- The assistant should review logic, not provide investment advice.

**Final Prompt Card:**

```yaml
original_request: "Check this mock portfolio report for logic problems and tell me if the conclusion is supported."
interpreted_intent: "The user wants a logic and evidence review of a mock portfolio-style report."
mode: "Analysis"
context: "Investment-adjacent language requires non-advice boundaries."
inputs:
  - "Mock report text"
desired_outputs:
  - "Logic issues"
  - "Unsupported claims"
  - "Uncertainty notes"
constraints:
  - "No investment advice"
  - "Use only provided text"
assumptions:
  - "The report is mock/public"
critical_missing_information:
  - "Report text"
nice_to_have_information:
  - "Intended audience"
acceptance_criteria:
  - "Findings cite specific report sections"
risks:
  - "Could be mistaken for financial advice"
safety_boundaries:
  - "Do not recommend trades or allocations"
open_questions:
  - "Please paste the mock/public report text."
output_format:
  - "Findings table"
compiled_prompt: "Review the provided mock report for logic and evidence quality..."
```

**Final compiled prompt:**

```markdown
Review the provided mock/public report for logic and evidence quality. Use only the provided text. Do not provide investment advice, trade recommendations, or portfolio allocation guidance.

Return:
- Logic gaps
- Unsupported claims
- Unclear assumptions
- Evidence that supports or weakens the conclusion
- Questions for human review
```

## 4. AI Risk: Classroom Use Case

**Raw request:**  
"A teacher wants students to use an AI writing helper for essay brainstorming. What risks should we check?"

**Mode:** AI Risk

**Clarification needed:** No.

**Assumptions:**

- This is an educational risk review.
- No real student data is included.

**Final Prompt Card:**

```yaml
original_request: "A teacher wants students to use an AI writing helper for essay brainstorming. What risks should we check?"
interpreted_intent: "The user wants a practical AI risk checklist for classroom AI-assisted brainstorming."
mode: "AI Risk"
context: "Education use case with students and writing support."
inputs:
  - "AI writing helper use case"
desired_outputs:
  - "Risk tags"
  - "Failure modes"
  - "Review checklist"
constraints:
  - "No real student data"
  - "Educational and practical tone"
assumptions:
  - "The tool is for brainstorming, not grading"
critical_missing_information: []
nice_to_have_information:
  - "Student age group"
acceptance_criteria:
  - "Checklist covers privacy, overreliance, bias, and academic integrity"
risks:
  - "Students may over-trust outputs"
safety_boundaries:
  - "Require teacher review and student guidance"
open_questions: []
output_format:
  - "AI risk review checklist"
compiled_prompt: "Create an AI risk review checklist for a classroom brainstorming assistant..."
```

**Final compiled prompt:**

```markdown
Create a practical AI risk review checklist for a classroom AI writing helper used for essay brainstorming. Do not use real student data.

Cover:
- Privacy
- Overreliance
- Hallucination
- Bias
- Academic integrity
- Teacher review points
- Student-facing guidance
```

## 5. Evaluation: Feature Idea To Eval Cases

**Raw request:**  
"Turn this feature into evals: assistant should turn vague app ideas into implementation prompts."

**Mode:** Evaluation

**Clarification needed:** No.

**Assumptions:**

- The evals use mock inputs.
- Scoring should be human-reviewable.

**Final Prompt Card:**

```yaml
original_request: "Turn this feature into evals: assistant should turn vague app ideas into implementation prompts."
interpreted_intent: "The user wants eval cases for an assistant that converts vague app ideas into implementation prompts."
mode: "Evaluation"
context: "Prompt-compilation feature evaluation."
inputs:
  - "Feature behavior"
desired_outputs:
  - "Normal case"
  - "Edge case"
  - "Problematic input case"
  - "Scoring rubric"
constraints:
  - "Use mock data"
assumptions:
  - "Human reviewer will score outputs"
critical_missing_information: []
nice_to_have_information:
  - "Preferred scoring scale"
acceptance_criteria:
  - "Each eval has expected behavior and pass/fail criteria"
risks:
  - "Eval may reward verbosity instead of usefulness"
safety_boundaries:
  - "Avoid unsafe examples"
open_questions: []
output_format:
  - "Evaluation test suite"
compiled_prompt: "Create eval cases for an assistant that turns vague app ideas into implementation prompts..."
```

**Final compiled prompt:**

```markdown
Create an evaluation suite for an assistant that turns vague app ideas into implementation-ready prompts.

Include:
- Normal case
- Edge case
- Problematic input case described safely
- Expected behavior
- Pass/fail criteria
- 0-3 scoring rubric
- Human review notes
```

## 6. Bilingual: Chinese Request To English Prompt Plus Chinese Notes

**Raw request:**  
"我想做一个番茄炒蛋教程网页，能不能帮我写给 Codex 的 prompt？"

**Mode:** Coding

**Clarification needed:** No.

**Assumptions:**

- Static webpage.
- Chinese content.
- No backend.

**Final Prompt Card:**

```yaml
original_request: "我想做一个番茄炒蛋教程网页，能不能帮我写给 Codex 的 prompt？"
interpreted_intent: "The user wants an English Codex prompt for building a Chinese tomato-and-egg recipe tutorial webpage."
mode: "Coding"
context: "A small static recipe tutorial page."
inputs:
  - "Dish: tomato and egg"
  - "Target: tutorial webpage"
desired_outputs:
  - "Codex-ready English prompt"
  - "Chinese notes explaining assumptions"
constraints:
  - "Static and simple"
  - "Use public/common cooking guidance"
assumptions:
  - "Use plain HTML, CSS, and JavaScript"
critical_missing_information: []
nice_to_have_information:
  - "Serving size"
  - "Visual style"
acceptance_criteria:
  - "Page includes ingredients, steps, timing, tips, and mobile layout"
risks:
  - "Ingredient quantities may need human adjustment"
safety_boundaries:
  - "No medical or dietary claims"
open_questions: []
output_format:
  - "English prompt"
  - "Chinese notes"
compiled_prompt: "Build a static Chinese recipe tutorial webpage for tomato and egg..."
```

**Final compiled prompt:**

```markdown
Build a static Chinese recipe tutorial webpage for tomato and egg.

Requirements:
- Use plain HTML, CSS, and JavaScript.
- Include a hero section, ingredients checklist, numbered steps, timing, serving size, tips, common mistakes, and simple variations.
- Make the layout mobile-friendly for kitchen use.
- Add print-friendly styling if simple.
- Keep all content general and public; do not make medical or dietary claims.

Verification:
- Open the page locally.
- Confirm ingredients and steps are readable on mobile width.
- Confirm print view remains usable.

中文备注：
- 默认做成静态网页，适合 GitHub Pages。
- 份量和视觉风格可之后再调整。
```
