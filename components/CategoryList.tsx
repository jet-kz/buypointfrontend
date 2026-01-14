"use client";
import { Category, Product } from "@/hooks/queries";
import ProductCard from "./ProductCard";
import { Loader2, PackageOpen, RefreshCw } from "lucide-react";
import { useCategoryProducts } from "@/hooks/queries";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const CategoryList = ({ category }: { category: Category }) => {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useCategoryProducts(category.slug);

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gray-100 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageOpen className="text-red-400" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load products</h3>
        <p className="text-gray-500 text-sm mb-4">Something went wrong. Please try again.</p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="rounded-full"
        >
          <RefreshCw size={16} className="mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!products?.length) {
    return (
      <div className="py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageOpen className="text-gray-400" size={40} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
        <p className="text-gray-500 text-sm">
          Check back later for new arrivals in {category.name}
        </p>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{category.name}</h2>
          <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
            {products.length} items
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
      >
        {products.map((product: Product, index: number) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryList;
