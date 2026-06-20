import { NextResponse } from "next/server";

type ScenarioInput = {
  borrowerName?: string;
  incomeType?: string;
  loanType?: string;
  propertyType?: string;
  creditScoreRange?: string;
  downPayment?: string;
  employmentType?: string;
  documentState?: string;
  emotion?: string;
  question?: string;
};

function evaluateScenario(input: ScenarioInput) {
  const missing = [
    ["incomeType", input.incomeType],
    ["loanType", input.loanType],
    ["creditScoreRange", input.creditScoreRange],
    ["documentState", input.documentState]
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  const concerns = [];
  if (input.incomeType === "self-employed") concerns.push("Self-employed income needs two-year history and year-to-date support.");
  if (input.creditScoreRange === "580-639") concerns.push("Credit access may require compensating factors and careful program fit.");
  if (input.documentState === "incomplete") concerns.push("Missing documents should be resolved before confidence increases.");

  return {
    decided: missing.length ? "Needs targeted evidence before final guidance" : "Ready for structured scenario review",
    why: concerns.length ? concerns : ["Key scenario fields are present and can be routed to next-step review."],
    dataUsed: Object.entries(input).filter(([, value]) => Boolean(value)).map(([key]) => key),
    dataMissing: missing,
    nextAction: missing.length ? "Collect missing scenario data and rerun the cell result." : "Send required documents and concerns to the loan officer queue.",
    humanEscalation: concerns.length > 1 ? "Escalate to a licensed mortgage professional for program-specific review." : "No immediate escalation unless borrower asks for loan terms.",
    fairnessRule: "Use the same required-data checklist for every borrower profile before confidence changes.",
    auditTrail: [
      { event: "scenario_received", at: new Date().toISOString() },
      { event: "explainable_cells_evaluated", at: new Date().toISOString() }
    ]
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as ScenarioInput;
  return NextResponse.json({ id: crypto.randomUUID(), result: evaluateScenario(body) }, { status: 201 });
}
