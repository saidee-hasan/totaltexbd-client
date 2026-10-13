"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getApiBase } from "@/lib/api";
import type { SectionData } from "@/lib/api";

interface ScrollItem {
  id: number;
  title: string;
  img: string;
}

interface HorizontalScrollData {
  title: string;
  subtitle: string;
  items: ScrollItem[];
}

export default function HorizontalScroll() {
  const [data, setData] = useState<HorizontalScrollData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-65%"]);

  useEffect(() => {
    fetch(`${getApiBase()}/api/sections`, { cache: "no-cache" })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          const section = (resData.data as SectionData[]).find((s) => s.sectionKey === 'horizontal_scroll');
          if (section) {
            setData(section.content as unknown as HorizontalScrollData);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="relative h-[300vh] bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
      </section>
    );
  }

  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#FAFAFA]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        <div className="absolute top-20 left-8 md:top-32 md:left-24 z-10 pointer-events-none">
          <motion.div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-black uppercase leading-none"
            >
              {data.title}
            </motion.h2>
          </motion.div>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.3, ease: "circOut" }}
            viewport={{ once: true }}
            className="h-[2px] bg-black my-4 md:my-6"
          />
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-gray-500 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase"
          >
            {data.subtitle}
          </motion.p>
        </div>

        <div className="absolute bottom-12 left-8 md:left-24 right-8 md:right-24 h-[2px] bg-gray-200 z-10 flex items-center">
          <motion.div 
            className="h-[2px] bg-black origin-left w-full relative"
            style={{ scaleX: scrollYProgress }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
          </motion.div>
        </div>

        <motion.div style={{ x }} className="flex gap-8 md:gap-16 px-8 md:px-24 w-max items-center h-full mt-24">
          {data.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative flex-shrink-0 w-[85vw] md:w-[480px] h-[60vh] md:h-[70vh] cursor-pointer group rounded-xl overflow-hidden shadow-2xl shadow-black/5"
            >
              <div className="w-full h-full relative overflow-hidden bg-gray-200">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover transition-all duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-110 filter grayscale-[40%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                <div className="flex items-center gap-4 mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-white font-mono text-xs md:text-sm tracking-[0.2em] border border-white/40 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/10">
                    NO. 0{item.id}
                  </span>
                </div>
                
                <div className="h-[40px] md:h-[60px] overflow-hidden relative">
                  <div className="flex flex-col transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:-translate-y-1/2">
                    <h3 className="text-white text-3xl md:text-5xl font-black tracking-tighter uppercase h-[40px] md:h-[60px] flex items-center">
                      {item.title}
                    </h3>
                    <h3 className="text-[#c7a17a] text-3xl md:text-5xl font-black tracking-tighter uppercase h-[40px] md:h-[60px] flex items-center">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
