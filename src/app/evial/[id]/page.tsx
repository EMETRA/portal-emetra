'use client'

import { Event } from "@/components/molecules/EventCard";
import { EventHero } from "@/components/organisms/EventHero";
import styles from "./Page.module.scss";
import { Text } from "@/components/atoms";
import { EventBenefits } from "@/components/organisms/EventBenefits";
import { EventTimeline } from "@/components/molecules/EventTimeline";

const event: Event = {
    id: 1,
    title: "Vidas en Ruta Versión en tu Barrio",
    modality: "virtual",
    date: "15 de septiembre de 2026",
    image: "/images/evial18.png",
    location: "8va Calle a la par del parque de la industria Zona 9",
    description: "Descripcion del evento con mucho texto para ver como se renderiza la descripcón ya que a veces la descripción será larga",
    benefits: [
        {
        id: 1,
        title: "Articulo #4",
        description:
            "La condonación a que se refiere el artículo dos de este Acuerdo no aplicará cuando se trate de multas impuestas por transitar en las aceras o banquetas, pasos peatonales y ciclovías, ni multas de mayor cuantía, de conformidad con los artículos 184 numeral 11 y 185 del Reglamento de tránsito."
        }
    ],
    timeline: [
        {
        id: 1,
        time: "08:00 AM",
        title: "Registro",
        description:
            "Ingreso y registro de los participantes.",
        },
        {
        id: 2,
        time: "09:00 AM",
        title: "Bienvenida",
        description:
            "Presentación e introducción al evento.",
        },
        {
        id: 3,
        time: "10:00 AM",
        title: "Conferencia",
        description:
            "Presentación principal sobre innovación en la educación digital.",
        },
        {
        id: 4,
        time: "12:00 PM",
        title: "Cierre",
        description:
            "Conclusiones y cierre de las actividades.",
        },
    ]
};

export default function EvialPage() {
    return (
        <main className={styles.page}>

            <EventHero 
                event={event}
                onRegister={() => console.log('test')}
            />

            <div className={styles.details}>

                <section className={styles.section}>
                    <Text 
                        variant="Large"
                        className={styles.sectionTitle}
                    >
                        Beneficios del evento
                    </Text>
                    {event.benefits && (
                        <EventBenefits 
                            benefits={event.benefits}
                        />
                    )}
                </section>

                <section className={styles.section}>
                    <Text 
                        variant="Large"
                        className={styles.sectionTitle}
                    >
                        Desarrollo de la actividad
                    </Text>
                    {event.timeline && (
                        <EventTimeline 
                            items={event.timeline}
                        />
                    )}
                </section>
                
            </div>
        </main>
    );
};