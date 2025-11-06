import dynamic from "next/dynamic";
import { RouteLineProps } from "./types";

const Polyline = dynamic(
    async () => {
        const mod = await import('react-leaflet');
        return mod.Polyline;
    },
    { ssr: false }
) as React.ComponentType<any>;

const Tooltip = dynamic(
    async () => {
        const mod = await import('react-leaflet');
        return mod.Tooltip;
    }, 
    { ssr: false }
) as React.ComponentType<any>;

const getColor = (state: string) => {
    switch (state) {
        case 'Libre':
            return 'green';
        case 'Medio':
            return 'orange';
        case 'Alto':
            return 'red';
        default:
            return 'gray';
    }
};

export default function RouteLine({route, onSelect}: RouteLineProps) {

    return (
        <Polyline
            positions={route.coordinates}
            pathOptions={{ color: getColor(route.state), weight: 6 }}
            eventHandlers={{ click: onSelect }}
        >
            <Tooltip>{route.name}</Tooltip>
        </Polyline>
    );
};