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

async function parseBffError(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => null)) as
    | { error?: string; message?: string }
    | null;
  return (
    payload?.error ??
    payload?.message ??
    `No fue posible completar la solicitud. Codigo: ${response.status}`
  );
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
    throw new Error(await parseBffError(response));
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
    throw new Error(await parseBffError(response));
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
    throw new Error(await parseBffError(response));
  }

  return (await response.json()) as PrediceEventDto;
}
