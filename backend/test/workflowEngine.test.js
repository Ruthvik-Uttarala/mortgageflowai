const test = require("node:test");
const assert = require("node:assert/strict");
const { createWorkflowEngine } = require("../src/workflowEngine");

function memoryRepository() {
  const records = [];
  return {
    async save(record) {
      records.push(record);
      return record;
    },
    async findById(id) {
      return records.find((record) => record.id === id) || null;
    }
  };
}

test("creates explainable workflow with fairness and deep link output", async () => {
  const engine = createWorkflowEngine({ repository: memoryRepository() });
  const record = await engine.createWorkflow({
    role: "loan_officer",
    loanType: "conventional",
    incomeType: "self-employed",
    propertyType: "primary",
    creditScoreRange: "640-699",
    documentState: "incomplete",
    emotion: "anxious",
    verificationAttempts: 2
  });

  assert.equal(record.recommendation.nextAction, "/tasks/missing-document");
  assert.match(record.recommendation.fairnessRule, /identical required-data checks/);
  assert.equal(record.recommendation.cells.length, 9);
  assert.ok(record.recommendation.dataMissing.includes("complete document packet"));
});

test("validates required workflow fields", async () => {
  const engine = createWorkflowEngine({ repository: memoryRepository() });
  await assert.rejects(
    () => engine.createWorkflow({ role: "borrower" }),
    /Missing required workflow fields/
  );
});
