"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Loader2, ArrowDown, ArrowRight, Package } from "lucide-react";
import { fetchSectionMap, SectionRecord, getApiBase } from "@/lib/api";
import type { ProductRecord } from "@/lib/api";

interface LookProduct {
  id: string;
  name: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  tags?: string[];
  image: string;
  category?: string;
  href?: string;
  hotspot?: { top: string; left: string };
}

interface Look {
  id: string;
  lookName: string;
  theme: string;
  description?: string;
  mainImage: string;
  layout?: "left" | "right";
  dividerImage?: string;
  products: LookProduct[];
}

const getImageUrl = (src?: string) => {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  return `${getApiBase()}${src.startsWith("/") ? "" : "/"}${src}`;
};

// Build editorial "looks" from the real product catalog, grouped by category.
const buildLooksFromProducts = (products: ProductRecord[]): Look[] => {
  const groups = new Map<string, ProductRecord[]>();
  products.forEach((p) => {
    const key = (p.category || "Collection").trim();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  });

  const looks: Look[] = [];
  let index = 0;
  for (const [category, items] of groups.entries()) {
    if (items.length === 0) continue;
    const main = items.find((p) => p.imgPrimary) || items[0];
    looks.push({
      id: `look-${index}`,
      lookName: `Look ${String(index + 1).padStart(2, "0")}`,
      theme: category,
      description: main.shortDescription || "",
      mainImage: main.imgPrimary || "",
      layout: index % 2 === 0 ? "left" : "right",
      products: items.slice(0, 4).map((p) => ({
        id: p._id || p.name,
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.imgPrimary || "",
        href: p.slug || p._id ? `/products/${p.slug || p._id}` : undefined,
      })),
    });
    index += 1;
  }
  return looks;
};

