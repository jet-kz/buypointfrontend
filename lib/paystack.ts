"use client";
// import PaystackPop from '@paystack/inline-js' // Removed to fix SSR error




export const initiatePaystackInline = async (
  email: string,
  amount: number,
  publicKey: string,
  metadata?: { order_id?: number | string; custom_fields?: any[] },
  reference?: string,
  accessCode?: string // 👈 New parameter
): Promise<{ reference: string | any }> => {
  const PaystackPop = (await import('@paystack/inline-js')).default;
  return new Promise((resolve, reject) => {
    const paystack = new PaystackPop();
    const config: any = {
      key: publicKey,
      onSuccess: (transaction: { reference: string }) => {
        resolve(transaction);
      },
      onCancel: () => {
        reject(new Error("Payment cancelled by user"));
      },
    };

    if (accessCode) {
      // ✅ If we have an access_code, ONLY use it. 
      // Do NOT send reference, email, or amount again.
      config.access_code = accessCode;
    } else {
      // 🔄 Fallback for manual/old flow
      config.email = email;
      config.amount = Math.round(amount * 100);
      config.reference = reference;
      config.metadata = {
        order_id: metadata?.order_id,
        custom_fields: metadata?.custom_fields || []
      };
    }

    console.log("Paystack Pop Config:", config);
    paystack.newTransaction(config);
  });
};
