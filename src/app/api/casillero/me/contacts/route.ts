import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function GET(req: NextRequest) {
  return proxyCasilleroRequest(req, {
    path: "/v1/me/contacts",
    forwardBody: false,
    requireAuth: true,
  });
}
