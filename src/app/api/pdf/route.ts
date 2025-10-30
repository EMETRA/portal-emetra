// src/app/api/pdf/route.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";

// A4 en puntos (pt)
const A4 = { w: 595.28, h: 841.89 };

// Helper para envolver párrafos
function wrapText(
  text: string,
  maxWidth: number,
  font: any,
  fontSize: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    const width = font.widthOfTextAtSize(test, fontSize);
    if (width <= maxWidth) line = test;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { origin } = new URL(req.url);

    // ===== Datos (con defaults) =====
    const data = {
      notification_no: body.notification_no ?? "2300824",
      fecha_notificacion: body.fecha_notificacion ?? "30 de octubre de 2025",
      hora_notificacion: body.hora_notificacion ?? "11:02",
      placa: body.plate ?? "C-869BQS",
      modelo: body.modelo ?? "1995",
      marca: body.marca ?? "FORD",
      n_infraccion: body.n_infraccion ?? "13200086",
      articulo: body.articulo ?? "183-01",
      fecha_infraccion: body.fecha_infraccion ?? "24-05-2025",
      monto: body.monto ?? "Q434.85",
      lugar: body.lugar ?? "AVENIDA 39 CALLE Zona 3",
      hora_hecho: body.hora_hecho ?? "11:07",
      detalle_remision_url: body.detalle_remision_url ?? "https://ejemplo/remision/ABC",
      shield_url: body.shield_url ?? `${origin}/images/escudo.png`,
      firma_url: body.firma_url ?? `${origin}/images/firma.png`,
      firmante_nombre: body.firmante_nombre ?? "Carlos Antonio Lemus Guerra",
      firmante_cargo: body.firmante_cargo ?? "Intendente",
    };

    // ===== Crear PDF =====
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([A4.w, A4.h]);

    const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Márgenes
    const M = {
      top: 24 * 2.8346,
      right: 18 * 2.8346,
      bottom: 24 * 2.8346,
      left: 18 * 2.8346,
    };
    let cursorY = A4.h - M.top;

    // ===== Encabezado =====
    const smallSize = 11;
    page.drawText(`Notificación No. ${data.notification_no}`, {
      x: M.left,
      y: cursorY,
      size: smallSize,
      font: fontBold,
      color: rgb(0.07, 0.07, 0.07),
    });

    // Escudo (si hay)
    try {
      const resp = await fetch(data.shield_url);
      if (resp.ok) {
        const bytes = new Uint8Array(await resp.arrayBuffer());
        const img = /\.(jpe?g)$/i.test(data.shield_url)
          ? await pdfDoc.embedJpg(bytes)
          : await pdfDoc.embedPng(bytes);
        const shieldW = 100;
        const scale = shieldW / img.width;
        const shieldH = img.height * scale;
        page.drawImage(img, {
          x: A4.w - M.right - shieldW,
          y: cursorY - shieldH + 8,
          width: shieldW,
          height: shieldH,
        });
      }
    } catch {
      /* ignora fallos de imagen */
    }

    // Títulos centrados
    const title1 = "NOTIFICACIÓN ELECTRÓNICA";
    const title2 = "POLICÍA MUNICIPAL DE TRÁNSITO";
    const title3 = "CIUDAD DE GUATEMALA";
    const title1Size = 15,
      title2Size = 12.5,
      title3Size = 12.5;

    const drawCentered = (text: string, size: number, font: any, y: number) => {
      const width = font.widthOfTextAtSize(text, size);
      const x = (A4.w - width) / 2;
      page.drawText(text, { x, y, size, font, color: rgb(0.07, 0.07, 0.07) });
    };

    cursorY -= 20;
    drawCentered(title1, title1Size, fontBold, cursorY);
    cursorY -= 18;
    drawCentered(title2, title2Size, fontBold, cursorY);
    cursorY -= 16;
    drawCentered(title3, title3Size, fontBold, cursorY);
    cursorY -= 22;

    // ===== Párrafos =====
    const bodySize = 12.5;
    const maxTextWidth = A4.w - M.left - M.right;

    const par1 =
      `En el Municipio de Guatemala, del Departamento de Guatemala, el día ${data.fecha_notificacion}, a las ` +
      `${data.hora_notificacion}, se notifica al propietario del vehículo con número de placa ${data.placa}. ` +
      `Modelo: ${data.modelo} / Marca: ${data.marca}. Infracción cometida en tránsito N-${data.n_infraccion}, ` +
      `Artículo ${data.articulo}. Fecha de la infracción: ${data.fecha_infraccion}. Monto ${data.monto}. ` +
      `Lugar ${data.lugar}, Hora ${data.hora_hecho}.`;

    const par2 =
      `Por medio de la presente cédula de notificación que contiene el estado de cuenta de infracciones y que se ha ` +
      `entregado al propietario del vehículo en el presente correo. Se adjuntan documentos que justifican la imposición ` +
      `de la multa. Consulte aquí: ${data.detalle_remision_url}.`;

    const par3 =
      `Usted tiene el plazo establecido en la Ley de Tránsito para efectuar el pago correspondiente en cajas municipales, ` +
      `vía electrónica, bancos del sistema y sistema POS, según la reforma a la Ley de Tránsito contenida en el Decreto ` +
      `33-2024, emitido por el Congreso de la República de Guatemala.`;

    const par4 =
      `Procedimiento para la impugnación: los establecidos en el artículo 186 del Reglamento de Tránsito Acuerdo ` +
      `Gubernativo 273-98, y Reforma del artículo 31 de la Ley de Tránsito. Plazo para presentar recurso: no mayor de ` +
      `quince (15) días posteriores a la fecha de la presente notificación.`;

    const par5 = `Notificación electrónica, de conformidad con el Acuerdo COM-32-2022 y sus reformas.`;

    const drawParagraph = (text: string) => {
      const lines = wrapText(text, maxTextWidth, fontRegular, bodySize);
      for (const line of lines) {
        page.drawText(line, { x: M.left, y: cursorY, size: bodySize, font: fontRegular });
        cursorY -= 15;
      }
      cursorY -= 6;
    };

    [par1, par2, par3, par4, par5].forEach(drawParagraph);

    // ===== Firma =====
    cursorY -= 10;
    try {
      const r2 = await fetch(data.firma_url);
      if (r2.ok) {
        const bytes = new Uint8Array(await r2.arrayBuffer());
        const img = /\.(jpe?g)$/i.test(data.firma_url)
          ? await pdfDoc.embedJpg(bytes)
          : await pdfDoc.embedPng(bytes);
        const signW = 200;
        const scale = signW / img.width;
        const signH = img.height * scale;
        const x = (A4.w - signW) / 2;
        page.drawImage(img, { x, y: cursorY - signH, width: signW, height: signH });
        cursorY -= signH + 4;
      }
    } catch {
      /* ignora */
    }

    const nameWidth = fontBold.widthOfTextAtSize(data.firmante_nombre, bodySize);
    page.drawText(data.firmante_nombre, {
      x: (A4.w - nameWidth) / 2,
      y: cursorY,
      size: bodySize,
      font: fontBold,
    });
    cursorY -= 16;

    const roleWidth = fontRegular.widthOfTextAtSize(data.firmante_cargo, bodySize);
    page.drawText(data.firmante_cargo, {
      x: (A4.w - roleWidth) / 2,
      y: cursorY,
      size: bodySize,
      font: fontRegular,
    });
    cursorY -= 24;

    // ===== Footer =====
    const footerLeftLine1 = "Municipalidad de Guatemala";
    const footerLeftLine2 = "21 calle 6-77, zona 1";
    page.drawText(footerLeftLine1, {
      x: M.left,
      y: M.bottom + 28,
      size: bodySize,
      font: fontBold,
      color: rgb(0.16, 0.16, 0.54),
    });
    page.drawText(footerLeftLine2, {
      x: M.left,
      y: M.bottom + 12,
      size: bodySize,
      font: fontRegular,
      color: rgb(0.16, 0.16, 0.54),
    });

    const sloganLine1 = "Juntos transformamos";
    const sloganLine2 = "la ciudad para vivir mejor";
    const slogan1Width = fontBold.widthOfTextAtSize(sloganLine1, bodySize);
    const slogan2Width = fontRegular.widthOfTextAtSize(sloganLine2, bodySize);
    page.drawText(sloganLine1, {
      x: A4.w - M.right - slogan1Width,
      y: M.bottom + 28,
      size: bodySize,
      font: fontBold,
      color: rgb(0.4, 0.4, 0.4),
    });
    page.drawText(sloganLine2, {
      x: A4.w - M.right - slogan2Width,
      y: M.bottom + 12,
      size: bodySize,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });

    // ===== Guardar y responder =====
    const pdfBytes: Uint8Array = await pdfDoc.save(); // Uint8Array

    // ArrayBuffer "limpio" para satisfacer BodyInit
    const cleanArrayBuffer: ArrayBuffer = pdfBytes.slice().buffer;


    return new Response(cleanArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=notificacion.pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "No se pudo generar el PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
