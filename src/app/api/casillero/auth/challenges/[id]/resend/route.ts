// app/api/casillero/auth/challenges/[id]/resend/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import { SIMULAR_AUTH, reenvioSimulado } from "@/lib/casillero/auth.dummy";

type RouteContext = {
    params: Promise<{ id: string }>;
};

/** POST /v1/auth/challenges/{id}/resend: reenvía el código por correo y renueva la expiración. */
export async function POST(req: NextRequest, context: RouteContext) {
    const { id } = await context.params;
    if (SIMULAR_AUTH) {
        return NextResponse.json(reenvioSimulado(id));
    }
    return proxyCasilleroRequest(req, {
        path: `/v1/auth/challenges/${encodeURIComponent(id)}/resend`,
        requireAuth: false,
    });
}
