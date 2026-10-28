import { NextResponse, type NextRequest } from "next/server";
import { readCasilleroAuthTokenFromCookies } from "@/lib/casillero/session";
import type {
  CasilleroObligation,
  CasilleroObligationDetail,
  CasilleroObligationList,
  CasilleroVehicle,
  CasilleroVehicleList,
} from "@/lib/casillero/types";

/**
 * TODO [CASILLERO-BACKEND]: simulación de Cobros mientras no haya API. true = las rutas
 * del BFF de vehículos y obligaciones responden con datos de prueba sin llamar al
 * backend; igual exigen la cookie de sesión (401 sin ella). Debe quedar en false en lo
 * que se sube.
 *
 * Vehículos simulados (el id es el `vehicleReference` de la lista, no la placa):
 * - "veh-1" (P111BBB): obligaciones en todos los estados, una con pago parcial.
 * - "veh-2" (M111BBB): sin obligaciones (listado vacío).
 * - cualquier otro id: 404, como un vehículo que no existe o no es del usuario.
 */
export const SIMULAR_COBROS = false;

const vehiculoSimulado = (
  vehicleReference: string,
  plateTypeCode: string,
  plateNumber: string
): CasilleroVehicle => ({
  vehicleReference,
  plateNumber,
  plateCountry: "GT",
  plateTypeCode,
  foreignPlate: false,
  associationStatus: "ACTIVE",
  accessType: "OWNER",
  ownershipType: "SELF_DECLARED",
  associatedAt: "2026-10-09T15:51:57.598Z",
});

const vehiculosSimulados: CasilleroVehicle[] = [
  vehiculoSimulado("veh-1", "P", "111BBB"),
  vehiculoSimulado("veh-2", "M", "111BBB"),
];

const LIMITE_VEHICULOS_POR_DEFECTO = 20;

const vence = (dias: number) =>
  new Date(Date.UTC(2026, 9, 28, 12, 0) + dias * 24 * 60 * 60 * 1000).toISOString();

const obligacionesPorVehiculo: Record<string, CasilleroObligation[]> = {
  "veh-1": [
    { id: "obl-1001", concept: "Exceso de velocidad", amount: 500, balance: 500, status: "PENDIENTE", dueDate: vence(20), category: "transito" },
    { id: "obl-1002", concept: "Estacionado en línea roja", amount: 300, balance: 300, status: "VENCIDA", dueDate: vence(-10), category: "transito" },
    { id: "obl-1003", concept: "Retiro de cepo", amount: 250, balance: 250, status: "PENDIENTE", dueDate: vence(5), category: "cepo" },
    { id: "obl-1004", concept: "Convenio de pago, cuota 2 de 4", amount: 400, balance: 150, status: "PENDIENTE", dueDate: vence(12), category: "convenio" },
    { id: "obl-1005", concept: "Tasa por trámite de solvencia", amount: 75, balance: 75, status: "EN_PROCESO", dueDate: vence(3), category: "tasas" },
    { id: "obl-1006", concept: "Falta de documentos del vehículo", amount: 200, balance: 0, status: "PAGADA", dueDate: vence(-30), category: "administrativo" },
  ],
  "veh-2": [],
};

/** En simulación, sin cookie de sesión se responde igual que el proxy (401). */
export function sinSesionSimulada(req: NextRequest): NextResponse | null {
  if (readCasilleroAuthTokenFromCookies(req.cookies)) return null;
  return NextResponse.json({ error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
}

/** 404 simulado: vehículo u obligación inexistente o que no es del usuario. */
export function noEncontradoSimulado(): NextResponse {
  return NextResponse.json({ error: "No encontrado", code: "NOT_FOUND" }, { status: 404 });
}

/**
 * Mismos parámetros que GET /v1/vehicles: filtros opcionales por país y tipo de placa,
 * y paginación por cursor (en la simulación, el cursor es la posición). null = 400.
 */
export function vehiculosDelUsuarioSimulados(params: URLSearchParams): CasilleroVehicleList | null {
  const limitParam = params.get("limit");
  const cursorParam = params.get("cursor");
  const limit = limitParam ? Number(limitParam) : LIMITE_VEHICULOS_POR_DEFECTO;
  const inicio = cursorParam ? Number(cursorParam) : 0;
  if (!Number.isInteger(limit) || limit < 1) return null;
  if (!Number.isInteger(inicio) || inicio < 0) return null;

  const pais = params.get("plateCountry");
  const tipo = params.get("plateTypeCode");
  const filtrados = vehiculosSimulados.filter(
    (vehiculo) =>
      (!pais || vehiculo.plateCountry === pais) && (!tipo || vehiculo.plateTypeCode === tipo)
  );
  const fin = inicio + limit;
  return {
    items: filtrados.slice(inicio, fin),
    nextCursor: fin < filtrados.length ? String(fin) : null,
  };
}

export function obligacionesSimuladas(vehicleId: string): CasilleroObligationList | null {
  const items = obligacionesPorVehiculo[vehicleId];
  return items ? { items } : null;
}

export function obligacionSimulada(id: string): CasilleroObligationDetail | null {
  for (const items of Object.values(obligacionesPorVehiculo)) {
    const obligacion = items.find((item) => item.id === id);
    if (obligacion) return obligacion;
  }
  return null;
}
