# Repository guide

- `server.js`: HTTP entry point and static file server.
- `server/routes/router.js`: API routing.
- `server/controllers/evaluationController.js`: orchestrates one evaluation.
- `server/models/store.js`: in-memory policy, evaluation and audit state.
- `server/services/fastScreen.js`: cheap first-pass screen.
- `server/services/performanceEngine.js`: hallucination/evidence/contradiction signals.
- `server/services/costEngine.js`: tokens, model calls, tools, retries and latency.
- `server/services/responsibilityEngine.js`: PII, unsafe and policy signals.
- `server/services/decisionEngine.js`: weighted risk + business impact → ALLOW/REPAIR/ESCALATE/BLOCK.
- `server/services/aiEnhancer.js`: optional LLM explanation adapter; local mode works without an API key.
- `public/index.html`: View shell.
- `public/app.js`: browser controller/view logic.
- `public/styles.css`: dashboard UI.
- `tests/controlplane.test.js`: engine tests.
