"use client";

import { LoadingSpinner } from "@/components/server/atoms/LoadingSpinner";
import { MapView } from "@/components/templates/MapView";
import { Route } from "@/components/templates/MapView/MapView";
import { useRoutes } from "@/data/remote/route/useRoutes";

const Page: React.FC = () => {
  const { routes, loading, error } = useRoutes();
  if (loading) return <LoadingSpinner variant="page-wide" />;

  const items: Route[] = [
        {
            "id": 1,
            "name": "Ruta Centro",
            "state": "Libre",
            "time": 11.133333333333333,
            "distance": 0.42841558256470635,
            "coordinates": [
                [
                    14.650464,
                    -90.499237
                ],
                [
                    14.653015,
                    -90.498915
                ],
                [
                    14.652731,
                    -90.496017
                ]
            ],
            "days": [],
            "today": 11.133333333333333,
            "update": "12/11/2025 07:21:15"
        },
        {
            "id": 2,
            "name": "Proceres-Arkadia",
            "state": "Medio",
            "time": 30.316666666666666,
            "distance": 0.45431250282405994,
            "coordinates": [
                [
                    14.620649,
                    -90.518962
                ],
                [
                    14.620603,
                    -90.522118
                ],
                [
                    14.622208,
                    -90.522865
                ]
            ],
            "days": [],
            "today": 30.316666666666666,
            "update": "14/11/2025 03:52:53"
        },
        {
            "id": 3,
            "name": "20 calle zona 10-Pradera",
            "state": "Lento",
            "time": 42.916666666666664,
            "distance": 1.3238292368563749,
            "coordinates": [
                [
                    14.590801,
                    -90.523739
                ],
                [
                    14.597966,
                    -90.519549
                ],
                [
                    14.601322,
                    -90.517981
                ]
            ],
            "days": [],
            "today": 42.916666666666664,
            "update": "09/11/2025 08:51:17"
        },
        {
            "id": 4,
            "name": "13 calle zona 10-Reforma",
            "state": "Alto",
            "time": 4.8,
            "distance": 1.4277878511979865,
            "coordinates": [
                [
                    14.601036,
                    -90.510564
                ],
                [
                    14.601418,
                    -90.510132
                ],
                [
                    14.59365,
                    -90.505398
                ],
                [
                    14.594855,
                    -90.505833
                ],
                [
                    14.589738,
                    -90.503322
                ],
                [
                    14.590169,
                    -90.503496
                ]
            ],
            "days": [],
            "today": 4.8,
            "update": "14/11/2025 04:56:45"
        }
    ];

  return (
    <>
      {/* <MapView routes={error ? [] : routes} /> */}
      <MapView routes={items} />
    </>
  );
};

export default Page;
