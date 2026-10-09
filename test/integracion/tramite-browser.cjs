const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const { once } = require('node:events');
const fs = require('node:fs/promises');
const path = require('node:path');

async function probar() {
  const codigo = 'QA-CORREO-8001', codigoPdf = 'QA-CORREO-8002', aceptar = 'A'.repeat(43), aceptarPdf = 'B'.repeat(43), refutar = 'R'.repeat(43), refutarPdf = 'S'.repeat(43);
  const codigoVencido = 'QA-VENCIDO-8003', tokenVencido = 'E'.repeat(43);
  const codigoRevocado = 'QA-REVOCADO-8004', tokenRevocado = 'T'.repeat(43);
  const codigoCaduca = 'QA-CADUCA-8005', tokenCaduca = 'C'.repeat(43);
  const codigoDefensa = 'QA-DEFENSA-8006', tokenDefensa = 'D'.repeat(43);
  const llamadas = [];
  let aceptada = false, fallaInstitucional = true, pdfFalla = true, caducado = false, pagoDisponible = false;
  const backend = http.createServer(async (req, res) => {
    let texto = ''; for await (const chunk of req) texto += chunk;
    const datos = texto ? JSON.parse(texto) : {};
    llamadas.push({ metodo: req.method, ruta: req.url, datos });
    const json = (valor, estado = 200) => { res.writeHead(estado, { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' }); res.end(JSON.stringify(valor)); };
    if (req.url === '/vivi/aceptaciones/consulta' && [tokenVencido, tokenRevocado].includes(datos.token)) return json({ estadoEnlace: datos.token === tokenVencido ? 'VENCIDO' : 'REVOCADO', codigoCaso: datos.token === tokenVencido ? codigoVencido : codigoRevocado, estadoCaso: 'NOTIFICADA' });
    if (req.url === '/vivi/aceptaciones/consulta' && datos.token === tokenCaduca) return json(caducado
      ? { estadoEnlace: 'VENCIDO', codigoCaso: codigoCaduca, estadoCaso: 'NOTIFICADA' }
      : { estadoEnlace: 'VIGENTE', estadoCaso: 'NOTIFICADA', puedeAceptar: true, denuncia: { idDenuncia: '8005', codigoCaso: codigoCaduca, estado: 'NOTIFICADA', usoPlaca: 'P', placa: '113BBB' }, evidencias: [] });
    if (req.url === '/vivi/aceptaciones/consulta' && datos.token === tokenDefensa) return json({ estadoEnlace: 'REVOCADO', codigoCaso: codigoDefensa, estadoCaso: 'DEFENSA_WEB' });
    const segundo = datos.token === aceptarPdf || datos.token === refutarPdf;
    const denuncia = { idDenuncia: segundo ? '8002' : '8001', codigoCaso: segundo ? codigoPdf : codigo, estado: !segundo && aceptada ? 'REMISION_EMITIDA' : 'NOTIFICADA', usoPlaca: 'P', placa: '113BBB', descripcionHecho: 'Estacionamiento en lugar prohibido', capturadaEn: '2026-10-08T15:00:00Z', latitud: 14.6, longitud: -90.5, regla: 39 };
    if (req.url === '/vivi/aceptaciones/consulta') return json(!segundo && aceptada ? { estadoEnlace: 'USADO', codigoCaso: codigo, denuncia, estadoCaso: 'REMISION_EMITIDA', remision: { ciudad: 1, serie: 'V', numero: '90' }, pago: pagoDisponible ? { estado: 'DISPONIBLE', urlPago: 'https://pagos.example/90' } : { estado: 'PREPARANDO' } } : { estadoEnlace: 'VIGENTE', estadoCaso: 'NOTIFICADA', puedeAceptar: true, denuncia, evidencias: [] });
    if (req.url === '/vivi/aceptaciones') {
      await new Promise(resolve => setTimeout(resolve, 700));
      if (fallaInstitucional) return json({ codigo: 'FALLO_INSTITUCIONAL', message: ['No se pudo emitir la multa; intente de nuevo'] }, 503);
      aceptada = true; return json({ idDenuncia: '8001', remision: { ciudad: 1, serie: 'V', numero: '90' }, reutilizada: false, pago: { estado: 'PREPARANDO' } });
    }
    if (req.url === '/vivi/defensas/consulta') {
      if (datos.token === refutar && aceptada) return json({ message: ['Este enlace ya está revocado'] }, 410);
      return json({ caso: { id: denuncia.idDenuncia, codigo: denuncia.codigoCaso, estado: 'NOTIFICADA', usoPlaca: 'P', placa: '113BBB', descripcionHecho: denuncia.descripcionHecho } });
    }
    if (req.url === '/vivi/defensas/plantilla') {
      await new Promise(resolve => setTimeout(resolve, 700));
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
    await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const capturar = async opciones => {
      await page.evaluate(() => {
        window.getSelection()?.removeAllRanges();
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
      await page.screenshot({ animations: 'disabled', ...opciones });
    };
    const fragmento = `#accion=aceptar&aceptar=${aceptar}&refutar=${refutar}`;
    const abrir = `http://127.0.0.1:3731/tramite-reporte/${codigo}${fragmento}`;
    const response = await page.goto(abrir);
    await page.getByText(codigo, { exact: true }).waitFor();
    assert.match(response.headers()['referrer-policy'], /no-referrer/);
    assert.match(response.headers()['x-robots-tag'], /noindex/);
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, 0);
    await page.getByRole('button', { name: 'Aceptar y pagar', exact: true }).waitFor();
    await capturar({ path: path.join(out, 'portal-resumen.png'), fullPage: true });
    const left = await page.getByRole('heading', { name: 'Resumen de la denuncia' }).boundingBox();
    const right = await page.getByRole('heading', { name: '¿Qué deseas hacer?' }).boundingBox();
    assert.ok(right.x > left.x + 400, 'El resumen debe conservar las dos columnas');
    await page.setViewportSize({ width: 390, height: 844 });
    await capturar({ path: path.join(out, 'portal-resumen-movil.png'), fullPage: true, animations: 'disabled' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'El resumen desborda el ancho móvil');
    await page.setViewportSize({ width: 1440, height: 1024 });
    const otraPestana = await context.newPage();
    await otraPestana.goto(abrir);
    await otraPestana.getByRole('button', { name: 'Aceptar y pagar', exact: true }).click();
    await otraPestana.getByRole('heading', { name: 'Confirma tu aceptación' }).waitFor();
    await page.getByRole('button', { name: 'Aceptar y pagar', exact: true }).click();
    await page.getByRole('heading', { name: 'Confirma tu aceptación' }).waitFor();
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, 0);
    await page.bringToFront();
    await capturar({ path: path.join(out, 'portal-confirmacion.png'), fullPage: true });
    await page.getByRole('button', { name: 'Confirmar y aceptar', exact: true }).dblclick();
    await page.getByRole('heading', { name: 'Procesando tu aceptación' }).waitFor();
    await capturar({ path: path.join(out, 'portal-procesando.png'), fullPage: true });
    await page.getByRole('heading', { name: 'No pudimos registrar tu aceptación' }).waitFor();
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, 1, 'Doble click emitió dos solicitudes');
    fallaInstitucional = false;
    await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
    await page.getByRole('heading', { name: 'Tu aceptación fue registrada' }).waitFor();
    const escrituras = llamadas.filter(l => l.ruta === '/vivi/aceptaciones');
    assert.deepEqual(escrituras[0].datos, escrituras[1].datos);
    assert.equal(await page.getByRole('button', { name: 'Continuar al portal institucional' }).count(), 0);
    await capturar({ path: path.join(out, 'portal-resultado.png'), fullPage: true });
    await otraPestana.bringToFront();
    await otraPestana.getByRole('button', { name: 'Confirmar y aceptar', exact: true }).click();
    await otraPestana.getByRole('heading', { name: 'Esta denuncia ya fue aceptada' }).waitFor();
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, 2, 'Una pestaña anterior volvió a enviar la aceptación');
    assert.equal(await otraPestana.getByRole('button', { name: 'Aceptar y pagar', exact: true }).count(), 0);
    await otraPestana.close();
    await page.reload();
    await page.getByRole('heading', { name: 'Esta denuncia ya fue aceptada' }).waitFor();
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, 2);
    assert.equal(await page.getByRole('button', { name: 'Aceptar y pagar', exact: true }).count(), 0);
    await capturar({ path: path.join(out, 'portal-ya-aceptado.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await capturar({ path: path.join(out, 'portal-ya-aceptado-movil.png'), fullPage: true });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Ya aceptado desborda en móvil');
    await page.setViewportSize({ width: 1440, height: 1024 });
    pagoDisponible = true;
    await page.getByRole('button', { name: 'Consultar disponibilidad de pago', exact: true }).click();
    await page.getByRole('link', { name: 'Continuar al portal institucional', exact: true }).waitFor();
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, 2, 'Consultar pago volvió a emitir');
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/OTRO-CASO${fragmento}`);
    await page.getByRole('alert').filter({ hasText: 'no corresponde' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Aceptar y pagar', exact: true }).count(), 0);
    const fragmentoPdf = `#accion=refutar&aceptar=${aceptarPdf}&refutar=${refutarPdf}`;
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/${codigoPdf}${fragmentoPdf}`);
    await page.getByRole('button', { name: 'Presentar defensa', exact: true }).click();
    await page.getByRole('heading', { name: 'Plantilla para presentar tu defensa' }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    await capturar({ path: path.join(out, 'portal-defensa-movil.png'), fullPage: true, animations: 'disabled' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'La plantilla desborda el ancho móvil');
    await page.setViewportSize({ width: 1440, height: 1024 });
    await capturar({ path: path.join(out, 'portal-defensa.png'), fullPage: true });
    await page.getByRole('button', { name: 'Descargar PDF', exact: true }).click();
    await page.getByText('Estamos generando tu PDF', { exact: true }).waitFor();
    await capturar({ path: path.join(out, 'portal-pdf-preparacion.png'), fullPage: true });
    await page.getByText('No pudimos generar tu PDF').waitFor();
    await capturar({ path: path.join(out, 'portal-pdf-error.png'), fullPage: true });
    pdfFalla = false;
    const descarga = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Reintentar descarga', exact: true }).click();
    assert.equal((await descarga).suggestedFilename(), `defensa-${codigoPdf}.pdf`);
    await page.getByText('PDF descargado', { exact: true }).waitFor();
    await capturar({ path: path.join(out, 'portal-pdf-descargado.png'), fullPage: true });
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/defensas').length, 0);
    assert.equal(llamadas.find(l => l.ruta === '/vivi/defensas/plantilla').datos.token, refutarPdf);
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/OTRO-CASO/defensa${fragmentoPdf}`);
    await page.getByRole('alert').filter({ hasText: 'no corresponde' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Descargar PDF' }).count(), 0);
    const antesCierre = llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length;
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/${codigoVencido}#accion=aceptar&aceptar=${tokenVencido}`);
    await page.getByRole('heading', { name: 'Este enlace ha vencido' }).waitFor();
    await capturar({ path: path.join(out, 'portal-enlace-vencido.png'), fullPage: true });
    assert.equal(await page.getByRole('button', { name: 'Aceptar y pagar', exact: true }).count(), 0);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Enlace vencido desborda en móvil');
    await page.setViewportSize({ width: 1440, height: 1024 });
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/${codigoRevocado}#accion=aceptar&aceptar=${tokenRevocado}`);
    await page.getByRole('heading', { name: 'Este enlace ya no está disponible' }).waitFor();
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/${codigoCaduca}#accion=aceptar&aceptar=${tokenCaduca}`);
    await page.getByRole('button', { name: 'Aceptar y pagar', exact: true }).click();
    await page.getByRole('heading', { name: 'Confirma tu aceptación' }).waitFor();
    caducado = true;
    await page.getByRole('button', { name: 'Confirmar y aceptar', exact: true }).click();
    await page.getByRole('heading', { name: 'Este enlace ha vencido' }).waitFor();
    assert.equal(llamadas.filter(l => l.ruta === '/vivi/aceptaciones').length, antesCierre, 'Un enlace que caducó en la confirmación envió una aceptación');
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/${codigoDefensa}#accion=aceptar&aceptar=${tokenDefensa}`);
    await page.getByRole('heading', { name: 'Esta denuncia tiene una defensa registrada' }).waitFor();
    await capturar({ path: path.join(out, 'portal-con-defensa.png'), fullPage: true });
    assert.equal(await page.getByRole('button', { name: 'Aceptar y pagar', exact: true }).count(), 0);
    const previas = llamadas.length;
    await page.goto(`http://127.0.0.1:3731/tramite-reporte/${codigo}`);
    await page.getByText('abre el enlace privado del correo recibido', { exact: false }).waitFor();
    assert.equal(llamadas.slice(previas).filter(l => l.ruta.startsWith('/vivi/')).length, 0);
    console.log('OK | Resumen, confirmación, dos pestañas, doble clic, 503/reintento, recarga sin otra aceptación, Ya aceptado, pago PREPARANDO/DISPONIBLE, enlace vencido/revocado, caducidad durante confirmación, defensa registrada, PDF/reintento y caso cruzado. Backend controlado; sin Oracle ni SMTP.');
  } catch (error) {
    console.error('Diagnóstico del navegador:', JSON.stringify({ rutas: llamadas.map(l => l.ruta), texto: page ? await page.locator('body').innerText() : salida }));
    throw error;
  } finally { if (browser) await browser.close(); next.kill('SIGTERM'); backend.close(); }
}
probar().catch(error => { console.error(error); process.exitCode = 1; });
