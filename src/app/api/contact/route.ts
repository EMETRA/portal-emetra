import { NextRequest } from "next/server";
import { proxyBackendRequest } from "@/lib/backend/proxy";

export async function POST(req: NextRequest) {
  return proxyBackendRequest(req, { path: "/contact" });
}
