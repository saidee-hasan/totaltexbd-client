"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fetchSectionMap } from "@/lib/api";

interface ProcessStep {
  num: string;
  title: string;
  description: string;
  image: string;
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    num: '01',
    title: 'Design & Development',
    description: 'Tech packs and concepts are refined into manufacturable specs with sampling and fit approvals.',
    image: '/fabric-development.png',
  },
  {
    num: '02',
    title: 'Sourcing & Sampling',
    description: 'Premium fabrics and trims are sourced, tested, and approved before bulk production begins.',
    image: '/process-sourcing.png',
  },
  {
    num: '03',
    title: 'Production & QC',
    description: 'Precision cutting, stitching, and multi-stage quality inspection across every production line.',
    image: '/process-quality.png',
  },
  {
    num: '04',
    title: 'Finishing & Logistics',
    description: 'Steam finishing, export-ready packing, and consolidated global shipping with full tracking.',
    image: '/export-logistics.png',
  },
];

const ManufacturingProcess = () => {
  const [steps, setSteps] = useState<ProcessStep[]>(DEFAULT_STEPS);
  const [heading, setHeading] = useState<{ line1: string; line2: string }>({
    line1: 'Our Manufacturing',
    line2: 'Process',
  });

  useEffect(() => {
    let active = true;
    fetchSectionMap().then((map) => {
      if (!active) return;
      const section = map["about_process"];
      const remoteSteps = (section?.content?.steps || []) as unknown as ProcessStep[];
      if (remoteSteps.length > 0) setSteps(remoteSteps);
      const title = section?.title || "";
      if (title || section?.content?.headingLine1 || section?.content?.headingLine2) {
        setHeading({
          line1: section?.content?.headingLine1 ?? (title ? title.replace(/\s+\S+$/, "") : "Our Manufacturing"),
          line2: section?.content?.headingLine2 ?? (title ? title.split(/\s+/).slice(-1)[0] : "Process"),
        });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="w-full bg-white py-14 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-9xl mx-auto">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C9A227] mb-3">
            How We Work
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1A1A1A]">
            {heading.line1} <span className="font-serif italic text-[#C9A227]">{heading.line2}</span>
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-7">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col"
            >
              {/* Image with number badge */}
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
                {step.image ? (
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute left-4 top-4 inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-white/95 px-2.5 text-sm font-bold text-[#C9A227] shadow-md backdrop-blur-md">
                  {step.num}
                </span>
              </div>

              {/* Text */}
              <h3 className="mt-5 text-lg font-bold text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#C9A227]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ManufacturingProcess;
