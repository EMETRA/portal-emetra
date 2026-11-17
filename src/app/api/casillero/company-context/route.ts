import { NextRequest, NextResponse } from "next/server";

const COOKIE = "portal-company-context";

export async function GET(req: NextRequest) {
  return NextResponse.json({ companyId: req.cookies.get(COOKIE)?.value ?? null });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as { companyId?: unknown } | null;
  const companyId = typeof body?.companyId === "string" ? body.companyId.trim() : "";
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(companyId)) {
    return NextResponse.json({ error: "Contexto empresarial inválido" }, { status: 400 });
  }
  const response = NextResponse.json({ companyId });
  response.cookies.set(COOKIE, companyId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ companyId: null });
  response.cookies.set(COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
