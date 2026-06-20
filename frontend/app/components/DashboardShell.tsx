"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type WorkflowResult = {
  decided: string;
  why: string[];
  dataUsed: string[];
  dataMissing: string[];
  nextAction: string;
  humanEscalation: string;
  fairnessRule: string;
};

const emotionCopy: Record<string, { label: string; guidance: string; actionTone: string }> = {
  anxious: {
    label: "Anxious",
    guidance: "Use short steps, confirm what is already complete, and avoid vague waiting language.",
    actionTone: "One task at a time"
  },
  confused: {
    label: "Confused",
    guidance: "Translate conditions into plain English and show the exact evidence needed.",
    actionTone: "Explain before asking"
  },
  urgent: {
    label: "Urgent",
    guidance: "Prioritize lock, deadline, and human handoff signals before routine follow-up.",
    actionTone: "Route fastest path"
  },
  confident: {
    label: "Confident",
    guidance: "Keep the user moving with direct next steps and fewer reassurance messages.",
    actionTone: "Proceed with clarity"
  },
  frustrated: {
    label: "Frustrated",
    guidance: "Acknowledge friction, reduce repeated asks, and offer support handoff visibly.",
    actionTone: "Remove the blocker"
  }
};

const sampleResult: WorkflowResult = {
  decided: "Borrower is conditionally on track, but income evidence and verification recovery need attention.",
  why: [
    "Most required identity and asset documents are present.",
    "Self-employed income increases review complexity.",
    "Verification retries suggest the borrower may be stuck before upload completion."
  ],
  dataUsed: ["loan status", "document checklist", "income type", "credit score range", "verification attempts"],
  dataMissing: ["year-to-date profit and loss", "business bank statements", "alternate verification channel confirmation"],
  nextAction: "Send one deep link to income documents and keep verification recovery visible until confirmed.",
  humanEscalation: "Escalate if verification fails again or if income documents show declining revenue.",
  fairnessRule: "Apply the same document completeness and income complexity checks regardless of borrower profile."
};

function explainableCells(emotion: string, documentState: string) {
  return [
    ["Document completeness", documentState === "complete" ? "Complete" : "Needs evidence"],
    ["Income complexity", "Self-employed profile requires layered documentation"],
    ["Credit access", "Program fit should be reviewed before terms are discussed"],
    ["Fair lending consistency", "Same checklist applied before confidence changes"],
    ["Verification recovery", "Alternate delivery and support handoff available"],
    ["Deep link routing", "Task URLs open exact borrower work"],
    ["Borrower emotion response", emotionCopy[emotion].actionTone],
    ["Loan officer scenario", "Structured concerns returned"],
    ["Audit trail", "Decision events captured"]
  ];
}

