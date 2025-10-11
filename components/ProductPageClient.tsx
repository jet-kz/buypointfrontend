// app/products/[id]/ProductPageClient.tsx
"use client";

import { useProduct } from "@/hooks/queries";

import Wrapper from "@/components/Wrapper";
import Detail from "./Details";

export default function ProductPageClient({ id }: { id: number }) {
  const { data: product, isLoading, isError } = useProduct(id);

  //   if (isLoading) {
  //     return (
  //       <div className="flex justify-center items-center py-20">
  //         <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //       </div>
  //     );
  //   }

  if (isError || !product) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500">Failed to load product.</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex-1">
      <Wrapper>
        <Detail product={product} />
      </Wrapper>
    </div>
  );
}
