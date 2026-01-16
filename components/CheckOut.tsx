"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/queries";
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useCheckout,
  usePaymentOption,
} from "@/hooks/queries";
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
  MapPin,
  ChevronRight,
  ArrowLeft,
  Package,
  Truck,
  Copy,
  X,
} from "lucide-react";
import Wrapper from "./Wrapper";
import { Skeleton } from "./ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import { initiatePaystackInline } from "@/lib/paystack";
import { useAuthStore } from "@/store/useAuthstore";
import { useRouter } from "next/navigation";
import { usePaystackPayment } from "@/hooks/usePaystack";

// ===== Step Tracker =====
const StepTracker = ({ step, onStepClick }: { step: number; onStepClick: (s: number) => void }) => {
  const steps = [
    { label: "Address", icon: MapPin },
    { label: "Payment", icon: CreditCard },
    { label: "Review", icon: Package },
  ];

  return (
    <div className="flex items-center justify-between mb-6 md:mb-8">
      {steps.map((s, idx) => {
        const Icon = s.icon;
        const isActive = step === idx;
        const isCompleted = step > idx;

        return (
          <React.Fragment key={idx}>
            <button
              onClick={() => isCompleted && onStepClick(idx)}
              disabled={!isCompleted}
              className={`flex flex-col items-center gap-2 transition-all ${isCompleted ? "cursor-pointer" : "cursor-default"
                }`}
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110"
                  : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"
                  }`}
              >
                {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={22} />}
              </div>
              <span
                className={`text-xs md:text-sm font-medium transition-colors ${isActive ? "text-orange-600" : isCompleted ? "text-green-600" : "text-gray-400"
                  }`}
              >
                {s.label}
              </span>
            </button>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 md:mx-4 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: step > idx ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-green-500"
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ===== Address Card =====
const AddressCard = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onSelect}
    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
      ? "border-orange-500 bg-orange-50/50 dark:bg-orange-500/10"
      : "border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700"
      }`}
  >
    {address.is_default && (
      <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase bg-orange-100 text-orange-600 rounded-full">
        Default
      </span>
    )}
    <div className="flex items-start gap-3">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? "border-orange-500" : "border-gray-300"
          }`}
      >
        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white text-sm">{address.full_name}</p>
        <p className="text-gray-600 dark:text-zinc-400 text-sm mt-1 line-clamp-2">
          {address.street_address}, {address.city}
        </p>
        <p className="text-gray-500 text-xs mt-0.5">
          {address.state}, {address.postal_code}
        </p>
        <p className="text-gray-500 text-xs mt-1">📞 {address.phone_number}</p>
      </div>
    </div>
    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="text-xs text-gray-500 hover:text-blue-600 h-7 px-2"
      >
        <Pencil size={12} className="mr-1" /> Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-xs text-gray-500 hover:text-red-600 h-7 px-2"
      >
        <Trash2 size={12} className="mr-1" /> Delete
      </Button>
    </div>
  </motion.div>
);

// ===== Address Form Modal =====
const AddressFormModal = ({
  isOpen,
  onClose,
  form,
  setForm,
  onSave,
  isEditing,
  isLoading,
}: any) => {
  if (!isOpen) return null;

  const fields = [
    { key: "full_name", label: "Full Name", placeholder: "John Doe" },
    { key: "phone_number", label: "Phone", placeholder: "+234..." },
    { key: "street_address", label: "Street Address", placeholder: "123 Main St" },
    { key: "city", label: "City", placeholder: "Lagos" },
    { key: "state", label: "State", placeholder: "Lagos" },
    { key: "postal_code", label: "Postal Code", placeholder: "100001" },
    { key: "country", label: "Country", placeholder: "Nigeria" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 w-full md:w-[480px] md:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-zinc-950 border-b dark:border-zinc-800 p-4 flex items-center justify-between">
          <h3 className="font-bold text-lg dark:text-white">{isEditing ? "Edit Address" : "Add New Address"}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X size={20} />
          </Button>
        </div>
        <div className="p-4 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs text-gray-500 font-medium mb-1 block">{f.label}</label>
              <Input
                value={(form as any)[f.key] || ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="h-11 rounded-lg"
              />
            </div>
          ))}
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={form.is_default || false}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">Set as default address</span>
          </label>
        </div>
        <div className="sticky bottom-0 bg-white dark:bg-zinc-950 border-t dark:border-zinc-800 p-4">
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            {isEditing ? "Update Address" : "Save Address"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===== Shipping Step =====
const ShippingStep = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  onNext,
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>({});

  const resetForm = () => {
    setForm({});
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateAddress.mutateAsync({ id: editingId, updates: form });
        toast.success("Address updated!");
      } else {
        await addAddress.mutateAsync(form);
        toast.success("Address added!");
      }
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save address");
    }
  };

  const handleEdit = (addr: any) => {
    setForm({ ...addr });
    setEditingId(addr.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress.mutateAsync(id);
      toast.success("Address deleted!");
    } catch (err: any) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Shipping Address</h2>
        <Button
          onClick={() => {
            setForm({});
            setEditingId(null);
            setIsModalOpen(true);
          }}
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 h-9"
        >
          <Plus size={16} className="mr-1" /> Add New
        </Button>
      </div>

      {!addresses || addresses.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
          <MapPin className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-600 font-medium">No addresses saved</p>
          <p className="text-sm text-gray-400 mt-1">Add a shipping address to continue</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {addresses.map((addr: any) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={selectedAddress?.id === addr.id}
              onSelect={() => setSelectedAddress(addr)}
              onEdit={() => handleEdit(addr)}
              onDelete={() => handleDelete(addr.id)}
            />
          ))}
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={onNext}
        disabled={!selectedAddress}
        className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold disabled:opacity-50 mt-4 shadow-lg shadow-orange-500/20"
      >
        Continue to Payment <ChevronRight size={18} className="ml-1" />
      </Button>

      <AnimatePresence>
        {isModalOpen && (
          <AddressFormModal
            isOpen={isModalOpen}
            onClose={resetForm}
            form={form}
            setForm={setForm}
            onSave={handleSave}
            isEditing={!!editingId}
            isLoading={addAddress.isPending || updateAddress.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== Payment Step =====
const PaymentStep = ({
  paymentOption,
  fetchPayment,
  paymentMethod,
  setPaymentMethod,
  onNext,
  onBack,
}: any) => {
  if (!paymentOption) fetchPayment();

  const methods = [
    {
      id: "paystack",
      title: "Pay with Card",
      description: "Card, Bank Transfer, USSD",
      icon: CreditCard,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "manual",
      title: "Bank Transfer",
      description: "Manual bank transfer",
      icon: Banknote,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>

      <div className="grid gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = paymentMethod === method.id;

          return (
            <motion.div
              key={method.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod(method.id)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                ? "border-orange-500 bg-orange-50/50 dark:bg-orange-500/10"
                : "border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700"
                }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center`}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{method.title}</p>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">{method.description}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-orange-500" : "border-gray-300"
                    }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {paymentMethod === "manual" && paymentOption && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 border border-purple-100 dark:border-purple-900/20"
        >
          <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
            <Banknote size={18} /> Bank Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Bank:</span>
              <span className="font-medium">{paymentOption.bank_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Account:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentOption.account_number);
                  toast.success("Copied!");
                }}
                className="flex items-center gap-1 font-mono font-bold text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 px-2 py-1 rounded"
              >
                {paymentOption.account_number} <Copy size={12} />
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium text-right">{paymentOption.account_name}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <Button onClick={onBack} variant="outline" className="flex-1 h-12 rounded-xl">
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
        >
          Review Order <ChevronRight size={18} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

