'use cliente'

import React from 'react'
import { Banner } from '@/components/organisms/Banner'
import type { BannerSlide } from '@/components/organisms/Banner/types'

const slides: BannerSlide[] = [
  {
    backgroundImage: '/images/banner.jpg',
    text: 'Bienvenido a Emetra',
    icons: ['EMETRA', 'PMT'],
  },
  {
    backgroundImage: '/images/banner.jpg',
    text: 'Conoce nuestros servicios',
    icons: ['EMETRA', 'PMT'],
  },
]

export default function Home() {
  return (
    <div>
      <Banner slides={slides} />
    </div>
  )
}