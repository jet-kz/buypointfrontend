"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchProducts } from "@/hooks/queries";
import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/mode-toggle";

const MobileHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Search suggestions
  const { data, isFetching } = useSearchProducts(query, 0, 15);
  const suggestions = data?.data?.map((p: any) => p.name) || [];

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    router.push(`/product/search?q=${encodeURIComponent(q)}`);
    setShowDropdown(false);
  };

  return (
    <div
      className={`w-full z-50 transition-all duration-300 ${isScrolled
          ? "fixed top-0 bg-white dark:bg-zinc-950 shadow-md py-2"
          : "absolute top-0 bg-transparent py-4"
        }`}
      ref={dropdownRef}
    >
      <div className="px-4 flex items-center gap-3">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Logo compact />
        </div>

        {/* Search Section (Flexible) */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            placeholder="Search..."
            className={`w-full h-10 px-4 rounded-xl outline-none text-sm transition-all duration-300 shadow-sm ${isScrolled
                ? "bg-gray-100 dark:bg-zinc-900 border-transparent text-foreground placeholder-gray-400"
                : "bg-white/20 backdrop-blur-xl border border-white/30 text-white placeholder-white/80"
              }`}
          />

          {/* Suggestions Dropdown */}
          {showDropdown && query.length > 1 && (
            <div className="absolute mt-2 w-full bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl border dark:border-zinc-800 z-50 max-h-80 overflow-y-auto overflow-x-hidden border-orange-500/10 left-0 right-0 max-w-[calc(100vw-40px)]">
              {isFetching && (
                <div className="px-5 py-3 text-xs text-gray-400 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  Searching…
                </div>
              )}
              {!isFetching &&
                suggestions.map((name: string, idx: number) => (
                  <div
                    key={idx}
                    className="px-5 py-3 text-sm text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 cursor-pointer border-b last:border-0 border-gray-50 dark:border-zinc-800 transition-colors font-medium"
                    onClick={() => handleSearch(name)}
                  >
                    {name}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Section */}
        <div className="flex-shrink-0 bg-white/10 dark:bg-zinc-800/50 backdrop-blur-md rounded-xl border border-white/20 dark:border-zinc-700/50 p-0.5 shadow-sm">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
