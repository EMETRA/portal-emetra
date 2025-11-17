import dynamic from "next/dynamic";
import simplify from "simplify-js";
import { RouteLineProps } from "./types";
import prepareCoordinates from "@/helpers/prepareCoordinates";
import interpolateCoordinates from "@/helpers/interpolateCoordinates";
import catmullRomSpline from "@/helpers/catmullRomSpline";

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

const getColor = (state: string) => {
  switch (state) {
    case "Libre":
      return "green";
    case "Medio":
      return "orange";
    case "Alto":
      return "red";
    case "Normal":
      return "blue";
    default:
      return "gray";
  }
};

export default function RouteLine({ route, onSelect }: RouteLineProps) {
  const coords = prepareCoordinates(route);
  const smoothCoords = catmullRomSpline(coords, 25);
  
  return (
    <Polyline
      positions={smoothCoords}
      pathOptions={{ color: getColor(route.state), weight: 6 }}
      eventHandlers={{ click: onSelect }}
    >
      <Tooltip>{route.name}</Tooltip>
    </Polyline>
  );
}
