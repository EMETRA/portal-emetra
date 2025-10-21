import classNames from "classnames";
import styles from './Page.module.scss';
import Image from "next/image";
import { Icon } from "@/components/server/atoms";

interface pageProps {
    params: Promise<{
        id: string
    }>
};

export default async function Event({ params }: pageProps) {

    const { id } = await params;

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
                            <h1>Nombre de evento no. 1 de EVIAL para pruebas de diseño</h1>
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
                        <strong>Descripcion:</strong>
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

                        <div className={classNames(styles.row)}>

                            <div className={classNames(styles.list)}>
                                <div className={classNames(styles.listContainer)}>
                                    <Icon
                                        name="Document"
                                        className={classNames(styles.listIcon)}
                                    />
                                    <h2 className={classNames(styles.listTitle)}>
                                        Requisitos
                                    </h2>
                                </div>
                                <div className={classNames(styles.listContainer)}>
                                    <Icon
                                        name="Down"
                                        className={classNames(styles.bulletIcon)}
                                    />
                                    <h4 className={classNames(styles.listTitle)}>
                                        <b>Motocicleta</b>
                                    </h4>
                                </div>
                                <div className={classNames(styles.listContainer)}>
                                    <Icon
                                        name="Down"
                                        className={classNames(styles.bulletIcon)}
                                    />
                                    <h4 className={classNames(styles.listTitle)}>
                                        <b>Casco (Si no posees se te prestará)</b>
                                    </h4>
                                </div>
                                <div className={classNames(styles.listContainer)}>
                                    <Icon
                                        name="Down"
                                        className={classNames(styles.bulletIcon)}
                                    />
                                    <h4 className={classNames(styles.listTitle)}>
                                        <b>Accesorios de seguridad (Si no posees se te prestará)</b>
                                    </h4>
                                </div>
                            </div>

                            <div className={classNames(styles.list)}>
                                <div className={classNames(styles.listContainer)}>
                                    <Icon
                                        name="Approve"
                                        className={classNames(styles.listIcon)}
                                    />
                                    <h2 className={classNames(styles.listTitle)}>
                                        Reglas a cumplir
                                    </h2>
                                </div>
                                <div className={classNames(styles.listContainer)}>
                                    <Icon
                                        name="Down"
                                        className={classNames(styles.bulletIcon)}
                                    />
                                    <h4 className={classNames(styles.listTitle)}>
                                        <b>Llevar tu equipo</b>
                                    </h4>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
                    
            </main>
        </div>

    );

};