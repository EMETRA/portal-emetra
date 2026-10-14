import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

type RouteContext = {
    params: Promise<{ code: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
    const { code } = await context.params;
    return proxyCasilleroRequest(req, {
        path: `/v1/registrations/${encodeURIComponent(code)}`,
        requireAuth: false,
    });
}
