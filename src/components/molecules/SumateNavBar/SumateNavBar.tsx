'use client';
import React, { useState } from 'react';
import styles from './SumateNavBar.module.scss';

type Item = { label: string; index: number; children?: { label: string; index: number }[] };
type Tone = 'light' | 'dark';

type Props = {
    logo: string | { src: string };
    items: Item[];
    toneMap?: Record<number, Tone>;
    defaultTone?: Tone;
};

function findSnapContainer(): HTMLElement | null {
    // Busca el contenedor con scroll-snap vertical
    const all = Array.from(document.querySelectorAll<HTMLElement>('div,main,section,article'));
    for (const el of all) {
        const cs = getComputedStyle(el);
        const v = (cs as any).scrollSnapType || cs.getPropertyValue('scroll-snap-type');
        if (v && v.includes('y')) return el;
    }
    return null;
}

function scrollToIndex(index: number) {
    const container = findSnapContainer();
    if (!container) return;

    const pages = Array.from(container.querySelectorAll<HTMLElement>(':scope > section'));
    const target = pages[index];
    if (!target) return;

    container.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth',
    });
}

const SumateNavBar: React.FC<Props> = ({ logo, items, toneMap, defaultTone = 'dark'  }) => {
    const [open, setOpen] = useState(false);
    const [tone, setTone] = useState<Tone>(defaultTone);
    const logoSrc = typeof logo === 'string' ? logo : (logo as any).src;

    return (
        <header className={styles.navbar}>
            <div className={styles.container}>
                <button className={styles.logo} onClick={() => scrollToIndex(0)} aria-label="Ir a inicio">
                    <img src={logoSrc} alt="Logo" />
                </button>

                <nav className={`${styles.menu} ${open ? styles.menuOpen : ''}`} aria-label="Navegación SÚMATE">
                    {items.map((it) => (
                        <div key={it.label} className={styles.item}>
                        <button className={styles.link} onClick={() => { scrollToIndex(it.index); setOpen(false); }}>
                            {it.label}
                        </button>

                        {it.children?.length ? (
                            <div className={styles.dropdown} role="menu">
                            {it.children.map((sub) => (
                                <button
                                key={sub.label}
                                className={styles.dropdownItem}
                                role="menuitem"
                                onClick={() => { scrollToIndex(sub.index); setOpen(false); }}
                                >
                                {sub.label}
                                </button>
                            ))}
                            </div>
                        ) : null}
                        </div>
                    ))}
                </nav>

                <button className={styles.toggle} onClick={() => setOpen((v) => !v)} aria-label="Abrir menú" aria-expanded={open}>
                    <span className={styles.bar} /><span className={styles.bar} /><span className={styles.bar} />
                </button>
            </div>
        </header>
    );
};

export default SumateNavBar;
