'use client';

import { MapView } from '@/components/templates/MapView';
import { routes } from '@/data/routesData';


const Page: React.FC = () => {

    return (
        <>
            <MapView routes={routes} />
        </>
    );
};

export default Page;