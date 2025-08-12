"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.scss";
import L from "leaflet";
import LoadingSpinner from "@/components/server/atoms/LoadingSpinner/LoadingSpinner";
import { format, parse } from "date-fns";

function formatDateTimeWithHour(dateStr?: string, hourStr?: string) {
  if (!dateStr) return "";
  let date = parse(dateStr, "dd/MM/yyyy", new Date());
  if (hourStr) {
    const [h, m] = hourStr.split(":");
    date.setHours(Number(h), Number(m));
    return format(date, "dd/MM/yyyy 'a las' h:mm a");
  }
  return format(date, "dd/MM/yyyy");
}

function parseTitle(title: string) {
  return title
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .toLocaleUpperCase();
}

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

const locationIcon = new L.Icon({
  iconUrl: "/icons/Location.svg",
  iconRetinaUrl: "/icons/Location.svg",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowSize: [50, 20],
  shadowAnchor: [15, 20],
});

type Event = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  start?: string;
  end?: string;
  horai?: string;
  horaf?: string;
  aforo?: number;
  parqueosDisponibles?: number;
};
export type MapProps = {
  events?: Event[];
};

export default function Map({ events = [] }: MapProps) {
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
          <LoadingSpinner variant="inline" />
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
            <Popup>Tu ubicación actual</Popup>
          </Marker>
          {events.map((event) => (
            <Marker
              key={event.id}
              position={[event.lat, event.lng]}
              icon={locationIcon}
            >
              <Popup>
                <strong>{parseTitle(event.name)}</strong>
                <br />
                {event.start && (
                  <>
                    <span>
                      Inicio: {formatDateTimeWithHour(event.start, event.horai)}
                    </span>
                    <br />
                  </>
                )}
                {event.end && (
                  <>
                    <span>
                      Fin: {formatDateTimeWithHour(event.end, event.horaf)}
                    </span>
                    <br />
                  </>
                )}
                {event.aforo !== undefined && (
                  <>
                    <span>Aforo: {event.aforo}</span>
                    <br />
                  </>
                )}
                {event.parqueosDisponibles !== undefined && (
                  <>
                    <span>Parqueos: {event.parqueosDisponibles}</span>
                  </>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
