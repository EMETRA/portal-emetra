"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapInput.module.scss";
import L from "leaflet";

const locationIcon = new L.Icon({
  iconUrl: "/icons/LocationRed.svg",
  iconRetinaUrl: "/icons/LocationRed.svg",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowSize: [50, 20],
  shadowAnchor: [15, 20],
});

interface MapInputProps {
  value?: [number, number];
  onChange?: (coords: [number, number]) => void;
}

function LocationMarker({ value, onChange }: MapInputProps) {
  useMapEvents({
    click(e) {
      onChange?.([e.latlng.lat, e.latlng.lng]);
    },
  });

  return value ? <Marker position={value} icon={locationIcon} /> : null;
}

export default function MapInput({ value, onChange }: MapInputProps) {
  const [position, setPosition] = useState<[number, number]>(
    value || [14.6269386, -90.5160683]
  );

  useEffect(() => {
    if (value) setPosition(value);
  }, [value]);

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
        style={{ minHeight: 300 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          value={position}
          onChange={(coords) => {
            setPosition(coords);
            onChange?.(coords);
          }}
        />
      </MapContainer>
    </div>
  );
}
