'use client'

import React from 'react'
import { Hero, SectionTitle, NewsCard } from '@molecules/index'
import { ServicesRow, NewsSection } from '@organisms/index'
import styles from './page.module.scss'


export default function ServicioPage() {

  return (
    <>
      <Hero
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        backgroundImage="/images/banner.jpg"
        icons={["EMETRA", "PMT"]}
      />
      <div className={styles.cardWrapper}>
        <SectionTitle>Nuestros Servicios</SectionTitle>
        <ServicesRow className={styles.servicesRow} />    
        <SectionTitle>Últimas Noticias</SectionTitle>
        <NewsSection />
        <SectionTitle>Preguntas Frecuentes</SectionTitle>

      </div>
    </>
  )
}
