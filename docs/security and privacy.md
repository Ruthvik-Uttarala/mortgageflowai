# Security And Privacy

Mortgage workflows involve sensitive financial and identity data. MortgageFlowAI is designed around privacy-by-default development practices.

## Repository Rules

- Do not commit real borrower PII.
- Do not commit SSNs, dates of birth, credit reports, bank statements, income documents, tax records, account numbers, addresses tied to real borrowers, or credentials.
- Use `.env` files for secrets and keep them ignored.
- Use synthetic sample records only.

## Application Controls

- Workflow responses include human escalation notes when confidence is low or required data is missing.
- Fair lending consistency is represented as a first-class workflow cell.
- Audit trail events are included in each recommendation.
- Verification recovery copy avoids blaming the user and offers alternate delivery, retry timing, support handoff, and device trust.

## Production Hardening Needed Before Real Use

- Add authentication and role-based access control.
- Encrypt data in transit and at rest.
- Configure field-level redaction for logs.
- Add audit log retention policies.
- Add compliance review for ECOA, FCRA, GLBA, and company-specific lending policies.
- Run security review before connecting to production borrower systems.
