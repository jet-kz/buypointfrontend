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

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// --- Metadata for SEO ---
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  try {
    const product = await getProduct(Number(id));
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
export default async function ProductPage(props: Props) {
  const params = await props.params;
  const id = Number(params.id);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductPageClient id={id} />
    </HydrationBoundary>
  );
}
