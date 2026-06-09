const requestInput = document.querySelector("#requestInput");
const modeSelect = document.querySelector("#modeSelect");
const languageSelect = document.querySelector("#languageSelect");
const compilerSelect = document.querySelector("#compilerSelect");
const ollamaModel = document.querySelector("#ollamaModel");
const ollamaEndpoint = document.querySelector("#ollamaEndpoint");
const translateButton = document.querySelector("#translateButton");
const clearButton = document.querySelector("#clearButton");
const copyButton = document.querySelector("#copyButton");
const exportButton = document.querySelector("#exportButton");
const emptyState = document.querySelector("#emptyState");
const statusMessage = document.querySelector("#statusMessage");
const results = document.querySelector("#results");
const requestBreakdown = document.querySelector("#requestBreakdown");
const structuredPrompt = document.querySelector("#structuredPrompt");
const missingInformation = document.querySelector("#missingInformation");
const safetyNotes = document.querySelector("#safetyNotes");
const qualityScore = document.querySelector("#qualityScore");
const promptCardPreview = document.querySelector("#promptCardPreview");

let currentPromptCard = null;
let currentPromptText = "";

const MODE_CONFIG = {
  General: {
    role: "Helpful prompt-writing assistant",
    instructions: [
      "Rewrite the request into a clear, structured instruction.",
      "Separate facts provided by the user from assumptions.",
      "Ask for clarification where information is missing.",
      "Do not invent source details or unsupported claims."
    ],
    constraints: [
      "Use only provided information unless explicitly asked to create mock content.",
      "Be concise, specific, and easy to verify.",
      "Flag uncertainty clearly."
    ]
  },
  Analyst: {
    role: "Careful analysis and quality-assurance assistant",
    instructions: [
      "Identify the analytical question, evidence needed, and decision context.",
      "Use only provided information and flag uncertainty.",
      "Separate observations from recommendations.",
      "Call out logic gaps, unsupported claims, and missing evidence."
    ],
    constraints: [
      "Do not input confidential data, client data, account numbers, or internal documents.",
      "Do not provide investment advice or portfolio recommendations.",
      "Use mock or public information only."
    ]
  },
  Coding: {
    role: "Senior software implementation assistant",
    instructions: [
      "First decompose the user's plain-language idea into goal, inputs, outputs, user flows, data model, deployment target, and open questions.",
      "Turn the request into an implementation-ready coding prompt.",
      "Specify file structure, implementation details, tests, and edge cases.",
      "Keep the solution scoped and readable.",
      "Summarize files changed after implementation."
    ],
    constraints: [
      "Do not overengineer the solution.",
      "Prefer existing project patterns when working in an existing codebase.",
      "Include manual verification steps."
    ]
  },
  Writing: {
    role: "Strategic writing and editing assistant",
    instructions: [
      "Clarify audience, purpose, tone, structure, and length.",
      "Make the writing specific, useful, and easy to act on.",
      "Preserve the user's intent while improving clarity.",
      "Include a call to action when appropriate."
    ],
    constraints: [
      "Do not invent credentials, results, names, or private details.",
      "Ask for missing recipient, audience, tone, objective, and length.",
      "Keep claims supportable."
    ]
  },
  "AI Risk": {
    role: "AI risk and safe-use review assistant",
    instructions: [
      "Classify the use case with practical risk tags.",
      "Identify likely failure modes and misuse risks.",
      "Define safe-use boundaries and human review points.",
      "Produce a review checklist for deployment or classroom discussion."
    ],
    constraints: [
      "Do not include jailbreak, bypass, evasion, or unsafe prompt examples.",
      "Use safety-focused, educational framing.",
      "Avoid instructions that enable harmful behavior."
    ]
  },
  Evaluation: {
    role: "Evaluation design assistant",
    instructions: [
      "Convert the request into eval test cases.",
      "Include a normal case, edge case, unsafe input case, expected behavior, and scoring rubric.",
      "Make pass/fail criteria observable.",
      "Include notes for human review."
    ],
    constraints: [
      "Do not use real client data or confidential examples.",
      "Use mock examples only.",
      "Test for refusal, uncertainty handling, and output quality where relevant."
    ]
  }
};

