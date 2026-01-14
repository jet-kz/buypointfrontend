"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  Loader2,
  PlusCircle,
  Trash,
  RefreshCw,
  Edit2,
  X,
  Check,
  FolderTree,
  Search,
  MoreVertical,
  Layers,
} from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/queries";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryManager() {
  const {
    data: categories = [],
    isLoading,
    refetch,
    isFetching,
  } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await createCategory.mutateAsync({
        name: form.name,
        description: form.description,
      });
      setForm({ name: "", description: "" });
      setIsCreateOpen(false);
    } catch (err) { }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory.mutateAsync(id);
    } catch (err) { }
  };

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, description: cat.description ?? "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editForm.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      await updateCategory.mutateAsync({
        id: editingId,
        updates: {
          name: editForm.name,
          description: editForm.description,
        },
      });
      setEditingId(null);
    } catch (err) { }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-gray-500 text-sm">Organize your products into logical groups</p>
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

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-100">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add New Category</DialogTitle>
                <DialogDescription>Create a new group for your products.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Category Name</label>
                  <Input
                    placeholder="e.g. Electronics, Fashion"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    placeholder="Briefly describe what goes in this category..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full min-h-[100px] border border-gray-200 bg-white px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createCategory.isPending} className="w-full h-11 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold">
                    {createCategory.isPending ? <Loader2 className="animate-spin" /> : "Create Category"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Find categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl border-gray-200 focus:border-orange-500 h-10 shadow-sm"
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <Layers className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 font-medium">No categories found matched your search</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredCategories.map((cat) => (
              <motion.div
                layout
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden border group bg-white h-full flex flex-col">
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                        <FolderTree size={20} />
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(cat)}
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 size={14} />
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500 hover:bg-red-50"
                            >
                              <Trash size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-3xl max-w-sm">
                            <DialogHeader>
                              <DialogTitle className="text-xl">Delete Category?</DialogTitle>
                            </DialogHeader>
                            <div className="py-2">
                              <p className="text-gray-500 text-sm">Deleting <strong>{cat.name}</strong> will remove it from the system. Products in this category will become uncategorized.</p>
                            </div>
                            <DialogFooter className="flex gap-2">
                              <Button variant="outline" className="flex-1 rounded-xl h-10">Cancel</Button>
                              <Button variant="destructive" className="flex-1 rounded-xl h-10 font-bold" onClick={() => handleDelete(cat.id)}>
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {editingId === cat.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editForm.name}
                          autoFocus
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="h-9 rounded-lg"
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full text-sm border border-gray-200 rounded-lg p-2 min-h-[60px]"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 h-8 font-bold" onClick={saveEdit}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
                          {cat.description || "No description provided for this category."}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <span className="text-[10px] text-gray-400 font-mono">#{cat.slug}</span>
                    <Badge variant="outline" className="bg-white text-[10px] font-normal rounded-lg border-gray-200">
                      Active
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
