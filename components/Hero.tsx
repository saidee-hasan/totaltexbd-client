"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { SectionData } from "@/lib/api";

const Hero = ({ data }: { data?: SectionData }) => {
  const rawVideos = data?.content?.videos as string[] | undefined;
  const videos: string[] = Array.isArray(rawVideos) ? rawVideos.filter((v) => typeof v === 'string' && v.trim()) : [];
  const hasVideo = videos.length > 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentVideo, setCurrentVideo] = useState(0);

  // Keep the hero on the same video across reloads (per tab).
  useEffect(() => {
    if (typeof window === "undefined" || videos.length === 0) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    const raw = window.sessionStorage.getItem("hero_video_index");
    const stored = raw === null ? NaN : parseInt(raw, 10);
    if (Number.isFinite(stored) && stored > 0 && stored < videos.length) {
      setCurrentVideo(stored);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoEnd = () => {
    if (videos.length > 0) {
      setCurrentVideo((prev) => {
        const next = (prev + 1) % videos.length;
        try {
          window.sessionStorage.setItem("hero_video_index", String(next));
        } catch {
          /* ignore storage errors */
        }
        return next;
      });
    }
  };
  
  // Cinematic scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const title = data?.title || "";
  const badgeText = data?.badgeText || "";
  const description = data?.description || data?.subtitle || "";
  const buttonText = data?.buttonText || "";
  const buttonLink = data?.buttonLink || "/contact";
  const secondaryButtonText =
    (data?.content?.secondaryButtonText as string | undefined) || "Explore Capabilities";
  const poster = data?.images?.[0] || data?.image || "";
  // Cache-bust video URLs whenever the section is updated, so a replaced file
  // or a new URL never serves a stale cached video.
  const version = data?.updatedAt ? `v=${new Date(data.updatedAt).getTime()}` : "";
  const withVersion = (src: string) =>
    !src || src.startsWith("http") || src.includes("?") ? src : `${src}${src.includes("?") ? "&" : "?"}${version}`;
  const activeVideoSrc = videos[currentVideo] || videos[0] || "";

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[560px] sm:min-h-[700px] md:min-h-[850px] overflow-hidden bg-[#0a0a0a] flex flex-col justify-center items-center"
    >
      {/* Background Video with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 w-full h-full"
        style={{ y }}
      >
        {hasVideo ? (
          <video
            key={withVersion(activeVideoSrc)}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            poster={poster || undefined}
            className="object-cover w-full h-full opacity-90 scale-105 transition-opacity duration-700"
          >
            <source src={withVersion(activeVideoSrc)} type="video/mp4" />
          </video>
        ) : poster ? (
          <Image
            src={poster}
            alt={title || "Total Apparel"}
            fill
            priority
            sizes="100vw"
            className="object-cover w-full h-full opacity-90 scale-105"
          />
        ) : null}
        
        {/* Softer Vignette & Gradients for better video visibility */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/90 z-10 pointer-events-none" />
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-16 sm:mt-20"
      >
        {/* Pill Badge */}
        {badgeText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 border border-white/20 bg-white/10 backdrop-blur-xl rounded-full px-5 py-2 mb-8 sm:mb-10 shadow-lg"
          >
            <Image 
              src="/companylogo.png" 
              alt="Total Apparel Logo" 
              width={24} 
              height={24} 
              className="object-contain w-auto h-auto"
            />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-white uppercase">
              {badgeText}
            </span>
          </motion.div>
        )}

        {/* Massive US-Style Headline */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="max-w-4xl"
          >
            <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight mb-5 sm:mb-6 drop-shadow-2xl">
              {title}
            </h1>
          </motion.div>
        )}

        {/* Sleek Subheadline */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="text-gray-200 text-xs sm:text-sm md:text-[15px] font-normal max-w-2xl mb-8 sm:mb-10 leading-relaxed tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-center"
          >
            {description}
          </motion.p>
        )}

        {/* Refined CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto"
        >
          {buttonText && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link 
                href={buttonLink} 
                className="flex items-center justify-center w-full sm:w-auto bg-[#C9A227] hover:bg-[#b08d1f] text-black font-extrabold h-14 px-10 text-[13px] uppercase tracking-widest transition-all duration-300 rounded-full shadow-[0_0_35px_rgba(201,162,39,0.4)]"
              >
                {buttonText}
              </Link>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link 
              href="/capabilities" 
              className="flex items-center justify-center w-full sm:w-auto bg-white/10 hover:bg-white hover:text-black border border-white/40 text-white h-14 px-10 text-[13px] font-bold uppercase tracking-widest transition-all duration-300 rounded-full backdrop-blur-md"
            >
              {secondaryButtonText}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
      >
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">
          Scroll to explore
        </span>
        <motion.div 
          animate={{ y: [0, 12, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 sm:h-16 bg-gradient-to-b from-[#C9A227] to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
