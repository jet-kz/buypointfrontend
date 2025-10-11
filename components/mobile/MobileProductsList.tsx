"use client";
import React, { useRef, useEffect } from "react";
import { useProducts } from "@/hooks/queries";
import ProductCard from "../ProductCard";
import { Loader2 } from "lucide-react";
import useMobile from "@/hooks/use-mobile";

export default function MobileProductsList() {
  const isMobile = useMobile();
  const limit = isMobile ? 10 : 20;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts(limit);

  const products = data?.pages.flat() ?? [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" } // trigger before reaching bottom
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="px-4 py-4">
      <h3 className="text-xl font-bold mb-4">Top Deals</h3>

      {/* Loader */}
      {isLoading && (
        <div className="text-center py-20">
          <Loader2 className="animate-spin w-10 h-10 text-primary" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center text-red-500">Failed to load products</div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && (
          <Loader2 className="animate-spin w-5 h-5 text-primary" />
        )}
      </div>

      {/* End message */}
      {!hasNextPage && !isLoading && products.length > 0 && (
        <p className="text-center text-gray-400 py-4">
          🎉 You’ve reached the end!
        </p>
      )}
    </div>
  );
}
