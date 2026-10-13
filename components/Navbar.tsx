"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  Leaf,
  Settings2,
  Grid,
  Layers,
  Droplet,
  Microscope,
  Scissors,
  Ship,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import MobileMenu from "./ui/MobileMenu";
import { fetchSectionMap } from "@/lib/api";

const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const PROCESS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf,
  Settings2,
  Grid,
  Layers,
  Droplet,
  Microscope,
  Scissors,
  Ship,
};

interface NavLink {
  label: string;
  href: string;
}

interface NavMenuItem {
  label: string;
  href: string;
  icon?: string;
}

interface NavMenu {
  links?: NavMenuItem[];
  socials?: NavMenuItem[];
  processLinks?: NavMenuItem[];
  featuredImage?: string;
  featuredTitle?: string;
  featuredText?: string;
}

interface NavContent {
  [key: string]: unknown;
  aboutMenu?: NavMenu;
  productsMenu?: NavMenu;
  ctaText?: string;
  ctaLink?: string;
}

// Bare social homepages are placeholders, not real profiles — filter them out.
const PLACEHOLDER_SOCIAL =
  /^https?:\/\/(www\.)?(facebook|fb|instagram|linkedin|twitter|x|youtube|tiktok)\.com\/?$/i;
const isPlaceholderLink = (href?: string) => !href || PLACEHOLDER_SOCIAL.test(href.trim());

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/capabilities" },
  { label: "Process", href: "/process" },
  { label: "Products", href: "/products" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

const DEFAULT_NAV_CONTENT: NavContent = {
  aboutMenu: {
    featuredImage: "/our-story-cover.png",
    featuredTitle: "Heritage & Vision",
    featuredText: "Engineering apparel solutions with decades of textile expertise.",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Mission & Values", href: "/about#mission" },
      { label: "Team & Expertise", href: "/about#team" },
      { label: "Sustainability", href: "/about#sustainability" },
    ],
    socials: [
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Instagram", href: "https://instagram.com" },
    ],
    processLinks: [
      { label: "Raw Cotton", href: "/process#cotton", icon: "Leaf" },
      { label: "Spinning Mill", href: "/process#spinning", icon: "Settings2" },
      { label: "Weaving Loom", href: "/process#weaving", icon: "Grid" },
      { label: "Yarn to Fabric", href: "/process#yarn", icon: "Layers" },
      { label: "Fabric Dyeing", href: "/process#dyeing", icon: "Droplet" },
      { label: "Quality Lab", href: "/process#lab", icon: "Microscope" },
      { label: "Garment Making", href: "/process#garment", icon: "Scissors" },
      { label: "Global Logistics", href: "/process#shipping", icon: "Ship" },
    ],
  },
  productsMenu: {
    featuredImage: "/apparel-manufacturing.png",
    featuredTitle: "Premium Collection",
    featuredText: "Discover high-grade knitwear, outerwear, and precision streetwear blanks.",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Mens Clothing", href: "/products?category=Mens%20Clothing" },
      { label: "Womens Clothing", href: "/products?category=Womens%20Clothing" },
      { label: "Activewear", href: "/products?category=Activewear" },
      { label: "Outerwear & Hoodies", href: "/products?category=Hoodie%20%26%20Sweatshirts" },
    ],
  },
  ctaText: "Request Quote",
  ctaLink: "/contact",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>(DEFAULT_NAV_LINKS);
  const [navContent, setNavContent] = useState<NavContent>(DEFAULT_NAV_CONTENT);
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    fetchSectionMap().then((map) => {
      if (!active) return;
      const nav = map["navbar"];
      const fetchedLinks = nav?.content?.links as unknown as NavLink[] | undefined;
      if (Array.isArray(fetchedLinks) && fetchedLinks.length > 0) {
        setNavLinks(fetchedLinks);
      }
      setNavContent({
        ...DEFAULT_NAV_CONTENT,
        ...(nav?.content || {}),
        aboutMenu: {
          ...DEFAULT_NAV_CONTENT.aboutMenu,
          ...((nav?.content?.aboutMenu as NavMenu) || {}),
        },
        productsMenu: {
          ...DEFAULT_NAV_CONTENT.productsMenu,
          ...((nav?.content?.productsMenu as NavMenu) || {}),
        },
        ctaText: nav?.buttonText || (nav?.content?.ctaText as string) || DEFAULT_NAV_CONTENT.ctaText,
        ctaLink: nav?.buttonLink || (nav?.content?.ctaLink as string) || DEFAULT_NAV_CONTENT.ctaLink,
      });
    }).catch((err) => {
      console.warn("Navbar section fetch fallback used:", err);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeroDark = pathname === "/" || pathname === "/products";
  const isSolid = scrolled || !isHeroDark;

  const aboutMenu = navContent.aboutMenu || {};
  const productsMenu = navContent.productsMenu || {};
  const aboutSocials = (aboutMenu.socials || []).filter((s) => !isPlaceholderLink(s.href));
  // Products dropdown categories (configured from the navbar section content).
  const productMenuLinks: NavLink[] = (productsMenu.links || []).map((l) => ({ label: l.label, href: l.href }));
  const ctaText = navContent.ctaText || "Request Quote";
  const ctaLink = navContent.ctaLink || "/contact";

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isSolid 
            ? "bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-[0_4px_30px_rgb(0,0,0,0.03)] py-4" 
            : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-2 sm:gap-3 font-black text-base sm:text-xl tracking-[0.1em] sm:tracking-[0.15em] transition-all duration-500 z-10 hover:opacity-80 ${isSolid ? "text-[#1A1A1A]" : "text-white"}`}
          >
            <Image 
              src="/companylogo.png" 
              alt="Total Apparel Logo" 
              width={48} 
              height={48} 
              className="object-contain w-auto h-auto"
            />
            TOTAL APPAREL
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-2 z-10" onMouseLeave={() => setHoveredLink(null)}>
            <ul className="flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isHovered = hoveredLink === link.label;

                return (
                  <li key={link.label} className="relative">
                    <Link
                      href={link.href}
                      onMouseEnter={() => setHoveredLink(link.label)}
                      onFocus={() => setHoveredLink(link.label)}
                      className={`relative px-3.5 py-2 text-xs font-bold tracking-[0.12em] uppercase transition-colors duration-300 z-20 flex items-center justify-center ${
                        isSolid
                          ? isActive || isHovered ? "text-[#C9A227]" : "text-gray-500 hover:text-[#C9A227]"
                          : isActive ? "text-white" : "text-white/70 hover:text-white"
                      }`}
                    >
                      {link.label}
                      
                      {/* Active/Hover Underline Indicator */}
                      {(isActive || isHovered) && (
                        <motion.div 
                          layoutId="nav-indicator"
                          className={`absolute -bottom-1 left-4 right-4 h-[2px] rounded-full z-10 ${isSolid ? "bg-[#C9A227]" : "bg-white"}`}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </Link>
                    
                    {/* About Hover Dropdown Menu */}
                    <AnimatePresence>
                      {link.label === "About" && isHovered && aboutMenu.links && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-8 w-[min(800px,90vw)] bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 flex z-50 text-black before:content-[''] before:absolute before:-top-8 before:left-0 before:w-full before:h-8"
                        >
                          <div className="grid grid-cols-3 gap-8 w-full">
                            {/* Column 1: Featured Image */}
                            <div className="relative rounded-xl overflow-hidden h-full min-h-[300px] group">
                              {aboutMenu.featuredImage && (
                                <Image src={aboutMenu.featuredImage} unoptimized alt={aboutMenu.featuredTitle || "Heritage"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute bottom-6 left-6 right-6 text-white">
                                <h4 className="text-xl font-bold mb-2">{aboutMenu.featuredTitle}</h4>
                                <p className="text-xs text-gray-300 leading-relaxed">{aboutMenu.featuredText}</p>
                                <Link href="/about" className="inline-flex items-center gap-2 mt-4 text-xs font-bold uppercase tracking-wider hover:text-[#C9A227] transition-colors">
                                  Discover More <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>

                            {/* Column 2: Company Links */}
                            <div className="flex flex-col space-y-4 py-2">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A227] mb-2 block">Company</span>
                              {(aboutMenu.links || []).map((item: NavLink, i: number) => (
                                <Link key={i} href={item.href} className="text-xs font-bold uppercase tracking-[0.15em] text-gray-600 hover:text-[#C9A227] transition-colors">{item.label}</Link>
                              ))}
                              
                              {aboutSocials.length > 0 && (
                                <div className="pt-8 mt-auto border-t border-gray-50">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block">Social Connect</span>
                                  <div className="flex items-center gap-3">
                                    {aboutSocials.map((item, i) => (
                                      <Link key={i} href={item.href} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#1A1A1A] hover:text-white transition-all duration-300">
                                        {item.label === "Instagram" ? <InstaIcon /> : <FbIcon />}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Column 3: Our Process Links */}
                            <div className="flex flex-col space-y-3 py-2 pl-6 border-l border-gray-50">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A227] mb-2 block">Our Process</span>
                              {(aboutMenu.processLinks || []).map((item: NavMenuItem, i: number) => {
                                const Icon = (item.icon && PROCESS_ICONS[item.icon]) || Leaf;
                                return (
                                  <Link key={i} href={item.href} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 hover:text-[#1A1A1A] transition-colors group">
                                    <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center group-hover:bg-[#C9A227] transition-colors">
                                      <Icon className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <span>{item.label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Products Hover Dropdown Menu (categories only, no image) */}
                    <AnimatePresence>
                      {link.label === "Products" && isHovered && productMenuLinks.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-8 w-[min(520px,90vw)] bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 z-50 text-black before:content-[''] before:absolute before:-top-8 before:left-0 before:w-full before:h-8"
                        >
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A227] mb-4 block">
                            Categories
                          </span>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                            {productMenuLinks.map((item, i) => (
                              <Link
                                key={i}
                                href={item.href}
                                className="text-sm font-bold uppercase tracking-[0.1em] text-gray-600 hover:text-[#C9A227] transition-colors flex items-center justify-between group"
                              >
                                <span className="truncate">{item.label}</span>
                                <ArrowRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            ))}
                          </div>

                          <div className="pt-5 mt-5 border-t border-gray-50 flex items-center justify-between">
                            <Link
                              href="/lookbook"
                              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#C9A227] transition-colors flex items-center gap-2"
                            >
                              <Grid className="w-3 h-3" /> View Lookbook
                            </Link>
                            <Link
                              href="/products"
                              className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#C9A227] transition-colors flex items-center gap-2"
                            >
                              Shop All <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
            
            <div className={`ml-6 pl-8 border-l transition-colors duration-500 ${isSolid ? "border-gray-200" : "border-white/20"}`}>
              <Button 
                variant={isSolid ? "default" : "outline"} 
                className={!isSolid ? "border-white text-white hover:bg-white hover:text-black rounded-full px-8" : "rounded-full px-8 bg-[#1A1A1A] hover:bg-[#C9A227]"}
                href={ctaLink}
              >
                {ctaText}
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`xl:hidden p-2 transition-colors z-10 ${
              isSolid ? "text-black" : "text-white"
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.header>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        links={navLinks} 
      />
    </>
  );
}
