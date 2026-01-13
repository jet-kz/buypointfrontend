"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/queries";
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useCheckout,
  usePaymentOption,
} from "@/hooks/queries";
import { usePaystackPayment } from "@/hooks/usePaystack";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  Trash2,
  Pencil,
  Plus,
  CreditCard,
  Banknote,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import Wrapper from "./Wrapper";
import { Skeleton } from "./ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import useMobile from "@/hooks/use-mobile";
import BottomNav from "./mobile/BottomNav";
import { initiatePaystackInline } from "@/lib/paystack";
import { useAuthStore } from "@/store/useAuthstore";
import { useRouter } from "next/navigation";

// ===== Step Tracker =====
const StepTracker = ({ step }: { step: number }) => {
  const steps = ["Shipping", "Payment", "Confirm"];
  return (
    <div className="flex items-center justify-between mb-8 px-2 md:px-0">
      {steps.map((label, idx) => (
        <div key={idx} className="flex-1 flex items-center group cursor-default">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm ${step >= idx
              ? "bg-green-600 text-white scale-105 shadow-green-200"
              : "bg-white text-gray-400 border-2 border-gray-200"
              }`}
          >
            {step > idx ? <CheckCircle2 size={20} /> : idx + 1}
          </div>
          <span
            className={`ml-3 text-sm font-semibold transition-colors duration-300 ${step >= idx ? "text-green-900" : "text-gray-400"
              }`}
          >
            {label}
          </span>
          {idx < steps.length - 1 && (
            <div className="flex-1 h-1 mx-4 rounded-full bg-gray-100 overflow-hidden relative">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: step > idx ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute top-0 left-0 h-full bg-green-500"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ===== Full-screen Step Wrapper =====
const StepWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full min-h-[calc(100vh-4rem)] md:min-h-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
    {children}
  </div>
);

// ===== Shipping Step =====
const ShippingStep = ({
  addresses,
  addAddress,
  updateAddress,
  deleteAddress,
  onNext,
}: any) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone_number: "",
    is_default: false,
  });

  const resetForm = () => {
    setForm({
      full_name: "",
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      phone_number: "",
      is_default: false,
    });
    setEditing(null);
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      if (editing)
        await updateAddress.mutateAsync({ id: editing, updates: form });
      else await addAddress.mutateAsync(form);
      toast.success(editing ? "Address updated!" : "Address added!");
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const handleEdit = (addr: any) => {
    setForm({ ...addr });
    setEditing(addr.id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress.mutateAsync(id);
      toast.success("Address deleted!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    }
  };

  return (
    <div className="flex-1 overflow-auto p-2 md:p-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shipping Address</h2>
        <Button
          size="sm"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-4 shadow-sm"
          onClick={() => setOpen(true)}
        >
          <Plus size={16} /> Add New
        </Button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white shadow-lg rounded-2xl border border-gray-100 space-y-4 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 bg-green-500 h-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(form).map((key) =>
              key !== "is_default" ? (
                <Input
                  key={key}
                  placeholder={key.replace("_", " ").toUpperCase()}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                />
              ) : null
            )}
          </div>
          <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors w-fit">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                className="peer h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                checked={form.is_default}
                onChange={(e) =>
                  setForm({ ...form, is_default: e.target.checked })
                }
              />
            </div>
            Set as default address
          </label>
          <div className="flex flex-col md:flex-row justify-end mt-4 gap-3">
            <Button
              variant="outline"
              onClick={resetForm}
              className="px-6 rounded-full border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-full shadow-lg shadow-green-200"
            >
              {editing ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </motion.div>
      )}

      {!addresses || addresses.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-600 font-medium">No address saved yet</p>
          <p className="text-sm text-gray-400">
            Add a shipping address to continue
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr: any) => (
            <motion.div
              layout
              key={addr.id}
              className={`group p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${addr.is_default
                ? "bg-green-50/50 border-green-200 ring-1 ring-green-100 dark:bg-green-900/10"
                : "bg-white border-gray-100 hover:border-green-100 hover:shadow-md"
                }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">{addr.full_name}</p>
                    {addr.is_default && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700 bg-green-100 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {addr.street_address}, {addr.city}
                  </p>
                  <p className="text-sm text-gray-500">
                    {addr.state}, {addr.postal_code}, {addr.country}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                    <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">
                      📞
                    </span>
                    {addr.phone_number}
                  </p>
                </div>
                <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                    onClick={() => handleEdit(addr)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 hover:bg-red-50 hover:text-red-600 border-gray-200"
                    onClick={() => handleDelete(addr.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8 sticky bottom-4 z-10 w-full bg-white md:bg-transparent p-4 md:p-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
        <Button
          onClick={onNext}
          className="w-full h-12 text-lg font-medium bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xl shadow-green-200 transition-all active:scale-[0.99]"
          disabled={!addresses || addresses.length === 0}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

// ===== Payment Step =====
const PaymentStep = ({
  paymentOption,
  onNext,
  onBack,
  fetchPayment,
  paymentMethod,
  setPaymentMethod,
}: any) => {
  if (!paymentOption) fetchPayment();

  const methods = [
    {
      id: "paystack",
      title: "Pay with Paystack",
      description: "Secure payment via Card, Transfer, USSD",
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: "manual",
      title: "Manual Bank Transfer",
      description: "Transfer directly to our bank account",
      icon: <Banknote className="w-6 h-6" />,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ];

  return (
    <div className="flex-1 overflow-auto p-2 md:p-0 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Select Payment Method</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => (
          <div
            key={method.id}
            onClick={() => setPaymentMethod(method.id)}
            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 relative ${paymentMethod === method.id
              ? "border-green-500 bg-green-50/30 shadow-lg shadow-green-100"
              : "border-gray-100 bg-white hover:border-green-200 hover:shadow-md"
              }`}
          >
            {paymentMethod === method.id && (
              <div className="absolute top-4 right-4 text-green-600">
                <CheckCircle2 size={24} className="fill-green-100" />
              </div>
            )}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${paymentMethod === method.id
                ? "bg-green-600 text-white"
                : method.color
                }`}
            >
              {method.icon}
            </div>
            <h3 className="font-bold text-lg text-gray-900">{method.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{method.description}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={paymentMethod}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mt-6"
        >
          {paymentMethod === "paystack" ? (
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900">Secure Payment</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  You will be redirected to Paystack&apos;s secure gateway to complete
                  your payment. We do not store your card details.
                </p>
                <div className="flex gap-2 mt-3 opacity-60">
                  <div className="h-6 w-10 bg-gray-300 rounded" />
                  <div className="h-6 w-10 bg-gray-300 rounded" />
                  <div className="h-6 w-10 bg-gray-300 rounded" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <Banknote size={20} className="text-gray-500" /> Bank Details
              </h4>
              {!paymentOption ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <div className="space-y-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500 text-sm">Bank Name</span>
                    <span className="font-medium">{paymentOption.bank_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500 text-sm">Account Number</span>
                    <span
                      className="font-mono font-bold text-green-700 cursor-pointer hover:bg-green-50 px-2 rounded transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          paymentOption.account_number
                        );
                        toast.success("Copied account number");
                      }}
                    >
                      {paymentOption.account_number}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500 text-sm">Account Name</span>
                    <span className="font-medium text-right">
                      {paymentOption.account_name}
                    </span>
                  </div>
                </div>
              )}
              <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                ⚠️ Please use your Order ID as reference when making the transfer.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between mt-8 gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 transition-all active:scale-[0.99]"
        >
          Review Order
        </Button>
      </div>
    </div>
  );
};

// ===== Confirm Step =====
const ConfirmStep = ({
  cart,
  onBack,
  checkout,
  addresses,
  paymentMethod,
  toast,
}: any) => {
  const [orderCreated, setOrderCreated] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const router = useRouter();

  // Paystack hooks
  // We use our own inline logic now to control the amount
  // const { initializePayment } = usePaystackPayment(); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setReceipt(e.target.files[0]);
  };

  const getDefaultAddress = () =>
    addresses?.find((a: any) => a.is_default) || addresses?.[0];

  const handleConfirmOrder = async () => {
    if (!addresses || addresses.length === 0)
      return toast.error("No address selected");

    const defaultAddress = getDefaultAddress();
    if (!defaultAddress) return toast.error("No valid address found");

    try {
      setLoading(true);

      // 1️⃣ Ensure we only create the order ONCE
      let currentOrderId = pendingOrderId;

      if (!currentOrderId) {
        const data = await checkout.mutateAsync({
          address_id: defaultAddress.id,
          receipt:
            paymentMethod === "manual" && receipt ? receipt : undefined,
        });

        currentOrderId = data?.order_id;
        if (!currentOrderId) throw new Error("Failed to create order");

        setPendingOrderId(currentOrderId);
      }

      // 2️⃣ PAYMENT HANDLING (CLIENT-SIDE MANEUVER)
      if (paymentMethod === "paystack") {
        const authStore = useAuthStore.getState();

        // Calculate the "Maneuvered" Amount
        const baseTotal = cart?.items?.reduce(
          (sum: number, i: any) => sum + i.product.price * i.quantity, 0
        ) || 0;

        const paystackAmount = baseTotal * 1500; // Apply conversion rate
        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY;

        if (!publicKey) {
          toast.error("Paystack key not found. Please contact support.");
          setLoading(false);
          return;
        }

        try {
          // Initiate Inline Payment
          const response = await initiatePaystackInline(
            authStore.email || "guest@example.com", // Fallback email
            paystackAmount,
            publicKey
          );

          // Verify on backend
          // Redirect to success page which handles verification
          router.push(`/order/success?reference=${response.reference}&status=success`);

        } catch (paymentErr: any) {
          toast.error(paymentErr.message || "Payment cancelled");
          setLoading(false);
        }
        return;
      }

      // 3️⃣ MANUAL PAYMENT FLOW
      setOrderCreated(true);
      setPendingOrderId(null);
      toast.success("Order confirmed! Please complete your bank transfer.");
      setLoading(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err.message ||
        "Order failed";

      toast.error(msg);
      console.error("Checkout Error:", err);
      // Don't clear loading if we successfully started paystack flow (handled above)
      if (paymentMethod !== 'paystack') setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-2 md:p-0">
      <AnimatePresence mode="wait">
        {!orderCreated ? (
          <motion.div
            key="order-summary"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {pendingOrderId && (
                <div className="bg-blue-50 text-blue-700 px-4 py-2 text-sm font-medium border-b border-blue-100 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Order created (ID: {pendingOrderId}). Awaiting payment...
                </div>
              )}

              <div className="max-h-[300px] overflow-auto p-4 space-y-4">
                {cart?.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="h-16 w-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900 whitespace-nowrap">
                      ₦{(item.product.price * item.quantity * 1500).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-100">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <span className="text-2xl font-black text-gray-900">
                  ₦{(
                    cart?.items?.reduce(
                      (sum: number, i: any) =>
                        sum + i.product.price * i.quantity,
                      0
                    ) * 1500
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {paymentMethod === "manual" && (
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                <label className="block mb-2 font-bold text-amber-900">
                  Upload Payment Receipt (Optional)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-amber-100 file:text-amber-700
                    hover:file:bg-amber-200"
                />
                {receipt && (
                  <p className="text-sm mt-2 text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={14} /> {receipt.name}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between mt-6 gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 transition-all active:scale-[0.99]"
                onClick={handleConfirmOrder}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </div>
                ) : pendingOrderId ? "Retry Payment" : "Make Payment"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="order-success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 text-center px-4"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
              <CheckCircle2 size={48} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Order Placed!
            </div>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Your order is being processed. You will receive a confirmation email shortly.
            </p>
            <Button
              className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg rounded-full shadow-lg shadow-green-200"
              onClick={() => (window.location.href = "/")}
            >
              Back to Shop
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== Main Checkout =====
export default function CheckoutPage() {
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addresses, isLoading: addrLoading } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const checkout = useCheckout();
  const { data: paymentOption, refetch: fetchPayment } = usePaymentOption();

  // State
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const isMobile = useMobile();

  if (cartLoading || addrLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="text-gray-500 font-medium animate-pulse">Loading Checkout...</p>
        </div>
      </div>
    );

  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col md:block min-h-screen md:min-h-auto">
        <StepTracker step={step} />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="shipping"
              initial={{ x: isMobile ? 50 : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? -50 : 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StepWrapper>
                <ShippingStep
                  addresses={addresses}
                  addAddress={addAddress}
                  updateAddress={updateAddress}
                  deleteAddress={deleteAddress}
                  onNext={() => setStep(1)}
                />
              </StepWrapper>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="payment"
              initial={{ x: isMobile ? 50 : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? -50 : 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StepWrapper>
                <PaymentStep
                  paymentOption={paymentOption}
                  fetchPayment={fetchPayment}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  onNext={() => setStep(2)}
                  onBack={() => setStep(0)}
                />
              </StepWrapper>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="confirm"
              initial={{ x: isMobile ? 50 : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? -50 : 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StepWrapper>
                <ConfirmStep
                  cart={cart}
                  onBack={() => setStep(1)}
                  checkout={checkout}
                  addresses={addresses}
                  paymentMethod={paymentMethod}
                  toast={toast}
                />
              </StepWrapper>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile bottom nav stepper */}
      {isMobile && <BottomNav step={step} setStep={setStep} />}
    </Wrapper>
  );
}
