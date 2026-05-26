import { NextResponse } from "next/server";
import { apiErrorFromUnknown } from "@/lib/api/errors";
import { fetchNewsByIdServer } from "@/lib/content/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const news = await fetchNewsByIdServer(id);
    return NextResponse.json(news);
  } catch (error) {
    return apiErrorFromUnknown(error, "No se pudo cargar la noticia");
  }
}
