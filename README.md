# PlainSpeak Prompt Translator

PlainSpeak Prompt Translator turns messy human requests into structured, safer, prompt-engineered instructions. It helps users move from "I kind of know what I want" to a Prompt Card that an AI assistant or coding agent can act on.

This repository has two layers:

1. **Web demo:** a static UI for humans to try PlainSpeak Prompt Translator.
2. **Skill methodology:** a reusable prompt-compilation workflow in [`plainspeak-prompt-translator-skill/`](plainspeak-prompt-translator-skill/).

The web app is the visual product demo. The skill documents explain the underlying methodology so AI assistants, Codex, or prompt designers can reuse the workflow elsewhere.

## Web Demo

The static app shows:

- Understood intent
- Request breakdown
- Structured prompt
- Missing information
- Safety notes
- Quality scores
- JSON prompt card preview

The app has two compiler modes:

- **Ollama local LLM:** the primary mode for GPT-style intent understanding and prompt rewriting.
- **Rule-based fallback:** deterministic and no setup, but limited. It will miss many open-ended user intents.

It uses no hosted backend, no cloud API key, no build step, and no external frameworks.

## Use It Online

Live site: https://beep-beep-creepy-sheep.github.io/Plainspeak-to-ai-prompt-translator/

The live site is useful for trying the static UI. Ollama mode still depends on your own local Ollama server.

## Run Locally

Open `index.html` directly in a browser.

You can also serve the folder with any static file server:

```bash
python3 -m http.server 8017
```

Then open:

```text
http://localhost:8017
```

## Use Ollama Mode

1. Install and start Ollama.
2. Check which models you already have:

```bash
ollama list
```

3. If you do not have a model yet, pull one:

```bash
ollama pull llama3.1
```

4. Make sure Ollama is running at:

```text
http://localhost:11434
```

5. Open the app. Compiler defaults to `Ollama local LLM`.

6. Set the model field to an installed model name from `ollama list`, for example:

```text
llama3.1:latest
```

If the app says `model not found`, the model name in the page does not match an installed Ollama model.

If the GitHub Pages version cannot reach local Ollama because of browser security rules, run the app locally instead:

```bash
python3 -m http.server 8017
```

If your browser blocks the request or Ollama rejects the origin, start Ollama with a local origin allowed:

```bash
OLLAMA_ORIGINS=http://localhost:8017 ollama serve
```

For the GitHub Pages live site, the origin is different:

```bash
OLLAMA_ORIGINS=https://beep-beep-creepy-sheep.github.io ollama serve
```

## Skill Methodology

The reusable methodology lives in [`plainspeak-prompt-translator-skill/SKILL.md`](plainspeak-prompt-translator-skill/SKILL.md).

The workflow:

1. Identify the user's raw intent.
2. Classify the target mode: General, Coding, Writing, Analysis, AI Risk, or Evaluation.
3. Extract context, inputs, outputs, constraints, assumptions, success criteria, risks, and open questions.
4. Decide whether clarification is required.
5. Ask questions only when critical information is missing.
6. Otherwise proceed with clearly labeled assumptions.
7. Output a structured Prompt Card.
8. For coding tasks, also output a Codex-ready implementation prompt.
9. For evaluation tasks, also output eval cases and scoring criteria.
10. For AI-risk tasks, also output a risk review checklist.

The skill layer is documentation-first. It is not a separate app and does not replace the web demo.

## Install As A Codex Skill

The skill package is shaped like a Codex skill:

```text
plainspeak-prompt-translator-skill/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
```

To install it locally for Codex, copy it into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills/plainspeak-prompt-translator
cp -R plainspeak-prompt-translator-skill/* ~/.codex/skills/plainspeak-prompt-translator/
```

After installation, you can invoke it explicitly:

```text
Use $plainspeak-prompt-translator to turn this rough idea into a PromptCard v0.1 and a Codex-ready prompt: ...
```

If Codex has loaded the skill metadata, it can also be used implicitly for messy prompt-translation requests.

## How To Use With Codex

You can paste a vague idea into Codex and ask it to apply the PlainSpeak Prompt Card workflow.

Example:

```text
Apply the PlainSpeak Prompt Translator Skill workflow to this idea.
First identify my intent, classify the mode, extract missing information, proceed with safe assumptions where possible, and produce a PromptCard v0.1 plus a Codex-ready implementation prompt.

Idea:
I want to upload batches of mock PDF question sheets, extract questions and answers, build a question bank, practice questions, and track wrong answers in a static web app.
```

Codex should then produce:

- Prompt Card
- Critical missing information vs nice-to-have information
- Assumptions
- Safety boundaries
- Codex-ready implementation prompt
- Acceptance criteria and verification steps

## Project Structure

```text
.
├── index.html
├── style.css
├── script.js
├── README.md
├── AGENTS.md
└── plainspeak-prompt-translator-skill/
    ├── SKILL.md
    ├── agents/
    │   └── openai.yaml
    └── references/
        ├── prompt-card-schema.md
        ├── mode-templates.md
        ├── clarification-rules.md
        ├── safety-boundaries.md
        ├── output-formats.md
        └── examples.md
```

## Deploy With GitHub Pages

1. Push this project to a GitHub repository.
2. In the repository, open Settings.
3. Go to Pages.
4. Set the source to the main branch and the project root.
5. Save, then open the published GitHub Pages URL after deployment finishes.

## Safety Limitations

- Use mock or public information only.
- Do not paste confidential data, client identifiers, account numbers, private portfolio holdings, employer-confidential information, or internal documents.
- Do not treat generated text as investment advice.
- Do not rely on AI-generated output without human review.
- Rule-based fallback is not suitable for arbitrary user input.
- Ollama mode depends on the local model's quality and may still misunderstand vague requests.
- The app and skill docs do not include jailbreak, bypass, evasion, or unsafe prompt examples.

## Roadmap

- YAML prompt card export
- Prompt diff view
- Eval case generator
- Prompt registry integration
- Optional UI link from the web app to the skill docs
