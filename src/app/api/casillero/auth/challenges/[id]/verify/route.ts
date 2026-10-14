// app/api/casillero/auth/challenges/[id]/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import { setCasilleroAuthCookie } from "@/lib/casillero/session";
import {
    CODIGO_INVALIDO_SIMULADO,
    SIMULAR_AUTH,
    TOKEN_SESION_SIMULADA,
    vencimientoSesionSimulada,
} from "@/lib/casillero/auth.dummy";

type RouteContext = {
    params: Promise<{ id: string }>;
};

/** Responde al navegador solo el vencimiento y guarda el token en la cookie httpOnly. */
function respuestaConSesion(token: string, expiresAt: string | null) {
    const response = NextResponse.json({ expiresAt });
    setCasilleroAuthCookie(response, token, expiresAt);
    return response;
}

/**
 * POST /v1/auth/challenges/{id}/verify con method y code. Si es válido, el backend
 * crea la sesión (sessionToken, expiresAt). El token nunca llega al navegador:
 * queda en la cookie httpOnly y el proxy lo envía como Authorization: Bearer.
 */
export async function POST(req: NextRequest, context: RouteContext) {
    const { id } = await context.params;

    if (SIMULAR_AUTH) {
        const body = (await req.json().catch(() => null)) as { code?: unknown } | null;
        if (body?.code === CODIGO_INVALIDO_SIMULADO) {
            return NextResponse.json({ message: "Código inválido" }, { status: 401 });
        }
        return respuestaConSesion(TOKEN_SESION_SIMULADA, vencimientoSesionSimulada());
    }

    const upstream = await proxyCasilleroRequest(req, {
        path: `/v1/auth/challenges/${encodeURIComponent(id)}/verify`,
        requireAuth: false,
    });
    if (!upstream.ok) {
        return upstream;
    }

    const data = (await upstream.json().catch(() => null)) as {
        sessionToken?: unknown;
        expiresAt?: unknown;
    } | null;
    const token = typeof data?.sessionToken === "string" ? data.sessionToken.trim() : "";
    if (!token) {
        return NextResponse.json(
            { error: "La API de casillero no devolvió la sesión", code: "INVALID_UPSTREAM_RESPONSE" },
            { status: 502 }
        );
    }
    const expiresAt = typeof data?.expiresAt === "string" ? data.expiresAt : null;
    return respuestaConSesion(token, expiresAt);
}
