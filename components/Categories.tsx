"use client";

import React, { useState } from "react";
import Wrapper from "./Wrapper";
import CategoryList from "./CategoryList";
import { Category } from "@/hooks/queries";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, LayoutGrid, ChevronRight } from "lucide-react";

const Categories = ({ categories }: { categories: Category[] }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0]
  );

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50/30">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white py-8 md:py-12 px-4 rounded-b-3xl mb-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Shop by Category</h1>
            <p className="text-orange-100 text-sm md:text-base">
              Discover amazing products across all categories
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Category Pills - Horizontal Scroll */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
              {categories.map((category, index) => {
                const isSelected = selectedCategory?.slug === category.slug;
                return (
                  <motion.button
                    key={category.id || index}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap ${isSelected
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
                      }`}
                  >
                    {category.name}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Selected Category Content */}
          <AnimatePresence mode="wait">
            {selectedCategory && (
              <motion.div
                key={selectedCategory.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CategoryList category={selectedCategory} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Wrapper>
  );
};

export default Categories;
