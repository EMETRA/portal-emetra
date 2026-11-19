import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

type Context = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: Context) {
  const { id } = await params;
  return proxyCasilleroRequest(request, {
    path: `/v1/me/authentication-factors/${encodeURIComponent(id)}`,
  });
}
