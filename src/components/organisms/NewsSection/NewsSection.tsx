'use client';

import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./NewsSection.module.scss";
import { NewsCard }     from "@molecules/NewsCard/NewsCard";

export const NewsSection: React.FC = () => {   
    const newsItems = [
        {
            id: 1,
            imageSrc: "/images/banner.jpg",
            title: "Noticia 1",
            date: "21 Enero, 2024",
            mode: "Presencial",
            onClick: () => console.log("Abrir noticia 1"),
        },
        {
            id: 2,
            imageSrc: "/images/banner.jpg",
            title: "Noticia 2",
            date: "21 Enero, 2024",
            mode: "Virtual",
            onClick: () => console.log("Abrir noticia 2"),
        },
        {
            id: 3,
            imageSrc: "/images/banner.jpg",
            title: "Noticia 3",
            date: "21 Enero, 2024",
            mode: "Virtual",
            onClick: () => console.log("Abrir noticia 3"),
        },
        {
            id: 4,
            imageSrc: "/images/banner.jpg",
            title: "Noticia 4",
            date: "21 Enero, 2024",
            mode: "Presencial",
            onClick: () => console.log("Abrir noticia 4"),
        },
    ];   
    const containerRef = useRef<HTMLDivElement>(null);
    const [items, setItems] = useState<Array<any>>(newsItems);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si es móvil al montar el componente
    useEffect(() => {
        const checkIfMobile = () => {
            const mobile = window.matchMedia("(max-width: 640px)").matches;
            setIsMobile(mobile);
            
            if (mobile && newsItems.length > 0) {
                const clonedItems = [
                    { ...newsItems[newsItems.length - 1], id: "clone-last" },
                    ...newsItems,
                    { ...newsItems[0], id: "clone-first" },
                ];
                setItems(clonedItems);
            } else {
                setItems(newsItems); 
            }
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);


    // Posicionar correctamente el scroll inicial en móvil
    useEffect(() => {
        if (!isMobile || !containerRef.current) return;
        
        containerRef.current.scrollTo({
            left: containerRef.current.clientWidth,
            behavior: 'auto'
        });
    }, [isMobile, items]);

    // Lógica de scroll infinito (solo móvil)
    useEffect(() => {
        if (!isMobile) return;
        
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollLeft, clientWidth, scrollWidth } = container;
            const scrollRight = scrollLeft + clientWidth;

            if (scrollRight >= scrollWidth) {
                container.scrollTo({ left: clientWidth, behavior: "auto" });
            } else if (scrollLeft <= 0) {
                container.scrollTo({ left: scrollWidth - 2 * clientWidth, behavior: "auto" });
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [isMobile]);


    const scrollPrev = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: -containerRef.current.clientWidth,
                behavior: "smooth",
            });
        }
    };

    const scrollNext = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: containerRef.current.clientWidth,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className={styles.wrapper}>
            <div className={styles.carousel}>
                
                <button className={classNames(styles.arrow, styles.prev)} onClick={scrollPrev}>
                    ‹
                </button>

                <div className={styles.grid} ref={containerRef}>
                    {items.map((n) => (
                        <NewsCard
                        key={n.id}
                        imageSrc={n.imageSrc}
                        title={n.title}
                        date={n.date}
                        mode={n.mode}
                        onClick={n.onClick}
                        />
                    ))}
                </div>

                <button className={classNames(styles.arrow, styles.next)} onClick={scrollNext}>
                    ›
                </button>
            </div>
        </section>
    );
};
