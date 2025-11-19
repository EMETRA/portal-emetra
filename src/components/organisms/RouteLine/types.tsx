import { Route } from "@/data/routesData";

export interface RouteLineProps {
    route: Route;
    onSelect: () => void;
}