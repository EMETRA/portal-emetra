import React from "react";
import { EventInfoProps } from "./types";
import styles from "./EventInfo.module.scss";
import { Text } from "@/components/atoms";
import { Icon } from "@/components/server/atoms";

const EventInfo: React.FC<EventInfoProps> = ({
    modality,
    date,
    location
}) => {
    return (
        <div className={styles.info}>
            
            <div className={styles.modality}>
                <Text>
                    {modality === "virtual"
                        ? "Virtual"
                        : "Presencial"
                    }
                </Text>
            </div>

            <div className={styles.item}>
                <Icon name="Calendar"/>
                <Text className={styles.text}>
                    {date}
                </Text>
            </div> 

            <div className={styles.item}>
                <Icon name="Location"/>
                <Text className={styles.text}>
                    {location}
                </Text>
            </div>

        </div>
    );
};

export default EventInfo;