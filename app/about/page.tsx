"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import ManufacturingProcess from "@/components/ManufacturingProcess";
import { CheckCircle2, Loader2, ShieldCheck, Globe2, Factory, Clock, ArrowRight } from "lucide-react";
import { fetchSectionMap } from "@/lib/api";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

interface AboutStat {
  label: string;
  value: string;
}

interface AboutData {
  heroImage: string;
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  missionTitle: string;
  missionDescription: string;
  missionFeatures: string[];
  missionImage1: string;
  missionImage2: string;
  missionImage3: string;
  expertiseTitle: string;
  expertiseDescription: string;
  expertiseImage1: string;
  expertiseImage2: string;
  ctaBadgeText: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  ctaHeadingLine1: string;
  ctaHeadingLine2: string;
  stats: AboutStat[];
}

const FALLBACK_STATS: AboutStat[] = [
  { label: 'Years Experience', value: '15+' },
  { label: 'Global Clients', value: '500+' },
  { label: 'Export Countries', value: '50+' },
  { label: 'On-Time Delivery', value: '99%' },
];

const STAT_ICONS = [Factory, Globe2, ShieldCheck, Clock];

// Colours matched to the TOTAL APPAREL brand palette (gold, navy, black).
const STAT_STYLES = [
  { tile: 'from-[#C9A227] to-[#E0B94A]', text: 'text-[#B8860B]', glow: 'bg-[#C9A227]' },
  { tile: 'from-[#0F172A] to-[#334155]', text: 'text-[#0F172A]', glow: 'bg-[#0F172A]' },
  { tile: 'from-[#D4AF37] to-[#C9A227]', text: 'text-[#B8860B]', glow: 'bg-[#C9A227]' },
  { tile: 'from-[#1A1A1A] to-[#374151]', text: 'text-[#1A1A1A]', glow: 'bg-[#1A1A1A]' },
];

const CTA_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const CTA_ITEM: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const CTA_PARTICLES = [
  { top: '18%', left: '12%', duration: 6, delay: 0 },
  { top: '30%', left: '85%', duration: 7, delay: 0.6 },
  { top: '70%', left: '18%', duration: 8, delay: 1.2 },
  { top: '62%', left: '78%', duration: 6.5, delay: 0.3 },
  { top: '42%', left: '50%', duration: 9, delay: 0.9 },
];

const StatCard: React.FC<{
  stat: AboutStat;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}> = ({ stat, icon: Icon, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const numeric = parseInt(stat.value.replace(/[^0-9]/g, ''), 10);
  const suffix = stat.value.replace(/[0-9]/g, '');
  const isNumeric = Number.isFinite(numeric);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || !isNumeric) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(numeric * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, isNumeric, numeric]);

  const style = STAT_STYLES[index % STAT_STYLES.length];
  const display = isNumeric ? `${count}${suffix}` : stat.value;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
    >
      <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full ${style.glow} opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-30`} />
      <span className={`relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${style.tile} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="w-5 h-5" />
      </span>
      <p className={`relative text-3xl md:text-4xl font-bold tracking-tight ${style.text} tabular-nums`}>
        {display}
      </p>
      <p className="relative mt-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
        {stat.label}
      </p>
    </motion.div>
  );
};

