import { NextResponse } from "next/server";

export type ApiErrorBody = {
  error: string;
  code?: string;
};

export function getUserErrorMessage(
  error: unknown,
  fallback = "Ocurrio un error al procesar la solicitud. Intentalo de nuevo."
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function apiErrorResponse(
  message: string,
  status: number,
  code?: string
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: message, code }, { status });
}

export function apiErrorFromUnknown(
  error: unknown,
  fallback = "Error interno del servidor"
): NextResponse<ApiErrorBody> {
  if (
    error &&
    typeof error === "object" &&
    "name" in error &&
    (error as { name: string }).name === "BackendError"
  ) {
    const backendError = error as unknown as {
      message: string;
      status: number;
      code?: string;
    };
    return apiErrorResponse(
      backendError.message,
      backendError.status,
      backendError.code
    );
  }

  console.error(fallback, error);
  return apiErrorResponse(fallback, 500, "INTERNAL_ERROR");
}

export function getApiErrorFromJson(
  data: unknown,
  fallback = "Ocurrio un error al procesar la solicitud."
): string {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.error === "string" && record.error.trim()) {
      return record.error;
    }
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
  }
  return fallback;
}

export async function parseApiErrorPayload(
  response: Response
): Promise<ApiErrorBody> {
  const payload = (await response.json().catch(() => null)) as
    | (ApiErrorBody & { message?: string })
    | null;

  const error =
    payload?.error ??
    payload?.message ??
    `No fue posible completar la solicitud. Codigo: ${response.status}`;

  return {
    error,
    code: payload?.code,
  };
}
