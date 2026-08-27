# ControlPlane — AI Firewall

> **Detect. Decide. Intervene. Before AI risk becomes a business incident.**

ControlPlane is a working hackathon prototype for an enterprise AI control layer. It sits between AI systems and the user, evaluates every candidate response across **Performance, Cost and Responsibility**, and chooses an intervention: **ALLOW, REPAIR, ESCALATE or BLOCK**.

## Table of Contents

- [1. What Problem Are We Solving?](#1-what-problem-are-we-solving)
- [2. What We Built](#2-what-we-built)
- [3. Why This Is Different](#3-why-this-is-different)
- [4. How the System Works](#4-how-the-system-works)
- [5. Architecture](#5-architecture)
- [6. MVC Structure](#6-mvc-structure)
- [7. Risk Engines](#7-risk-engines)
- [8. Decision Engine](#8-decision-engine)
- [9. Enterprise Knowledge Base](#9-enterprise-knowledge-base)
- [10. Optional Real LLM Evaluation](#10-optional-real-llm-evaluation)
- [11. Project Structure](#11-project-structure)
- [12. Setup](#12-setup)
- [13. Run](#13-run)
- [14. Test](#14-test)
- [15. API Endpoints](#15-api-endpoints)
- [16. Demo Scenarios](#16-demo-scenarios)
- [17. Dashboard Field Guide](#17-dashboard-field-guide)
- [18. Human Escalation Queue](#18-human-escalation-queue)
- [19. Auditability](#19-auditability)
- [20. How to Present It](#20-how-to-present-it)
- [21. Easy Demo Manual](#21-easy-demo-manual)
- [22. Architecture Walkthrough](#22-architecture-walkthrough)
- [23. Limitations and Production Roadmap](#23-limitations-and-production-roadmap)
- [24. GitHub Submission Checklist](#24-github-submission-checklist)


## 1. What Problem Are We Solving?

Enterprise AI can be confidently wrong, contradictory, unsafe, privacy-sensitive or unnecessarily expensive.

The traditional control gap is:

```text
AI Response -> User acts -> Problem discovered -> TOO LATE
```

ControlPlane changes the control point to:

```text
AI Response -> ControlPlane -> Risk decision -> User / Business System
```

The goal is not to prove that an AI model is always correct. The goal is to make the **trust decision explicit, explainable and enforceable before the answer becomes an action**.

## 2. What We Built

ControlPlane contains:

- a lightweight Fast Risk Screen;
- a Performance Engine for evidence and contradiction signals;
- a Cost Engine for execution efficiency;
- a Responsibility Engine for PII, safety and policy signals;
- a Risk-Adaptive Decision Engine;
- an enterprise knowledge-base retrieval layer;
- an optional OpenAI-compatible LLM evaluator;
- a human escalation queue;
- configurable policy thresholds;
- a repair engine that can transform a risky response before release;
- an auditable local data store;
- a dashboard for live demonstrations.

## 3. Why This Is Different

Many AI-safety demos stop at “detect a problem.” ControlPlane continues to **decide what to do**.

The key idea is:

```text
Low risk  -> fast path -> ALLOW
Medium    -> REPAIR
Serious   -> ESCALATE
Unacceptable -> BLOCK
```

The prototype also treats **cost as a first-class AI risk**, not merely an analytics metric.

## 4. How the System Works

1. An AI application generates a response.
2. ControlPlane runs a Fast Risk Screen.
3. The response is assessed by three independent engines.
4. Trusted enterprise evidence is retrieved when relevant.
5. The Decision Engine combines risk, confidence and business impact.
6. The response is allowed, repaired, escalated or blocked.
7. An audit record is stored.

## 5. Architecture

```text
                    ENTERPRISE AI / AGENT
                             |
                             v
                    +------------------+
                    |  FAST RISK SCREEN|
                    +--------+---------+
                             |
             +---------------+---------------+
             |               |               |
             v               v               v
      +------------+  +------------+  +---------------+
      | PERFORMANCE|  |    COST    |  | RESPONSIBILITY|
      |   ENGINE   |  |   ENGINE   |  |    ENGINE     |
      +------+-----+  +------+-----+  +-------+-------+
             |               |                |
             +---------------+----------------+
                             |
                             v
                  +------------------------+
                  | RISK-ADAPTIVE         |
                  | DECISION ENGINE       |
                  +-----------+------------+
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
            ALLOW           REPAIR         ESCALATE
                                              |
                                              v
                                       HUMAN REVIEW
                                              |
                                              v
                                            BLOCK

              All decisions -> Audit Trail
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for design rationale.

## 6. MVC Structure

The repository uses an MVC-style separation:

- **Model** — `server/models/` stores policy, evaluations and escalation state.
- **View** — `public/` renders the dashboard.
- **Controller** — `server/controllers/` coordinates evaluation requests.
- **Services** — `server/services/` contains the risk engines and decision logic.
- **Routes** — `server/routes/` exposes the HTTP API.

This separation keeps UI code independent from risk logic.

## 7. Risk Engines

### Performance Engine

Answers: **“Can we trust what the AI said?”**

Signals include:

- overconfident wording;
- contradictions with supplied trusted context;
- low evidence overlap;
- retrieved enterprise evidence;
- conflicts with retrieved policy language.

### Cost Engine

Answers: **“Was the AI execution efficient?”**

Signals include:

- input tokens;
- output tokens;
- model calls;
- tool calls;
- retries;
- latency;
- estimated cost.

### Responsibility Engine

Answers: **“Is the response safe and compliant?”**

Signals include:

- email addresses;
- phone numbers;
- identifiers such as Aadhaar/passport/credit-card patterns;
- credentials and secrets;
- unsafe/security-sensitive language;
- explicit policy-violation language;
- basic bias signals.

## 8. Decision Engine

The Decision Engine combines the three risk dimensions.

Default weighting in the prototype:

- Performance: 45%
- Cost: 20%
- Responsibility: 35%

Business impact can increase the overall score. High-impact requests can also require enterprise evidence.

The four actions are:

| Decision | Meaning |
|---|---|
| `ALLOW` | Release the response. |
| `REPAIR` | Automatically correct a known issue before release. The demo can redact detected PII and reduce unsupported certainty. |
| `ESCALATE` | Route to a human reviewer with evidence and risk signals. |
| `BLOCK` | Prevent the response from reaching the user. |

## 9. Enterprise Knowledge Base

The demo includes small trusted policy files under `data/knowledge/`.

Examples:

- `launch-policy.txt`
- `hr-policy.txt`
- `security-policy.txt`
- `customer-support.txt`

This makes the enterprise-evidence path visible and reproducible.

A production implementation would replace this local folder with a durable enterprise knowledge source or RAG system.

## 10. Optional Real LLM Evaluation

The prototype works without an API key for reliable offline demonstrations.

To enable LLM-assisted evaluation, copy `.env.example` to `.env` and set:

```text
AI_PROVIDER_URL=https://api.openai.com/v1/chat/completions
AI_PROVIDER_KEY=your_key_here
AI_MODEL=gpt-4.1-mini
```

The gateway expects an OpenAI-compatible chat-completions response.

The LLM is used as an **additional evaluator**, not as the only control. This preserves deterministic fallbacks for the demo.

Never commit `.env` or API keys to GitHub.

## 11. Project Structure

```text
controlplane-working-final/
├── data/
│   └── knowledge/
├── docs/
│   ├── DEMO_MANUAL.md
│   └── PROJECT_MANUAL.md
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── server/
│   ├── controllers/
│   │   └── evaluationController.js
│   ├── models/
│   │   └── store.js
│   ├── routes/
│   │   └── router.js
│   └── services/
│       ├── aiGateway.js
│       ├── costEngine.js
│       ├── decisionEngine.js
│       ├── fastScreen.js
│       ├── knowledgeBase.js
│       ├── performanceEngine.js
│       └── responsibilityEngine.js
├── tests/
│   └── controlplane.test.js
├── .env.example
├── .gitignore
├── ARCHITECTURE.md
├── Dockerfile
├── LICENSE
├── package.json
├── README.md
└── server.js
```

## 12. Setup

### Prerequisite

Install Node.js 20+.

Check:

```bash
node --version
npm --version
```

### Install

```bash
npm install
```

This project intentionally uses Node's built-in HTTP/fetch/test capabilities so the core demo has a small dependency surface.

## 13. Run

Start the server:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

For development:

```bash
npm run dev
```

## 14. Test

Run the automated tests:

```bash
npm test
```

Run syntax checks:

```bash
npm run check
```

## 15. API Endpoints

### Health

```http
GET /api/health
```

### Evaluate

```http
POST /api/evaluate
```

Example body:

```json
{
  "agent": "Customer Support Agent",
  "model": "Demo Model",
  "businessImpact": "HIGH",
  "prompt": "When is Orion launching?",
  "response": "Orion is definitely launching tomorrow.",
  "context": "The Orion launch date is still under review.",
  "inputTokens": 700,
  "outputTokens": 180,
  "modelCalls": 1,
  "toolCalls": 1,
  "retries": 0,
  "latencyMs": 850
}
```

### Metrics

```http
GET /api/metrics
```

### Audit history

```http
GET /api/evaluations
```

### Escalation queue

```http
GET /api/escalations
PATCH /api/escalations/:id
```

### Policies

```http
GET /api/policy
PATCH /api/policy
```

### Knowledge base

```http
GET /api/knowledge
```

### Built-in scenarios

```http
GET /api/demo-scenarios
```

### Reset demo

```http
POST /api/reset-demo
```

## 16. Demo Scenarios

### Scenario 1 — Safe enterprise answer

Expected: `ALLOW`

The response matches trusted context and has low execution risk.

### Scenario 2 — Confident contradiction

Expected: `ESCALATE` / `REPAIR` depending on policy.

The response claims a launch is definite while trusted evidence says it is still under review.

### Scenario 3 — PII exposure

Expected: `BLOCK`

The response exposes an email and phone number.

### Scenario 4 — Inefficient agent execution

Expected: high Cost Risk.

The scenario uses 7 model calls, 12 tool calls, 4 retries and high latency.

## 17. Dashboard Field Guide

### Overall Risk
Combined risk score after weighting the three engines and business context.

### Performance
How risky the answer is from a correctness/evidence perspective.

### Cost
How economically inefficient the execution is.

### Responsibility
How risky the response is for privacy, safety and policy.

### Fast Path / Deep Verification
`FAST_PATH` means the first screen did not require deep risk signals. `DEEP_VERIFICATION` means suspicious signals triggered deeper analysis.

### Business Impact
Context supplied by the caller. High-impact decisions receive stricter treatment.

### Model Calls / Tool Calls / Retries
Execution telemetry used by the Cost Engine.

### Latency
End-to-end AI execution latency supplied by the caller.

### Evidence
Enterprise knowledge retrieved to support or challenge the AI response.

### Primary Risk
The risk dimension contributing most strongly to the decision.

### Recommended Intervention
The action ControlPlane believes should occur next.

## 18. Human Escalation Queue

When a case receives `ESCALATE`, ControlPlane creates an item in the Human Review Queue.

A reviewer can mark it `REVIEWED` or reopen it.

This is the prototype implementation of human-in-the-loop governance.

## 19. Auditability

Every evaluation receives an ID such as:

```text
CP-A1B2C3D4
```

The record contains:

- timestamp;
- decision;
- overall risk;
- primary risk;
- individual engine results;
- reasons;
- evidence;
- telemetry;
- execution mode;
- AI evaluation mode.

The prototype persists this in `data/controlplane.json`. That file is intentionally ignored by Git.

## 20. How to Present It

Start with the problem, not the technology:

> “Enterprise AI is scaling faster than enterprises can control it. The risk is not simply that an AI model can be wrong; it can be confidently wrong, unsafe or economically inefficient. Traditional monitoring can discover the problem after a user has already acted.”

Then introduce the product:

> “ControlPlane is an AI Firewall that makes the trust decision before the business action.”

Then explain the three engines:

```text
Performance -> Can we trust the answer?
Cost        -> Was it generated efficiently?
Responsibility -> Is it safe and compliant?
```

Then show the four actions:

```text
ALLOW | REPAIR | ESCALATE | BLOCK
```

## 21. Easy Demo Manual

See the full script in [docs/DEMO_MANUAL.md](docs/DEMO_MANUAL.md) or the one-page cheat sheet in [docs/SETUP_AND_DEMO.md](docs/SETUP_AND_DEMO.md).

Recommended order:

1. Safe → `ALLOW`
2. Hallucination/contradiction → `ESCALATE`
3. PII → `BLOCK`
4. Cost explosion → high Cost Risk
5. Human review queue
6. Audit trail
7. Live policy threshold change

This order tells a coherent story from “normal answer” to “business risk” to “control action.”

## 22. Architecture Walkthrough

See [docs/ARCHITECTURE_WALKTHROUGH.md](docs/ARCHITECTURE_WALKTHROUGH.md) for the request lifecycle from API input to audit record.

## 23. Limitations and Production Roadmap

This is a **hackathon prototype**, not a production certification.

For production, add:

- stronger LLM/NLI evaluation models;
- real RAG and enterprise source connectors;
- enterprise identity and authorization;
- DLP and dedicated PII classifiers;
- tenant isolation;
- durable database and event streaming;
- real-time API gateway/agent interception;
- policy versioning and approvals;
- security hardening;
- monitoring, alerts and SLAs;
- reviewer feedback loops;
- provider adapters for multiple model vendors.

Do not claim perfect hallucination detection, perfect bias detection or production-grade security from the prototype.

## 24. GitHub Submission Checklist

Before submitting:

- [ ] Repository is public.
- [ ] README opens correctly and links work.
- [ ] No secrets are committed.
- [ ] `npm test` passes.
- [ ] `npm run check` passes.
- [ ] `npm start` launches locally.
- [ ] All four demo scenarios work.
- [ ] Demo video shows the decision before the user action.
- [ ] README contains architecture, setup, usage and limitations.
- [ ] Business proposal explains problem, users, economics, roadmap and risks.
