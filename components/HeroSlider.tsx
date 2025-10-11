"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import { Category } from "@/hooks/queries";

const promoCategories: Category[] = [
  { id: 1, name: "Men Shoe", slug: "Mens-Shoe" },
  { id: 2, name: "Laptop", slug: "Laptops" },
];

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

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  // refs for nav buttons
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <div className="relative w-full h-[300px] lg:h-[300px] group">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1200}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onBeforeInit={(swiper) => {
            if (
              typeof swiper.params.navigation !== "boolean" &&
              swiper.params.navigation
            ) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          className="h-full"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] w-full h-full relative">
                {/* Left text section */}
                <div className="relative flex flex-col justify-center items-start px-6 lg:px-16 bg-white overflow-hidden">
                  <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 relative z-10">
                    {slide.heading}
                  </h1>
                  <p className="text-lg lg:text-xl text-gray-600 mb-6 relative z-10">
                    {slide.sub}
                  </p>
                  <a
                    href={slide.link}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition relative z-10"
                  >
                    {slide.cta}
                  </a>

                  {/* diagonal flair overlay */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-40 bg-primary/80 
                               [clip-path:polygon(0_60%,100%_100%,0%_100%)]
                               [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),
                                linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] 
                               [background-size:24px_24px]"
                  />
                </div>

                {/* Right image/video section */}
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
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation arrows */}
        <button
          ref={prevRef}
          className="custom-prev absolute top-1/2 left-4 z-20 -translate-y-1/2 
                     opacity-0 group-hover:opacity-100 transition 
                     bg-white shadow-md rounded-full p-2 
                     hover:bg-primary hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          ref={nextRef}
          className="custom-next absolute top-1/2 right-4 z-20 -translate-y-1/2 
                     opacity-0 group-hover:opacity-100 transition 
                     bg-white shadow-md rounded-full p-2 
                     hover:bg-primary hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* tracker beneath whole slider */}
      <div className="flex justify-center mt-6 gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 w-10 rounded-full transition-all duration-500 ${
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
