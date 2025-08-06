import Image from "next/image";
import classNames from "classnames";
import styles from "./Page.module.scss";
import { Icon } from "@/components/server/atoms";
import Video from "@/components/server/atoms/Video/Video";
import MultimediaCard from "@/components/server/molecules/MultimediaCard/MultimediaCard";
import MultimediaCarrousel from "@/components/server/organisms/MultimediaCarrousel/MultimediaCarrousel";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function NewPage({ params }: PageProps) {
  const { id } = await params;

  const recursos = [
    "Documento oficial del evento",
    "Presentación PowerPoint disponible",
    "Video de la conferencia completa",
    "Material de apoyo en PDF",
    "Enlaces a sitios web relacionados",
  ];

  return (
    <div>
      <main>
        <div className={classNames(styles.container)}>
          <div className={classNames(styles.imageContainer)}>
            <Image
              src={`/images/Evento.jpg`}
              alt={`Noticia No. ${id}`}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={classNames(styles.content)}>
            <div>
              <h1>Noticia XXXXXXXXXXXXXXX</h1>
              <h2>No. {id}</h2>
              <div className={classNames(styles.dateContainer)}>
                <Icon
                  name="Calendar"
                  className={classNames(styles.calendarIcon)}
                />
                <h3 className={classNames(styles.dateTitle)}>
                  15 de Enero, 2024
                </h3>
              </div>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Necessitatibus atque deleniti natus et eum exercitationem
              dignissimos quos vero, ducimus optio consectetur nihil illum
              perferendis facilis suscipit fuga error numquam deserunt. Eius
              dolor voluptatem maiores officia non pariatur dicta deserunt in
              blanditiis minus modi eos cumque minima molestiae, odio, unde quis
              exercitationem? Quae culpa deserunt distinctio ut a reiciendis
              quod iste! Dolor architecto animi perspiciatis maiores saepe porro
              ullam, voluptatem officia tenetur quos odio quod est adipisci
              tempore suscipit laborum, quae libero. Dolores nobis voluptatibus
              architecto rem iure incidunt. Consectetur, placeat? Tenetur
              numquam exercitationem nesciunt dicta rem illum eaque a, ipsam est
              amet sunt, dignissimos aliquid. Distinctio quos dolorum error
              praesentium, tempore optio, nihil aperiam voluptate impedit hic,
              itaque reiciendis asperiores! Hic ad repudiandae minima impedit
              modi suscipit quibusdam pariatur reiciendis reprehenderit
              consequuntur aspernatur cum vitae possimus illo voluptas beatae,
              magnam accusantium maxime fugit earum totam natus odio fuga.
              Soluta, necessitatibus.
            </p>
          </div>
        </div>

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

  return {
    title: `Noticia No. ${id} - Portal Emetra`,
  };
}
