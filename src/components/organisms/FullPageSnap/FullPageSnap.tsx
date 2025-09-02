'use client';
import React, { useRef, useCallback } from 'react';
import styles from './FullPageSnap.module.scss';

type FullPageSnapProps = {
    sections: React.ReactNode[];        // cada item es una “página” completa
    className?: string;
    snapAlign?: 'start' | 'center' | 'end';
    snapStopAlways?: boolean;           // fuerza completar el snap
    withKeyboardNav?: boolean;          // ↑/↓ PageUp/PageDown/Space
};

export default function FullPageSnap({
    sections,
    className,
    snapAlign = 'start',
    snapStopAlways = true,
    withKeyboardNav = true,
}: FullPageSnapProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    // navegación por teclado (opcional)
    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!withKeyboardNav || !ref.current) return;
        const keysNext = ['ArrowDown', 'PageDown', ' '];
        const keysPrev = ['ArrowUp', 'PageUp'];

        const container = ref.current;
        const vh = container.clientHeight;
        const current = container.scrollTop;
        const snapTo = (y: number) =>
        container.scrollTo({ top: y, behavior: 'smooth' });

        if (keysNext.includes(e.key)) {
        e.preventDefault();
        const nextY = Math.ceil((current + 1) / vh) * vh;
        snapTo(nextY);
        } else if (keysPrev.includes(e.key)) {
        e.preventDefault();
        const prevY = Math.floor((current - 1) / vh) * vh;
        snapTo(prevY);
        }
    }, [withKeyboardNav]);

    return (
        <div
            ref={ref}
            className={`${styles.viewport} ${className ?? ''}`}
            // importante para capturar teclado cuando el contenedor tiene focus
            tabIndex={withKeyboardNav ? 0 : -1}
            onKeyDown={onKeyDown}
            // Custom props → CSS vars
            style={{
                ['--snap-align' as any]: snapAlign,
                ['--snap-stop'  as any]: snapStopAlways ? 'always' : 'normal',
            }}
            >
            {sections.map((node, i) => (
                <section key={i} className={styles.page}>
                {node}
                </section>
            ))}
        </div>
    );
}
