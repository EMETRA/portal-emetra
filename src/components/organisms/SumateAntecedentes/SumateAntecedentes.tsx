import React from 'react';
import imageDesktop from "@assets/images/Antecedentes-desktop.png";
import imageMobile from "@assets/images/Antecedentes-mobile.png";
import { FullImage } from '@/components/molecules';

const SumateAntecedentes: React.FC = () => {
    return (
        <div>
            <FullImage
                desktopImageUrl={imageDesktop}
                mobileImageUrl={imageMobile}
                alt="Portada de Súmate"
            />
        </div>
    );
};

export default SumateAntecedentes;