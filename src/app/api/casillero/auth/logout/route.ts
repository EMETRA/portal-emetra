// app/api/casillero/auth/logout/route.ts
import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function POST(req: NextRequest) {
    return proxyCasilleroRequest(req, {
        path: "/v1/auth/logout",
        requireAuth: true,
    });
}