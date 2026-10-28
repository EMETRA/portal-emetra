// app/api/casillero/payment-orders/[id]/receipt/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import {
  SIMULAR_COBROS,
  noEncontradoSimulado,
  sinSesionSimulada,
} from "@/lib/casillero/obligations.dummy";
import { comprobanteSimulado } from "@/lib/casillero/paymentOrders.dummy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** El PDF se pide con la sesión cada vez: el navegador no debe guardarlo en caché. */
const SIN_CACHE = "private, no-store";

/**
 * GET /v1/payment-orders/{id}/receipt: comprobante del pago.
 * TODO [CASILLERO-BACKEND]: se asume que responde el PDF en el cuerpo (como el buzón) y
 * que no existe mientras el pago no esté confirmado.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (SIMULAR_COBROS) {
    const sinSesion = sinSesionSimulada(req);
    if (sinSesion) return sinSesion;
    const pdf = comprobanteSimulado(id);
    if (!pdf) return noEncontradoSimulado();
    if (pdf === "no_confirmada") {
      return NextResponse.json({ error: "El pago no está confirmado", code: "CONFLICT" }, { status: 409 });
    }
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="comprobante-${id}.pdf"`,
        "Cache-Control": SIN_CACHE,
      },
    });
  }

  const response = await proxyCasilleroRequest(req, {
    path: `/v1/payment-orders/${encodeURIComponent(id)}/receipt`,
    forwardBody: false,
    requireAuth: true,
  });
  response.headers.set("Cache-Control", SIN_CACHE);
  return response;
}
