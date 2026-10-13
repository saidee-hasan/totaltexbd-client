'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowRight, Building2 } from 'lucide-react';
import Image from 'next/image';
import type { SectionData } from '@/lib/api';

export default function LetsWorkTogether({ data }: { data?: SectionData }) {
  const imageSrc = data?.images?.[0] || data?.image || "";

  return (
    <section className="relative w-full py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      {/* Premium background styling */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-50 via-white to-white" />
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#0F172A] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          
          {/* Decorative geometric background inside the dark card */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C9A227]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Side: Contact Form & Info */}
            <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold tracking-wider text-[#C9A227] uppercase">
                  <span className="w-8 h-px bg-[#C9A227]" />
                  <span>{data?.badgeText || ""}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  {data?.title || ""}
                </h2>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md pt-1 sm:pt-2">
                  {data?.description || ""}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-8 sm:mt-12 space-y-5 sm:space-y-6"
              >
                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <Mail className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">Email Us</p>
                    <a href={data?.buttonLink?.startsWith('mailto:') ? data.buttonLink : `mailto:${data?.buttonLink || ''}`} className="text-sm sm:text-base font-semibold hover:text-white transition-colors">
                      {data?.buttonLink?.replace('mailto:', '') || ""}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <Building2 className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">Global Headquarters</p>
                    <p className="text-sm sm:text-base font-semibold">{data?.subtitle?.replace('Global Headquarters:', '')?.trim() || ""}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12"
              >
                <a 
                  href={data?.buttonLink || ""}
                  className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-[#1A1A1A] rounded-xl overflow-hidden transition-all duration-300 hover:bg-[#C9A227] hover:shadow-[0_8px_30px_rgba(201,162,39,0.3)] hover:-translate-y-1"
                >
                  <span className="relative flex items-center gap-2">
                    {data?.buttonText || ""}
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
              </motion.div>
            </div>

            {/* Right Side: Image */}
            <div className="relative h-[240px] sm:h-[320px] lg:h-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute inset-0 rounded-l-3xl overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-black/10 z-10" />
                {imageSrc && (
                  <Image
                    src={imageSrc}
                    alt="Business professionals shaking hands"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
