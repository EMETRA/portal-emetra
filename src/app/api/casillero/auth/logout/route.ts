// app/api/casillero/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import {
    clearCasilleroAuthCookie,
    readCasilleroAuthTokenFromCookies,
} from "@/lib/casillero/session";
import { SIMULAR_AUTH } from "@/lib/casillero/auth.dummy";

/**
 * POST /v1/auth/logout con el Bearer de la sesión (lo agrega el proxy desde la cookie).
 * La cookie se borra siempre, aunque la sesión ya estuviera vencida o revocada, o el
 * backend no responda.
 */
export async function POST(req: NextRequest) {
    const token = readCasilleroAuthTokenFromCookies(req.cookies);
    if (token && !SIMULAR_AUTH) {
        try {
            await proxyCasilleroRequest(req, {
                path: "/v1/auth/logout",
                requireAuth: true,
            });
        } catch {
            // Se cierra la sesión local de todos modos.
        }
    }

    const response = new NextResponse(null, { status: 204 });
    clearCasilleroAuthCookie(response);
    return response;
}
