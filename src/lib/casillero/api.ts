import type {
  ContactVerificationCreated,
  ContactVerificationVerified,
  PersonalRegistrationRequest,
  PersonalRegistrationCreated,
} from "@/lib/casillero/types";

// GENERAL REQUEST API

function createIdempotencyKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // versión 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variante RFC 4122
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function postCasilleroJson<T>(
  path: string,
  body: unknown,
  errorFromStatus: (status: number) => Error,
  withIdempotency = false
): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(withIdempotency
        ? { "Idempotency-Key": createIdempotencyKey() }
        : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw errorFromStatus(response.status);
  }

  return response.json() as Promise<T>;
}

// CONTACT-VERIFICATION API

function errorFromContactVerificationStatus(isVerify: boolean) {
  return (status: number): Error => {
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
  };
}

export async function requestContactVerification(
  email: string
): Promise<ContactVerificationCreated> {
  return postCasilleroJson<ContactVerificationCreated>(
    "/api/casillero/contact-verifications",
    { email },
    errorFromContactVerificationStatus(false)
  );
}

export async function confirmContactVerification(
  verificationId: string,
  code: string,
  password: string
): Promise<ContactVerificationVerified> {
  return postCasilleroJson<ContactVerificationVerified>(
    `/api/casillero/contact-verifications/${encodeURIComponent(verificationId)}/verify`,
    { code, password },
    errorFromContactVerificationStatus(true)
  );
}

// CREATE-PERSONAL-REGISTRATION API

function errorFromRegistrationStatus(status: number): Error {
  const message =
    status === 400
      ? "Solicitud inválida"
      : status === 409
        ? "Ya existe una solicitud con estos datos"
        : status === 422
          ? "Documento o NIT inválido"
          : status === 429
            ? "Límite de solicitudes alcanzado"
            : `HTTP ${status}`;
  const error = new Error(message);
  error.name = "ApiResponseError";
  return error;
}

export async function createPersonalRegistration(
  body: PersonalRegistrationRequest
): Promise<PersonalRegistrationCreated> {
  return postCasilleroJson<PersonalRegistrationCreated>(
    "/api/casillero/registrations",
    body,
    errorFromRegistrationStatus,
    true
  );
}