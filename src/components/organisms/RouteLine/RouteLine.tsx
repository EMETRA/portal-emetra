"use client";
import dynamic from "next/dynamic";
import { RouteLineProps } from "./types";
import prepareCoordinates from "@/helpers/prepareCoordinates";
import catmullRomSpline from "@/helpers/catmullRomSpline";
import { FaMapMarkerAlt, FaFlagCheckered } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";

const Polyline = dynamic(
  async () => {
    const mod = await import("react-leaflet");
    return mod.Polyline;
  },
  { ssr: false }
) as React.ComponentType<any>;

const Tooltip = dynamic(
  async () => {
    const mod = await import("react-leaflet");
    return mod.Tooltip;
  },
  { ssr: false }
) as React.ComponentType<any>;

const Marker = dynamic(
  async () => {
    const mod = await import("react-leaflet");
    return mod.Marker;
  },
  { ssr: false }
) as React.ComponentType<any>;

const Popup = dynamic(
  async () => {
    const mod = await import("react-leaflet");
    return mod.Popup;
  },
  { ssr: false }
) as React.ComponentType<any>;

const getColor = (state: string) => {
  switch (state) {
    case "Libre":
      return "#22c55e";
    case "Medio":
      return "#f5970bff";
    case "Alto":
      return "#ef4444";
    case "Lento":
      return "#ef4444";
    case "Normal":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
};

const createDivIcon = (IconComponent: React.ComponentType, color: string) => {
  if (typeof window === "undefined") return null;

  const L = require("leaflet");

  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        fontSize: "28px",
        color: color,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
      }}
    >
      <IconComponent />
    </div>
  );

  return new L.DivIcon({
    html: iconMarkup,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
};

export default function RouteLine({ route, onSelect }: RouteLineProps) {
  let coords;
  try {
    coords = prepareCoordinates(route);
    if (!coords || coords.length < 2) {
      coords = route.coordinates;
    }
  } catch (error) {
    console.warn(`Error en prepareCoordinates para "${route.name}":`, error);
    coords = route.coordinates;
  }

  if (!coords || coords.length < 2) {
    console.warn(`Ruta "${route.name}" no tiene suficientes coordenadas`);
    return null;
  }

  const smoothCoords = catmullRomSpline(coords, 25);
  const color = getColor(route.state);

  const startPoint = smoothCoords[0];
  const endPoint = smoothCoords[smoothCoords.length - 1];

  const isValidPoint = (point: any) =>
    Array.isArray(point) &&
    point.length === 2 &&
    typeof point[0] === "number" &&
    typeof point[1] === "number" &&
    !isNaN(point[0]) &&
    !isNaN(point[1]);

  if (!isValidPoint(startPoint) || !isValidPoint(endPoint)) {
    console.warn(`Ruta "${route.name}" tiene coordenadas inválidas`);
    return (
      <Polyline
        positions={smoothCoords}
        pathOptions={{ color, weight: 6 }}
        eventHandlers={{ click: onSelect }}
      >
        <Tooltip>{route.name}</Tooltip>
      </Polyline>
    );
  }

  const startIcon = createDivIcon(FaMapMarkerAlt, "#314ce7ff");
  const endIcon = createDivIcon(FaMapMarkerAlt, "#ee1b1bff");

  if (!startIcon || !endIcon) {
    return (
      <Polyline
        positions={smoothCoords}
        pathOptions={{ color, weight: 6 }}
        eventHandlers={{ click: onSelect }}
      >
        <Tooltip>{route.name}</Tooltip>
      </Polyline>
    );
  }

  return (
    <>
      <Polyline
        positions={smoothCoords}
        pathOptions={{ color, weight: 6 }}
        eventHandlers={{ click: onSelect }}
      >
        <Tooltip>{route.name}</Tooltip>
      </Polyline>

      <Marker
        position={startPoint}
        icon={startIcon}
        eventHandlers={{ click: onSelect }}
      >
        <Popup>
          <div style={{ textAlign: "center" }}>
            <strong>{route.name.split("-")[0].trim()}</strong>
            <br />
            <small>Punto de inicio</small>
          </div>
        </Popup>
      </Marker>

      <Marker
        position={endPoint}
        icon={endIcon}
        eventHandlers={{ click: onSelect }}
      >
        <Popup>
          <div style={{ textAlign: "center" }}>
            <strong>
              {route.name.includes("-") ? route.name.split("-")[1].trim() : route.name}
            </strong>
            <br />
            <small>Punto final</small>
          </div>
        </Popup>
      </Marker>
    </>
  );
}
