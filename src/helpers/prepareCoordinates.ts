import { Route } from "@/components/templates/MapView/MapView";

function prepareCoordinates(route: Route) {
  return route.coordinates.map((coord) => {
    let [a, b] = coord;

    a = parseFloat(a.toString());
    b = parseFloat(b.toString());

    const isLngLat = a < -60 && b > -60;
    if (isLngLat) return [b, a];

    return [a, b];
  });
}

export default prepareCoordinates;
