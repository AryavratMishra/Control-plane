const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'data', 'controlplane.json');
const defaults = {
  policy: {
    repairThreshold: 40,
    escalateThreshold: 60,
    blockThreshold: 80,
    unsafeBlockThreshold: 70,
    piiMode: 'BLOCK',
    requireEvidenceForHighImpact: true,
    maxInputTokens: 3000,
    maxOutputTokens: 2000,
    maxModelCalls: 3,
    maxToolCalls: 4,
    maxRetries: 1,
    maxLatencyMs: 5000,
    inputCostPerMillion: 0.8,
    outputCostPerMillion: 3.2,
    extraModelCallCost: 0.002,
    toolCallCost: 0.001
  },
  evaluations: [],
  escalations: []
};
function load() {
  try { return JSON.parse(fs.readFileSync(dbPath, 'utf8')); } catch { return JSON.parse(JSON.stringify(defaults)); }
}
let state = load();
function persist() {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(state, null, 2));
}
function addEvaluation(result) {
  state.evaluations.unshift(result);
  state.evaluations = state.evaluations.slice(0, 100);
  if (result.decision === 'ESCALATE') {
    state.escalations.unshift({ id: result.id, createdAt: result.createdAt, status: 'OPEN', decision: result.decision, risk: result.overallScore, primaryRisk: result.primaryRisk });
    state.escalations = state.escalations.slice(0, 50);
  }
  persist();
  return result;
}
function patchEscalation(id, status) {
  const item = state.escalations.find(x => x.id === id);
  if (!item) return null;
  item.status = status;
  item.updatedAt = new Date().toISOString();
  persist();
  return item;
}
function resetDemo() { state = JSON.parse(JSON.stringify(defaults)); persist(); return state; }
module.exports = { state, addEvaluation, patchEscalation, resetDemo, persist };
