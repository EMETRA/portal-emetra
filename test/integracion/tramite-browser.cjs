const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const { once } = require('node:events');
const fs = require('node:fs/promises');
const path = require('node:path');

async function probar() {
  const codigo = 'QA-CORREO-8001', codigoPdf = 'QA-CORREO-8002', aceptar = 'A'.repeat(43), aceptarPdf = 'B'.repeat(43), refutar = 'R'.repeat(43), refutarPdf = 'S'.repeat(43);
  const llamadas = [];
  let aceptada = false, fallaInstitucional = true, pdfFalla = true;
  const backend = http.createServer(async (req, res) => {
    let texto = ''; for await (const chunk of req) texto += chunk;
    const datos = texto ? JSON.parse(texto) : {};
    llamadas.push({ metodo: req.method, ruta: req.url, datos });
    const json = (valor, estado = 200) => { res.writeHead(estado, { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' }); res.end(JSON.stringify(valor)); };
    const segundo = datos.token === aceptarPdf || datos.token === refutarPdf;
    const denuncia = { idDenuncia: segundo ? '8002' : '8001', codigoCaso: segundo ? codigoPdf : codigo, estado: !segundo && aceptada ? 'REMISION_EMITIDA' : 'NOTIFICADA', usoPlaca: 'P', placa: '113BBB', descripcionHecho: 'Estacionamiento en lugar prohibido', capturadaEn: '2026-10-08T15:00:00Z', latitud: 14.6, longitud: -90.5, regla: 39 };
    if (req.url === '/vivi/aceptaciones/consulta') return json(!segundo && aceptada ? { estadoEnlace: 'USADO', codigoCaso: codigo, denuncia, estadoCaso: 'REMISION_EMITIDA', remision: { ciudad: 1, serie: 'V', numero: '90' }, pago: { estado: 'PREPARANDO' } } : { estadoEnlace: 'VIGENTE', estadoCaso: 'NOTIFICADA', puedeAceptar: true, denuncia, evidencias: [] });
    if (req.url === '/vivi/aceptaciones') {
      if (fallaInstitucional) return json({ codigo: 'FALLO_INSTITUCIONAL', message: ['No se pudo emitir la multa; intente de nuevo'] }, 503);
      aceptada = true; return json({ idDenuncia: '8001', remision: { ciudad: 1, serie: 'V', numero: '90' }, reutilizada: false, pago: { estado: 'PREPARANDO' } });
    }
    if (req.url === '/vivi/defensas/consulta') {
      if (datos.token === refutar && aceptada) return json({ message: ['Este enlace ya está revocado'] }, 410);
      return json({ caso: { id: denuncia.idDenuncia, codigo: denuncia.codigoCaso, estado: 'NOTIFICADA', usoPlaca: 'P', placa: '113BBB', descripcionHecho: denuncia.descripcionHecho } });
    }
    if (req.url === '/vivi/defensas/plantilla') {
      if (pdfFalla) return json({ message: ['PDF temporalmente no disponible'] }, 503);
      res.writeHead(200, { 'Content-Type': 'application/pdf', 'Cache-Control': 'private, no-store' }); return res.end('%PDF-1.4\nQA de contrato\n%%EOF');
    }
    return json({ items: [], total: 0 });
  });
  backend.listen(3732, '127.0.0.1'); await once(backend, 'listening');
  const next = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3731', '-H', '127.0.0.1'], { env: { ...process.env, API_BASE_URL: 'http://127.0.0.1:3732', NEXT_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let salida = ''; next.stdout.on('data', b => salida += b); next.stderr.on('data', b => salida += b);
  let browser, page;
  const out = process.env.QA_SCREENSHOT_DIR || path.resolve(__dirname, '../../../../capturas');
  await fs.mkdir(out, { recursive: true });
  try {
    for (let i = 0; !salida.includes('Ready in') && i < 200; i++) { if (next.exitCode !== null) throw new Error(salida); await new Promise(r => setTimeout(r, 100)); }
    assert.ok(salida.includes('Ready in'), 'El servidor Next no arrancó');
    browser = await chromium.launch({ executablePath: process.env.QA_CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1024 } });
    page = await context.newPage();
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const fragmento = `#accion=aceptar&aceptar=${aceptar}&refutar=${refutar}`;
    const abrir = `http://127.0.0.1:3731/tramite-reporte/${codigo}${fragmento}`;
    const response = await page.goto(abrir);
    await page.getByText(codigo, { exact: true }).waitFor();
    assert.match(response.headers()['referrer-policy'], /no-referrer/);
    assert.match(response.headers()['x-robots-tag'], /noindex/);
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, 0);
    await page.getByRole('button', { name: 'Aceptar y pagar', exact: true }).waitFor();
    await page.screenshot({ path: path.join(out, 'portal-resumen.png'), fullPage: true });
    const left = await page.getByRole('heading', { name: 'Resumen de la denuncia' }).boundingBox();
    const right = await page.getByRole('heading', { name: '¿Qué deseas hacer?' }).boundingBox();
    assert.ok(right.x > left.x + 400, 'El resumen debe conservar las dos columnas');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(out, 'portal-resumen-movil.png'), fullPage: true, animations: 'disabled' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'El resumen desborda el ancho móvil');
    await page.setViewportSize({ width: 1440, height: 1024 });
    await page.getByRole('button', { name: 'Aceptar y pagar', exact: true }).click();
    await page.getByRole('heading', { name: 'Confirma tu aceptación' }).waitFor();
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, 0);
    await page.screenshot({ path: path.join(out, 'portal-confirmacion.png'), fullPage: true });
    await page.getByRole('button', { name: 'Confirmar y aceptar', exact: true }).dblclick();
    await page.getByRole('heading', { name: 'No pudimos registrar tu aceptación' }).waitFor();
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, 1, 'Doble click emitió dos solicitudes');
    fallaInstitucional = false;
    await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
    await page.getByRole('heading', { name: 'Tu aceptación fue registrada' }).waitFor();
    const escrituras = llamadas.filter(l => l.ruta === '/vivi/aceptaciones');
    assert.deepEqual(escrituras[0].datos, escrituras[1].datos);
    assert.equal(await page.getByRole('button', { name: 'Continuar al portal institucional' }).count(), 0);
    await page.screenshot({ path: path.join(out, 'portal-resultado.png'), fullPage: true });
    await page.reload();
    await page.getByRole('heading', { name: 'Esta denuncia ya fue aceptada' }).waitFor();
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, 2);
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/OTRO-CASO${fragmento}`);
    await page.getByRole('alert').filter({ hasText: 'no corresponde' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Aceptar y pagar', exact: true }).count(), 0);
    const fragmentoPdf = `#accion=refutar&aceptar=${aceptarPdf}&refutar=${refutarPdf}`;
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/${codigoPdf}${fragmentoPdf}`);
    await page.getByRole('button', { name: 'Presentar defensa', exact: true }).click();
    await page.getByRole('heading', { name: 'Plantilla para presentar tu defensa' }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(out, 'portal-defensa-movil.png'), fullPage: true, animations: 'disabled' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'La plantilla desborda el ancho móvil');
    await page.setViewportSize({ width: 1440, height: 1024 });
    await page.screenshot({ path: path.join(out, 'portal-defensa.png'), fullPage: true });
    await page.getByRole('button', { name: 'Descargar PDF', exact: true }).click();
    await page.getByText('No pudimos generar tu PDF').waitFor();
    pdfFalla = false;
    const descarga = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Reintentar descarga', exact: true }).click();
    assert.equal((await descarga).suggestedFilename(), `defensa-${codigoPdf}.pdf`);
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/defensas').length, 0);
    assert.equal(llamadas.find(l => l.ruta === '/vivi/defensas/plantilla').datos.token, refutarPdf);
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/OTRO-CASO/defensa${fragmentoPdf}`);
    await page.getByRole('alert').filter({ hasText: 'no corresponde' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Descargar PDF' }).count(), 0);
    const previas = llamadas.length;
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/${codigo}`);
    await page.getByText('abre el enlace privado del correo recibido', { exact: false }).waitFor();
    assert.equal(llamadas.slice(previas).filter(l => l.ruta.startsWith('/vivi/')).length, 0);
    console.log('OK | Diseño original, resumen sin multa, confirmación, doble envío bloqueado, 503/reintento idempotente, pago PREPARANDO, recarga, PDF/reintento y caso cruzado VIGENTE/USADO. Backend controlado; sin Oracle ni SMTP.');
  } catch (error) {
    console.error('Diagnóstico del navegador:', JSON.stringify({ rutas: llamadas.map(l => l.ruta), texto: page ? await page.locator('body').innerText() : salida }));
    throw error;
  } finally { if (browser) await browser.close(); next.kill('SIGTERM'); backend.close(); }
}
probar().catch(error => { console.error(error); process.exitCode = 1; });
