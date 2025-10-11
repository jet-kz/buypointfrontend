"use client";

import { SearchIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchProducts } from "@/hooks/queries";

const Search = () => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 🔎 use your query hook (limit = 5 for suggestions)
  const { data, isFetching } = useSearchProducts(query, 0, 15);

  const suggestions = data?.data?.map((p) => p.name) || [];

  // close dropdown on outside click
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
    <div className="relative w-full max-w-[450px] mx-auto" ref={dropdownRef}>
      {/* Search bar */}
      <div className="flex items-center h-[40px] rounded-full bg-white border border-primary overflow-hidden">
        <SearchIcon className="text-primary mx-4" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="What are you looking for?"
          className="flex-1 h-full bg-transparent outline-none text-sm"
        />
        <button
          type="button"
          onClick={() => handleSearch()}
          className="bg-primary text-white px-4 py-2 rounded-r-full h-full text-sm"
        >
          Search
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showDropdown && query.length > 1 && (
        <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg border z-50">
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
  );
};

export default Search;
