"use client";
import { useProducts } from "@/hooks/queries";
import ProductCard from "./ProductCard";
import Wrapper from "./Wrapper";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const HomePageProductsList = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts(20);

  const products = data?.pages.flat() ?? [];

  return (
    <Wrapper bgColor="bg-/">
      <div className="pt-5 flex flex-col gap-4">
        <h3 className="text-2xl font-bold">Top Deals</h3>
        {isLoading && (
          <div className="text-center h-[200px] flex justify-center items-center text-sm text-gray-500">
            <Loader2 className="animate-spin w-15 h-15 text-primary" />
          </div>
        )}

        {isError && (
          <div className="text-center text-red-500">
            Failed to load products
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              bgColor="bg-white"
            />
          ))}
        </div>
        {hasNextPage && (
          <Button
            className="bg-primary px-6 py-3 rounded-md text-white font-medium mx-auto mt-4"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <Loader2 className="animate-spin w-15 h-15 text-white" />
            ) : (
              "View More"
            )}
          </Button>
        )}
        {!hasNextPage && !isLoading && (
          <p className="text-center text-gray-400 py-4">
            🎉 You’ve reached the end!
          </p>
        )}
      </div>
    </Wrapper>
  );
};

export default HomePageProductsList;
