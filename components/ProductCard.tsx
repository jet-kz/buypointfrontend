"use client";
import { Product } from "@/hooks/queries";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({
  product,
  bgColor,
}: {
  product: Product;
  bgColor?: string;
}) => {
  return (
    <Link
      className={`relative p-2 hover:bg-gray-50 transition-all ${
        bgColor ? bgColor : ""
      }`}
      href={`/product/${product.id}`}
    >
      <div className="relative w-full h-[200px] bg-white rounded-md overflow-hidden">
        <Image
          src={product.thumbnail_url || product.image_url || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-contain lg:object-cover"
        />
      </div>

      <div className="flex flex-col gap-1 pt-4">
        <h3 className="font-bold text-lg text-red-600">${product.price}</h3>
        <h4 className="text-lg text-gray-800">{product.name}</h4>
      </div>

      {product.brand && (
        <div className="absolute top-0 left-0 z-10 text-sm font-bold w-auto px-2 h-[30px] bg-red-600 flex justify-center items-center text-white">
          {product.brand}
        </div>
      )}
    </Link>
  );
};

export default ProductCard;
