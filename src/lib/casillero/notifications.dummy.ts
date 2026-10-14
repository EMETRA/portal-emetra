import { NextResponse, type NextRequest } from "next/server";
import { readCasilleroAuthTokenFromCookies } from "@/lib/casillero/session";
import type {
  CasilleroNotificationDetail,
  CasilleroNotificationItem,
  CasilleroNotificationList,
} from "@/lib/casillero/types";

/**
 * TODO [CASILLERO-BACKEND]: simulación del buzón mientras no existan los endpoints
 * /v1/notifications (los tiene Rudy). true = las rutas del BFF del buzón responden con
 * datos de prueba sin llamar al backend; igual exigen la cookie de sesión (401 sin ella).
 * Debe quedar en false en lo que se sube.
 *
 * Casos: cada cuarta notificación no tiene documento (404 al pedirlo) y un id que no
 * existe responde 404, como propuso backend para no revelar notificaciones ajenas.
 */
export const SIMULAR_BUZON = false;

const TOTAL_SIMULADAS = 45;
const LIMITE_POR_DEFECTO = 20;
const LIMITE_MAXIMO = 100;

const notificacionesSimuladas: CasilleroNotificationDetail[] = Array.from(
  { length: TOTAL_SIMULADAS },
  (_, index) => {
    const numero = TOTAL_SIMULADAS - index;
    const emitida = new Date(Date.UTC(2026, 9, 14, 15, 0) - index * 26 * 60 * 60 * 1000);
    return {
      id: `notif-${numero}`,
      subject: `Notificación simulada ${numero}`,
      summary: `Resumen de la notificación simulada ${numero}.`,
      status: index < 5 ? "NO_LEIDA" : "LEIDA",
      issuedAt: emitida.toISOString(),
      context: "PERSONAL",
      hasDocument: numero % 4 !== 0,
      content:
        `Contenido de la notificación simulada ${numero}. ` +
        "Este texto reemplaza al detalle que enviará el backend.",
    };
  }
);

/** En simulación, sin cookie de sesión se responde igual que el proxy (401). */
export function sinSesionSimulada(req: NextRequest): NextResponse | null {
  if (readCasilleroAuthTokenFromCookies(req.cookies)) return null;
  return NextResponse.json({ error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
}

/** 404 simulado: notificación inexistente, ajena o sin documento. */
export function noEncontradaSimulada(): NextResponse {
  return NextResponse.json({ error: "No encontrado", code: "NOT_FOUND" }, { status: 404 });
}

const sinContenido = (detalle: CasilleroNotificationDetail): CasilleroNotificationItem => ({
  id: detalle.id,
  subject: detalle.subject,
  summary: detalle.summary,
  status: detalle.status,
  issuedAt: detalle.issuedAt,
  context: detalle.context,
  hasDocument: detalle.hasDocument,
});

/**
 * Listado paginado por cursor. El cursor simulado es la posición de inicio; el del
 * backend es opaco y el front solo lo devuelve tal cual. null = cursor inválido.
 */
export function listadoSimulado(
  limitParam: string | null,
  cursorParam: string | null
): CasilleroNotificationList | null {
  const limit = limitParam === null ? LIMITE_POR_DEFECTO : Number(limitParam);
  const inicio = cursorParam === null ? 0 : Number(cursorParam);
  if (!Number.isInteger(limit) || limit < 1 || limit > LIMITE_MAXIMO) return null;
  if (!Number.isInteger(inicio) || inicio < 0 || inicio > TOTAL_SIMULADAS) return null;

  const fin = inicio + limit;
  return {
    items: notificacionesSimuladas.slice(inicio, fin).map(sinContenido),
    nextCursor: fin < TOTAL_SIMULADAS ? String(fin) : null,
  };
}

export function detalleSimulado(id: string): CasilleroNotificationDetail | null {
  return notificacionesSimuladas.find((notificacion) => notificacion.id === id) ?? null;
}

/** PDF mínimo de una página con el asunto de la notificación (texto ASCII). */
export function documentoSimulado(id: string): Uint8Array | null {
  const notificacion = detalleSimulado(id);
  if (!notificacion?.hasDocument) return null;

  const texto = `Documento simulado - ${notificacion.id}`.replace(/[()\\]/g, "");
  const flujo = `BT /F1 18 Tf 72 720 Td (${texto}) Tj ET`;
  const objetos = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${flujo.length} >>\nstream\n${flujo}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const posiciones: number[] = [];
  objetos.forEach((objeto, index) => {
    posiciones.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${objeto}\nendobj\n`;
  });
  const inicioXref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  pdf += posiciones.map((posicion) => `${String(posicion).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF\n`;

  return new TextEncoder().encode(pdf);
}
