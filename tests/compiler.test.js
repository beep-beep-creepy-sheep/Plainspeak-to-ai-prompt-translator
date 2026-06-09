const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const noopElement = {
  addEventListener() {},
  appendChild() {},
  classList: {
    add() {},
    remove() {},
    toggle() {},
    contains() {
      return false;
    }
  },
  focus() {},
  innerHTML: "",
  textContent: "",
  value: "",
  disabled: false
};

const context = {
  console,
  Blob,
  URL,
  document: {
    querySelector() {
      return noopElement;
    },
    querySelectorAll() {
      return [];
    },
    createElement() {
      return noopElement;
    },
    body: noopElement
  },
  navigator: {
    clipboard: {
      writeText() {
        return Promise.resolve();
      }
    }
  },
  window: {}
};

vm.createContext(context);
vm.runInContext(
  fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8"),
  context
);

const compilePrompt = context.window.compilePrompt;

function assertNoMojibake(text) {
  const suspiciousFragments = ["涓", "锛", "鎴", "甯", "绠", "歕n"];
  suspiciousFragments.forEach((fragment) => {
    assert(
      !text.includes(fragment),
      `Expected Chinese prompt to avoid mojibake fragment: ${fragment}`
    );
  });
}

const codingCard = compilePrompt(
  "Build a Codex prompt for a simple dashboard that uses mock activation data, includes tests, and avoids private user data.",
  "Coding",
  "English Prompt"
);

assert.equal(codingCard.schemaVersion, 2);
assert.equal(codingCard.intent.type, "coding");
assert.ok(Array.isArray(codingCard.inputs));
assert.ok(codingCard.outputs.includes("Working first version of the requested app"));
assert.ok(codingCard.acceptanceCriteria.length >= 3);
assert.ok(codingCard.openQuestions.length >= 1);
assert.ok(codingCard.safety.risks.length >= 1);
assert.ok(codingCard.structuredPrompt.includes("Acceptance Criteria"));

const chineseCard = compilePrompt(
  "帮我把一个产品想法整理成可以交给 Codex 执行的开发提示词，需要包含目标、页面、测试和安全边界。",
  "Coding",
  "Chinese Prompt"
);

assert.ok(chineseCard.structuredPrompt.includes("理解后的意图"));
assert.ok(chineseCard.structuredPrompt.includes("验收标准"));
assert.ok(chineseCard.structuredPrompt.includes("安全边界"));
assertNoMojibake(chineseCard.structuredPrompt);

console.log("compiler tests passed");