const MISSING_INFO_RULES = [
  { label: "Audience", pattern: /\b(audience|reader|user|customer|client|students|team|executive|manager)\b/i },
  { label: "Tone", pattern: /\b(tone|professional|friendly|formal|casual|concise|persuasive|warm)\b/i },
  { label: "Output length", pattern: /\b(length|short|brief|long|words?|paragraphs?|one-page|summary)\b/i },
  { label: "Format", pattern: /\b(format|table|bullets?|json|markdown|email|memo|dashboard|report|slides?)\b/i },
  { label: "Source material", pattern: /\b(article|source|text|document|data|report|provided|attached|paste)\b/i },
  { label: "Deadline", pattern: /\b(deadline|due|today|tomorrow|by \w+|date)\b/i },
  { label: "Data sensitivity", pattern: /\b(confidential|private|personal|client|internal|sensitive|account|portfolio)\b/i },
  { label: "Success criteria", pattern: /\b(success|criteria|pass|fail|goal|objective|rubric|measure)\b/i },
  { label: "Citation needs", pattern: /\b(cite|citation|sources?|reference|footnote)\b/i },
  { label: "Confidential or personal data status", pattern: /\b(confidential|personal|client|private|identifier|pii|account)\b/i }
];

const MODE_MISSING_INFO = {
  Writing: ["Recipient", "Audience", "Tone", "Objective", "Output length"],
  Analyst: ["Data sensitivity", "Source material", "Success criteria", "Citation needs"],
  Coding: ["File structure", "Target environment", "Testing expectations", "Edge cases"],
  "AI Risk": ["Risk tolerance", "Reviewer role", "Deployment context", "Escalation criteria"],
  Evaluation: ["Success criteria", "Scoring rubric", "Unsafe input examples at a safe abstract level", "Expected behavior"]
};

const BASE_SAFETY_NOTES = [
  "Do not input confidential data.",
  "Do not include client identifiers.",
  "Do not rely on AI output without human review.",
  "Use mock or public information only."
];

const ANALYST_SAFETY_NOTES = [
  "Do not treat generated text as investment advice.",
  "Do not include real portfolio holdings, account numbers, or employer-confidential information."
];

const RISK_SAFETY_NOTES = [
  "Keep examples educational and defensive.",
  "Do not include jailbreak, bypass, evasion, or unsafe prompt examples."
];

// Main compiler: deterministic rules convert a plain request into a prompt card.
function compilePrompt(request, mode, outputLanguage) {
  const cleanRequest = request.trim();
  const config = MODE_CONFIG[mode] || MODE_CONFIG.General;
  const missing = detectMissingInformation(cleanRequest, mode);
  const riskNotes = buildRiskNotes(cleanRequest, mode);
  const safetyBoundaries = buildSafetyBoundaries(mode);
  const qualityScore = scorePrompt(cleanRequest, missing, safetyBoundaries);
  const requestBreakdown = buildRequestBreakdown(cleanRequest, mode);
  const promptCardFields = buildPromptCardFields(requestBreakdown, missing, safetyBoundaries, riskNotes, mode);

  const promptCard = {
    schemaVersion: 2,
    originalRequest: cleanRequest,
    mode,
    outputLanguage,
    ...promptCardFields,
    requestBreakdown,
    role: config.role,
    task: buildTask(cleanRequest, mode),
    context: buildContext(cleanRequest, mode),
    instructions: config.instructions,
    constraints: config.constraints,
    outputFormat: buildOutputFormat(mode),
    safetyBoundaries,
    missingInformation: missing,
    assumptions: buildAssumptions(cleanRequest, mode),
    qualityChecklist: buildQualityChecklist(mode),
    riskNotes,
    qualityScore
  };

  promptCard.structuredPrompt = formatStructuredPrompt(promptCard, outputLanguage);
  return promptCard;
}

// Ollama compiler: asks a local model to understand the user's intent, then normalizes it into the same prompt-card shape.
async function compilePromptWithOllama(request, mode, outputLanguage, options) {
  const fallbackCard = compilePrompt(request, mode, outputLanguage);
  const response = await fetch(options.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: options.model,
      prompt: buildOllamaCompilerPrompt(request, mode, outputLanguage),
      stream: false,
      format: "json",
      options: {
        temperature: 0.2,
        num_predict: 1800
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(formatOllamaError(response.status, errorText));
  }

  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error);
  }
  const parsed = parseModelJson(payload.response || "");
  const card = normalizeModelCard(parsed, fallbackCard);
  card.compiler = {
    type: "ollama",
    model: options.model,
    endpoint: options.endpoint
  };
  card.structuredPrompt = formatStructuredPrompt(card, outputLanguage);
  return card;
}

function formatOllamaError(status, errorText) {
  try {
    const parsed = JSON.parse(errorText);
    if (parsed.error) return `Ollama error ${status}: ${parsed.error}`;
  } catch {
    // Keep the original text below when the body is not JSON.
  }
  return `Ollama request failed with status ${status}: ${errorText || "no error body"}`;
}

