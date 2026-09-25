import React from "react";
import { EventHeroProps } from "./types";
import styles from "./EventHero.module.scss";
import { Image } from "@/components/atoms/Image";
import { Text } from "@/components/atoms";
import { EventInfo } from "@/components/molecules/EventInfo";
import { Button } from "@/components/server/atoms";

const EventHero: React.FC<EventHeroProps> = ({
    event,
    onRegister
}) => {
    return (
        <section className={styles.hero}>
            
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

                <EventInfo 
                    modality={event.modality}
                    date={event.date}
                    location={event.location}
                />

                {event.description && (
                    <Text className={styles.description}>
                        {event.description}
                    </Text>
                )}

                <Button 
                    type="button" 
                    onClick={onRegister}
                >
                    Inscribirme
                </Button>
            </div>
        </section>
    );
};

export default EventHero;