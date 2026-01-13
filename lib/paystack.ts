"use client";
// import PaystackPop from '@paystack/inline-js' // Removed to fix SSR error




export const initiatePaystackInline = async (email: string, amount: number, publicKey: string): Promise<{ reference: string | any }> => {
  const PaystackPop = (await import('@paystack/inline-js')).default;
  return new Promise((resolve, reject) => {
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: publicKey,
      email: email,
      amount: amount * 100, // Convert to kobo/sub-unit
      onSuccess: (transaction: { reference: string }) => {
        resolve(transaction); // ✅ Resolve with transaction details
      },
      onCancel: () => {
        reject(new Error("Payment cancelled by user")); // ❌ Reject on cancel
      },
    });
  });
};