function buildOllamaCompilerPrompt(request, mode, outputLanguage) {
  return `You are PlainSpeak Prompt Translator.

Your job is to understand the user's plain-language request the way a helpful GPT-style assistant would, then rewrite it as an equivalent, clearer prompt for another AI or coding agent.

Important:
- Preserve the user's real intent. Do not turn the request into a generic template.
- First explain what you think the user means.
- Then produce an implementation-ready or task-ready prompt.
- Ask for missing information only when it materially affects the result.
- Do not include confidential data, client identifiers, investment advice, jailbreaks, bypasses, or unsafe prompt examples.
- Use mock/public information only.
- Output JSON only. No markdown fences.

Mode: ${mode}
Output language setting: ${outputLanguage}
Original request:
${request}

Return exactly this JSON shape:
{
  "understoodIntent": "Plain-language sentence explaining what the user really wants.",
  "requestBreakdown": {
    "userIntent": "",
    "detectedInputs": [],
    "desiredOutputs": [],
    "coreFeatures": [],
    "userFlows": [],
    "dataModel": [],
    "deploymentTarget": [],
    "openQuestions": []
  },
  "role": "",
  "task": "",
  "context": "",
  "instructions": [],
  "constraints": [],
  "outputFormat": [],
  "safetyBoundaries": [],
  "missingInformation": [],
  "assumptions": [],
  "qualityChecklist": [],
  "riskNotes": []
}`;
}

function parseModelJson(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Ollama did not return JSON.");
    return JSON.parse(match[0]);
  }
}

function normalizeModelCard(modelCard, fallbackCard) {
  const normalized = {
    ...fallbackCard,
    understoodIntent: stringOrFallback(modelCard.understoodIntent, fallbackCard.requestBreakdown.userIntent),
    requestBreakdown: normalizeBreakdown(modelCard.requestBreakdown, fallbackCard.requestBreakdown),
    role: stringOrFallback(modelCard.role, fallbackCard.role),
    task: stringOrFallback(modelCard.task, fallbackCard.task),
    context: stringOrFallback(modelCard.context, fallbackCard.context),
    instructions: arrayOrFallback(modelCard.instructions, fallbackCard.instructions),
    constraints: arrayOrFallback(modelCard.constraints, fallbackCard.constraints),
    outputFormat: arrayOrFallback(modelCard.outputFormat, fallbackCard.outputFormat),
    safetyBoundaries: arrayOrFallback(modelCard.safetyBoundaries, fallbackCard.safetyBoundaries),
    missingInformation: arrayOrFallback(modelCard.missingInformation, fallbackCard.missingInformation),
    assumptions: arrayOrFallback(modelCard.assumptions, fallbackCard.assumptions),
    qualityChecklist: arrayOrFallback(modelCard.qualityChecklist, fallbackCard.qualityChecklist),
    riskNotes: arrayOrFallback(modelCard.riskNotes, fallbackCard.riskNotes)
  };
  Object.assign(
    normalized,
    buildPromptCardFields(
      normalized.requestBreakdown,
      normalized.missingInformation,
      normalized.safetyBoundaries,
      normalized.riskNotes,
      normalized.mode
    )
  );
  normalized.qualityScore = scorePrompt(normalized.originalRequest, normalized.missingInformation, normalized.safetyBoundaries);
  return normalized;
}

function buildPromptCardFields(breakdown, missingInformation, safetyBoundaries, riskNotes, mode) {
  return {
    intent: {
      type: modeToIntentType(mode),
      summary: breakdown.userIntent
    },
    inputs: breakdown.detectedInputs,
    outputs: breakdown.desiredOutputs,
    constraints: buildStructuredConstraints(mode, safetyBoundaries),
    acceptanceCriteria: buildAcceptanceCriteria(mode),
    openQuestions: mergeUnique([
      ...breakdown.openQuestions,
      ...missingInformation.map((item) => `Clarify: ${item}`)
    ]),
    safety: {
      boundaries: safetyBoundaries,
      risks: riskNotes,
      reviewRequired: true
    }
  };
}

function modeToIntentType(mode) {
  const types = {
    General: "general",
    Analyst: "analysis",
    Coding: "coding",
    Writing: "writing",
    "AI Risk": "ai-risk",
    Evaluation: "evaluation"
  };
  return types[mode] || "general";
}

function buildStructuredConstraints(mode, safetyBoundaries) {
  const modeConstraints = (MODE_CONFIG[mode] || MODE_CONFIG.General).constraints;
  return mergeUnique([...modeConstraints, ...safetyBoundaries]);
}

