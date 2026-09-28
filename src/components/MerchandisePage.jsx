import { useState, useEffect } from "react";
import {
  Calendar,
  Bookmark,
  Check,
  X,
  Search,
  Loader2
} from "lucide-react";
import { BASE_URL } from "../api/api";

const CATEGORIES = [
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

const TAG_FILTERS = [
  "All",
  "Limited Edition",
  "Pre-Order",
  "Collectible"
];

const getTagBadgeClass = (tag) => {
  const t = (tag || "").toLowerCase();
  if (t.includes("limited")) return "bg-[#FCE7F3] text-[#9D174D]";
  if (t.includes("pre-order") || t.includes("preorder")) return "bg-[#BAE6FD] text-[#0369A1]";
  if (t.includes("collectible")) return "bg-[#FEF3C7] text-[#B45309]";
  return "bg-[#EDE9FE] text-[#6B21A8]";
};

const getCategoryBadgeClass = (categoryName) => {
  const cat = (categoryName || "").toLowerCase();
  if (cat.includes("anime") || cat.includes("manga")) return "bg-[#EDE9FE] text-[#6B21A8]";
  if (cat.includes("gaming")) return "bg-[#DCFCE7] text-[#15803D]";
  if (cat.includes("movie") || cat.includes("tv")) return "bg-[#E0F2FE] text-[#0369A1]";
  if (cat.includes("k-pop") || cat.includes("music")) return "bg-[#F3E8FF] text-[#7E22CE]";
  if (cat.includes("comic")) return "bg-[#FFE4E6] text-[#BE123C]";
  if (cat.includes("cosplay")) return "bg-[#CCFBF1] text-[#0F766E]";
  return "bg-[#F1F5F9] text-[#475569]";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Coming Soon";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Coming Soon";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const MerchandisePage = ({
  onNavigateHome,
  isLoggedIn = true,
  onOpenAuth,
  onRequireLogin
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [bookmarkMap, setBookmarkMap] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [merchandiseList, setMerchandiseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchandise = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/merchandise`);
        if (res.ok) {
          const data = await res.json();
          setMerchandiseList(data.merchandise || []);
        } else {
          setMerchandiseList([]);
        }

        // Fetch user bookmarks from DB if logged in
        const token = localStorage.getItem("token");
        if (token) {
          const bRes = await fetch(`${BASE_URL}/bookmarks`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (bRes.ok) {
            const bData = await bRes.json();
            const ids = new Set();
            const bMap = {};
            (bData.bookmarks || []).forEach((b) => {
              const tId = b.itemId?._id || b.itemId;
              if (tId) {
                const strId = tId.toString();
                ids.add(strId);
                bMap[strId] = b._id;
              }
            });
            setBookmarkedIds(ids);
            setBookmarkMap(bMap);
          }
        }
      } catch (err) {
        setMerchandiseList([]);
      }
      setLoading(false);
    };

    fetchMerchandise();
  }, [isLoggedIn]);

  const toggleBookmark = async (e, id) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) {
      if (onRequireLogin) {
        onRequireLogin("This feature requires login");
      } else {
        setToastMessage("Login required to bookmark this");
        setTimeout(() => setToastMessage(null), 2500);
      }
      return;
    }

    const strId = id.toString();
    const isCurrentlySaved = bookmarkedIds.has(strId);

    if (isCurrentlySaved) {
      const bookmarkId = bookmarkMap[strId];
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(strId);
        return next;
      });
      setToastMessage("Removed from bookmarks");
      setTimeout(() => setToastMessage(null), 2200);

      try {
        if (bookmarkId) {
          await fetch(`${BASE_URL}/bookmarks/${bookmarkId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          const bRes = await fetch(`${BASE_URL}/bookmarks`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const bData = await bRes.json();
          const match = (bData.bookmarks || []).find((b) => {
            const bId = b.itemId?._id || b.itemId;
            return bId && bId.toString() === strId;
          });
          if (match) {
            await fetch(`${BASE_URL}/bookmarks/${match._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        }
      } catch (err) {
        console.error("Failed to delete bookmark:", err);
      }
    } else {
      setBookmarkedIds((prev) => new Set([...prev, strId]));
      setToastMessage("Saved to bookmarks!");
      setTimeout(() => setToastMessage(null), 2200);

      try {
        const res = await fetch(`${BASE_URL}/bookmarks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            itemType: "merchandise",
            itemId: strId
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.bookmark?._id) {
            setBookmarkMap((prev) => ({ ...prev, [strId]: data.bookmark._id }));
          }
        }
      } catch (err) {
        console.error("Failed to save bookmark:", err);
      }
    }
  };

  // Showcase merchandise (non-upcoming)
  const showcaseMerch = merchandiseList.filter((item) => {
    if (item.isUpcoming) return false;

    const catName = item.categoryId?.name || item.category || "";
    const matchesCategory =
      selectedCategory === "All" ||
      catName.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesTag =
      selectedTag === "All" ||
      (item.tag && item.tag.toLowerCase() === selectedTag.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      catName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesTag && matchesSearch;
  });

  // Upcoming releases (isUpcoming === true)
  const upcomingReleases = merchandiseList.filter((item) => {
    if (!item.isUpcoming) return false;

    const catName = item.categoryId?.name || item.category || "";
    const matchesSearch =
      !searchQuery.trim() ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      catName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Bento Grid item span calculation
  const getBentoSpanClass = (idx) => {
    const mod = idx % 7;
    if (mod === 0) return "sm:col-span-2 sm:row-span-2"; // Large hero feature tile
    if (mod === 3) return "sm:col-span-2 sm:row-span-1"; // Wide banner tile
    if (mod === 5) return "sm:col-span-1 sm:row-span-2"; // Tall vertical tile
    return "sm:col-span-1 sm:row-span-1"; // Standard square tile
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-full py-6 px-4 sm:px-6 font-sans select-none text-[#171717]">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* PAGE HEADER */}
        <div className="pt-2 pb-1">
          <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
            MERCHANDISE AND UPCOMING RELEASES
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#7A6F64] mt-0.5">
            Discover exclusive merchandise, limited editions, and upcoming releases from your favorite fandoms.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md w-full relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#737373] pointer-events-none">
            <Search size={14} className="text-[#737373]" />
          </span>
          <input
            type="text"
            placeholder="Search merchandise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-bold pl-9 pr-8 py-2 border border-[#E5E7EB] rounded-none bg-white text-[#171717] focus:outline-none focus:border-[#FFA800] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-[#FFA800] cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* FILTERS ROW: Category Filter | Tag Filter */}
        <div className="pt-1 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Filter by Category */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="font-bold text-[#171717] shrink-0 whitespace-nowrap">Filter by Category:</span>
            <div className="flex items-center gap-1.5 shrink-0">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-none text-xs transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#FFA800] text-black font-extrabold shadow-2xs"
                        : "bg-white text-[#525252] border border-[#E5E7EB] hover:bg-stone-50"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter by Tag */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-[#171717] shrink-0 whitespace-nowrap">Filter by Tag:</span>
            <div className="flex items-center gap-1.5">
              {TAG_FILTERS.map((tag) => {
                const isActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-none text-xs transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#FFA800] text-black font-extrabold shadow-2xs"
                        : "bg-white text-[#525252] border border-[#E5E7EB] hover:bg-stone-50"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 1: MERCHANDISE SHOWCASE (Bento Grid) */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-black uppercase tracking-tight font-titan text-[#171717]">
              MERCHANDISE SHOWCASE
            </h2>
            {loading && <Loader2 size={13} className="animate-spin text-stone-400 ml-1" />}
          </div>

          {showcaseMerch.length === 0 && !loading ? (
            <div className="bg-white rounded-none border border-[#E5E7EB] p-8 text-center space-y-3">
              <p className="text-sm font-bold text-stone-500">
                No merchandise found matching your selected filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedTag("All");
                  setSearchQuery("");
                }}
                className="px-4 py-1.5 bg-[#FFA800] text-black font-extrabold text-xs rounded-none cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[220px] sm:auto-rows-[240px] gap-3.5 sm:gap-4 grid-flow-dense">
              {showcaseMerch.map((item, idx) => {
                const itemId = item._id || item.id;
                const catName = item.categoryId?.name || item.category || "General";
                const isBookmarked = bookmarkedIds.has(itemId);
                const itemImg = item.imageUrl || "/src/assets/images/celestial_archer_fig_1790285506979.jpg";

                return (
                  <div
                    key={itemId}
                    className={`relative rounded-none overflow-hidden bg-stone-900 border border-[#CBD5E1]/80 shadow-2xs group flex flex-col justify-between cursor-default select-none ${getBentoSpanClass(idx)}`}
                  >
                    <img
                      src={itemImg}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-none"
                      loading="lazy"
                    />

                    {/* Top-Left Tag Badge */}
                    {item.tag && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span
                          className={`text-[8.5px] font-black px-2 py-0.5 rounded-none uppercase tracking-wider shadow-xs ${getTagBadgeClass(
                            item.tag
                          )}`}
                        >
                          {item.tag}
                        </span>
                      </div>
                    )}

                    {/* Top-Right Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(e, itemId)}
                      className="absolute top-2.5 right-2.5 z-20 p-1.5 bg-black/50 hover:bg-black/80 rounded-none text-white transition-colors cursor-pointer"
                      title="Bookmark"
                    >
                      <Bookmark
                        size={14}
                        className={
                          isBookmarked
                            ? "fill-[#FFA800] text-[#FFA800]"
                            : "stroke-[2.2]"
                        }
                      />
                    </button>

                    {/* Bottom Title & Category Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 sm:p-4 pt-10 space-y-1 z-10">
                      <h3 className="font-bold text-xs sm:text-sm text-white leading-tight line-clamp-1">
                        {item.name}
                      </h3>
                      <div>
                        <span
                          className={`text-[8.5px] font-black px-2 py-0.5 rounded-none uppercase tracking-wider inline-block ${getCategoryBadgeClass(
                            catName
                          )}`}
                        >
                          {catName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 2: UPCOMING RELEASES */}
        <section className="space-y-3 pt-6 pb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-black uppercase tracking-tight font-titan text-[#171717]">
              UPCOMING RELEASES
            </h2>
          </div>

          {upcomingReleases.length === 0 && !loading ? (
            <div className="bg-white rounded-none border border-[#E5E7EB] p-6 text-center text-xs text-stone-500 font-semibold">
              No upcoming releases scheduled at this moment.
            </div>
          ) : (
            <div className="bg-white rounded-none border border-[#E5E7EB] overflow-hidden shadow-2xs">
              {/* Table Header */}
              <div className="grid grid-cols-12 px-4 py-2.5 border-b border-[#F3F4F6] text-[11px] font-bold text-[#737373]">
                <div className="col-span-6 sm:col-span-5">Title</div>
                <div className="col-span-2 text-center">Type / Tag</div>
                <div className="col-span-2 text-center">Category</div>
                <div className="col-span-2 sm:col-span-3 text-right pr-6">Status / Date</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[#F3F4F6]">
                {upcomingReleases.map((item) => {
                  const itemId = item._id || item.id;
                  const catName = item.categoryId?.name || item.category || "General";
                  const isBookmarked = bookmarkedIds.has(itemId);
                  const itemImg = item.imageUrl || "/src/assets/images/solaris_rise_sunset_1790283958868.jpg";

                  return (
                    <div
                      key={itemId}
                      className="grid grid-cols-12 px-4 py-3 items-center hover:bg-stone-50/70 transition-colors cursor-default"
                    >
                      {/* Left: Thumbnail + Title */}
                      <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-14 h-10 rounded-none overflow-hidden shrink-0 bg-stone-900 shadow-2xs">
                          <img
                            src={itemImg}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-none"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-[13px] text-[#171717] truncate leading-tight">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-[#737373] truncate mt-0.5">
                            {item.tag || "Upcoming Release"}
                          </p>
                        </div>
                      </div>

                      {/* Tag Badge */}
                      <div className="col-span-2 text-center">
                        <span
                          className={`text-[9px] font-bold px-2.5 py-0.5 rounded-none inline-block ${getTagBadgeClass(
                            item.tag
                          )}`}
                        >
                          {item.tag || "Pre-Order"}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="col-span-2 text-center">
                        <span
                          className={`text-[9px] font-bold px-2.5 py-0.5 rounded-none inline-block ${getCategoryBadgeClass(
                            catName
                          )}`}
                        >
                          {catName}
                        </span>
                      </div>

                      {/* Release Date + Bookmark */}
                      <div className="col-span-2 sm:col-span-3 flex items-center justify-end gap-3 text-right">
                        <span className="text-[11px] text-[#737373] font-medium whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(e, itemId)}
                          className="text-stone-400 hover:text-black p-0.5 cursor-pointer"
                          title="Bookmark"
                        >
                          <Bookmark
                            size={14}
                            className={
                              isBookmarked
                                ? "fill-[#FFA800] text-[#FFA800]"
                                : "stroke-[1.8]"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1D24] border border-[#2B2F3D] text-white text-xs px-4 py-2.5 rounded-none shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check size={14} className="text-[#FFA800]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export { MerchandisePage };
