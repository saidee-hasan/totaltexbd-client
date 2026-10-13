"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  Loader2,
  LayoutGrid,
  Layers,
  ShieldCheck,
  Ship,
  Scissors,
  Droplets,
  BadgeCheck,
  Package,
  ArrowRight,
} from "lucide-react";
import { fetchSectionMap, SectionRecord } from "@/lib/api";

const DEFAULT_CAPABILITIES = [
  '01 Strategic Merchandising',
  '02 Fabric Development',
  '03 Quality & Compliance',
  '04 Global Logistics',
  '05 Sampling & Prototyping',
  '06 Dyeing & Finishing',
  '07 Audit & Certification',
  '08 Packaging & Export',
];
const CAPABILITY_ICONS = [LayoutGrid, Layers, ShieldCheck, Ship, Scissors, Droplets, BadgeCheck, Package];
const FALLBACK_IMAGE = "/images/garment_manufacturing.png";

export default function CapabilitiesPage() {
  const [sections, setSections] = useState<Record<string, SectionRecord>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchSectionMap().then((map) => {
      if (!active) return;
      setSections(map);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const hero = sections["capabilities_hero"];
  const merchandising = sections["capabilities_merchandising"];
  const fabric = sections["capabilities_fabric"];
  const quality = sections["capabilities_quality"];
  const cta = sections["capabilities_cta"];

  const categories = (hero?.content?.categories || []) as string[];
  const heroLine1 = (hero?.content?.headingLine1 ?? (hero?.title ? hero.title.replace(/\s+\S+$/, "") : "")) || "Technical";
  const heroLine2 = (hero?.content?.headingLine2 ?? (hero?.title ? hero.title.split(/\s+/).slice(-1)[0] : "")) || "Expertise.";
  const heroBadge = hero?.badgeText || "Core Competencies";
  const heroDescription =
    hero?.description ||
    "Seamless execution across the entire manufacturing ecosystem, engineered for the world's leading brands.";
  const capabilityItems = (categories.length > 0 ? categories : DEFAULT_CAPABILITIES).slice(0, 8);
  const merchFeatures = (merchandising?.content?.features || []) as unknown as string[];
  const fabricFeatures = (fabric?.content?.features || []) as unknown as { title: string; desc: string }[];
  const qualityParagraphs = (quality?.content?.paragraphs || []) as string[];
  const ctaLine1 = cta?.content?.headingLine1 ?? cta?.title ?? "";
  const ctaLine2 = cta?.content?.headingLine2 ?? "";

  if (isLoading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-[#C9A227] animate-spin" />
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-white text-[#1A1A1A] overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative w-full pt-28 pb-14 lg:pt-36 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden border-b border-gray-100">

        {/* Background Ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-100 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-9xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">

          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
              <Link href="/" className="hover:text-[#C9A227] transition-colors">Home</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#C9A227]">Services</span>
            </nav>

            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-[#C9A227] uppercase mb-4">
              <span className="w-6 h-px bg-[#C9A227]" />
              {heroBadge}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-[#1A1A1A] mb-4 sm:mb-5">
              {heroLine1}{' '}
              <span className="italic font-serif text-[#C9A227]">{heroLine2}</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed max-w-xl mb-6 sm:mb-7">
              {heroDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Button
                href="/contact"
                className="h-12 px-7 rounded-full bg-[#1A1A1A] text-white text-xs font-bold tracking-[0.15em] hover:bg-[#C9A227] transition-colors normal-case"
              >
                Start Your Project
              </Button>
              <Button
                href="/process"
                variant="outline"
                className="h-12 px-7 rounded-full border border-gray-300 text-[#1A1A1A] text-xs font-bold tracking-[0.15em] hover:border-[#C9A227] hover:bg-transparent hover:text-[#C9A227] transition-colors normal-case"
              >
                View Our Process
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {['End-to-End Manufacturing', 'Global Compliance', 'On-Time Delivery'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" /> {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: 8 capability cards */}
          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {capabilityItems.map((cat, idx) => {
              const num = cat.substring(0, 2);
              const title = cat.substring(3) || cat;
              const Icon = CAPABILITY_ICONS[idx % CAPABILITY_ICONS.length];
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A227]/40 hover:shadow-lg"
                >
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A227]/10 text-[#C9A227] transition-colors duration-300 group-hover:bg-[#C9A227] group-hover:text-white">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="mb-0.5 block font-mono text-xs tracking-widest text-[#C9A227]">{num}</span>
                  <h3 className="text-sm font-bold leading-snug text-[#1A1A1A]">{title}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-gray-400 transition-colors group-hover:text-[#C9A227]">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* SECTION 1: Merchandising */}
      <section className="relative w-full py-10 md:py-14 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] overflow-hidden">
        <div className="max-w-9xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 relative z-10">

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-3/5 flex flex-col space-y-4 order-2"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-[#1A1A1A]">
              {merchandising?.title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
              {merchandising?.description}
            </p>

            <div className="flex flex-col space-y-3 pt-2">
              {merchFeatures.map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm font-medium text-[#1A1A1A]">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-2/5 relative group order-1"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200 shadow-xl">
              <div className="absolute inset-0 bg-black/10 z-10 transition-colors duration-500 group-hover:bg-transparent" />
              <Image
                src={merchandising?.image || merchandising?.images?.[0] || FALLBACK_IMAGE}
                alt={merchandising?.title || "Professional Merchandising"}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>

            {/* Floating Glass Stat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-md border border-white/50 p-4 rounded-xl shadow-xl z-20 hidden md:block"
            >
              <div className="text-3xl font-bold text-[#C9A227]">{merchandising?.content?.statValue}</div>
              <div className="text-sm font-medium text-gray-600 mt-0.5">{merchandising?.content?.statLabel}</div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 2: Fabric Development */}
      <section className="relative w-full py-10 md:py-14 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-9xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 relative z-10">

          {/* Single Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-2/5 relative group order-2"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200 shadow-xl">
              <div className="absolute inset-0 bg-black/10 z-10 transition-colors duration-500 group-hover:bg-transparent" />
              <Image src={fabric?.images?.[0] || fabric?.image || FALLBACK_IMAGE} alt={fabric?.title || "Fabric Development"} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 40vw" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-3/5 flex flex-col space-y-4 order-1"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-[#1A1A1A]">
              {fabric?.title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl mb-2">
              {fabric?.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fabricFeatures.map((feature, i) => (
                <div key={i} className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-[#C9A227]/40 hover:shadow-md transition-all duration-300">
                  <h4 className="text-base font-bold text-[#1A1A1A]">{feature.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 3: Quality & Shipping */}
      <section className="relative w-full py-10 md:py-14 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] overflow-hidden">
        <div className="max-w-9xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-3/5 flex flex-col space-y-4 order-2"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-[#1A1A1A]">
              {quality?.title}
            </h2>
            <div className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {qualityParagraphs.map((p, i) => (
                <p key={i} className={i === 1 ? "font-medium text-[#1A1A1A] mt-3" : i > 1 ? "mt-3" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-2/5 relative group order-1"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200 shadow-xl">
              <div className="absolute inset-0 bg-black/10 z-10 transition-colors duration-500 group-hover:bg-transparent" />
              <Image src={quality?.images?.[0] || quality?.image || FALLBACK_IMAGE} alt={quality?.title || "Quality Inspection"} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 40vw" />
            </div>
          </motion.div>

        </div>
      </section>

      {/* FINAL CTA - PREMIUM LUXURY */}
      <section className="relative w-full py-16 md:py-20 bg-[#0F172A] text-white px-4 text-center overflow-hidden">

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A227]/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto flex flex-col items-center relative z-10"
        >
          <h4 className="text-xs sm:text-sm font-bold tracking-[0.3em] text-[#C9A227] mb-4 uppercase">{cta?.badgeText}</h4>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-7 text-white leading-tight">
            {ctaLine1} <br /> {ctaLine2}
          </h2>
          <Button
            href={cta?.buttonLink || "/contact"}
            className="h-14 px-10 text-sm font-bold tracking-[0.2em] bg-[#C9A227] text-white hover:bg-white hover:text-[#0F172A] hover:shadow-[0_0_40px_rgba(201,162,39,0.4)] transition-all duration-500 uppercase rounded-full"
          >
            {cta?.buttonText}
          </Button>
        </motion.div>
      </section>

    </main>
  );
}