const LookSection = ({ look, index }: { look: Look; index: number }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0.4, 1, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.97]);

  const products = look.products || [];
  const isRightLayout = look.layout === "right" || index % 2 !== 0;

  return (
    <div ref={sectionRef} id={look.id} className="relative w-full scroll-mt-32 py-12 sm:py-20 md:py-28">
      {look.dividerImage && (
        <div className="relative mb-14 h-[28vh] w-full overflow-hidden md:mb-24 md:h-[45vh]">
          <motion.div style={{ y: imageY }} className="absolute inset-0 -top-[20%] h-[140%] w-full">
            <Image src={getImageUrl(look.dividerImage)} alt="Divider" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-black/25" />
          </motion.div>
        </div>
      )}

      <div
        className={`mx-auto flex max-w-9xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 ${
          isRightLayout ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Main image with parallax */}
        <div className="w-full lg:w-1/2">
          <motion.div
            style={{ opacity, scale }}
            className="group relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden rounded-2xl sm:rounded-[2rem] bg-gray-100 shadow-2xl lg:sticky lg:top-28"
          >
            {look.mainImage ? (
              <motion.div style={{ y: imageY }} className="absolute inset-0 -top-[8%] h-[116%] w-full">
                <Image
                  src={getImageUrl(look.mainImage)}
                  alt={look.theme || look.lookName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index === 0}
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
            )}

            {/* Category badge */}
            <div className="absolute left-4 top-4 z-20 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              {look.lookName}
            </div>

            {/* Hotspots (only when curated content provides them) */}
            {products
              .filter((p) => p.hotspot)
              .map((product) => (
                <div
                  key={`hotspot-${product.id}`}
                  className="group/hotspot absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ top: product.hotspot?.top || "50%", left: product.hotspot?.left || "50%" }}
                >
                  <div className="relative flex h-8 w-8 items-center justify-center md:h-10 md:w-10">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#C9A227] opacity-60 transition-all duration-700 group-hover/hotspot:animate-ping" />
                    <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#C9A227] shadow-lg shadow-[#C9A227]/40 md:h-7 md:w-7">
                      <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </div>
                  <div
                    className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-gray-100 bg-white/95 px-4 py-3 text-xs font-bold text-[#1A1A1A] opacity-0 shadow-2xl backdrop-blur-md transition-opacity duration-300 group-hover/hotspot:opacity-100 md:block ${
                      isRightLayout ? "right-full mr-4" : "left-full ml-4"
                    }`}
                  >
                    {product.name}
                    {product.price ? ` - ${product.price}` : ""}
                  </div>
                </div>
              ))}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Products list */}
        <div className="flex w-full flex-col lg:w-1/2 lg:pt-4">
          <motion.div
            initial={{ opacity: 0, x: isRightLayout ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-8 sm:mb-10 text-left"
          >
            <h4 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.3em] text-[#C9A227]">{look.lookName}</h4>
            <h3 className="text-2xl font-medium tracking-tight text-[#1A1A1A] sm:text-3xl md:text-4xl">{look.theme}</h3>
            {look.description && (
              <p className="mt-4 max-w-xl text-sm sm:text-base font-light leading-relaxed text-gray-500">
                {look.description}
              </p>
            )}
            <div className="mt-6 h-px w-24 bg-[#C9A227]/30" />
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {products.map((product, pIndex) => {
              const card = (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: (pIndex % 4) * 0.08, ease: "easeOut" }}
                  className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C9A227]/10"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAFAFA]">
                    {product.image ? (
                      <Image
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-300">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    {product.category && (
                      <span className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                        {product.category}
                      </span>
                    )}
                    <h2 className="mb-2 text-sm font-bold leading-snug text-[#1A1A1A] line-clamp-2">{product.name}</h2>
                    {product.price && (
                      <div className="mb-3 flex items-center gap-2 text-sm">
                        <span className="font-bold text-[#C9A227]">{product.price}</span>
                        {product.originalPrice && (
                          <span className="font-light text-gray-400 line-through">{product.originalPrice}</span>
                        )}
                      </div>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] transition-colors group-hover/card:text-[#C9A227]">
                      View Product
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/card:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              );

              return product.href ? (
                <Link key={product.id} href={product.href} className="block h-full">
                  {card}
                </Link>
              ) : (
                <div key={product.id} className="h-full">
                  {card}
                </div>
              );
            })}
          </div>

          {look.theme && (
            <Link
              href={`/products?category=${encodeURIComponent(look.theme)}`}
              className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-gray-300 bg-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              Shop all {look.theme}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LookbookPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<Record<string, SectionRecord>>({});
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      fetchSectionMap().then((map) => {
        if (active) setSections(map);
      }),
      fetch(`${getApiBase()}/api/products`, { cache: "no-cache" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!active || !data) return;
          const list: ProductRecord[] = data?.data?.products || data?.data || [];
          if (Array.isArray(list)) setProducts(list);
        })
        .catch(() => {}),
    ]).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const hero = sections["lookbook_hero"];
  const looksSection = sections["lookbook_looks"];
  const curatedLooks = (looksSection?.content?.looks as unknown as Look[]) || [];

  // Prefer admin-curated looks; otherwise derive from the real product catalog.
  const looks = curatedLooks.length > 0 ? curatedLooks : buildLooksFromProducts(products);

  const heroBadge = hero?.badgeText || "Collection 2026";
  const heroLine1 = (hero?.content?.headingLine1 ?? (hero?.title ? hero.title.replace(/\s+\S+$/, "") : "")) || "The";
  const heroLine2 = (hero?.content?.headingLine2 ?? (hero?.title ? hero.title.split(/\s+/).slice(-1)[0] : "")) || "Showcase.";
  const heroDescription =
    hero?.description ||
    "A curated lookbook from our production floor — a closer look at fabric, fit, and finish across our seasonal collections.";

  if (isLoading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Loader2 className="h-12 w-12 text-[#C9A227]" />
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative w-full min-h-screen bg-[#FAFAFA] text-[#1A1A1A] selection:bg-[#C9A227] selection:text-white overflow-x-hidden">
      {/* Intro */}
      <motion.section
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative w-full bg-white px-4 pb-16 pt-28 sm:px-6 sm:pt-32 md:pb-24 md:pt-40 lg:px-8 border-b border-gray-100"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#C9A227]/5 blur-[120px]" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />

        <div className="relative z-10 mx-auto flex max-w-9xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8 inline-flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C9A227]">
              <span className="h-px w-12 bg-[#C9A227]/50" />
              <span>{heroBadge}</span>
              <span className="h-px w-12 bg-[#C9A227]/50" />
            </div>

            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#1A1A1A]">
              {heroLine1} <span className="font-serif italic text-[#C9A227]">{heroLine2}</span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg font-light leading-relaxed tracking-wide text-gray-500">
              {heroDescription}
            </p>
          </motion.div>
        </div>

        {looks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-gray-400 sm:flex"
          >
            <span className="text-xs uppercase tracking-widest font-bold">Scroll to explore</span>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        )}
      </motion.section>

      {/* Quick look navigation */}
      {looks.length > 1 && (
        <nav className="sticky top-16 z-30 border-b border-gray-100 bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-9xl items-center gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 lg:px-8">
            <span className="mr-1 hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227] sm:inline">
              Looks
            </span>
            {looks.map((look) => (
              <a
                key={look.id}
                href={`#${look.id}`}
                className="shrink-0 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-gray-600 transition-colors hover:border-[#C9A227] hover:text-[#C9A227]"
              >
                {look.theme || look.lookName}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Lookbooks */}
      <div ref={containerRef} className="relative z-10 w-full bg-[#FAFAFA]">
        {looks.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center px-6 py-28 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-300">
              <Package className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Lookbook coming soon</h2>
            <p className="mt-2 text-sm text-gray-500">
              New looks are being prepared. Explore our full catalog in the meantime.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#C9A227]"
            >
              Explore Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            {looks.map((look, index) => (
              <LookSection key={look.id || index} look={look} index={index} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* CTA */}
      {looks.length > 0 && (
        <section className="relative z-10 border-t border-gray-100 bg-white px-6 py-20 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#C9A227]">Ready to source?</p>
          <h2 className="mx-auto max-w-3xl text-3xl font-medium tracking-tight text-[#1A1A1A] sm:text-4xl">
            Explore the full collection or request a wholesale quote.
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#C9A227]"
            >
              Explore Catalog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-colors hover:border-[#1A1A1A]"
            >
              Request a Quote
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
