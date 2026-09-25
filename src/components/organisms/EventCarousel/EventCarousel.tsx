import React from "react";
import { EventCarouselProps } from "./types";
import styles from "./EventCarousel.module.scss";
import classNames from "classnames";
import { EventCard } from "@/components/molecules/EventCard";

/**
 * Componente que muestra una colección de eventos en un carrusel horizontal
 * @param {EventCarouselProps} props - Las propiedades del componente.
 * @param {Event[]} props.events - Lista de eventos a mostrar.
 * @param {string} props.className - Clase CSS adicional para el carrusel.
 * @returns {JSX.Element} Carrusel horizontal de eventos.
 */

const EventCarousel: React.FC<EventCarouselProps> = ({
    events,
    className,
    ...props
}) => {
    return (
        <div
            className={classNames(styles.carousel, className)}
            {...props}
        >
            <div className={styles.track}>
                {events.map((event) => (
                    <EventCard 
                        key={event.id}
                        event={event}
                    />
                ))}
            </div>
        </div>
    );
};

export default EventCarousel;