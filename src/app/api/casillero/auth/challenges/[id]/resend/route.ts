// app/api/casillero/auth/challenges/[id]/resend/route.ts
import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    return proxyCasilleroRequest(req, {
        path: `/v1/auth/challenges/${encodeURIComponent(params.id)}/resend`,
        requireAuth: false,
    });
}