import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

/** Consulta los factores y comienza el enrolamiento TOTP del usuario autenticado. */
export async function GET(request: NextRequest) {
  return proxyCasilleroRequest(request, {
    path: "/v1/me/authentication-factors",
  });
}

export async function POST(request: NextRequest) {
  return proxyCasilleroRequest(request, {
    path: "/v1/me/authentication-factors/totp",
  });
}
