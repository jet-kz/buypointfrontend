"use client";
import { Category } from "@/hooks/queries";
import { Product } from "@/hooks/queries";
import ProductCard from "./ProductCard";

import { Loader2 } from "lucide-react";
import { useCategoryProducts } from "@/hooks/queries";

const CategoryList = ({ category }: { category: Category }) => {
  const {
    data: products,
    isLoading,
    isError,
  } = useCategoryProducts(category.slug);

  return (
    <div className="pt-5 flex flex-col gap-4 my-4">
      <h3 className="text-2xl font-bold">{category.name}</h3>

      {isLoading && (
        <div className="text-center bg-gray-100 h-[200px] flex justify-center items-center text-sm text-gray-500">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <div className="text-center text-red-500 text-sm">
          Failed to load products.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {products?.length
          ? products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))
          : !isLoading && (
              <div className="text-center text-gray-500 text-sm col-span-full">
                No products found
              </div>
            )}
      </div>
    </div>
  );
};

export default CategoryList;
