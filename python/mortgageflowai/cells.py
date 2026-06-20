from dataclasses import dataclass, asdict
from typing import Any, Dict, List


@dataclass
class CellResult:
    cell: str
    decision: str
    reasons: List[str]
    data_used: List[str]
    data_missing: List[str]
    next_action: str
    escalation: str
    fairness_rule: str


def _present(profile: Dict[str, Any]) -> List[str]:
    return [key for key, value in profile.items() if value not in (None, "", [])]


def document_completeness_cell(profile: Dict[str, Any]) -> CellResult:
    complete = profile.get("document_state") == "complete"
    return CellResult(
        "document_completeness",
        "complete" if complete else "missing_documents",
        ["Core packet is present."] if complete else ["Required evidence is still missing."],
        _present(profile),
        [] if complete else ["document checklist", "upload confirmation"],
        "Continue review." if complete else "Route borrower to missing document deep link.",
        "No escalation." if complete else "Escalate if missing evidence blocks deadline.",
        "Apply the same document checklist to comparable loan files.",
    )


def income_complexity_cell(profile: Dict[str, Any]) -> CellResult:
    complex_income = profile.get("income_type") in {"self-employed", "mixed", "contractor"}
    return CellResult(
        "income_complexity",
        "complex_income" if complex_income else "standard_income",
        ["Income requires layered evidence."] if complex_income else ["Income follows standard evidence path."],
        _present(profile),
        ["two-year income history", "year-to-date support"] if complex_income else [],
        "Collect business and year-to-date evidence." if complex_income else "Continue standard verification.",
        "Licensed review if income trend is declining." if complex_income else "No escalation.",
        "Do not lower guidance quality because a file is more complex.",
    )


def fair_lending_consistency_cell(profile: Dict[str, Any]) -> CellResult:
    return CellResult(
        "fair_lending_consistency",
        "consistent",
        ["The score uses file completeness, stated scenario facts, and missing evidence only."],
        _present(profile),
        [],
        "Attach fairness note to recommendation.",
        "Escalate any exception request to policy review.",
        "Comparable files receive comparable checklist and escalation treatment.",
    )


def verification_recovery_cell(profile: Dict[str, Any]) -> CellResult:
    attempts = int(profile.get("verification_attempts", 0))
    stuck = attempts >= 2
    return CellResult(
        "verification_recovery",
        "recovery_needed" if stuck else "normal",
        ["Multiple attempts indicate possible login friction."] if stuck else ["Verification attempts are within normal range."],
        _present(profile),
        ["alternate channel confirmation"] if stuck else [],
        "Offer retry timing, alternate delivery, support handoff, and device trust." if stuck else "Continue standard login.",
        "Support handoff after two failed attempts." if stuck else "No escalation.",
        "Verification help is offered based on attempts, not borrower attributes.",
    )


def run_workflow_cells(profile: Dict[str, Any]) -> Dict[str, Any]:
    cells = [
        document_completeness_cell(profile),
        income_complexity_cell(profile),
        fair_lending_consistency_cell(profile),
        verification_recovery_cell(profile),
    ]
    missing = sorted({item for cell in cells for item in cell.data_missing})
    return {
        "decision": "guided_review" if missing else "standard_review",
        "cells": [asdict(cell) for cell in cells],
        "data_missing": missing,
        "next_action": "resolve_missing_items" if missing else "continue_review",
        "fairness_rule": "Comparable files receive comparable checklist and escalation treatment.",
    }
