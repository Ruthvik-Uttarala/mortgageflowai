const crypto = require("crypto");

function validateWorkflow(input) {
  const required = ["role", "loanType", "documentState", "emotion"];
  const missing = required.filter((key) => !input[key]);
  if (missing.length) {
    const error = new Error(`Missing required workflow fields: ${missing.join(", ")}`);
    error.code = "VALIDATION_ERROR";
    throw error;
  }
}

function documentCompletenessCell(input) {
  const complete = input.documentState === "complete";
  return {
    cell: "document_completeness",
    decision: complete ? "complete" : "missing_documents",
    reasons: complete ? ["Core documents are marked complete."] : ["At least one required document is missing."],
    missingData: complete ? [] : ["current document checklist", "borrower upload confirmation"],
    nextAction: complete ? "Continue to scenario review." : "Send a deep link to the missing document task."
  };
}

function incomeComplexityCell(input) {
  const complex = ["self-employed", "mixed", "contractor"].includes(input.incomeType);
  return {
    cell: "income_complexity",
    decision: complex ? "complex_income" : "standard_income",
    reasons: complex ? ["Income type requires layered evidence."] : ["Income type can follow standard verification."],
    missingData: complex ? ["two-year history", "year-to-date support"] : [],
    nextAction: complex ? "Route to income review checklist." : "Verify paystub and W-2 data."
  };
}

function creditAccessCell(input) {
  const lowBand = input.creditScoreRange === "580-639";
  return {
    cell: "credit_access",
    decision: lowBand ? "review_program_fit" : "standard_program_fit",
    reasons: lowBand ? ["Credit band may need compensating factors."] : ["Credit band does not trigger extra review by itself."],
    missingData: lowBand ? ["program eligibility notes"] : [],
    nextAction: lowBand ? "Escalate program-fit question before quoting terms." : "Continue with normal scenario guidance."
  };
}

function fairLendingConsistencyCell() {
  return {
    cell: "fair_lending_consistency",
    decision: "consistent_checklist_applied",
    reasons: ["Guidance is based on file data, missing evidence, and program requirements, not protected-class proxies."],
    missingData: [],
    nextAction: "Keep reasons attached to the audit trail."
  };
}

function verificationRecoveryCell(input) {
  const stuck = Number(input.verificationAttempts || 0) >= 2;
  return {
    cell: "verification_recovery",
    decision: stuck ? "offer_recovery" : "normal_verification",
    reasons: stuck ? ["Repeated verification attempts indicate possible login friction."] : ["Verification attempts are within normal range."],
    missingData: stuck ? ["alternate delivery confirmation"] : [],
    nextAction: stuck ? "Offer retry timing, alternate channel, support handoff, and device trust." : "Continue standard verification."
  };
}

function deepLinkRoutingCell(input) {
  const task = input.deepLinkTask || (input.documentState === "complete" ? "loan-status" : "missing-document");
  return {
    cell: "deep_link_routing",
    decision: task,
    reasons: ["The workflow maps the user to the exact next task rather than a generic dashboard."],
    missingData: [],
    nextAction: `/tasks/${task}`
  };
}

function borrowerEmotionResponseCell(input) {
  const map = {
    anxious: "Use a single next action and plain English reassurance.",
    confused: "Define the condition before requesting documents.",
    urgent: "Prioritize deadlines and human handoff.",
    confident: "Keep copy direct and concise.",
    frustrated: "Acknowledge the blocker and reduce repeated steps."
  };
  return {
    cell: "borrower_emotion_response",
    decision: input.emotion,
    reasons: [map[input.emotion] || "Use neutral, transparent workflow copy."],
    missingData: [],
    nextAction: map[input.emotion] || "Show next action."
  };
}

function loanOfficerScenarioCell(input) {
  const concerns = [];
  if (input.incomeType === "self-employed") concerns.push("self-employed income documentation");
  if (input.documentState !== "complete") concerns.push("missing document evidence");
  if (input.propertyType === "investment") concerns.push("investment property eligibility");
  return {
    cell: "loan_officer_scenario",
    decision: concerns.length ? "structured_review_needed" : "ready_for_standard_review",
    reasons: concerns.length ? concerns : ["Scenario inputs do not trigger additional concerns."],
    missingData: input.documentState === "complete" ? [] : ["complete document packet"],
    nextAction: concerns.length ? "Return required documents, concerns, and escalation notes." : "Proceed with standard next steps."
  };
}

function auditTrailCell(input) {
  return {
    cell: "audit_trail",
    decision: "audit_events_created",
    reasons: ["Workflow input, cells, recommendation, and fairness rule are traceable."],
    missingData: [],
    nextAction: "Store audit events with the workflow record.",
    events: [
      { event: "workflow_received", at: new Date().toISOString(), role: input.role },
      { event: "cells_evaluated", at: new Date().toISOString() }
    ]
  };
}

function combineCells(input, cells) {
  const missing = [...new Set(cells.flatMap((cell) => cell.missingData || []))];
  const escalationNeeded = cells.some((cell) => ["complex_income", "review_program_fit", "offer_recovery", "structured_review_needed"].includes(cell.decision));
  return {
    decided: escalationNeeded ? "Continue with guided review and targeted human escalation." : "Proceed through the standard mortgage workflow.",
    why: cells.flatMap((cell) => cell.reasons),
    dataUsed: Object.keys(input).filter((key) => input[key] !== undefined && input[key] !== ""),
    dataMissing: missing,
    nextAction: cells.find((cell) => cell.cell === "deep_link_routing").nextAction,
    humanEscalation: escalationNeeded ? "Escalate scenario-specific questions to a licensed mortgage professional." : "No immediate human escalation required.",
    fairnessRule: "Apply identical required-data checks and escalation thresholds for comparable files.",
    cells
  };
}

function createWorkflowEngine({ repository }) {
  return {
    async createWorkflow(input) {
      validateWorkflow(input);
      const cells = [
        documentCompletenessCell(input),
        incomeComplexityCell(input),
        creditAccessCell(input),
        fairLendingConsistencyCell(input),
        verificationRecoveryCell(input),
        deepLinkRoutingCell(input),
        borrowerEmotionResponseCell(input),
        loanOfficerScenarioCell(input),
        auditTrailCell(input)
      ];
      const recommendation = combineCells(input, cells);
      const record = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        input,
        recommendation
      };
      await repository.save(record);
      return record;
    }
  };
}

module.exports = {
  createWorkflowEngine,
  validateWorkflow,
  documentCompletenessCell,
  incomeComplexityCell,
  creditAccessCell,
  fairLendingConsistencyCell,
  verificationRecoveryCell,
  deepLinkRoutingCell,
  borrowerEmotionResponseCell,
  loanOfficerScenarioCell,
  auditTrailCell
};
