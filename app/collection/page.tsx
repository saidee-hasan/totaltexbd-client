import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import HorizontalScroll from "@/components/HorizontalScroll";
import LuxuryEditorial from "@/components/LuxuryEditorial";

export default function CollectionPage() {
  return (
    <main className="w-full min-h-screen pt-20">
      <div className="text-center py-24 bg-neutral-50 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-3">
          The Collection
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto uppercase tracking-widest text-sm font-bold">
          Explore our latest arrivals and seasonal edits.
        </p>
      </div>
      <Suspense fallback={<div className="min-h-[500px]" />}>
        <ProductGrid />
      </Suspense>
      <LuxuryEditorial />
      <HorizontalScroll />
    </main>
  );
}
