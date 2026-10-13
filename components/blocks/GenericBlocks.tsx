"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Sparkles, ShieldCheck, Factory, Truck, Leaf, Globe, Clock, Star, Award,
  BadgeCheck, PackageCheck, Package, Heart, Zap, Users, CheckCircle2, Quote, BarChart3,
  Play, LayoutGrid, Recycle, Wind, Sprout,
} from "lucide-react";
import { getApiBase } from "@/lib/api";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, ShieldCheck, Factory, Truck, Leaf, Globe, Clock, Star, Award, BadgeCheck,
  PackageCheck, Package, Heart, Zap, Users, CheckCircle2, Quote, BarChart3, Play, LayoutGrid,
  Recycle, Wind, Sprout,
};
const Icon = ({ name, className }: { name?: string; className?: string }) => {
  const C = ICONS[name || ""] || Sparkles;
  return <C className={className} />;
};

const STOREFRONT = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const toUrl = (src?: string): string => {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  return `${STOREFRONT}${src.startsWith("/") ? "" : "/"}${src}`;
};

const str = (v: any): string => (v === undefined || v === null ? "" : String(v));
const imgList = (v: any): string[] =>
  Array.isArray(v) ? v.map((x) => (typeof x === "string" ? x : x?.src)).filter(Boolean) : [];

export interface BlockDesign {
  background?: string;
  paddingY?: number;
  maxWidth?: "boxed" | "full";
  textAlign?: "left" | "center";
}

export const BlockShell: React.FC<{ design?: BlockDesign; children: React.ReactNode; id?: string }> = ({ design = {}, children, id }) => (
  <section
    id={id}
    style={{ backgroundColor: design.background || undefined, paddingTop: design.paddingY ?? 64, paddingBottom: design.paddingY ?? 64 }}
    className="w-full"
  >
    <div className={design.maxWidth === "full" ? "w-full px-4 sm:px-8" : "max-w-9xl mx-auto px-4 sm:px-6 lg:px-8"} style={{ textAlign: design.textAlign || "left" }}>
      {children}
    </div>
  </section>
);

export const HeadingBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => {
  const level = props.level || "h2";
  const size = level === "h1" ? "text-4xl md:text-5xl" : level === "h3" ? "text-xl md:text-2xl" : "text-3xl md:text-4xl";
  const Tag = level as any;
  return (
    <BlockShell design={design}>
      <Tag className={`font-bold text-[#1A1A1A] tracking-tight ${size}`}>{str(props.text)}</Tag>
    </BlockShell>
  );
};

export const TextBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => (
  <BlockShell design={design}>
    <p className={`text-gray-600 leading-relaxed ${props.size === "sm" ? "text-sm" : props.size === "lg" ? "text-lg" : "text-base"}`}>
      {str(props.text)}
    </p>
  </BlockShell>
);

export const RichTextBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => (
  <BlockShell design={design}>
    <div className="article-content max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(str(props.html)) }} />
  </BlockShell>
);

export const ImageBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => (
  <BlockShell design={design}>
    <figure>
      {props.src && (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
          <Image src={toUrl(props.src)} alt={str(props.alt)} fill className="object-cover" sizes="100vw" />
        </div>
      )}
      {props.caption && <figcaption className="mt-2 text-xs text-gray-400 text-center">{str(props.caption)}</figcaption>}
    </figure>
  </BlockShell>
);

export const GalleryBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => {
  const cols = props.columns === "2" ? "sm:grid-cols-2" : props.columns === "4" ? "sm:grid-cols-4" : "sm:grid-cols-3";
  return (
    <BlockShell design={design}>
      <div className={`grid grid-cols-1 ${cols} gap-4`}>
        {imgList(props.images).map((src, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
            <Image src={toUrl(src)} alt="" fill className="object-cover" sizes="33vw" />
          </div>
        ))}
      </div>
    </BlockShell>
  );
};

export const VideoBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) =>
  props.src ? (
    <BlockShell design={design}>
      <video src={toUrl(props.src)} poster={props.poster ? toUrl(props.poster) : undefined} autoPlay muted loop playsInline className="w-full rounded-2xl" />
    </BlockShell>
  ) : null;

export const CardsBlock: React.FC<{ props: any; design?: BlockDesign; variant?: "feature" | "custom" }> = ({ props, design }) => {
  const cols = props.columns === "2" ? "sm:grid-cols-2" : props.columns === "4" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <BlockShell design={design}>
      {props.heading && <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-10 tracking-tight">{str(props.heading)}</h2>}
      <div className={`grid grid-cols-1 ${cols} gap-6`}>
        {(props.cards || []).map((c: any, i: number) => (
          <div key={i} className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFFDF5] border border-[#F3E8C1]">
              <Icon name={c?.icon} className="h-6 w-6 text-[#C9A227]" />
            </span>
            <h3 className="text-lg font-bold text-[#1A1A1A]">{str(c?.title)}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{str(c?.description)}</p>
          </div>
        ))}
      </div>
    </BlockShell>
  );
};

export const StatsBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => (
  <BlockShell design={design}>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {(props.stats || []).map((s: any, i: number) => (
        <div key={i} className="text-center">
          <div className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A]">{str(s?.value)}</div>
          <div className="mt-1 text-xs font-medium text-gray-500">{str(s?.label)}</div>
        </div>
      ))}
    </div>
  </BlockShell>
);

