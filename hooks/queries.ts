import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartSore";
import React from "react";
import { useAuthStore } from "@/store/useAuthstore";

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  brand?: string;
  stock?: number;
  category_id?: number;
}

// What user sends when creating a product
export interface CreateProduct {
  name: string;
  price: number;
  description?: string;
  brand?: string;
  stock?: number;
  category_id: number;
  image?: File | null; // 👈 important: for image upload
}

interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

// export const useProducts = (skip = 0, limit = 10) => {
//   return useQuery({
//     queryKey: ["products", skip, limit],
//     queryFn: async () => {
//       const res = await api.get(/products?skip=${skip}&limit=${limit});
//       return res.data.data as Product[]; // ✅ only return array
//     },
//   });
// };

export const useProducts = (limit = 30) => {
  return useInfiniteQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async ({ pageParam }) => {
      const skip = pageParam as number; // TS hint
      const res = await api.get(`/products?skip=${skip}&limit=${limit}`);
      return res.data.data as Product[];
    },
    initialPageParam: 0, // ✅ required in v5
    getNextPageParam: (lastPage, allPages) => {
      // if last page has fewer than limit items → no more pages
      if (lastPage.length < limit) return undefined;
      return allPages.length * limit; // next skip value
    },
  });
};

// ✅ Get a single product by ID
export const useProduct = (productId: number) => {
  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await api.get(`/products/${productId}`);
      return res.data.data as Product; // 👈 assuming backend wraps it in { data }
    },
    enabled: !!productId, // only fetch if productId exists
  });
};

// server-safe fetcher (no hooks here!)
export async function getProduct(productId: number): Promise<Product> {
  const res = await api.get(`/products/${productId}`);
  return res.data.data as Product;
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, Error, CreateProduct>({
    mutationFn: async (product) => {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", String(product.price));
      formData.append("category_id", String(product.category_id));

      if (product.description)
        formData.append("description", product.description);
      if (product.brand) formData.append("brand", product.brand);
      if (product.stock !== undefined)
        formData.append("stock", String(product.stock));
      if (product.image) formData.append("image", product.image);

      const res = await api.post("/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // 👈 required
        },
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      // Invalidate products list so UI refreshes
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to create product.");
    },
  });
};

// ✅ Restore product (soft-deleted → active again)
export const useRestoreProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, Error, number>({
    mutationFn: async (productId) => {
      const res = await api.put(`/products/${productId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Product restored!");
      // refresh single + list
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.data.id] });
    },
    onError: () => {
      toast.error("Failed to restore product.");
    },
  });
};

// ✅ Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, Error, number>({
    mutationFn: async (productId) => {
      const res = await api.delete(`/products/${productId}`);
      return res.data;
    },
    onSuccess: (_, productId) => {
      toast.success("Product deleted!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.removeQueries({ queryKey: ["product", productId] }); // remove from cache
    },
    onError: () => {
      toast.error("Failed to delete product.");
    },
  });
};

export type SearchResponse = {
  success: boolean;
  message: string;
  data: Product[];
};

export const useSearchProducts = (query: string, page = 0, limit = 12) => {
  return useQuery<SearchResponse>({
    queryKey: ["search", query, page],
    queryFn: async () => {
      const res = await api.get("/products/search", {
        params: { q: query, skip: page * limit, limit },
      });
      return res.data;
    },
    enabled: !!query, // 👈 only fetch when query is not empty
  });
};

// categories part

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  parent_id?: number;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CreateCategory {
  name: string;
  description?: string;
  slug?: string;
  parent_id?: number;
}

export const useCategories = (skip = 0, limit = 20) => {
  return useQuery({
    queryKey: ["categories", skip, limit],
    queryFn: async () => {
      const res = await api.get(`/categories?skip=${skip}&limit=${limit}`);
      return res.data.data as Category[];
    },
  });
};

export const useCategoryProducts = (slug: string) => {
  return useQuery<Product[]>({
    queryKey: ["products", "category", slug], // ✅ unique cache per category
    queryFn: async () => {
      const res = await api.get(`/products/category/${slug}`);
      return res.data.data as Product[]; // Adjust shape if needed
    },
    enabled: !!slug, // only fetch if slug exists
  });
};

// ✅ Get category by ID
export const useCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      const res = await api.get(`/categories/${categoryId}`);
      return res.data.data as Category;
    },
    enabled: !!categoryId, // only run if ID exists
  });
};

// ✅ Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CategoryResponse, Error, CreateCategory>({
    mutationFn: async (category) => {
      const res = await api.post("/categories/", category);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to create category.");
    },
  });
};

// ✅ Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CategoryResponse,
    Error,
    { id: number; updates: Partial<CreateCategory> }
  >({
    mutationFn: async ({ id, updates }) => {
      const res = await api.put(`/categories/${id}`, updates);
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Category updated!");
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to update category.");
    },
  });
};

// ✅ Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CategoryResponse, Error, number>({
    mutationFn: async (id) => {
      const res = await api.delete(`/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Category deleted!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to delete category.");
    },
  });
};

// 🔹 Backend cart type
export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
  cart_id: number;
};

