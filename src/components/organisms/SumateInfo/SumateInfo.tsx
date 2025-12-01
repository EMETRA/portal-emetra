import React from 'react';
import imageDesktop from "@assets/images/Info-desktop.png";
import imageMobile from "@assets/images/Info-mobile.png";
import imageTablet from "@assets/images/Info-tablet.png";
import { FullImage } from '@/components/molecules';

const SumateInfo: React.FC = () => {
    return (
        <FullImage
            desktopImageUrl={imageDesktop}
            mobileImageUrl={imageMobile}
            tabletImageUrl={imageTablet}
            alt="Portada de Súmate"
        />
    );
};

export default SumateInfo;