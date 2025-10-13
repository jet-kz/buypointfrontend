"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  PlusCircle,
  RefreshCw,
  Search,
  Edit,
  Trash,
} from "lucide-react";
import {
  useProducts,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/queries";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProductManager() {
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, refetch } =
    useProducts(20);

  const products = data?.pages.flat() ?? [];
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    stock: "",
    image: null as File | null,
  });

  const [editForm, setEditForm] = useState({
    id: 0,
    name: "",
    price: "",
    stock: "",
    category_id: "",
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteId, setOpenDeleteId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [search, setSearch] = useState("");

  // Filter by search text
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

  const handleEditOpen = (p: any) => {
    setEditForm({
      id: p.id,
      name: p.name,
      price: String(p.price),
      stock: String(p.stock || 0),
      category_id: String(p.category_id || ""),
    });
    setOpenEdit(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.price) {
      toast.error("All fields required");
      return;
    }
    try {
      await updateProduct.mutateAsync({
        id: editForm.id,
        data: {
          name: editForm.name,
          price: Number(editForm.price),
          stock: Number(editForm.stock),
          category_id: Number(editForm.category_id),
        },
      });
      toast.success("Product updated");
      setOpenEdit(false);
    } catch {
      // toast handled in hook, but keep catch to prevent unhandled rejection
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
      setOpenDeleteId(null);
    } catch {
      // toast handled in hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Create Product Form */}
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

      {/* Product List Section */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle>Products</CardTitle>

            {/* Search Input */}
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
                  className="border rounded-xl p-3 hover:shadow-md transition relative"
                >
                  <img
                    src={p.thumbnail_url || p.image_url}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-semibold truncate">{p.name}</h3>
                  <p className="text-sm text-gray-500">${p.price}</p>

                  {/* Edit and Delete buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOpen(p)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    {/* Delete Dialog using your Dialog component */}
                    <Dialog
                      open={openDeleteId === p.id}
                      onOpenChange={(open) =>
                        setOpenDeleteId(open ? p.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete product"
                          disabled={deleteProduct.isPending}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[420px]">
                        <DialogHeader>
                          <DialogTitle>Delete Product</DialogTitle>
                          <div className="text-sm text-muted-foreground">
                            Are you sure you want to delete{" "}
                            <strong>{p.name}</strong>? This action will archive
                            the product.
                          </div>
                        </DialogHeader>

                        <DialogFooter className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setOpenDeleteId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-red-600 text-white hover:bg-red-700"
                            disabled={deleteProduct.isPending}
                            onClick={async () => {
                              await handleDelete(p.id);
                              setOpenDeleteId(null);
                            }}
                          >
                            {deleteProduct.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Delete"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Edit Product Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-3">
            <Input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              placeholder="Product name"
            />
            <Input
              type="number"
              value={editForm.price}
              onChange={(e) =>
                setEditForm({ ...editForm, price: e.target.value })
              }
              placeholder="Price"
            />
            <Input
              type="number"
              value={editForm.stock}
              onChange={(e) =>
                setEditForm({ ...editForm, stock: e.target.value })
              }
              placeholder="Stock"
            />
            <select
              value={editForm.category_id}
              onChange={(e) =>
                setEditForm({ ...editForm, category_id: e.target.value })
              }
              className="border rounded-md p-2 w-full"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <DialogFooter>
              <Button
                type="submit"
                disabled={updateProduct.isPending}
                className="w-full"
              >
                {updateProduct.isPending ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Update Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
