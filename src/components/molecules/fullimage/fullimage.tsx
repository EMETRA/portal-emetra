'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import styles from './fullimage.module.scss';

type ImportedImg = string | { src: string };
const toUrl = (img: ImportedImg): string =>{
  if (!img) {
    console.warn('FullImage: imagen indefinida');
    return '';
  }
  return typeof img === 'string' ? img : img.src;
};

type FullImageProps = {
    desktopImageUrl: ImportedImg;
    mobileImageUrl: ImportedImg;
    tabletImageUrl: ImportedImg;
    alt?: string;
};

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const FullImage: React.FC<FullImageProps> = ({
    desktopImageUrl,
    mobileImageUrl,
    tabletImageUrl,
    alt = 'Imagen',
}) => {
    const [device, setDevice] = useState<DeviceType>('desktop');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mqMobile = window.matchMedia('(max-width: 768px)');
        const mqTablet = window.matchMedia(
        '(min-width: 769px) and (max-width: 1024px) and (orientation: portrait)'
        );
        const update = () => {
            if (mqMobile.matches) {
                setDevice('mobile');
            } else if (mqTablet.matches) {
                setDevice('tablet');
            } else {
                setDevice('desktop');
            }
        };
        update();
        mqMobile.addEventListener?.('change', update);
        mqTablet.addEventListener?.('change', update);
        return () => {
            mqMobile.removeEventListener?.('change', update);
            mqTablet.removeEventListener?.('change', update);
        };
    }, []);

    const getImageSrc = () => {
        if (device === 'mobile') return toUrl(mobileImageUrl);
        if (device === 'tablet') return toUrl(tabletImageUrl);        
        return toUrl(desktopImageUrl);
    };

    return (
        <div className={styles.fullImagePage}>
            <img
                src={getImageSrc()}
                alt={alt}
                className={styles.image}
            />
        </div>
    );
};

export default FullImage;
