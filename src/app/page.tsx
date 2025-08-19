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

export default function Home() {
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

      <NewsCarrousel>
        <NewCard
          id="1"
          title="Noticia 1"
          date="19 de Agosto, 2025"
          image="/images/Evento.jpg"
        />
        <NewCard
          id="2"
          title="Noticia 2"
          date="18 de Agosto, 2025"
          image="/images/Evento.jpg"
        />
        <NewCard
          id="3"
          title="Noticia 3"
          date="17 de Agosto, 2025"
          image="/images/Evento.jpg"
        />
        <NewCard
          id="4"
          title="Noticia 4"
          date="16 de Agosto, 2025"
          image="/images/Evento.jpg"
        />
        <NewCard
          id="5"
          title="Noticia 5"
          date="15 de Agosto, 2025"
          image="/images/Evento.jpg"
        />
        <NewCard
          id="6"
          title="Noticia 6"
          date="14 de Agosto, 2025"
          image="/images/Evento.jpg"
        />
        <NewCard
          id="7"
          title="Noticia 7"
          date="13 de Agosto, 2025"
          image="/images/Evento.jpg"
        />

        <NewCard
          id="8"
          title="Noticia 8"
          date="12 de Agosto, 2025"
          image="/images/Evento.jpg"
        />
        {/* ...más cards */}
      </NewsCarrousel>
      <Separator>
        <h1 className={classNames(styles.Title)}>Preguntas Frecuentes</h1>
      </Separator>
    </div>
  );
}
