"use client";
import React from "react";

import MobileHeader from "@/components/mobile/MobileHeader";
import MobileCategories from "@/components/mobile/MobileCategories";
import MobileProductsList from "@/components/mobile/MobileProductsList";
import BottomNav from "@/components/mobile/BottomNav";
import { useCategories } from "@/hooks/queries";

import HeroCartegory from "@/components/HeroCartegory";
import HeroSlider from "@/components/HeroSlider";
import HomePageProductsList from "@/components/HomepageProductList";
import Wrapper from "@/components/Wrapper";
import useMobile from "@/hooks/use-mobile";
import MobileHeroSlider from "@/components/mobile/MobileHeroSlider";

export default function HomePage() {
  const isMobile = useMobile();
  const { data: categories = [] } = useCategories();

  if (isMobile) {
    // MOBILE VERSION
    return (
      <div className="relative min-h-screen bg-white dark:bg-zinc-950">
        <MobileHeader />
        <MobileHeroSlider />
        <div className="px-1">
          <MobileCategories categories={categories} />
          <div className="px-3">
            <MobileProductsList />
          </div>
        </div>

        {/* Spacer for BottomNav */}
        <div className="h-24" />
      </div>
    );
  }

  // DESKTOP VERSION
  return (
    <div>
      <Wrapper>
        <HeroCartegory />
        <HeroSlider />
      </Wrapper>
      <HomePageProductsList />
    </div>
  );
}
