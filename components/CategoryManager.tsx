"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, PlusCircle, Trash, RefreshCw } from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/hooks/queries";

export default function CategoryManager() {
  const {
    data: categories = [],
    isLoading,
    refetch,
    isFetching,
  } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    await createCategory.mutateAsync({
      name: form.name,
      description: form.description,
    });
    setForm({ name: "", description: "" });
  };

  const handleDelete = async (id: number) => {
    await deleteCategory.mutateAsync(id);
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
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="border rounded-xl p-3 hover:shadow-md transition flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="text-sm text-gray-500">
                      {cat.description || "No description"}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
