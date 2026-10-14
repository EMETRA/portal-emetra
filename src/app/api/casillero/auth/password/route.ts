// app/api/casillero/auth/password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import { clearCasilleroAuthCookie } from "@/lib/casillero/session";
import { SIMULAR_AUTH, TOKEN_RECUPERACION_INVALIDO_SIMULADO } from "@/lib/casillero/auth.dummy";

/**
 * PUT /v1/auth/password con token (del correo) y newPassword. Si se cambia, el backend
 * revoca las sesiones anteriores: también se borra la cookie de sesión de este navegador.
 */
export async function PUT(req: NextRequest) {
    if (SIMULAR_AUTH) {
        const body = (await req.json().catch(() => null)) as { token?: unknown } | null;
        if (body?.token === TOKEN_RECUPERACION_INVALIDO_SIMULADO) {
            return NextResponse.json({ message: "Token inválido" }, { status: 401 });
        }
        const response = new NextResponse(null, { status: 204 });
        clearCasilleroAuthCookie(response);
        return response;
    }

    const upstream = await proxyCasilleroRequest(req, {
        path: "/v1/auth/password",
        requireAuth: false,
    });
    if (!upstream.ok) {
        return upstream;
    }
    const response = new NextResponse(null, { status: 204 });
    clearCasilleroAuthCookie(response);
    return response;
}