// ===== Review Step =====
const ReviewStep = ({
  cart,
  selectedAddress,
  paymentMethod,
  checkout,
  initializePayment,
  onBack,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const router = useRouter();

  const subtotal =
    cart?.items?.reduce(
      (sum: number, i: any) => sum + i.product.price * i.quantity,
      0
    ) || 0;

  const handleConfirmOrder = async () => {
    if (!selectedAddress) return toast.error("No address selected");

    try {
      setLoading(true);

      const data = await checkout.mutateAsync({
        address_id: selectedAddress.id,
        receipt: paymentMethod === "manual" && receipt ? receipt : undefined,
      });

      const orderId = data?.order_id;
      if (!orderId) throw new Error("Failed to create order");

      if (paymentMethod === "paystack") {
        const authStore = useAuthStore.getState();
        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

        if (!publicKey) {
          toast.error("Paystack key not found. Please contact support.");
          setLoading(false);
          return;
        }

        // 1. Initialize Paystack directly from frontend (more robust)
        toast.info("Initializing payment...");

        // 2. Paystack amount in kobo
        const paystackAmount = subtotal * 1500;
        if (paystackAmount <= 0) {
          throw new Error("Invalid order amount");
        }

        // Generate a simple reference for frontend init
        // Using timestamp to ensure uniqueness
        const tempRef = `ref_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const response = await initiatePaystackInline(
          authStore.email || "guest@example.com",
          paystackAmount,
          publicKey,
          { order_id: orderId }, // Metadata for backend verify fallback
          tempRef
        );

        router.push(`/order/success?reference=${response.reference}&status=success`);
      } else {
        toast.success("Order confirmed! Please complete your bank transfer.");
        router.push("/order/success?status=success");
      }
    } catch (err: any) {
      toast.error(err?.message || "Order failed");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Review Order</h2>

      {/* Shipping Address Summary */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-zinc-400 flex items-center gap-2">
            <Truck size={16} /> Shipping to
          </span>
        </div>
        <p className="font-semibold text-gray-900 dark:text-white">{selectedAddress?.full_name}</p>
        <p className="text-sm text-gray-600 dark:text-zinc-400">
          {selectedAddress?.street_address}, {selectedAddress?.city}
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
          <span className="text-sm font-medium text-gray-500 dark:text-zinc-400 flex items-center gap-2">
            <Package size={16} /> Order Items ({cart?.items?.length || 0})
          </span>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-zinc-800 max-h-[200px] overflow-auto">
          {cart?.items?.map((item: any) => (
            <div key={item.id} className="flex items-center gap-3 p-3">
              <div className="w-14 h-14 bg-gray-50 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                <Image
                  src={item.product.image_url || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.product.name}</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">
                ₦{(item.product.price * item.quantity * 1500).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4">
        <span className="text-sm font-medium text-gray-500 dark:text-zinc-400 flex items-center gap-2 mb-2">
          <CreditCard size={16} /> Payment
        </span>
        <p className="font-semibold text-gray-900 dark:text-white">
          {paymentMethod === "paystack" ? "Pay with Card" : "Bank Transfer"}
        </p>
      </div>

      {/* Receipt Upload for Manual */}
      {paymentMethod === "manual" && (
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-900/20">
          <label className="block mb-2 text-sm font-medium text-amber-900 dark:text-amber-400">
            Upload Payment Receipt (Optional)
          </label>
          <input
            type="file"
            onChange={(e) => e.target.files && setReceipt(e.target.files[0])}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 dark:file:bg-amber-900/30 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-200 dark:hover:file:bg-amber-900/50"
          />
        </div>
      )}

      {/* Order Total */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total to Pay</span>
          <span className="text-2xl font-black">₦{(subtotal * 1500).toLocaleString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12 rounded-xl"
          disabled={loading}
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>
        <Button
          onClick={handleConfirmOrder}
          disabled={loading}
          className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
        >
          {loading ? (
            <><Loader2 className="animate-spin mr-2" size={18} /> Processing...</>
          ) : (
            <>Place Order <CheckCircle2 size={18} className="ml-2" /></>
          )}
        </Button>
      </div>

      {/* Security Badge */}
      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <ShieldCheck size={14} /> Secure checkout powered by Paystack
      </p>
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
  const { verifyPayment, initializePayment } = usePaystackPayment();
  const { data: paymentOption, refetch: fetchPayment } = usePaymentOption();

  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // Auto-select default address
  React.useEffect(() => {
    if (addresses && !selectedAddress) {
      const defaultAddr = addresses.find((a: any) => a.is_default) || addresses[0];
      if (defaultAddr) setSelectedAddress(defaultAddr);
    }
  }, [addresses, selectedAddress]);

  if (cartLoading || addrLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950/50 py-4 md:py-8 font-sans">
      <Wrapper>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <StepTracker step={step} onStepClick={setStep} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 0 && (
                    <ShippingStep
                      addresses={addresses}
                      selectedAddress={selectedAddress}
                      setSelectedAddress={setSelectedAddress}
                      addAddress={addAddress}
                      updateAddress={updateAddress}
                      deleteAddress={deleteAddress}
                      onNext={() => setStep(1)}
                    />
                  )}
                  {step === 1 && (
                    <PaymentStep
                      paymentOption={paymentOption}
                      fetchPayment={fetchPayment}
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      onNext={() => setStep(2)}
                      onBack={() => setStep(0)}
                    />
                  )}
                  {step === 2 && (
                    <ReviewStep
                      cart={cart}
                      selectedAddress={selectedAddress}
                      paymentMethod={paymentMethod}
                      checkout={checkout}
                      initializePayment={initializePayment}
                      onBack={() => setStep(1)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar - Desktop */}
            <div className="hidden lg:block">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 sticky top-24 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
                  <h3 className="font-bold text-gray-900 dark:text-white">Order Summary</h3>
                </div>
                <div className="p-4 space-y-3 max-h-[300px] overflow-auto">
                  {cart?.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold dark:text-white">
                        ₦{(item.product.price * item.quantity * 1500).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-zinc-400 mb-2">
                    <span>Subtotal</span>
                    <span className="dark:text-white">
                      ₦
                      {(
                        (cart?.items?.reduce(
                          (sum: number, i: any) => sum + i.product.price * i.quantity,
                          0
                        ) || 0) * 1500
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-zinc-400 mb-3">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span className="dark:text-white">Total</span>
                    <span className="text-orange-600">
                      ₦
                      {(
                        (cart?.items?.reduce(
                          (sum: number, i: any) => sum + i.product.price * i.quantity,
                          0
                        ) || 0) * 1500
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Spacer for BottomNav */}
        <div className="h-24 md:hidden" />
      </Wrapper>
    </div>
  );
}
