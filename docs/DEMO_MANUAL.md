# ControlPlane Demo Manual

## Goal
Demonstrate that ControlPlane can stop, repair or escalate risky AI responses **before** the user acts on them.

## 90-second script

### 1. Open the dashboard
Run `npm start`, open `http://localhost:3000`.

Say:
> “ControlPlane is an AI Firewall. It sits between an enterprise AI system and the user.”

### 2. Safe case — ALLOW
Choose `1. Safe enterprise answer` and click **Evaluate in ControlPlane**.

Point to:
- Overall risk is low.
- Performance, Cost and Responsibility are low.
- Decision is `ALLOW`.

Say:
> “Low-risk answers take the fast path and are released.”

### 3. Hallucination/contradiction — ESCALATE
Choose `2. Confident contradiction` and evaluate.

Point to:
- High Performance score.
- Retrieved enterprise evidence.
- Contradiction reason.
- `ESCALATE` decision.

Say:
> “The model sounds confident, but trusted enterprise information says the launch date is still under review. ControlPlane refuses to let confidence substitute for evidence.”

### 4. Responsibility — BLOCK
Choose `3. PII exposure` and evaluate.

Point to:
- PII detected.
- Responsibility risk.
- `BLOCK` decision.

Say:
> “The answer contains personal information. ControlPlane blocks the response before release.”

### 5. Cost — HIGH RISK
Choose `4. Inefficient agent execution` and evaluate.

Point to:
- 7 model calls.
- 12 tool calls.
- 4 retries.
- high latency.
- Cost score.

Say:
> “This answer may be correct, but the execution is economically inefficient. ControlPlane treats waste as an enterprise risk too.”

### 6. Human review and audit
Scroll to the Human Review Queue and Audit Trail.

Say:
> “Every escalated case becomes an auditable human-review item, and every decision has a traceable record.”

Mark one case as reviewed.

### 7. Live policy change
Change `Escalate threshold`, save, rerun a scenario.

Say:
> “Risk policy is configurable per enterprise. We can change intervention thresholds without rewriting the engines.”

### 8. Optional AI-enhanced mode
When an OpenAI-compatible evaluator is configured in `.env`, run the same case again.

Point to `LLM_ASSISTED` in the evaluation mode. Explain that the LLM is an additional reasoning layer; deterministic controls remain available as a fallback.

## What to say about REPAIR
Use a response containing PII or strong unsupported certainty if you want to demonstrate the repair path. When the decision is `REPAIR`, the dashboard shows the transformed response and the changes applied, such as:

```text
Original:
Priya's email is priya@example.com

Repaired:
Priya's email is [REDACTED_EMAIL]
```

## Backup demo
If internet/LLM access is unavailable, continue using the built-in engines. The project is designed to remain fully demoable offline.

## What not to claim
Do not call the prototype production-certified. Do not claim perfect hallucination detection, perfect bias detection or complete security coverage. Say “prototype signals” and explain that production deployment would use stronger evaluators, DLP, identity, policy and observability integrations.
