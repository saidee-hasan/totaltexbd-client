import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getApiBase } from '@/lib/api';
import type { ProductRecord } from '@/lib/api';
import type { Metadata } from 'next';
import ProductGallery from '@/components/ProductGallery';
import ProductDetailClient from '@/components/ProductDetailClient';
import { ChevronLeft, Home } from 'lucide-react';

async function fetchProduct(id: string): Promise<ProductRecord | null> {
  try {
    const res = await fetch(`${getApiBase()}/api/products/${id}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) return data.data as ProductRecord;
    }
  } catch (err) {
    console.error('Failed to fetch product:', err);
  }
  return null;
}

async function fetchRelated(category: string | undefined, excludeId: string): Promise<ProductRecord[]> {
  try {
    const res = await fetch(`${getApiBase()}/api/products`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const all: ProductRecord[] = data?.data?.products || data?.data || [];
    if (!Array.isArray(all)) return [];
    return all
      .filter((p) => p._id !== excludeId && (!category || p.category === category))
      .slice(0, 5);
  } catch (err) {
    console.error('Failed to fetch related products:', err);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await fetchProduct(resolvedParams.id);
  if (product) {
    return {
      title: `${product.name} | Total Apparel Wholesale`,
      description: product.shortDescription || product.description || `View ${product.name} at Total Apparel.`,
      openGraph: {
        title: product.name,
        description: product.shortDescription || '',
        images: product.imgPrimary ? [{ url: product.imgPrimary }] : [],
      },
    };
  }
  return { title: 'Product Not Found | Total Apparel' };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const product = await fetchProduct(productId);
  if (!product) {
    notFound();
  }

  const related = await fetchRelated(product.category, productId);

  const primaryImage = product.imgPrimary?.trim() || '';
  const secondaryImage = product.imgSecondary?.trim() || '';
  const galleryImages = Array.from(
    new Set([primaryImage, secondaryImage, ...(product.galleryImages || [])])
  ).filter(Boolean);

  const specs = [
    { label: 'Category', value: [product.category, product.subCategory].filter(Boolean).join(' / ') },
    { label: 'Material / Fabric', value: product.material },
    { label: 'Fit & Cut', value: product.fit },
    { label: 'Pattern', value: product.pattern },
    { label: 'Sleeve Type', value: product.sleeveType },
    { label: 'Neck Type', value: product.neckType },
    { label: 'Gender', value: product.gender },
    { label: 'Brand', value: product.brand },
    { label: 'SKU', value: product.sku },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value));

  const inStock = product.inStock !== false && product.stockStatus !== 'out-of-stock';

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 sm:pt-28 lg:pt-30 pb-16 sm:pb-24">
      {/* Breadcrumb Navigation Bar */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2.5 py-2.5 border-b border-gray-200">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-wider text-gray-600 hover:text-[#C9A227] transition-colors uppercase cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#C9A227]" />
            <span>Back to Products</span>
          </Link>

          <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-900 transition-colors">
              Products
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-[#C9A227] transition-colors font-bold text-gray-700 truncate max-w-[120px] sm:max-w-none"
                >
                  {product.category}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-bold truncate max-w-[140px] sm:max-w-[220px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailClient
          galleryNode={<ProductGallery images={galleryImages} productName={product.name} />}
          product={product}
          specs={specs}
          inStock={inStock}
          related={related}
        />
      </main>
    </div>
  );
}
