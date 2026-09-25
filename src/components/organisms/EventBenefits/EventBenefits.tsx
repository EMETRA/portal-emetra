import React from "react";
import { EventBenefitsProps } from "./types";
import styles from "./EventBenefits.module.scss";
import EventBenefitCard from "@/components/molecules/EventBenefitCard/EventBenefitCard";

const EventBenefits: React.FC<EventBenefitsProps> = ({
    benefits
}) => {
    return (
        <div className={styles.grid}>
            {benefits.map((benefit) => (
                <EventBenefitCard 
                    key={benefit.id}
                    benefit={benefit}
                />
            ))}
        </div>
    );
};

export default EventBenefits;