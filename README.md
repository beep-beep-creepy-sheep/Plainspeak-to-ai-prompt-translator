# PlainSpeak Prompt Translator

PlainSpeak Prompt Translator is a small static web app that uses a local LLM to turn messy human requests into structured, safer, prompt-engineered instructions. It shows the understood intent, request breakdown, structured prompt, missing information, safety notes, quality scores, and a JSON prompt-card preview.

The app has two compiler modes:

- Ollama local LLM: the primary mode for GPT-style intent understanding and prompt rewriting.
- Rule-based fallback: deterministic and no setup, but limited. It will miss many open-ended user intents.

It uses no hosted backend, no cloud API key, no build step, and no external frameworks.

## Use it online

Live site: https://beep-beep-creepy-sheep.github.io/Plainspeak-to-ai-prompt-translator/

## Run locally

Open `index.html` directly in a browser.

You can also serve the folder with any static file server, but that is optional.

## Test the compiler

The core rule-based compiler can be checked without a browser:

```bash
node tests/compiler.test.js
```

This verifies the Prompt Card schema, structured output fields, and Chinese prompt formatting.

## Prompt Card schema

Generated prompt cards include a versioned structure with intent, inputs, outputs, constraints, acceptance criteria, open questions, safety boundaries, risks, quality scores, and the final structured prompt. Older UI sections are still kept for readability, while the JSON preview exposes the richer schema for future registry or eval workflows.

## Use Ollama mode

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

If the GitHub Pages version cannot reach your local Ollama because of browser security rules, run the app locally instead:

```bash
python3 -m http.server 8017
```

Then open:

```text
http://localhost:8017
```

If your browser blocks the request or Ollama rejects the origin, start Ollama with a local origin allowed. For example:

```bash
OLLAMA_ORIGINS=http://localhost:8017 ollama serve
```

For the GitHub Pages live site, the origin is different:

```bash
OLLAMA_ORIGINS=https://beep-beep-creepy-sheep.github.io ollama serve
```

## Deploy with GitHub Pages

1. Push this project to a GitHub repository.
2. In the repository, open Settings.
3. Go to Pages.
4. Set the source to the main branch and the project root.
5. Save, then open the published GitHub Pages URL after deployment finishes.

## Safety limitations

- Use mock or public information only.
- Do not paste confidential data, client identifiers, account numbers, private portfolio holdings, employer-confidential information, or internal documents.
- Do not treat generated text as investment advice.
- Do not rely on AI-generated output without human review.
- Rule-based fallback is not suitable for arbitrary user input.
- Ollama mode depends on the local model's quality and may still misunderstand vague requests.
- The app does not include jailbreak, bypass, or unsafe prompt examples.

## Future improvements

- Prompt diff view
- Eval case generator
- YAML prompt card export
- Prompt registry integration
