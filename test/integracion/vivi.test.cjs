const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const root=path.resolve(__dirname,'../..');
const load=require('./load-ts.cjs')(root);
const api=load('src/lib/vivi/acciones.ts');
const enlaces=load('src/lib/vivi/enlace-reporte.ts');
const originalFetch=global.fetch;
test.afterEach(()=>{global.fetch=originalFetch;});
test('consultar usa POST local con token en el cuerpo y nunca emite una aceptación',async()=>{
 const calls=[];global.fetch=async(url,init)=>{calls.push({url,init});return Response.json({estadoEnlace:'VIGENTE'});};
 await api.consultarAceptacion('token-qa');assert.equal(calls.length,1);assert.equal(calls[0].url,'/api/vivi/aceptaciones/consulta');assert.equal(calls[0].init.method,'POST');assert.deepEqual(JSON.parse(calls[0].init.body),{token:'token-qa'});assert.equal(calls[0].init.cache,'no-store');
});
test('aceptación y reintento conservan requestId y propagan el 503 real',async()=>{
 const bodies=[];global.fetch=async(_,init)=>{bodies.push(JSON.parse(init.body));return Response.json({codigo:'FALLO_INSTITUCIONAL',message:['No se pudo emitir la multa']},{status:503});};
 for(let i=0;i<2;i++)await assert.rejects(()=>api.aceptarDenuncia('token-qa','web-idempotente'),e=>e.status===503&&e.codigo==='FALLO_INSTITUCIONAL');assert.deepEqual(bodies[0],bodies[1]);
});
test('el error conserva la referencia de atención sin aceptar cadenas arbitrarias',async()=>{
 const referencia='12345678-1234-1234-1234-123456789abc';
 global.fetch=async()=>Response.json({message:['Error Interno de Servidor'],referencia},{status:500});
 await assert.rejects(()=>api.consultarAceptacion('token-qa'),e=>e.status===500&&e.referencia===referencia);
 global.fetch=async()=>new Response('Bad Gateway',{status:502,headers:{'X-Request-Id':referencia}});
 await assert.rejects(()=>api.consultarAceptacion('token-qa'),e=>e.status===502&&e.referencia===referencia);
 global.fetch=async()=>Response.json({message:['Fallo'],referencia:'token-privado'},{status:500});
 await assert.rejects(()=>api.consultarAceptacion('token-qa'),e=>e.referencia===undefined);
});
test('rechaza una respuesta 200 JSON que pretendiera ser una descarga PDF',async()=>{
 global.fetch=async()=>Response.json({error:'PDF no generado'});await assert.rejects(()=>api.descargarPlantilla('token-qa'),/PDF válido/);
});
test('descarga únicamente bytes PDF desde el endpoint de plantilla',async()=>{
 let path;global.fetch=async(url)=>{path=url;return new Response('%PDF-1.4\nQA',{headers:{'Content-Type':'application/pdf','Cache-Control':'private, no-store'}});};const blob=await api.descargarPlantilla('token-qa');assert.equal(path,'/api/vivi/defensas/plantilla');assert.equal(blob.type,'application/pdf');assert.match(await blob.text(),/^%PDF-/);
});
test('no inventa enlace de pago y rechaza protocolos ejecutables',()=>{
 assert.equal(api.urlPagoSeguro({estado:'PREPARANDO'}),null);assert.equal(api.urlPagoSeguro({estado:'DISPONIBLE',urlPago:'javascript:alert(1)'}),null);assert.equal(api.urlPagoSeguro({estado:'DISPONIBLE',urlPago:'https://pagos.example/30'}),'https://pagos.example/30');
});
test('ruta por número de caso lee los dos tokens privados del fragmento',()=>{
 const aceptar='A'.repeat(43),refutar='R'.repeat(43);
 assert.deepEqual(enlaces.leerEnlaceReporte(`#accion=refutar&aceptar=${aceptar}&refutar=${refutar}`),{accion:'refutar',aceptar,refutar});
 assert.equal(enlaces.leerEnlaceReporte(''),null);
 assert.equal(enlaces.leerEnlaceReporte(`#accion=aceptar&aceptar=${aceptar}&aceptar=${refutar}`),null);
 assert.equal(enlaces.leerEnlaceReporte('#accion=aceptar&aceptar=javascript:alert(1)'),null);
});
test('rechaza cruzar el token con un número de caso distinto antes de aceptar o descargar',()=>{
 assert.doesNotThrow(()=>enlaces.comprobarCasoReporte('QA-E0710C-PDF_P','QA-E0710C-PDF_P'));
 assert.throws(()=>enlaces.comprobarCasoReporte('QA-E0710C-PDF_P','QA-OTRO'),/no corresponde/);
});
test('evidencias privadas: token en POST, caso e ID en la ruta, MIME verificado',async()=>{
 let llamada;global.fetch=async(url,init)=>{llamada={url,init};return new Response('bytes',{headers:{'Content-Type':'image/png'}});};
 const blob=await api.leerEvidencia('token-privado','QA-CASO','19');
 assert.equal(blob.type,'image/png');assert.equal(llamada.url,'/api/vivi/denuncias/QA-CASO/evidencias/19');assert.deepEqual(JSON.parse(llamada.init.body),{token:'token-privado'});assert.equal(llamada.init.cache,'no-store');
 global.fetch=async()=>new Response('<svg/>',{headers:{'Content-Type':'image/svg+xml'}});
 await assert.rejects(()=>api.leerEvidencia('token','QA-CASO','19'),/no disponible/);
});
