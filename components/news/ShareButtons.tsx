"use client";

import React, { useState } from "react";
import { Check, Link2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  variant?: "light" | "dark";
  className?: string;
}

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

export default function ShareButtons({ title, variant = "light", className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => (typeof window !== "undefined" ? window.location.href : "");
  const base =
    variant === "dark"
      ? "border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#1A1A1A]"
      : "border-gray-200 bg-white text-gray-600 hover:border-[#C9A227] hover:text-[#C9A227]";
  const btn = `inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 ${base}`;

  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer,width=640,height=560");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button type="button" aria-label="Share on X" className={btn} onClick={() => open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`)}>
        <XIcon className="w-3.5 h-3.5" />
      </button>
      <button type="button" aria-label="Share on Facebook" className={btn} onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`)}>
        <FacebookIcon className="w-4 h-4" />
      </button>
      <button type="button" aria-label="Share on LinkedIn" className={btn} onClick={() => open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`)}>
        <LinkedInIcon className="w-3.5 h-3.5" />
      </button>
      <button type="button" aria-label="Copy link" className={btn} onClick={copy}>
        {copied ? <Check className="w-4 h-4 text-[#C9A227]" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
