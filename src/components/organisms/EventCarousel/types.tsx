import { Event } from "@/components/molecules/EventCard";
import React from "react";

/**
 * Propiedades del componente EventCarrousel, este organismo mostrará los eventos vigentes
 * @interface EventCarouselProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @property {Event []} events - Lista de eventos a mostrar en el carrusel.
 */

interface EventCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
    events: Event[];
}

export type { EventCarouselProps };