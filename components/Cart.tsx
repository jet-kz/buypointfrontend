"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, PackageOpen, Shield, Truck, Tag } from "lucide-react";
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
    updateQuantity(productId, qty);
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

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Loading state
  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!items.length) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="relative mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full flex items-center justify-center">
              <PackageOpen size={56} className="text-orange-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <ShoppingBag size={20} className="text-white" />
            </div>
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-md text-sm md:text-base">
            Discover amazing deals and add items to your cart. We have thousands of products waiting for you!
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95"
          >
            Start Shopping <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="text-orange-600 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">Shopping Cart</h1>
                  <p className="text-sm text-gray-500">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <Button
                onClick={handleClear}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full text-sm"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product?.id || item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: "spring", bounce: 0.2, delay: index * 0.05 }}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="flex gap-4 p-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-[1.02] transition-transform">
                        <Image
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-gray-400 mb-2">
                            {item.product.brand || "BuyPoint"}
                          </p>
                        </div>

                        {/* Price & Controls Row */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex flex-col">
                            <span className="text-lg md:text-xl font-bold text-gray-900">
                              ₦{(item.product.price * item.quantity * 1500).toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400">
                              ₦{(item.product.price * 1500).toLocaleString()} each
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full hover:bg-white hover:shadow transition-all"
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-bold w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full hover:bg-white hover:shadow transition-all"
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full h-9 w-9 self-start transition-colors"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary - Desktop */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-28 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                  <h2 className="text-lg font-bold text-white">Order Summary</h2>
                </div>

                <div className="p-5 space-y-4">
                  {/* Promo Code */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <Button variant="outline" size="sm" className="rounded-lg px-4 border-orange-500 text-orange-500 hover:bg-orange-50">
                      Apply
                    </Button>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Price Breakdown */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-medium">₦{(subtotal * 1500).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span className="font-medium">₦0</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-orange-600">
                      ₦{(subtotal * 1500).toLocaleString()}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-base font-bold shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Shield size={14} /> Secure
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Truck size={14} /> Fast Delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Checkout Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
          <div className="px-4 py-3 safe-area-pb">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500">Total ({totalItems} items)</p>
                <p className="text-xl font-black text-gray-900">
                  ₦{(subtotal * 1500).toLocaleString()}
                </p>
              </div>
              <Button
                onClick={handleCheckout}
                className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-base font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
              >
                Checkout <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Spacer for mobile fixed bar */}
        <div className="h-24 lg:hidden" />
      </div>
    </Wrapper>
  );
};

export default Cart;
