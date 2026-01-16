"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const slides = [
  {
    src: "/hot-sales.webp",
    heading: "Hot Sales",
    sub: "Grab the best deals now!",
    cta: "Shop Now",
    link: "/product/search?q=iphone",
  },
  {
    src: "/new-arrivals.jpg",
    heading: "New Arrivals",
    sub: "Fresh picks just for you",
    cta: "Explore",
    link: "/product/search?q=iphone",
  },
  {
    src: "/laptop.png",
    heading: "New Release",
    sub: "Experience innovation like never before",
    cta: "Discover",
    link: "/product/search?q=laptop",
  },
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800/50">
      <div className="relative w-full h-[350px] lg:h-[450px] group">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1200}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
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
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] w-full h-full relative">
                {/* Left text section */}
                <div className="relative flex flex-col justify-center items-start px-8 lg:px-20 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={activeIndex === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative z-10 space-y-4"
                  >
                    <Badge className="bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
                      Exclusive Offer
                    </Badge>
                    <h1 className="text-4xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter">
                      {slide.heading}
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-500 dark:text-zinc-400 font-medium max-w-sm">
                      {slide.sub}
                    </p>
                    <div className="pt-4 flex items-center gap-4">
                      <a
                        href={slide.link}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center gap-2"
                      >
                        {slide.cta} <ChevronRight size={20} />
                      </a>
                    </div>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl transition-all duration-1000 group-hover:bg-orange-500/10" />
                  <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl transition-all duration-1000 group-hover:bg-blue-500/10" />
                </div>

                {/* Right image section */}
                <div className="relative w-full h-full overflow-hidden">
                  <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={activeIndex === i ? { scale: 1, opacity: 1 } : { scale: 1.1, opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={slide.src}
                      alt={slide.heading}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                  {/* Overlay for better text separation if needed on small screens */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent hidden dark:block" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation arrows (Enhanced) */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
          <button
            ref={prevRef}
            className="custom-prev pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 
                       bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 
                       shadow-xl rounded-2xl p-3 
                       hover:bg-orange-600 hover:text-white hover:scale-110 active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            ref={nextRef}
            className="custom-next pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 
                       bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 
                       shadow-xl rounded-2xl p-3 
                       hover:bg-orange-600 hover:text-white hover:scale-110 active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Progress tracker below slider */}
      <div className="flex justify-center mt-6 gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 w-10 rounded-full transition-all duration-500 ${i === activeIndex
              ? "bg-primary opacity-100"
              : "bg-gray-300 opacity-50"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
