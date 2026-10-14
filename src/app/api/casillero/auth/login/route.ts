// app/api/casillero/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import { SIMULAR_AUTH, loginSimulado } from "@/lib/casillero/auth.dummy";

/**
 * POST /v1/auth/login con email y password. Si son válidas aún no hay sesión:
 * responde challengeId, expiresAt y availableFactors para el segundo factor.
 */
export async function POST(req: NextRequest) {
    if (SIMULAR_AUTH) {
        return NextResponse.json(loginSimulado());
    }
    return proxyCasilleroRequest(req, {
        path: "/v1/auth/login",
        requireAuth: false,
    });
}
