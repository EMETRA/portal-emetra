'use cliente'

import React from 'react'
import { Banner, ServicesRow, NotificationsCard } from '@/components/organisms/index'
import type { BannerSlide } from '@/components/organisms/Banner/types'
import { SectionTitle } from '@/components/server/molecules/SectionTitle'


const slides: BannerSlide[] = [
  {
    backgroundImage: '/images/banner.jpg',
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    overlayImage: "/images/Logos.png",
  },
  {
    backgroundImage: '/images/banner.jpg',
    text: 'Conoce nuestros servicios',
    overlayImage: "/images/Logos.png",
  },
]

export default function Home() {
  return (
    <div>
      <Banner slides={slides} />
      <SectionTitle>Noticias destacadas</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ServicesRow />
      </div>

      <NotificationsCard />

    </div>
  )
}