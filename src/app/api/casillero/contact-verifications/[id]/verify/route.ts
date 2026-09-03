import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return proxyCasilleroRequest(req, {
    path: `/v1/contact-verifications/${encodeURIComponent(id)}/verify`,
    requireAuth: false,
  });
}
