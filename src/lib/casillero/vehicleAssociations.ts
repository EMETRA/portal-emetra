import { createIdempotencyKey } from "./api";

export type VehicleAssociationStatus = "PENDING_SAT" | "APPROVED" | "REJECTED";

export type VehicleAssociationRequestCreated = {
  linkRequestId: string;
  trackingCode: string;
  status: VehicleAssociationStatus;
  submittedAt: string;
  message?: string;
  canRequestReview?: boolean;
};

export type VehicleReviewRequested = {
  reviewId: string;
  associationRequestId: string;
  status: "OPEN";
  version: number;
  requestedAt: string;
};

export class VehicleAssociationError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "VehicleAssociationError";
  }
}

async function errorFromResponse(response: Response, fallback: string): Promise<VehicleAssociationError> {
  const problem = (await response.json().catch(() => null)) as {
    detail?: unknown;
    title?: unknown;
  } | null;
  const detail = typeof problem?.detail === "string" ? problem.detail.trim() : "";
  const title = typeof problem?.title === "string" ? problem.title.trim() : "";
  return new VehicleAssociationError(detail || title || fallback, response.status);
}

export async function requestVehicleAssociation(
  plateNumber: string,
  idempotencyKey: string
): Promise<VehicleAssociationRequestCreated> {
  const response = await fetch("/api/casillero/vehicle-association-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      plate: {
        number: plateNumber,
        country: "GT",
        foreign: false,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw await errorFromResponse(response, "No se pudo solicitar la asociación de la placa.");
  }
  return response.json() as Promise<VehicleAssociationRequestCreated>;
}

export async function requestVehicleAssociationReview(
  associationRequestId: string,
  reason: string,
  documents: readonly File[],
  idempotencyKey = createIdempotencyKey()
): Promise<VehicleReviewRequested> {
  const body = new FormData();
  body.append("reason", reason);
  documents.forEach((document) => body.append("documents", document));

  const response = await fetch(
    `/api/casillero/vehicle-association-requests/${encodeURIComponent(associationRequestId)}/review-requests`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw await errorFromResponse(
      response,
      response.status === 409
        ? "La solicitud ya cambió de estado o la revisión ya fue solicitada."
        : "No se pudo solicitar la revisión del analista."
    );
  }
  return response.json() as Promise<VehicleReviewRequested>;
}
