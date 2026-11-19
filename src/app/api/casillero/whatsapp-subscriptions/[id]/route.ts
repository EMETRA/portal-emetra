import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyCasilleroRequest(req, {
    path: `/v1/whatsapp-subscriptions/${encodeURIComponent(id)}`,
    requireAuth: true,
  });
}
