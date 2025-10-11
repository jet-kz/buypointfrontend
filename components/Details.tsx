"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Product } from "@/hooks/queries";
import { useAddToCart } from "@/hooks/queries";
import { useCartStore } from "@/store/useCartSore";
import { useAuthStore } from "@/store/useAuthstore";

const Detail = ({ product }: { product: Product }) => {
  const [previewImage, setPreviewImage] = useState(
    product.image_url || product.thumbnail_url || "/placeholder.svg"
  );
  const [quantity, setQuantity] = useState(1);

  const token = useAuthStore((state) => state.token);
  const { addItem } = useCartStore();
  const addToCartMutation = useAddToCart();

  const handleQuantityChange = (qty: number) =>
    setQuantity((prev) => Math.max(1, prev + qty));

  const handleAddToCart = () => {
    // Add locally
    addItem(product, quantity);

    // If not logged in → just toast
    if (!token) {
      toast.info("Item added to cart. Please log in to checkout.");
      return;
    }

    // Sync with backend
    addToCartMutation.mutate(
      { product_id: product.id, quantity },
      {
        onSuccess: () => toast.success("Added to cart!"),
        onError: (err: any) => {
          if (err?.response?.status === 401)
            toast.error("Session expired. Please log in again.");
          else toast.error("Failed to sync cart with server.");
        },
      }
    );
  };

  return (
    <div className="flex flex-col py-8">
      <div className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr] gap-6 lg:gap-12">
        {/* Thumbnails */}
        <div className="order-1 md:order-none flex md:flex-col gap-2">
          <button
            onClick={() =>
              setPreviewImage(product.image_url || "/placeholder.svg")
            }
            className={`relative w-20 h-20 border rounded-lg overflow-hidden ${
              previewImage === product.image_url ? "border-primary" : ""
            }`}
          >
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        </div>

        {/* Main Image */}
        <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-lg overflow-hidden bg-muted/10">
          <Image
            key={previewImage}
            src={previewImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-all duration-300 ease-in-out"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="text-3xl font-bold">${product.price}</div>
            {product.stock !== undefined && (
              <div className="text-muted-foreground">
                Stock: {product.stock}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="min-w-[100px]">Quantity:</span>
              <div className="flex items-center border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(1, Number.parseInt(e.target.value) || 1)
                    )
                  }
                  className="w-16 text-center border-none focus:outline-none"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
            >
              {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
