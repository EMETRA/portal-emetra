import { assertOkResponse } from "@/lib/bff/raw";
import type { ConsultaCasoResponse, DefenseResponse } from "@/lib/vivi/types";

const PRESENTAR_DEFENSA_ERRORS: Record<number, { message: string; retryable?: boolean }> = {
    400: { message: "La solicitud para presentar la defensa no es válida." },
    404: { message: "No se encontró el caso para presentar la defensa." },
    409: { message: "Este caso ya no permite presentar defensa." },
    413: { message: "El archivo supera el tamaño permitido." },
    503: { message: "No pudimos generar tu PDF. Puedes intentar de nuevo.", retryable: true },
};

export class PresentarDefensaError extends Error {
    readonly status: number;
    readonly retryable: boolean;

    constructor(status: number, message: string, retryable = false) {
        super(message);
        this.name = "PresentarDefensaError";
        this.status = status;
        this.retryable = retryable;
    }
}

async function assertPresentarDefensa(response: Response): Promise<void> {
    if (response.ok) {
        return;
    }

    const body = await response.text();
    const known = PRESENTAR_DEFENSA_ERRORS[response.status];
    throw new PresentarDefensaError(
        response.status,
        known?.message || body || `HTTP ${response.status}`,
        known?.retryable ?? false,
    );
}

export type { Case, DefenseFile, defenseData, DefenseResponse, ConsultaCasoResponse } from "@/lib/vivi/types";

export function normalizeConsulta(data: ConsultaCasoResponse): ConsultaCasoResponse {
    return {
        ...data,
        caso: {
            ...data.caso,
            denuncia: {
                evidencias: data.caso.denuncia?.evidencias ?? [],
            },
        },
    };
}

export async function fetchConsultaCaso(): Promise<ConsultaCasoResponse | null> {
    const response = await fetch("/api/vivi/defensas/consulta", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        cache: "no-store",
    });

    if (response.status === 404) {
        return null;
    }

    await assertOkResponse(response);
    return normalizeConsulta((await response.json()) as ConsultaCasoResponse);
}

export async function submitDefenseClient(
  // caseId: string,
  // payload: defenseData
  // caseId: string,
): Promise<DefenseResponse | null> {
  // const formData = new FormData();
  // formData.set("name", payload.name);
  // formData.set("personalDocumentType", payload.personalDocumentType);
  // if (payload.dpi) {
  //   formData.set("dpi", payload.dpi);
  // }
  // if (payload.passport) {
  //   formData.set("passport", payload.passport);
  // }
  // formData.set("email", payload.email);
  // formData.set("phone", payload.phone);
  // formData.set("arguments", payload.arguments);
  // formData.set("declaration", String(payload.declaration));
    const formData = new FormData();
    const response = await fetch("/api/vivi/defensas", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
    });

    await assertPresentarDefensa(response);

    if (response.status === 204) {
        return null;
    }

    const body = await response.text();
    if (!body) {
        return null;
    }

    const defense = JSON.parse(body) as DefenseResponse;
    if (defense.documento?.estado === "ERROR_RECUPERABLE") {
        throw new PresentarDefensaError(
            503,
            PRESENTAR_DEFENSA_ERRORS[503].message,
            true,
        );
    }

    return defense;
}
