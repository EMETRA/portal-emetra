import Image from "next/image";
import classNames from "classnames";
import { notFound } from "next/navigation";
import styles from "./Page.module.scss";
import { Icon } from "@/components/server/atoms";
import MultimediaCard from "@/components/server/molecules/MultimediaCard/MultimediaCard";
import MultimediaCarrousel from "@/components/server/organisms/MultimediaCarrousel/MultimediaCarrousel";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  "http://localhost:4001";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ResourceSummaryDto {
  id: number;
  nombre?: string | null;
  url?: string | null;
}

interface CategorySummaryDto {
  id: number;
  nombre?: string | null;
  slug?: string | null;
}

interface TagSummaryDto {
  id: number;
  nombre?: string | null;
  slug?: string | null;
}

interface NewsResponseDto {
  id: number;
  slug: string;
  titulo: string;
  resumen?: string | null;
  estado: string;
  visibilidad: string;
  fecha_publicacion?: string | null;
  recurso_principal?: ResourceSummaryDto | null;
  recurso_og?: ResourceSummaryDto | null;
  idioma: string;
  tiempo_lectura?: number | null;
  meta_titulo?: string | null;
  meta_descripcion?: string | null;
  url_canonica?: string | null;
  creado_por?: number | null;
  actualizado_por?: number | null;
  categorias?: CategorySummaryDto[];
  etiquetas?: TagSummaryDto[];
  creado: string;
  actualizado: string;
}

async function fetchNewsById(id: string): Promise<NewsResponseDto> {
  const response = await fetch(`${API_BASE_URL}/news/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 300,
    },
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(
      `No fue posible obtener la noticia con id ${id}. Código: ${response.status}`,
    );
  }

  return response.json();
}

function formatDateToSpanish(dateISO?: string | null) {
  if (!dateISO) {
    return null;
  }

  const format = new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return format.format(new Date(dateISO));
}

export default async function NewPage({ params }: PageProps) {
  const { id } = await params;
  const news = await fetchNewsById(id);
  const publicationDate = formatDateToSpanish(news.fecha_publicacion);
  const coverImage =
    news.recurso_principal?.url ?? "/images/Evento.jpg";

  const secciones = [
    {
      titulo: "Contenido",
      subtitulos: [
        {
          subtitulo: "Resumen",
          contenido:
            news.resumen ??
            "No hay un resumen disponible para esta noticia por el momento.",
        },
      ],
    },
    {
      titulo: "Categorías",
      subtitulos:
        news.categorias?.map((categoria) => ({
          subtitulo: categoria.nombre ?? "Categoría",
          contenido: `Slug: ${categoria.slug ?? "sin slug"}`,
        })) ?? [],
    },
    {
      titulo: "Etiquetas",
      subtitulos:
        news.etiquetas?.map((etiqueta) => ({
          subtitulo: etiqueta.nombre ?? "Etiqueta",
          contenido: `Slug: ${etiqueta.slug ?? "sin slug"}`,
        })) ?? [],
    },
  ].filter((section) => section.subtitulos.length > 0);

  const recursos = [
    news.url_canonica && `Visita la noticia oficial: ${news.url_canonica}`,
    news.recurso_principal?.url &&
      `Recurso principal: ${news.recurso_principal.url}`,
    news.recurso_og?.url && `Open Graph: ${news.recurso_og.url}`,
  ].filter(Boolean) as string[];

  return (
    <div>
      <main>
        <div className={classNames(styles.container)}>
          <div className={classNames(styles.imageContainer)}>
            <Image
              src={coverImage}
              alt={news.titulo}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={classNames(styles.content)}>
            <div>
              <h1>{news.titulo}</h1>
              <h2>No. {news.id}</h2>
              <div className={classNames(styles.dateContainer)}>
                <Icon
                  name="Calendar"
                  className={classNames(styles.calendarIcon)}
                />
                <h3 className={classNames(styles.dateTitle)}>
                  {publicationDate ?? "Fecha no disponible"}
                </h3>
              </div>
            </div>
            {news.resumen && <p>{news.resumen}</p>}
          </div>
        </div>

        {secciones.length > 0 && (
          <div className={classNames(styles.sections)}>
            {secciones.map((seccion, idx) => (
              <section key={idx} className={classNames(styles.section)}>
                <h2 className={classNames(styles.sectionTitle)}>
                  {seccion.titulo}
                </h2>
                {seccion.subtitulos.map((sub, subIdx) => (
                  <div key={subIdx} className={classNames(styles.subsection)}>
                    <h3 className={classNames(styles.sectionSubtitle)}>
                      {sub.subtitulo}
                    </h3>
                    <p className={classNames(styles.sectionContent)}>
                      {sub.contenido}
                    </p>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}

        {recursos.length > 0 && (
          <div className={classNames(styles.resourcesSection)}>
            <div className={classNames(styles.resourcesContainer)}>
              <h3 className={classNames(styles.resourcesTitle)}>
                Recursos de la Noticia
              </h3>
              <div className={classNames(styles.resourcesList)}>
                {recursos.map((recurso, index) => (
                  <div key={index} className={classNames(styles.resourceItem)}>
                    <span className={classNames(styles.resourceBullet)}>•</span>
                    <span className={classNames(styles.resourceText)}>
                      {recurso}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <MultimediaCarrousel>
          <MultimediaCard
            src={"https://www.w3schools.com/html/mov_bbb.mp4"}
            title={"Card de Vídeo"}
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
          />
          <MultimediaCard
            src={"https://www.youtube.com/watch?v=BeQ3WV8lANE"}
            title={"Card de Vídeo"}
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
          />
          <MultimediaCard
            src={"https://www.youtube.com/watch?v=BeQ3WV8lANE"}
            title={"Card de Vídeo"}
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
          />
          <MultimediaCard
            src={"https://www.youtube.com/watch?v=BeQ3WV8lANE"}
            title={"Card de Vídeo"}
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
          />
        </MultimediaCarrousel>
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const news = await fetchNewsById(id);

  return {
    title:
      news.meta_titulo ??
      `Noticia No. ${news.id} - Portal Emetra`,
    description: news.meta_descripcion ?? news.resumen ?? undefined,
    alternates: news.url_canonica
      ? {
          canonical: news.url_canonica,
        }
      : undefined,
  };
}
