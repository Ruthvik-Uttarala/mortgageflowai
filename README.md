# MortgageFlowAI

MortgageFlowAI is a production-style mortgage workflow platform created by Ruthvik Uttarala. It is built to address the same class of problems described in Sun West Mortgage and AngelAi software engineering roles: emotionally intelligent mortgage workflow automation, faster borrower guidance, loan officer productivity, explainable decision paths, fair lending support, and reliable financial workflow execution.

This is an interview project by Ruthvik Uttarala. It is inspired by public AngelAi, Celligence, and Sun West Mortgage product themes and is not affiliated with AngelAi, Celligence, or Sun West Mortgage.

## Product Overview

MortgageFlowAI gives borrowers, loan officers, and realtors a shared workflow layer for loan status, missing documents, scenario questions, verification recovery, deep links, and explainable next actions. The main application is not a chatbot clone. It is an operational dashboard that shows what changed, why it matters, which data was used, what is missing, what should happen next, and what requires human escalation.

## Why Ruthvik Built It

Mortgage decisions are stressful, slow, and highly regulated. Ruthvik built MortgageFlowAI to show full stack product engineering across React/Next.js, Node.js APIs, AWS Lambda structure, Python AI cells, MongoDB repositories, Oracle reporting SQL, C++ deterministic financial kernel code, and Java JNI integration notes.

## Public Product Insights Used

Public AngelAi and Sun West messaging emphasizes dependable mortgage AI, faster workflows, fair lending, personal assistant style guidance, and usefulness for consumers, mortgage brokers, and Realtors. App marketplace positioning and public review summaries commonly describe fast 24/7 help, quick mortgage answers, loan officer productivity, and support for homebuyers and real estate professionals. The project also targets likely friction areas around login verification, task routing, explainable decisions, and deep links into specific app work.

Source notes:

- AngelAi homepage: https://www.angelai.com/
- Sun West AngelAi page: https://www.swmc.com/angelai/
- AngelAi consumers page: https://www.angelai.com/consumers/
- AngelAi Realtors page: https://www.angelai.com/realty/
- Apple App Store search/listing source note: https://apps.apple.com/us/search?term=AngelAi
- Google Play search/listing source note: https://play.google.com/store/search?q=AngelAi&c=apps
- Sun West public site: https://www.swmc.com/
- Celligence public site: https://www.celligence.com/

## Real User Problems Targeted

- Borrowers feel anxious because mortgage decisions are complex and high stakes.
- Loan officers need fast scenario answers without waiting on emails or manual escalation.
- Realtors need confidence when guiding buyers through affordability, approvals, and next steps.
- Users can get stuck during login or verification code flows.
- Users need URLs that open exact missing documents, conditions, status screens, or scenario answers.
- Financial AI must be explainable, deterministic, auditable, and fair.
- Complex borrower files should receive clearer support, not worse guidance.

## Role Mapping

MortgageFlowAI maps to the Sun West and AngelAi role requirements by combining product judgment with implementation depth:

- React and Next.js frontend deployed on Vercel.
- Node.js API service with validation and repository pattern.
- AWS Lambda-compatible workflow handler.
- Python AI workflow cells with deterministic scoring and tests.
- MongoDB workflow storage adapter.
- Oracle SQL scripts for analytics, borrower aggregation, loan status, and condition review reporting.
- C++ financial kernel example with safe binary serialization and network byte order.
- Java JNI stub showing how Java services could call native financial logic.
- Security, privacy, and fair-lending documentation.

## Architecture

