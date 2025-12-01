import { FullImage } from "@/components/molecules";
import imageDesktop from '@/assets/images/How-desktop.png';
import imageMobile from '@/assets/images/How-mobile.png';
import imageTablet from '@/assets/images/How-tablet.png';

const SumateHow: React.FC = () => {
    return (
        <FullImage
            desktopImageUrl={imageDesktop}
            mobileImageUrl={imageMobile}
            tabletImageUrl={imageTablet}
            alt="Imagen de cómo sumarte"
        />
    );
};

export default SumateHow;