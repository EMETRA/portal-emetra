import type { TimeCardProps } from "./types";
import styles from './TimeCard.module.scss';
import classNames from "classnames";
import { Clock } from "lucide-react";

export default function TimeCard({time, hour}: TimeCardProps) {

    return (
        <div className={classNames(styles.card)}>
            <div className={classNames(styles.iconContainer)}>
                <Clock className={classNames(styles.icon)} />
            </div>
            <div>
                <p className={classNames(styles.subtitle)}>
                    Hoy
                </p>
                <p className={classNames(styles.title)}>
                    {time ? `${time} min` : 'Sin datos'}
                </p>
                {time && (
                    <p className={classNames(styles.note)}>
                        Actualizado a las {hour} hrs
                    </p>
                )}
            </div>
        </div>
    );

};