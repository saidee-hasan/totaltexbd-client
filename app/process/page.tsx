"use client";

import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { ArrowDown, ArrowRight, CheckCircle2, Leaf, Droplet, Scissors, Factory, Package, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchSectionMap, SectionRecord } from "@/lib/api";

interface ProcessStep {
  num?: string;
  id?: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
}

const DEFAULT_STEPS: ProcessStep[] = [
  { num: '01', title: 'Raw Material Sourcing', description: 'Responsibly sourced long-staple cotton and premium blends, inspected on arrival for purity and consistency.', image: '/process-sourcing.png', icon: 'Leaf' },
  { num: '02', title: 'Fabric Development', description: 'Yarn is knitted and woven to your exact GSM, stretch, and hand-feel specification with lab-approved samples.', image: '/fabric-development.png', icon: 'Factory' },
  { num: '03', title: 'Dyeing & Production', description: 'Eco-friendly reactive dyeing with precise shade matching, followed by controlled finishing for lasting colour.', image: '/process-production.png', icon: 'Droplet' },
  { num: '04', title: 'Cutting & Engineering', description: 'CAD-driven precision cutting and automated spreading deliver clean panels and efficient fabric utilisation.', image: '/process-engineering.png', icon: 'Scissors' },
  { num: '05', title: 'Quality Assurance', description: 'Inline and end-line inspection against AQL standards, with GSM, shrinkage, and colour-fastness validated in our lab.', image: '/process-quality.png', icon: 'CheckCircle' },
  { num: '06', title: 'Packaging & Logistics', description: 'Steam finishing, export-ready packing, and consolidated global shipping with full documentation and tracking.', image: '/export-logistics.png', icon: 'Package' },
];

const STEP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf, Droplet, Scissors, Factory, Package, CheckCircle2,
};

const HERO_STEPS = ['01 Sourcing', '02 Fabric', '03 Dyeing', '04 Cutting', '05 Quality', '06 Logistics'];

