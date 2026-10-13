"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight, Shirt, Sparkles } from "lucide-react";
import type { ProductRecord } from "@/lib/api";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

interface SpecItem {
  label: string;
  value: string;
}

// Pick a readable check colour for a swatch based on its luminance.
const isLightColor = (hex?: string): boolean => {
  if (!hex) return true;
  const h = hex.replace("#", "").trim();
  if (h.length !== 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return true;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
};

interface ProductDetailClientProps {
  galleryNode?: React.ReactNode;
  product: ProductRecord;
  specs: SpecItem[];
  inStock: boolean;
  related: ProductRecord[];
}

export default function ProductDetailClient({
  galleryNode,
  product,
  specs,
  inStock,
  related,
}: ProductDetailClientProps) {
  const colors = product.colors || [];
  const sizes = product.sizes || [];

  const [selectedColor, setSelectedColor] = useState<string>(colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState<string>(
    sizes.find((s) => s.inStock)?.name || sizes[0]?.name || ""
  );
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");

  const quoteParams = new URLSearchParams({
    product: product.name,
  });
  if (product.sku) quoteParams.set("sku", product.sku);
  if (selectedColor) quoteParams.set("color", selectedColor);
  if (selectedSize) quoteParams.set("size", selectedSize);
  const quoteUrl = `/contact?${quoteParams.toString()}`;

  return (
    <div className="flex flex-col w-full">
      {/* TOP SECTION: Left Gallery + Right Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Left Column: Gallery */}
        {galleryNode && (
          <div className="lg:col-span-5 xl:col-span-5">{galleryNode}</div>
        )}

        {/* Right Column: Title, Colors, Sizes, CTA */}
        <div className={galleryNode ? "lg:col-span-7 xl:col-span-7 flex flex-col" : "flex flex-col"}>
          {/* Category & Stock */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#C9A227]">
              {product.category || "Apparel Catalog"}
              {product.subCategory ? ` • ${product.subCategory}` : ""}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border ${
                inStock
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                  : "bg-red-50 text-red-600 border-red-200/60"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
              {inStock ? "In Stock" : "Made to Order"}
            </span>
            {product.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#C9A227]/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#C9A227] border border-[#C9A227]/20">
                <Sparkles className="w-2.5 h-2.5" /> Featured
              </span>
            )}
          </div>

          {/* Product Title */}
          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-[#1A1A1A] leading-[1.25] tracking-tight mb-2">
            {product.name}
          </h1>

          {/* Real Price Display if set */}
          {product.price && (
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-[#1A1A1A]">
                {product.price}
              </span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Wholesale / B2B Pricing
              </span>
            </div>
          )}

          {/* Quick Meta Row - Only real attributes */}
          {(product.sku || product.brand || product.gender) && (
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 mb-4 text-[10.5px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-y border-gray-100 py-2">
              {product.sku && (
                <span>
                  SKU: <strong className="text-gray-900">{product.sku}</strong>
                </span>
              )}
              {product.sku && product.brand && <span className="text-gray-300">•</span>}
              {product.brand && (
                <span>
                  Brand: <strong className="text-gray-900">{product.brand}</strong>
                </span>
              )}
              {(product.sku || product.brand) && product.gender && <span className="text-gray-300">•</span>}
              {product.gender && (
                <span>
                  Gender: <strong className="text-gray-900">{product.gender}</strong>
                </span>
              )}
            </div>
          )}

          {/* Short Summary */}
          {product.shortDescription && (
            <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-4">
              {product.shortDescription}
            </p>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#1A1A1A]">
                  Available Colors ({colors.length})
                </span>
                {selectedColor && (
                  <span className="text-xs font-bold text-[#C9A227]">Selected: {selectedColor}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((c, i) => {
                  const isSelected = selectedColor === c.name;
                  const light = isLightColor(c.hex);
                  return (
                    <button
                      key={i}
                      type="button"
                      title={c.name}
                      onClick={() => c.name && setSelectedColor(c.name)}
                      className="group/color flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                      <span
                        className={`relative flex h-9 w-9 items-center justify-center rounded-full border shadow-2xs transition-all duration-200 ${
                          isSelected
                            ? "border-transparent ring-2 ring-[#C9A227] ring-offset-2"
                            : "border-gray-300 group-hover/color:scale-110"
                        }`}
                        style={{ backgroundColor: c.hex || "#e5e7eb" }}
                      >
                        {isSelected && (
                          <Check className={`h-4 w-4 stroke-[3] ${light ? "text-black" : "text-white"}`} />
                        )}
                      </span>
                      <span
                        className={`text-xs font-semibold leading-none ${
                          isSelected ? "text-[#1A1A1A]" : "text-gray-500"
                        }`}
                      >
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#1A1A1A]">
                  Available Sizing: <span className="text-[#C9A227]">{selectedSize}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {sizes.map((s, i) => {
                  const isSelected = selectedSize === s.name;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={!s.inStock}
                      onClick={() => s.inStock && s.name && setSelectedSize(s.name)}
                      className={`min-w-[2.75rem] px-3 py-1.5 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                        !s.inStock
                          ? "border-gray-100 text-gray-300 bg-gray-50 line-through cursor-not-allowed"
                          : isSelected
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-xs"
                          : "border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Primary CTA */}
          <Link
            href={quoteUrl}
            className="w-full bg-[#1A1A1A] hover:bg-[#C9A227] text-white h-12 px-5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <span>Request Wholesale Quote</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* LOWER SECTION: Description/Specs Tabs + Similar Products */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left: Tabs */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  activeTab === "description"
                    ? "bg-[#1A1A1A] text-white shadow-xs"
                    : "bg-white text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-200"
                }`}
              >
                Description
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  activeTab === "specs"
                    ? "bg-[#1A1A1A] text-white shadow-xs"
                    : "bg-white text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-200"
                }`}
              >
                Specifications ({specs.length})
              </button>
            </div>

            <div className="mt-4 bg-white p-5 sm:p-7 rounded-xl border border-gray-200 shadow-2xs">
              {activeTab === "description" && (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">{product.name}</h3>
                  {product.description ? (
                    <div
                      className="product-rich max-w-none"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                    />
                  ) : (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {product.shortDescription || "No detailed description available."}
                    </p>
                  )}
                </div>
              )}

              {activeTab === "specs" && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                    Technical Specifications
                  </h3>
                  {specs.length > 0 ? (
                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                      {specs.map((s, idx) => (
                        <div
                          key={s.label}
                          className={`grid grid-cols-3 p-3 text-xs ${idx % 2 === 0 ? "bg-gray-50/60" : "bg-white"}`}
                        >
                          <span className="font-bold text-gray-500 uppercase tracking-wider col-span-1">{s.label}</span>
                          <span className="font-semibold text-gray-900 col-span-2">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No additional specifications available.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Similar Products */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 h-[45px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                <h3 className="text-xs sm:text-sm font-extrabold text-[#1A1A1A] uppercase tracking-wider">
                  Similar Products
                </h3>
              </div>
              <Link
                href={product.category ? `/products?category=${encodeURIComponent(product.category)}` : "/products"}
                className="text-xs font-bold text-[#C9A227] hover:underline uppercase transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-2xs p-4 sticky top-28">
              {related.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {related.map((rp) => (
                    <Link
                      key={rp._id}
                      href={`/products/${rp.slug || rp._id}`}
                      className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0 hover:bg-gray-50/70 -mx-1 px-1 rounded-lg transition-colors"
                    >
                      <div className="relative aspect-square w-14 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        {rp.imgPrimary ? (
                          <Image
                            src={rp.imgPrimary}
                            alt={rp.name}
                            fill
                            unoptimized={rp.imgPrimary.startsWith("http")}
                            className="object-contain p-1 group-hover:scale-105 transition-transform"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Shirt className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#C9A227] transition-colors line-clamp-2 leading-snug">
                          {rp.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-400">
                            {rp.subCategory || rp.category}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-gray-500 group-hover:text-[#C9A227]">
                          <span>View Product</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-4 text-center">No similar products in this category.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-3.5 py-2.5 sm:hidden flex items-center justify-between shadow-2xl">
        <div className="flex flex-col max-w-[55%]">
          <span className="text-xs font-bold text-gray-900 truncate">{product.name}</span>
          <span className="text-[11px] font-semibold text-gray-500">
            {selectedColor || "Color"} {selectedSize ? `• ${selectedSize}` : ""}
          </span>
        </div>
        <Link
          href={quoteUrl}
          className="bg-[#1A1A1A] hover:bg-[#C9A227] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-colors"
        >
          <span>Quote</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
