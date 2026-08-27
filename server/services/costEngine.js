function costEngine(input, policy) {
  const i = Number(input.inputTokens || 0);
  const o = Number(input.outputTokens || 0);
  const m = Math.max(1, Number(input.modelCalls || 1));
  const t = Math.max(0, Number(input.toolCalls || 0));
  const r = Math.max(0, Number(input.retries || 0));
  const l = Math.max(0, Number(input.latencyMs || 0));
  let score = 0, signals = [];

  if (i > policy.maxInputTokens) { score += 20; signals.push(`Input tokens ${i} exceed ${policy.maxInputTokens}`); }
  if (o > policy.maxOutputTokens) { score += 20; signals.push(`Output tokens ${o} exceed ${policy.maxOutputTokens}`); }
  if (m > policy.maxModelCalls) { score += 20; signals.push(`Model calls ${m} exceed ${policy.maxModelCalls}`); }
  if (t > policy.maxToolCalls) { score += 15; signals.push(`Tool calls ${t} exceed ${policy.maxToolCalls}`); }
  if (r > policy.maxRetries) { score += 20; signals.push(`Retries ${r} exceed ${policy.maxRetries}`); }
  if (l > policy.maxLatencyMs) { score += 15; signals.push(`Latency ${l}ms exceeds ${policy.maxLatencyMs}ms`); }
  if (m >= 3 && r >= 2) { score += 15; signals.push('Repeated execution suggests an inefficient agent loop'); }

  const estimatedCost = ((i / 1e6) * policy.inputCostPerMillion + (o / 1e6) * policy.outputCostPerMillion) + (m - 1) * policy.extraModelCallCost + t * policy.toolCallCost;
  return {
    score: Math.min(100, score),
    signals,
    estimatedCost: Math.round(estimatedCost * 10000) / 10000,
    telemetry: { inputTokens: i, outputTokens: o, modelCalls: m, toolCalls: t, retries: r, latencyMs: l }
  };
}
module.exports = { costEngine };
