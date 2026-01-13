"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, PackageOpen } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { items, updateQuantity, removeItem, clearCart, setItems, isHydrated } =
    useCartStore();

  const { data: backendCart } = useCart();
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
    if (qty < 1) return;
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
    if (!token) router.push("/login?redirect=/user/checkout");
    else router.push("/user/checkout");
  };

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <PackageOpen size={48} className="text-gray-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-green-200 transition-all hover:scale-105"
          >
            Start Shopping
          </Button>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-green-600" /> My Cart ({items.length})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.product?.id || item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  className="group flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="relative w-full sm:w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image_url || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 w-full text-center sm:text-left">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.product.name}</h3>
                    <p className="text-green-600 font-bold text-lg">
                      ₦{(item.product.price * 1500).toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ unit</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50 rounded-full p-1 border border-gray-200">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full hover:bg-white hover:text-red-500 transition-colors"
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full hover:bg-white hover:text-green-600 transition-colors"
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors absolute top-2 right-2 sm:static"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleClear}
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full px-6"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₦{(subtotal * 1500).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="h-px bg-gray-100 my-4" />
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>₦{(subtotal * 1500).toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-green-200 transition-transform active:scale-95 flex items-center justify-center gap-2 group"
              >
                Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Secure Checkout powered by Paystack
              </p>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Cart;
