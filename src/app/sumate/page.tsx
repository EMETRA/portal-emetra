'use client';
import React, { useLayoutEffect, useRef } from 'react';
import { SumateHome, SumateAntecedentes, SumateInfo, SumateInst, SumateUni, SumateHow, SumateConoce, FullPageSnap, SumateInscribete} from '@/components/organisms';

const SumatePage: React.FC = () => {
    const hostRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        const getViewportHeight = () => {
            const vv = window.visualViewport;
            // Preferimos el menor para evitar que “asome” contenido
            const candidates = [
            vv?.height ?? Infinity,
            window.innerHeight,
            document.documentElement.clientHeight,
            ].filter(Boolean) as number[];
            return Math.min(...candidates);
        };

        const setHeight = () => {
            const vh  = getViewportHeight();
            const top = host.getBoundingClientRect().top; // distancia bajo el NavBar
            const h   = Math.max(0, Math.ceil(vh - top) + 2); // +2px evita peeks por redondeo
            host.style.setProperty('--snap-h', `${h}px`);
        };

        setHeight();

        const onResize = () => setHeight();
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
        window.addEventListener('pageshow', onResize);

        const vv = window.visualViewport;
        vv?.addEventListener?.('resize', onResize);
        vv?.addEventListener?.('scroll', onResize); 

        const ro = new ResizeObserver(onResize);
        ro.observe(document.body);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
            window.removeEventListener('pageshow', onResize);
            vv?.removeEventListener?.('resize', onResize);
            vv?.removeEventListener?.('scroll', onResize);
            ro.disconnect();
        };
    }, []);

    const sections = [
        <SumateHome key="home"/>,
        <SumateAntecedentes key="SumateAntecedentes"/>,
        <SumateInfo key="SumateInfo"/>,
        <SumateConoce key="SumateConoce"/>,
        <SumateInst key="SumateInst"/>,        
        <SumateHow key="SumateHow"/>,
        <SumateUni key="SumateUni"/>,
        <SumateInscribete key="SumateInscribete"/>
    ]
    return (
        <div ref = {hostRef} style={{ height: 'var(--snap-h)', minHeight:'var(--snap-h)', overflow: 'hidden' }}>
            <FullPageSnap sections={sections}
                snapAlign='start'
                snapStopAlways={true}
                withKeyboardNav={true} />
        </div>
        
    );
};

export default SumatePage;