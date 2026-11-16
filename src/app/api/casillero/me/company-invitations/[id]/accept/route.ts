import type { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return proxyCasilleroRequest(req, { path: `/v1/me/company-invitations/${encodeURIComponent(id)}/accept` });
}
