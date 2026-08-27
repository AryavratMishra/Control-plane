const patterns = [
  [/\b(email|e-mail|phone|mobile|address|ssn|aadhaar|passport|customer id)\b/i, 'Sensitive-data signal'],
  [/\b(definitely|guaranteed|100%|certainly|always|never)\b/i, 'Overconfidence signal'],
  [/\b(retry|again|call the tool|tool call|several tools|multiple agents)\b/i, 'Execution-efficiency signal'],
  [/\b(password|secret|api key|token|credential)\b/i, 'Credential signal'],
  [/\b(bypass|ignore policy|disable security|weaken security)\b/i, 'Policy-risk signal']
];

function fastScreen(response = '') {
  const signals = [];
  for (const [re, reason] of patterns) if (re.test(response)) signals.push(reason);
  const score = Math.min(100, signals.length * 22);
  return {
    score,
    signals,
    deepAnalysis: score >= 22,
    rationale: score >= 22 ? 'Suspicious signals justify deeper verification.' : 'No immediate high-risk signal; continue on fast path.'
  };
}
module.exports = { fastScreen };
