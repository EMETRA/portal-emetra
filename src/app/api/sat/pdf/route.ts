import puppeteer, { type Browser } from "puppeteer";

export const runtime = "nodejs";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
type Body = {
  notification_no?: string;
  fecha_notificacion?: string;
  hora_notificacion?: string;
  plate?: string;
  modelo?: string;
  marca?: string;
  n_infraccion?: string;
  articulo?: string;
  fecha_infraccion?: string;
  monto?: string;
  lugar?: string;
  hora_hecho?: string;
  detalle_remision_url?: string;
  shield_url?: string;
  firma_url?: string;
  firmante_nombre?: string;
  firmante_cargo?: string;
  footer_left_url?: string;
  footer_right_url?: string;
  foto_url?: string;
};

type Remision = {
  PLACA: string;
  MODELO: number;
  MARCA: string;
  ARTICULOS: string;
  MONTO: number;
  FECHA: string;
  LUGAR: string;
  SERIE_REMISION: string;
  HORA: string;
  id_notificacion: number;
};

type RemisionesResponse = {
  success: boolean;
  placa: string;
  remisiones: Remision[];
  recursos: Record<string, unknown>;

};

function htmlTemplate(origin: string, data: Body) {
  return `
      <div class="wrap">
        <!-- Encabezado -->
        <div class="header">
          <div class="small">Notificación No. ${data.notification_no}</div>
          <img class="escudo" src="${data.shield_url}" alt="Escudo" />
        </div>

        <div class="title">
          <h1>NOTIFICACIÓN ELECTRÓNICA</h1><br/>
          <h2>POLICÍA MUNICIPAL DE TRÁNSITO</h2>
          <h3>CIUDAD DE GUATEMALA</h3>
        </div>

        <!-- Párrafos -->
        <p>
          En el Municipio de Guatemala, del Departamento de Guatemala, el día ${data.fecha_notificacion}, a las
          ${data.hora_notificacion}, se notifica al propietario del vehículo con número de placa ${data.plate}.
          Modelo: ${data.modelo} / Marca: ${data.marca}. Infracción cometida en tránsito ${data.n_infraccion},
          Artículo ${data.articulo}. Fecha de la infracción: ${data.fecha_infraccion}.. Monto ${data.monto}.
          Lugar ${data.lugar}, Hora ${data.hora_hecho}.
        </p>

        <p>
          Por medio de la presente cédula de notificación que contiene el estado de cuenta de infracciones y que se ha
          entregado al propietario del vehículo en el presente correo. Se adjuntan documentos que justifican la imposición
          de la multa en el siguiente link <a href=${data.detalle_remision_url}>ver detalle remision</a> .
        </p>

        ${
          data.foto_url
            ? `
              <div class="foto-remision">
                <img src="https://emetra.muniguate.com/fotos/${data.foto_url}" alt="Foto de remisión" onerror="this.hidden=true" />
              </div>
            `
            : ""
        }

        <p>
          Usted tiene el plazo establecido en la Ley de Tránsito para efectuar el pago correspondiente en cajas municipales,
          vía electrónica, bancos del sistema y sistema POS, según la reforma a la Ley de Tránsito contenida en el Decreto
          33-2024, emitido por el Congreso de la República de Guatemala.
        </p>
        ${
          data.foto_url
            ? `
              <div class="page-safe"></div>
            `
              : ""
        }
        <p>
          Procedimiento para la impugnación: los establecidos en el artículo 186 del Reglamento de Tránsito Acuerdo
          Gubernativo 273-98, y Reforma del artículo 31 de la Ley de Tránsito. Plazo para presentar recurso: no mayor de
          quince (15) días posteriores a la fecha de la presente notificación.
        </p>

        <p>Notificación electrónica, de conformidad con el Acuerdo COM-32-2022 y sus reformas.</p>

        <!-- Firma -->
        <div class="firma">
          <img src="${data.firma_url}" alt="Firma" />
          <div class="firmante">${data.firmante_nombre}</div>
          <div class="cargo">${data.firmante_cargo}</div>
        </div>

      </div>
  `;
}
type Gender = "m" | "f";

