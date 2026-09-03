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
