import Link from "next/link";

const taskCopy: Record<string, { title: string; body: string; action: string }> = {
  "loan-status": {
    title: "Loan status",
    body: "Open the borrower file at the exact status checkpoint and show what changed since the last review.",
    action: "Review status timeline"
  },
  "missing-document": {
    title: "Missing document",
    body: "Take the borrower directly to the outstanding document request with plain English instructions.",
    action: "Upload or request help"
  },
  "verification-recovery": {
    title: "Verification recovery",
    body: "Recover from a stuck verification code with retry timing, alternate delivery, support handoff, and device trust.",
    action: "Start recovery"
  },
  "condition-review": {
    title: "Condition review",
    body: "Open the underwriting condition with its reason, owner, required evidence, and escalation path.",
    action: "Review condition"
  },
  "scenario-answer": {
    title: "Scenario answer",
    body: "Open a loan officer scenario result with next steps, required documents, concerns, and audit notes.",
    action: "Open scenario result"
  }
};

export default function TaskRoute({ params }: { params: { taskType: string } }) {
  const task = taskCopy[params.taskType] ?? {
    title: "Workflow task",
    body: "This deep link opens a specific workflow task when the route is known.",
    action: "Return to workspace"
  };

  return (
    <main className="deep-link-page">
      <section className="deep-link-panel">
        <Link className="back-link" href="/">Back to workspace</Link>
        <p className="eyebrow">Deep link route</p>
        <h1>{task.title}</h1>
        <p>{task.body}</p>
        <Link className="primary-button" href={`/?route=${params.taskType}`}>{task.action}</Link>
      </section>
    </main>
  );
}
