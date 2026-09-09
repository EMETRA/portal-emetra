import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function GET(req: NextRequest) {
  return proxyCasilleroRequest(req, {
    path: "/v1/me",
    forwardBody: false,
    requireAuth: true,
  });
}

export async function PATCH(req: NextRequest) {
  return proxyCasilleroRequest(req, {
    path: "/v1/me",
    requireAuth: true,
  });
}
