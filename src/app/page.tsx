import { Separator } from "@/components/atoms/Separator";
import styles from "./page.module.css";
import { Banner, BannerSlide, ServicesRow } from "@/components/organisms";
import classNames from "classnames";
import { Icon } from "@/components/server/atoms";
import MultimediaCarrousel from "@/components/server/organisms/MultimediaCarrousel/MultimediaCarrousel";
import MultimediaCard from "@/components/server/molecules/MultimediaCard/MultimediaCard";
import CalendarWidgetLoader from "@/components/server/molecules/CalendarWidget/CalendarWidgetLoader";
import { NewCard } from "@/components/molecules/NewCard";
import NewsCarrousel from "@/components/organisms/NewsCarrousel/NewsCarrousel";
import { FAQQuestions } from "@/components/organisms/FAQ-Questions";
import { fetchFaqsServer, fetchLatestNewsServer } from "@/lib/content/server";
import { getUserErrorMessage } from "@/lib/api/errors";
import ServiceErrorAlert from "@/components/molecules/ServiceErrorAlert/ServiceErrorAlert";

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

const slides: BannerSlide[] = [
  {
    backgroundImage: "/images/banner.jpg",
    text: "EMETRA es la Entidad Metropolitana Reguladora de Transporte y Tránsito de la Ciudad de Guatemala. Administra a la Policía Municipal de Tránsito y coordina las acciones necesarias para ordenar la movilidad en la ciudad. Realiza la gestión administrativa, técnica y normativa relacionada con el transporte y el tránsito, vela por el cumplimiento de las regulaciones vigentes y promueve la educación y la seguridad vial para todos los vecinos.",
    overlayImage: "/images/Logos.png",
  },
];

const DEFAULT_NEWS_IMAGE = "/images/Evento.jpg";

export default async function Home() {
  let latestNews: Awaited<ReturnType<typeof fetchLatestNewsServer>> = [];
  let newsError: string | null = null;

  try {
    latestNews = await fetchLatestNewsServer();
  } catch (error) {
    newsError = getUserErrorMessage(
      error,
      "No se pudieron cargar las noticias en este momento."
    );
  }

  let faqQuestions: Awaited<ReturnType<typeof fetchFaqsServer>> = [];
  let faqError: string | null = null;

  try {
    faqQuestions = await fetchFaqsServer();
  } catch (error) {
    faqError = getUserErrorMessage(
      error,
      "No se pudieron cargar las preguntas frecuentes."
    );
  }

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
        <CalendarWidgetLoader />
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
          </MultimediaCarrousel>
        </div>
      </div>
      <Separator>
        <div className={classNames(styles.Heading)}>
          <Icon name="Notification" className={classNames(styles.Icon)} />
          <h1 className={classNames(styles.Title)}>ÚLTIMAS NOTICIAS</h1>
        </div>
      </Separator>

      {newsError ? (
        <ServiceErrorAlert title="Noticias no disponibles" message={newsError} />
      ) : latestNews.length > 0 ? (
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
        {faqError ? (
          <ServiceErrorAlert
            title="Preguntas frecuentes no disponibles"
            message={faqError}
          />
        ) : (
          <FAQQuestions
            questions={faqQuestions}
            variant="No-Landing"
            className={styles.faqQuestions}
          />
        )}
      </section>
    </div>
  );
}
