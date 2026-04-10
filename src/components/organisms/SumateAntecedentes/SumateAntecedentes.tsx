import React from 'react';
import imageDesktop from "@assets/images/Antecedentes-desktop.png";
import imageMobile from "@assets/images/Antecedentes-mobile.png";
import imageTablet from "@assets/images/Antecedentes-tablet.png";
import { FullImage } from '@/components/molecules';

const SumateAntecedentes: React.FC = () => {
    return (
        <FullImage
            desktopImageUrl={imageDesktop}
            mobileImageUrl={imageMobile}
            tabletImageUrl={imageTablet}
            alt="Portada de Súmate"
        />
    );
};

export default SumateAntecedentes;