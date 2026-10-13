'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ArrowRight, Maximize, Zap, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import type { SectionData } from '@/lib/api';

const iconMap: Record<string, ReactNode> = {
  Maximize: <Maximize className="w-5 h-5 text-[#C9A227]" />,
  Zap: <Zap className="w-5 h-5 text-[#C9A227]" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#C9A227]" />,
};

export default function WeavingLoom({ data }: { data?: SectionData }) {
  const highlights = (data?.content?.highlights || []) as { icon: string; title: string; description: string }[];

  const validImages = (data?.images && Array.isArray(data.images))
    ? data.images.filter((img: string) => Boolean(img && typeof img === 'string' && img.trim()))
    : [];

  const images = validImages.length > 0
    ? validImages
    : [];

  return (
    <section id="weaving" className="relative w-full py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#C9A227]/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Vertical Animated Grid */}
          <div className="relative h-[380px] sm:h-[480px] lg:h-[700px] w-full rounded-[2rem] overflow-hidden shadow-2xl bg-white border-4 border-white group">
            {/* Edge fade gradients for seamless look */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
            
            <div className="absolute inset-0 flex gap-4 p-2 transform scale-100 sm:scale-[1.15] rotate-0 sm:rotate-[-4deg]">
              {/* Column 1: Scrolling Down */}
              <motion.div 
                className="flex flex-col gap-4 w-1/2"
                animate={{ y: ["-50%", "0%"] }}
                transition={{ ease: "linear", duration: 25, repeat: Infinity }}
              >
                {[...images, ...images].map((src, idx) => (
                   <div key={`col1-${idx}`} className="relative h-[180px] sm:h-[250px] lg:h-[320px] w-full rounded-2xl overflow-hidden shrink-0 shadow-md">
                      <Image src={src} alt="Weaving" fill className="object-cover transition-transform duration-700 hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
                   </div>
                ))}
              </motion.div>
              
              {/* Column 2: Scrolling Up */}
              <motion.div 
                className="flex flex-col gap-4 w-1/2"
                animate={{ y: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 30, repeat: Infinity }}
              >
                {[...images, ...images].reverse().map((src, idx) => (
                   <div key={`col2-${idx}`} className="relative h-[180px] sm:h-[250px] lg:h-[320px] w-full rounded-2xl overflow-hidden shrink-0 shadow-md">
                      <Image src={src} alt="Weaving" fill className="object-cover transition-transform duration-700 hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
                   </div>
                ))}
              </motion.div>
            </div>

            {/* Cinematic Badge Overlay */}
            <div className="absolute bottom-6 left-6 right-6 z-30 pointer-events-none">
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white/95 backdrop-blur-md border border-white/50 p-5 rounded-2xl text-[#0F172A] shadow-xl flex items-center justify-between"
               >
                 <div>
                   <h4 className="text-lg font-bold">{data?.subtitle?.split('•')[0] || ""}</h4>
                   <p className="text-xs font-medium text-gray-500">{data?.subtitle?.split('•')[1] || ""}</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center shrink-0 shadow-lg">
                    <Maximize className="w-5 h-5 text-[#1A1A1A]" />
                 </div>
               </motion.div>
            </div>
          </div>

          {/* Right Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-8"
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
              {highlights.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                  className="flex items-start space-x-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-[#C9A227]/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FFFDF5] rounded-xl flex items-center justify-center shrink-0">
                    {iconMap[item.icon]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-6">
              <a 
                href={data?.buttonLink || ""}
                className="group inline-flex items-center space-x-3 text-[#C9A227] font-semibold pb-2 border-b-2 border-[#C9A227]/30 hover:border-[#C9A227] transition-colors"
              >
                <span>{data?.buttonText || ""}</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
