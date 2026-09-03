import { NextRequest } from "next/server";
import { proxyBackendRequest } from "@/lib/backend/proxy";

export async function GET(req: NextRequest) {
  const tplaca = req.nextUrl.searchParams.get("tplaca");
  const nplaca = req.nextUrl.searchParams.get("nplaca");

  if (!tplaca || !nplaca) {
    return proxyBackendRequest(req, {
      method: "GET",
      path: "/notificado/consulta",
      forwardBody: false,
    });
  }

  return proxyBackendRequest(req, {
    method: "GET",
    path: `/notificado/consulta/${encodeURIComponent(tplaca)}/${encodeURIComponent(nplaca)}`,
    forwardBody: false,
  });
}
