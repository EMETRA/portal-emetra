'use client';

import { useState } from "react";
import { MapViewProps } from "./types";
import styles from './MapView.module.scss';
import classNames from "classnames";
import dynamic from "next/dynamic";
import { RouteLine } from "@/components/organisms/RouteLine";
import { AnimatePresence, motion } from "framer-motion";
import { MapModal } from "@/components/organisms/MapModal";

const MapContainer = dynamic(
    async () => {
        const mod = await import('react-leaflet');
        return mod.MapContainer;
    },
    { ssr: false }
);

const TileLayer = dynamic(
    async () => {
        const mod = await import('react-leaflet');
        return mod.TileLayer;
    },
    { ssr: false }
);

export default function MapView({ routes }: MapViewProps) {

    const [selectedRoute, setSelectedRoute] = useState<typeof routes[0] | null>();
    const center : [number,number] = [14.6349, -90.5069];

    return (

        <div className={classNames(styles.container)}>

            <MapContainer
                center={center}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {routes.map((r) => (
                    <RouteLine key={r.id} route={r} onSelect={() => setSelectedRoute(r)} />
                ))}
            </MapContainer>

            <AnimatePresence>
                {selectedRoute && (
                    <div>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={classNames(styles.back)}
                            onClick={() => setSelectedRoute(null)}
                        />
                        <MapModal
                            key="sidebar"
                            route={selectedRoute}
                            onClose={() => setSelectedRoute(null)}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );

};