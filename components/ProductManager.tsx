"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  PlusCircle,
  RefreshCw,
  Search,
  Edit,
  Trash,
  Package,
  MoreVertical,
  Filter,
  Image as ImageIcon,
  Boxes,
} from "lucide-react";
import {
  useProducts,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  Product,
} from "@/hooks/queries";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";


export default function ProductManager() {
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, refetch } =
    useProducts(50); // Increased limit for admin

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
    brand: "",
    description: "",
  });

  const [editForm, setEditForm] = useState({
    id: 0,
    name: "",
    price: "",
    stock: "",
    category_id: "",
    brand: "",
    description: "",
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteId, setOpenDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter by search text and status
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Status filtering
    if (activeTab === "low-stock") {
      filtered = filtered.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10);
    } else if (activeTab === "out-of-stock") {
      filtered = filtered.filter(p => (p.stock ?? 0) === 0);
    }

    const query = search.trim().toLowerCase();
    if (!query) return filtered;
    return filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query))
    );
  }, [products, search, activeTab]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category_id) {
      toast.error("Please fill in required fields");
      return;
    }
    try {
      await createProduct.mutateAsync({
        name: form.name,
        price: Number(form.price),
        category_id: Number(form.category_id),
        stock: Number(form.stock || 0),
        image: form.image,
        brand: form.brand,
        description: form.description,
      });
      toast.success("Product created successfully!");
      setForm({
        name: "",
        price: "",
        category_id: "",
        stock: "",
        image: null,
        brand: "",
        description: "",
      });
    } catch (error) {
      // Error handled by query observer
    }
  };

  const handleEditOpen = (p: Product) => {
    setEditForm({
      id: p.id,
      name: p.name,
      price: String(p.price),
      stock: String(p.stock || 0),
      category_id: String(p.category_id || ""),
      brand: p.brand || "",
      description: p.description || "",
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
          brand: editForm.brand,
          description: editForm.description,
        },
      });
      toast.success("Product updated");
      setOpenEdit(false);
    } catch {
      // toast handled in hook
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 text-sm">Manage your inventory and product listings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isFetching}
            className="rounded-xl border-gray-200"
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            ) : (
              <RefreshCw className="w-4 h-4 text-gray-500" />
            )}
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-200">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">New Product</DialogTitle>
                <DialogDescription>Fill in the details to list a new product on BuyPoint.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Product Name *</label>
                    <Input
                      placeholder="e.g. Premium Wireless Headphones"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Brand Name</label>
                    <Input
                      placeholder="e.g. Sony"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Price (USD) *</label>
                    <Input
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Stock Quantity *</label>
                    <Input
                      placeholder="100"
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Category *</label>
                    <select
                      value={form.category_id}
                      onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      className="w-full flex h-10 border border-gray-200 bg-white px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Product Image</label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({ ...form, image: e.target.files ? e.target.files[0] : null })}
                        className="rounded-xl pr-10"
                      />
                      <ImageIcon className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                      placeholder="Describe the product..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full min-h-[100px] border border-gray-200 bg-white px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createProduct.isPending}
                    className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-bold"
                  >
                    {createProduct.isPending ? <Loader2 className="animate-spin" /> : "Publish Product"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Area */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList className="bg-gray-100 p-1 rounded-xl w-fit">
            <TabsTrigger value="all" className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
            <TabsTrigger value="low-stock" className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Low Stock</TabsTrigger>
            <TabsTrigger value="out-of-stock" className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Out of Stock</TabsTrigger>
          </TabsList>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl border-gray-200 focus:border-orange-500 h-10 shadow-sm"
            />
          </div>
        </div>

        <div className="m-0 border-0">
          <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-6 py-4"><Skeleton className="h-12 w-full" /></td>
                      </tr>
                    ))
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-400">
                          <Package size={48} className="stroke-1" />
                          <p>No products found matched your criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                              <img src={p.thumbnail_url || p.image_url || "/placeholder.png"} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate max-w-[200px]">{p.name}</p>
                              <p className="text-xs text-gray-500">{p.brand || "Generic"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 rounded-lg border-gray-200 font-normal">
                            {categories.find(c => c.id === p.category_id)?.name || "Uncategorized"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          ₦{(p.price * 1500).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${(p.stock ?? 0) > 10 ? "bg-green-500" : (p.stock ?? 0) > 0 ? "bg-yellow-500" : "bg-red-500"}`} />
                              <span className="text-sm font-medium text-gray-900">{p.stock ?? 0} units</span>
                            </div>
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${(p.stock ?? 0) > 10 ? "bg-green-500" : "bg-orange-500"}`}
                                style={{ width: `${Math.min(((p.stock ?? 0) / 50) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEditOpen(p)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setOpenDeleteId(p.id)}>
                              <Trash size={16} />
                            </Button>
                          </div>
                          <div className="sm:hidden group-hover:hidden">
                            <MoreVertical size={16} className="text-gray-400 ml-auto" />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Tabs>

      {/* Edit Component Styled Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Product Name *</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Brand Name</label>
                <Input
                  value={editForm.brand}
                  onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Price (USD) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Stock Quantity *</label>
                <Input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category *</label>
                <select
                  value={editForm.category_id}
                  onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                  className="w-full h-10 border border-gray-200 bg-white px-3 py-2 text-sm rounded-xl"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full min-h-[100px] border border-gray-200 bg-white px-3 py-2 text-sm rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={updateProduct.isPending}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
              >
                {updateProduct.isPending ? <Loader2 className="animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteId !== null} onOpenChange={(open) => !open && setOpenDeleteId(null)}>
        <DialogContent className="max-w-md rounded-3xl">
          <div className="p-2">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
              <Trash size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete this product? This action cannot be undone and it will be removed from your catalog.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setOpenDeleteId(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-bold"
                onClick={() => openDeleteId && handleDelete(openDeleteId)}
                disabled={deleteProduct.isPending}
              >
                {deleteProduct.isPending ? <Loader2 className="animate-spin" /> : "Delete Forever"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
