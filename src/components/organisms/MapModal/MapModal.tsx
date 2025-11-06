'use client';

import { MapModalProps } from "./types";
import { motion } from "framer-motion";
import styles from './MapModal.module.scss';
import classNames from "classnames";
import { IconButton } from "@/components/atoms/IconButton";
import { X } from 'lucide-react';
import { TimeCard } from "@/components/atoms/TimeCard";
import { TrafficStatus } from "@/components/atoms/TrafficStatus";
import { RouteStats } from "@/components/molecules/RouteStats";
import { TrafficChart } from "@/components/molecules/TrafficChart";

export default function MapModal({route, onClose}: MapModalProps) {

    return (
        <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className={classNames(styles.container)}
        >
            <div className={classNames(styles.header)}>
                <h2 className={classNames(styles.title)}>
                    { route.name }
                </h2>
                <IconButton icon={X} onClick={onClose} label="Cerrar" />
            </div>

            <div className={classNames(styles.content)}>
                <TimeCard time={route.today} hour={route.update} />
                <TrafficStatus state={route.state} />
                <RouteStats time={route.time} distance={route.distance} />
                <TrafficChart data={route.days ?? []} />
            </div>

            <div className={classNames(styles.footer)}>
                <button
                    onClick={onClose}
                    className={classNames(styles.button)}
                >
                    Cerrar
                </button>
            </div>
        </motion.div>
    );

};