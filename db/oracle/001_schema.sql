CREATE TABLE borrower_workflow (
  workflow_id VARCHAR2(64) PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  role_name VARCHAR2(32) NOT NULL,
  loan_type VARCHAR2(64) NOT NULL,
  document_state VARCHAR2(32) NOT NULL,
  emotion_signal VARCHAR2(32) NOT NULL,
  next_action VARCHAR2(256) NOT NULL,
  fairness_rule VARCHAR2(512) NOT NULL
);

CREATE TABLE loan_condition (
  condition_id VARCHAR2(64) PRIMARY KEY,
  workflow_id VARCHAR2(64) NOT NULL REFERENCES borrower_workflow(workflow_id),
  condition_type VARCHAR2(64) NOT NULL,
  condition_status VARCHAR2(32) NOT NULL,
  owner_role VARCHAR2(32) NOT NULL,
  required_evidence VARCHAR2(512),
  escalated_flag CHAR(1) DEFAULT 'N' CHECK (escalated_flag IN ('Y', 'N'))
);

CREATE INDEX idx_borrower_workflow_status ON borrower_workflow(document_state, loan_type);
CREATE INDEX idx_loan_condition_workflow ON loan_condition(workflow_id, condition_status);
