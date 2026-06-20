import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-panel">
        <Link className="back-link" href="/">Back to workspace</Link>
        <p className="eyebrow">Interview project disclosure</p>
        <h1>MortgageFlowAI was created by Ruthvik Uttarala.</h1>
        <p>
          This project is inspired by public AngelAi, Celligence, and Sun West Mortgage product themes:
          dependable mortgage AI, faster workflows, fair-lending support, personal assistant style guidance,
          and productivity for borrowers, loan officers, and realtors.
        </p>
        <p>
          MortgageFlowAI is not affiliated with AngelAi, Celligence, or Sun West Mortgage. It is a portfolio
          and interview project intended to show product thinking, full stack execution, explainable workflow
          logic, and systems engineering depth.
        </p>
      </section>
    </main>
  );
}
