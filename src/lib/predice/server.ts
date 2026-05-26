import "server-only";

import { BackendError, backendFetch } from "@/lib/backend/client";
import type {
  CreatePrediceEventPayload,
  PrediceEventDto,
} from "@/lib/predice/types";

const DEFAULT_ADMIN_KEY = "admin";

function buildPredicePath(path: string, admin?: string): string {
  const search = admin ? `?admin=${encodeURIComponent(admin)}` : "";
  return `${path}${search}`;
}

export async function fetchPrediceEventsServer(
  admin: string = DEFAULT_ADMIN_KEY
): Promise<PrediceEventDto[]> {
  try {
    const data = await backendFetch<PrediceEventDto[]>(
      buildPredicePath("/predice/eventos", admin),
      { next: { revalidate: 180 } }
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) {
      return [];
    }
    throw error;
  }
}

export async function fetchPrediceEventByIdServer(
  id: string,
  admin: string = DEFAULT_ADMIN_KEY
): Promise<PrediceEventDto | null> {
  try {
    return await backendFetch<PrediceEventDto>(
      buildPredicePath(`/predice/eventos/${id}`, admin),
      { next: { revalidate: 180 } }
    );
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createPrediceEventServer(
  payload: CreatePrediceEventPayload,
  admin: string = DEFAULT_ADMIN_KEY
) {
  return backendFetch(buildPredicePath("/predice/eventos", admin), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
