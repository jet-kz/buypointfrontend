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
    <div className="relative w-full max-w-2xl" ref={dropdownRef}>
      {/* Search bar */}
      <div className="group flex items-center h-11 rounded-xl bg-gray-100 dark:bg-zinc-900 border border-transparent focus-within:border-orange-500/20 focus-within:bg-white dark:focus-within:bg-zinc-800 focus-within:shadow-lg focus-within:shadow-orange-500/5 transition-all overflow-hidden px-4">
        <SearchIcon className="text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search for products, brands..."
          className="flex-1 h-full bg-transparent outline-none text-sm text-foreground px-3 font-medium placeholder:text-gray-400 dark:placeholder:text-zinc-500"
        />
        {query && (
          <button
            tabIndex={-1}
            onClick={() => setQuery("")}
            className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors text-gray-400"
          >
            <SearchIcon className="rotate-45" size={14} /> {/* Simple 'x' using rotated search or just use X icon */}
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showDropdown && query.length > 1 && (
        <div className="absolute mt-2 w-full bg-white dark:bg-zinc-900 shadow-lg rounded-lg border dark:border-zinc-800 z-50">
          {isFetching && (
            <div className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500">Loading…</div>
          )}
          {!isFetching &&
            suggestions.map((name, idx) => (
              <div
                key={idx}
                className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer text-foreground"
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
