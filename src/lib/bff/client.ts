import { assertOkResponse } from "@/lib/bff/raw";

export class BffError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "BffError";
  }
}

export async function fetchBffJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    cache: init?.cache ?? "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new BffError(body || `HTTP ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}

export { assertOkResponse };