function numeroEnLetras(n: number, gender: Gender = "m"): string {
  if (!Number.isFinite(n) || n < 0 || n > 999999) return String(n);

  const u = ["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"];
  const e = ["","once","doce","trece","catorce","quince","dieciséis","diecisiete","dieciocho","diecinueve"];
  const d = ["","diez","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"];
  const c = ["","ciento","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];

  const ajustaUno = (txt: string): string => {
    if (gender === "f") {
      return txt.replace(/\buno\b$/, "una")
                .replace(/veintiuno$/, "veintiuna")
                .replace(/ y uno\b$/, " y una");
    }
    return txt.replace(/\buno\b$/, "un")
              .replace(/veintiuno$/, "veintiún")
              .replace(/ y uno\b$/, " y un");
  };

  const tres = (x: number): string => {
    if (x === 0) return "";
    if (x === 100) return "cien";
    const centenas = Math.floor(x / 100);
    const decenasUnidades = x % 100;

    let res = "";
    if (centenas) res += c[centenas] + (decenasUnidades ? " " : "");

    if (decenasUnidades === 0) return res.trim();
    if (decenasUnidades < 10) return (res + u[decenasUnidades]).trim();
    if (decenasUnidades > 10 && decenasUnidades < 20) return (res + e[decenasUnidades - 10]).trim();

    const dec = Math.floor(decenasUnidades / 10);
    const uni = decenasUnidades % 10;

    if (dec === 1 && uni === 0) return (res + "diez").trim();
    if (dec === 2 && uni > 0) return (res + "veinti" + (uni === 1 ? "uno" : u[uni])).trim();

    return (res + d[dec] + (uni ? " y " + (uni === 1 ? "uno" : u[uni]) : "")).trim();
  };

  const miles = Math.floor(n / 1000);
  const resto = n % 1000;

  let out = "";
  if (miles) out += (miles === 1 ? "mil" : tres(miles) + " mil") + (resto ? " " : "");
  out += tres(resto);

  return ajustaUno(out.trim());
}

function fechaALetras(fecha: string): string {
  // acepta: "DD de <mes> de YYYY" | "YYYY-MM-DD" | "DD-MM-YYYY" | "DD/MM/YYYY"
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

  const reEsp = /^(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})$/i;
  const m1 = fecha.match(reEsp);
  let d: number|undefined, m: number|undefined, y: number|undefined;

  if (m1) {
    d = parseInt(m1[1],10);
    m = meses.findIndex(mm => mm === m1[2].toLowerCase()) + 1;
    y = parseInt(m1[3],10);
  } else {
    const reISO = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/;
    const reLat = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/;
    if (reISO.test(fecha)) {
      const [,yy,mm,dd] = fecha.match(reISO)!;
      y = +yy; m = +mm; d = +dd;
    } else if (reLat.test(fecha)) {
      const [,dd,mm,yy] = fecha.match(reLat)!;
      d = +dd; m = +mm; y = +yy;
    }
  }

  if (!d || !m || !y || m < 1 || m > 12) return fecha; // fallback

  const diaTxt = numeroEnLetras(d, "m"); // "tres"
  const anioTxt = anioALetras(y);        // "dos mil veinticinco"
  return `${diaTxt} de ${meses[m-1]} de ${anioTxt}`;
}

function anioALetras(y: number): string {
  // 0..9999
  return numeroEnLetras(y, "m");
}

function horaALetras(hhmm: string): string {
  // "HH:MM" 24h → "diez horas con quince minutos"
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!m) return hhmm;

  const h = parseInt(m[1],10);
  const min = parseInt(m[2],10);

  const horaTxt = numeroEnLetras(h === 1 ? 1 : h, "f"); // "una" hora, "diez" horas
  const minuTxt = numeroEnLetras(min === 1 ? 1 : min, "m");

  const palabraHora = h === 1 ? "hora" : "horas";
  const palabraMin = min === 1 ? "minuto" : "minutos";

  if (min === 0) return `${horaTxt} ${palabraHora} en punto`;
  return `${horaTxt} ${palabraHora} con ${minuTxt} ${palabraMin}`;
}

async function getFotoRemision(
  serie: string,
  remision: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${baseUrl}/notificado/foto/${encodeURIComponent(serie)}/${encodeURIComponent(remision)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json?.success ? json.data?.ruta_completa ?? null : null;
  } catch {
    return null;
  }
}

