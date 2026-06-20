db.workflow_records.insertOne({
  id: "safe-sample-001",
  createdAt: "2026-06-20T00:00:00.000Z",
  input: {
    role: "loan_officer",
    loanType: "conventional",
    incomeType: "self-employed",
    propertyType: "primary",
    creditScoreRange: "640-699",
    documentState: "incomplete",
    emotion: "anxious",
    verificationAttempts: 2
  },
  recommendation: {
    decided: "Continue with guided review and targeted human escalation.",
    why: ["Synthetic sample only. No real borrower PII."],
    dataUsed: ["role", "loanType", "incomeType", "documentState", "emotion"],
    dataMissing: ["document checklist", "two-year income history"],
    nextAction: "/tasks/missing-document",
    humanEscalation: "Escalate scenario-specific questions to a licensed mortgage professional.",
    fairnessRule: "Apply identical required-data checks and escalation thresholds for comparable files."
  }
});
