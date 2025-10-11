"use client";

import { useSearchParams } from "next/navigation";
import { useSearchProducts } from "@/hooks/queries";
import Wrapper from "@/components/Wrapper";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useSearchProducts(query, page);

  if (!query) {
    return <p className="p-6 text-center">Enter a search term.</p>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <p className="p-6 text-center text-gray-500">
        No products found for "{query}".
      </p>
    );
  }

  return (
    <Wrapper>
      <h2 className="text-lg font-semibold mb-4">
        Results for <span className="text-primary">"{query}"</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={data.data.length < 12} // 👈 same limit in hook
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </Wrapper>
  );
}
