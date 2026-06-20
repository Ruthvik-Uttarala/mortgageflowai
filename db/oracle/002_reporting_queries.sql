-- Borrower aggregation by loan type and document state.
SELECT
  loan_type,
  document_state,
  COUNT(*) AS workflow_count
FROM borrower_workflow
GROUP BY loan_type, document_state
ORDER BY loan_type, document_state;

-- Loan status reporting with open condition counts.
SELECT
  bw.workflow_id,
  bw.loan_type,
  bw.document_state,
  bw.next_action,
  SUM(CASE WHEN lc.condition_status <> 'cleared' THEN 1 ELSE 0 END) AS open_conditions
FROM borrower_workflow bw
LEFT JOIN loan_condition lc ON lc.workflow_id = bw.workflow_id
GROUP BY bw.workflow_id, bw.loan_type, bw.document_state, bw.next_action;

-- Condition review queue with escalation priority.
SELECT
  lc.condition_id,
  lc.workflow_id,
  lc.condition_type,
  lc.condition_status,
  lc.owner_role,
  lc.required_evidence,
  lc.escalated_flag
FROM loan_condition lc
WHERE lc.condition_status IN ('open', 'pending_borrower', 'pending_review')
ORDER BY lc.escalated_flag DESC, lc.condition_type;