export default function DashboardShell() {
  const [emotion, setEmotion] = useState("anxious");
  const [documentState, setDocumentState] = useState("incomplete");
  const [result, setResult] = useState<WorkflowResult>(sampleResult);
  const [rateText, setRateText] = useState("30 6.875% -0.125\n45 6.990% 0.000\n60 7.125% 0.250");
  const [rateRows, setRateRows] = useState<Array<{ raw: string; lockPeriodDays: string; rate: string; price: string }>>([]);
  const cells = useMemo(() => explainableCells(emotion, documentState), [emotion, documentState]);

  async function submitScenario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, emotion, documentState })
    });
    const data = await response.json();
    setResult(data.result);
  }

  async function parseRateLock() {
    const response = await fetch("/api/rate-lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: rateText })
    });
    const data = await response.json();
    setRateRows(data.rows);
  }

  return (
    <main className="app-shell">
      <nav className="topbar">
        <div>
          <p className="brand-kicker">MortgageFlowAI</p>
          <h1>Mortgage workflow decisions, explained.</h1>
        </div>
        <div className="top-actions">
          <Link href="/tasks/verification-recovery">Verification recovery</Link>
          <Link href="/about">About</Link>
        </div>
      </nav>

      <section className="workspace-grid">
        <aside className="sidebar">
          <p className="section-label">Borrower state</p>
          <div className="signal-grid">
            {Object.entries(emotionCopy).map(([key, value]) => (
              <button className={emotion === key ? "signal active" : "signal"} key={key} onClick={() => setEmotion(key)}>
                {value.label}
              </button>
            ))}
          </div>
          <div className="transparent-note">
            <strong>Transparent UX signal</strong>
            <span>{emotionCopy[emotion].guidance}</span>
          </div>

          <p className="section-label">Deep links</p>
          <Link href="/tasks/loan-status">Loan status</Link>
          <Link href="/tasks/missing-document">Missing document</Link>
          <Link href="/tasks/condition-review">Condition review</Link>
          <Link href="/tasks/scenario-answer">Scenario answer</Link>
        </aside>

        <section className="main-panel">
          <div className="status-strip">
            <div>
              <span>Loan status</span>
              <strong>Conditional approval</strong>
            </div>
            <div>
              <span>Missing documents</span>
              <strong>3</strong>
            </div>
            <div>
              <span>Next best action</span>
              <strong>Income packet</strong>
            </div>
          </div>

          <section className="borrower-dashboard">
            <div>
              <p className="section-label">Borrower dashboard</p>
              <h2>Maria can move forward after income evidence and verification recovery.</h2>
              <p>
                The file is not stalled because of risk alone. It is waiting on specific evidence and a working
                verification path. Send one task link, keep the explanation short, and escalate if the code fails again.
              </p>
            </div>
            <div className="task-list">
              <label>
                <input type="radio" checked={documentState === "incomplete"} onChange={() => setDocumentState("incomplete")} />
                Income packet incomplete
              </label>
              <label>
                <input type="radio" checked={documentState === "complete"} onChange={() => setDocumentState("complete")} />
                Core documents complete
              </label>
            </div>
          </section>

          <section className="result-grid">
            <article className="result-panel">
              <p className="section-label">Explainable workflow result</p>
              <h2>{result.decided}</h2>
              <div className="explain-grid">
                <div><span>Why</span><p>{result.why.join(" ")}</p></div>
                <div><span>Data used</span><p>{result.dataUsed.join(", ")}</p></div>
                <div><span>Missing</span><p>{result.dataMissing.join(", ") || "No required data missing"}</p></div>
                <div><span>Next</span><p>{result.nextAction}</p></div>
                <div><span>Escalate</span><p>{result.humanEscalation}</p></div>
                <div><span>Fairness</span><p>{result.fairnessRule}</p></div>
              </div>
            </article>

            <article className="cell-panel">
              <p className="section-label">AI cells</p>
              {cells.map(([name, value]) => (
                <div className="cell-row" key={name}>
                  <span>{name}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </article>
          </section>

          <section className="operator-grid">
            <form className="scenario-form" onSubmit={submitScenario}>
              <p className="section-label">Loan officer dashboard</p>
              <h2>Scenario answer builder</h2>
              <textarea name="question" defaultValue="Can a self-employed borrower with incomplete income docs continue toward conditional approval?" />
              <div className="form-grid">
                <input name="borrowerName" placeholder="Borrower reference" defaultValue="Synthetic file A-104" />
                <select name="incomeType" defaultValue="self-employed"><option value="w2">W-2</option><option value="self-employed">Self-employed</option><option value="mixed">Mixed income</option></select>
                <select name="loanType" defaultValue="conventional"><option>conventional</option><option>fha</option><option>va</option><option>jumbo</option></select>
                <select name="propertyType" defaultValue="primary"><option>primary</option><option>investment</option><option>second home</option></select>
                <select name="creditScoreRange" defaultValue="640-699"><option>580-639</option><option>640-699</option><option>700-739</option><option>740+</option></select>
                <input name="downPayment" placeholder="Down payment" defaultValue="8%" />
                <select name="employmentType" defaultValue="business owner"><option>wage earner</option><option>business owner</option><option>contractor</option></select>
                <select name="documentState" value={documentState} onChange={(event) => setDocumentState(event.target.value)}><option value="incomplete">incomplete</option><option value="complete">complete</option></select>
              </div>
              <button className="primary-button" type="submit">Run scenario</button>
            </form>

            <section className="realtor-panel">
              <p className="section-label">Realtor dashboard</p>
              <h2>Buyer readiness: medium-high</h2>
              <p>Affordability guidance is usable, but the buyer should not be told the file is final until income evidence is reviewed.</p>
              <div className="sendable-action">Send buyer: “Your approval is moving. Please use this secure link for the income packet so underwriting can review the final condition.”</div>
            </section>
          </section>

          <section className="operator-grid">
            <section className="verification-panel">
              <p className="section-label">Verification recovery flow</p>
              <h2>Code did not arrive</h2>
              <ol>
                <li>Wait 45 seconds before retry to avoid duplicate codes.</li>
                <li>Switch delivery to voice call or email.</li>
                <li>Trust this device after successful verification.</li>
                <li>Hand off to support if two attempts fail.</li>
              </ol>
              <button className="secondary-button">Send alternate code</button>
            </section>

            <section className="rate-panel">
              <p className="section-label">Internal rate and lock utility</p>
              <h2>Parse lock table text</h2>
              <textarea value={rateText} onChange={(event) => setRateText(event.target.value)} />
              <button className="secondary-button" onClick={parseRateLock}>Parse table</button>
              <table>
                <thead><tr><th>Days</th><th>Rate</th><th>Price</th></tr></thead>
                <tbody>{rateRows.map((row) => <tr key={row.raw}><td>{row.lockPeriodDays}</td><td>{row.rate}</td><td>{row.price}</td></tr>)}</tbody>
              </table>
            </section>
          </section>
        </section>
      </section>
    </main>
  );
}