```text
Browser / Mobile Web
  |
  | Next.js app on Vercel
  | - borrower dashboard
  | - loan officer scenario form
  | - realtor readiness view
  | - verification recovery
  | - deep link routes
  | - rate lock utility
  v
Node.js API service
  |
  | Workflow engine contract
  | Repository pattern
  | Validation and audit events
  v
MongoDB workflow records and conversational state
  |
  +--> Python AI cells for scoring and explainable recommendations
  +--> AWS Lambda handler for deployable workflow execution
  +--> Oracle SQL reporting layer for analytics and conditions
  +--> C++ deterministic financial kernel
  +--> Java JNI integration stub
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Run checks:

```bash
npm run build
npm run test
python -m unittest discover -s python/tests
```

Local persistence uses `WORKFLOW_STORAGE_PATH` when `MONGODB_URI` is not configured. Do not commit real borrower data.

## Deploy Frontend And API Routes To Vercel

```bash
vercel deploy frontend --prod --scope <uttarala-ruthvik-vercel-scope> -y
```

The production target for Ruthvik's personal deployment is the `Uttarala Ruthvik` Vercel workspace and the `guidelightlabs-frontend` project. The Next.js app includes non-AWS backend routes under `frontend/app/api`, including:

- `POST /api/workflows`
- `POST /api/rate-lock`

Set production environment variables in Vercel if the app is connected to live MongoDB or external services.

## AWS Lambda Deployment Status

AWS deployment is pending. Do not deploy this project to AWS until Ruthvik provides the new personal AWS account details. The Lambda-compatible handler remains in the repository at `lambda/handler.js` so the workflow engine can be deployed later without changing the app contract.

When the correct AWS account is available, the required external inputs are:

- AWS account ID for the new personal account.
- AWS region.
- IAM Lambda execution role ARN.
- Permission to create or update the Lambda function and any API Gateway or Function URL endpoint.

Reference commands for later only:

```bash
cd lambda
npm install
zip -r function.zip .
aws lambda create-function \
  --function-name mortgageflowai-workflow-engine \
  --runtime nodejs20.x \
  --handler handler.handler \
  --role arn:aws:iam::<account-id>:role/<lambda-execution-role> \
  --zip-file fileb://function.zip
```

The repo does not contain AWS credentials.

## MongoDB And Oracle Fit

MongoDB stores workflow records, borrower task state, scenario answers, verification recovery attempts, and audit trails. The adapter is in `backend/src/repositories/MongoWorkflowRepository.js` and only connects when `MONGODB_URI` is supplied.

Oracle supports financial analytics and reporting use cases where structured SQL, aggregates, loan status reporting, and condition review history are expected. SQL scripts are in `db/oracle`.

## Security And Privacy Notes

Mortgage data is sensitive. This repository includes only safe local seed data and synthetic examples. Never commit real borrower names, SSNs, dates of birth, income documents, credit reports, addresses, account numbers, or credentials. Environment variables are used for secrets. The workflow output always includes missing data, human escalation, fairness rule, and audit events so AI assistance remains explainable and reviewable.

## 60 Second Loom Script

“Hi, I’m Ruthvik Uttarala. I built MortgageFlowAI as a production-style interview project for the kind of mortgage AI engineering work AngelAi and Sun West describe publicly. The app focuses on borrower anxiety, loan officer scenario speed, realtor confidence, verification recovery, deep links, fair-lending consistency, and explainable workflow decisions. The frontend is Next.js on Vercel. The backend is a Node API with MongoDB-capable repositories, a Lambda-ready handler, Python AI cells, Oracle reporting SQL, and a small C++ financial kernel with Java JNI notes. The key product point is that the system does not just answer questions. It explains what it decided, why, what data was used, what is missing, what the user should do next, and when a human should take over.”

## Interview Explanation

MortgageFlowAI demonstrates Ruthvik’s ability to connect product needs to production engineering. The borrower dashboard reduces anxiety with plain English status and next actions. The loan officer dashboard returns structured scenario guidance. The realtor dashboard turns readiness into a sendable action. The verification recovery flow targets a real login pain point. The deep link router proves that URLs can open exact tasks. The AI cells are modular, testable, and auditable. The data layer is designed for real storage without putting real PII in the repository.
