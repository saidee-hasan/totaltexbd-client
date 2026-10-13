"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Search, Newspaper, CalendarDays, X, User } from "lucide-react";
import { fetchSectionMap, getApiBase } from "@/lib/api";
import type { NewsRecord } from "@/lib/api";

interface NewsHeroContent {
  marqueeText?: string;
  readFullStoryText?: string;
  latestTitle?: string;
  latestDescription?: string;
  buttonText?: string;
  readArticleText?: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroContent, setHeroContent] = useState<NewsHeroContent>({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    fetchSectionMap().then((map) => {
      if (!active) return;
      setHeroContent({
        ...(map["news_hero"]?.content || {}),
        buttonText: map["news_hero"]?.buttonText,
      });
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/news`);
        if (res.ok) {
          const data = await res.json();
          const items = data?.data?.items ?? data?.data ?? data?.items ?? data;
          setArticles(Array.isArray(items) ? (items as NewsRecord[]) : []);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const categories = useMemo(() => {
    const counts: Record<string, number> = { All: articles.length };
    articles.forEach((a) => {
      if (a.category) {
        counts[a.category] = (counts[a.category] || 0) + 1;
      }
    });
    return Object.keys(counts).map((name) => ({
      name,
      count: counts[name],
    }));
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchCat =
        activeCategory === "All" ||
        (a.category || "").toLowerCase() === activeCategory.toLowerCase();
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.excerpt || "").toLowerCase().includes(q) ||
        (a.category || "").toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [articles, activeCategory, query]);

  const resetFilters = () => {
    setActiveCategory("All");
    setQuery("");
  };

  return (
    <main className="w-full min-h-screen bg-[#FBFBFB] relative selection:bg-orange-500 selection:text-white pb-20 sm:pb-28 overflow-x-hidden">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36">

        {/* Top Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-900 transition-colors font-medium">
            Home
          </Link>
          <span className="text-gray-400 font-medium">&gt;</span>
          <span className="text-gray-800 font-semibold">News</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-gray-200/80 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.25em] text-orange-500 mb-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              {heroContent.marqueeText || "News & Media"}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
              {heroContent.latestTitle || "Industry Insights & News"}
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              {heroContent.latestDescription ||
                "Expert manufacturing guides, sustainable fabric innovations, quality assurance protocols, and global supply chain updates."}
            </p>
          </div>
        </div>

        {/* Filter Bar: Category Tabs & Search Box */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex-nowrap md:flex-wrap">
            {categories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setActiveCategory(cat.name)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gray-900 text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="uppercase text-[11px] tracking-wider">{cat.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-xs font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 shadow-2xs"
            />
            {query.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4-Column Card Grid (Cloned from Reference Image 1) */}
        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs animate-pulse">
                  <div className="aspect-[4/3] bg-gray-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-28 bg-gray-100 rounded" />
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-4/5 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-2xs">
              <Search className="w-8 h-8 text-orange-500 mb-3" />
              <h3 className="text-base font-bold text-gray-900">No matching articles found</h3>
              <p className="text-xs text-gray-500 mt-1">Try another keyword or select &apos;All&apos; categories.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-500 transition-colors cursor-pointer shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredArticles.map((article, idx) => (
                  <motion.article
                    layout
                    key={article._id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(idx, 8) * 0.04 }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs hover:shadow-xl hover:border-gray-200 transition-all duration-300"
                  >
                    {/* Top Image Container */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                      {article.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                          <Newspaper className="w-10 h-10" />
                        </div>
                      )}

                      {/* White Badge on top-left of image */}
                      {article.category && (
                        <span className="absolute top-3 left-3 bg-white text-gray-900 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-xs tracking-wider z-10 select-none">
                          {article.category}
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      {/* Meta Line (Date • Read Time) */}
                      {(article.date || article.readTime) && (
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium mb-2">
                          {article.date && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                              <span>{article.date}</span>
                            </span>
                          )}
                          {article.date && article.readTime && (
                            <span className="text-gray-300">•</span>
                          )}
                          {article.readTime && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                              <span>{article.readTime}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-extrabold text-gray-900 line-clamp-2 leading-snug mb-2 group-hover:text-orange-500 transition-colors">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                          {article.excerpt}
                        </p>
                      )}

                      {/* Bottom Footer Row: Author on left, 'Read >' on right */}
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        {/* Author info with circular user icon */}
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200/80 flex items-center justify-center text-gray-500 shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                            {article.author || "Aaryan Sourcing"}
                          </span>
                        </div>

                        {/* Read link in orange */}
                        <span className="text-xs font-semibold text-orange-500 hover:text-orange-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Read &gt;
                        </span>
                      </div>
                    </div>

                    {/* Accessible full card click overlay */}
                    <Link
                      href={`/news/${article.slug || article._id}`}
                      className="absolute inset-0 z-20"
                      aria-label={article.title}
                    />
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
