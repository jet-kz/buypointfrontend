"use client";
import Categories from "@/components/Categories";
import { useCategories } from "@/hooks/queries";

import { Loader2 } from "lucide-react";

const CategoriesPage = () => {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-2 text-gray-500">Loading categories...</span>
      </div>
    );
  }

  if (isError || !categories) {
    return (
      <div className="text-center text-red-500">Failed to load categories.</div>
    );
  }

  return <Categories categories={categories} />;
};

export default CategoriesPage;
