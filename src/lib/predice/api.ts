import { parseApiErrorPayload } from "@/lib/api/errors";
import type {
  CreatePrediceEventPayload,
  PrediceEventDto,
} from "@/lib/predice/types";

export type {
  CreatePrediceEventPayload,
  PrediceEventDto,
  PrediceEventExtendedProps,
  PrediceParkingDto,
} from "@/lib/predice/types";

const DEFAULT_ADMIN_KEY = "admin";

function buildBffUrl(path: string, admin?: string): string {
  const params = new URLSearchParams();
  if (admin) {
    params.set("admin", admin);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export async function createPrediceEvent(
  payload: CreatePrediceEventPayload,
  admin: string = DEFAULT_ADMIN_KEY
) {
  const response = await fetch(buildBffUrl("/api/predice/eventos", admin), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const { error } = await parseApiErrorPayload(response);
    throw new Error(error);
  }

  return response.json();
}

export async function fetchPrediceEventsClient(
  admin: string = DEFAULT_ADMIN_KEY
): Promise<PrediceEventDto[]> {
  const response = await fetch(buildBffUrl("/api/predice/eventos", admin), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    const { error } = await parseApiErrorPayload(response);
    throw new Error(error);
  }

  const data = (await response.json()) as PrediceEventDto[];
  return Array.isArray(data) ? data : [];
}

export async function fetchPrediceEventByIdClient(
  id: string,
  admin: string = DEFAULT_ADMIN_KEY
): Promise<PrediceEventDto | null> {
  const response = await fetch(
    buildBffUrl(`/api/predice/eventos/${id}`, admin),
    {
      headers: { Accept: "application/json" },
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const { error } = await parseApiErrorPayload(response);
    throw new Error(error);
  }

  return (await response.json()) as PrediceEventDto;
}
