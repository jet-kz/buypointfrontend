"use client";
import { Product } from "@/hooks/queries";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

const ProductCard = ({
  product,
  bgColor,
}: {
  product: Product;
  bgColor?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Calculate display price in Naira
  const priceNaira = product.price * 1500;
  const hasDiscount = false; // Placeholder for future discount logic
  const rating = 4.5; // Placeholder rating

  return (
    <Link
      href={`/product/${product.id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={`relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 ${bgColor || ""
          }`}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={product.thumbnail_url || product.image_url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Quick Actions */}
          <div
            className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
              }`}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${isLiked
                  ? "bg-red-500 text-white"
                  : "bg-white/90 backdrop-blur text-gray-600 hover:text-red-500"
                }`}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
            </motion.button>
          </div>

          {/* Brand Badge */}
          {product.brand && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide rounded-full">
              {product.brand}
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
              -20%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 ml-1">({rating})</span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 min-h-[2.5rem] leading-tight">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-orange-600">
              ₦{priceNaira.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ₦{(priceNaira * 1.2).toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
            <p className="text-[10px] text-orange-500 mt-1 font-medium">
              Only {product.stock} left!
            </p>
          )}
        </div>

        {/* Add to Cart Button - appears on hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white via-white to-transparent"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic would go here
            }}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-200"
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
