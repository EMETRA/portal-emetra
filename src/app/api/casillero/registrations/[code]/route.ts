import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function GET(
    req: NextRequest,
    { params }: { params: { code: string } }
) {
    return proxyCasilleroRequest(req, {
        path: `/v1/registrations/${encodeURIComponent(params.code)}`,
        requireAuth: false,
    });
}