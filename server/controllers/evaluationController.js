const crypto = require('crypto');
const { state, addEvaluation } = require('../models/store');
const { fastScreen } = require('../services/fastScreen');
const { performanceEngine } = require('../services/performanceEngine');
const { costEngine } = require('../services/costEngine');
const { responsibilityEngine } = require('../services/responsibilityEngine');
const { decide } = require('../services/decisionEngine');
const { evaluateWithAI } = require('../services/aiGateway');
const { repairResponse } = require('../services/repairEngine');

async function evaluate(input) {
  if (!input || typeof input.response !== 'string' || !input.response.trim()) throw new Error('response is required');
  const started = Date.now();
  const fast = fastScreen(input.response);
  const performance = performanceEngine(input);
  const cost = costEngine(input, state.policy);
  const responsibility = responsibilityEngine(input, state.policy);
  const decision = decide(input, fast, performance, cost, responsibility, state.policy);

  let result = {
    id: `CP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    createdAt: new Date().toISOString(),
    ...decision,
    fastScreen: fast,
    performance,
    cost,
    responsibility,
    businessImpact: input.businessImpact || 'MEDIUM',
    mode: fast.deepAnalysis ? 'DEEP_VERIFICATION' : 'FAST_PATH',
    requestMeta: { agent: input.agent || 'Demo Agent', model: input.model || 'Demo Model', tenant: input.tenant || 'Demo Tenant' },
    processingLatencyMs: Date.now() - started
  };

  result = await evaluateWithAI(input, result);
  if (result.aiEvaluation) {
    const ai = result.aiEvaluation;
    if (Number.isFinite(Number(ai.factual_risk))) result.performance.score = Math.max(result.performance.score, Math.min(100, Number(ai.factual_risk)));
    if (Number.isFinite(Number(ai.responsibility_risk))) result.responsibility.score = Math.max(result.responsibility.score, Math.min(100, Number(ai.responsibility_risk)));
    const refined = decide(input, fast, result.performance, cost, result.responsibility, state.policy);
    result = { ...result, ...refined, aiConfidence: ai.confidence, aiRationale: ai.rationale, aiSuggestedRepair: ai.repair };
  }
  if (result.decision === 'REPAIR') {
    const repair = repairResponse(input.response, result.responsibility);
    result.repair = repair;
  }
  return addEvaluation(result);
}

module.exports = { evaluate };
