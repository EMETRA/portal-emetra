import { Route } from "@/components/templates/MapView/MapView";

export interface RouteLineProps {
    route: Route;
    onSelect: () => void;
}