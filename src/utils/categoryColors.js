/**
 * Unified Category Color Palette for FanHub (Light Theme)
 * 
 * Palette:
 * - Anime: #EC4899 (Pink)
 * - Gaming: #10B981 (Emerald)
 * - Movies: #F59E0B (Amber)
 * - TV Shows: #3B82F6 (Blue)
 * - K-Pop: #8B5CF6 (Purple)
 * - Comics: #EF4444 (Red)
 * - Manga: #F97316 (Orange)
 * - Cosplay: #14B8A6 (Teal)
 */

export const CATEGORY_COLORS = {
  Anime: "#EC4899",
  Gaming: "#10B981",
  Movies: "#F59E0B",
  "TV Shows": "#3B82F6",
  "K-Pop": "#8B5CF6",
  Comics: "#EF4444",
  Manga: "#F97316",
  Cosplay: "#14B8A6"
};

export const CATEGORY_BADGE_CLASSES = {
  Anime: "bg-pink-50 text-pink-700 border border-pink-200",
  Gaming: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Movies: "bg-amber-50 text-amber-800 border border-amber-200",
  "TV Shows": "bg-blue-50 text-blue-700 border border-blue-200",
  "K-Pop": "bg-purple-50 text-purple-700 border border-purple-200",
  Comics: "bg-rose-50 text-rose-700 border border-rose-200",
  Manga: "bg-orange-50 text-orange-700 border border-orange-200",
  Cosplay: "bg-teal-50 text-teal-700 border border-teal-200"
};

export function getCategoryBadgeClass(category) {
  if (!category) return "bg-gray-100 text-gray-700 border border-gray-200";
  const norm = String(category).toLowerCase().trim();
  if (norm.includes("anime")) return CATEGORY_BADGE_CLASSES.Anime;
  if (norm.includes("gaming") || norm.includes("game")) return CATEGORY_BADGE_CLASSES.Gaming;
  if (norm.includes("movie") || norm.includes("film")) return CATEGORY_BADGE_CLASSES.Movies;
  if (norm.includes("tv") || norm.includes("series") || norm.includes("show")) return CATEGORY_BADGE_CLASSES["TV Shows"];
  if (norm.includes("k-pop") || norm.includes("kpop") || norm.includes("music") || norm.includes("album")) return CATEGORY_BADGE_CLASSES["K-Pop"];
  if (norm.includes("comic") || norm.includes("superhero")) return CATEGORY_BADGE_CLASSES.Comics;
  if (norm.includes("manga")) return CATEGORY_BADGE_CLASSES.Manga;
  if (norm.includes("cosplay")) return CATEGORY_BADGE_CLASSES.Cosplay;
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

export function getCategoryStyle(category) {
  if (!category) {
    return {
      bg: "#F1F5F9",
      text: "#475569",
      border: "#CBD5E1",
      accentBorder: "#F59E0B",
      chipClass: "bg-gray-100 text-gray-700 border-gray-200 hover:border-amber-400 hover:text-amber-700"
    };
  }

  const norm = String(category).toLowerCase().trim();

  if (norm.includes("anime")) {
    return {
      bg: "#FDF2F8",
      text: "#BE185D",
      border: "#FBCFE8",
      accentBorder: "#EC4899",
      chipClass: "bg-pink-50 text-pink-700 border-pink-200 hover:border-pink-400"
    };
  }
  if (norm.includes("gaming") || norm.includes("game")) {
    return {
      bg: "#ECFDF5",
      text: "#047857",
      border: "#A7F3D0",
      accentBorder: "#10B981",
      chipClass: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400"
    };
  }
  if (norm.includes("movie") || norm.includes("film")) {
    return {
      bg: "#FFFBEB",
      text: "#B45309",
      border: "#FDE68A",
      accentBorder: "#F59E0B",
      chipClass: "bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-400"
    };
  }
  if (norm.includes("tv") || norm.includes("series") || norm.includes("show")) {
    return {
      bg: "#EFF6FF",
      text: "#1D4ED8",
      border: "#BFDBFE",
      accentBorder: "#3B82F6",
      chipClass: "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400"
    };
  }
  if (norm.includes("k-pop") || norm.includes("kpop") || norm.includes("music") || norm.includes("album")) {
    return {
      bg: "#F5F3FF",
      text: "#6D28D9",
      border: "#DDD6FE",
      accentBorder: "#8B5CF6",
      chipClass: "bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400"
    };
  }
  if (norm.includes("comic") || norm.includes("superhero")) {
    return {
      bg: "#FEF2F2",
      text: "#B91C1C",
      border: "#FECACA",
      accentBorder: "#EF4444",
      chipClass: "bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400"
    };
  }
  if (norm.includes("manga")) {
    return {
      bg: "#FFF7ED",
      text: "#C2410C",
      border: "#FED7AA",
      accentBorder: "#F97316",
      chipClass: "bg-orange-50 text-orange-700 border-orange-200 hover:border-orange-400"
    };
  }
  if (norm.includes("cosplay")) {
    return {
      bg: "#F0FDFA",
      text: "#0F766E",
      border: "#99F6E4",
      accentBorder: "#14B8A6",
      chipClass: "bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-400"
    };
  }

  return {
    bg: "#F1F5F9",
    text: "#475569",
    border: "#CBD5E1",
    accentBorder: "#F59E0B",
    chipClass: "bg-gray-100 text-gray-700 border-gray-200 hover:border-amber-400 hover:text-amber-700"
  };
}

export const CATEGORY_LIST = [
  "All",
  "Anime",
  "Gaming",
  "Movies",
  "TV Shows",
  "K-Pop",
  "Comics",
  "Manga",
  "Cosplay"
];
