import { useState, useEffect } from "react";
import {
  Clock,
  Star,
  SquarePen,
  Pencil,
  ChevronRight
} from "lucide-react";
import { getCategoryBadgeClass } from "../utils/categoryColors.js";
import { BASE_URL } from "../api/api.js";

const DEFAULT_FAVORITE_CATEGORIES = [
  { name: "ANIME", image: "/src/assets/images/luffy_avatar_1790269807034.jpg" },
  { name: "GAMING", image: "/src/assets/images/category_gaming_1790259361539.jpg" },
  { name: "MOVIES", image: "/src/assets/images/category_movies_1790259375752.jpg" },
  { name: "TV SHOWS", image: "/src/assets/images/category_tvshows_1790259388971.jpg" },
  { name: "K-POP", image: "/src/assets/images/category_kpop_1790259404900.jpg" },
  { name: "COMICS", image: "/src/assets/images/category_comics_1790259419220.jpg" },
  { name: "MANGA", image: "/src/assets/images/category_manga_1790259433020.jpg" },
  { name: "COSPLAY", image: "/src/assets/images/category_cosplay_1790259445408.jpg" }
];

const getFallbackCategoryImage = (catName = "") => {
  const c = catName.toLowerCase();
  if (c.includes("anime")) return "/src/assets/images/luffy_avatar_1790269807034.jpg";
  if (c.includes("gaming")) return "/src/assets/images/category_gaming_1790259361539.jpg";
  if (c.includes("movie")) return "/src/assets/images/category_movies_1790259375752.jpg";
  if (c.includes("tv")) return "/src/assets/images/category_tvshows_1790259388971.jpg";
  if (c.includes("k-pop") || c.includes("music")) return "/src/assets/images/category_kpop_1790259404900.jpg";
  if (c.includes("comic")) return "/src/assets/images/category_comics_1790259419220.jpg";
  if (c.includes("manga")) return "/src/assets/images/category_manga_1790259433020.jpg";
  if (c.includes("cosplay")) return "/src/assets/images/category_cosplay_1790259445408.jpg";
  return "/src/assets/images/category_anime_1790259342339.jpg";
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "Recently";
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const UserDashboardPage = ({
  onNavigateHome,
  onNavigateCategory,
  onNavigateSaved,
  onNavigateSubmit,
  onNavigateProfile,
  onOpenArticle
}) => {
  const [userName, setUserName] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.name || "Fan";
      }
    } catch {
      // fallback
    }
    return "Fan";
  });

  const [favoriteCategories, setFavoriteCategories] = useState(DEFAULT_FAVORITE_CATEGORIES);
  const [recentActivities, setRecentActivities] = useState([]);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

      try {
        if (token) {
          const res = await fetch(`${BASE_URL}/users/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (res.ok) {
            const data = await res.json();
            if (data.dashboard) {
              const d = data.dashboard;

              // 1. User name
              if (d.user?.name) {
                setUserName(d.user.name);
              }

              // 2. Favorite Fandoms
              if (Array.isArray(d.favoriteFandoms) && d.favoriteFandoms.length > 0) {
                const mappedFavs = d.favoriteFandoms.map((cat) => {
                  const catName = typeof cat === "object" ? cat.name : cat;
                  return {
                    name: (catName || "ANIME").toUpperCase(),
                    image: cat.iconUrl || getFallbackCategoryImage(catName)
                  };
                });
                setFavoriteCategories(mappedFavs);
              }

              // 3. Bookmarks (Top 5)
              if (Array.isArray(d.bookmarkedItems) && d.bookmarkedItems.length > 0) {
                const mappedBookmarks = d.bookmarkedItems.map((b) => {
                  const itemObj = b.item || {};
                  const catName = itemObj.categoryId?.name || itemObj.category || "Anime";
                  const itemImg =
                    itemObj.thumbnailUrl ||
                    itemObj.mediaUrl ||
                    itemObj.imageUrl ||
                    itemObj.images?.[0] ||
                    getFallbackCategoryImage(catName);

                  return {
                    id: itemObj._id || b._id,
                    _id: itemObj._id || b._id,
                    title: itemObj.title || itemObj.name || "Bookmarked Item",
                    category: catName,
                    rating: itemObj.popularityScore ? (itemObj.popularityScore / 10).toFixed(1) : "9.2",
                    desc: itemObj.body || itemObj.bio || itemObj.subtitle || "Fan favorite community item.",
                    image: itemImg,
                    rawItem: itemObj
                  };
                });
                setBookmarkedItems(mappedBookmarks);
              }

              // 4. Recent Contents (Top 5)
              if (Array.isArray(d.recentContents) && d.recentContents.length > 0) {
                const mappedRecent = d.recentContents.map((item) => {
                  const catName = item.categoryId?.name || "General";
                  const itemImg =
                    item.thumbnailUrl ||
                    item.mediaUrl ||
                    item.images?.[0] ||
                    getFallbackCategoryImage(catName);

                  return {
                    id: item._id,
                    _id: item._id,
                    title: item.title,
                    category: catName,
                    time: formatTimeAgo(item.createdAt),
                    image: itemImg,
                    rawItem: item
                  };
                });
                setRecentActivities(mappedRecent);
              }

              // 5. Trending Contents (Top 5)
              if (Array.isArray(d.trendingContents) && d.trendingContents.length > 0) {
                const mappedTrending = d.trendingContents.map((item) => {
                  const catName = item.categoryId?.name || "General";
                  const itemImg =
                    item.thumbnailUrl ||
                    item.mediaUrl ||
                    item.images?.[0] ||
                    getFallbackCategoryImage(catName);

                  return {
                    id: item._id,
                    _id: item._id,
                    title: item.title,
                    category: catName,
                    rating: item.thumbsUpRatio ? (item.thumbsUpRatio / 10).toFixed(1) : "9.0",
                    desc: item.body || item.subtitle || "Trending community discussion and content.",
                    image: itemImg,
                    rawItem: item
                  };
                });
                setTrendingItems(mappedTrending);
              }

              setIsLoading(false);
              return;
            }
          }
        }

        // Fallback: Fetch public content if no token or dashboard call was unauthenticated
        const contentRes = await fetch(`${BASE_URL}/content`);
        if (contentRes.ok) {
          const contentData = await contentRes.json();
          if (Array.isArray(contentData.contents) && contentData.contents.length > 0) {
            const list = contentData.contents;

            setRecentActivities(
              list.slice(0, 5).map((item) => ({
                id: item._id,
                _id: item._id,
                title: item.title,
                category: item.categoryId?.name || "Anime",
                time: formatTimeAgo(item.createdAt),
                image: item.thumbnailUrl || item.mediaUrl || getFallbackCategoryImage(item.categoryId?.name),
                rawItem: item
              }))
            );

            setTrendingItems(
              list.slice(0, 5).map((item) => ({
                id: item._id,
                _id: item._id,
                title: item.title,
                category: item.categoryId?.name || "Anime",
                rating: item.thumbsUpRatio ? (item.thumbsUpRatio / 10).toFixed(1) : "9.1",
                desc: item.body || "Trending community item.",
                image: item.thumbnailUrl || item.mediaUrl || getFallbackCategoryImage(item.categoryId?.name),
                rawItem: item
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="w-full bg-[#F8F9FA] min-h-full font-baloo select-none pb-16 text-gray-900">
      {/* 1. TOP GREETING BANNER */}
      <div className="relative w-full h-44 sm:h-48 md:h-52 overflow-hidden bg-zinc-950 border-b border-stone-800">
        <img
          src="/src/assets/images/fandom_banner_1790273074334.jpg"
          alt="Fandom Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-85 object-center brightness-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent" />

        <div className="absolute inset-0 max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between z-10">
          <div className="space-y-1 max-w-xl">
            {/* Prominent High-Contrast User Name Greeting */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-titan uppercase text-white tracking-wide leading-none drop-shadow-md">
              HEY, {userName ? userName.toUpperCase() : "FAN"}!
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-extrabold text-amber-300 pt-1 drop-shadow-xs">
              Welcome back to FanHub!
            </p>
            <p className="text-xs sm:text-sm font-semibold text-stone-300">
              Explore. Discover. Be part of the fandom.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => onNavigateSubmit && onNavigateSubmit()}
              className="bg-[#FFA800] hover:bg-[#FFB51A] text-black font-black text-xs sm:text-[13px] uppercase tracking-wider px-4 sm:px-5 py-2.5 sm:py-3 rounded-none transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 border border-[#E69800]"
            >
              <span>SUBMIT CONTENT</span>
              <SquarePen size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 space-y-7">
        {/* 2. SECTION: YOUR FAVORITE FANDOMS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight font-titan text-gray-900">
              YOUR FAVORITE FANDOMS
            </h2>
            <button
              type="button"
              onClick={() => (onNavigateProfile ? onNavigateProfile() : onNavigateCategory?.("All"))}
              className="text-xs font-bold text-[#FF5F1F] hover:underline uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
            >
              <span>EDIT FAVORITES</span>
              <Pencil size={12} strokeWidth={2.5} className="text-[#FF5F1F]" />
            </button>
          </div>

          {/* Favorite Categories — image background pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {favoriteCategories.map((cat, idx) => (
              <button
                key={cat.name || idx}
                type="button"
                onClick={() => onNavigateCategory && onNavigateCategory(cat.name)}
                className="relative h-14 rounded-none overflow-hidden border border-[#EDE4D6] cursor-pointer group"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.55] group-hover:brightness-[0.45] transition-all"
                  onError={(e) => {
                    e.currentTarget.src = "/src/assets/images/luffy_avatar_1790269807034.jpg";
                  }}
                />
                <div className="relative z-10 flex items-center justify-center h-full px-2">
                  <span className="font-black text-[11px] text-white tracking-wider truncate drop-shadow-md">
                    {cat.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 3. SECTION: RECENT ACTIVITY */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight font-titan text-gray-900">
              RECENT ACTIVITY
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {recentActivities.map((item) => (
              <div
                key={item.id || item._id}
                onClick={() => onOpenArticle && onOpenArticle(item.rawItem || item)}
                className="relative rounded-none overflow-hidden border border-[#EDE4D6] cursor-pointer group h-[220px] sm:h-[240px]"
              >
                {/* Full-width background image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Category badge top-left */}
                <span className={`absolute top-2 left-2 z-10 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-none shadow-xs ${getCategoryBadgeClass(item.category)}`}>
                  {item.category}
                </span>

                {/* Glassmorphic content overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-black/40 backdrop-blur-md border-t border-white/15 p-2.5 sm:p-3">
                  <h3 className="font-bold text-xs sm:text-[13px] leading-snug text-white group-hover:text-[#FFA800] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/70 font-medium mt-1.5">
                    <Clock size={11} strokeWidth={2} className="text-white/50 shrink-0" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SECTION: YOUR BOOKMARKS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight font-titan text-gray-900">
              YOUR BOOKMARKS ({bookmarkedItems.length})
            </h2>
            <button
              type="button"
              onClick={() => onNavigateSaved && onNavigateSaved()}
              className="text-xs font-bold text-[#FF5F1F] hover:underline uppercase tracking-wider cursor-pointer flex items-center gap-1"
            >
              <span>SEE ALL</span>
              <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          </div>

          {bookmarkedItems.length === 0 ? (
            <div className="text-center py-8 bg-white border border-dashed border-stone-200 rounded-none">
              <p className="text-xs font-bold text-stone-600">No bookmarks saved yet.</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Explore articles and characters to bookmark your favorites.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
              {bookmarkedItems.map((item) => (
                <div
                  key={item.id || item._id}
                  onClick={() => onOpenArticle && onOpenArticle(item.rawItem || item)}
                  className="relative rounded-none overflow-hidden border border-[#EDE4D6] cursor-pointer group h-[240px] sm:h-[260px]"
                >
                  {/* Full-width background image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Rating badge top-left */}
                  <span className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] font-black px-1.5 py-0.5 rounded-none flex items-center gap-1 border border-white/15">
                    <Star size={10} className="fill-[#FFA800] text-[#FFA800]" />
                    <span>{item.rating}</span>
                  </span>

                  {/* Glassmorphic content overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-black/40 backdrop-blur-md border-t border-white/15 p-2.5 sm:p-3">
                    <span className={`inline-block text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-none w-fit mb-1 ${getCategoryBadgeClass(item.category)}`}>
                      {item.category}
                    </span>
                    <h3 className="font-bold text-xs sm:text-[13px] leading-snug text-white group-hover:text-[#FFA800] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-white/60 font-normal line-clamp-1 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. SECTION: TRENDING ACROSS FANDOMS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight font-titan text-gray-900">
              TRENDING ACROSS FANDOMS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {trendingItems.map((item) => (
              <div
                key={item.id || item._id}
                onClick={() => onOpenArticle && onOpenArticle(item.rawItem || item)}
                className="relative rounded-none overflow-hidden border border-[#EDE4D6] cursor-pointer group h-[240px] sm:h-[260px]"
              >
                {/* Full-width background image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Rating badge top-left */}
                <span className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] font-black px-1.5 py-0.5 rounded-none flex items-center gap-1 border border-white/15">
                  <Star size={10} className="fill-[#FFA800] text-[#FFA800]" />
                  <span>{item.rating}</span>
                </span>

                {/* Glassmorphic content overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-black/40 backdrop-blur-md border-t border-white/15 p-2.5 sm:p-3">
                  <span className={`inline-block text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-none w-fit mb-1 ${getCategoryBadgeClass(item.category)}`}>
                    {item.category}
                  </span>
                  <h3 className="font-bold text-xs sm:text-[13px] leading-snug text-white group-hover:text-[#FFA800] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-white/60 font-normal line-clamp-1 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default UserDashboardPage;
