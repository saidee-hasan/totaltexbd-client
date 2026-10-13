"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X, Shirt } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const validImages = images.filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  if (validImages.length === 0) {
    return (
      <div className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/70 flex flex-col items-center justify-center text-gray-400">
        <Shirt className="w-16 h-16 stroke-1 mb-2 text-gray-300" />
        <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">Catalog Preview Pending</span>
      </div>
    );
  }

  const currentImage = validImages[currentIndex];
  const isCurrentFailed = failedImages[currentIndex];

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        {/* Main Image Stage */}
        <div className="relative order-1 sm:order-2 flex-1 min-w-0 aspect-square w-full bg-white overflow-hidden group rounded-xl border border-gray-200/90 shadow-2xs flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {isCurrentFailed ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-6 text-center">
                  <Shirt className="w-16 h-16 stroke-1 mb-2 text-gray-300" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    {productName}
                  </p>
                  <span className="text-[11px] text-gray-400">Preview available upon sample request</span>
                </div>
              ) : (
                <Image
                  src={currentImage}
                  alt={`${productName} view ${currentIndex + 1}`}
                  fill
                  priority={currentIndex === 0}
                  unoptimized={currentImage.startsWith("http")}
                  className="object-contain p-2 sm:p-4 transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onError={() => handleImageError(currentIndex)}
                  onClick={() => setIsZoomOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Quick Action Overlay Controls */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-gray-800 shadow-md flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-gray-800 shadow-md flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Zoom Trigger Button */}
          {!isCurrentFailed && (
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-medium tracking-wide shadow-xs hover:bg-black transition-all z-10 cursor-pointer"
              title="Enlarge preview"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Zoom</span>
            </button>
          )}
        </div>

        {/* Thumbnails: below the image on mobile, vertical column on the left on desktop */}
        {validImages.length > 1 && (
          <div className="order-2 sm:order-1 flex flex-row sm:flex-col items-center justify-center sm:justify-start gap-2 sm:gap-2.5 shrink-0 overflow-x-auto sm:overflow-y-auto no-scrollbar py-0.5 sm:max-h-[560px] w-full sm:w-auto">
            {validImages.map((img, idx) => {
              const isSelected = currentIndex === idx;
              const hasFailed = failedImages[idx];
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative aspect-square w-14 sm:w-16 shrink-0 overflow-hidden rounded-lg border bg-white p-1 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#C9A227] ring-2 ring-[#C9A227]/40 shadow-xs"
                      : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300"
                  }`}
                  aria-label={`View thumbnail ${idx + 1}`}
                >
                  {hasFailed ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <Shirt className="w-4 h-4" />
                    </div>
                  ) : (
                    <Image
                      src={img}
                      alt={`${productName} thumbnail ${idx + 1}`}
                      fill
                      unoptimized={img.startsWith("http")}
                      className="object-contain p-0.5"
                      sizes="80px"
                      onError={() => handleImageError(idx)}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && !isCurrentFailed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsZoomOpen(false)}
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="relative w-full max-w-4xl aspect-square max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl bg-white p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage}
                alt={`${productName} enlarged view`}
                fill
                unoptimized={currentImage.startsWith("http")}
                className="object-contain p-4"
                sizes="(max-width: 1200px) 90vw, 1200px"
              />
            </div>

            {validImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
