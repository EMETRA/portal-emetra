import React from "react";
import { EventBenefitCardProps } from "./types";
import styles from "./EventBenefitCard.module.scss";
import { Text } from "@/components/atoms";

const EventBenefitCard: React.FC<EventBenefitCardProps> = ({
    benefit
}) => {
    return (
        <div className={styles.card}>
            <Text
                variant="Large"
                className={styles.title}
            >
                {benefit.title}
            </Text>

            <Text className={styles.description}>
                {benefit.description}
            </Text>
        </div>
    );
};

export default EventBenefitCard;