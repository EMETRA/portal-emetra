import { parseApiErrorPayload } from "@/lib/api/errors";

export class BffError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
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
    const { error, code } = await parseApiErrorPayload(response);
    throw new BffError(error, response.status, code);
  }

  return response.json() as Promise<T>;
}
