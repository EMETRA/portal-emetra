export interface Route {
    id: number;
    name: string;
    state: 'Libre' | 'Medio' | 'Alto' | 'Sin datos';
    time: number;
    distance: number;
    coordinates: [number, number][];
    days?: {
        day: string;
        time: number;
    }[],
    today?: number;
    update?: string; 
}

export const routes: Route[] = [
    {
        id: 1,
        name: 'Ruta Roosevelt',
        state: 'Alto',
        time: 45,
        distance: 10.2,
        coordinates: [
            [14.6132, -90.5541],
            [14.6219, -90.5200],
            [14.6349, -90.5069],
        ],
        days: [
            { day: 'Lun', time: 35 },
            { day: 'Mar', time: 40 },
            { day: 'Mié', time: 28 },
            { day: 'Jue', time: 50 },
            { day: 'Vie', time: 65 },
            { day: 'Sáb', time: 20 },
            { day: 'Dom', time: 25 },
        ],
        today: 28,
        update: '10:25'
    },
    {
        id: 2,
        name: 'Ruta Aguilar Batres',
        state: 'Medio',
        time: 30,
        distance: 8.5,
        coordinates: [
            [14.5978, -90.5524],
            [14.6094, -90.5252],
            [14.6210, -90.5100],
        ],
    },
    {
        id: 3,
        name: 'Ruta Las Américas',
        state: 'Libre',
        time: 15,
        distance: 5.3,
        coordinates: [
            [14.6055, -90.5205],
            [14.6108, -90.5069],
            [14.6159, -90.5002],
        ],
    },
    {
        id: 4,
        name: 'Ruta Test',
        state: 'Sin datos',
        time: 15,
        distance: 5.3,
        coordinates: [
            [14.6080, -90.5825],
            [14.6255, -90.4880],
        ],
    },
];