import type { TrafficStatusProps } from "./types";
import { TrafficCone } from "lucide-react";
import styles from './TrafficStatus.module.scss';
import classNames from "classnames";

export default function TrafficStatus({state}: TrafficStatusProps) {

    const getTrafficColor = (state: string) => {
        switch (state) {
            case 'Alto':
                return styles.alto;
            case 'Medio':
                return styles.medio;
            case 'Libre':
                return styles.libre;
            default:
                return styles.default;
        }
    };

    return (
        <div className={classNames(styles.container, getTrafficColor(state))}>
            <div className="elements">
                <TrafficCone className={classNames(styles.icon)} />
                &nbsp;
                <span>{ state }</span>
            </div>
        </div>
    );

};