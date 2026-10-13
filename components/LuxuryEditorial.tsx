"use client";

import React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getApiBase } from "@/lib/api";
import type { SectionData } from "@/lib/api";

interface LuxuryData {
  image: string;
  alt: string;
  subtitle: string;
  titleLine1: string;
  titleLine2: string;
  buttonText: string;
  buttonLink: string;
}

export default function LuxuryEditorial() {
  const [data, setData] = useState<LuxuryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${getApiBase()}/api/sections`, { cache: "no-cache" })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          const section = (resData.data as SectionData[]).find((s) => s.sectionKey === 'luxury_editorial');
          if (section) {
            setData(section.content as unknown as LuxuryData);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="relative w-full h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="relative w-full h-screen bg-white">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={data.image}
          alt={data.alt}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <span className="text-white text-xs uppercase tracking-[0.4em] font-light mb-6">
          {data.subtitle}
        </span>
        
        <h2 className="text-white text-3xl sm:text-5xl md:text-6xl font-serif tracking-widest font-light leading-tight">
          {data.titleLine1} <br /> {data.titleLine2}
        </h2>

        <div className="mt-12">
          <a
            href={data.buttonLink}
            className="text-white text-xs uppercase tracking-[0.3em] font-light border-b border-white pb-2 hover:opacity-70 transition-opacity"
          >
            {data.buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}
