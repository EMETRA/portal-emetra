// app/api/casillero/auth/login/route.ts
import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function POST(req: NextRequest) {
    return proxyCasilleroRequest(req, {
        path: "/v1/auth/login",
        requireAuth: false,
    });
}