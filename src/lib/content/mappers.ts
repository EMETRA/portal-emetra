import { FAQ, FAQ_Type } from "@/schema";
import type { NewsSummaryDto } from "@/lib/content/types";

export type FaqApiDto = {
  id: number;
  categoria: string;
  idioma: string;
  estado: string;
  pregunta: string;
  respuesta: string;
  orden?: number;
  creado: string;
  actualizado: string;
};

export type FaqListResponseDto = {
  items: FaqApiDto[];
  total: number;
  page: number;
  limit: number;
};

export type NewsListResponseDto = {
  items: NewsSummaryDto[];
  total: number;
  page: number;
  limit: number;
};

function mapCategoriaToFaqType(categoria: string): FAQ_Type {
  const normalized = categoria?.toLowerCase();
  switch (normalized) {
    case "pilotos":
      return FAQ_Type.PILOTOS;
    default:
      return FAQ_Type.PILOTOS;
  }
}

export function mapFaqListToSchema(data: FaqListResponseDto): FAQ[] {
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
