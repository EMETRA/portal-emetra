import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  isAppAuthorizationEnabled,
  isValidAppToken,
} from "@/lib/auth/session";

type Body = {
  token?: string;
};

export async function POST(req: Request) {
  if (!isAppAuthorizationEnabled()) {
    return NextResponse.json({ success: true, disabled: true });
  }

  const body = (await req.json().catch(() => ({}))) as Body;
  const token = body.token?.trim();

  if (!isValidAppToken(token)) {
    return NextResponse.json(
      { success: false, error: "Token de autorizacion invalido" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token!,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
