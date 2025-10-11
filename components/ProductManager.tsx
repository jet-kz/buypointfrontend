"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, PlusCircle, RefreshCw, Search } from "lucide-react";
import { useProducts, useCategories, useCreateProduct } from "@/hooks/queries";
import { toast } from "sonner";

export default function ProductManager() {
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, refetch } =
    useProducts(20);

  const products = data?.pages.flat() ?? [];
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    stock: "",
    image: null as File | null,
  });

  const [visibleCount, setVisibleCount] = useState(10);
  const [search, setSearch] = useState("");

  // ✅ Filter by search text
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query))
    );
  }, [products, search]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const handleLoadMore = async () => {
    if (hasNextPage) await fetchNextPage();
    setVisibleCount((prev) => prev + 10);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category_id) {
      toast.error("Please fill in required fields");
      return;
    }
    await createProduct.mutateAsync({
      name: form.name,
      price: Number(form.price),
      category_id: Number(form.category_id),
      stock: Number(form.stock || 0),
      image: form.image,
    });
    setForm({
      name: "",
      price: "",
      category_id: "",
      stock: "",
      image: null,
    });
  };

  return (
    <div className="space-y-6">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-xl font-semibold">Product Management</h1>
        <Button
          onClick={() => refetch()}
          variant="outline"
          disabled={isFetching}
          className="gap-2"
        >
          {isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* ➕ Create Product Form */}
      <Card className="p-5 rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" /> Add Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            <Input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <Input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
              className="border rounded-md p-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.files ? e.target.files[0] : null,
                })
              }
            />
            <Button
              type="submit"
              disabled={createProduct.isPending}
              className="col-span-full bg-primary text-white"
            >
              {createProduct.isPending ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Create Product"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 🛍️ Product List Section */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle>Products</CardTitle>

            {/* 🔍 Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-2xl" />
          ) : visibleProducts.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {visibleProducts.map((p) => (
                <div
                  key={p.id}
                  className="border rounded-xl p-3 hover:shadow-md transition"
                >
                  <img
                    src={p.thumbnail_url || p.image_url}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-semibold truncate">{p.name}</h3>
                  <p className="text-sm text-gray-500">${p.price}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Load More */}
      {filteredProducts.length > visibleCount && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="rounded-full mt-2"
          >
            View More
          </Button>
        </div>
      )}
    </div>
  );
}