const WORD_VARIANT: Variants = {
  hidden: { opacity: 0, y: '0.5em', filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function ProcessPage() {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActiveStep((prev) => (prev + 1) % HERO_STEPS.length), 1800);
    return () => clearInterval(id);
  }, []);

  const [sections, setSections] = useState<Record<string, SectionRecord>>({});
  const [steps, setSteps] = useState<ProcessStep[]>(DEFAULT_STEPS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchSectionMap().then((map) => {
      if (!active) return;
      setSections(map);
      const remote = (map["process_steps"]?.content?.steps || []) as unknown as ProcessStep[];
      if (remote.length > 0) {
        setSteps(
          remote.map((s, i) => ({
            ...s,
            num: s.num || String(i + 1).padStart(2, '0'),
          }))
        );
      }
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const hero = sections["process_hero"];
  const cta = sections["process_cta"];

  const heroBadge = hero?.badgeText || 'Our Ecosystem';
  const heroLine1 = (hero?.content?.headingLine1 ?? (hero?.title ? hero.title.replace(/\s+\S+$/, '') : '')) || 'The Anatomy of';
  const heroLine2 = (hero?.content?.headingLine2 ?? (hero?.title ? hero.title.split(/\s+/).slice(-1)[0] : '')) || 'Precision';
  const heroDescription =
    hero?.description ||
    'Discover how we work with global buyers and maintain the start-to-end process — from the tech pack to shipment.';

  const ctaBadge = cta?.badgeText || 'Ready to Partner?';
  const ctaLine1 = (cta?.content?.headingLine1 ?? (cta?.title ? cta.title.replace(/\s+\S+$/, '') : '')) || 'From Tech Pack';
  const ctaLine2 = (cta?.content?.headingLine2 ?? (cta?.title ? cta.title.split(/\s+/).slice(-1)[0] : '')) || 'to Shipment.';
  const ctaDescription =
    cta?.description ||
    'Our end-to-end process keeps every stage transparent, on schedule, and audited for quality.';
  const ctaButtonText = cta?.buttonText || 'Start Your Project';
  const ctaButtonLink = cta?.buttonLink || '/contact';

  if (isLoading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="h-12 w-12 animate-spin text-[#C9A227]" />
      </main>
    );
  }

  return (
    <main className="relative w-full bg-white text-[#1A1A1A] selection:bg-[#C9A227] selection:text-white">

      {/* HERO */}
      <section className="relative flex h-[100svh] min-h-[560px] sm:min-h-[700px] flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] text-center">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline poster="/video-showcase-poster.png" className="h-full w-full object-cover opacity-25">
            <source src="/realistic1.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-[#0a0a0a]" />

        <motion.div
          animate={{ x: ['-8%', '10%', '-8%'], y: ['-6%', '6%', '-6%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -left-24 -top-24 z-[2] h-[520px] w-[520px] rounded-full bg-[#C9A227]/20 blur-[130px]"
        />
        <motion.div
          animate={{ x: ['10%', '-8%', '10%'], y: ['6%', '-6%', '6%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -bottom-28 -right-24 z-[2] h-[560px] w-[560px] rounded-full bg-[#1e3a5f]/40 blur-[140px]"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A227] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A227]" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/90 sm:text-xs">{heroBadge}</span>
          </motion.div>

          <motion.h1
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
            initial="hidden"
            animate="show"
            className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight text-white"
          >
            <span className="block">
              {heroLine1.split(' ').map((word, i) => (
                <React.Fragment key={`l1-${i}`}>
                  <motion.span variants={WORD_VARIANT} className="inline-block">{word}</motion.span>{' '}
                </React.Fragment>
              ))}
            </span>
            <span className="block font-serif italic text-[#C9A227]">
              {heroLine2.split(' ').map((word, i) => (
                <React.Fragment key={`l2-${i}`}>
                  <motion.span variants={WORD_VARIANT} className="inline-block">{word}</motion.span>{' '}
                </React.Fragment>
              ))}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
            className="mx-auto mb-8 max-w-2xl text-sm sm:text-base md:text-lg font-light leading-relaxed text-gray-300"
          >
            {heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: 'easeOut' }}
            className="mb-11 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
          >
            {HERO_STEPS.map((step, i) => {
              const active = i === activeStep;
              return (
                <span
                  key={step}
                  className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-500 sm:text-[11px] ${
                    active
                      ? 'scale-105 border-[#C9A227] bg-[#C9A227] text-black shadow-[0_0_28px_rgba(201,162,39,0.45)]'
                      : 'border-white/20 text-white/60'
                  }`}
                >
                  {step}
                </span>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: 'easeOut' }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              href="#pipeline"
              className="h-14 rounded-full bg-[#C9A227] px-8 text-xs font-bold normal-case tracking-[0.15em] text-black transition-colors hover:bg-white"
            >
              Explore The Pipeline
            </Button>
            <Button
              href="/contact"
              variant="outline"
              className="h-14 rounded-full border border-white/40 px-8 text-xs font-bold normal-case tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-black"
            >
              Start Your Project
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">Scroll to explore</span>
          <ArrowDown className="h-5 w-5 animate-bounce text-[#C9A227]" />
        </motion.div>
      </section>

      {/* INTRO */}
      <section className="w-full border-b border-gray-100 bg-white px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#C9A227]">End-to-End</p>
          <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A] md:text-4xl">
            From Tech Pack to Shipment
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-light leading-relaxed text-gray-500">
            Every order moves through six controlled, audited stages — giving you transparency, consistency,
            and dependable delivery at every step.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {['Transparent Process', 'Audited Quality', 'Global Delivery'].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <CheckCircle2 className="h-4 w-4 text-[#C9A227]" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="pipeline" className="relative w-full bg-[#FAFAFA] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="mb-14 text-center md:mb-20">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#C9A227]">The Pipeline</p>
            <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A] md:text-4xl">
              Six Stages of <span className="font-serif italic text-[#C9A227]">Precision</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute bottom-0 left-5 top-0 w-px bg-gray-200 md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-12 md:space-y-20">
              {steps.map((step, i) => {
                const isLeft = i % 2 === 0;
                const Icon = (step.icon && STEP_ICONS[step.icon]) || ShieldCheck;
                return (
                  <motion.div
                    key={`${step.title}-${i}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-16"
                  >
                    {/* Image */}
                    <div className={`pl-14 md:pl-0 ${isLeft ? 'md:order-1' : 'md:order-2'}`}>
                      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
                        {step.image ? (
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                        )}
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
                      </div>
                    </div>

                    {/* Text */}
                    <div className={`pl-14 ${isLeft ? 'md:order-2 md:pl-14' : 'md:order-1 md:pl-0 md:pr-14'}`}>
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#C9A227]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                        <Icon className="h-3.5 w-3.5" /> Step {step.num}
                      </span>
                      <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#1A1A1A]">{step.title}</h3>
                      <p className="mt-3 max-w-md text-base font-light leading-relaxed text-gray-500">{step.description}</p>
                    </div>

                    {/* Number badge on the line */}
                    <span className="absolute left-5 top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#C9A227] bg-white text-sm font-bold text-[#C9A227] shadow-md md:left-1/2">
                      {step.num}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full overflow-hidden bg-[#0F172A] px-4 py-20 text-center text-white md:py-28">
        <motion.div
          animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A227]/10 blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center"
        >
          <h4 className="mb-5 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#C9A227]">{ctaBadge}</h4>
          <h2 className="mb-8 text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
            {ctaLine1} <br /> <span className="font-serif italic text-[#C9A227]">{ctaLine2}</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-sm sm:text-base font-light leading-relaxed text-gray-300">
            {ctaDescription}
          </p>
          <Button
            href={ctaButtonLink}
            className="h-16 rounded-full bg-[#C9A227] px-12 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-2xl transition-all duration-500 hover:bg-white hover:text-[#0F172A] hover:shadow-[0_0_40px_rgba(201,162,39,0.4)]"
          >
            {ctaButtonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </section>

    </main>
  );
}
