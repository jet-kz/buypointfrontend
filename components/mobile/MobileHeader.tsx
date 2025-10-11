"use client";
import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchProducts } from "@/hooks/queries";

const MobileHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Search suggestions
  const { data, isFetching } = useSearchProducts(query, 0, 15);
  const suggestions = data?.data?.map((p) => p.name) || [];

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
      className={`w-full px-4 py-2 flex items-center justify-between z-50 transition-all duration-300 ${
        isScrolled
          ? "fixed top-0 bg-white shadow-md"
          : "absolute top-0 bg-transparent"
      }`}
      ref={dropdownRef}
    >
      {/* Search input */}
      <div className="flex-1 relative mr-3">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Search products..."
          className={`w-full h-10 px-3 rounded-full outline-none text-sm border ${
            isScrolled
              ? "bg-white border-gray-300 text-black placeholder-gray-400"
              : "bg-white/20 border-white text-white placeholder-white"
          } transition-all duration-300`}
        />

        {/* Suggestions */}
        {showDropdown && query.length > 1 && (
          <div className="absolute mt-1 w-full bg-white shadow-lg rounded-lg border z-50 max-h-60 overflow-y-auto">
            {isFetching && (
              <div className="px-4 py-2 text-sm text-gray-400">Loading…</div>
            )}
            {!isFetching &&
              suggestions.map((name, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSearch(name)}
                >
                  {name}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Bell icon */}
      <button
        className={`p-2 rounded-full transition-colors duration-300 ${
          isScrolled ? "bg-gray-100 text-black" : "bg-white/30 text-white"
        }`}
      >
        <Bell size={24} />
      </button>
    </div>
  );
};

export default MobileHeader;
