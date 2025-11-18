import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const runtime = 'nodejs';

function normalizaNumero(str: string): string {
  if (str == null) return '0';
  const s = String(str);
  const idx = s.lastIndexOf(',');
  let out = s;
  if (idx !== -1) {
    out = out.substring(0, idx) + '.' + out.substring(idx + 1);
  }
  out = out.replace(/,/g, '');
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      encabezado,
      remisiones = [],
      cuentas = [],
      intereses = [],
      descuentos = [],
      valorEnLetras,
      notaCredito = 0,
    } = body;

    // Validaciones básicas
    if (!Array.isArray(encabezado) || encabezado.length < 11) {
      return NextResponse.json(
        { success: false, message: 'encabezado inválido o incompleto' },
        { status: 400 },
      );
    }
    if (!valorEnLetras) {
      return NextResponse.json(
        { success: false, message: 'valorEnLetras es requerido' },
        { status: 400 },
      );
    }

    const data = {
      encabezado,
      remisiones,
      cuentas,
      intereses,
      descuentos,
    };

    // --------- LÓGICA IGUAL A generarPdf ---------
    let remisionesStr = '';
    let descripcionCta = '';
    let montoTotalCta = '';
    let totalCuentas = 0;
    let totalDescuentos = 0;

    // remisiones: solo usamos el texto (notaCredito viene ya sumado en notaCredito)
    for (const rem of data.remisiones ?? []) {
      remisionesStr += `${rem[0]},\n`;
    }

    // cuentas
    for (const cuenta of data.cuentas ?? []) {
      // cuenta[3] = descripción, cuenta[4] = valor formateado
      descripcionCta += `<label class='text-header'>${cuenta[3]}</label>`;
      montoTotalCta += `<label class='text-header' style='text-align: right;'>${cuenta[4]}</label>`;
      totalCuentas += Number(normalizaNumero(cuenta[4]));
    }

    // intereses
    const interesesValor =
      Array.isArray(data.intereses) && data.intereses[4]
        ? data.intereses[4]
        : (0).toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

    descripcionCta += `<label class='text-header'>INTERESES POR MORA</label>`;
    montoTotalCta += `<label class='text-header' style='text-align: right;'> ${interesesValor} </label>`;

    // descuentos (sumados + notaCredito)
    for (const descuento of data.descuentos ?? []) {
      totalDescuentos += Number(descuento[4]);
    }
    totalDescuentos += Number(notaCredito || 0);

    descripcionCta += `<label class='text-header'>DESCUENTOS</label>`;
    montoTotalCta += `<label class='text-header' style='text-align: right;'> ${totalDescuentos.toLocaleString(
      'es-ES',
      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    )} </label>`;

    // --------- HTML IGUAL AL DE generarPdf ---------
    const html = `<!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="utf-8" />
            <style>
                @page {
                  margin: 0 0;
                  box-sizing: border-box;
                }
                html, body {
                  font-size: 12px;
                  font-family: 'courier';
                  margin: 0 0;
                  box-sizing: border-box;
                }
                /* Ancho Pagina 559.5px; Ancho con Borde 557.5px */
                .voucher-header {
                    width: 559.5px;
                    padding-top: 20px !important;
                }
                .voucher-body {
                    width: 559.5px;
                }
                .voucher-footer {
                    position: absolute;
                    bottom: 0;
                    width: 559.5px;
                }
                .col-p {
                    padding: 0 55px 0 54px;
                }
                .col-p.tight-right { padding-right: 20px; }
                .col-100 {
                    width: 100%;
                }
                .col-100:after {
                    clear: both;
                }
                /* Ancho con padding 449.5px */
                .col-header-1 {
                    width: 367.125px;
                    float: left;
                }
                .col-header-2 {
                    width: 160px;
                    float: right;
                }
                .col-body-1 {
                    width: 370.6px;
                    float: left;
                }
                .col-body-2 {
                    width: 140px;
                    float: right;
                }
                .col-body-2 .text-header { padding-right: 0 !important; }
                .col-detail-content::after{
                  content: "";        
                  display: table;     
                  clear: both;
                }
                /* Helpers for cleaning and texts */
                .clear {
                    clear: both;
                }
                .col-detail-content::after {
                    clear: both;
                }
                .text-header {
                    display: block;
                }
                .total-label{ position: relative; right: -10px; }
            </style>
          </head>
          <body>
            <header>
              <div class="voucher-header">
                <div class="col-100 col-p">
                  <div class='col-header-1'>
                    <label class='text-header'>EMETRA</label>
                    <label class='text-header'>21 CALLE 6-77, ZONA 1</label>
                    <label class='text-header'>GUATEMALA, GUATEMALA.</label>
                    <label class='text-header'>MUNICIPALIDAD DE GUATEMALA</label>
                    <label class='text-header'>FORMA 7-B1 RECIBO DE INGRESOS VARIOS</label>
                    <label class='text-header'>ELECTRONICO</label>
                    <label class='text-header'>SIN SERIE</label>
                  </div>
                  <div class='col-header-2' style='padding-top: 52px;'>
                    <label class='text-header'> Fecha: ${data.encabezado[2]} </label>
                    <label class='text-header'> No: ${data.encabezado[1]} </label>
                  </div>
                </div>
                <div class='clear'></div>
                <div class='col-100 col-p tight-right' style='padding-top: 15px;'>
                  <label class='text-header'>Nombre:</label>
                  <label class='text-header'> ${data.encabezado[3]} </label>
                </div>                
              </div>
            </header>
            <section class='voucher-body' style='padding-top: 25px;'>
              <div class='col-100 col-p'>
                <label class='text-header'>Valor en Letras:</label>
                <label class='text-header'> ${valorEnLetras} </label>
              </div>

              <div class='col-100 col-p tight-right col-detail-content' style='padding-top: 15px;'>
                <div class='col-body-1'>
                  <label class='text-header' style='text-align: center;'>Descripcion</label>
                  ${descripcionCta}
                  <label class='text-header total-label' style='text-align: right;'>Total:</label>
                </div>
                <div class='col-body-2'>
                  <label class='text-header' style='text-align: right; padding-right: 20px;'>Valor</label>
                  ${montoTotalCta}
                  <label class='text-header' style='text-align: right;'>${data.encabezado[4]}</label>
                </div>
              </div>
              <div class='clear'></div>
              <div class='col-100 col-p' style='padding-top: 30px; height: 200px;'>
                ${remisionesStr}
              </div>
            </section>
            <footer class='voucher-footer' style='padding-top: 15px;'>
              <div class='col-100 col-p'>
                <div class='col-footer-1'>
                    <label class='text-header' style='display: inline;'>${data.encabezado[5]}${data.encabezado[6]}</label>
                </div>
                <div class='col-footer-2' style='padding-top: 15px;'>
                    <label class='text-header' style='display: inline;'>Cajero</label>
                    <label class='text-header' style='display: inline; padding-right: 55px;'>${data.encabezado[10]}</label>
                    <label class='text-header' style='display: inline; padding-right: 60px;'>Usuario ${data.encabezado[9]}</label>
                    <label class='text-header' style='display: inline;'>Caja ${data.encabezado[8]}</label>
                </div>
                <div class='col-footer-3' style='padding-top: 15px;'>
                    <label class='text-header'>Firma: ${data.encabezado[7]}</label>
                </div>
                <div class='col-footer-4' style='padding-top: 15px;'>
                    <label class='text-header' style='text-align: justify;'><span style='padding-left: 20px;'>Autorizado</span> según resolución de La Contraloría General de Cuentas F.O.-KO-0003 2025/000388 Gestión: 1010166 de fecha 13/01/2025, rango de numeración del 1,000,001 al 2,000,000 sin serie. Envió Municipal No. 48525 de Fecha 13/03/2025. EMETRA NIT 835782K, Cuentadancia 2023-100-101-23-002 Libro 12 Folio 47 Correlat. 01-2025 fecha 13-03-2025 </label>
                </div>
                <div class='col-footer-5' style='padding-top: 15px; padding-bottom: 15px;'>
                    <label class='text-header' style='text-align: center;'>ORIGINAL ENTERANTE<span style='padding-left: 20px; padding-right: 20px;'>-</span>DUPLICADO ORIGINAL ENTIDAD</label>
                </div>
              </div>
            </footer>
          </body>
        </html>`;

    // --------- PUPPETEER: generar y devolver PDF ---------
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');

    const pdfBuffer = await page.pdf({
      format: 'A5',
      printBackground: true,
      preferCSSPageSize: true,
    });

    await page.close();
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="recibo.pdf"',
      },
    });
  } catch (err) {
    console.error('Error en /api/solvencia/recibo-pdf:', err);
    return NextResponse.json(
      { success: false, message: 'Error al generar el PDF de recibo.' },
      { status: 500 },
    );
  }
}
