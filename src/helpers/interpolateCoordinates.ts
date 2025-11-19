import { de } from "zod/v4/locales";

function interpolateCoordinates(coords: any, steps = 20) {
  if (!coords || coords.length < 2) return coords;

  const result = [];

  for (let i = 0; i < coords.length - 1; i++) {
    const [lat1, lng1] = coords[i];
    const [lat2, lng2] = coords[i + 1];

    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const lat = lat1 + (lat2 - lat1) * t;
      const lng = lng1 + (lng2 - lng1) * t;
      result.push([lat, lng]);
    }
  }

  result.push(coords[coords.length - 1]);

  return result;
}

export default interpolateCoordinates;