export type CartResponse = {
  items: CartItem[];
  total_price: number;
};

// ✅ Fetch cart
export const useCart = () => {
  const { setItems, isHydrated } = useCartStore();

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data.data;
    },
    enabled: isHydrated, // ✅ only after Zustand is ready
    refetchOnWindowFocus: false,
  });

  // ✅ Sync backend → local store after fetch
  React.useEffect(() => {
    if (query.data?.items && isHydrated) {
      setItems(
        query.data.items.map((item: any) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
        }))
      );
    }
  }, [query.data, isHydrated, setItems]);

  return query;
};

// ✅ Add to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      product_id,
      quantity,
    }: {
      product_id: number;
      quantity: number;
    }) => {
      return api.post("/cart/add", { product_id, quantity });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    },
  });
};

// ✅ Update cart item (uses product_id for backend)
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      product_id,
      quantity,
    }: {
      product_id: number;
      quantity: number;
    }) => {
      return api.patch(
        `/cart/update?product_id=${product_id}&quantity=${quantity}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || "Failed to update cart");
    },
  });
};

// ✅ Remove item by cart_item.id
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ item_id }: { item_id: number }) => {
      return api.delete(`/cart/remove/${item_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || "Failed to remove item");
    },
  });
};

// ✅ Clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return api.delete("/cart/clear");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || "Failed to clear cart");
    },
  });
};

// =======================
// 🔹 Address Types
// =======================
export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  street_address: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  phone_number: string; // ✅ Add this
  is_default?: boolean;
}

export interface CreateAddress {
  full_name: string;
  street_address: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  phone_number: string;
  is_default?: boolean;
}

export interface UpdateAddress {
  full_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone_number?: string;
  is_default?: boolean;
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data: Address;
}

// =======================
// 🔹 Address Queries
// =======================

// ✅ Get all addresses
export const useAddresses = () => {
  return useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await api.get("/addresses");
      return res.data as Address[];
    },
  });
};

// ✅ Add new address
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<AddressResponse, Error, CreateAddress>({
    mutationFn: async (address) => {
      const res = await api.post("/addresses", address);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Address added successfully!");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => {
      toast.error("Failed to add address.");
    },
  });
};

// ✅ Update address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AddressResponse,
    Error,
    { id: number; updates: UpdateAddress }
  >({
    mutationFn: async ({ id, updates }) => {
      const res = await api.patch(`/addresses/${id}`, updates);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Address updated!");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => {
      toast.error("Failed to update address.");
    },
  });
};

