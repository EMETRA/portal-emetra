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
/**
 * Cierra la sesión. El token viaja en la cookie httpOnly (el BFF lo envía como Bearer)
 * y el BFF la borra siempre. Nunca lanza error: quien llama limpia su estado igual.
 */
export async function logout(): Promise<void> {
    try {
        await fetch("/api/casillero/auth/logout", {
            method: "POST",
            cache: "no-store",
        });
    } catch {
        // Sin red: la sesión local se limpia de todos modos.
    }
}

// ── PASSWORD RESET ────────────────────────────────────────────────────────
function errorFromPasswordResetRequestStatus(status: number): Error {
    const message =
        status === 400 ? "Revisa el correo ingresado"
        : status === 429 ? "Demasiadas solicitudes. Intenta más tarde"
        : "No se pudo enviar la solicitud. Intenta más tarde";
    const error = new Error(message);
    error.name = "ApiResponseError";
    return error;
}

/**
 * 202 = aceptado, exista o no la cuenta (el backend no lo revela). Solo lanza error si
 * la solicitud misma falla (correo mal formado, demasiados intentos, servidor caído).
 */
export async function requestPasswordReset(email: string): Promise<void> {
    const response = await fetch("/api/casillero/auth/password-resets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
    });
    if (!response.ok) {
        throw errorFromPasswordResetRequestStatus(response.status);
    }
}

function errorFromResetPasswordStatus(status: number): Error {
    const message =
        status === 400 ? "La contraseña no cumple los requisitos. Revisa e intenta de nuevo"
        : status === 401 ? "El token es inválido o ya venció. Pide uno nuevo"
        : status === 429 ? "Demasiados intentos. Intenta más tarde"
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