// app/api/casillero/auth/password-resets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import { SIMULAR_AUTH } from "@/lib/casillero/auth.dummy";

/**
 * POST /v1/auth/password-resets con email. Siempre responde aceptado (202) para no
 * revelar si la cuenta existe; si existe, el backend envía un token por correo.
 */
export async function POST(req: NextRequest) {
    if (SIMULAR_AUTH) {
        return new NextResponse(null, { status: 202 });
    }
    return proxyCasilleroRequest(req, {
        path: "/v1/auth/password-resets",
        requireAuth: false,
    });
}
