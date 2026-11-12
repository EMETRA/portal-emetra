import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { fetchEvialUpstream } from "./upstream";
import { buildBackendUrl } from "@/lib/backend/client";

const COURSE_COOKIE = "evial_course_token",
  STAFF_COOKIE = "evial_staff_token";
export type EvialRoute = {
  path: string;
  scope: "public" | "course" | "staff" | "evaluation";
  login?: "course" | "staff";
};
export function evialRoute(method: string, parts: string[]): EvialRoute | null {
  const p = parts.join("/"),
    id = "[1-9]\\d{0,9}";
  if (
    method === "GET" &&
    /^(inicio|eventos|configuracion|catalogos\/(paises|departamentos|municipios))$/.test(
      p,
    )
  )
    return { path: p, scope: "public" };
  if (method === "GET" && new RegExp(`^eventos/${id}$`).test(p))
    return { path: p, scope: "public" };
  if (
    method === "POST" &&
    new RegExp(`^eventos/${id}/(acceso|inscripciones)$`).test(p)
  )
    return { path: p, scope: "public", login: "course" };
  if (method === "POST" && p === "staff/acceso")
    return { path: p, scope: "public", login: "staff" };
  if (
    (method === "GET" &&
      /^(mi-curso|mi-curso\/(alumnos|comprobante))$/.test(p)) ||
    (method === "POST" &&
      /^mi-curso\/(examen\/(iniciar|responder)|comprobante\/correo)$/.test(
        p,
      )) ||
    (method === "PUT" && p === "mi-curso/alumnos")
  )
    return { path: p, scope: "course" };
  if (["GET", "POST"].includes(method) && p === "evaluacion")
    return { path: p, scope: "evaluation" };
  if (
    method === "GET" &&
    new RegExp(`^administracion/eventos/${id}/editor$`).test(p)
  )
    return { path: p, scope: "staff" };
  if (
    method === "POST" &&
    (p === "administracion/eventos" ||
      new RegExp(`^administracion/eventos/${id}/contenidos$`).test(p))
  )
    return { path: p, scope: "staff" };
  if (
    method === "PUT" &&
    new RegExp(`^administracion/eventos/${id}(/contenidos/${id})?$`).test(p)
  )
    return { path: p, scope: "staff" };
  if (
    method === "GET" &&
    (/^(administracion\/(contexto|eventos))$/.test(p) ||
      new RegExp(
        `^administracion/(inscripciones/${id}|conflictos/${id}/${id}|evidencia/${id}/${id})$`,
      ).test(p))
  )
    return { path: p, scope: "staff" };
  if (
    method === "PATCH" &&
    (p === "administracion/asistencia" ||
      new RegExp(`^administracion/personas/${id}/documento$`).test(p))
  )
    return { path: p, scope: "staff" };
  if (method === "POST" && p === "administracion/buscar")
    return { path: p, scope: "staff" };
  if (
    method === "DELETE" &&
    new RegExp(`^administracion/inscripciones/${id}/${id}$`).test(p)
  )
    return { path: p, scope: "staff" };
  return null;
}
async function readLimited(req: NextRequest, max: number) {
  const reader = req.body?.getReader();
  if (!reader) return undefined;
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > max) {
        await reader.cancel();
        throw new Error("BODY_TOO_LARGE");
      }
      chunks.push(next.value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}
export function validEvialOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return req.headers.get("sec-fetch-site") !== "cross-site";
  try {
    const url = new URL(origin);
    return (
      origin === req.nextUrl.origin ||
      origin === process.env.PORTAL_PUBLIC_ORIGIN?.replace(/\/$/, "") ||
      (url.protocol === "https:" && url.host === req.headers.get("host"))
    );
  } catch {
    return false;
  }
}
const error = (message: string, status: number, codigo = "NO_DISPONIBLE") =>
  NextResponse.json(
    { codigo, message, referencia: randomUUID() },
    { status, headers: { "cache-control": "private, no-store" } },
  );
