import { NextResponse, type NextRequest } from "next/server";
import { readCasilleroAuthTokenFromCookies } from "@/lib/casillero/session";
import type {
  CasilleroObligation,
  CasilleroObligationDetail,
  CasilleroObligationList,
  CasilleroVehicle,
  CasilleroVehicleDetail,
  CasilleroVehicleList,
} from "@/lib/casillero/types";

/**
 * TODO [CASILLERO-BACKEND]: simulación de Cobros mientras no haya API. true = las rutas
 * del BFF de vehículos y obligaciones responden con datos de prueba sin llamar al
 * backend; igual exigen la cookie de sesión (401 sin ella). Debe quedar en false en lo
 * que se sube.
 *
 * Vehículos simulados (el id es el `vehicleReference` de la lista, no la placa):
 * - "veh-1" (P111BBB): pagables, con recargo, con descuento, con ambos, de tipo
 *   desconocido y dos no pagables (SOURCE_NOT_PAYABLE sin validUntil, y PAID).
 * - "veh-2" (M111BBB): sin obligaciones (listado vacío).
 * - "veh-3" (P222CCC): 23 obligaciones, para probar la paginación por cursor.
 * - cualquier otro id: 404, como un vehículo que no existe o no es del usuario.
 */
export const SIMULAR_COBROS = false;

// La placa ya trae el tipo ("P111BBB") y plateTypeCode es el nombre del tipo, como en la API.
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
  vehiculoSimulado("veh-1", "PARTICULAR", "P111BBB"),
  vehiculoSimulado("veh-2", "MOTOCICLETA", "M111BBB"),
  vehiculoSimulado("veh-3", "PARTICULAR", "P222CCC"),
];

/**
 * Datos del detalle (GET /v1/vehicles/{reference}). veh-3 viene sin marca, modelo, color
 * ni año, para ver la tarjeta cuando faltan.
 */
const datosVehiculoSimulados: Record<string, Partial<CasilleroVehicleDetail>> = {
  "veh-1": { vin: "1HGCM82633A004352", make: "Toyota", model: "Corolla", color: "Blanco", year: 2022 },
  "veh-2": { vin: "JH2SC5900BK000001", make: "Honda", model: "CB 190R", color: "Rojo", year: 2021 },
  "veh-3": { vin: null, make: null, model: null, color: null, year: null },
};

/** Detalle simulado del vehículo; null = no existe o no es del usuario (404). */
export function vehiculoDetalleSimulado(reference: string): CasilleroVehicleDetail | null {
  const vehiculo = vehiculosSimulados.find((v) => v.vehicleReference === reference);
  if (!vehiculo) return null;
  return {
    vehicleReference: vehiculo.vehicleReference,
    plateNumber: vehiculo.plateNumber,
    plateCountry: vehiculo.plateCountry,
    plateTypeCode: vehiculo.plateTypeCode,
    foreignPlate: vehiculo.foreignPlate,
    ...datosVehiculoSimulados[reference],
    association: {
      status: vehiculo.associationStatus,
      accessType: vehiculo.accessType,
      validFrom: vehiculo.associatedAt,
      validUntil: null,
    },
    ownership: { type: vehiculo.ownershipType, validFrom: vehiculo.associatedAt, validUntil: null },
  };
}

const LIMITE_POR_DEFECTO = 20;

const fecha = (dias: number) =>
  new Date(Date.UTC(2026, 9, 30, 11, 37) + dias * 24 * 60 * 60 * 1000).toISOString();

/**
 * Misma forma que la respuesta real del Swagger. Los códigos de `unavailableReason` son los
 * reales (Daniel, 2026-11-11). chargeType y los estados son texto libre sin catálogo: solo
 * "REMISION" y "ACTIVA" se han visto en la API; "CONVENIO_PAGO", "TASA_SOLVENCIA" y
 * "PAGADA" son inventados para probar tipos desconocidos. Serie y número salen del id
 * (obl-1001 → N4561001).
 */
const obligacionSimuladaBase = (
  vehicleReference: string,
  id: string,
  concept: string,
  montos: { base: string; recargo?: string; descuento?: string; total: string },
  extra: Partial<CasilleroObligation> = {}
): CasilleroObligation => ({
  id,
  vehicleReference,
  concept,
  chargeType: "REMISION",
  sourceReference: `1:N:456${id.replace(/\D/g, "")}`,
  series: "N",
  number: `456${id.replace(/\D/g, "")}`,
  saldo: montos.total,
  referenceStatus: "ACTIVA",
  sourceStatus: "ACTIVA",
  currency: "GTQ",
  baseAmount: montos.base,
  surcharge: montos.recargo ?? "0",
  discount: montos.descuento ?? "0",
  totalAmount: montos.total,
  issuedAt: fecha(-12),
  consultedAt: fecha(0),
  validUntil: fecha(7),
  payable: true,
  unavailableReason: null,
  ...extra,
});

