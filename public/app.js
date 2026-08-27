const $ = id => document.getElementById(id);
let scenarios = [];
function setVal(id,v){$(id).value=v ?? ''}
function renderDecision(x){
  $('decisionBadge').textContent=x.decision; $('decisionBadge').className=`badge ${x.decision.toLowerCase()}`;
  $('overall').textContent=x.overallScore; $('riskLevel').textContent=x.riskLevel; $('primaryRisk').textContent=`Primary risk: ${x.primaryRisk}`; $('modeLabel').textContent=`${x.mode} • ${x.aiMode || 'LOCAL'}`;
  const enginePairs=[['perf',x.performance],['cost',x.cost],['resp',x.responsibility]];
  for(const [prefix,e] of enginePairs){$(prefix+'Score').textContent=e.score;$(prefix+'Bar').style.width=e.score+'%';$(prefix+'Reason').textContent=(e.signals||[]).slice(0,2).join(' • ')||'No elevated signals';}
  $('reasons').innerHTML=(x.reasons.length?x.reasons:['No elevated risk signals']).map(s=>`<li>${escapeHtml(s)}</li>`).join(''); $('recommended').textContent=x.recommendedRepair + (x.repair?.repairedResponse ? `

Repaired response: ${x.repair.repairedResponse}` : '');
  $('evidence').innerHTML=(x.performance.evidence||[]).map(e=>`<div class="evidence-card"><strong>${escapeHtml(e.title)} <span class="muted">${e.score}% match</span></strong><p>${escapeHtml(e.excerpt)}</p></div>`).join('') || '<p class="muted">No relevant enterprise evidence retrieved.</p>';
}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
async function api(url,opts){const r=await fetch(url,opts);const d=await r.json();if(!r.ok)throw new Error(d.error||'Request failed');return d}
function scenarioIntoForm(s){setVal('prompt',s.prompt);setVal('response',s.response);setVal('context',s.context);setVal('impact',s.businessImpact);for(const [k,v] of Object.entries(s.telemetry))setVal(k,v)}
async function loadScenarios(){scenarios=await api('/api/demo-scenarios');$('scenario').innerHTML=scenarios.map((s,i)=>`<option value="${s.id}">${i+1}. ${s.name}</option>`).join('');scenarioIntoForm(scenarios[0])}
async function evaluate(){const body={agent:$('agent').value,model:$('model').value,businessImpact:$('impact').value,prompt:$('prompt').value,response:$('response').value,context:$('context').value,inputTokens:$('inputTokens').value,outputTokens:$('outputTokens').value,modelCalls:$('modelCalls').value,toolCalls:$('toolCalls').value,retries:$('retries').value,latencyMs:$('latencyMs').value};$('evaluate').disabled=true;$('evaluate').textContent='Evaluating…';try{const x=await api('/api/evaluate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});renderDecision(x);await refreshAll()}catch(e){alert(e.message)}finally{$('evaluate').disabled=false;$('evaluate').textContent='Evaluate in ControlPlane'}}
async function refreshMetrics(){const m=await api('/api/metrics');$('kpiTotal').textContent=m.totalEvaluations;$('kpiAvg').textContent=m.averageRisk;$('kpiBlocked').textContent=m.blocked;$('kpiOpen').textContent=m.openEscalations;$('queueCount').textContent=`${m.openEscalations} open`}
async function refreshAudit(){const list=await api('/api/evaluations');$('audit').innerHTML=list.slice(0,12).map(x=>`<tr><td>${x.id}</td><td>${new Date(x.createdAt).toLocaleString()}</td><td>${x.overallScore}</td><td>${x.primaryRisk}</td><td><span class="badge ${x.decision.toLowerCase()}">${x.decision}</span></td><td>${x.mode}</td></tr>`).join('')||'<tr><td colspan="6" class="muted">No evaluations yet.</td></tr>'}
async function refreshQueue(){const q=await api('/api/escalations');$('queue').innerHTML=q.map(x=>`<div class="queue-item"><div><strong>${x.id}</strong><div class="muted">Risk ${x.risk} • ${x.primaryRisk} • ${new Date(x.createdAt).toLocaleString()}</div></div><span class="tag">${x.status}</span><button onclick="closeCase('${x.id}')">${x.status==='OPEN'?'Mark reviewed':'Reopen'}</button></div>`).join('')||'<div class="muted">No escalated cases yet.</div>'}
async function closeCase(id){const q=await api('/api/escalations');const item=q.find(x=>x.id===id);await api('/api/escalations/'+encodeURIComponent(id),{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:item.status==='OPEN'?'REVIEWED':'OPEN'})});await refreshAll()}
async function refreshPolicy(){const p=await api('/api/policy');for(const id of ['repairThreshold','escalateThreshold','blockThreshold','maxModelCalls','maxToolCalls','maxRetries'])setVal(id,p[id])}
async function savePolicy(){const body={};for(const id of ['repairThreshold','escalateThreshold','blockThreshold','maxModelCalls','maxToolCalls','maxRetries'])body[id]=Number($(id).value);await api('/api/policy',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});alert('Policy saved');await refreshAll()}
async function refreshAll(){await Promise.all([refreshMetrics(),refreshAudit(),refreshQueue(),refreshPolicy()])}
$('scenario').addEventListener('change',e=>scenarioIntoForm(scenarios.find(s=>s.id===e.target.value)));
$('evaluate').onclick=evaluate;$('loadDemo').onclick=()=>scenarioIntoForm(scenarios[1]||scenarios[0]);$('resetDemo').onclick=async()=>{await api('/api/reset-demo',{method:'POST'});location.reload()};$('refresh').onclick=refreshAll;$('savePolicy').onclick=savePolicy;window.closeCase=closeCase;
loadScenarios().then(refreshAll);
