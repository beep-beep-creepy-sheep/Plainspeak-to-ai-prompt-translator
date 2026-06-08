# PlainSpeak Prompt Translator

PlainSpeak Prompt Translator is a small static web app that turns plain-language human requests into structured, safer, prompt-engineered instructions. It shows a structured prompt, missing information, safety notes, deterministic quality scores, and a JSON prompt-card preview.

The first version is fully rule-based. It uses no backend, no API key, no build step, and no external frameworks.

## Use it online

[Open the live app](https://beep-beep-creepy-sheep.github.io/Plainspeak-to-ai-prompt-translator/)

Live site: https://beep-beep-creepy-sheep.github.io/Plainspeak-to-ai-prompt-translator/

## Run locally

Open `index.html` directly in a browser.

You can also serve the folder with any static file server, but that is optional.

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
- The compiler is deterministic and rule-based, so it can miss nuance.
- The app does not include jailbreak, bypass, or unsafe prompt examples.

## Future improvements

- LLM-assisted compiler
- Prompt diff view
- Eval case generator
- YAML prompt card export
- Prompt registry integration
