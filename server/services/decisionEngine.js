function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }

function repair(r, p, c) {
  const actions = [];
  if (r.piiDetected) actions.push('redact sensitive personal data');
  if (p.score >= 45) actions.push('remove unsupported claims and reduce certainty');
  if (c.score >= 45) actions.push('reduce retries, tool calls and unnecessary model calls');
  return actions.length ? `Automatically ${actions.join(', ')} before release.` : 'No automatic repair rule is available; route for review.';
}

function decide(input, fast, p, c, r, policy) {
  const weights = { performance: 0.45, cost: 0.20, responsibility: 0.35 };
  let overall = p.score * weights.performance + c.score * weights.cost + r.score * weights.responsibility;
  if (input.businessImpact === 'HIGH') overall += 10;
  if (policy.requireEvidenceForHighImpact && input.businessImpact === 'HIGH' && (!input.context || p.signals.some(s => s.includes('evidence') || s.includes('context')))) overall += 12;
  overall = clamp(overall);

  let decision = 'ALLOW';
  if (r.piiDetected && policy.piiMode === 'BLOCK') decision = 'BLOCK';
  else if (r.unsafeDetected && r.score >= policy.unsafeBlockThreshold) decision = 'BLOCK';
  else if (overall >= policy.blockThreshold || r.score >= 90) decision = 'BLOCK';
  else if (overall >= policy.escalateThreshold || (input.businessImpact === 'HIGH' && p.score >= 60)) decision = 'ESCALATE';
  else if (overall >= policy.repairThreshold || p.score >= 45 || c.score >= 45 || r.score >= 35) decision = 'REPAIR';

  const reasons = [...fast.signals, ...p.signals, ...c.signals, ...r.signals];
  const primary = p.score >= c.score && p.score >= r.score ? 'PERFORMANCE' : c.score >= r.score ? 'COST' : 'RESPONSIBILITY';
  const recommendedRepair = decision === 'REPAIR' ? repair(r, p, c)
    : decision === 'BLOCK' ? 'Prevent release and record the policy event.'
    : decision === 'ESCALATE' ? 'Route to a human reviewer with evidence and risk signals attached.'
    : 'No intervention required. Release the response.';

  return {
    decision,
    overallScore: overall,
    riskLevel: overall >= 80 ? 'CRITICAL' : overall >= 60 ? 'HIGH' : overall >= 35 ? 'MEDIUM' : 'LOW',
    confidence: clamp(95 - Math.abs(50 - overall)),
    primaryRisk: primary,
    reasons,
    recommendedRepair
  };
}
module.exports = { decide };