const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export async function POST(req: Request) {
  let browser: Browser | null = null;

  try {
    const body = (await req.json().catch(() => ({}))) as RemisionesResponse;
    const { origin } = new URL(req.url);

    const now = new Date();
    const fechaRaw = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`; // 13-11-2025
    const horaRaw = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;


    const dataList: Required<Body>[] = [];
    let i = 0;
    for (const remision of body.remisiones) {
      const numeroSerie = remision.SERIE_REMISION.replace(/[^0-9]/g, "");
      const serie = remision.SERIE_REMISION.split('-')[0].trim();
      const fotoUrl = await getFotoRemision(
        serie,
        remision.id_notificacion.toString()
      );
      dataList.push({
        notification_no: remision.id_notificacion.toString(),
        fecha_notificacion: fechaALetras(fechaRaw),
        hora_notificacion: horaALetras(horaRaw),

        plate: s(remision.PLACA),
        modelo: s(remision.MODELO),
        marca: s(remision.MARCA),

        n_infraccion: remision.SERIE_REMISION,
        articulo: remision.ARTICULOS,
        fecha_infraccion: remision.FECHA,
        monto: s(remision.MONTO),

        lugar: s(remision.LUGAR),
        hora_hecho: s(remision.HORA),

        detalle_remision_url: `https://consulta.muniguate.com/emetra/detalle.php?s=${serie}&r=${numeroSerie}&id=1`,
        shield_url: `${origin}/images/EscudoMuni.png`,
        firma_url: `${origin}/images/firma.png`,
        firmante_nombre: "Carlos Antonio Lemus Guerra",
        firmante_cargo: "Intendente",
        footer_left_url: `${origin}/images/footer_left.png`,
        footer_right_url: `${origin}/images/footer_right.png`,
        foto_url: fotoUrl || ``,
      });
    }

    const pagesHtml = dataList.map((data) => htmlTemplate(origin,data)).join("");

    const fullHtml = `<!DOCTYPE html>
      <html>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Notificación</title>
        <style>
          body { font-family: "Arial"; color: #111; font-size: 12pt; line-height: 1.5; }
          .wrap { width: 100%; box-sizing: border-box; page-break-before: always; break-before: page; }
          .wrap:first-of-type { page-break-before: auto; break-before: auto;}
          .header{ display:flex; align-items:center; justify-content:space-between; height: 80px; margin-bottom: 10px; }
          .page-safe{ height: 200px; display:block; }
          .title { text-align: center; margin-top: 12px; margin-bottom: 16px; }
          .title h1 { font-size: 15pt; margin: 0 0 8px 0; font-weight: 700; }
          .title h2, .title h3 { font-size: 12.5pt; margin: 0; font-weight: 700; }
          .small { font-size: 11pt; font-weight: 700; color: #121212; line-height: 1}

          .escudo { width: 60px; height: auto; object-fit: contain; margin: 0; }
          p { text-align: justify; margin: 0 0 10px 0; }
          .firma { text-align: center; margin-top: 18px; }
          .firma img { width: 200px; height: auto; }
          .firmante { font-weight: 700; margin-top: 6px; }
          .cargo { margin-top: 2px; }
          .footer { display: flex; justify-content: space-between; align-items:flex-end; margin-top: 24px; min-height: 48px;  }
          .footer img{ height: 56px; width: auto; object-fit: contain; display: block; }
          .Footer2 {height: 86px !important; width: auto;}
          .foto-remision {margin-top: 22px; margin-bottom: 22px; display: flex; justify-content: center;}
          .foto-remision img { max-width: 90%; max-height: 320px; object-fit: contain; display: block; }
          .global-footer{ position: fixed; left: 8mm; right: 8mm; bottom: 6mm; display:flex; justify-content: space-between; align-items:flex-end; height: 18mm; z-index: 999 ;}
          .global-footer img{ height: 56px; width: auto; object-fit: contain; display: block; }
          .global-footer .Footer2{ height: 86px !important; }
        </style>
        <body>
          <div class="global-footer">
            <img src="${origin}/images/footer_left.png" alt="Footer izquierdo" onerror="this.hidden=true">
            <img src="${origin}/images/footer_right.png" alt="Footer derecho" class="Footer2" onerror="this.hidden=true">
          </div>
          ${pagesHtml}
        </body>
      </html>
    `;

    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"], 
    });
    const page = await browser.newPage();

    // Carga del contenido
    await page.setContent(fullHtml, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"],
    });

    // Generar PDF (A4, márgenes, fondos)
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", right: "8mm", bottom: "8mm", left: "8mm" },
    });

    await page.close();
    await browser.close();
    browser = null;

    const blob = new Blob([pdfBuffer], { type: "application/pdf" });

    return new Response(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="notificacion.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error(e);
    if (browser) {
      try { await browser.close(); } catch {}
    }
    return new Response(JSON.stringify({ error: "No se pudo generar el PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