export const TimelineBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => (
  <BlockShell design={design}>
    {props.heading && <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8 tracking-tight">{str(props.heading)}</h2>}
    <div className="space-y-5 border-l-2 border-[#C9A227]/30 pl-6">
      {(props.items || []).map((it: any, i: number) => (
        <div key={i} className="relative">
          <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-[#C9A227]" />
          <h3 className="font-bold text-[#1A1A1A]">{str(it?.title)}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{str(it?.description)}</p>
        </div>
      ))}
    </div>
  </BlockShell>
);

export const TestimonialsBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => (
  <BlockShell design={design}>
    {props.heading && <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-10 tracking-tight">{str(props.heading)}</h2>}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {(props.items || []).map((t: any, i: number) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <Quote className="h-5 w-5 text-[#C9A227] mb-3" />
          <p className="text-sm text-gray-600 italic mb-4">“{str(t?.quote)}”</p>
          <div className="text-xs font-bold text-[#1A1A1A]">{str(t?.name)}</div>
          <div className="text-[11px] text-gray-400">{str(t?.role)}</div>
        </div>
      ))}
    </div>
  </BlockShell>
);

export const BadgesBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => (
  <BlockShell design={design}>
    {props.heading && <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8 tracking-tight">{str(props.heading)}</h2>}
    <div className="flex flex-wrap gap-3">
      {(props.items || []).map((b: any, i: number) => (
        <span key={i} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] shadow-sm">
          <BadgeCheck className="h-4 w-4 text-[#C9A227]" /> {str(b?.value)}
        </span>
      ))}
    </div>
  </BlockShell>
);

export const CTABlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => (
  <BlockShell design={design}>
    <div className="rounded-3xl bg-[#1A1A1A] text-white p-10 md:p-14 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-3">{str(props.heading)}</h2>
      <p className="text-white/70 mb-7 max-w-2xl mx-auto">{str(props.text)}</p>
      {props.buttonText && (
        <Link href={str(props.buttonLink) || "/contact"} className="inline-flex items-center gap-2 rounded-full bg-[#C9A227] text-black px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors">
          {str(props.buttonText)} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  </BlockShell>
);

export const FAQBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => (
  <BlockShell design={design}>
    {props.heading && <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8 tracking-tight">{str(props.heading)}</h2>}
    <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
      {(props.items || []).map((q: any, i: number) => (
        <details key={i} className="group p-5 bg-white">
          <summary className="font-bold text-[#1A1A1A] cursor-pointer list-none flex items-center justify-between">
            {str(q?.question)} <span className="text-[#C9A227] group-open:rotate-45 transition-transform">+</span>
          </summary>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">{str(q?.answer)}</p>
        </details>
      ))}
    </div>
  </BlockShell>
);

export const SpacerBlock: React.FC<{ props: any }> = ({ props }) => <div style={{ height: Number(props.height) || 64 }} aria-hidden />;
export const DividerBlock: React.FC<{ props: any }> = ({ props }) => (
  <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
    <hr style={{ borderTopStyle: props.style || "solid" }} className="border-gray-200" />
  </div>
);

export const SplitHeroBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => (
  <BlockShell design={design}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4 tracking-tight">{str(props.heading)}</h2>
        <p className="text-gray-600 leading-relaxed mb-6">{str(props.body)}</p>
        {props.buttonText && (
          <Link href={str(props.buttonLink) || "/contact"} className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] text-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#C9A227] transition-colors">
            {str(props.buttonText)} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {props.image && (
        <div className="relative w-full h-72 lg:h-96 rounded-2xl overflow-hidden">
          <Image src={toUrl(props.image)} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
        </div>
      )}
    </div>
  </BlockShell>
);

export const BannerBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => (
  <BlockShell design={design}>
    <div className="relative min-h-[320px] rounded-3xl overflow-hidden flex items-center justify-center text-center">
      {props.image ? (
        <>
          <Image src={toUrl(props.image)} alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/45" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[#0F172A]" />
      )}
      <div className="relative z-10 px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">{str(props.heading)}</h2>
        <p className="text-gray-200 max-w-xl mx-auto">{str(props.subheading)}</p>
      </div>
    </div>
  </BlockShell>
);

export const TextImageBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => {
  const imageLeft = props.imageSide === "left";
  return (
    <BlockShell design={design}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className={imageLeft ? "lg:order-2" : ""}>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4 tracking-tight">{str(props.heading)}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{str(props.text)}</p>
          {props.buttonText && (
            <Link href={str(props.buttonLink) || "/contact"} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0D9488]">
              {str(props.buttonText)} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        {props.image && (
          <div className={`relative w-full h-72 lg:h-96 rounded-2xl overflow-hidden ${imageLeft ? "lg:order-1" : ""}`}>
            <Image src={toUrl(props.image)} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
          </div>
        )}
      </div>
    </BlockShell>
  );
};

export const ProductsBlock: React.FC<{ props: any; design?: BlockDesign }> = ({ props, design }) => {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    fetch(`${getApiBase()}/api/products`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!active || !d) return;
        let list = d?.data?.products || [];
        if (props.category) list = list.filter((p: any) => p.category === props.category);
        setProducts(list.slice(0, Number(props.limit) || 4));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [props.category, props.limit]);

  return (
    <BlockShell design={design}>
      {props.heading && <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-10 tracking-tight">{str(props.heading)}</h2>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <Link key={p._id} href={`/products/${p.slug || p._id}`} className="group flex flex-col">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#FAFAFA] mb-3">
              {p.imgPrimary && <Image src={toUrl(p.imgPrimary)} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="25vw" />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">{p.category}</span>
            <h3 className="text-sm font-semibold text-[#1A1A1A] line-clamp-2 group-hover:text-[#C9A227] transition-colors">{p.name}</h3>
          </Link>
        ))}
      </div>
    </BlockShell>
  );
};
