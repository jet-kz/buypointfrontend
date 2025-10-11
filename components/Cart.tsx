"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "@/hooks/queries";
import { useCartStore } from "@/store/useCartSore";
import { useAuthStore } from "@/store/useAuthstore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Wrapper from "./Wrapper";

const Cart = () => {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { items, updateQuantity, removeItem, clearCart, setItems, isHydrated } =
    useCartStore();

  const { data: backendCart, isFetching } = useCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();

  // ✅ Load backend cart once on login
  useEffect(() => {
    if (backendCart?.items && token) {
      setItems(
        backendCart.items.map(
          (item: { id: number; product: any; quantity: number }) => ({
            id: item.id,
            product: item.product,
            quantity: item.quantity,
          })
        )
      );
    }
  }, [backendCart, token, setItems]);

  const handleUpdateQuantity = (productId: number, qty: number) => {
    updateQuantity(productId, qty); // instant UI
    if (token) {
      updateMutation.mutate(
        { product_id: productId, quantity: qty },
        { onError: () => toast.error("Failed to update quantity") }
      );
    }
  };

  const handleRemove = (id: number) => {
    removeItem(id);
    if (token) {
      removeMutation.mutate(
        { item_id: id },
        { onError: () => toast.error("Failed to remove item") }
      );
    }
  };

  const handleClear = () => {
    clearCart();
    if (token) {
      clearMutation.mutate(undefined, {
        onError: () => toast.error("Failed to clear cart"),
      });
    }
  };

  const handleCheckout = () => {
    if (!token) router.push("/login");
    else router.push("/user/checkout");
  };

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading your cart...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Your cart is empty 🛒
        </h2>
        <p className="text-gray-500">
          Browse products and add them to your cart.
        </p>
      </div>
    );
  }

  return (
    <Wrapper>
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.product.image_url || "/placeholder.svg"}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-gray-500">₦{item.product.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    handleUpdateQuantity(item.product.id, item.quantity - 1)
                  }
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    handleUpdateQuantity(item.product.id, item.quantity + 1)
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleRemove(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button onClick={handleClear} variant="destructive">
            Clear Cart
          </Button>
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-white space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <p className="text-gray-600">
            Subtotal: ₦{subtotal.toLocaleString()}
          </p>
          <Button
            onClick={handleCheckout}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Cart;
