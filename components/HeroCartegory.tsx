import { LayoutGrid, Info, Phone, Compass } from "lucide-react";
import React from "react";
import Link from "next/link";

const HeroCartegory = () => {
  return (
    <div className="flex items-center gap-4 py-6">
      {/* Categories Card */}
      <Link href="/categories" className="group">
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-500/30 transition-all duration-300">
          <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
            <LayoutGrid size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-600 leading-none">Explore</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">Categories</span>
          </div>
        </div>
      </Link>

      {/* About Us Card */}
      <Link href="/about" className="group hidden md:block">
        <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-gray-100/50 dark:border-zinc-800/50 px-6 py-3 rounded-2xl hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Info size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-600 leading-none">Who we are</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">Our Story</span>
          </div>
        </div>
      </Link>

      {/* Contact Card */}
      <Link href="/contact" className="group hidden md:block">
        <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-gray-100/50 dark:border-zinc-800/50 px-6 py-3 rounded-2xl hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300">
          <div className="w-8 h-8 rounded-xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600">
            <Phone size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-600 leading-none">Get in touch</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">Support</span>
          </div>
        </div>
      </Link>

      <div className="flex-1" />

      {/* Trending Tag */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-orange-500/5 rounded-full border border-orange-500/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Trending: Winter Sale Live</span>
      </div>
    </div>
  );
};

export default HeroCartegory;
