export const getApiBase = (): string =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface SectionStat {
  label: string;
  value: string;
}

export interface SectionFeature {
  icon: string;
  title: string;
  description: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface SectionContent {
  [key: string]: unknown;
  headingLine1?: string;
  headingLine2?: string;
  videos?: string[];
  trustBadges?: string[];
  features?: SectionFeature[];
  highlights?: SectionFeature[];
  processes?: SectionFeature[];
  innovations?: SectionFeature[];
  tests?: SectionFeature[];
  stages?: SectionFeature[];
  timeline?: SectionFeature[];
  steps?: SectionFeature[];
  category?: string;
  categories?: string[];
  paragraphs?: string[];
  columns?: FooterColumn[];
  legalLinks?: { label: string; href: string }[];
  floatingBox?: { title?: string; description?: string };
  badgeText?: string;
  addressLabel?: string;
  address?: string;
  emailLabel?: string;
  email?: string;
  formTitle?: string;
  formSubtitle?: string;
  submitText?: string;
  successTitle?: string;
  successText?: string;
  successButton?: string;
  brandName?: string;
  brandDescription?: string;
  statValue?: string;
  statLabel?: string;
  statusText?: string;
  marqueeText?: string;
}

export interface SectionData {
  _id?: string;
  sectionKey?: string;
  sectionName?: string;
  category?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  images?: string[];
  badgeText?: string;
  buttonText?: string;
  buttonLink?: string;
  stats?: SectionStat[];
  content?: SectionContent;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductColor {
  name?: string;
  hex?: string;
}

export interface ProductSize {
  name?: string;
  inStock?: boolean;
}

export interface ProductRecord {
  _id?: string;
  name: string;
  sku?: string;
  price?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  imgPrimary?: string;
  imgSecondary?: string;
  galleryImages?: string[];
  imageAlt?: string;
  colors?: ProductColor[];
  sizes?: ProductSize[];
  gender?: string;
  material?: string;
  fit?: string;
  pattern?: string;
  sleeveType?: string;
  neckType?: string;
  stockStatus?: string;
  inStock?: boolean;
  featured?: boolean;
  createdAt?: string;
}

export type SectionRecord = SectionData;

// Dedupes simultaneous/near-simultaneous section requests (e.g. Navbar + Footer
// + page mounting together) so the same content is not fetched multiple times.
// The short TTL keeps content fresh after a reload without introducing stale data.
let sectionsCache: { promise: Promise<SectionData[]>; at: number } | null = null;
const SECTIONS_TTL_MS = 1500;

export function fetchAllSections(): Promise<SectionData[]> {
  const now = Date.now();
  if (sectionsCache && now - sectionsCache.at < SECTIONS_TTL_MS) {
    return sectionsCache.promise;
  }

  const promise = (async (): Promise<SectionData[]> => {
    try {
      const res = await fetch(`${getApiBase()}/api/sections`, {
        cache: "no-store",
        signal: AbortSignal.timeout(2500),
      });
      if (!res.ok) return [];
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        return json.data as SectionData[];
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch sections:", err);
      return [];
    }
  })();

  sectionsCache = { promise, at: now };
  return promise;
}

export function mapSectionsByKey(
  sections: SectionData[]
): Record<string, SectionData> {
  const map: Record<string, SectionData> = {};
  sections.forEach((s) => {
    if (s.sectionKey) map[s.sectionKey] = s;
  });
  return map;
}

export async function fetchSectionMap(): Promise<Record<string, SectionData>> {
  return mapSectionsByKey(await fetchAllSections());
}

export interface NewsRecord {
  _id: string;
  title: string;
  slug?: string;
  category?: string;
  date?: string;
  readTime?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  featured?: boolean;
  isFeatured?: boolean;
  keywords?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}