const obligacionesPorVehiculo: Record<string, CasilleroObligation[]> = {
  // Casos variados. Los ids obl-1002 a obl-1004 los usa también la simulación de órdenes.
  "veh-1": [
    obligacionSimuladaBase("veh-1", "obl-1001", "Remisión de tránsito", { base: "500", total: "500" }),
    obligacionSimuladaBase(
      "veh-1", "obl-1002", "Remisión de tránsito",
      { base: "300", recargo: "45.50", total: "345.50" },
      { issuedAt: fecha(-60) }
    ),
    obligacionSimuladaBase(
      "veh-1", "obl-1003", "Remisión de tránsito",
      { base: "250", descuento: "62.50", total: "187.50" }
    ),
    obligacionSimuladaBase(
      "veh-1", "obl-1004", "Convenio de pago, cuota 2 de 4",
      { base: "150", total: "150" },
      { chargeType: "CONVENIO_PAGO" }
    ),
    obligacionSimuladaBase(
      "veh-1", "obl-1005", "Tasa por trámite de solvencia",
      { base: "75", total: "75" },
      {
        chargeType: "TASA_SOLVENCIA",
        payable: false,
        unavailableReason: "SOURCE_NOT_PAYABLE",
        validUntil: null,
      }
    ),
    obligacionSimuladaBase(
      "veh-1", "obl-1006", "Remisión de tránsito",
      { base: "200", total: "200" },
      {
        referenceStatus: "PAGADA",
        sourceStatus: "PAGADA",
        issuedAt: fecha(-90),
        payable: false,
        unavailableReason: "PAID",
      }
    ),
    // Base, recargo y descuento a la vez (el desglose ocupa más de una línea).
    obligacionSimuladaBase(
      "veh-1", "obl-1007", "Remisión de tránsito",
      { base: "1250", recargo: "187.50", descuento: "312.50", total: "1125" }
    ),
  ],
  "veh-2": [],
  "veh-3": Array.from({ length: 23 }, (_, i) =>
    obligacionSimuladaBase("veh-3", `obl-${3001 + i}`, "Remisión de tránsito", { base: "100", total: "100" })
  ),
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

/** 400 simulado: parámetros de paginación inválidos. */
export function solicitudInvalidaSimulada(): NextResponse {
  return NextResponse.json({ error: "Solicitud inválida", code: "BAD_REQUEST" }, { status: 400 });
}

/** Paginación por cursor; en la simulación el cursor es la posición. null = parámetros inválidos. */
function paginar<T>(items: T[], params: URLSearchParams): { items: T[]; nextCursor: string | null } | null {
  const limitParam = params.get("limit");
  const cursorParam = params.get("cursor");
  const limit = limitParam ? Number(limitParam) : LIMITE_POR_DEFECTO;
  const inicio = cursorParam ? Number(cursorParam) : 0;
  if (!Number.isInteger(limit) || limit < 1) return null;
  if (!Number.isInteger(inicio) || inicio < 0) return null;

  const fin = inicio + limit;
  return {
    items: items.slice(inicio, fin),
    nextCursor: fin < items.length ? String(fin) : null,
  };
}

/**
 * Mismos parámetros que GET /v1/vehicles: filtros opcionales por país y tipo de placa,
 * y paginación por cursor. null = 400.
 */
export function vehiculosDelUsuarioSimulados(params: URLSearchParams): CasilleroVehicleList | null {
  const pais = params.get("plateCountry");
  const tipo = params.get("plateTypeCode");
  const filtrados = vehiculosSimulados.filter(
    (vehiculo) =>
      (!pais || vehiculo.plateCountry === pais) && (!tipo || vehiculo.plateTypeCode === tipo)
  );
  return paginar(filtrados, params);
}

/**
 * Mismos parámetros que GET /v1/vehicles/{id}/obligations (`limit` y `cursor`).
 * null = vehículo no encontrado (404); "invalido" = parámetros incorrectos (400).
 */
export function obligacionesSimuladas(
  vehicleId: string,
  params: URLSearchParams
): CasilleroObligationList | "invalido" | null {
  const items = obligacionesPorVehiculo[vehicleId];
  if (!items) return null;
  const pagina = paginar(items, params);
  return pagina ? { ...pagina, items: pagina.items.map(conVigenciaActual) } : "invalido";
}

const SEGUNDOS_VIGENCIA_CORTA = 45;
const DIAS_VIGENCIA = 7;

/**
 * La vigencia del monto se calcula al responder, como haría backend: obl-1001 vence a
 * los 45 s (para ver que la pantalla vuelve a consultar sola) y las demás a los 7 días.
 * Las que tienen validUntil null (sin vencimiento) se dejan igual.
 */
function conVigenciaActual(obligacion: CasilleroObligation): CasilleroObligation {
  if (obligacion.validUntil === null) return obligacion;
  const ahora = Date.now();
  const vigenciaMs =
    obligacion.id === "obl-1001" ? SEGUNDOS_VIGENCIA_CORTA * 1000 : DIAS_VIGENCIA * 24 * 60 * 60 * 1000;
  return {
    ...obligacion,
    consultedAt: new Date(ahora).toISOString(),
    validUntil: new Date(ahora + vigenciaMs).toISOString(),
  };
}

export function obligacionSimulada(id: string): CasilleroObligationDetail | null {
  for (const items of Object.values(obligacionesPorVehiculo)) {
    const obligacion = items.find((item) => item.id === id);
    if (obligacion) return conVigenciaActual(obligacion);
  }
  return null;
}
