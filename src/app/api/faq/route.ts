import { NextRequest } from "next/server";
import {
  backendPathWithRequestQuery,
  proxyBackendRequest,
} from "@/lib/backend/proxy";

export async function GET(req: NextRequest) {
  return proxyBackendRequest(req, {
    path: backendPathWithRequestQuery(req, "/faq"),
    forwardBody: false,
  });
}
