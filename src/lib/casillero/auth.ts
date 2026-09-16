import { postCasilleroJson } from "./api";
import type {
    LoginResponse,
    VerifyResponse,
    ResendResponse,
    TwoFactorType,
} from "./types";


// ── LOGIN ──────────────────────────────────────────────────────────────────
function errorFromLoginStatus(status: number): Error {
    const message =
        status === 400 ? "Solicitud inválida"
        : status === 401 ? "Correo o contraseña incorrectos"
        : status === 429 ? "Demasiados intentos. Intenta más tarde"
        : `HTTP ${status}`;
    const error = new Error(message);
    error.name = "ApiResponseError";
    return error;
}

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {
    return postCasilleroJson<LoginResponse>(
        "/api/casillero/auth/login",
        { email, password },
        errorFromLoginStatus
    );
}

// ── VERIFY ────────────────────────────────────────────────────────────────
function errorFromVerifyStatus(status: number): Error {
    const message =
        status === 401 ? "Desafío o código inválido"
        : status === 429 ? "Desafío bloqueado. Intenta más tarde"
        : `HTTP ${status}`;
    const error = new Error(message);
    error.name = "ApiResponseError";
    return error;
}

export async function verifyChallenge(
    challengeId: string,
    method: TwoFactorType,
    code: string
): Promise<VerifyResponse> {
    return postCasilleroJson<VerifyResponse>(
        `/api/casillero/auth/challenges/${encodeURIComponent(challengeId)}/verify`,
        { method, code },
        errorFromVerifyStatus
    );
}

// ── RESEND ────────────────────────────────────────────────────────────────
function errorFromResendStatus(status: number): Error {
    const message =
        status === 401 ? "Desafío no disponible"
        : status === 429 ? "Reenvío temporalmente bloqueado"
        : `HTTP ${status}`;
    const error = new Error(message);
    error.name = "ApiResponseError";
    return error;
}

export async function resendChallenge(
    challengeId: string
): Promise<ResendResponse> {
    return postCasilleroJson<ResendResponse>(
        `/api/casillero/auth/challenges/${encodeURIComponent(challengeId)}/resend`,
        {},
        errorFromResendStatus
    );
}

// ── LOGOUT ────────────────────────────────────────────────────────────────
export async function logout(sessionToken: string): Promise<void> {
    await fetch("/api/casillero/auth/logout", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
        },
        cache: "no-store",
    });
    // siempre limpia local aunque falle o devuelva 401
}

// ── PASSWORD RESET ────────────────────────────────────────────────────────
export async function requestPasswordReset(email: string): Promise<void> {
  // 202 = aceptado aunque el email no exista — nunca lanzar error visible
    await fetch("/api/casillero/auth/password-resets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
    });
}

function errorFromResetPasswordStatus(status: number): Error {
    const message =
        status === 401 ? "Token inválido, vencido, consumido o revocado"
        : `HTTP ${status}`;
    const error = new Error(message);
    error.name = "ApiResponseError";
    return error;
}

export async function resetPassword(
    token: string,
    newPassword: string
): Promise<void> {
    const response = await fetch("/api/casillero/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
        cache: "no-store",
    });
    // 204 = ok, sin body
    if (!response.ok) {
        throw errorFromResetPasswordStatus(response.status);
    }
}