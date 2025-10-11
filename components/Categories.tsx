"use client";

import React, { useState } from "react";
import Wrapper from "./Wrapper";
import { Button } from "./ui/button";
import CategoryList from "./CategoryList";
import { Category } from "@/hooks/queries";

const Categories = ({ categories }: { categories: Category[] }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0]
  );

  return (
    <Wrapper>
      <div className="flex flex-col gap-y-5">
        <div className="flex gap-4 flex-wrap">
          {categories.map((category, index) => (
            <CategoryItem
              key={index}
              category={category}
              selectedCategory={selectedCategory}
              seleectCategory={setSelectedCategory}
            />
          ))}
        </div>
        {selectedCategory && <CategoryList category={selectedCategory} />}
      </div>
    </Wrapper>
  );
};

export default Categories;

const CategoryItem = ({
  category,
  selectedCategory,
  seleectCategory,
}: {
  category: Category;
  selectedCategory: Category;
  seleectCategory: (category: Category) => void;
}) => {
  return (
    <Button
      onClick={() => seleectCategory(category)}
      className={`text-lg px-4 h-[50px] rounded-full ${
        selectedCategory.slug === category.slug
          ? ""
          : "bg-gray-100 text-gray-500"
      }`}
      variant={selectedCategory.slug === category.slug ? "default" : "ghost"}
    >
      {category.name}
    </Button>
  );
};
