# Architecture

MortgageFlowAI is organized as a deployable full stack repository with clear boundaries between product UI, API orchestration, AI cells, database adapters, serverless deployment, and systems-level financial logic.

```text
frontend/ Next.js app
  |
  v
backend/ Node.js API service
  |
  +-- src/workflowEngine.js
  +-- src/repositories/FileWorkflowRepository.js
  +-- src/repositories/MongoWorkflowRepository.js
  |
  v
lambda/ AWS Lambda handler

python/ AI cells and scoring logic
systems/ C++ deterministic financial kernel
java/ JNI interface stub
db/mongodb/ MongoDB schema and seed notes
db/oracle/ Oracle reporting scripts
tests/ cross-system notes and manual workflow checks
```

## Data Flow

1. A borrower, loan officer, or realtor enters workflow data in the Next.js UI.
2. The app produces a structured workflow request.
3. The Node API validates and stores workflow records through the repository interface.
4. The workflow engine combines modular cells into a recommendation.
5. MongoDB stores workflow state when configured; local JSON is used only for safe local development.
6. Oracle SQL scripts support analytics and condition-review reporting.
7. Lambda exposes the workflow engine shape for AWS deployment.

## Explainable AI Cells

- Document completeness cell.
- Income complexity cell.
- Credit access cell.
- Fair lending consistency cell.
- Verification recovery cell.
- Deep link routing cell.
- Borrower emotion response cell.
- Loan officer scenario cell.
- Audit trail cell.

Each cell returns a decision, reasons, data used, missing data, next action, escalation condition, and fairness note.
