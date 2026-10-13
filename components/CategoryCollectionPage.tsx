"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import { fetchSectionMap, SectionRecord } from "@/lib/api";

export default function CategoryCollectionPage({ sectionKey }: { sectionKey: string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [section, setSection] = useState<SectionRecord | null>(null);

  useEffect(() => {
    let active = true;
    fetchSectionMap().then((map) => {
      if (!active) return;
      setSection(map[sectionKey] || null);
    });
    return () => {
      active = false;
    };
  }, [sectionKey]);

  const line1 = section?.content?.headingLine1 ?? (section?.title ? section.title.replace(/\s+\S+$/, "") : "");
  const line2 = section?.content?.headingLine2 ?? (section?.title ? section.title.split(/\s+/).slice(-1)[0] : "");
  const initialCategory = section?.content?.category || section?.title || "All Categories";
  const heroImage = section?.image || section?.images?.[0] || "";

  return (
    <main className="w-full min-h-screen bg-[#FAFAFA] relative selection:bg-[#C9A227] selection:text-white">
      
      {/* Cinematic Parallax Hero */}
      <section className="relative h-[65vh] md:h-[75vh] w-full flex items-center justify-center overflow-hidden bg-[#0F172A]">
        
        {/* Parallax Background */}
        <motion.div style={{ y }} className="absolute inset-0 z-0 w-full h-[120%] -top-[10%]">
          {heroImage ? (
            <Image 
              src={heroImage}
              alt={section?.subtitle || section?.title || ""}
              fill
              sizes="100vw"
              className="object-cover object-center opacity-60 mix-blend-luminosity"
              priority
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-20"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
            className="mb-6 px-6 sm:px-8 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold text-[#C9A227] shadow-lg"
          >
            {section?.badgeText || section?.subtitle}
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-4 drop-shadow-2xl">
            {line1} <span className="italic font-serif text-[#C9A227]">{line2}</span>
          </h1>
          
          <p className="text-gray-300 text-sm sm:text-base md:text-lg font-light max-w-2xl mx-auto tracking-wide leading-relaxed">
            {section?.description}
          </p>
        </motion.div>
      </section>

      {/* Main Product Grid Container */}
      <section className="relative z-20 -mt-20 md:-mt-32 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white rounded-t-3xl md:rounded-[40px] shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100"
        >
          <Suspense fallback={<div className="min-h-[500px]" />}>
            <ProductGrid initialCategory={initialCategory} />
          </Suspense>
        </motion.div>
      </section>

      {/* Ambient decorative elements */}
      <div className="fixed top-1/4 -left-64 w-[500px] h-[500px] bg-[#C9A227]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -right-64 w-[500px] h-[500px] bg-[#0F172A]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

    </main>
  );
}
