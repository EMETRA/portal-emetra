"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.scss";
import L from "leaflet";
import LoadingSpinner from "@/components/server/atoms/LoadingSpinner/LoadingSpinner";

const personaIcon = new L.Icon({
  iconUrl: "/icons/Standing.svg",
  iconRetinaUrl: "/icons/Standing.svg",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowSize: [50, 20],
  shadowAnchor: [15, 20],
});

export default function Map() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          setPosition([14.6269386, -90.5160683]);
        }
      );
    } else {
      setPosition([14.6269386, -90.5160683]);
    }
  }, []);

  return (
    <div className={styles.mapWrapper}>
      {!position ? (
        <div className={styles.loadingWrapper}>
          <LoadingSpinner variant="inline"/>
        </div>
      ) : (
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={personaIcon}>
            <Popup>
              Tu ubicación actual
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}