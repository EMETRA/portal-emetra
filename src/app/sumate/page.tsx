'use client';
import React, { useLayoutEffect, useRef } from 'react';
import { SumateHome, SumateAntecedentes, SumateInfo, SumateInst, SumateUni, SumateHow, SumateConoce, FullPageSnap, SumateInscribete} from '@/components/organisms';

const SumatePage: React.FC = () => {
    const hostRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const setHeight = () => {
            const host = hostRef.current;
            if (!host) return;

            const vh = window.visualViewport?.height ?? window.innerHeight;

            const top = host.getBoundingClientRect().top;

            const h = Math.max(0, vh - top);
            host.style.setProperty('--snap-h', `${h}px`);
        };

        const raf = () => requestAnimationFrame(setHeight);
        raf();

        window.addEventListener('resize', setHeight);
        window.addEventListener('orientationchange', setHeight);

        const ro = new ResizeObserver(setHeight);
        ro.observe(document.body);

        return () => {
            window.removeEventListener('resize', setHeight);
            window.removeEventListener('orientationchange', setHeight);
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