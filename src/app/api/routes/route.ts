import { NextRequest } from "next/server";
import { proxyBackendRequest } from "@/lib/backend/proxy";

export async function GET(req: NextRequest) {
  return proxyBackendRequest(req, {
    path: "/routes",
    forwardBody: false,
  });
}
