"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/hooks/queries";

interface MobileCategoriesProps {
  categories: Category[];
}

const COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-yellow-100 text-yellow-700",
];

const MobileCategories: React.FC<MobileCategoriesProps> = ({ categories }) => {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 px-4 py-3">
        {categories.map((cat, idx) => {
          const color = COLORS[idx % COLORS.length];
          const initials = cat.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <div
              key={cat.id}
              className="flex flex-col items-center cursor-pointer min-w-[70px]"
              onClick={() => router.push(`/categories`)}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center font-bold ${color} text-xl`}
              >
                {initials}
              </div>
              <p className="text-xs mt-1 text-center truncate w-20">
                {cat.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCategories;
