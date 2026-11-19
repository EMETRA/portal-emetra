import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

export async function POST(request: NextRequest) {
  return proxyCasilleroRequest(request, {
    path: "/v1/me/authentication-factors/step-up-challenges",
  });
}
