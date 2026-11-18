import type { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

type Context = { params: Promise<{ id: string; attemptId: string }> };

export async function GET(req: NextRequest, context: Context) {
  const { id, attemptId } = await context.params;
  return proxyCasilleroRequest(req, {
    path: `/v1/payment-orders/${encodeURIComponent(id)}/checkout/${encodeURIComponent(attemptId)}`,
    forwardBody: false,
    requireAuth: true,
  });
}

export async function POST(req: NextRequest, context: Context) {
  const { id, attemptId } = await context.params;
  return proxyCasilleroRequest(req, {
    path: `/v1/payment-orders/${encodeURIComponent(id)}/checkout/${encodeURIComponent(attemptId)}/continue`,
    requireAuth: true,
  });
}
