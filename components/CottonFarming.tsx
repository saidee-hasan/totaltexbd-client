'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Sun, Droplets, Sprout, TreePine, Recycle, Wind, CloudRain } from 'lucide-react';
import Image from 'next/image';
import type { SectionData } from '@/lib/api';

const ICONS: Record<string, typeof Sun> = { Sun, Droplets, Leaf, Sprout, TreePine, Recycle, Wind, CloudRain };

export default function CottonFarming({ data }: { data?: SectionData }) {
  const title = data?.title || '';
  const subtitle = data?.badgeText || data?.subtitle || '';
  const description = data?.description || '';
  const buttonText = data?.buttonText || '';
  const buttonLink = data?.buttonLink || '';
  const image1 = data?.images?.[0] || data?.image || '';
  const image2 = data?.images?.[1] || data?.image || '';
  const image3 = data?.images?.[2] || data?.image || '';
  const badgeTitle = data?.badgeText || '';
  const badgeSubtitle = data?.subtitle || '';

  const features: { icon: string; title: string; description: string }[] = data?.content?.features || [];

  return (
    <section id="cotton" className="relative w-full py-12 md:py-16 lg:py-20 bg-[#FAFAFA] overflow-hidden">
      {/* Background Subtle Patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A227]/5 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Images Grid */}
          <div className="relative h-[380px] sm:h-[480px] lg:h-[700px] w-full">
            {/* Main Top Left Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 left-0 w-[70%] h-[60%] rounded-3xl overflow-hidden shadow-2xl z-10 group"
            >
              <div className="absolute inset-0 bg-black/10 z-10 transition-colors duration-500 group-hover:bg-transparent" />
              {image1 && (
                <Image
                  src={image1}
                  alt="Photorealistic Cotton Farming at Golden Hour"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 50vw"
                />
              )}
            </motion.div>

            {/* Smaller Right Image */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute top-[10%] right-0 w-[45%] h-[45%] rounded-3xl overflow-hidden shadow-xl z-20 group border-4 border-[#FAFAFA]"
            >
              <div className="absolute inset-0 bg-[#C9A227]/10 z-10 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0" />
              {image2 && (
                <Image
                  src={image2}
                  alt="Quality Laboratory"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}
            </motion.div>

            {/* Bottom Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="absolute bottom-0 right-[15%] w-[65%] h-[40%] rounded-3xl overflow-hidden shadow-2xl z-30 group border-4 border-[#FAFAFA]"
            >
              {image3 && (
                <Image
                  src={image3}
                  alt="Quality Inspection"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 40vw"
                />
              )}
            </motion.div>

            {/* Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute bottom-10 left-0 max-w-[85%] lg:max-w-none lg:bottom-[20%] lg:-left-6 bg-white/95 backdrop-blur-md border border-white/50 shadow-xl px-5 py-3 lg:px-6 lg:py-4 rounded-2xl z-40 flex items-center space-x-3 lg:space-x-4"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#F0Fdf4] rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 lg:w-6 lg:h-6 text-[#C9A227]" />
              </div>
              <div>
                <div className="text-lg lg:text-xl font-bold text-[#0F172A]">{badgeTitle}</div>
                <div className="text-xs lg:text-sm font-medium text-gray-600">{badgeSubtitle}</div>
              </div>
            </motion.div>
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
                <span>{subtitle}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
                {title}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl whitespace-pre-line">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {features.map((feature, idx) => {
                const Icon = ICONS[feature.icon] || Leaf;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                    className="flex flex-col space-y-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-[#FFFDF5] border border-[#F3E8C1] rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#C9A227]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1A1A1A]">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-6">
              <a 
                href={buttonLink}
                className="group inline-flex items-center space-x-3 text-[#1A1A1A] font-semibold pb-2 border-b-2 border-[#C9A227]/30 hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
