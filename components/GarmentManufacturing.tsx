'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Scissors, Factory, Package, Layers } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import type { SectionData } from '@/lib/api';

const STAGE_ICONS: Record<string, ReactNode> = {
  Scissors: <Scissors className="w-5 h-5 text-[#C9A227]" />,
  Factory: <Factory className="w-5 h-5 text-[#C9A227]" />,
  Package: <Package className="w-5 h-5 text-[#C9A227]" />,
};

export default function GarmentManufacturing({ data }: { data?: SectionData }) {
  const stages: { icon: string; title: string; description: string }[] = data?.content?.stages || [];
  const img1 = data?.images?.[0] || data?.image || "";
  const img2 = data?.images?.[1] || "";
  const img3 = data?.images?.[2] || "";

  return (
    <section id="garment" className="relative w-full py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      {/* Warm industrial background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FFFDF5]/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-amber-50/50 rounded-full blur-[100px]" />
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
              {stages.map((stage, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                  className="flex items-start space-x-4 bg-gray-50 p-5 rounded-2xl hover:bg-[#FFFDF5]/30 transition-colors border border-transparent hover:border-[#C9A227]/30"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                    {STAGE_ICONS[stage.icon]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">{stage.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mt-1">
                      {stage.description}
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

          {/* Right Side: Animated Bento Grid */}
          <div className="relative h-[420px] sm:h-[520px] lg:h-[650px] w-full order-1 lg:order-2 grid grid-cols-2 grid-rows-3 gap-4 lg:gap-6">
            
            {/* Top Large Image (Spans 2 columns, 2 rows) */}
            <motion.div 
              className="relative col-span-2 row-span-2 rounded-[2rem] overflow-hidden shadow-2xl group"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            >
               <motion.div 
                 animate={{ scale: [1, 1.1, 1] }} 
                 transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                 className="absolute inset-0"
               >
                 {img1 && (
                   <Image src={img1} alt="Garment Assembly" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                 )}
               </motion.div>
               
               {/* Overlay Content */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
               <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 text-white z-10 pointer-events-none max-w-[80%]">
                  <h4 className="text-2xl font-bold mb-1 drop-shadow-lg">Assembly Line</h4>
                  <p className="text-sm text-gray-200 drop-shadow">{data?.subtitle || ""}</p>
               </div>
            </motion.div>

            {/* Bottom Left Small Image */}
            <motion.div 
              className="relative col-span-1 row-span-1 rounded-[2rem] overflow-hidden shadow-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, delay: 1, ease: "easeInOut", repeat: Infinity }}
            >
               <motion.div 
                 animate={{ scale: [1, 1.15, 1] }} 
                 transition={{ duration: 20, delay: 2, ease: "linear", repeat: Infinity }}
                 className="absolute inset-0"
               >
                 {img2 && (
                   <Image src={img2} alt="Precision Cutting" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                 )}
               </motion.div>
               <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-500" />
            </motion.div>

            {/* Bottom Right Small Image */}
            <motion.div 
              className="relative col-span-1 row-span-1 rounded-[2rem] overflow-hidden shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, delay: 2.5, ease: "easeInOut", repeat: Infinity }}
            >
               <motion.div 
                 animate={{ scale: [1, 1.2, 1] }} 
                 transition={{ duration: 22, delay: 5, ease: "linear", repeat: Infinity }}
                 className="absolute inset-0"
               >
                 {img3 && (
                   <Image src={img3} alt="Factory Overview" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                 )}
               </motion.div>
               <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-500" />
            </motion.div>

            {/* Floating Central Icon */}
            <div className="absolute top-[66%] lg:top-[66%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white/95 backdrop-blur-md border border-gray-100 p-4 rounded-2xl flex items-center justify-center shadow-2xl"
               >
                 <Layers className="w-8 h-8 text-[#C9A227]" />
               </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
