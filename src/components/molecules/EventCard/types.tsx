import React from "react";

/**
 * Información de los beneficios del evento.
*/
interface EventBenefit {
    id: number;
    title: string;
    description?: string;
}

/**
 * Información de las actividades del desarrollo del evento.
*/
interface EventTimeline {
    id: number;
    time: string;
    title: string;
    description?: string;
}

/**
 * Información necesaria para representar un evento.
*/
interface Event {
    id: number;
    title: string;
    modality: "virtual" | "presencial";
    date: string;
    image: string;
    location: string;
    description?: string;
    benefits?: EventBenefit[];
    timeline?: EventTimeline[];
}

/**
 * Propiedades del componente EventCard.
 * @interface EventCardProps
 * @property {Event} event - Información del evento a mostrar.
 * @property {string} [className] - Clase CSS adicional para la tarjeta.
*/
interface EventCardProps extends React.HTMLAttributes<HTMLDivElement> {
    event: Event;
}

export type { EventBenefit, EventTimeline, Event, EventCardProps };