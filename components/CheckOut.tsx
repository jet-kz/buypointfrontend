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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2, Pencil, Plus } from "lucide-react";
import Wrapper from "./Wrapper";
import { Skeleton } from "./ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import useMobile from "@/hooks/use-mobile";
import BottomNav from "./mobile/BottomNav";

// ===== Step Tracker =====
const StepTracker = ({ step }: { step: number }) => {
  const steps = ["Shipping", "Payment", "Confirm"];
  return (
    <div className="flex items-center justify-between mb-4 md:mb-8 px-2 md:px-0">
      {steps.map((label, idx) => (
        <div key={idx} className="flex-1 flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= idx
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {idx + 1}
          </div>
          <span className="ml-2 text-sm font-medium">{label}</span>
          {idx < steps.length - 1 && (
            <div className="flex-1 h-1 bg-gray-300 mx-2 relative top-0.5"></div>
          )}
        </div>
      ))}
    </div>
  );
};

// ===== Full-screen Step Wrapper =====
const StepWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full min-h-[calc(100vh-4rem)] md:min-h-auto flex flex-col">
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        <Button
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setOpen(true)}
        >
          <Plus size={16} /> Add
        </Button>
      </div>

      {open && (
        <div className="p-4 bg-white shadow rounded-xl space-y-2 mb-4">
          {Object.keys(form).map((key) =>
            key !== "is_default" ? (
              <Input
                key={key}
                placeholder={key.replace("_", " ").toUpperCase()}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            ) : (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) =>
                    setForm({ ...form, is_default: e.target.checked })
                  }
                />
                Set as default
              </label>
            )
          )}
          <div className="flex flex-col md:flex-row justify-between mt-2 gap-2">
            <Button variant="outline" onClick={resetForm} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {editing ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      )}

      {!addresses || addresses.length === 0 ? (
        <div className="p-6 text-center bg-gray-50 rounded-xl shadow-inner">
          <p className="text-gray-600">No address saved yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr: any) => (
            <div
              key={addr.id}
              className={`p-4 rounded-xl shadow-sm bg-white flex flex-col md:flex-row justify-between items-start md:items-center ${
                addr.is_default ? "ring-2 ring-green-500" : ""
              }`}
            >
              <div className="flex-1 space-y-1">
                <p className="font-medium">
                  {addr.full_name} — {addr.street_address}, {addr.city}
                </p>
                <p className="text-sm text-gray-500">
                  {addr.state}, {addr.postal_code}, {addr.country}
                </p>
                <p className="text-sm text-gray-500">📞 {addr.phone_number}</p>
                {addr.is_default && (
                  <span className="text-xs text-green-600 font-semibold">
                    Default Address
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(addr)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(addr.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={onNext}
        className="mt-4 w-full bg-green-600 hover:bg-green-700"
        disabled={!addresses || addresses.length === 0}
      >
        Next: Payment
      </Button>
    </div>
  );
};

// ===== Payment Step =====
const PaymentStep = ({ paymentOption, onNext, onBack, fetchPayment }: any) => {
  if (!paymentOption) fetchPayment();

  return (
    <div className="flex-1 overflow-auto p-2 md:p-0 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Payment</h2>
      {!paymentOption ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ) : (
        <div className="space-y-3">
          <p>
            <strong>Bank:</strong> {paymentOption.bank_name}
          </p>
          <p>
            <strong>Account Number:</strong>{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(paymentOption.account_number);
                toast.success("Copied account number");
              }}
            >
              {paymentOption.account_number}
            </span>
          </p>
          <p>
            <strong>Account Name:</strong> {paymentOption.account_name}
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between mt-4 gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          Next: Confirm
        </Button>
      </div>
    </div>
  );
};

// ===== Confirm Step =====
const ConfirmStep = ({ cart, onBack, checkout, addresses, toast }: any) => {
  const [orderCreated, setOrderCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setReceipt(e.target.files[0]);
  };

  const handleConfirmOrder = async () => {
    if (!addresses || addresses.length === 0)
      return toast.error("No address selected");
    const defaultAddress =
      addresses.find((a: any) => a.is_default) || addresses[0];
    try {
      setLoading(true);
      await checkout.mutateAsync({
        address_id: defaultAddress.id,
        receipt: receipt || undefined,
      });
      setOrderCreated(true);
      toast.success("Order confirmed!");
    } catch (err: any) {
      toast.error(err?.message || "Order failed");
    } finally {
      setLoading(false);
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
          >
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cart?.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-white rounded-xl mb-2 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  <img
                    src={item.product.image_url || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-medium">
                  ${item.product.price * item.quantity}
                </span>
              </div>
            ))}

            <div className="flex justify-between font-bold text-lg mt-2 mb-4">
              <span>Total:</span>
              <span>
                ₦
                {(
                  cart?.items?.reduce(
                    (sum: number, i: any) => sum + i.product.price * i.quantity,
                    0
                  ) * 1500
                ) // ✅ convert to naira
                  .toFixed(2)}
              </span>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Upload Receipt (optional)
              </label>
              <input type="file" onChange={handleFileChange} />
              {receipt && <p className="text-sm mt-1">{receipt.name}</p>}
            </div>

            <div className="flex flex-col md:flex-row justify-between mt-4 gap-2">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleConfirmOrder}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Order"}
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
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="text-3xl font-bold text-green-600 mb-4">
              🎉 Your order is processing!
            </div>
            <p className="text-gray-600 mb-6 text-center">
              Thank you for your purchase. You will receive a confirmation email
              soon.
            </p>
            <Button
              className="bg-green-600 hover:bg-green-700"
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

  const [step, setStep] = useState(0);
  const isMobile = useMobile();

  if (cartLoading || addrLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto p-4 md:p-10 flex flex-col md:block">
        <StepTracker step={step} />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="shipping"
              initial={{ x: isMobile ? 300 : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? -300 : 0, opacity: 0 }}
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
              initial={{ x: isMobile ? 300 : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? -300 : 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StepWrapper>
                <PaymentStep
                  paymentOption={paymentOption}
                  fetchPayment={fetchPayment}
                  onNext={() => setStep(2)}
                  onBack={() => setStep(0)}
                />
              </StepWrapper>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="confirm"
              initial={{ x: isMobile ? 300 : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isMobile ? -300 : 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StepWrapper>
                <ConfirmStep
                  cart={cart}
                  onBack={() => setStep(1)}
                  checkout={checkout}
                  addresses={addresses}
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
