"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, Home, Plus } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const overlayVariants: Variants = {
    closed: { opacity: 0 },
    open: { opacity: 1, transition: { duration: 0.3 } },
  };

  const drawerVariants: Variants = {
    closed: { x: "100%", transition: { type: "tween", ease: "easeInOut", duration: 0.4 } },
    open: { x: 0, transition: { type: "tween", ease: "easeInOut", duration: 0.4 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.nav
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative w-full max-w-[320px] sm:max-w-[400px] h-[100dvh] bg-black shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Header: Home Icon & Close Icon */}
            <div className="flex justify-between items-center px-6 py-6">
              <Link href="/" onClick={onClose} className="text-white hover:text-[#C9A227] transition-colors mt-2">
                <Home className="w-5 h-5" />
              </Link>
              <button
                onClick={onClose}
                className="text-white hover:text-[#C9A227] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            
            {/* Top Border for list */}
            <div className="w-full h-px bg-zinc-800" />

            {/* Link List */}
            <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-center justify-between py-4 border-b border-zinc-800 text-white hover:text-[#C9A227] transition-colors"
                >
                  <span className="text-[15px] font-bold">{link.label}</span>
                  <Plus className="w-4 h-4 text-white group-hover:text-[#C9A227] transition-colors" />
                </Link>
              ))}
            </div>

            {/* Footer / CTA */}
            <div className="px-6 py-8 border-t border-zinc-800 bg-black">
              <a href="mailto:id@totaltexbd.com" className="block text-white text-sm hover:text-[#C9A227] transition-colors mb-4">
                id@totaltexbd.com
              </a>
              <Link
                href="/contact"
                onClick={onClose}
                className="w-full flex items-center justify-center h-12 border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-black font-bold uppercase tracking-widest text-xs rounded transition-colors"
              >
                Request a Quote
              </Link>
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
