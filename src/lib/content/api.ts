import { assertOkResponse } from "@/lib/bff/raw";
import type { NewsDetailDto } from "@/lib/content/types";

export async function fetchNewsByIdClient(id: string): Promise<NewsDetailDto> {
  const response = await fetch(`/api/news/${encodeURIComponent(id)}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (response.status === 404) {
    const error = new Error("Noticia no encontrada");
    error.name = "NotFoundError";
    throw error;
  }

  await assertOkResponse(response);
  return response.json() as Promise<NewsDetailDto>;
}
