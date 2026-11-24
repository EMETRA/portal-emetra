import { NextRequest } from "next/server";
import { casilleroPathWithRequestQuery, proxyCasilleroRequest } from "@/lib/casillero/proxy";

/** Recibos 7B1 del usuario y contexto actualmente autenticados. */
export async function GET(request: NextRequest) {
  return proxyCasilleroRequest(request, {
    path: casilleroPathWithRequestQuery(request, "/v1/payment-orders/history"),
    forwardBody: false,
    requireAuth: true,
  });
}
