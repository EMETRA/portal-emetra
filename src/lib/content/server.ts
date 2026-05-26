import "server-only";

import { FAQ, FAQ_Type } from "@/schema";
import { BackendError, backendFetch } from "@/lib/backend/client";
import { notFound } from "next/navigation";

export interface NewsSummaryDto {
  id: number;
  slug: string;
  titulo: string;
  resumen?: string | null;
  estado: string;
  visibilidad: string;
  fecha_publicacion?: string | null;
  idioma: string;
  creado: string;
  actualizado: string;
  recurso_principal?: {
    id: number;
    nombre?: string | null;
    url?: string | null;
  } | null;
}

interface NewsListResponseDto {
  items: NewsSummaryDto[];
  total: number;
  page: number;
  limit: number;
}

interface FaqApiDto {
  id: number;
  categoria: string;
  idioma: string;
  estado: string;
  pregunta: string;
  respuesta: string;
  orden?: number;
  creado: string;
  actualizado: string;
}

interface FaqListResponseDto {
  items: FaqApiDto[];
  total: number;
  page: number;
  limit: number;
}

export interface NewsDetailDto extends NewsSummaryDto {
  recurso_og?: {
    id: number;
    nombre?: string | null;
    url?: string | null;
  } | null;
  tiempo_lectura?: number | null;
  meta_titulo?: string | null;
  meta_descripcion?: string | null;
  url_canonica?: string | null;
  categorias?: Array<{ id: number; nombre?: string | null; slug?: string | null }>;
  etiquetas?: Array<{ id: number; nombre?: string | null; slug?: string | null }>;
}

function mapCategoriaToFaqType(categoria: string): FAQ_Type {
  const normalized = categoria?.toLowerCase();
  switch (normalized) {
    case "pilotos":
      return FAQ_Type.PILOTOS;
    default:
      return FAQ_Type.PILOTOS;
  }
}

export async function fetchLatestNewsServer(): Promise<NewsSummaryDto[]> {
  const searchParams = new URLSearchParams({
    estado: "borrador",
    visibilidad: "publica",
    idioma: "es-GT",
    page: "1",
    limit: "10",
  });
  const data = await backendFetch<NewsListResponseDto>(
    `/news?${searchParams.toString()}`,
    { next: { revalidate: 300 } }
  );
  return data.items ?? [];
}

export async function fetchFaqsServer(): Promise<FAQ[]> {
  const searchParams = new URLSearchParams({
    estado: "activo",
    page: "1",
    limit: "50",
  });
  const data = await backendFetch<FaqListResponseDto>(
    `/faq?${searchParams.toString()}`,
    { next: { revalidate: 300 } }
  );

  return (
    data.items?.map((item) => ({
      id: item.id,
      tipo: mapCategoriaToFaqType(item.categoria),
      enLanding: false,
      pregunta: item.pregunta,
      respuesta: item.respuesta,
    })) ?? []
  );
}

export async function fetchNewsByIdServer(id: string): Promise<NewsDetailDto> {
  try {
    return await backendFetch<NewsDetailDto>(`/news/${id}`, {
      next: { revalidate: 300 },
    });
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
