import { Separator } from "@/components/atoms/Separator";
import { Banner, BannerSlide } from "@/components/organisms";
import classNames from "classnames";
import styles from './Page.module.scss';
import { EventCard } from "@/components/molecules/EventCard";
import NewsCarrousel from "@/components/organisms/NewsCarrousel/NewsCarrousel";
import MultimediaCarrousel from "@/components/server/organisms/MultimediaCarrousel/MultimediaCarrousel";
import MultimediaCard from "@/components/server/molecules/MultimediaCard/MultimediaCard";

const slides: BannerSlide[] = [
    {
        backgroundImage: "images/banner.jpg",
        text: "Tu centro de Capacitación y Educación Vial de EMETRA. Aquí promovemos prácticas de conducción seguras y responsables para todos. Nos enorgullece ser parte de la formación de una nueva generación de conductores conscientes y bien preparados. Además, con nuestro proyecto VIDAS EN RUTA, capacitamos a conductores en prácticas de conducción responsable y segura, reforzando nuestro compromiso con la seguridad vial. Te invitamos a conocer más sobre nuestros programas y unirte a nuestra misión de hacer las calles y avenidas más seguras para todos. 🚗🚦",
        overlayImage: "images/logos.png"
    }
];

export default function Evial() {

    return (
        <>
            <Banner slides={ slides }/>
            <Separator>
                <h1 className={classNames(styles.Title)}>Nuestros próximos eventos</h1>
            </Separator>
            <MultimediaCarrousel>
                <EventCard 
                    id="1"
                    title="Titulo Evento 1 para pruebas"
                    date="21 Enero 2025"
                    image="/images/Evento.jpg"
                    mode="Virtual"
                />
                <EventCard 
                    id="1"
                    title="Titulo Evento 1 para pruebas"
                    date="21 Enero 2025"
                    image="/images/Evento.jpg"
                    mode="Virtual"
                />
                <EventCard 
                    id="1"
                    title="Titulo Evento 1 para pruebas"
                    date="21 Enero 2025"
                    image="/images/Evento.jpg"
                    mode="Virtual"
                />
            </MultimediaCarrousel>
            <Separator>
                <h1 className={classNames(styles.Title)}>Videos sobre nosotros</h1>
            </Separator>
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
        </>
    );

};