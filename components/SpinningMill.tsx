'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ArrowRight, Settings, Repeat, Layers } from 'lucide-react';
import Image from 'next/image';
import type { SectionData } from '@/lib/api';

const iconMap: Record<string, ReactNode> = {
  Settings: <Settings className="w-5 h-5 text-gray-700" />,
  Repeat: <Repeat className="w-5 h-5 text-gray-700" />,
  Layers: <Layers className="w-5 h-5 text-gray-700" />,
};

export default function SpinningMill({ data }: { data?: SectionData }) {
  const processes = (data?.content?.processes || []) as { icon: string; title: string; description: string }[];

  const validImages = (data?.images && Array.isArray(data.images))
    ? data.images.filter((img: string) => Boolean(img && typeof img === 'string' && img.trim()))
    : [];

  const images = validImages.length > 0
    ? (validImages.length === 1 ? [...validImages, ...validImages, ...validImages, ...validImages] : [...validImages, ...validImages])
    : [];

  return (
    <section id="spinning" className="relative w-full py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
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
              <div className="inline-flex items-center space-x-2 text-sm font-semibold tracking-wider text-gray-500 uppercase">
                <span className="w-8 h-px bg-gray-500" />
                <span>{data?.badgeText || ""}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
                {data?.title || ""}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
                {data?.description || ""}
              </p>
            </div>

            <div className="flex flex-col space-y-6 pt-4">
              {processes.map((process, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    {iconMap[process.icon]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A]">{process.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mt-1">
                      {process.description}
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

          {/* Right Side: Image Marquee */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[400px] sm:h-[500px] lg:h-[700px] w-full overflow-hidden group order-1 lg:order-2 flex gap-4 lg:gap-6 justify-center items-center rounded-3xl"
          >
            {/* Edge fade gradients for seamless look */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />

            {/* Column 1 (Scrolling Up) */}
            <motion.div
              className="flex flex-col gap-4 lg:gap-6 w-1/2 min-w-0 sm:min-w-[160px] lg:min-w-[200px]"
              animate={{ y: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 25,
                repeat: Infinity,
              }}
            >
              {[...images, ...images].map((src, idx) => (
                <div key={`col1-${idx}`} className="relative w-full h-[250px] lg:h-[350px] rounded-[2rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-black/10 z-10 transition-colors duration-500 group-hover:bg-transparent" />
                  <Image
                    src={src}
                    alt={`Spinning Process ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 30vw"
                  />
                </div>
              ))}
            </motion.div>

            {/* Column 2 (Scrolling Down) */}
            <motion.div
              className="flex flex-col gap-4 lg:gap-6 w-1/2 min-w-0 sm:min-w-[160px] lg:min-w-[200px]"
              animate={{ y: ["-50%", "0%"] }}
              transition={{
                ease: "linear",
                duration: 30,
                repeat: Infinity,
              }}
            >
              {[...images, ...images].reverse().map((src, idx) => (
                <div key={`col2-${idx}`} className="relative w-full h-[280px] lg:h-[400px] rounded-[2rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-black/10 z-10 transition-colors duration-500 group-hover:bg-transparent" />
                  <Image
                    src={src}
                    alt={`Spinning Process Reverse ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 30vw"
                  />
                </div>
              ))}
            </motion.div>

            {/* Floating Info Box */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-8 z-30 pointer-events-none">
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white/95 backdrop-blur-xl border border-white p-5 sm:p-6 rounded-2xl text-[#1A1A1A] shadow-2xl w-full max-w-[280px]"
               >
                 <h4 className="text-lg font-bold mb-1">{data?.content?.floatingBox?.title || ""}</h4>
                 <p className="text-xs text-gray-600 font-medium leading-relaxed">{data?.content?.floatingBox?.description || ""}</p>
               </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
