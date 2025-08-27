import React from 'react';
import imageDesktop from "@assets/images/Info-desktop.png";
import imageMobile from "@assets/images/Info-mobile.png";
import { FullImage } from '@/components/molecules';

const SumateInfo: React.FC = () => {
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

export default SumateInfo;