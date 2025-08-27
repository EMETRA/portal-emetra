'use client';
import React, { useEffect, useState } from 'react';
import styles from './fullimage.module.scss';

type ImportedImg = string | { src: string };
const toUrl = (img: ImportedImg): string =>
    typeof img === 'string' ? img : img.src;

type FullImageProps = {
    desktopImageUrl: ImportedImg;
    mobileImageUrl: ImportedImg;
    alt?: string;
};

const FullImage: React.FC<FullImageProps> = ({
    desktopImageUrl,
    mobileImageUrl,
    alt = 'Imagen',
}) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener?.('change', update);
        return () => mq.removeEventListener?.('change', update);
    }, []);

    return (
        <div className={styles.fullImagePage}>
            <img
                src={isMobile ? toUrl(mobileImageUrl) : toUrl(desktopImageUrl)}
                alt={alt}
                className={styles.image}
            />
        </div>
    );
};

export default FullImage;
