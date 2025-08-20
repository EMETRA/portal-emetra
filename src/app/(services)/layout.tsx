import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NavBar } from "@/components/server/molecules/NavBar";
import { Footer } from "@/components/server/molecules/Footer";
import { Hero } from "@/components/molecules";
import { Banner, BannerSlide } from "@/components/organisms";

const slides: BannerSlide[] = [
  {
    backgroundImage: "/images/banner.jpg",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    overlayImage: "/images/Logos.png",
  },
  {
    backgroundImage: "/images/banner.jpg",
    text: "Conoce nuestros servicios",
    overlayImage: "/images/Logos.png",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
