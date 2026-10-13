'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ArrowRight, Droplet, Palette, Sparkles } from 'lucide-react';
import Image from 'next/image';
import type { SectionData } from '@/lib/api';

const iconMap: Record<string, ReactNode> = {
  Palette: <Palette className="w-5 h-5 text-[#C9A227]" />,
  Droplet: <Droplet className="w-5 h-5 text-[#C9A227]" />,
  Sparkles: <Sparkles className="w-5 h-5 text-[#C9A227]" />,
};

export default function FabricDyeing({ data }: { data?: SectionData }) {
  const features = (data?.content?.features || []) as { icon: string; title: string; description: string }[];
  const imageSrc = (data?.image && data.image.trim()) || (data?.images?.[0] && data.images[0].trim()) || "";

  return (
    <section id="dyeing" className="relative w-full py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      {/* Subtle colorful background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#C9A227]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-8 order-2 lg:order-1"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-sm font-semibold tracking-wider text-[#C9A227] uppercase">
                <span className="w-8 h-px bg-[#C9A227]" />
                <span>{data?.badgeText || ""}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">
                {data?.title || ""}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
                {data?.description || ""}
              </p>
            </div>

            <div className="grid gap-6 pt-4">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                  className="flex items-start space-x-4 bg-gray-50/50 p-5 rounded-2xl hover:bg-[#C9A227]/10 transition-colors border border-transparent hover:border-[#C9A227]/20"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    {iconMap[feature.icon]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mt-1">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-6">
              <a 
                href={data?.buttonLink || ""}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-[#1A1A1A] rounded-2xl overflow-hidden transition-all duration-300 hover:bg-[#C9A227] hover:shadow-xl hover:shadow-[#C9A227]/30 hover:-translate-y-1"
              >
                <span className="relative flex items-center gap-2">
                  {data?.buttonText || ""}
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            </div>
          </motion.div>

          {/* Right Side: Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[340px] sm:h-[460px] lg:h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl group order-1 lg:order-2"
          >
            <div className="absolute inset-0 bg-black/10 z-10 transition-colors duration-500 group-hover:bg-transparent" />
            {imageSrc && (
              <Image
                src={imageSrc}
                alt="High-tech fabric dyeing and finishing process"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            
            {/* Cinematic Overlay Badge */}
            <div className="absolute bottom-6 left-6 right-6 z-20">
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white/90 backdrop-blur-md border border-white/50 p-5 rounded-2xl flex items-center space-x-4 shadow-lg"
               >
                 <div className="w-12 h-12 rounded-full bg-[#C9A227]/20 flex items-center justify-center shrink-0">
                    <Droplet className="w-6 h-6 text-[#C9A227]" />
                 </div>
                 <div>
                   <h4 className="text-lg font-bold text-[#0F172A]">{data?.subtitle?.split('&')?.[0]?.trim() || ""}</h4>
                   <p className="text-xs text-gray-500">{data?.subtitle?.split('&')?.[1]?.trim() || ""}</p>
                 </div>
               </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
