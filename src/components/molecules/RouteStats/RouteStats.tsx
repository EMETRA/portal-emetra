import { RouteStatsProps } from "./types";
import styles from './RouteStats.module.scss';
import classNames from "classnames";
import { InfoText } from "@/components/atoms/InfoText";
import { Clock, Ruler } from "lucide-react";

export default function RouteStats({time, distance}: RouteStatsProps) {

    return (
        <div className={classNames(styles.container)}>
            <InfoText icon={<Clock className={classNames(styles.time)} />} text="minutos promedio" value={time} />
            <InfoText icon={<Ruler className={classNames(styles.distance)} />} text="km de distancia" value={distance} />
        </div>
    );
    
};