import { Separator } from "@/components/atoms/Separator";
import styles from "./page.module.css";
import { Banner, BannerSlide, ServicesRow } from "@/components/organisms";
import classNames from "classnames";
import MultimediaCarrousel from "@/components/server/organisms/MultimediaCarrousel/MultimediaCarrousel";
import MultimediaCard from "@/components/server/molecules/MultimediaCard/MultimediaCard";
import CalendarWidgetFetcher from "@/components/client/CalendarWidgetFetcher/CalendarWidgetFetcher";
import HomeNewsSection from "@/components/client/HomeNewsSection/HomeNewsSection";
import HomeFaqSection from "@/components/client/HomeFaqSection/HomeFaqSection";

const slides: BannerSlide[] = [
  {
    backgroundImage: "/images/banner.jpg",
    text: "EMETRA es la Entidad Metropolitana Reguladora de Transporte y Tránsito de la Ciudad de Guatemala. Administra a la Policía Municipal de Tránsito y coordina las acciones necesarias para ordenar la movilidad en la ciudad. Realiza la gestión administrativa, técnica y normativa relacionada con el transporte y el tránsito, vela por el cumplimiento de las regulaciones vigentes y promueve la educación y la seguridad vial para todos los vecinos.",
    overlayImage: "/images/Logos.png",
  },
];

export default function Home() {
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
        <CalendarWidgetFetcher />
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
      <HomeNewsSection />
      <HomeFaqSection />
    </div>
  );
}
