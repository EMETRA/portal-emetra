import React from "react";
import { EventTimelineProps } from "./types";
import styles from "./EventTimeline.module.scss";
import { Text } from "@/components/atoms";

const EventTimeline: React.FC<EventTimelineProps> = ({
    items
}) => {
    return (
        <div className={styles.timeline}>
            {items.map((item) => (
                <div
                    key={item.id}
                    className={styles.item}
                >
                    <div className={styles.marker} />
                    <div className={styles.content}>
                        <Text className={styles.time}>
                            {item.time}
                        </Text>
                        <Text
                            variant="Large"
                            className={styles.title}
                        >
                            {item.title}
                        </Text>
                        <Text className={styles.description}>
                            {item.description}
                        </Text>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EventTimeline;