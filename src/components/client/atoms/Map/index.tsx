"use client";
import dynamic from "next/dynamic";
import type { MapProps } from "./Map";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function MapClientWrapper(props: MapProps) {
  return <Map events={props.events} />;
}
