# Architecture Walkthrough

## Request lifecycle

1. `POST /api/evaluate` receives an AI response and optional execution telemetry.
2. `evaluationController.js` coordinates the evaluation.
3. `fastScreen.js` performs inexpensive first-pass checks.
4. `performanceEngine.js` checks confidence, contradiction and enterprise evidence.
5. `knowledgeBase.js` retrieves relevant policy documents from `data/knowledge/`.
6. `costEngine.js` scores execution economics.
7. `responsibilityEngine.js` scores privacy, safety and policy risks.
8. `decisionEngine.js` converts the signals into a control action.
9. `repairEngine.js` transforms the response when `REPAIR` applies.
10. `aiGateway.js` can add an LLM-based semantic evaluation when configured.
11. `store.js` writes the evaluation and escalation state for the demo.
12. The View (`public/`) refreshes KPIs, results, evidence, queue and audit history.

## Why the separation matters

If the dashboard changes, the engines do not need to change.

If the Performance Engine changes, the View does not need to know its implementation.

If a real database replaces the demo store, the controller/API contract can remain the same.

This keeps the prototype understandable and makes it easier to evolve toward a gateway or middleware product.
