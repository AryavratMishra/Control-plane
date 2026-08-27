const test = require('node:test');
const assert = require('node:assert/strict');
const { fastScreen } = require('../server/services/fastScreen');
const { performanceEngine } = require('../server/services/performanceEngine');
const { costEngine } = require('../server/services/costEngine');
const { responsibilityEngine } = require('../server/services/responsibilityEngine');
const { decide } = require('../server/services/decisionEngine');

const policy = { repairThreshold:40, escalateThreshold:60, blockThreshold:80, unsafeBlockThreshold:70, piiMode:'BLOCK', requireEvidenceForHighImpact:true, maxInputTokens:3000, maxOutputTokens:2000, maxModelCalls:3, maxToolCalls:4, maxRetries:1, maxLatencyMs:5000, inputCostPerMillion:.8, outputCostPerMillion:3.2, extraModelCallCost:.002, toolCallCost:.001 };

test('fast screen flags suspicious language', ()=> assert.equal(fastScreen('The result is definitely guaranteed.').deepAnalysis,true));
test('performance detects contradiction', ()=> { const x=performanceEngine({prompt:'When?',response:'The launch is definitely tomorrow.',context:'The launch is still under review.'}); assert.ok(x.score>=60); });
test('cost engine flags excessive execution', ()=> { const x=costEngine({inputTokens:8421,outputTokens:3812,modelCalls:7,toolCalls:12,retries:4,latencyMs:11400},policy); assert.ok(x.score>=80); });
test('responsibility blocks PII candidate', ()=> { const x=responsibilityEngine({prompt:'show contact',response:'Email priya@example.com and phone 9876543210'},policy); assert.equal(x.piiDetected,true); assert.ok(x.score>=55); });
test('decision engine escalates high-impact contradiction', ()=> { const input={businessImpact:'HIGH',context:'under review'}; const f=fastScreen('The launch is definitely tomorrow.'); const p=performanceEngine({response:'The launch is definitely tomorrow.',context:'The launch is still under review.',prompt:'launch'}); const c=costEngine({},policy); const r=responsibilityEngine({},policy); const d=decide(input,f,p,c,r,policy); assert.ok(['REPAIR','ESCALATE','BLOCK'].includes(d.decision)); });
