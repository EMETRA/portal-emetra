// app/api/casillero/auth/password/route.ts
import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function PUT(req: NextRequest) {
    return proxyCasilleroRequest(req, {
        path: "/v1/auth/password",
        requireAuth: false,
    });
}