import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./EventCard.module.scss";
import { Icon } from "@/components/server/atoms";

interface EventCardProps {
    id: string;
    title: string;
    image: string;
    date: string;
    mode: string;
    className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
    id,
    title,
    image,
    date,
    mode,
    className
}) => (
    <Link href={`/event/${id}`} className={classNames(styles.card, className)}>
        <div className={classNames(styles.imageWrapper)}>
            <Image src={ image } alt={ title } fill className={classNames(styles.image)} />
        </div>
        <div className={classNames(styles.content)}>
            <h2 className={classNames(styles.title)}>
                { title }
            </h2>
            <div className={classNames(styles.details)}>
                <h4 className={classNames(styles.items)}>
                    <Icon name="Calendar" className={classNames(styles.Icon)} /> { date } 
                </h4>
                <h4 className={classNames(styles.items)}>
                    <Icon name="User" className={classNames(styles.Icon)} /> { mode } 
                </h4>
            </div>
        </div>
    </Link>
);

export default EventCard;