import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function GET(req: NextRequest) {
  return proxyCasilleroRequest(req, {
    path: "/v1/whatsapp-subscriptions",
    forwardBody: false,
    requireAuth: true,
  });
}

export async function POST(req: NextRequest) {
  return proxyCasilleroRequest(req, {
    path: "/v1/whatsapp-subscriptions",
    requireAuth: true,
  });
}
