import { useMutation } from "@tanstack/react-query";
import { paymentService } from "@/services/paymentService";
import { toast } from "sonner";

export const usePaystackPayment = () => {

    const initializePayment = useMutation({
        mutationFn: (orderId: number) => paymentService.initializePayment(orderId),
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to initialize payment");
        },
    });

    const verifyPayment = useMutation({
        mutationFn: (reference: string) => paymentService.verifyPayment(reference),
        onError: (error: any) => {
            // toast.error is handled in the UI usually, but good to have here
            console.error("Verification failed", error);
        },
    });

    return {
        initializePayment,
        verifyPayment,
    };
};
