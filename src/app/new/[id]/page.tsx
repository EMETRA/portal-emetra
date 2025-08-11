import Image from "next/image";
import classNames from "classnames";
import styles from "./Page.module.scss";
import { Icon } from "@/components/server/atoms";
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

  const secciones = [
    {
      titulo: "Introducción",
      subtitulos: [
        {
          subtitulo: "Resumen del evento",
          contenido:
            "Esta sección describe brevemente el evento y su importancia para la comunidad.",
        },
        {
          subtitulo: "Contexto",
          contenido:
            "Aquí se explica el contexto general en el que ocurre el evento.",
        },
      ],
    },
    {
      titulo: "Desarrollo",
      subtitulos: [
        {
          subtitulo: "Detalles y participantes",
          contenido:
            "Se detallan los puntos principales tratados y los participantes destacados.",
        },
        {
          subtitulo: "Momentos clave",
          contenido:
            "Descripción de los momentos más importantes del desarrollo.",
        },
      ],
    },
    {
      titulo: "Conclusión",
      subtitulos: [
        {
          subtitulo: "Resultados y próximos pasos",
          contenido:
            "Se resumen los resultados y se mencionan las acciones a seguir.",
        },
      ],
    },
  ];

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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
              illum similique pariatur omnis inventore, dolor quidem unde nisi
              aliquam officiis ipsum voluptatem totam, sint animi maxime nulla
              aspernatur architecto. Perspiciatis. Dolorem, deleniti! Laudantium
              nam autem recusandae porro rerum repellendus, debitis facilis
              cumque eos, deleniti reiciendis atque iste hic eum in esse veniam
              deserunt? Sequi consequatur id, accusantium saepe enim asperiores?
              Sequi, expedita cupiditate mollitia, quaerat culpa obcaecati
              quisquam, dolorum temporibus illo quae nisi error accusamus
              voluptas! Nam obcaecati dicta, natus aspernatur ratione placeat
              itaque iste quidem? Animi dicta earum repellendus? Quas esse
              maxime, incidunt consequuntur, quis neque magnam consequatur est
              ipsam fugiat ducimus quaerat praesentium, quam vitae nemo dolor
              corrupti accusantium tenetur sint voluptates? Est odit maxime
              doloribus quis repellendus.
            </p>
          </div>
        </div>

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
