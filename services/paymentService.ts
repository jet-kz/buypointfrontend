// services/paymentService.ts
import api from "@/lib/axios";

export interface InitializePaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export const paymentService = {
  // Initialize Paystack payment (Redirect flow)
  initializePayment: async (orderId: number): Promise<InitializePaymentResponse> => {
    const response = await api.post<InitializePaymentResponse>(
      `/api/payment/initialize?order_id=${orderId}`
    );
    return response.data;
  },

  // Verify transaction
  verifyPayment: async (reference: string) => {
    const response = await api.get(
      `/payment-options/paystack/verify?reference=${reference}`
    );
    return response.data;
  },
};