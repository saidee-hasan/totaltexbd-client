"use client";

import React, { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Heart, ShoppingBag, X, SlidersHorizontal, Check, AlertCircle } from "lucide-react";
import { getApiBase } from "@/lib/api";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import type { ProductColor, ProductRecord } from "@/lib/api";

const WISHLIST_KEY = "ta_wishlist";

const wishlistListeners = new Set<() => void>();
const emitWishlist = () => wishlistListeners.forEach((listener) => listener());
const subscribeWishlist = (listener: () => void) => {
  wishlistListeners.add(listener);
  return () => {
    wishlistListeners.delete(listener);
  };
};

const readWishlist = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const isInWishlist = (id: string | undefined): boolean =>
  Boolean(id) && readWishlist().includes(id as string);

const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const isRecentlyAdded = (createdAt?: string): boolean => {
  if (!createdAt) return false;
  const time = new Date(createdAt).getTime();
  return Number.isFinite(time) && Date.now() - time < NEW_WINDOW_MS;
};

interface CategoryMeta {
  name: string;
  h1Title?: string;
  description?: string;
  longDescription?: string;
}

// Default catalog content shown for "All Categories".
const DEFAULT_CATALOG = {
  h1: "Collection",
  short:
    "Explore our full range of premium apparel manufacturing — knitwear, outerwear and precision streetwear blanks crafted for global brands.",
  long:
    "Total Apparel is a full-service apparel manufacturer and exporter based in Dhaka, Bangladesh. From fabric development and sampling to bulk production and global logistics, we deliver world-class ready-made garments for fashion brands, buying houses and independent labels worldwide.",
};

const hasHtmlTags = (value?: string): boolean => Boolean(value && /<[a-z][\s\S]*>/i.test(value));

