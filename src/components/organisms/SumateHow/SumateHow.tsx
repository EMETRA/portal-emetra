import { FullImage } from "@/components/molecules";
import imageDesktop from '@/assets/images/How-desktop.png';
import imageMobile from '@/assets/images/How-mobile.png';

const SumateHow: React.FC = () => {
    return (
        <div>
            <FullImage
                desktopImageUrl={imageDesktop}
                mobileImageUrl={imageMobile}
                alt="Imagen de cómo sumarte"
            />
        </div>
    );
};

export default SumateHow;