function buildAcceptanceCriteria(mode) {
  if (mode === "Coding") {
    return [
      "The prompt names the implementation goal, expected files or components, and primary user flow.",
      "The prompt includes tests or manual verification steps.",
      "The prompt names privacy and safety constraints before implementation starts."
    ];
  }
  if (mode === "Evaluation") {
    return [
      "Each eval case has an input, expected behavior, and observable pass/fail criteria.",
      "Unsafe or edge cases test safe handling without providing harmful instructions.",
      "The scoring rubric is specific enough for a human reviewer to apply."
    ];
  }
  if (mode === "AI Risk") {
    return [
      "The output identifies likely failure modes and misuse paths.",
      "The output defines human review checkpoints.",
      "The output avoids operational details that enable harm."
    ];
  }
  return [
    "The output preserves the user's intent without inventing unsupported facts.",
    "Missing context is surfaced as questions or explicit assumptions.",
    "Safety boundaries are visible and actionable."
  ];
}

function mergeUnique(items) {
  return [...new Set(items.filter(Boolean))];
}

function normalizeBreakdown(value, fallback) {
  const source = value && typeof value === "object" ? value : {};
  return {
    userIntent: stringOrFallback(source.userIntent, fallback.userIntent),
    detectedInputs: arrayOrFallback(source.detectedInputs, fallback.detectedInputs),
    desiredOutputs: arrayOrFallback(source.desiredOutputs, fallback.desiredOutputs),
    coreFeatures: arrayOrFallback(source.coreFeatures, fallback.coreFeatures),
    userFlows: arrayOrFallback(source.userFlows, fallback.userFlows),
    dataModel: arrayOrFallback(source.dataModel, fallback.dataModel),
    deploymentTarget: arrayOrFallback(source.deploymentTarget, fallback.deploymentTarget),
    openQuestions: arrayOrFallback(source.openQuestions, fallback.openQuestions)
  };
}

