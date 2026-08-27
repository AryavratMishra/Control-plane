const { retrieveEvidence } = require('./knowledgeBase');

function norm(s) { return String(s || '').toLowerCase(); }
function tokenSet(s) { return new Set(norm(s).match(/[a-z0-9]+/g) || []); }
function overlapScore(a, b) {
  const aa = tokenSet(a); const bb = tokenSet(b);
  let common = 0; aa.forEach(t => { if (t.length > 4 && bb.has(t)) common++; });
  return aa.size ? common / aa.size : 0;
}

function performanceEngine(input) {
  const response = input.response || '';
  const context = input.context || '';
  let score = 5;
  const signals = [];
  let evidence = [];

  if (/\b(definitely|guaranteed|certainly|100%|always|never)\b/i.test(response)) {
    score += 25;
    signals.push('High-confidence language');
  }

  if (context) {
    const pairs = [
      ['tomorrow', 'under review'],
      ['approved', 'under review'],
      ['guaranteed', 'not final'],
      ['confirmed', 'not confirmed']
    ];
    for (const [a, b] of pairs) {
      if (norm(response).includes(a) && norm(context).includes(b)) {
        score += 40;
        signals.push(`Potential contradiction: "${a}" vs "${b}"`);
        break;
      }
    }
    const overlap = overlapScore(response, context);
    if (overlap < 0.12) {
      score += 18;
      signals.push('Low evidence overlap with supplied trusted context');
    }
  } else {
    score += 20;
    signals.push('No trusted enterprise context supplied');
  }

  const retrieved = retrieveEvidence(`${input.prompt || ''}\n${response}`, 3);
  evidence = retrieved.map(x => ({ id: x.id, title: x.title, score: Math.round(x.score * 100), excerpt: x.text.slice(0, 220) }));
  if (evidence.length) {
    const best = evidence[0];
    if (best.score >= 35) {
      signals.push(`Knowledge base evidence matched: ${best.title}`);
      if (/\b(definitely|guaranteed|certainly)\b/i.test(response) && /not final|under review|must not/i.test(best.excerpt)) {
        score += 25;
        signals.push('Generated claim conflicts with retrieved enterprise policy');
      }
    } else {
      signals.push('Weak knowledge-base evidence match');
      score += 8;
    }
  } else {
    signals.push('No relevant enterprise knowledge-base evidence retrieved');
    score += 10;
  }

  return {
    score: Math.min(100, score),
    signals,
    confidence: Math.max(40, 100 - Math.round(score * 0.35)),
    evidence
  };
}

module.exports = { performanceEngine };
