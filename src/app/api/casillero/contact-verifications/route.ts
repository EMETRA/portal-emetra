import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function POST(req: NextRequest) {
  return proxyCasilleroRequest(req, {
    path: "/v1/contact-verifications",
    requireAuth: false,
  });
}
