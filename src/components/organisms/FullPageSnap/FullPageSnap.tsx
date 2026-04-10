'use client';
import React, { useRef } from 'react';
import styles from './FullPageSnap.module.scss';

type FullPageSnapProps = {
    sections: React.ReactNode[];        
    className?: string;
    snapAlign?: 'start' | 'center' | 'end';
    snapStopAlways?: boolean;           
    withKeyboardNav?: boolean;          
};

export default function FullPageSnap({
    sections,
    className,
    snapAlign = 'start',
    snapStopAlways = true,
}: FullPageSnapProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={ref}
            className={`${styles.viewport} ${className ?? ''}`}
            style={{
                ['--snap-align' as string]: snapAlign,
                ['--snap-stop'  as string]: snapStopAlways ? 'always' : 'normal',
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
