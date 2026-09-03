import type {
  ContactVerificationCreated,
  ContactVerificationVerified,
} from "@/lib/casillero/types";

function errorFromStatus(status: number, isVerify: boolean): Error {
  const message =
    status === 400
      ? "Solicitud inválida"
      : status === 401
        ? "Código inválido"
        : status === 409
          ? "Verificación vencida o ya utilizada"
          : status === 429
            ? isVerify
              ? "Verificación bloqueada"
              : "Límite de solicitudes alcanzado"
            : `HTTP ${status}`;
  const error = new Error(message);
  error.name = "ApiResponseError";
  return error;
}

async function postCasilleroJson<T>(
  path: string,
  body: unknown,
  isVerify = false
): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw errorFromStatus(response.status, isVerify);
  }

  return response.json() as Promise<T>;
}

export async function requestContactVerification(
  email: string
): Promise<ContactVerificationCreated> {
  return postCasilleroJson<ContactVerificationCreated>(
    "/api/casillero/contact-verifications",
    { email }
  );
}

export async function confirmContactVerification(
  verificationId: string,
  code: string
): Promise<ContactVerificationVerified> {
  return postCasilleroJson<ContactVerificationVerified>(
    `/api/casillero/contact-verifications/${encodeURIComponent(verificationId)}/verify`,
    { code },
    true
  );
}
