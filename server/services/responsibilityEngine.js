const pii = [
  /\b[A-Z][a-z]+\s[A-Z][a-z]+\b.*\b(email|phone)\b/i,
  /\b\d{10}\b/,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(ssn|aadhaar|passport|credit card)\b/i
];
const unsafe = [
  /\b(bypass|disable security|steal|credential|password|api key|secret)\b/i,
  /\b(harm|attack|exploit)\b/i
];

function responsibilityEngine(input, policy) {
  const text = `${input.prompt || ''}\n${input.response || ''}`;
  let score = 0, signals = [];
  if (pii.some(r => r.test(text))) { score += 55; signals.push('Potential PII or sensitive personal data exposure'); }
  if (unsafe.some(r => r.test(text))) { score += 45; signals.push('Potential unsafe or security-sensitive content'); }
  if (/\b(fire them|reject her|reject him|not suitable because)\b/i.test(text)) { score += 25; signals.push('Potentially biased decision language'); }
  if (/\b(ignore policy|violate policy|bypass policy)\b/i.test(text)) { score += 35; signals.push('Explicit policy-violation instruction'); }
  const piiDetected = signals.some(s => s.includes('PII'));
  return {
    score: Math.min(100, score),
    signals,
    piiDetected,
    policyViolation: signals.some(s => s.includes('policy')),
    unsafeDetected: signals.some(s => s.includes('unsafe')),
    action: piiDetected ? policy.piiMode : 'NONE'
  };
}
module.exports = { responsibilityEngine };
