"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { fetchSectionMap, SectionRecord } from "@/lib/api";

const DEFAULT_FOOTER = {
  headingLine1: "Let's Build",
  headingLine2: "Together.",
  description:
    "Partner with a world-class manufacturing facility. From raw cotton to finished garments, we engineer apparel solutions that define global brands.",
  brandName: "TOTAL APPAREL",
  brandDescription:
    "Engineering world-class apparel solutions from Dhaka to the global market — from raw cotton to finished garments.",
  email: "id@totaltexbd.com",
  buttonText: "Start Project",
  buttonLink: "/contact",
  columns: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Process", href: "/process" },
        { label: "Capabilities", href: "/capabilities" },
        { label: "News", href: "/news" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Product Catalog", href: "/products" },
        { label: "Lookbook", href: "/lookbook" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Socials",
      links: [],
    },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const iconClass = "w-4 h-4";

// Bare social homepages (e.g. https://facebook.com) are placeholders, not real
// profiles — drop them so the footer never links to an empty company page.
const PLACEHOLDER_SOCIAL =
  /^https?:\/\/(www\.)?(facebook|fb|instagram|linkedin|twitter|x|youtube|tiktok)\.com\/?$/i;
const isPlaceholderLink = (href?: string) => !href || PLACEHOLDER_SOCIAL.test(href.trim());

const socialIcon = (label: string) => {
  const key = label.toLowerCase();
  if (key.includes("facebook"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9v-2.89h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
      </svg>
    );
  if (key.includes("instagram"))
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass} aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (key.includes("linkedin"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9V9Z" />
      </svg>
    );
  if (key.includes("twitter") || key.trim() === "x")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
        <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2Zm-1.16 18h1.83L7.35 3.9H5.39L17.74 20Z" />
      </svg>
    );
  if (key.includes("youtube"))
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
        <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
      </svg>
    );
  return null;
};

export default function Footer() {
  const [section, setSection] = useState<SectionRecord | null>(null);

  useEffect(() => {
    let active = true;
    fetchSectionMap().then((map) => {
      if (!active) return;
      setSection(map["footer"] || null);
    });
    return () => {
      active = false;
    };
  }, []);

  const content = section?.content || {};
  const columns = ((content.columns && content.columns.length > 0
    ? content.columns
    : DEFAULT_FOOTER.columns) || []) as { title: string; links: { label: string; href: string }[] }[];
  const legalLinks = ((content.legalLinks && content.legalLinks.length > 0
    ? content.legalLinks
    : DEFAULT_FOOTER.legalLinks) || []) as { label: string; href: string }[];
  const cleanColumns = columns
    .map((col) => ({ ...col, links: (col.links || []).filter((l) => !isPlaceholderLink(l.href)) }))
    .filter((col) => col.links.length > 0);
  const headingLine1 =
    content.headingLine1 ??
    (section?.title ? section.title.replace(/\s+\S+$/, "") : DEFAULT_FOOTER.headingLine1);
  const headingLine2 =
    content.headingLine2 ??
    (section?.title ? section.title.split(/\s+/).slice(-1)[0] : DEFAULT_FOOTER.headingLine2);
  const brandName = content.brandName || DEFAULT_FOOTER.brandName;
  const brandDescription = content.brandDescription || DEFAULT_FOOTER.brandDescription;
  const email = content.email || DEFAULT_FOOTER.email;

  return (
    <footer className="relative w-full bg-[#0B1220] text-white">
      {/* Accent hairline */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#0B1220] via-[#C9A227] to-[#0B1220]" />

      {/* Soft ambient glow (static, no distracting motion) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[26rem] w-[70rem] -translate-x-1/2 rounded-full bg-[#C9A227]/10 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
        {/* CTA band */}
        <div className="grid gap-8 border-b border-white/10 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              {headingLine1} <span className="text-[#C9A227]">{headingLine2}</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {section?.description || DEFAULT_FOOTER.description}
            </p>
          </div>
          <div className="md:justify-self-end">
            <Link
              href={section?.buttonLink || DEFAULT_FOOTER.buttonLink}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C9A227] px-8 py-4 text-sm font-bold text-[#0B1220] transition-colors hover:bg-[#E0B94A] sm:w-auto"
            >
              {section?.buttonText || DEFAULT_FOOTER.buttonText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Brand + link columns */}
        <div className="grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr]">
          {/* Brand */}
          <div className="max-w-md">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black uppercase tracking-[0.2em] text-white">
                {brandName}
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">{brandDescription}</p>

            <a
              href={`mailto:${email}`}
              className="mt-6 inline-flex items-center gap-2.5 text-sm font-medium text-slate-200 transition-colors hover:text-[#C9A227]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Mail className="h-4 w-4 text-[#C9A227]" />
              </span>
              {email}
            </a>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cleanColumns.map((col, idx) => {
              const isSocial = col.title.toLowerCase().includes("social");
              return (
                <div key={idx}>
                  <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white">
                    {col.title}
                  </h4>
                  <ul className="space-y-3">
                    {col.links.map((link, i) => (
                      <li key={i}>
                        {isSocial ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-2.5 text-sm text-slate-400 transition-colors hover:text-[#C9A227]"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors group-hover:border-[#C9A227]/40 group-hover:text-[#C9A227]">
                              {socialIcon(link.label) || <ArrowRight className="h-3.5 w-3.5" />}
                            </span>
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-sm text-slate-400 transition-colors hover:text-white"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="tracking-wide">
            &copy; {new Date().getFullYear()} {brandName} BD. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="transition-colors hover:text-[#C9A227]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
