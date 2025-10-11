"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/effect-fade";
import useMobile from "@/hooks/use-mobile";

const slides = [
  {
    type: "image",
    src: "/hot-sales.webp",
    heading: "Hot Sales",
    sub: "Grab the best deals now!",
    cta: "Shop Now",
    link: "/product/search?q=iphone",
  },
  {
    type: "image",
    src: "/new-arrivals.jpg",
    heading: "New Arrivals",
    sub: "Fresh picks just for you",
    cta: "Explore",
    link: "/product/search?q=iphone",
  },
  {
    type: "video",
    src: "/new-release.mp4",
    heading: "New Release",
    sub: "Experience innovation like never before",
    cta: "Discover",
    link: "/products/new-release",
  },
];

export default function MobileHeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useMobile();

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1200}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className={isMobile ? "h-[250px]" : "h-[300px] lg:h-[300px]"}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              {slide.type === "image" ? (
                <Image
                  src={slide.src}
                  alt={slide.heading}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <video
                  src={slide.src}
                  autoPlay
                  muted
                  loop
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              )}

              {/* Overlay text */}
              <div
                className={`absolute ${
                  isMobile ? "bottom-4 left-4" : "bottom-0 left-0"
                } p-4 bg-black/30 rounded-md text-white max-w-xs`}
              >
                <h2 className="text-lg font-bold">{slide.heading}</h2>
                <p className="text-sm">{slide.sub}</p>
                <a
                  href={slide.link}
                  className="mt-2 inline-block bg-primary px-4 py-2 rounded text-white text-sm"
                >
                  {slide.cta}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slide indicators */}
      <div className="flex justify-center mt-2 gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 w-8 rounded-full transition-all duration-500 ${
              i === activeIndex
                ? "bg-primary opacity-100"
                : "bg-gray-300 opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
