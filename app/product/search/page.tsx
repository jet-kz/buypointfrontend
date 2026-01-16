"use client";

import { useSearchParams } from "next/navigation";
import { useSearchProducts } from "@/hooks/queries";
import Wrapper from "@/components/Wrapper";
import ProductCard from "@/components/ProductCard";
import { Loader2, ArrowLeft, Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import Search from "@/components/Search";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useMobile from "@/hooks/use-mobile";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useSearchProducts(query, page);

  const router = useRouter();
  const isMobile = useMobile();

  const searchContent = (
    <div className="space-y-6 pt-10 pb-20">
      {!isLoading && !isError && (data?.data?.length ?? 0) > 0 && (
        <>
          <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white px-1">
            Showing results for <span className="text-orange-600">"{query}"</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-1 pb-10">
            {data?.data?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-4 pb-24">
            <Button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              variant="outline"
              className="rounded-xl px-6"
            >
              Prev
            </Button>
            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={(data?.data?.length ?? 0) < 12}
              variant="outline"
              className="rounded-xl px-6"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-sm font-medium text-gray-500">Searching for products...</p>
        </div>
      )}

      {!isLoading && (isError || !data?.data?.length) && (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            We couldn't find anything matching "{query}". Try checking your spelling or use different keywords.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans">
      <Wrapper>
        {searchContent}
      </Wrapper>
    </div>
  );
}
