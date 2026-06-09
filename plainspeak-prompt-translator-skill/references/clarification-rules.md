# Clarification Rules

The PlainSpeak workflow should not interrogate the user for every missing detail. Ask only when missing information materially changes the output, blocks implementation, or introduces safety risk.

## Core Rules

- Ask only when the missing information materially changes the output.
- Do not ask for every missing detail.
- Prefer progress with labeled assumptions when the task is low-risk.
- Ask before handling private, confidential, medical, legal, financial, or safety-sensitive data.
- Ask when target platform, required output format, or acceptance criteria are essential to implementation.
- For coding tasks, ask only if the missing detail blocks file changes or verification.

## Decision Table

| Missing item | Is it critical? | Ask or assume? | Example |
| --- | --- | --- | --- |
| Source material for a summary | Yes | Ask | "Please provide the article or paste the text to summarize." |
| Target platform for deployment | Usually yes | Ask if implementation depends on it | "Should this deploy to GitHub Pages, Cloudflare Pages, or another target?" |
| Output format | Sometimes | Ask if required by downstream use; otherwise assume Markdown | "If you need JSON or a table, tell me; otherwise I will use Markdown." |
| Audience for writing | Sometimes | Ask if tone/content changes materially; otherwise assume general professional audience | "Who is this message for?" |
| Preferred visual style | No for v1 | Assume | "I will use a clean, neutral style unless you specify branding." |
| Exact color palette | No | Assume | "I will choose accessible neutral colors." |
| Acceptance criteria for coding | Often yes | Ask if verification is impossible; otherwise propose criteria | "Should success mean upload works, export works, and mobile layout is usable?" |
| Confidential data status | Yes | Ask or refuse to process sensitive details | "Does this include private/client data? Please remove identifiers before sharing." |
| Medical, legal, or financial stakes | Yes | Ask and add safety boundaries | "Is this for general education, or are you making a real-world decision?" |
| Model/provider preference | No unless integration task | Assume | "I will keep the prompt provider-neutral." |
| Deadline | Usually no | Assume no deadline | "I will omit deadline constraints unless you provide one." |

## Clarification Patterns

Use one to three focused questions. Avoid long questionnaires.

Good:

```markdown
Before I compile this, one detail changes the implementation: should this be a static GitHub Pages app, or can it use a backend?
```

Good:

```markdown
I can proceed with assumptions. I will assume a general professional audience and a short Markdown output unless you prefer another format.
```

Avoid:

```markdown
What is your audience, tone, deadline, format, color palette, font, citation style, model, risk tolerance, and success criteria?
```

## Coding-Specific Guidance

Ask only if the missing detail blocks file changes or verification.

Proceed with assumptions when:

- The app can be built as a small static v1.
- The user has not specified visual style.
- The feature can be implemented with local browser storage.
- Manual verification can be proposed by the assistant.

Ask when:

- The user requires authentication, persistence, or payment but has not specified infrastructure.
- The deployment target changes architecture.
- The input data format is unknown and parsing depends on it.
- Safety or privacy risk is unclear.
