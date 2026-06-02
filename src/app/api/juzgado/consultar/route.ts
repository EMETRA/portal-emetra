import { NextRequest } from "next/server";
import {
  backendPathWithRequestQuery,
  proxyBackendRequest,
} from "@/lib/backend/proxy";

export async function POST(req: NextRequest) {
  return proxyBackendRequest(req, {
    method: "GET",
    path: backendPathWithRequestQuery(req, "/juzgado/expediente"),
    forwardBody: false,
  });
}