// ✅ Delete address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: boolean }, Error, number>({
    mutationFn: async (id) => {
      const res = await api.delete(`/addresses/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Address deleted!");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => {
      toast.error("Failed to delete address.");
    },
  });
};

// ✅ Checkout order
export const useCheckout = () => {
  return useMutation<
    { success: boolean; order_id: number; status: string },
    any,
    { address_id: number }
  >({
    mutationFn: async ({ address_id }) => {
      const res = await api.post("/orders/checkout", null, {
        params: { address_id },
      });
      return res.data;
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        toast.error("Your cart is empty, please add items before checkout.");
      } else if (error.response?.status === 404) {
        toast.error("Order not found or already processed.");
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    },
  });
};

// ✅ Payment option type
export interface PaymentOption {
  id: number;
  bank_name: string;
  account_number: string;
  account_name: string;
}

// ✅ Fetch payment option (lazy load)
export const usePaymentOption = () => {
  return useQuery<PaymentOption>({
    queryKey: ["paymentOption"],
    queryFn: async () => {
      const res = await api.get("/payment-options");
      return res.data;
    },
    enabled: false, // load only when needed
  });
};

// ✅ Create or update payment option
export const useCreatePaymentOption = () => {
  const queryClient = useQueryClient();

  return useMutation<PaymentOption, any, Omit<PaymentOption, "id">>({
    mutationFn: async (option) => {
      const res = await api.post("/payment-options", option);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentOption"] }); // ✅ fixed
    },
  });
};

// ✅ Upload receipt
export const useUploadReceipt = () => {
  return useMutation<
    { success: boolean; message: string; receipt_url: string },
    Error,
    { order_id: number; file: File }
  >({
    mutationFn: async ({ order_id, file }) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(
        `/orders/${order_id}/upload-receipt`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Receipt uploaded successfully!");
    },
    onError: () => {
      toast.error("Failed to upload receipt.");
    },
  });
};

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
}

export interface UpdateProfile {
  username?: string;
  email?: string;
  is_active?: boolean;
}

export interface ChangePassword {
  old_password: string;
  new_password: string;
}

// ✅ Lazy profile fetch
export const useProfile = ({ enabled = false } = {}) => {
  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data as User;
    },
    enabled, // ❌ will not fetch unless enabled = true
  });
};

// ✅ Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<User, any, UpdateProfile>({
    mutationFn: async (updates) => {
      const res = await api.patch("/users/me/profile", updates);
      return res.data.data as User;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");

      // ✅ Update React Query cache
      queryClient.setQueryData(["profile"], data);

      // ✅ Sync Zustand store (so header, etc. update instantly)
      const { token, role, setAuth } = useAuthStore.getState();
      setAuth(data.username, data.email, role, token);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Failed to update profile");
    },
  });
};

// ✅ Change password
export const useChangePassword = () => {
  return useMutation<
    { success: boolean; message: string },
    any,
    ChangePassword
  >({
    mutationFn: async (payload) => {
      const res = await api.patch("/users/me/password", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Failed to change password");
    },
  });
};

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product; // optional if you include nested product
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: "pending" | "paid" | "cancelled";
  receipt_url?: string;
  created_at: string;
  items: OrderItem[];
  address?: Address;
}

// ============================
// 🔹 ORDERS (User)
// ============================

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data.data as Order[];
    },
  });
};

export const useOrder = (orderId: number) => {
  return useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await api.get(`/orders/${orderId}`);
      return res.data as Order;
    },
    enabled: !!orderId,
  });
};

// ============================
// 🔹 ADMIN: Orders Management
// ============================
export const useAdminOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const res = await api.get("/orders/admin/all");

      // Normalize safely:
      // 1) If API returns array directly -> use it
      // 2) If API returns { pending: [], paid: [], cancelled: [] } -> flatten
      // 3) If API returns { data: [...] } -> use that
      const payload = res.data;

      // case: { data: [...] }
      if (Array.isArray(payload?.data)) {
        return payload.data as Order[];
      }

      // case: grouped object in payload.data (or payload)
      const grouped =
        payload?.data &&
        typeof payload.data === "object" &&
        !Array.isArray(payload.data)
          ? payload.data
          : payload && typeof payload === "object" && !Array.isArray(payload)
          ? payload
          : null;

      if (grouped) {
        // Flatten all arrays in grouped object into one list
        const flattened: Order[] = Object.values(grouped)
          .flat()
          .filter(Boolean) as Order[];
        return flattened;
      }

      // fallback: empty array
      return [];
    },
  });
};

export const useAdminOrdersByStatus = (status: string) => {
  return useQuery({
    queryKey: ["admin", "orders", status],
    queryFn: async () => {
      const res = await api.get(`/orders/admin/status/${status}`);
      return res.data.data;
    },
    enabled: !!status,
  });
};

// ✅ Confirm payment
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await api.patch(`/admins/${orderId}/confirm-payment`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Payment confirmed!");
      if (data.email_sent) {
        toast.success("✅ Email sent successfully!");
      } else {
        toast.error("⚠️ Payment confirmed!, but email failed to send.");
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
};

// ✅ Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: number;
      status: string;
    }) => {
      const res = await api.patch(`/admins/${orderId}/update-status`, null, {
        params: { status },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Order status updated!");
      if (data.email_sent) {
        toast.success("✅ Email sent successfully!");
      } else {
        toast.error("⚠️ Order updated, but email failed to send.");
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
};

// ✅ Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await api.patch(`/admins/${orderId}/cancel`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Order cancelled!");
      if (data.email_sent) {
        toast.success("✅ Email sent successfully!");
      } else {
        toast.error("⚠️ Order Cancelled, but email failed to send.");
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
};

// ============================
// 🔹 ARCHIVED PRODUCTS
// ============================
export const useArchivedProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products", "archived"],
    queryFn: async () => {
      const res = await api.get("/products/archived");
      return res.data.data;
    },
  });
};

export const useAllProducts = (limit = 1000) => {
  return useQuery<Product[]>({
    queryKey: ["products", "all", limit],
    queryFn: async () => {
      const res = await api.get("/products", { params: { skip: 0, limit } });
      // normalize like orders:
      return Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : res.data?.data || [];
    },
  });
};

// ✅ Get single order (admin)
export const useAdminOrder = (orderId: number) => {
  return useQuery({
    queryKey: ["admin", "order", orderId],
    queryFn: async () => {
      const res = await api.get(`admins/orders/${orderId}`);
      return res.data.data;
    },
    enabled: !!orderId,
  });
};

export interface LastOrder {
  id: number | null;
  total_amount: number | null;
  status: string | null;
  created_at: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  last_order?: LastOrder | null;
  addresses: Address[];
}

// ✅ Fetch all users (admin/superadmin)
export const useAllUsers = () => {
  return useQuery<User[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await api.get("/admins/users");
      return res.data.data;
    },
  });
};

// ✅ Fetch single user details (admin/superadmin)
export const useUserDetails = (userId: number) => {
  return useQuery<User & { orders: Order[] }>({
    queryKey: ["admin", "user", userId],
    queryFn: async () => {
      const res = await api.get(`/admins/users/${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
  });
};

// ✅ Deactivate user (admin/superadmin)
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const res = await api.patch(`/admins/users/${userId}/deactivate`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deactivated!");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

// ✅ Activate user (admin/superadmin)
export const useActivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const res = await api.patch(`/admins/users/${userId}/activate`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User activated!");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

// ✅ Permanently delete user (superadmin only)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const res = await api.delete(`/admins/users/${userId}/delete`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted!");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};
