"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import { fetchSectionMap, SectionRecord } from "@/lib/api";

const FALLBACK_IMAGE = "/images/garment_manufacturing.png";

export default function ProductsPage() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [hero, setHero] = useState<SectionRecord | null>(null);

  useEffect(() => {
    let active = true;
    fetchSectionMap().then((map) => {
      if (!active) return;
      setHero(map["products_hero"] || null);
    });
    return () => {
      active = false;
    };
  }, []);

  const heroImage = hero?.image || hero?.images?.[0] || FALLBACK_IMAGE;
  const badgeText = hero?.badgeText || "Wholesale Catalog";
  const heroLine1 =
    hero?.content?.headingLine1 ?? (hero?.title ? hero.title.replace(/\s+\S+$/, "") : "Explore Our");
  const heroLine2 =
    hero?.content?.headingLine2 ?? (hero?.title ? hero.title.split(/\s+/).slice(-1)[0] : "Collection");
  const heroDescription =
    hero?.description ||
    "Premium apparel manufacturing — knitwear, outerwear and precision streetwear blanks crafted for global brands.";

  return (
    <main className="w-full min-h-screen bg-[#FAFAFA] relative selection:bg-[#C9A227] selection:text-white">

      {/* Cinematic Parallax Hero */}
      <section className="relative w-full pt-32 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 lg:pb-20 flex items-center justify-center overflow-hidden bg-[#0F172A]">

        {/* Parallax Background */}
        <motion.div style={{ y }} className="absolute inset-0 z-0 w-full h-[120%] -top-[10%]">
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Product Catalog"
              fill
              className="object-cover object-center opacity-60 mix-blend-luminosity"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#111f38] to-[#0F172A]" />
          )}
          {/* Gradient Overlays for luxury feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/60 to-[#0F172A]" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center"
        >
          {/* Breadcrumb */}
          <nav className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
            <Link href="/" className="hover:text-[#C9A227] transition-colors">Home</Link>
            <span className="text-white/40">/</span>
            <span className="text-[#C9A227]">Products</span>
          </nav>

          {badgeText && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
              className="mb-2 px-3.5 sm:px-4 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-bold text-[#C9A227] shadow-xs"
            >
              {badgeText}
            </motion.div>
          )}

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-2 drop-shadow-md">
            {heroLine1} <span className="italic font-serif text-[#C9A227]">{heroLine2}</span>
          </h1>

          {heroDescription && (
            <p className="text-gray-300 text-xs sm:text-sm font-normal max-w-xl mx-auto tracking-normal line-clamp-2 sm:line-clamp-none leading-relaxed">
              {heroDescription}
            </p>
          )}
        </motion.div>
      </section>

      {/* Main Product Grid Container */}
      <section className="relative z-20 -mt-5 sm:-mt-8 md:-mt-10 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#FAFAFA] sm:bg-white rounded-2xl sm:rounded-3xl shadow-[0_-10px_35px_-10px_rgba(0,0,0,0.06)] border border-gray-100"
        >
          <Suspense fallback={<div className="min-h-[500px]" />}>
            <ProductGrid />
          </Suspense>
        </motion.div>
      </section>

      {/* Ambient decorative elements */}
      <div className="fixed top-1/4 -left-64 w-[500px] h-[500px] bg-[#C9A227]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -right-64 w-[500px] h-[500px] bg-[#0F172A]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

    </main>
  );
}
