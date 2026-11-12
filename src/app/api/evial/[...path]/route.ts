import { NextRequest } from "next/server";
import { proxyEvial } from "@/lib/evial/proxy";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
type Context = { params: Promise<{ path: string[] }> };
async function handle(req: NextRequest, ctx: Context) {
  return proxyEvial(req, (await ctx.params).path);
}
export const GET = handle,
  POST = handle,
  PUT = handle,
  PATCH = handle,
  DELETE = handle;
