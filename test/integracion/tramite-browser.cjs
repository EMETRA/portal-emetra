const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const { once } = require('node:events');

async function probar() {
  const codigo = 'QA-CORREO-8001', codigoPdf = 'QA-CORREO-8002', aceptar = 'A'.repeat(43), refutar = 'R'.repeat(43), refutarPdf = 'S'.repeat(43);
  const llamadas = [];
  let aceptada = false, fallaInstitucional = true;
  const backend = http.createServer(async (req, res) => {
    let texto = ''; for await (const chunk of req) texto += chunk;
    const datos = texto ? JSON.parse(texto) : {};
    llamadas.push({ metodo: req.method, ruta: req.url, datos });
    const json = (valor, estado = 200) => { res.writeHead(estado, { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' }); res.end(JSON.stringify(valor)); };
    if (req.url === '/vivi/aceptaciones/consulta') return json(aceptada ? { estadoEnlace: 'USADO', estadoCaso: 'REMISION_EMITIDA', remision: { ciudad: 1, serie: 'V', numero: '90' }, pago: { estado: 'PREPARANDO' } } : { estadoEnlace: 'VIGENTE', estadoCaso: 'NOTIFICADA', puedeAceptar: true, denuncia: { idDenuncia: '8001', codigoCaso: codigo, estado: 'NOTIFICADA', usoPlaca: 'P', placa: '113BBB' } });
    if (req.url === '/vivi/aceptaciones') {
      if (fallaInstitucional) return json({ codigo: 'FALLO_INSTITUCIONAL', message: ['No se pudo emitir la multa; intente de nuevo'] }, 503);
      aceptada = true; return json({ idDenuncia: '8001', remision: { ciudad: 1, serie: 'V', numero: '90' }, reutilizada: false, pago: { estado: 'PREPARANDO' } });
    }
    if (req.url === '/vivi/defensas/consulta') {
      if (datos.token === refutar && aceptada) return json({ message: ['Este enlace ya está revocado'] }, 410);
      return json({ caso: { id: datos.token === refutarPdf ? '8002' : '8001', codigo: datos.token === refutarPdf ? codigoPdf : codigo, estado: 'NOTIFICADA', usoPlaca: 'P', placa: '113BBB' } });
    }
    if (req.url === '/vivi/defensas/plantilla') { res.writeHead(200, { 'Content-Type': 'application/pdf', 'Cache-Control': 'private, no-store' }); return res.end('%PDF-1.4\nQA de contrato\n%%EOF'); }
    return json({ items: [], total: 0 });
  });
  backend.listen(3732, '127.0.0.1'); await once(backend, 'listening');
  const next = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3731', '-H', '127.0.0.1'], { env: { ...process.env, API_BASE_URL: 'http://127.0.0.1:3732', NEXT_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let salida = ''; next.stdout.on('data', b => salida += b); next.stderr.on('data', b => salida += b);
  let browser, page;
  try {
    let listo = false;
    for (let i = 0; i < 100; i++) { if (salida.includes('Ready in')) { listo = true; break; } if (next.exitCode !== null) throw new Error(salida); await new Promise(r => setTimeout(r, 100)); }
    assert.ok(listo, 'El servidor Next no arrancó');
    browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const context = await browser.newContext({ acceptDownloads: true });
    page = await context.newPage();
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const fragmento = `#accion=aceptar&aceptar=${aceptar}&refutar=${refutar}`;
    const abrir = `http://127.0.0.1:3731/tramite-reporte/${codigo}${fragmento}`;
    const response = await page.goto(abrir);
    await page.getByRole('heading', { name: `No. de caso ${codigo}` }).waitFor();
    assert.match(response.headers()['referrer-policy'], /no-referrer/);
    assert.match(response.headers()['x-robots-tag'], /noindex/);
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, 0, 'Abrir el enlace emitió una multa');
    assert.ok(await page.getByRole('button', { name: 'Confirmar aceptación' }).isDisabled());
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Confirmar aceptación' }).click();
    await page.getByRole('alert').filter({ hasText: 'No se pudo emitir la multa' }).waitFor();
    fallaInstitucional = false;
    await page.getByRole('button', { name: 'Confirmar aceptación' }).click();
    await page.getByRole('heading', { name: 'Aceptación registrada' }).waitFor();
    const escrituras = llamadas.filter(l => l.ruta === '/vivi/aceptaciones');
    assert.equal(escrituras.length, 2);
    assert.deepEqual(escrituras[0].datos, escrituras[1].datos, 'El reintento cambió la clave de idempotencia');
    assert.equal(escrituras[0].datos.token, aceptar);
    await page.getByRole('button', { name: 'Refutar / descargar plantilla' }).click();
    await page.getByRole('alert').filter({ hasText: 'revocado' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Descargar plantilla PDF' }).count(), 0);
    const fragmentoPdf = `#accion=refutar&aceptar=${'B'.repeat(43)}&refutar=${refutarPdf}`;
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/${codigoPdf}${fragmentoPdf}`);
    await page.getByRole('button', { name: 'Descargar plantilla PDF' }).waitFor();
    const descarga = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Descargar plantilla PDF' }).click();
    assert.equal((await descarga).suggestedFilename(), `Plantilla-${codigoPdf}.pdf`);
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/defensas').length, 0);
    assert.equal(llamadas.find(l => l.ruta === '/vivi/defensas/plantilla').datos.token, refutarPdf);
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/OTRO-CASO${fragmentoPdf}`);
    await page.getByRole('alert').filter({ hasText: 'no corresponde' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Descargar plantilla PDF' }).count(), 0);
    const previas = llamadas.length;
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/${codigo}`);
    await page.getByRole('heading', { name: 'Trámite de reporte' }).waitFor();
    assert.equal(llamadas.slice(previas).filter(l => l.ruta.startsWith('/vivi/')).length, 0);
    console.log('OK | Trámite real: consulta sin multa, consentimiento, 503/reintento idempotente, PDF, caso cruzado y URL sin token. Backend controlado, sin Oracle ni SMTP.');
  } catch (error) {
    console.error('Diagnóstico del navegador:', JSON.stringify({ rutas: llamadas.map(l => l.ruta), texto: page ? await page.locator('body').innerText() : salida }));
    throw error;
  } finally { if (browser) await browser.close(); next.kill('SIGTERM'); backend.close(); }
}
probar().catch(error => { console.error(error); process.exitCode = 1; });
