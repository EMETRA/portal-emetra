import type { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string; memberId: string }> }) {
  const { id, memberId } = await context.params;
  return proxyCasilleroRequest(req, { path: `/v1/companies/${encodeURIComponent(id)}/members/${encodeURIComponent(memberId)}/roles` });
}
