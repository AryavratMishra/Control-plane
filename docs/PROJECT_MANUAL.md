# ControlPlane Easy Project Manual

## 1. What problem are we solving?
Enterprise AI can be wrong, unsafe, privacy-sensitive or unnecessarily expensive. Monitoring that discovers the problem after a user has acted is too late.

## 2. What did we build?
An AI Firewall placed before the business action:

```text
AI Response
  -> Fast Risk Screen
  -> Performance + Cost + Responsibility
  -> Decision Engine
  -> ALLOW / REPAIR / ESCALATE / BLOCK
```

## 3. What does each engine mean?

### Performance
“Can we trust what the model said?”
- contradiction with trusted context
- evidence overlap
- confidence signals
- enterprise knowledge-base evidence

### Cost
“Was the AI execution efficient?”
- tokens
- model calls
- tool calls
- retries
- latency
- estimated cost

### Responsibility
“Is the response safe and compliant?”
- PII
- credentials/secrets
- unsafe instructions
- policy violations
- basic bias signals

## 4. Why Fast Risk Screen?
We do not want ControlPlane itself to become another expensive AI workload. A cheap first-pass check decides whether deeper verification is justified.

## 5. Why four decisions?
Binary block/allow is too rigid for enterprise operations.

- `ALLOW`: release.
- `REPAIR`: automatically correct known issues.
- `ESCALATE`: require human judgment.
- `BLOCK`: prevent release.

## 6. What is MVC here?
- Model: `server/models` and domain state.
- View: `public` UI.
- Controller: `server/controllers`.
- Services: risk engines and business logic.
- Routes: HTTP API layer.

## 7. What is the built-in knowledge base?
The files under `data/knowledge/` are small trusted enterprise policy examples. They make the evidence path visible during the demo. In production, replace them with a database, document store or enterprise RAG system.

## 8. Where is the AI?
The architecture supports an OpenAI-compatible evaluator through `AI_PROVIDER_URL`, `AI_PROVIDER_KEY` and `AI_MODEL`. Without credentials, the deterministic engines still perform the control flow. This is intentional for offline reliability.

## 9. What should I say if asked “Is this production ready?”
Answer:
> “No. This is a working hackathon prototype that proves the control-plane architecture. Productionization would add enterprise identity, stronger classifiers/evaluators, durable storage, tenant isolation, real-time gateway integration, security controls and observability.”

## 10. Main files to understand
- `server.js` — starts the app.
- `server/routes/router.js` — API endpoints.
- `server/controllers/evaluationController.js` — coordinates evaluation.
- `server/services/fastScreen.js` — first-pass screening.
- `server/services/performanceEngine.js` — evidence/hallucination signals.
- `server/services/costEngine.js` — execution economics.
- `server/services/responsibilityEngine.js` — privacy/safety/policy signals.
- `server/services/decisionEngine.js` — final action.
- `server/services/knowledgeBase.js` — enterprise evidence retrieval.
- `server/services/aiGateway.js` — optional LLM evaluator.
- `public/index.html` — dashboard.
- `public/app.js` — UI/API behavior.
- `data/knowledge/` — demo enterprise policies.
