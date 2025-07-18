'use client'

import React from 'react'
import { Hero, SectionTitle } from '@molecules/index'
import { ServicesRow, NewsSection, FAQQuestions } from '@organisms/index'
import { Heading } from '@/components/atoms'
import styles from './page.module.scss'
import type { FAQ } from "@/schema/faq";
import { FAQ_Type } from "@/schema/faq";

export default function ServicioPage() {
  const loremQuestions: FAQ[] = [
    {
      id: 1,
      tipo: FAQ_Type.PILOTOS,
      enLanding: false,
      pregunta: "Lorem ipsum dolor sit amet?",
      respuesta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl."
    },
    {
      id: 2,
      tipo: FAQ_Type.PILOTOS,
      enLanding: false,
      pregunta: "Vestibulum auctor dapibus neque?",
      respuesta: "Vestibulum auctor dapibus neque. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo."
    },
    {
      id: 3,
      tipo: FAQ_Type.PILOTOS,
      enLanding: false,
      pregunta: "Cras mattis consectetur purus sit amet fermentum?",
      respuesta: "Cras mattis consectetur purus sit amet fermentum. Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo."
    },
    {
      id: 4,
      tipo: FAQ_Type.PILOTOS,
      enLanding: false,
      pregunta: "Maecenas sed diam eget risus varius blandit?",
      respuesta: "Maecenas sed diam eget risus varius blandit sit amet non magna. Aenean lacinia bibendum nulla sed consectetur."
    },
    {
      id: 5,
      tipo: FAQ_Type.PILOTOS,
      enLanding: false,
      pregunta: "Donec ullamcorper nulla non metus auctor fringilla?",
      respuesta: "Donec ullamcorper nulla non metus auctor fringilla. Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod."
    }
  ];
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
        <div className={styles.faqQuestions}>
          <Heading className={styles.faqQuestionsTitle} variant="Extra-Small">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy
              text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </Heading>
          <FAQQuestions
            questions={loremQuestions}
            variant="No-Landing"
            className={styles.faqQuestions} />
        </div>        
      </div>
    </>
  )
}
