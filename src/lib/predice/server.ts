import "server-only";

import { events as mockEvents } from "@/data/local/event";
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

function getMockEvents(): PrediceEventDto[] {
  return Array.isArray(mockEvents.data)
    ? (mockEvents.data as PrediceEventDto[])
    : [];
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
    console.error("[fetchPrediceEventsServer]", error);
    if (error instanceof BackendError && error.status === 404) {
      return [];
    }
    return getMockEvents();
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
    console.error("[fetchPrediceEventByIdServer]", error);
    if (error instanceof BackendError && error.status === 404) {
      return null;
    }
    const eventId = Number(id);
    if (!Number.isFinite(eventId)) {
      return null;
    }
    return getMockEvents().find((event) => event.id === eventId) ?? null;
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
