import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Tag,
  Newspaper,
  BookOpen,
} from 'lucide-react';
import type { NewsRecord } from '@/lib/api';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import BackToTopButton from '@/components/BackToTopButton';
import NewsReadingProgress from '@/components/news/NewsReadingProgress';
import ShareButtons from '@/components/news/ShareButtons';
import type { Metadata } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getArticle(id: string): Promise<NewsRecord | null> {
  try {
    const res = await fetch(`${apiUrl}/api/news/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data.data) return data.data as NewsRecord;
    }
  } catch (err) {
    console.error('Failed to fetch news article from API:', err);
  }
  return null;
}

async function getArticles(): Promise<NewsRecord[]> {
  try {
    const res = await fetch(`${apiUrl}/api/news`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const items = data?.data?.items ?? data?.data ?? [];
      if (Array.isArray(items)) {
        return items as NewsRecord[];
      }
    }
  } catch (err) {
    console.error('Failed to fetch related news:', err);
  }
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.id);
  if (article) {
    return {
      title: `${article.title} | Total Apparel News`,
      description: article.excerpt || article.title,
      openGraph: {
        title: article.title,
        description: article.excerpt || '',
        images: article.image ? [{ url: article.image }] : [],
      },
    };
  }
  return {
    title: 'Article | Total Apparel',
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const articleId = resolvedParams.id;

  const [article, allArticles] = await Promise.all([getArticle(articleId), getArticles()]);

  if (!article) {
    notFound();
  }

  const otherArticles = allArticles.filter((a) => a._id !== article._id && a.slug !== article.slug);

  // 4 Related articles (same category preferred)
  const related = otherArticles
    .map((a) => ({ a, sameCategory: Boolean(a.category && article.category && a.category.toLowerCase() === article.category.toLowerCase()) ? 1 : 0 }))
    .sort((x, y) => y.sameCategory - x.sameCategory || (new Date(y.a.date || 0).getTime() - new Date(x.a.date || 0).getTime()))
    .slice(0, 4)
    .map((x) => x.a);

  // Ranked/all articles for sidebar card 2 (first 4 items)
  const rankedArticles = allArticles.slice(0, 4);

  const currentIndex = allArticles.findIndex((a) => a._id === article._id || a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const tags = (article.keywords || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);

  return (
    <main className="w-full min-h-screen bg-[#FBFBFB] selection:bg-orange-500 selection:text-white pb-20 sm:pb-28 overflow-x-hidden">
      <NewsReadingProgress />

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36">

        {/* Top Breadcrumb & Return Link (News instead of Blog) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-gray-200/80 mb-6 sm:mb-8">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0 font-medium">
            <Link href="/" className="hover:text-gray-900 transition-colors shrink-0">
              Home
            </Link>
            <span className="text-gray-400">&gt;</span>
            <Link href="/news" className="hover:text-gray-900 transition-colors shrink-0">
              News
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-800 font-medium truncate max-w-[240px] sm:max-w-md md:max-w-xl">
              {article.title}
            </span>
          </nav>

          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </Link>
        </div>

        {/* 2-Column Editorial Grid: Content on Left (8 cols), Sidebar on Right (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left Column: Main Article */}
          <article className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-7 md:p-8 shadow-xs">

            {/* Big Hero Image Banner */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-xs mb-6">
              {article.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-8">
                  <Newspaper className="w-16 h-16 mb-2" />
                  <p className="text-xs uppercase tracking-wider">Total Apparel Journal</p>
                </div>
              )}
            </div>

            {/* Meta Line: Category badge + Date + Read Time */}
            <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
              {article.category && (
                <span className="px-2.5 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-200/60 font-bold text-[10px] uppercase tracking-wider">
                  {article.category}
                </span>
              )}
              {article.date && (
                <span className="inline-flex items-center gap-1 text-gray-500 font-medium text-[11px]">
                  <CalendarDays className="w-3.5 h-3.5 text-orange-500" />
                  {article.date}
                </span>
              )}
              {article.date && article.readTime && <span className="text-gray-300">•</span>}
              {article.readTime && (
                <span className="inline-flex items-center gap-1 text-gray-500 font-medium text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  {article.readTime}
                </span>
              )}
            </div>

            {/* Main Article Title - compact, clean and balanced font size */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold text-gray-900 leading-snug tracking-tight mb-3">
              {article.title}
            </h1>

            {/* Lead Subtitle / Excerpt */}
            {article.excerpt && (
              <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed mb-5 font-normal">
                {article.excerpt}
              </p>
            )}

            <div className="border-t border-gray-100 my-5" />

            {/* Full Body HTML Content */}
            {article.content ? (
              <div
                className="article-content leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
              />
            ) : (
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
                The full story is currently being compiled. Explore more insights from our apparel manufacturing floor below.
              </p>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mr-1">
                  <Tag className="w-3 h-3" /> Tags:
                </span>
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700 hover:border-orange-500 transition-colors"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Author Footer & Share */}
            <div className="mt-8 rounded-2xl border border-gray-100 bg-[#FAFAFA] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-full bg-gray-900 text-orange-400 font-black text-xs flex items-center justify-center shrink-0 border border-orange-500/30 shadow-xs">
                  TA
                </span>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">
                    {article.author || "Total Apparel Editorial Team"}
                  </h4>
                  <p className="text-[11px] text-gray-500">Official manufacturing & apparel insights</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Share:</span>
                <ShareButtons title={article.title} variant="light" />
              </div>
            </div>

            {/* Story Navigator: Previous / Next */}
            {(prevArticle || nextArticle) && (
              <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevArticle ? (
                  <Link
                    href={`/news/${prevArticle.slug || prevArticle._id}`}
                    className="group p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-orange-500/40 hover:shadow-xs transition-all text-left flex flex-col justify-between"
                  >
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-orange-500 transition-colors mb-1.5">
                      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Previous Story
                    </span>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {prevArticle.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
                {nextArticle && (
                  <Link
                    href={`/news/${nextArticle.slug || nextArticle._id}`}
                    className="group p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-orange-500/40 hover:shadow-xs transition-all text-right flex flex-col justify-between"
                  >
                    <span className="inline-flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-orange-500 transition-colors mb-1.5">
                      Next Story <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {nextArticle.title}
                    </p>
                  </Link>
                )}
              </div>
            )}
          </article>

          {/* Right Column: Sticky Sidebar (Cloned from Reference Image 2) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">

            {/* Card 1: Related Articles */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                  <h3 className="text-sm font-extrabold text-gray-900">
                    Related Articles
                  </h3>
                </div>
                <span className="text-xs font-medium text-gray-400">
                  {related.length} posts
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {related.map((item) => (
                  <Link
                    key={item._id}
                    href={`/news/${item.slug || item._id}`}
                    className="group flex gap-3.5 items-center py-3.5 first:pt-2 last:pb-0"
                  >
                    <div className="relative w-16 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                      {item.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <Newspaper className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.category && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-500 block">
                          {item.category}
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug mt-0.5">
                        {item.title}
                      </h4>
                      {item.date && (
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {item.date}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Card 2: All Articles (Ranked with 01, 02, 03... + Explore All Insights) */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-500 shrink-0" />
                  <h3 className="text-sm font-extrabold text-gray-900">
                    All Articles
                  </h3>
                </div>
                <Link
                  href="/news"
                  className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-0.5"
                >
                  View All &gt;
                </Link>
              </div>

              <div className="divide-y divide-gray-50">
                {rankedArticles.map((item, idx) => (
                  <Link
                    key={item._id}
                    href={`/news/${item.slug || item._id}`}
                    className="group flex gap-3 items-center py-3.5 first:pt-2 last:pb-0"
                  >
                    <span className="text-xs font-mono font-bold text-gray-300 w-5 text-center shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                      {item.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <Newspaper className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 mt-0.5 block font-medium">
                        {item.category || "General"} • {item.readTime || "5 min read"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href="/news"
                className="mt-5 w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200/90 bg-gray-50 py-2.5 text-xs font-bold text-gray-800 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <span>Explore All Insights</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </aside>
        </div>

        {/* Footer Return */}
        <div className="mt-12 pt-6 border-t border-gray-200/80 flex items-center justify-between text-xs font-semibold text-gray-500">
          <Link href="/news" className="inline-flex items-center gap-1.5 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to all articles
          </Link>
          <BackToTopButton />
        </div>
      </div>
    </main>
  );
}
