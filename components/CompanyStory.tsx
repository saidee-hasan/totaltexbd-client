'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Factory,
  Truck,
  Sparkles,
  Award,
  Leaf,
  Globe,
  Clock,
  Star,
  BadgeCheck,
  PackageCheck,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { SectionData, SectionStat } from '@/lib/api';

const BADGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckCircle2,
  ShieldCheck,
  Factory,
  Truck,
  Sparkles,
  Award,
  Leaf,
  Globe,
  Clock,
  Star,
  BadgeCheck,
  PackageCheck,
};

export default function CompanyStory({ data }: { data?: SectionData }) {
  const trustBadges: string[] = data?.content?.trustBadges || [];
  const trustBadgeIcons: string[] = (data?.content?.trustBadgeIcons as string[]) || [];
  const currentStats: SectionStat[] = (data?.stats && data.stats.length > 0) ? data.stats : [];
  const image1 = data?.images?.[0] || data?.image || "";
  const image2 = data?.images?.[1] || data?.image || "";
  const image3 = data?.images?.[2] || data?.image || "";
  const buttonLink = data?.buttonLink || '/about';

  return (
    <section className="relative w-full py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-50 via-white to-white" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#C9A227]/5 rounded-full blur-3xl" />
        {/* Abstract thin connecting lines */}
        <svg className="absolute w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 100 C 200 100, 300 400, 800 300 S 1200 600, 1600 500" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M300 -50 C 400 200, 100 500, 600 700" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-8"
          >
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
                {data?.title || ""}
              </h2>
              <p className="text-base sm:text-lg text-[#C9A227] font-serif italic">
                {data?.subtitle || ""}
              </p>
            </div>

            <div className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-none">
              <p className="leading-relaxed">
                {data?.description || ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {trustBadges.map((badge, idx) => {
                const Icon = BADGE_ICONS[trustBadgeIcons[idx]] || CheckCircle2;
                return (
                  <div key={idx} className="flex items-center space-x-2 text-sm font-medium text-[#1A1A1A] bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100 shadow-sm">
                    <Icon className="w-4 h-4 text-[#C9A227]" />
                    <span>{badge}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-6">
              <Link href={buttonLink} className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-[#1A1A1A] rounded-2xl overflow-hidden transition-all duration-300 hover:bg-[#C9A227] hover:shadow-xl hover:shadow-[#C9A227]/30 hover:-translate-y-1">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative flex items-center gap-2">
                  {data?.buttonText || ""}
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>

            {currentStats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-gray-100 pt-8">
                {currentStats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A]">{stat.value}</span>
                    <span className="mt-0.5 text-xs font-medium text-gray-500">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Side: Image Collage */}
          <div className="relative h-[380px] sm:h-[480px] lg:h-[700px] w-full">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-4 lg:gap-6">
              {/* Main Large Image */}
              <motion.div 
                className="col-span-2 row-span-2 relative rounded-[20px] overflow-hidden shadow-2xl group"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-black/10 z-10 transition-colors duration-500 hover:bg-transparent" />
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                  className="absolute inset-0"
                >
                  {image1 && (
                    <Image
                      src={image1}
                      alt="Modern Apparel Factory"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  )}
                </motion.div>
              </motion.div>

              {/* Bottom Left Image */}
              <motion.div 
                className="relative rounded-[20px] overflow-hidden shadow-xl group"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, delay: 1, ease: "easeInOut", repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-black/10 z-10 transition-colors duration-500 hover:bg-transparent" />
                <motion.div 
                  animate={{ scale: [1, 1.15, 1] }} 
                  transition={{ duration: 20, delay: 2, ease: "linear", repeat: Infinity }}
                  className="absolute inset-0"
                >
                  {image2 && (
                    <Image
                      src={image2}
                      alt="Quality Inspection"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                </motion.div>
              </motion.div>

              {/* Bottom Right Image */}
              <motion.div 
                className="relative rounded-[20px] overflow-hidden shadow-xl group"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6.5, delay: 0.5, ease: "easeInOut", repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-black/10 z-10 transition-colors duration-500 hover:bg-transparent" />
                <motion.div 
                  animate={{ scale: [1, 1.15, 1] }} 
                  transition={{ duration: 20, delay: 3, ease: "linear", repeat: Infinity }}
                  className="absolute inset-0"
                >
                  {image3 && (
                    <Image
                      src={image3}
                      alt="Precision Cutting"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
