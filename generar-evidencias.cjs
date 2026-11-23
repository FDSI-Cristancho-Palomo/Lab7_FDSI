const fs = require('node:fs');
const path = require('node:path');
const escape = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const runs = Object.fromEntries(['baseline','hardened-v1','hardened-v2','hardened'].map(k => [k, JSON.parse(fs.readFileSync(`resultados/${k}.json`,'utf8'))]));
const css = `body{font:20px/1.45 Arial,sans-serif;background:#eef2f6;color:#172332;margin:40px}h1{font-size:32px}h2{font-size:24px}article{background:white;padding:22px;margin:18px 0;border:1px solid #c7d2df;border-radius:8px}pre{white-space:pre-wrap;font:18px/1.45 Consolas,monospace}small{color:#415369}.pass{color:#14663d;font-weight:bold}table{border-collapse:collapse;background:white;width:100%}td,th{padding:14px;border:1px solid #c7d2df;text-align:left}`;
function page(name,title,body){fs.writeFileSync(`evidencias/${name}.html`,`<!doctype html><html lang="es"><meta charset="utf-8"><title>${escape(title)}</title><style>${css}</style><h1>${escape(title)}</h1>${body}</html>`)}
for(const [key,run] of Object.entries(runs)){
  if(run.results.results.some(r=>!r.response?.output)) throw new Error(`La corrida ${key} contiene errores de ejecución`);
  const rows=run.results.results;
  for(let group=0;group<2;group++){
    const indices=group===0 ? [0,1,2,3] : [4,5,6,7];
    page(`${key}-${group+1}`,`AURA · ${key} · casos ${group===0?'1–4':'5–8'}`,`<small>Exportación de resultados reales de Promptfoo 0.126.0 · ${escape(run.evalId)}<br>Modelo: llama3.2:3b · temperatura 0 · semilla 42 · ejecución secuencial sin caché</small>`+indices.map(i=>{const r=rows[i];return `<article><h2>${i+1}. ${escape(r.testCase.description)}</h2><small>Entrada</small><pre>${escape(r.vars.input)}</pre><small>Respuesta completa del modelo</small><pre>${escape(r.response.output)}</pre><span class="pass">Aserción automática: ${r.success?'PASS':'FAIL'}</span></article>`}).join(''));
  }
}
page('entorno','Laboratorio 7 · entorno y trazabilidad',`<article><h2>Herramientas verificadas</h2><pre>${escape(fs.readFileSync('resultados/entorno.txt','utf8'))}</pre><p>Ollama 0.40.17 · servicio local 127.0.0.1:11434 · sin herramientas de base de datos.</p><p>Fecha de realización: 22 de noviembre de 2026 (America/Bogota).</p></article><article><h2>Corridas efectivas</h2>${Object.entries(runs).map(([k,r])=>`<p><b>${k}</b>: ${escape(r.evalId)} · ${r.results.results.filter(x=>x.success).length}/8 PASS · ${r.results.results.filter(x=>!x.response?.output).length} errores de ejecución</p>`).join('')}<p>El intento inicial con el modelo aún en descarga quedó excluido de la comparación.</p></article><article><h2>Alcance</h2><p>Seis casos de la guía y dos variantes propias de prompt injection, idénticos antes y después. Solo datos ficticios. PASS indica cumplimiento de la aserción específica, no seguridad universal.</p></article>`);
console.log('Vistas HTML de evidencia generadas a partir de los JSON reales.');
