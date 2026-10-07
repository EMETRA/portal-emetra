export type Remision = { ciudad: number; serie: string; numero: string; emitidaEn?: string };
export type Pago = { estado: "PREPARANDO" } | { estado: "DISPONIBLE"; urlPago: string };
export type ConsultaAceptacion =
  | { estadoEnlace: "VIGENTE"; estadoCaso: string; puedeAceptar: boolean; versionTexto: string;
      denuncia: { idDenuncia: string; codigoCaso: string; estado: string; usoPlaca?: string; placa?: string; regla?: number; capturadaEn?: string | null } }
  | { estadoEnlace: "USADO"; estadoCaso: string; remision: Remision | null; pago: Pago | null }
  | { estadoEnlace: "VENCIDO" | "REVOCADO"; estadoCaso: string };
export type Aceptacion = { idDenuncia: string; remision: Remision; reutilizada: boolean; pago: Pago };
export type ConsultaPlantilla = { caso: { id: string; codigo: string; estado: string; usoPlaca?: string; placa?: string; regla?: string; descripcionHecho?: string | null } };

export class ViviApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly codigo?: string) { super(message); this.name = "ViviApiError"; }
}
async function comprobar(response: Response): Promise<void> {
  if (response.ok) return;
  const body = await response.json().catch(() => ({}));
  const message = Array.isArray(body.message) ? body.message.filter((m: unknown) => typeof m === 'string').join(' ') : body.message;
  throw new ViviApiError(typeof message === 'string' && message ? message : "No se pudo completar la solicitud. Intenta de nuevo.", response.status, body.codigo);
}
async function post<T>(path: string, body: object, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`/api/vivi/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store', signal });
  await comprobar(response);
  return response.json() as Promise<T>;
}
export const consultarAceptacion = (token: string, signal?: AbortSignal) => post<ConsultaAceptacion>('aceptaciones/consulta', { token }, signal);
export const aceptarDenuncia = (token: string, requestId: string) => post<Aceptacion>('aceptaciones', { token, requestId });
export const consultarPlantilla = (token: string, signal?: AbortSignal) => post<ConsultaPlantilla>('defensas/consulta', { token }, signal);
export async function descargarPlantilla(token: string): Promise<Blob> {
  const response = await fetch('/api/vivi/defensas/plantilla', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/pdf' }, body: JSON.stringify({ token }), cache: 'no-store' });
  await comprobar(response);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!response.headers.get('content-type')?.toLowerCase().includes('application/pdf') || new TextDecoder().decode(bytes.slice(0, 5)) !== '%PDF-') {
    throw new ViviApiError('El servicio no devolvió un PDF válido. Intenta de nuevo.', 502);
  }
  return new Blob([bytes], { type: 'application/pdf' });
}
/** Identificador de solicitud, también disponible al probar QA por HTTP. No es un token de acceso. */
export function crearRequestId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return `web-${Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')}`;
}
export function urlPagoSeguro(pago: Pago | null): string | null {
  if (pago?.estado !== 'DISPONIBLE') return null;
  try { const url = new URL(pago.urlPago); return url.protocol === 'https:' ? url.toString() : null; } catch { return null; }
}
