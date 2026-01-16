'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePaystackPayment } from '@/hooks/usePaystack';
import { useClearCart } from '@/hooks/queries';
import { useCartStore } from '@/store/useCartSore'; // Fix typo in filename if possible, but keeping import same for now
import { Loader2, CheckCircle2, XCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // ✅ Use selector to prevent unnecessary re-renders when state changes
  const clearCart = useCartStore((state) => state.clearCart);

  // ✅ Destructure mutate to get a stable function reference
  const { mutate: clearBackendCart } = useClearCart();

  // Paystack params
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const statusParam = searchParams.get('status');

  const { verifyPayment } = usePaystackPayment();
  const { mutate: verify, isPending, isSuccess, isError, data } = verifyPayment;

  useEffect(() => {
    if (!reference) return;

    // Prevent duplicate calls if already processed
    if (!isPending && !isSuccess && !isError) {
      verify(reference);
    }
  }, [reference, verify, isPending, isSuccess, isError]);

  // ✅ Auto-clear cart ONLY on true backend success
  useEffect(() => {
    if (isSuccess) {
      clearCart();
      clearBackendCart();
    }
  }, [isSuccess, clearCart, clearBackendCart]);

  const showSuccess = isSuccess;
  const showFailure = isError || (statusParam === 'failed'); // statusParam is fallback for manual bank failures if any

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 bg-gray-50/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full text-center relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600" />

        {isPending ? (
          <div className="flex flex-col items-center py-10">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-100 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-600 w-8 h-8" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-800 animate-pulse">
              Verifying Payment...
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Please wait while we confirm your transaction.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${showSuccess ? "bg-green-100 text-green-600" : showFailure ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"
                }`}
            >
              {showSuccess ? (
                <CheckCircle2 className="w-12 h-12" />
              ) : (
                <XCircle className="w-12 h-12" />
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              {showSuccess ? "Payment Successful!" : showFailure ? "Payment Failed" : "Verification In Progress"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-8 max-w-xs mx-auto leading-relaxed"
            >
              {showSuccess
                ? "Thank you for your purchase! Your order has been confirmed and is being processed."
                : "We couldn't verify your payment. Please try again or contact support if you were debited."}
            </motion.p>

            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full bg-gray-50 rounded-xl p-4 mb-8 text-sm text-gray-500 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <span>Reference:</span>
                  <span className="font-mono font-medium text-gray-700">{reference?.slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between items-center text-green-600 font-medium">
                  <span>Status:</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Confirmed</span>
                </div>
              </motion.div>
            )}

            <div className="space-y-3 w-full">
              <Button
                onClick={() => router.push('/')}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-base font-medium transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                {showSuccess ? (
                  <>Back to Shop <ArrowRight size={18} /></>
                ) : (
                  "Return to Home"
                )}
              </Button>

              {showSuccess && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/user/orders')}
                  className="w-full h-12 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium"
                >
                  View My Orders
                </Button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="animate-spin text-green-600 w-10 h-10" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
