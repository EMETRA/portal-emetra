'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import styles from './LogosWall.module.scss';
import type { Logo, TrackProps, LogoWallProps } from './types';

function useRowsCount(): number {
    const [rows, setRows] = useState<number>(3);

    useEffect(() => {
        const compute = () => {
            setRows(window.innerWidth <= 720 ? 4 : 3);
        };
        compute();
        window.addEventListener('resize', compute);
        return () => window.removeEventListener('resize', compute);
    }, []);

    return rows;
}

function chunkLogos(logos: Logo[], rows: number): Logo[][] {
    const buckets: Logo[][] = Array.from({ length: rows }, () => []);
    logos.forEach((logo, i) => {
        buckets[i % rows].push(logo);
    });
    return buckets;
}

function Track({ logos, speed = 120, preload = 8 }: TrackProps) {           
    const trackRef = useRef<HTMLDivElement | null>(null);
    const repeated = useMemo<Logo[]>(() => [...logos, ...logos], [logos]);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        const update = () => {
            const halfWidth = Math.round(el.scrollWidth / 2);
            el.style.setProperty("--gap", "32");
            el.style.setProperty("--distance", `${halfWidth}`);
            const duration = halfWidth / speed; 
            el.style.setProperty("--dur", `${duration}s`);
        };

        const imgs = el.querySelectorAll("img") as NodeListOf<HTMLImageElement>;;
        let pending = 0;
        const marks: Array<{ img: HTMLImageElement; handler: () => void }> = [];

        imgs.forEach((img) => {
            if (!img.complete) {
                pending++;
                const done = () => {
                    pending--;
                    if (pending === 0) update();
                };
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
                marks.push({ img, handler: done });
            }
        });
        update();
       

        const ro = new ResizeObserver(() => update());
        ro.observe(el);

        return () => {
            ro.disconnect();
        };
    }, [logos, speed]);

    return (
        <div className={styles.track} ref={trackRef}>
        {/* {repeated.map((l, i) => (
            <div className={styles.logoItem} key={`${l.alt || 'logo'}-${i}`}>
                <img src={l.src} alt={l.alt || 'logo'} loading="lazy" />
            </div>
        ))} */}
        {repeated.map((l, i) => {
            const eager = i < preload; // ← los primeros N (de la pista duplicada)
            return (
            <div className={styles.logoItem} key={`${l.alt || 'logo'}-${i}`}>
                <img
                src={l.src}
                alt={l.alt || 'logo'}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={eager ? 'high' : 'auto'}
                />
            </div>
            );
        })}
        </div>
    );
}

export default function LogoWall({ logos, centerBadgeSrc }: LogoWallProps) {
    const rowsCount = useRowsCount();
    const rows = chunkLogos(logos, rowsCount);

    const isMobile = rowsCount !== 3;           // 4 filas = mobile
    const speed = isMobile ? 60 : 120; 
    
    const positionsDesktop: string[] = ['14%', '42%', '70%'];      
    const positionsMobile: string[]  = ['8%', '18%', '60%', '70%'];

    return (
        <div className={styles.wall}>
            {/* badge central fijo */}
            <div className={styles.centerBadge}>
                <img src={centerBadgeSrc} alt="SUMATE" />
            </div>

            {rows.map((logosRow, idx) => {
                const pos = rowsCount === 3 ? positionsDesktop[idx] : positionsMobile[idx];
                const reverse = idx % 2 === 1;          // alterna dirección

                return (
                    <div
                        key={`row-${idx}`}
                        className={`${styles.row} ${reverse ? styles.reverse : ''}`}
                        style={{ top: pos }}
                    >
                        <Track logos={logosRow} speed={speed}/>
                    </div>
                );
            })}
        </div>
    );
}