// Normalize a category name so "Mens Clothing", "Men's Clothing" and "men's
// clothing" all resolve to the same key when matching product categories
// against admin-managed category metadata.
const normalizeKey = (value?: string): string =>
  (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const ProductCard = ({ product }: { product: ProductRecord }) => {
  const primaryImage = product.imgPrimary?.trim();
  const secondaryImage = product.imgSecondary?.trim();
  const router = useRouter();
  const productId = product._id;
  const handle = product.slug?.trim() || productId;
  const href = handle ? `/products/${handle}` : "/products";
  const isFeatured = Boolean(product.featured);
  const isOutOfStock = product.inStock === false || product.stockStatus === "out-of-stock";
  const isNew = isRecentlyAdded(product.createdAt);
  const isSaved = useSyncExternalStore(
    subscribeWishlist,
    () => isInWishlist(productId),
    () => false
  );

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const toggleSave = (e: React.MouseEvent) => {
    stop(e);
    if (!productId) return;
    const current = readWishlist();
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    } catch {
      // storage may be unavailable (private mode) — keep the UI responsive
    }
    emitWishlist();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col h-full bg-white rounded-lg p-1.5 sm:p-2 hover:shadow-md transition-shadow duration-300"
    >
      {/* Image Area */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-[#F3F4F6] mb-2.5 sm:mb-4 overflow-hidden rounded-md sm:rounded-lg shadow-2xs transition-shadow duration-500 group-hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.12)]">
        <Link href={href} className="absolute inset-0 z-0" aria-label={`View ${product.name}`}>
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className={`object-cover saturate-125 transition-all duration-700 ${
                secondaryImage ? "group-hover:scale-110 group-hover:opacity-0" : "group-hover:scale-105"
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} Alternate`}
              fill
              className="object-cover saturate-125 absolute inset-0 opacity-0 transition-all duration-700 scale-105 group-hover:scale-110 group-hover:opacity-100"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </Link>

        {/* Subtle vignette overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Badges Top Left */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {isOutOfStock && (
            <span className="bg-red-600 text-white text-[10px] sm:text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase shadow-xs">
              Custom Order
            </span>
          )}
          {isNew && !isOutOfStock && (
            <span className="bg-[#1A1A1A] text-white text-[10px] sm:text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase shadow-xs">
              New
            </span>
          )}
          {isFeatured && (
            <span className="bg-[#C9A227] text-white text-[10px] sm:text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Action Buttons Right */}
        <div className="absolute right-1.5 top-1.5 sm:right-2.5 sm:top-2.5 flex flex-col gap-1 z-20 opacity-90 sm:opacity-0 sm:translate-x-8 sm:group-hover:translate-x-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-x-0 sm:group-focus-within:opacity-100 transition-all duration-300">
          <button
            type="button"
            onClick={toggleSave}
            aria-label={isSaved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
            aria-pressed={isSaved}
            className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 bg-white/95 backdrop-blur-md rounded-full shadow-xs flex items-center justify-center text-[#1A1A1A] hover:text-white hover:bg-[#1A1A1A] transition-all duration-200 cursor-pointer"
          >
            <Heart className={`w-3 h-3 ${isSaved ? "fill-[#C9A227] text-[#C9A227]" : ""}`} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              stop(e);
              router.push("/contact");
            }}
            aria-label={`Request a quote for ${product.name}`}
            className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 bg-white/95 backdrop-blur-md rounded-full shadow-xs flex items-center justify-center text-[#1A1A1A] hover:text-white hover:bg-[#C9A227] transition-all duration-200 cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <Link href={href} className="flex flex-col px-0.5 sm:px-1 outline-none">
        <div className="flex items-center justify-between mb-1 gap-1">
          <p className="text-[10px] sm:text-[11px] font-bold text-[#C9A227] uppercase tracking-wider truncate">
            {product.category}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? "bg-red-400" : "bg-emerald-500"}`} />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-tight text-gray-500">
              {isOutOfStock ? "Order" : "Stock"}
            </span>
          </div>
        </div>

        <h3 className="text-xs sm:text-sm font-semibold text-[#1A1A1A] mb-1 line-clamp-1 group-hover:text-[#C9A227] transition-colors duration-200 leading-snug">
          {product.name}
        </h3>
      </Link>
    </motion.div>
  );
};

interface FilterSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, open, onToggle, children }) => (
  <div className="border-t border-gray-100 pt-5">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-800 hover:text-black transition-colors cursor-pointer"
    >
      {title}
      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="pt-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function ProductGrid({ initialCategory = "All Categories" }: { initialCategory?: string }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") || "";
  const resolvedInitialCategory = categoryParam || initialCategory;

  // The category is URL-driven (`?category=`), so a filtered catalog view has
  // its own shareable / SEO-friendly link. Falls back to the page default.
  const activeCategory = resolvedInitialCategory;
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [activeColor, setActiveColor] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [openCategories, setOpenCategories] = useState(true);
  const [openSubCategories, setOpenSubCategories] = useState(true);
  const [openColors, setOpenColors] = useState(true);
  const [showAllSubs, setShowAllSubs] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  // True only after hydration — lets us portal the mobile filter drawer on the
  // client without a setState-in-effect.
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const ITEMS_PER_PAGE = 16;
  const router = useRouter();
  const pathname = usePathname();
  const pageParam = Number(searchParams?.get("page") || "1");
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;

  // URL-driven pagination so every page has its own shareable, SEO-friendly URL
  // (e.g. /products?page=2). Changing the page only rewrites the query string.
  const setCurrentPage = (next: number) => {
    const params = new URLSearchParams(Array.from(searchParams?.entries() || []));
    if (next <= 1) params.delete("page");
    else params.set("page", String(next));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Category is also URL-driven so the filter is shareable and SEO-friendly.
  const setActiveCategory = (name: string) => {
    const params = new URLSearchParams(Array.from(searchParams?.entries() || []));
    if (!name || name === "All Categories") params.delete("category");
    else params.set("category", name);
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setActiveSubCategory("All");
  };
  const [dbProducts, setDbProducts] = useState<ProductRecord[]>([]);
  const [categoryMeta, setCategoryMeta] = useState<Record<string, CategoryMeta>>({});
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  // Prevent background scroll when mobile filter is open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  // Load category metadata (H1, short description, bottom SEO description).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/categories`, { cache: "no-cache" });
        if (!res.ok) return;
        const data = await res.json();
        const items: CategoryMeta[] = data?.data?.items || data?.data || [];
        if (active && Array.isArray(items)) {
          const map: Record<string, CategoryMeta> = {};
          items.forEach((c) => {
            if (c?.name) map[normalizeKey(c.name)] = c;
          });
          setCategoryMeta(map);
        }
      } catch (err) {
        console.error("Failed to fetch category metadata", err);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/products`, { cache: "no-cache" });
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          if (active && data.success) {
            setDbProducts(data.data.products || data.data || []);
            setLoadError(false);
            return;
          }
        }
        if (active) setLoadError(true);
      } catch (error) {
        console.error("Failed to fetch products", error);
        if (active) setLoadError(true);
      } finally {
        if (active) setIsLoadingProducts(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [reloadToken]);

  const handleRetry = () => {
    setLoadError(false);
    setIsLoadingProducts(true);
    setReloadToken((t) => t + 1);
  };

  const categoryOptions = useMemo(() => {
    const map = new Map<string, number>();
    dbProducts.forEach((p) => {
      if (!p.category) return;
      map.set(p.category, (map.get(p.category) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [dbProducts]);

  const subCategoryOptions = useMemo(() => {
    const map = new Map<string, number>();
    const normCategory = normalizeKey(activeCategory);
    dbProducts.forEach((p) => {
      if (!p.subCategory) return;
      // Only offer sub-categories that belong to the currently selected category.
      if (activeCategory !== "All Categories" && normalizeKey(p.category) !== normCategory) return;
      map.set(p.subCategory, (map.get(p.subCategory) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [dbProducts, activeCategory]);

  const colorOptions = useMemo(() => {
    const map = new Map<string, string>();
    dbProducts.forEach((p) =>
      (p.colors || []).forEach((c: ProductColor) => {
        if (c?.name) map.set(c.name, c.hex || "#000000");
      })
    );
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [dbProducts]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const normCategory = normalizeKey(activeCategory);
    return dbProducts.filter((p) => {
      const matchCategory =
        activeCategory === "All Categories" ||
        normalizeKey(p.category) === normCategory;
      const matchSub = activeSubCategory === "All" || p.subCategory === activeSubCategory;
      const matchColor = activeColor === "All" || (p.colors || []).some((c) => c.name === activeColor);
      const haystack = [p.name, p.sku, p.category, p.subCategory, p.brand, p.shortDescription, p.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchSearch = !query || haystack.includes(query);
      return matchCategory && matchSub && matchColor && matchSearch;
    });
  }, [activeCategory, activeSubCategory, activeColor, searchQuery, dbProducts]);

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    if (sortBy === "name-asc") arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name-desc") arr.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === "featured") arr.sort((a, b) => Number(b.featured) - Number(a.featured));
    else arr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return arr;
  }, [filteredProducts, sortBy]);

  const hasActiveFilters =
    activeCategory !== 'All Categories' || activeSubCategory !== 'All' || activeColor !== 'All' || !!searchQuery;
  const activeFilterCount =
    (activeCategory !== 'All Categories' ? 1 : 0) +
    (activeSubCategory !== 'All' ? 1 : 0) +
    (activeColor !== 'All' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Category-driven SEO content. Falls back to default catalog content for
  // "All Categories". H1 = admin H1 title (or category name), Short = category
  // description, Bottom = category long description.
  const isAllCategories = activeCategory === 'All Categories';
  const activeCategoryMeta = isAllCategories ? undefined : categoryMeta[normalizeKey(activeCategory)];
  const seoHeading = isAllCategories
    ? DEFAULT_CATALOG.h1
    : activeCategoryMeta?.h1Title?.trim() || activeCategory;
  const seoShortDescription = isAllCategories
    ? DEFAULT_CATALOG.short
    : activeCategoryMeta?.description?.trim() || '';
  const seoBottomDescription = isAllCategories
    ? DEFAULT_CATALOG.long
    : activeCategoryMeta?.longDescription?.trim() || '';

  const handleClearAll = () => {
    setActiveCategory("All Categories");
    setActiveSubCategory("All");
    setActiveColor("All");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, safePage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const target = document.getElementById("catalog-grid-top");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safePage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (safePage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(safePage - 1);
        pages.push(safePage);
        pages.push(safePage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const chip = (label: string, onRemove: () => void) => (
    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700 shadow-2xs">
      {label}
      <button type="button" onClick={onRemove} className="text-gray-400 hover:text-black cursor-pointer" aria-label={`Remove ${label}`}>
        <X className="w-3 h-3" />
      </button>
    </span>
  );

  const renderFilterBody = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search name, SKU, brand..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-8.5 pr-3 py-2 text-xs text-black outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/15 font-medium"
        />
      </div>

      {/* Categories */}
      <FilterSection title="Categories" open={openCategories} onToggle={() => setOpenCategories((v) => !v)}>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setActiveCategory('All Categories')}
            className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer ${
              activeCategory === 'All Categories' ? 'bg-[#C9A227]/10 text-[#C9A227] font-bold' : 'text-gray-600 hover:bg-gray-50 font-medium'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categoryOptions.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(cat.name)}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer ${
                  isActive ? 'bg-[#C9A227]/10 text-[#C9A227] font-bold' : 'text-gray-600 hover:bg-gray-50 font-medium'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {isActive && <Check className="w-3.5 h-3.5 shrink-0" />}
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Sub-categories */}
      <FilterSection title="Sub-categories" open={openSubCategories} onToggle={() => setOpenSubCategories((v) => !v)}>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => { setActiveSubCategory('All'); setCurrentPage(1); }}
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
              activeSubCategory === 'All'
                ? 'border-black bg-black text-white shadow-2xs'
                : 'border-gray-200 bg-white text-gray-600 hover:border-[#C9A227] hover:text-[#C9A227]'
            }`}
          >
            All
          </button>
          {(showAllSubs ? subCategoryOptions : subCategoryOptions.slice(0, 8)).map((sub) => {
            const isActive = activeSubCategory === sub.name;
            return (
              <button
                key={sub.name}
                type="button"
                onClick={() => { setActiveSubCategory(sub.name); setCurrentPage(1); }}
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'border-black bg-black text-white shadow-2xs'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#C9A227] hover:text-[#C9A227]'
                }`}
              >
                {sub.name}
              </button>
            );
          })}
          {subCategoryOptions.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllSubs((v) => !v)}
              className="rounded-full border border-dashed border-[#C9A227] bg-[#C9A227]/5 px-3 py-1 text-[11px] font-bold text-[#C9A227] hover:bg-[#C9A227]/10 transition-colors cursor-pointer"
            >
              {showAllSubs ? 'Show less' : `+${subCategoryOptions.length - 8} more`}
            </button>
          )}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Colors" open={openColors} onToggle={() => setOpenColors((v) => !v)}>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => { setActiveColor('All'); setCurrentPage(1); }}
            className={`h-7 rounded-lg border px-2.5 text-[11px] font-semibold transition-colors cursor-pointer ${
              activeColor === 'All' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-[#C9A227]'
            }`}
          >
            All
          </button>
          {colorOptions.map((color) => {
            const isActive = activeColor === color.name;
            return (
              <button
                key={color.name}
                type="button"
                title={color.name}
                onClick={() => { setActiveColor(isActive ? 'All' : color.name); setCurrentPage(1); }}
                className={`relative h-7 w-7 rounded-full border transition-all cursor-pointer ${
                  isActive ? 'ring-2 ring-[#C9A227] ring-offset-2 border-transparent' : 'border-gray-200 hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {isActive && (
                  <Check className={`w-3.5 h-3.5 absolute inset-0 m-auto ${color.name.toLowerCase().includes('white') ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <section className="w-full bg-[#FAFAFA] sm:bg-white py-2 sm:py-6 lg:py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-[#C9A227] selection:text-white">
      <div id="catalog-grid-top" className="max-w-9xl mx-auto scroll-mt-28">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-8 xl:gap-12 items-start">

          {/* DESKTOP SIDEBAR */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block w-[260px] flex-shrink-0 sticky top-24 self-start z-30"
          >
            <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs flex flex-col max-h-[calc(100vh-7.5rem)]">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-6.5 h-6.5 rounded-lg bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227]">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 tracking-tight">Filters</h3>
                    <p className="text-[9.5px] text-gray-400 font-medium">Refine catalog</p>
                  </div>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="text-[10px] font-bold uppercase tracking-wider text-[#C9A227] hover:text-black transition-colors cursor-pointer px-2 py-0.5 rounded bg-[#C9A227]/10 hover:bg-gray-100"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="pt-3 overflow-y-auto pr-1 min-h-0 flex-1 custom-scrollbar">
                {renderFilterBody()}
              </div>
            </div>
          </motion.aside>

          {/* MOBILE FILTER DRAWER (Rendered via Portal to escape parent stacking context) */}
          {isMounted && typeof document !== "undefined" && createPortal(
            <AnimatePresence>
              {mobileFiltersOpen && (
                <div className="fixed inset-0 z-[9999] lg:hidden">
                  {/* Backdrop */}
                  <motion.div
                    key="filter-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setMobileFiltersOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9998]"
                  />

                  {/* Slide-over sheet */}
                  <motion.div
                    key="filter-drawer"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 28, stiffness: 280 }}
                    className="relative z-[9999] w-[88vw] max-w-sm h-full bg-white shadow-2xl flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 pt-[max(0.875rem,env(safe-area-inset-top))] border-b border-gray-100 bg-white shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227]">
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-gray-900">Filters</h3>
                          <p className="text-[9.5px] text-gray-400 font-medium">
                            {activeFilterCount > 0 ? `${activeFilterCount} active filters` : 'Refine catalog'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                          <button
                            type="button"
                            onClick={handleClearAll}
                            className="text-[10px] font-bold uppercase tracking-wider text-[#C9A227] hover:text-black px-2 py-0.5 rounded bg-[#C9A227]/10"
                          >
                            Reset
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setMobileFiltersOpen(false)}
                          aria-label="Close filters"
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
                      {renderFilterBody()}
                    </div>

                    {/* Sticky Footer */}
                    <div className="p-3 border-t border-gray-100 bg-white shrink-0 flex gap-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleClearAll}
                          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setMobileFiltersOpen(false);
                          const target = document.getElementById("catalog-grid-top");
                          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="flex-2 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#C9A227] text-white text-[11px] font-bold uppercase tracking-wider transition-colors shadow-md text-center cursor-pointer"
                      >
                        Show {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )}

          {/* RIGHT MAIN CONTENT */}
          <motion.main
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="w-full lg:w-[calc(100%-260px)] flex flex-col min-w-0"
          >
            {/* Mobile Sticky Filter Trigger Bar */}
            <div className="lg:hidden sticky top-[64px] z-30 bg-white/95 backdrop-blur-md py-1.5 px-0.5 mb-2.5 border-b border-gray-100 shadow-2xs">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                aria-expanded={mobileFiltersOpen}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-black shadow-2xs hover:border-[#C9A227] transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span className="font-bold text-gray-900 text-xs">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-1 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#C9A227] px-1.5 text-[10px] font-bold text-white shadow-2xs">
                      {activeFilterCount}
                    </span>
                  )}
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'item' : 'items'}
                </span>
              </button>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3 pb-2 sm:pb-4 mb-2.5 sm:mb-4 border-b border-gray-100">
              <div>
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-0.5 sm:mb-1">
                  {isAllCategories ? 'Product Catalog' : 'Category'}
                </p>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-black">
                  {seoHeading}
                </h2>
                {seoShortDescription && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl leading-relaxed">
                    {seoShortDescription}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-semibold text-black">{sortedProducts.length}</span>{' '}
                  {sortedProducts.length === 1 ? 'product' : 'products'}
                  {totalPages > 1 && (
                    <span className="ml-2 text-gray-400 font-normal">
                      · Page {safePage} of {totalPages}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Sort by</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-2.5 pr-7 text-xs font-semibold text-black outline-none cursor-pointer transition-colors focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="featured">Featured First</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>
            </div>

            {/* Active filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                {activeCategory !== 'All Categories' && chip(activeCategory, () => setActiveCategory('All Categories'))}
                {activeSubCategory !== 'All' && chip(activeSubCategory, () => { setActiveSubCategory('All'); setCurrentPage(1); })}
                {activeColor !== 'All' && chip(`Color: ${activeColor}`, () => { setActiveColor('All'); setCurrentPage(1); })}
                {searchQuery && chip(`“${searchQuery}”`, () => { setSearchQuery(''); setCurrentPage(1); })}
              </div>
            )}

            {/* Product grid */}
            <div className="flex-1 min-h-[400px] relative">
              {isLoadingProducts ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-lg p-2">
                      <div className="aspect-[3/4] sm:aspect-[4/5] w-full rounded-md bg-gray-100" />
                      <div className="mt-3 h-2.5 w-16 rounded bg-gray-100" />
                      <div className="mt-2 h-3.5 w-3/4 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              ) : loadError ? (
                <div className="py-24 text-center flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-[#FAFAFA]">
                  <AlertCircle className="w-10 h-10 text-[#C9A227] mb-5" />
                  <h3 className="text-2xl font-bold text-black mb-3">Unable to load products</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
                    We couldn&apos;t reach the catalog right now. Please check your connection and try again.
                  </p>
                  <button
                    onClick={handleRetry}
                    className="rounded-full bg-black px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#C9A227] cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              ) : (
              <motion.div
                layout
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id || product.sku} product={product} />
                  ))}

                  {sortedProducts.length === 0 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="col-span-full py-24 text-center flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-[#FAFAFA]"
                    >
                      <Search className="w-10 h-10 text-[#C9A227] mb-5" />
                      <h3 className="text-2xl font-bold text-black mb-3">No products found</h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
                        We couldn&apos;t find any products matching your current filters. Try adjusting your search.
                      </p>
                      <button
                        onClick={handleClearAll}
                        className="rounded-full bg-black px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#C9A227] cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              )}

              {/* Numbered Pagination Controls */}
              {!isLoadingProducts && !loadError && totalPages > 1 && (
                <div id="catalog-pagination" className="w-full mt-8 pt-5 sm:pt-6 border-t border-gray-100 flex justify-center">
                  {/* Number buttons */}
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
                    {/* Prev */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(safePage - 1)}
                      disabled={safePage === 1}
                      className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-gray-200 bg-white text-[11px] font-bold uppercase tracking-wider text-gray-700 transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Pages */}
                    {getPageNumbers().map((p, idx) => {
                      if (p === "...") {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-1 text-[11px] text-gray-400 select-none">
                            ...
                          </span>
                        );
                      }
                      const isCurrent = p === safePage;
                      return (
                        <button
                          key={`page-${p}`}
                          type="button"
                          onClick={() => handlePageChange(p as number)}
                          className={`min-w-[28px] sm:min-w-[32px] h-[28px] sm:h-[32px] rounded-lg text-[11px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                            isCurrent
                              ? "bg-[#1A1A1A] text-white shadow-xs ring-1 ring-black"
                              : "bg-white border border-gray-200 text-gray-700 hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    {/* Next */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(safePage + 1)}
                      disabled={safePage === totalPages}
                      className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-gray-200 bg-white text-[11px] font-bold uppercase tracking-wider text-gray-700 transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      aria-label="Next Page"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom SEO description — category-specific, shown after all product cards */}
            {seoBottomDescription && (
              <section className="mt-10 border-t border-gray-100 pt-6">
                <h3 className="text-sm sm:text-base font-bold tracking-tight text-black mb-2">
                  {isAllCategories ? 'About Our Catalog' : `About ${activeCategory}`}
                </h3>
                {hasHtmlTags(seoBottomDescription) ? (
                  <div
                    className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed text-gray-600 font-normal"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(seoBottomDescription) }}
                  />
                ) : (
                  <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-gray-600 font-normal max-w-3xl">
                    {seoBottomDescription}
                  </p>
                )}
              </section>
            )}
          </motion.main>
        </div>
      </div>
    </section>
  );
}