function stringOrFallback(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function arrayOrFallback(value, fallback) {
  if (!Array.isArray(value)) return fallback;
  const cleaned = value.map((item) => String(item).trim()).filter(Boolean);
  return cleaned.length ? cleaned : fallback;
}

function buildTask(request, mode) {
  if (mode === "Evaluation") {
    return `Create deterministic eval cases for this request: "${request}"`;
  }
  if (mode === "Coding") {
    const product = inferProductName(request);
    const coreGoal = inferCoreGoal(request);
    return `Build a scoped ${product} that ${coreGoal}. Use the breakdown below as the implementation brief.`;
  }
  return `Transform this plain-language request into a clear, structured AI instruction: "${request}"`;
}

function inferProductName(request) {
  if (hasAny(request, [/pdf/i, /刷题|题库|错题|题目|答案/])) return "PDF-to-question-bank study web app";
  if (isRecipeWebsiteRequest(request)) return "recipe tutorial webpage";
  if (hasAny(request, [/dashboard/i, /看板|仪表盘/])) return "dashboard";
  if (hasAny(request, [/website|网页|site/i, /网站|页面/])) return "web app";
  return "small static web app or implementation";
}

function inferCoreGoal(request) {
  if (hasAny(request, [/pdf/i, /刷题|题库|错题|题目|答案/])) {
    return "lets a user upload mock/public PDF question sets, extract question-answer text, organize a question bank, practice questions, and review wrong answers";
  }
  if (isRecipeWebsiteRequest(request)) {
    return "turns a recipe idea into a polished cooking tutorial page with ingredients, steps, timing, tips, and a printable/checklist-friendly layout";
  }
  if (hasAny(request, [/dashboard/i, /看板|仪表盘/])) {
    return "shows the requested data in a clear, usable dashboard";
  }
  return "turns the user's idea into a usable first version";
}

function buildContext(request, mode) {
  const base = "The user wants a safer, clearer prompt that can be reviewed before use.";
  if (mode === "Analyst") {
    return `${base} The content may involve analysis or report review, so confidentiality and non-advice boundaries are important.`;
  }
  if (mode === "AI Risk") {
    return `${base} The output should support safe-use review, risk awareness, and human oversight.`;
  }
  if (mode === "Coding") {
    return `${base} The output should be implementation-ready and include practical verification steps.`;
  }
  return base;
}

// Request breakdown is a deterministic "plain speak parser" for turning messy ideas into implementation parts.
function buildRequestBreakdown(request, mode) {
  const isPdfQuiz = hasAny(request, [/pdf/i, /刷题|题库|错题|题目|答案/]);
  const isRecipeSite = isRecipeWebsiteRequest(request);
  const isCoding = mode === "Coding";
  const breakdown = {
    userIntent: inferUserIntent(request, isPdfQuiz, isRecipeSite),
    detectedInputs: [],
    desiredOutputs: [],
    coreFeatures: [],
    userFlows: [],
    dataModel: [],
    deploymentTarget: [],
    openQuestions: []
  };

  if (hasAny(request, [/pdf/i])) breakdown.detectedInputs.push("Batch PDF upload");
  if (hasAny(request, [/答案|answer/i])) breakdown.detectedInputs.push("PDFs may contain questions with answers");
  if (hasAny(request, [/题|question/i])) breakdown.detectedInputs.push("Question text");
  if (isRecipeSite) breakdown.detectedInputs.push("Recipe topic or dish name");
  if (hasAny(request, [/番茄炒蛋|西红柿炒鸡蛋|tomato.*egg|egg.*tomato/i])) breakdown.detectedInputs.push("Dish: tomato scrambled eggs");
  if (hasAny(request, [/网页|网站|page|website|site/i])) breakdown.detectedInputs.push("Desired output: webpage");
  if (!breakdown.detectedInputs.length) breakdown.detectedInputs.push("User-provided text or files, exact input type not fully specified");

  if (isPdfQuiz) {
    breakdown.desiredOutputs.push("Extracted question-answer items");
    breakdown.desiredOutputs.push("Organized question bank");
    breakdown.desiredOutputs.push("Practice page for answering questions");
    breakdown.desiredOutputs.push("Wrong-answer review list");
    breakdown.coreFeatures.push("Upload one or more PDF files");
    breakdown.coreFeatures.push("Extract text from PDFs in the browser where feasible");
    breakdown.coreFeatures.push("Parse extracted text into question and answer records");
    breakdown.coreFeatures.push("Allow practice mode with show/hide answer");
    breakdown.coreFeatures.push("Track wrong answers locally with localStorage");
    breakdown.coreFeatures.push("Export/import the generated question bank as JSON");
    breakdown.userFlows.push("Upload PDFs -> preview extracted text -> confirm parsed questions -> practice -> mark wrong/correct -> review wrong answers");
    breakdown.dataModel.push("Question: id, sourceFile, questionText, answerText, tags, createdAt, lastPracticedAt, wrongCount");
    breakdown.deploymentTarget.push("Static GitHub Pages site");
    breakdown.openQuestions.push("Should OCR for scanned PDFs be required, or only text-based PDFs for v1?");
    breakdown.openQuestions.push("What question formats should be supported first: Q/A blocks, multiple choice, or both?");
    breakdown.openQuestions.push("Should data stay only in browser localStorage, or should there be login/cloud sync later?");
  } else if (isRecipeSite) {
    breakdown.desiredOutputs.push("Polished single-page recipe tutorial webpage");
    breakdown.desiredOutputs.push("Ingredient list with quantities");
    breakdown.desiredOutputs.push("Step-by-step cooking instructions");
    breakdown.desiredOutputs.push("Timing, difficulty, serving size, and practical cooking tips");
    breakdown.coreFeatures.push("Hero section with dish name and short description");
    breakdown.coreFeatures.push("Ingredients checklist");
    breakdown.coreFeatures.push("Numbered cooking steps");
    breakdown.coreFeatures.push("Tips, common mistakes, and variations");
    breakdown.coreFeatures.push("Responsive layout suitable for phone use in the kitchen");
    breakdown.coreFeatures.push("Optional print-friendly styling");
    breakdown.userFlows.push("Open webpage -> review ingredients -> follow steps while cooking -> check tips/variations -> print or save");
    breakdown.dataModel.push("Recipe: title, servings, prepTime, cookTime, difficulty, ingredients, steps, tips, variations");
    breakdown.deploymentTarget.push("Static GitHub Pages site");
    breakdown.openQuestions.push("Should the page be Chinese-only, English-only, or bilingual?");
    breakdown.openQuestions.push("How many servings should the ingredient quantities target?");
    breakdown.openQuestions.push("Should the design feel homey, minimalist, playful, or restaurant-style?");
  } else if (isCoding) {
    breakdown.desiredOutputs.push("Working first version of the requested app");
    breakdown.coreFeatures.push("Small scoped implementation");
    breakdown.userFlows.push("User completes the primary task from the first screen");
    breakdown.dataModel.push("Keep data local unless backend storage is explicitly requested");
    breakdown.deploymentTarget.push("Static deployment if possible");
    breakdown.openQuestions.push("What exact inputs, outputs, and deployment target should be supported?");
  } else {
    breakdown.desiredOutputs.push("Clear structured prompt");
    breakdown.coreFeatures.push("Clarified task, constraints, output format, and safety boundaries");
    breakdown.openQuestions.push("What context, audience, format, and success criteria are missing?");
  }

  return breakdown;
}

function inferUserIntent(request, isPdfQuiz, isRecipeSite) {
  if (isPdfQuiz) return "Create a study/practice website from batches of PDF files containing questions and answers.";
  if (isRecipeSite) return "Create a recipe tutorial webpage for the requested dish.";
  return "Clarify the user's rough request and convert it into an actionable prompt.";
}

function isRecipeWebsiteRequest(request) {
  const hasRecipeSignal = hasAny(request, [/食谱|菜谱|教程|做一份|做个|cooking|recipe|cook/i, /番茄炒蛋|西红柿炒鸡蛋|蛋炒|炒菜|ingredients?/i]);
  const hasPageSignal = hasAny(request, [/网页|网站|page|website|site|html/i]);
  return hasRecipeSignal && hasPageSignal;
}

function buildOutputFormat(mode) {
  if (mode === "Evaluation") {
    return [
      "Eval suite name",
      "Normal case",
      "Edge case",
      "Unsafe input case",
      "Expected behavior",
      "Scoring rubric"
    ];
  }
  return [
    "Request Breakdown",
    "Role",
    "Task",
    "Context",
    "Instructions",
    "Constraints",
    "Output Format",
    "Safety Boundaries",
    "Quality Checklist"
  ];
}

function buildSafetyBoundaries(mode) {
  const notes = [...BASE_SAFETY_NOTES];
  if (mode === "Analyst") notes.push(...ANALYST_SAFETY_NOTES);
  if (mode === "AI Risk" || mode === "Evaluation") notes.push(...RISK_SAFETY_NOTES);
  return notes;
}

function buildRiskNotes(request, mode) {
  const notes = [];
  if (/\b(portfolio|investment|financial|client|account)\b/i.test(request) || mode === "Analyst") {
    notes.push("Potential finance or client-data context: keep all examples mock/public and avoid advice.");
  }
  if (/\b(confidential|internal|private|personal|pii)\b/i.test(request)) {
    notes.push("Potential sensitive-data context: remove private identifiers before using any AI tool.");
  }
  if (mode === "AI Risk") {
    notes.push("Review for misuse, hallucination, overreliance, privacy, and escalation needs.");
  }
  if (mode === "Evaluation") {
    notes.push("Unsafe input cases should test safe refusal or redirection without showing harmful instructions.");
  }
  return notes.length ? notes : ["Low obvious risk from wording, but human review is still required."];
}

function buildAssumptions(request, mode) {
  const assumptions = [
    "The request should be improved for clarity and safer AI use.",
    "No confidential, personal, or client-identifying data will be included."
  ];
  if (mode === "Coding") assumptions.push("The implementation should stay small unless the user provides a larger architecture.");
  if (mode === "Writing") assumptions.push("The draft should preserve the user's intent while improving readability.");
  if (request.length < 80) assumptions.push("The request is brief, so some context may need to be requested before final work begins.");
  return assumptions;
}

function buildQualityChecklist(mode) {
  const checklist = [
    "Is the task specific and unambiguous?",
    "Is all required context provided?",
    "Are constraints explicit?",
    "Is the output format easy to inspect?",
    "Are safety boundaries visible?",
    "Can the answer be evaluated by a human?"
  ];
  if (mode === "Coding") checklist.push("Are tests, edge cases, and files changed covered?");
  if (mode === "Evaluation") checklist.push("Are expected behavior and scoring criteria observable?");
  if (mode === "AI Risk") checklist.push("Are failure modes and review checkpoints named?");
  return checklist;
}

function detectMissingInformation(request, mode) {
  const missing = MISSING_INFO_RULES
    .filter((rule) => !rule.pattern.test(request))
    .map((rule) => rule.label);

  const modeSpecific = MODE_MISSING_INFO[mode] || [];
  modeSpecific.forEach((item) => {
    if (!missing.includes(item) && !new RegExp(item.replace(/\s+/g, "|"), "i").test(request)) {
      missing.push(item);
    }
  });

  return missing.length ? missing : ["No major missing information detected by the rule-based checker."];
}

function scorePrompt(request, missing, safetyBoundaries) {
  const wordCount = request.split(/\s+/).filter(Boolean).length;
  const hasFormat = !missing.includes("Format");
  const hasContext = wordCount >= 12 || /\b(article|report|dashboard|use case|code|eval|portfolio)\b/i.test(request);
  const hasConstraints = /\b(no|must|should|only|avoid|without|do not|don't)\b/i.test(request);
  const hasSuccessCriteria = !missing.includes("Success criteria");
  const hasSafetySignal = /\b(confidential|client|personal|public|mock|safe|risk|review)\b/i.test(request);

  return {
    Clarity: clampScore(3 + Math.min(4, Math.floor(wordCount / 5)) + (request.includes("?") ? 1 : 0)),
    Context: clampScore(hasContext ? 7 : 4),
    Constraints: clampScore(hasConstraints ? 8 : 4),
    "Output Format": clampScore(hasFormat ? 8 : 4),
    "Safety Boundaries": clampScore(hasSafetySignal ? 8 : Math.min(7, safetyBoundaries.length + 2)),
    Testability: clampScore(hasSuccessCriteria ? 8 : 4)
  };
}

function clampScore(value) {
  return Math.max(0, Math.min(10, value));
}

function formatStructuredPrompt(card, outputLanguage) {
  const english = [
    card.understoodIntent ? `Understood Intent:\n${card.understoodIntent}` : "",
    `Intent:\n- Type: ${card.intent.type}\n- Summary: ${card.intent.summary}`,
    `Request Breakdown:\n${formatBreakdown(card.requestBreakdown)}`,
    `Role:\n${card.role}`,
    `Task:\n${card.task}`,
    `Context:\n${card.context}`,
    `Instructions:\n${toBullets(card.instructions)}`,
    `Constraints:\n${toBullets(card.constraints)}`,
    `Output Format:\n${toBullets(card.outputFormat)}`,
    `Acceptance Criteria:\n${toBullets(card.acceptanceCriteria)}`,
    `Safety Boundaries:\n${toBullets(card.safetyBoundaries)}`,
    `Risks:\n${toBullets(card.safety.risks)}`,
    `Open Questions:\n${toBullets(card.openQuestions)}`,
    `Quality Checklist:\n${toBullets(card.qualityChecklist)}`
  ].filter(Boolean).join("\n\n");

  if (outputLanguage === "Chinese Prompt") {
    return toChinesePrompt(card);
  }

  if (outputLanguage === "English Prompt + Chinese Notes") {
    return `${english}\n\n中文备注：\n${toBullets([
      "请先确认关键缺失信息，再生成最终内容。",
      "不要输入真实客户资料、账号、持仓、公司内部信息或其他敏感数据。",
      "如涉及分析、风险判断或自动化执行，请标注不确定性并保留人工复核。"
    ])}`;
  }

  return english;
}

function toChinesePrompt(card) {
  return [
    card.understoodIntent ? `理解后的意图：\n${card.understoodIntent}` : `理解后的意图：\n${card.intent.summary}`,
    `意图类型：\n- ${card.intent.type}`,
    `需求拆解：\n${formatBreakdown(card.requestBreakdown)}`,
    `角色：\n${card.role}`,
    `任务：\n${card.task}`,
    `背景：\n${card.context}`,
    `执行步骤：\n${toBullets(card.instructions)}`,
    `限制条件：\n${toBullets(card.constraints)}`,
    `输出格式：\n${toBullets(card.outputFormat)}`,
    `验收标准：\n${toBullets(card.acceptanceCriteria)}`,
    `安全边界：\n${toBullets(card.safetyBoundaries)}`,
    `风险提示：\n${toBullets(card.safety.risks)}`,
    `待确认问题：\n${toBullets(card.openQuestions)}`,
    `质量检查清单：\n${toBullets(card.qualityChecklist)}`
  ].filter(Boolean).join("\n\n");

}

function toBullets(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function formatBreakdown(breakdown) {
  return [
    `- User intent: ${breakdown.userIntent}`,
    `- Detected inputs:\n${toIndentedBullets(breakdown.detectedInputs)}`,
    `- Desired outputs:\n${toIndentedBullets(breakdown.desiredOutputs)}`,
    `- Core features:\n${toIndentedBullets(breakdown.coreFeatures)}`,
    `- User flow:\n${toIndentedBullets(breakdown.userFlows)}`,
    `- Data model:\n${toIndentedBullets(breakdown.dataModel)}`,
    `- Deployment target:\n${toIndentedBullets(breakdown.deploymentTarget)}`,
    `- Open questions:\n${toIndentedBullets(breakdown.openQuestions)}`
  ].join("\n");
}

function toIndentedBullets(items) {
  return items.map((item) => `  - ${item}`).join("\n");
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function renderPromptCard(card) {
  currentPromptCard = card;
  currentPromptText = card.structuredPrompt;
  requestBreakdown.textContent = formatBreakdown(card.requestBreakdown);
  structuredPrompt.textContent = card.structuredPrompt;
  renderList(missingInformation, card.missingInformation);
  renderList(safetyNotes, [...card.safetyBoundaries, ...card.riskNotes]);
  renderScores(card.qualityScore);
  promptCardPreview.textContent = JSON.stringify(card, null, 2);
  emptyState.classList.add("hidden");
  results.classList.remove("hidden");
}

function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
  statusMessage.classList.remove("hidden");
}

function hideStatus() {
  statusMessage.textContent = "";
  statusMessage.classList.remove("error");
  statusMessage.classList.add("hidden");
}

function renderList(element, items) {
  element.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
}

function renderScores(scores) {
  qualityScore.innerHTML = "";
  Object.entries(scores).forEach(([label, score]) => {
    const card = document.createElement("div");
    card.className = "score-card";
    card.innerHTML = `
      <div class="score-topline">
        <span>${label}</span>
        <span>${score}/10</span>
      </div>
      <div class="bar" aria-label="${label} score ${score} out of 10">
        <span style="width: ${score * 10}%"></span>
      </div>
    `;
    qualityScore.appendChild(card);
  });
}

function showEmptyInputMessage() {
  emptyState.innerHTML = '<span class="hint">Please enter a plain-language request before translating.</span>';
  hideStatus();
  emptyState.classList.remove("hidden");
  results.classList.add("hidden");
  currentPromptCard = null;
  currentPromptText = "";
}

async function copyPrompt() {
  if (!currentPromptText) {
    showEmptyInputMessage();
    return;
  }

  try {
    await navigator.clipboard.writeText(currentPromptText);
    copyButton.textContent = "Copied";
    setTimeout(() => {
      copyButton.textContent = "Copy Prompt";
    }, 1200);
  } catch {
    copyButton.textContent = "Copy failed";
    setTimeout(() => {
      copyButton.textContent = "Copy Prompt";
    }, 1400);
  }
}

function exportPromptCard() {
  if (!currentPromptCard) {
    showEmptyInputMessage();
    return;
  }

  const blob = new Blob([JSON.stringify(currentPromptCard, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "plain-speak-prompt-card.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

translateButton.addEventListener("click", async () => {
  const request = requestInput.value;
  if (!request.trim()) {
    showEmptyInputMessage();
    return;
  }

  translateButton.disabled = true;
  translateButton.textContent = compilerSelect.value === "ollama" ? "Asking Ollama..." : "Translating...";
  hideStatus();

  try {
    let card;
    if (compilerSelect.value === "ollama") {
      showStatus("Asking local Ollama to understand and rewrite the request...");
      card = await compilePromptWithOllama(request, modeSelect.value, languageSelect.value, {
        model: ollamaModel.value.trim() || "qwen2.5:7b",
        endpoint: ollamaEndpoint.value.trim() || "http://localhost:11434/api/generate"
      });
      showStatus("Ollama compiler succeeded.");
    } else {
      card = compilePrompt(request, modeSelect.value, languageSelect.value);
      showStatus("Rule-based compiler completed.");
    }
    renderPromptCard(card);
  } catch (error) {
    const fallbackCard = compilePrompt(request, modeSelect.value, languageSelect.value);
    fallbackCard.compiler = {
      type: "rules-fallback",
      reason: error.message
    };
    renderPromptCard(fallbackCard);
    showStatus(`Ollama failed, so rule-based fallback was used. ${error.message}`, true);
  } finally {
    translateButton.disabled = false;
    translateButton.textContent = "Translate into Structured Prompt";
  }
});

clearButton.addEventListener("click", () => {
  requestInput.value = "";
  hideStatus();
  emptyState.textContent = "Enter a messy request, let Ollama understand it, and turn it into a structured prompt card.";
  emptyState.classList.remove("hidden");
  results.classList.add("hidden");
  currentPromptCard = null;
  currentPromptText = "";
  requestInput.focus();
});

copyButton.addEventListener("click", copyPrompt);
exportButton.addEventListener("click", exportPromptCard);

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    requestInput.value = chip.textContent;
    requestInput.focus();
  });
});

window.compilePrompt = compilePrompt;
window.compilePromptWithOllama = compilePromptWithOllama;
