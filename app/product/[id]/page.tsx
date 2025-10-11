// app/products/[id]/page.tsx
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
// server-safe fetcher
import ProductPageClient from "@/components/ProductPageClient";
import { getProduct } from "@/hooks/queries";

// --- Metadata for SEO ---
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const product = await getProduct(Number(params.id));
    return {
      title: product?.name ?? "Product details",
      description: product?.description ?? "All products - BuyPoint",
    };
  } catch {
    return {
      title: "Product details",
      description: "All products - BuyPoint",
    };
  }
}

// --- Server component with prefetch + hydration ---
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["product", Number(params.id)],
    queryFn: () => getProduct(Number(params.id)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductPageClient id={Number(params.id)} />
    </HydrationBoundary>
  );
}
