import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import QRCode from 'qrcode'
export const runtime = 'nodejs' 

export async function POST(req: Request) {
  const { tipoPlaca, placa, fechaRecibo, numeroRecibo } = await req.json()

  const qrData = `https://emetra.muniguate.com/impresion/solvencia-valida/${numeroRecibo}`
  const qrDataUrl = await QRCode.toDataURL(qrData)
  const { origin } = new URL(req.url);
  const letrasEmetra = `${origin}/images/Emetra.png`
  const muniLogo = `${origin}/images/MuniGuate.png`

  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          html, body { margin:0; padding:0; width:100%; height:100%; font-family: Arial, sans-serif; }

          .wrap {
            display:flex;
            align-items:center;
            width:100%;
            height:100%;
            padding-inline: 24px;            
            box-sizing:border-box;
          }

          .left {
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            width:32%;                     
          }
          .left .logo { width:160px;}   
          .left .qr   { width:140px; height:140px; object-fit:contain; } 

          .right {
            display:flex;
            flex-direction:column;
            width:64%;
            min-height:180px;
            box-sizing:border-box;

            border-left:4px solid #000;
            padding-left: 10px;
          }
          .right h2 {
            font-size:28px;                /* título más grande */
            text-align:center;
          }
          .right p {
            font-size:16px;                /* texto más grande */
            line-height:1.45;
            margin:0 0 10px 0;
          }
          .bodyText{ padding-right:10px; }
          .footerText {padding-top:20px }
          .documento{ letter-spacing:.2px; margin:0;}

          .muni {
            position:absolute;
            right:25px;                    /* esquina inferior derecha */
            bottom:35px;
            width:100px;                   /* más grande */
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="left">
            <img src="${letrasEmetra}" class="logo" />
            <img src="${qrDataUrl}" class="qr" />
          </div>

          <div class="divider"></div>

          <div class="right">
            <div class="bodyText">
              <h2>SOLVENCIA</h2>
              <p>
                El vehículo con placa ${tipoPlaca} - ${placa} se encuentra solvente a la fecha
                de su impresión ${fechaRecibo}, la presente solvencia fue emitida con
                el documento:
              </p>
            </div>
            <div class="footerText">
              <p class="documento">E/E - ${numeroRecibo}</p>              
            </div>        
            <img src="${muniLogo}" class="muni" />
          </div>
        </div>
      </body>
    </html>
  `

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdfBuffer = await page.pdf({
    width: '215mm',
    height: '80mm',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  })

  await browser.close()

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="solvencia_${placa}.pdf"`,
    },
  })
}
