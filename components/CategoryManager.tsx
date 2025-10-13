"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Loader2,
  PlusCircle,
  Trash,
  RefreshCw,
  Edit2,
  X,
  Check,
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

  const [openDialogId, setOpenDialogId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    await createCategory.mutateAsync({
      name: form.name,
      description: form.description,
    });
    setForm({ name: "", description: "" });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const startEdit = (cat: {
    id: number;
    name: string;
    description?: string;
  }) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, description: cat.description ?? "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editForm.name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    await updateCategory.mutateAsync({
      id: editingId,
      updates: {
        name: editForm.name,
        description: editForm.description,
      },
    });

    setEditingId(null);
    setEditForm({ name: "", description: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-xl font-semibold">Product Categories</h1>
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

      {/* Create Category */}
      <Card className="p-5 rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" /> Add Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <Input
              placeholder="Category Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <Button
              type="submit"
              disabled={createCategory.isPending}
              className="col-span-full bg-primary text-white"
            >
              {createCategory.isPending ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Create Category"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Category List */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-400">No categories found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const isEditing = editingId === cat.id;
                return (
                  <div
                    key={cat.id}
                    className="border rounded-xl p-3 hover:shadow-md transition flex flex-col gap-3"
                  >
                    {/* Display or Edit form */}
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Category name"
                        />
                        <Input
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Description (optional)"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold">{cat.name}</h3>
                        <p className="text-sm text-gray-500">
                          {cat.description || "No description"}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEdit}
                              className="gap-2"
                              disabled={updateCategory.isPending}
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={saveEdit}
                              className="gap-2 bg-primary text-white"
                              disabled={updateCategory.isPending}
                            >
                              {updateCategory.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="w-4 h-4" />
                                  Save
                                </>
                              )}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              startEdit({
                                id: cat.id,
                                name: cat.name,
                                description: cat.description,
                              })
                            }
                            className="gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Button>
                        )}
                      </div>

                      {/* Delete with Dialog */}
                      <Dialog
                        open={openDialogId === cat.id}
                        onOpenChange={(open) =>
                          setOpenDialogId(open ? cat.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Delete"
                            disabled={deleteCategory.isPending}
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[400px]">
                          <DialogHeader>
                            <DialogTitle>Delete Category</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete{" "}
                              <strong>{cat.name}</strong>? This action cannot be
                              undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setOpenDialogId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-red-600 text-white hover:bg-red-700"
                              disabled={deleteCategory.isPending}
                              onClick={async () => {
                                await handleDelete(cat.id);
                                setOpenDialogId(null);
                              }}
                            >
                              {deleteCategory.isPending ? (
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
