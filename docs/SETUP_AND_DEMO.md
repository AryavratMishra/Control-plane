# ControlPlane — Setup & Live Demo Cheat Sheet

## 1. Start

```bash
npm install
npm test
npm start
```

Open `http://localhost:3000`.

## 2. The one diagram to remember

```text
AI Response
    ↓
Fast Risk Screen
    ↓
Performance + Cost + Responsibility
    ↓
Decision Engine
    ↓
ALLOW | REPAIR | ESCALATE | BLOCK
```

## 3. The 4-click demo

### Click 1 — Safe
Choose `Safe enterprise answer` → Evaluate → `ALLOW`.

### Click 2 — Hallucination
Choose `Confident contradiction` → Evaluate → show enterprise evidence → `ESCALATE`.

### Click 3 — PII
Choose `PII exposure` → Evaluate → show PII signal → `BLOCK`.

### Click 4 — Cost
Choose `Inefficient agent execution` → Evaluate → show 7 model calls, 12 tool calls, 4 retries and 11.4s latency → Cost Risk.

## 4. Show the differentiator

Open Policy Controls and change the escalation threshold. Save and rerun a case.

Say:

> “The control policy is configurable; the enterprise can change intervention thresholds without rewriting the risk engines.”

## 5. Show human-in-the-loop

Open Human Review Queue. Mark an escalated case as reviewed.

Say:

> “ControlPlane does not pretend that every decision can be automated. Ambiguous or high-impact cases are routed to a human with evidence attached.”

## 6. Show auditability

Open Audit Trail.

Say:

> “Every evaluation has a unique ID, risk scores, reasons, evidence, telemetry and a final decision.”

## 7. If the judge asks “Where is the AI?”

Answer:

> “The core safety controls remain explainable and work offline. The architecture also supports an OpenAI-compatible LLM evaluator that adds semantic reasoning on top of the deterministic controls. The LLM is a second layer, not a single point of failure.”

## 8. If the judge asks “Is it production ready?”

Answer:

> “This is a working hackathon prototype. Production would add stronger evaluators, enterprise RAG, DLP, identity, tenant isolation, durable event storage, gateway integration and production observability.”