export async function proxyEvial(req: NextRequest, parts: string[]) {
  const method = req.method.toUpperCase(),
    path = parts.join("/");
  if (!["GET", "HEAD"].includes(method) && !validEvialOrigin(req))
    return error(
      "No se pudo validar el origen de la solicitud",
      403,
      "ORIGEN_INVALIDO",
    );
  if (method === "DELETE" && ["sesion", "staff/sesion"].includes(path)) {
    const response = NextResponse.json({ cerrada: true });
    response.cookies.set(path === "sesion" ? COURSE_COOKIE : STAFF_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/evial",
      maxAge: 0,
    });
    return response;
  }
  const route = evialRoute(method, parts);
  if (!route)
    return error("Operación EVIAL no disponible", 404, "NO_ENCONTRADO");
  const headers = new Headers({ accept: "application/json" });
  const cookie = route.scope === "staff" ? STAFF_COOKIE : COURSE_COOKIE;
  const token =
    route.scope === "evaluation"
      ? req.headers.get("authorization")?.match(/^Bearer ([^\s]+)$/)?.[1]
      : route.scope === "course" || route.scope === "staff"
        ? req.cookies.get(cookie)?.value
        : undefined;
  if (route.scope !== "public" && !token)
    return error("Inicia sesión para continuar", 401, "ACCESO_REQUERIDO");
  if (token) headers.set("authorization", "Bearer " + token);
  const query = new URLSearchParams();
  for (const key of ["pais", "departamento", "page", "finalizados"]) {
    const value = req.nextUrl.searchParams.get(key);
    if (value !== null) {
      if (value.length > 100)
        return error("Filtro inválido", 400, "REVISA_DATOS");
      query.set(key, value);
    }
  }
  const type = req.headers.get("content-type") || "";
  let body: Uint8Array | undefined;
  try {
    if (!["GET", "HEAD"].includes(method)) {
      if (
        !type.startsWith("application/json") &&
        !type.startsWith("multipart/form-data") &&
        req.body
      )
        return error("Formato de solicitud inválido", 415, "REVISA_DATOS");
      body = await readLimited(
        req,
        type.startsWith("multipart/") ? 10616832 : 131072,
      );
      if (type) headers.set("content-type", type);
    }
  } catch {
    return error(
      "El archivo o formulario supera el tamaño permitido",
      413,
      "REVISA_DATOS",
    );
  }
  let upstream: Response;
  try {
    upstream = await fetchEvialUpstream(
      buildBackendUrl("/evial/" + route.path + (query.size ? "?" + query : "")),
      {
        method,
        headers,
        body,
        signal: AbortSignal.timeout(30000),
      },
    );
  } catch {
    return error(
      "El servicio no está disponible. Conservamos los datos para que reintentes.",
      503,
    );
  }
  if (!upstream.ok) {
    const payload = await upstream.json().catch(() => null);
    const response = NextResponse.json(
      {
        codigo: payload?.codigo || "NO_DISPONIBLE",
        message:
          typeof payload?.message === "string"
            ? payload.message
            : "No se pudo completar la operación",
        referencia:
          typeof payload?.referencia === "string"
            ? payload.referencia
            : randomUUID(),
      },
      {
        status: upstream.status,
        headers: { "cache-control": "private, no-store" },
      },
    );
    if (
      upstream.status === 401 &&
      (route.scope === "course" || route.scope === "staff")
    )
      response.cookies.set(cookie, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/evial",
        maxAge: 0,
      });
    return response;
  }
  if (route.login) {
    const payload = await upstream.json();
    if (typeof payload.token !== "string" || payload.token.length > 12000)
      return error("No se confirmó el acceso", 502);
    const { token: sessionToken, ...safe } = payload;
    const response = NextResponse.json(safe, {
      status: 200,
      headers: { "cache-control": "private, no-store" },
    });
    response.cookies.set(
      route.login === "staff" ? STAFF_COOKIE : COURSE_COOKIE,
      sessionToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/evial",
        maxAge: Math.min(Number(payload.expiresIn) || 900, 7200),
      },
    );
    return response;
  }
  const out = new Headers({
    "cache-control": "private, no-store",
    "x-content-type-options": "nosniff",
  });
  for (const key of ["content-type", "content-disposition"]) {
    const value = upstream.headers.get(key);
    if (value) out.set(key, value);
  }
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: out,
  });
}
