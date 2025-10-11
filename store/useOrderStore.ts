// store/useOrderStore.ts
import { Order } from "@/hooks/queries";
import { create } from "zustand";

interface OrderStore {
  orders: Order[];
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  statusCounts: {
    pending: number;
    completed: number;
    cancelled: number;
  };
  setOrders: (orders: Order[]) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  totalSales: 0,
  totalOrders: 0,
  avgOrderValue: 0,
  statusCounts: { pending: 0, completed: 0, cancelled: 0 },

  setOrders: (orders) => {
    const safeOrders = Array.isArray(orders) ? orders : [];
    const totalSales = safeOrders.reduce((sum, o) => sum + o.total_amount, 0);
    const totalOrders = safeOrders.length;
    const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;

    const statusCounts = {
      pending: safeOrders.filter((o) => o.status === "pending").length,
      completed: safeOrders.filter((o) => o.status === "completed").length,
      cancelled: safeOrders.filter((o) => o.status === "cancelled").length,
    };

    set({
      orders: safeOrders,
      totalSales,
      totalOrders,
      avgOrderValue,
      statusCounts,
    });
  },
}));
