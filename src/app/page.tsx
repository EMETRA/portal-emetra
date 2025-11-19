import { Separator } from "@/components/atoms/Separator";
import styles from "./page.module.css";
import { Banner, BannerSlide, ServicesRow } from "@/components/organisms";
import classNames from "classnames";
import { Icon } from "@/components/server/atoms";
import MultimediaCarrousel from "@/components/server/organisms/MultimediaCarrousel/MultimediaCarrousel";
import MultimediaCard from "@/components/server/molecules/MultimediaCard/MultimediaCard";
import CalendarWidget from "@/components/server/molecules/CalendarWidget/CalendarWidget";
import { NewCard } from "@/components/molecules/NewCard";
import NewsCarrousel from "@/components/organisms/NewsCarrousel/NewsCarrousel";
import { FAQ, FAQ_Type } from "@/schema";
import { FAQQuestions } from "@/components/organisms/FAQ-Questions";
import { API_BASE_URL } from "@/lib/config";

interface NewsSummaryDto {
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

function formatDateToSpanish(dateISO?: string | null) {
  if (!dateISO) {
    return "Fecha no disponible";
  }

  const formatter = new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return formatter.format(new Date(dateISO));
}

async function fetchLatestNews(): Promise<NewsSummaryDto[]> {
  try {
    const searchParams = new URLSearchParams({
      estado: "borrador",
      visibilidad: "publica",
      idioma: "es-GT",
      page: "1",
      limit: "10",
    });

    const response = await fetch(`${API_BASE_URL}/news?${searchParams.toString()}`, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error(
        `No fue posible obtener las noticias. Código: ${response.status}`,
      );
    }

    const data: NewsListResponseDto = await response.json();
    return data.items ?? [];
  } catch (error) {
    console.error("Error al obtener las noticias más recientes:", error);
    return [];
  }
}

type NewsState = "draft" | "published" | "archived";
type NewsVisibility = "public" | "private";

type News = {
  id: string;
  titulo: string;
  slug: string;
  idioma: string;
  estado: NewsState;
  visibilidad: NewsVisibility;
  fecha_publicacion: string | null;
  resumen?: string;
  portada_url?: string | null;
  autor?: string;
  etiquetas?: string[];
  created_at?: string;
  updated_at?: string;
};

type PaginatedNewsResponse = {
  items: News[];
  total: number;
  page: number;
  limit: number;
};

async function getNewsMock(params?: {
  estado?: NewsState;
  visibilidad?: NewsVisibility;
  idioma?: string;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedNewsResponse> {
  const limit = params?.limit ?? 8;

  const sample: News[] = [
    {
      id: "1",
      titulo: "Noticia 1",
      slug: "noticia-1",
      idioma: "es",
      estado: "published",
      visibilidad: "public",
      fecha_publicacion: "2025-08-19T10:00:00.000Z",
      portada_url: "/images/Evento.jpg",
    },
    {
      id: "2",
      titulo: "Noticia 2",
      slug: "noticia-2",
      idioma: "es",
      estado: "published",
      visibilidad: "public",
      fecha_publicacion: "2025-08-18T10:00:00.000Z",
      portada_url: "/images/Evento.jpg",
    },
    {
      id: "3",
      titulo: "Noticia 3",
      slug: "noticia-3",
      idioma: "es",
      estado: "published",
      visibilidad: "public",
      fecha_publicacion: "2025-08-17T10:00:00.000Z",
      portada_url: "/images/Evento.jpg",
    },
    {
      id: "4",
      titulo: "Noticia 4",
      slug: "noticia-4",
      idioma: "es",
      estado: "published",
      visibilidad: "public",
      fecha_publicacion: "2025-08-16T10:00:00.000Z",
      portada_url: "/images/Evento.jpg",
    },
    {
      id: "5",
      titulo: "Noticia 5",
      slug: "noticia-5",
      idioma: "es",
      estado: "published",
      visibilidad: "public",
      fecha_publicacion: "2025-08-15T10:00:00.000Z",
      portada_url: "/images/Evento.jpg",
    },
    {
      id: "6",
      titulo: "Noticia 6",
      slug: "noticia-6",
      idioma: "es",
      estado: "published",
      visibilidad: "public",
      fecha_publicacion: "2025-08-14T10:00:00.000Z",
      portada_url: "/images/Evento.jpg",
    },
    {
      id: "7",
      titulo: "Noticia 7",
      slug: "noticia-7",
      idioma: "es",
      estado: "published",
      visibilidad: "public",
      fecha_publicacion: "2025-08-13T10:00:00.000Z",
      portada_url: "/images/Evento.jpg",
    },
    {
      id: "8",
      titulo: "Noticia 8",
      slug: "noticia-8",
      idioma: "es",
      estado: "published",
      visibilidad: "public",
      fecha_publicacion: "2025-08-12T10:00:00.000Z",
      portada_url: "/images/Evento.jpg",
    },
  ];

  return {
    items: sample.slice(0, limit),
    total: sample.length,
    page: 1,
    limit,
  };
}

function formatISODateToEsPretty(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const dtf = new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const s = dtf.format(d); 
  const [dia, , mes, , anio] = s.split(" ");
  const mesCap = mes.charAt(0).toUpperCase() + mes.slice(1);
  return `${dia} de ${mesCap}, ${anio}`;
}


const slides: BannerSlide[] = [
  {
    backgroundImage: "/images/banner.jpg",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    overlayImage: "/images/Logos.png",
  },
  {
    backgroundImage: "/images/banner.jpg",
    text: "Conoce nuestros servicios",
    overlayImage: "/images/Logos.png",
  },
];

const DEFAULT_NEWS_IMAGE = "/images/Evento.jpg";

const loremQuestions: FAQ[] = [
  {
    id: 1,
    tipo: FAQ_Type.PILOTOS,
    enLanding: false,
    pregunta: "Lorem ipsum dolor sit amet?",
    respuesta:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.",
  },
  {
    id: 2,
    tipo: FAQ_Type.PILOTOS,
    enLanding: false,
    pregunta: "Vestibulum auctor dapibus neque?",
    respuesta:
      "Vestibulum auctor dapibus neque. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.",
  },
  {
    id: 3,
    tipo: FAQ_Type.PILOTOS,
    enLanding: false,
    pregunta: "Cras mattis consectetur purus sit amet fermentum?",
    respuesta:
      "Cras mattis consectetur purus sit amet fermentum. Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo.",
  },
  {
    id: 4,
    tipo: FAQ_Type.PILOTOS,
    enLanding: false,
    pregunta: "Maecenas sed diam eget risus varius blandit?",
    respuesta:
      "Maecenas sed diam eget risus varius blandit sit amet non magna. Aenean lacinia bibendum nulla sed consectetur.",
  },
  {
    id: 5,
    tipo: FAQ_Type.PILOTOS,
    enLanding: false,
    pregunta: "Donec ullamcorper nulla non metus auctor fringilla?",
    respuesta:
      "Donec ullamcorper nulla non metus auctor fringilla. Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod.",
  },
];

export default async function Home() {
  const latestNews = await fetchLatestNews();

  return (
    <div className={styles.page}>
      <Banner slides={slides} />
      <Separator>
        <h1 className={classNames(styles.Title)}>Nuestros Servicios</h1>
      </Separator>
      <ServicesRow />
      <div className={classNames(styles.Services)}>
        <CalendarWidget />
        <div className={classNames(styles.VideosHeading)}>
          <h2 className={classNames(styles.VideosTitle)}>
            Videos sobre nosotros
          </h2>
          <MultimediaCarrousel>
            <MultimediaCard
              src={"https://www.w3schools.com/html/mov_bbb.mp4"}
              title={"Card de Vídeo"}
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
            />
            <MultimediaCard
              src={"https://www.w3schools.com/html/mov_bbb.mp4"}
              title={"Card de Vídeo"}
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
            />
            <MultimediaCard
              src={"https://www.w3schools.com/html/mov_bbb.mp4"}
              title={"Card de Vídeo"}
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
            />
            <MultimediaCard
              src={"https://www.w3schools.com/html/mov_bbb.mp4"}
              title={"Card de Vídeo"}
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
            />
          </MultimediaCarrousel>
        </div>
      </div>
      <Separator>
        <div className={classNames(styles.Heading)}>
          <Icon name="Notification" className={classNames(styles.Icon)} />
          <h1 className={classNames(styles.Title)}>ÚLTIMAS NOTICIAS</h1>
        </div>
      </Separator>

      {latestNews.length > 0 ? (
        <NewsCarrousel>
          {latestNews.map((news) => (
            <NewCard
              key={news.id}
              id={news.id.toString()}
              title={news.titulo}
              date={formatDateToSpanish(
                news.fecha_publicacion ?? news.creado,
              )}
              image={news.recurso_principal?.url ?? DEFAULT_NEWS_IMAGE}
            />
          ))}
        </NewsCarrousel>
      ) : (
        <p className={styles.noNewsMessage}>
          No hay noticias disponibles por el momento.
        </p>
      )}
      <Separator>
        <h1 className={classNames(styles.Title)}>Preguntas Frecuentes</h1>
      </Separator>
      <FAQQuestions
        questions={loremQuestions}
        variant="No-Landing"
        className={styles.faqQuestions}
      />
    </div>
  );
}
