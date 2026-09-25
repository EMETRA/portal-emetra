import { Event } from "@/components/molecules/EventCard";
import { Banner, BannerSlide } from "@/components/organisms";
import { EventCarousel } from "@/components/organisms/EventCarousel";
import { SectionTitle } from "@/components/server/molecules";

const slides: BannerSlide[] = [
    {
        backgroundImage: "/images/evial_hero.png",
        text: `Tu centro de Capacitación y Educación Vial de EMETRA. Aquí promovemos prácticas de conducción seguras y responsables para todos. Nos enorgullece ser parte de la formación de una nueva generación de conductores consientes y bien preparados. Además, con nuestro proyecto VIDAS EN RUTA, capacitamos a conductores en prácticas de conducción responsable y segura, reforzando nuestro compromiso con la seguridad vial. Te invitamos a conocer más sobre nuestros programas y unirte a nuestra misión de hacer las calles y avenidas más seguras para todos.`,
        overlayImage: "/images/Logos.png",
    }
];

const events: Event[] = [
    {
        id: 1,
        title: "Innovación en la educación digital",
        modality: "virtual",
        date: "15 de septiembre de 2026",
        image: "/images/evial18.png",
        location: "8va Calle a la par del parque de la industria Zona 9"
    },
    {
        id: 2,
        title: "Seguridad vial y movilidad urbana digital",
        modality: "presencial",
        date: "20 de septiembre de 2026",
        image: "/images/evial18.png",
        location: "8va Calle a la par del parque de la industria Zona 9"
    },
    {
        id: 3,
        title: "Educación vial",
        modality: "virtual",
        date: "25 de septiembre de 2026",
        image: "/images/evial18.png",
        location: "8va Calle a la par del parque de la industria Zona 9"
    }
];

export default function EvialPage() {
    return (
        <div>
            <Banner slides={slides}/>
            <SectionTitle>Próximos eventos</SectionTitle>
            <EventCarousel 
                events={events}
            />
        </div>
    );
};