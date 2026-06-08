const requestInput = document.querySelector("#requestInput");
const modeSelect = document.querySelector("#modeSelect");
const languageSelect = document.querySelector("#languageSelect");
const translateButton = document.querySelector("#translateButton");
const clearButton = document.querySelector("#clearButton");
const copyButton = document.querySelector("#copyButton");
const exportButton = document.querySelector("#exportButton");
const emptyState = document.querySelector("#emptyState");
const results = document.querySelector("#results");
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

  const promptCard = {
    originalRequest: cleanRequest,
    mode,
    outputLanguage,
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

function buildTask(request, mode) {
  if (mode === "Evaluation") {
    return `Create deterministic eval cases for this request: "${request}"`;
  }
  return `Transform this plain-language request into a clear, structured AI instruction: "${request}"`;
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
    `Role:\n${card.role}`,
    `Task:\n${card.task}`,
    `Context:\n${card.context}`,
    `Instructions:\n${toBullets(card.instructions)}`,
    `Constraints:\n${toBullets(card.constraints)}`,
    `Output Format:\n${toBullets(card.outputFormat)}`,
    `Safety Boundaries:\n${toBullets(card.safetyBoundaries)}`,
    `Quality Checklist:\n${toBullets(card.qualityChecklist)}`
  ].join("\n\n");

  if (outputLanguage === "Chinese Prompt") {
    return toChinesePrompt(card);
  }

  if (outputLanguage === "English Prompt + Chinese Notes") {
    return `${english}\n\n中文备注：\n${toBullets([
      "请先确认缺失信息，再生成最终内容。",
      "不要输入真实客户资料、账号、持仓或公司内部信息。",
      "如涉及分析或风险判断，请标注不确定性并保留人工复核。"
    ])}`;
  }

  return english;
}

function toChinesePrompt(card) {
  return [
    `角色：\n${card.role}`,
    `任务：\n${card.task}`,
    `背景：\n${card.context}`,
    `执行步骤：\n${toBullets(card.instructions)}`,
    `限制条件：\n${toBullets(card.constraints)}`,
    `输出格式：\n${toBullets(card.outputFormat)}`,
    `安全边界：\n${toBullets(card.safetyBoundaries)}`,
    `质量检查清单：\n${toBullets(card.qualityChecklist)}`
  ].join("\n\n");
}

function toBullets(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function renderPromptCard(card) {
  currentPromptCard = card;
  currentPromptText = card.structuredPrompt;
  structuredPrompt.textContent = card.structuredPrompt;
  renderList(missingInformation, card.missingInformation);
  renderList(safetyNotes, [...card.safetyBoundaries, ...card.riskNotes]);
  renderScores(card.qualityScore);
  promptCardPreview.textContent = JSON.stringify(card, null, 2);
  emptyState.classList.add("hidden");
  results.classList.remove("hidden");
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

translateButton.addEventListener("click", () => {
  const request = requestInput.value;
  if (!request.trim()) {
    showEmptyInputMessage();
    return;
  }

  const card = compilePrompt(request, modeSelect.value, languageSelect.value);
  renderPromptCard(card);
});

clearButton.addEventListener("click", () => {
  requestInput.value = "";
  emptyState.textContent = "Enter a request, choose a mode, and translate it into a structured prompt card.";
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
