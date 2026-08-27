function repairResponse(response, responsibility) {
  let repaired = String(response || '');
  const changes = [];
  if (responsibility?.piiDetected) {
    repaired = repaired
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED_EMAIL]')
      .replace(/\b\d{10}\b/g, '[REDACTED_PHONE]');
    changes.push('redacted detected personal information');
  }
  if (/\b(definitely|guaranteed|certainly)\b/i.test(repaired)) {
    repaired = repaired.replace(/\bdefinitely\b/gi, 'apparently').replace(/\bguaranteed\b/gi, 'reported').replace(/\bcertainly\b/gi, 'apparently');
    changes.push('reduced unsupported certainty');
  }
  return { repairedResponse: repaired, changes };
}
module.exports = { repairResponse };
