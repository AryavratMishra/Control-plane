const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..', 'data', 'knowledge');

function tokenize(text) {
  return new Set((String(text || '').toLowerCase().match(/[a-z0-9]+/g) || []).filter(t => t.length > 3));
}

function loadKnowledgeBase() {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root).filter(f => f.endsWith('.txt')).map(file => ({
    id: file.replace(/\.txt$/, ''),
    title: file.replace(/\.txt$/, '').replace(/[-_]/g, ' '),
    text: fs.readFileSync(path.join(root, file), 'utf8').trim()
  }));
}

function retrieveEvidence(query, topK = 3) {
  const q = tokenize(query);
  return loadKnowledgeBase().map(doc => {
    const d = tokenize(doc.text);
    let overlap = 0;
    q.forEach(t => { if (d.has(t)) overlap += 1; });
    return { ...doc, score: q.size ? overlap / q.size : 0 };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, topK);
}

module.exports = { loadKnowledgeBase, retrieveEvidence };
