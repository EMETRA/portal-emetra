import { getCasilleroJson, postCasilleroJson } from "./api";

export type AuthenticationFactor = {
  id: string;
  type: "CORREO" | "TOTP";
  status: "PENDIENTE" | "ACTIVO" | "REVOCADO";
  preferred: boolean;
  destinationMasked?: string;
  activatedAt?: string;
  lastUsedAt?: string;
  revokedAt?: string;
};

type AuthenticationFactorsResponse = {
  factors: AuthenticationFactor[];
};

export type TotpEnrollment = {
  factorId: string;
  status: "PENDIENTE";
  provisioningUri: string;
  algorithm: "SHA1";
  digits: 6;
  period: 30;
};

export type TotpEnrollmentConfirmation = {
  factorId: string;
  status: "ACTIVO";
  activatedAt: string;
  recoveryCodes: string[];
};

function authenticationFactorError(status: number): Error {
  const message =
    status === 401 ? "Tu sesión expiró. Inicia sesión nuevamente."
    : status === 409 ? "Ya tienes una aplicación autenticadora configurada o la configuración anterior venció."
    : status === 422 ? "El código no es válido. Revisa el código de tu aplicación."
    : status === 429 ? "Se alcanzó el límite de intentos. Intenta más tarde."
    : "No se pudo completar la operación. Intenta de nuevo.";
  return new Error(message);
}

export async function fetchAuthenticationFactors(): Promise<AuthenticationFactor[]> {
  const response = await getCasilleroJson<AuthenticationFactorsResponse>(
    "/api/casillero/authentication-factors",
    authenticationFactorError,
  );
  return response.factors;
}

export function startTotpEnrollment(): Promise<TotpEnrollment> {
  return postCasilleroJson<TotpEnrollment>(
    "/api/casillero/authentication-factors",
    {},
    authenticationFactorError,
  );
}

export function confirmTotpEnrollment(code: string): Promise<TotpEnrollmentConfirmation> {
  return postCasilleroJson<TotpEnrollmentConfirmation>(
    "/api/casillero/authentication-factors/totp/confirm",
    { code },
    authenticationFactorError,
  );
}

async function noContentRequest(path: string, method: "PATCH" | "DELETE", body?: unknown): Promise<void> {
  const response = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!response.ok) throw authenticationFactorError(response.status);
}

export async function setPreferredAuthenticationFactor(factorId: string): Promise<void> {
  await noContentRequest(`/api/casillero/authentication-factors/${encodeURIComponent(factorId)}/preferred`, "PATCH");
}

export type RevocationStepUp = { challengeId: string; expiresAt: string; destinationMasked: string };

export function requestFactorRevocationStepUp(factorId: string): Promise<RevocationStepUp> {
  return postCasilleroJson<RevocationStepUp>(
    "/api/casillero/authentication-factors/step-up-challenges",
    { factorId },
    authenticationFactorError,
  );
}

export async function revokeAuthenticationFactor(
  factorId: string,
  body: { verificationFactorId: string; password: string; code: string; challengeId?: string },
): Promise<void> {
  await noContentRequest(`/api/casillero/authentication-factors/${encodeURIComponent(factorId)}`, "DELETE", body);
}