const Figure: React.FC<{ src: string; alt: string; className?: string; sizes?: string; priority?: boolean }> = ({
  src,
  alt,
  className = '',
  sizes,
  priority,
}) => (
  <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
    {src ? (
      <Image src={src} alt={alt} fill priority={priority} className="object-cover" sizes={sizes} />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
    )}
  </div>
);

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchSectionMap().then((map) => {
      if (!active) return;
      const hero = map["about_hero"];
      const mission = map["about_mission"];
      const expertise = map["about_expertise"];
      const cta = map["about_cta"];
      const story = map["company_story"];

      const storyStats = (story?.stats || []).filter((s) => s.label && s.value);

      setData({
        heroImage: hero?.image || hero?.images?.[0] || "/our-story-cover.png",
        heroSubtitle: hero?.subtitle || "Global Excellence",
        heroTitle: hero?.title || "The TOTAL APPAREL Story.",
        heroDescription:
          hero?.description ||
          "Operating from the heart of the global textile hub in Dhaka, Bangladesh, TOTAL APPAREL bridges creative fashion design and technical garment manufacturing — supplying world-class Ready-Made Garments to the international market.",
        missionTitle: mission?.title || "Precision, Transparency, and Timely Delivery",
        missionDescription:
          mission?.description ||
          "At TOTAL APPAREL, exceptional garments begin with meticulous planning and technical precision. We go beyond traditional manufacturing with expert fabric selection, rigorous quality control, transparent costing, and dependable delivery.",
        missionFeatures:
          ((mission?.content?.features as unknown as string[]) || []).length > 0
            ? (mission?.content?.features as unknown as string[])
            : ['Expert fabric selection', 'Rigorous quality control', 'Transparent costing', 'On-time delivery'],
        missionImage1: mission?.images?.[0] || mission?.image || "/process-engineering.png",
        missionImage2: mission?.images?.[1] || "/process-sourcing.png",
        missionImage3: mission?.images?.[2] || "/process-quality.png",
        expertiseTitle: expertise?.title || "Driven by Expertise, Trusted by Global Partners",
        expertiseDescription:
          expertise?.description ||
          "Our team of textile engineers, merchandising specialists, and quality experts collaborates closely with international fashion brands, buying houses, and independent labels — acting as their reliable on-the-ground execution partner.",
        expertiseImage1: expertise?.images?.[0] || expertise?.image || "/professional-team.png",
        expertiseImage2: expertise?.images?.[1] || "/merchandising.png",
        ctaBadgeText: cta?.badgeText || "Ready to Source?",
        ctaDescription:
          cta?.description ||
          "Share your tech pack or idea — our team will come back with costing, timelines, and a clear production plan.",
        ctaButtonText: cta?.buttonText || "Work With Our Team",
        ctaButtonLink: cta?.buttonLink || "/contact",
        ctaHeadingLine1: cta?.content?.headingLine1 ?? (cta?.title ? cta.title.replace(/\s+\S+$/, "") : "Let's Build"),
        ctaHeadingLine2: cta?.content?.headingLine2 ?? (cta?.title ? cta.title.split(/\s+/).slice(-1)[0] : "Your Next Collection."),
        stats: storyStats.length > 0 ? (storyStats as AboutStat[]) : FALLBACK_STATS,
      });
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-[#C9A227] animate-spin" />
      </div>
    );
  }

  const content = data as AboutData;

  return (
    <main className="w-full flex min-h-screen flex-col items-center justify-start bg-white text-[#1A1A1A] overflow-hidden">

      {/* HERO */}
      <section className="relative w-full pt-28 pb-14 lg:pt-36 lg:pb-16 bg-white overflow-hidden">
        {/* Ambient accents */}
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-[#C9A227]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-gray-100 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
              <Link href="/" className="hover:text-[#C9A227] transition-colors">Home</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#C9A227]">About</span>
            </nav>

            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] text-[#C9A227] uppercase mb-5">
              <span className="w-6 h-px bg-[#C9A227]" />
              {content.heroSubtitle}
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-5 sm:mb-6 text-[#1A1A1A]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.heroTitle) }}
            />

            <p className="text-sm sm:text-base font-normal text-gray-600 leading-relaxed max-w-xl mb-8 sm:mb-9">
              {content.heroDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <Button
                href={content.ctaButtonLink}
                className="h-14 px-8 rounded-full bg-[#1A1A1A] text-white text-xs font-bold tracking-[0.15em] hover:bg-[#C9A227] transition-colors normal-case"
              >
                Work With Us
              </Button>
              <Button
                href="/process"
                variant="outline"
                className="h-14 px-8 rounded-full border border-gray-300 text-[#1A1A1A] text-xs font-bold tracking-[0.15em] hover:border-[#C9A227] hover:bg-transparent hover:text-[#C9A227] transition-colors normal-case"
              >
                Our Process
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {['Ethical Manufacturing', 'Global Delivery', 'Quality Assured'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227]" /> {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: image composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              {content.heroImage ? (
                <Image
                  src={content.heroImage}
                  alt="Total Apparel manufacturing"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>

            {/* Secondary image */}
            <div className="hidden sm:block absolute -bottom-8 -left-6 w-40 h-52 rounded-[1.5rem] overflow-hidden shadow-2xl border-4 border-white">
              {content.missionImage1 ? (
                <Image src={content.missionImage1} alt="Manufacturing detail" fill className="object-cover" sizes="160px" />
              ) : (
                <div className="absolute inset-0 bg-gray-200" />
              )}
            </div>

            {/* Floating stat card */}
            {content.stats[0] && (
              <div className="absolute -top-6 right-6 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl px-6 py-4 text-center">
                <p className="text-2xl font-bold text-[#1A1A1A] font-serif leading-none">{content.stats[0].value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 mt-1">{content.stats[0].label}</p>
              </div>
            )}

            {/* Decorative ring */}
            <div className="absolute -bottom-10 -right-6 w-28 h-28 rounded-full border-2 border-[#C9A227]/30 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      {content.stats.length > 0 && (
        <section className="w-full bg-gradient-to-b from-white to-[#FAFAFA] border-y border-gray-100">
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {content.stats.slice(0, 4).map((stat, i) => (
              <StatCard key={i} stat={stat} icon={STAT_ICONS[i % STAT_ICONS.length]} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* MISSION */}
      <section id="mission" className="relative w-full py-14 md:py-20 bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-9xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#C9A227] mb-3">Our Mission</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-5 leading-snug">
              {content.missionTitle}
            </h2>
            <div className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
              {content.missionDescription}
            </div>

            {content.missionFeatures.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
                {content.missionFeatures.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm font-medium text-[#1A1A1A] bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 grid grid-cols-2 gap-4 md:gap-6 relative"
          >
            <div className="flex flex-col gap-4 md:gap-6 pt-12">
              <Figure src={content.missionImage1} alt="Precision manufacturing" className="w-full aspect-[4/5] rounded-[2rem] shadow-xl border-4 border-white" />
            </div>
            <div className="flex flex-col gap-4 md:gap-6">
              <Figure src={content.missionImage2} alt="Fabric sourcing" className="w-full aspect-[4/5] rounded-[2rem] shadow-xl border-4 border-white" />
              <Figure src={content.missionImage3} alt="Quality inspection" className="w-full aspect-[4/3] rounded-[2rem] shadow-xl border-4 border-white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* MANUFACTURING PROCESS */}
      <div className="w-full bg-white border-y border-gray-100">
        <ManufacturingProcess />
      </div>

      {/* EXPERTISE */}
      <section id="ethical" className="w-full py-14 md:py-20 bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-9xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <Figure src={content.expertiseImage1} alt="Professional team" className="w-full aspect-[4/3] rounded-[2rem] mb-8 shadow-2xl z-10" />
            <Figure src={content.expertiseImage2} alt="Merchandising team" className="w-3/4 aspect-video rounded-[2rem] -mt-24 ml-auto border-8 border-[#FAFAFA] shadow-2xl z-20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex flex-col space-y-6"
          >
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#C9A227]">Ethical Manufacturing</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-[#1A1A1A]">
              {content.expertiseTitle}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line">
              {content.expertiseDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full py-24 md:py-32 bg-[#0B1120] text-white px-4 overflow-hidden">
        {/* Animated conic glow */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -top-1/2 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full blur-[110px] [background:conic-gradient(from_0deg,rgba(201,162,39,0.20),transparent_35%,rgba(201,162,39,0.12),transparent_75%)]"
        />

        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

        {/* Floating particles */}
        {CTA_PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#C9A227]/70"
            style={{ top: p.top, left: p.left }}
            animate={{ y: [0, -18, 0], opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}

        <motion.div
          variants={CTA_CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <motion.div
            variants={CTA_ITEM}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[#C9A227] backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A227]" />
            {content.ctaBadgeText}
          </motion.div>

          <motion.h2
            variants={CTA_ITEM}
            className="mb-5 text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight"
          >
            {content.ctaHeadingLine1} <br />
            <span className="bg-gradient-to-r from-[#C9A227] to-[#E0B94A] bg-clip-text italic font-serif text-transparent">
              {content.ctaHeadingLine2}
            </span>
          </motion.h2>

          <motion.p
            variants={CTA_ITEM}
            className="mb-8 max-w-2xl text-sm sm:text-base font-normal leading-relaxed text-gray-300"
          >
            {content.ctaDescription}
          </motion.p>

          <motion.div variants={CTA_ITEM} className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              href={content.ctaButtonLink}
              className="group h-16 px-12 rounded-full bg-gradient-to-r from-[#C9A227] to-[#E0B94A] text-white text-sm font-bold uppercase tracking-[0.2em] shadow-[0_10px_40px_-10px_rgba(201,162,39,0.7)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(201,162,39,0.55)] normal-case"
            >
              <span className="inline-flex items-center gap-3">
                {content.ctaButtonText}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button
              href="/capabilities"
              variant="outline"
              className="h-16 px-10 rounded-full border border-white/25 text-white text-sm font-bold uppercase tracking-[0.2em] hover:border-[#C9A227] hover:bg-transparent hover:text-[#C9A227] transition-colors normal-case"
            >
              View Capabilities
            </Button>
          </motion.div>
        </motion.div>
      </section>

    </main>
  );
}
