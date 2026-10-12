import { NextRequest } from "next/server";
import {
  backendPathWithRequestQuery,
  proxyBackendRequest,
} from "@/lib/backend/proxy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return proxyBackendRequest(req, {
    path: backendPathWithRequestQuery(
      req,
      `/vivi/denuncias/${encodeURIComponent(id)}/defensa`
    ),
  });
}
