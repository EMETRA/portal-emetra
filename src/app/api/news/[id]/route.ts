import { NextRequest } from "next/server";
import { proxyBackendRequest } from "@/lib/backend/proxy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return proxyBackendRequest(req, {
    path: `/news/${encodeURIComponent(id)}`,
    forwardBody: false,
  });
}
