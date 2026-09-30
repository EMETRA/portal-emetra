import { NextRequest } from "next/server";
import { proxyBackendRequest } from "@/lib/backend/proxy";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return proxyBackendRequest(req, { path: "/notificado/generar" });
}
