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
    console.log('Fetching news from:', `${API_BASE_URL}/news?${searchParams.toString()}`);
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

function mapCategoriaToFaqType(categoria: string): FAQ_Type {
  const normalized = categoria?.toLowerCase();

  switch (normalized) {
    case "pilotos":
      return FAQ_Type.PILOTOS;
    default:
      return FAQ_Type.PILOTOS;
  }
}

async function fetchFaqs(): Promise<FAQ[]> {
  try {
    const searchParams = new URLSearchParams({
      estado: "activo",
      page: "1",
      limit: "50",
    });

    const url = `${API_BASE_URL}/faq?${searchParams.toString()}`;
    console.log("Fetching FAQs from:", url);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error(
        `No fue posible obtener las FAQs. Código: ${response.status}`,
      );
    }

    const data: FaqListResponseDto = await response.json();

    const faqs: FAQ[] =
      data.items?.map((item) => ({
        id: item.id,
        tipo: mapCategoriaToFaqType(item.categoria),
        enLanding: false,
        pregunta: item.pregunta,
        respuesta: item.respuesta,
      })) ?? [];

    return faqs;
  } catch (error) {
    console.error("Error al obtener las FAQs:", error);
    return [];
  }
}

const slides: BannerSlide[] = [
  {
    backgroundImage: "/images/banner.jpg",
    text: "EMETRA es la Entidad Metropolitana Reguladora de Transporte y Tránsito de la Ciudad de Guatemala. Administra a la Policía Municipal de Tránsito y coordina las acciones necesarias para ordenar la movilidad en la ciudad. Realiza la gestión administrativa, técnica y normativa relacionada con el transporte y el tránsito, vela por el cumplimiento de las regulaciones vigentes y promueve la educación y la seguridad vial para todos los vecinos.",
    overlayImage: "/images/Logos.png",
  },
  // {
  //   backgroundImage: "/images/banner.jpg",
  //   text: "Conoce nuestros servicios",
  //   overlayImage: "/images/Logos.png",
  // },
];

const DEFAULT_NEWS_IMAGE = "/images/Evento.jpg";

export default async function Home() {
  const latestNews = await fetchLatestNews();
  const faqQuestions = await fetchFaqs();

  return (
    <div className={styles.page}>
      <Banner slides={slides} />
      <section id="servicios">
        <Separator>
          <h1 className={classNames(styles.Title)}>Nuestros Servicios</h1>
        </Separator>
      </section>      
      <ServicesRow />
      <div className={classNames(styles.Services)}>
        <CalendarWidget />
        <div className={classNames(styles.VideosHeading)}>
          <h2 className={classNames(styles.VideosTitle)}>
            Videos sobre nosotros
          </h2>
          <MultimediaCarrousel>
            <MultimediaCard
              src={"https://www.youtube.com/watch?v=k7GpknPnk1A"}
              title={"Card de Vídeo"}
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
            />
            <MultimediaCard
              src={"https://www.youtube.com/watch?v=QsxsN9JVB0A"}
              title={"Card de Vídeo"}
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
            />
            {/* <MultimediaCard
              src={"https://www.w3schools.com/html/mov_bbb.mp4"}
              title={"Card de Vídeo"}
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
            />
            <MultimediaCard
              src={"https://www.w3schools.com/html/mov_bbb.mp4"}
              title={"Card de Vídeo"}
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam consequatur necessitatibus natus eum atque architecto provident nostrum blanditiis ad adipisci, repellat rerum omnis magnam, asperiores quo praesentium alias minima odio."
            /> */}
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
      <section id="ayuda">
        <FAQQuestions
          questions={faqQuestions}
          variant="No-Landing"
          className={styles.faqQuestions}
        />
      </section>
    </div>
  );
}
