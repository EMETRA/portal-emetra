import React from "react";
import { EventCardProps } from "./types";
import styles from "./EventCard.module.scss";
import classNames from "classnames";
import { Image } from "@/components/atoms/Image";
import { Text } from "@/components/atoms";
import { Icon } from "@/components/server/atoms";
import Link from "next/link";

/**
 * Componente que representa la información resumida de un evento.
 * @param {EventCardProps} props - Las propiedades del componente.
 * @param {Event} props.event - Información del evento.
 * @param {string} props.className - Clase CSS adicional para la tarjeta.
 * @returns {JSX.Element} - Tarjeta visual del evento.
 */

const EventCard: React.FC<EventCardProps> = ({
    event,
    className,
    ...props
}) => {

    const card = (
        <div
            className={classNames(styles.card, className)}
            {...props}
        >
            <div className={styles.imageContainer}>
                <Image 
                    src={event.image}
                    alt={event.title}
                    className={styles.image}
                />
            </div>

            <div className={styles.content}>
                <Text
                    variant="Large"
                    className={styles.title}
                >
                    {event.title}
                </Text>

                <div className={styles.modality}>
                    <Text className={styles.modalityText}>
                        {event.modality === "virtual"
                            ? "Virtual"
                            : "Presencial"
                        }
                    </Text>
                </div>

                <div className={styles.date}>
                    <Icon name="Calendar" />
                    <Text className={styles.dateText}>
                        {event.date}
                    </Text>
                </div>
            </div>
        </div>
    );

    return (
        <Link
            href={`/evial/${event.id}`}
            className={styles.link}
        >
            {card}
        </Link>
    );
};

export default EventCard;