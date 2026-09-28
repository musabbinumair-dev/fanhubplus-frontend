import { useState, useEffect } from "react";
import {
  Users,
  Filter,
  RotateCcw,
  Bookmark,
  Eye,
  X,
  Check,
  Search,
  Loader2
} from "lucide-react";
import { BASE_URL, fetchCategoriesFromApi, fetchCharactersFromApi } from "../api/api";

const DEFAULT_CATEGORIES = [
  "Anime",
  "Gaming",
  "Movies",
  "TV Shows",
  "K-Pop",
  "Comics",
  "Manga",
  "Cosplay"
];

const getCategoryBadgeColor = (categoryName) => {
  const cat = (categoryName || "").toUpperCase();
  if (cat.includes("ANIME")) return "bg-[#FCE7F3] text-[#171717]";
  if (cat.includes("GAMING")) return "bg-[#DCFCE7] text-[#171717]";
  if (cat.includes("MOVIES") || cat.includes("MOVIE")) return "bg-[#E0F2FE] text-[#171717]";
  if (cat.includes("TV")) return "bg-[#F3E8FF] text-[#171717]";
  if (cat.includes("K-POP") || cat.includes("KPOP")) return "bg-[#FCE7F3] text-[#171717]";
  if (cat.includes("COMIC")) return "bg-[#CFFAFE] text-[#171717]";
  if (cat.includes("MANGA")) return "bg-[#EDE9FE] text-[#171717]";
  if (cat.includes("COSPLAY")) return "bg-[#FFE4E6] text-[#171717]";
  return "bg-[#FEF3C7] text-[#171717]";
};

const CharactersPage = ({
  onNavigateHome,
  onOpenCharacter,
  onOpenArticle,
  isLoggedIn = false,
  onOpenAuth,
  onRequireLogin
}) => {
  const [characters, setCharacters] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [bookmarkMap, setBookmarkMap] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch categories from DB
        const catData = await fetchCategoriesFromApi();
        if (catData && catData.length > 0) {
          const categoryNames = catData.map((c) => c.name);
          setCategories(categoryNames);
        }

        // Fetch characters from DB
        const charData = await fetchCharactersFromApi();
        if (charData && Array.isArray(charData)) {
          setCharacters(charData);
        } else {
          setCharacters([]);
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
      } catch (error) {
        console.error("Error loading character data:", error);
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn]);

  const toggleCategory = (categoryName) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleClearFilters = () => {
    setSelectedCategories({});
    setSearchQuery("");
  };

  const handleToggleBookmark = async (e, id) => {
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
      setTimeout(() => setToastMessage(null), 2500);

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
      setTimeout(() => setToastMessage(null), 2500);

      try {
        const res = await fetch(`${BASE_URL}/bookmarks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            itemType: "character",
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

  const handleViewProfile = (char) => {
    if (onOpenCharacter) {
      onOpenCharacter(char);
    } else if (onOpenArticle) {
      onOpenArticle(char);
    }
  };

  const activeCategories = Object.keys(selectedCategories).filter(
    (key) => selectedCategories[key]
  );

  const filteredCharacters = characters.filter((char) => {
    // Category check
    const charCatName = char.categoryId?.name || char.category || "";
    const categoryMatch =
      activeCategories.length === 0 ||
      activeCategories.some(
        (cat) => cat.toLowerCase() === charCatName.toLowerCase()
      );

    // Search check
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categoryMatch;

    const nameMatch = char.name?.toLowerCase().includes(query);
    const bioMatch = char.bio?.toLowerCase().includes(query);
    const catMatch = charCatName.toLowerCase().includes(query);
    const tagsMatch = Array.isArray(char.tags) && char.tags.some((t) => t.toLowerCase().includes(query));

    return categoryMatch && (nameMatch || bioMatch || catMatch || tagsMatch);
  });

  return (
    <div className="w-full bg-[#FAF8F5] min-h-full py-6 px-4 sm:px-6 select-none font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* PAGE HEADER */}
        <div className="pt-2 pb-1">
          <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
            CHARACTERS
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#7A6F64] mt-0.5">
            Discover and explore your favorite characters from across all categories.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-md w-full relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#737373] pointer-events-none">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search characters by name, bio, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-bold pl-9 pr-8 py-2 border border-[#E5E7EB] rounded-none bg-white text-[#171717] focus:outline-none focus:border-[#FFA800] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-[#FFA800]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1A1D24] border border-[#2B2F3D] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <Check size={14} className="text-[#FFA800]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* MAIN LAYOUT: SIDEBAR + CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT SIDEBAR: FILTER BY CATEGORY ONLY */}
          <aside className="lg:col-span-3 space-y-5 bg-transparent lg:sticky lg:top-24">
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#171717]">
                <Filter size={14} className="text-[#171717]" />
                <span>Filter by Category</span>
              </div>

              <div className="space-y-2">
                {categories.map((cat) => {
                  const isChecked = !!selectedCategories[cat];
                  return (
                    <div
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="flex items-center gap-2.5 text-[12px] text-[#404040] hover:text-[#171717] font-medium cursor-pointer"
                    >
                      <div
                        className={`w-4 h-4 rounded-none flex items-center justify-center transition-all ${isChecked
                          ? "bg-[#FFA800] border border-[#FFA800]"
                          : "bg-white border border-[#D4D4D8] hover:border-[#A1A1AA]"
                          }`}
                      >
                        {isChecked && <Check size={11} className="text-white stroke-[3.5]" />}
                      </div>
                      <span>{cat}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clear filters Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full bg-[#FFA800] hover:bg-[#FFB51A] active:scale-[0.98] text-black font-extrabold text-[12px] py-2 px-3.5 rounded-none flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-all cursor-pointer"
              >
                <RotateCcw size={13} className="stroke-[2.5]" />
                <span>Clear filters</span>
              </button>
            </div>
          </aside>

          {/* RIGHT MAIN AREA: CHARACTER CARDS */}
          <main className="lg:col-span-9 space-y-3.5">
            {/* Counter */}
            <div className="text-[12px] text-[#737373] font-medium">
              Showing {filteredCharacters.length} {filteredCharacters.length === 1 ? "character" : "characters"}
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E5E7EB]">
                <Loader2 size={32} className="text-[#FFA800] animate-spin mb-3" />
                <p className="text-xs font-semibold text-stone-500">Loading characters...</p>
              </div>
            ) : filteredCharacters.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20 bg-white rounded-none border border-[#E5E7EB] p-8 shadow-xs">
                <Users size={36} className="mx-auto mb-3 text-stone-400 stroke-1" />
                <h3 className="text-sm font-bold text-stone-800">No characters match the selected filters</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Try selecting different categories or click Clear filters to reset.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-[#FFA800] text-black font-bold text-xs rounded-none hover:brightness-105 transition cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              /* Characters Grid */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredCharacters.map((char) => {
                  const charId = char._id || char.id;
                  const isBookmarked = bookmarkedIds.has(charId);
                  const categoryName = char.categoryId?.name || char.category || "General";
                  const imageSrc = char.imageUrl || char.image || "/src/assets/images/kael_vex_1790281397401.jpg";

                  return (
                    <div
                      key={charId}
                      onClick={() => handleViewProfile(char)}
                      className="bg-white rounded-none overflow-hidden border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                    >
                      {/* Character Image with Bookmark Button */}
                      <div className="relative aspect-square w-full overflow-hidden bg-[#181A20]">
                        <img
                          src={imageSrc}
                          alt={char.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/src/assets/images/kael_vex_1790281397401.jpg";
                          }}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Bookmark Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmark(e, charId)}
                          className="absolute top-2.5 right-2.5 w-[26px] h-[26px] rounded-none bg-black/50 hover:bg-black/75 backdrop-blur-[2px] flex items-center justify-center text-white transition-colors cursor-pointer shadow-xs"
                          title={isBookmarked ? "Bookmarked" : "Save bookmark"}
                        >
                          <Bookmark
                            size={13}
                            className={isBookmarked ? "fill-[#FFA800] text-[#FFA800]" : "text-white stroke-[2]"}
                          />
                        </button>
                      </div>

                      {/* Content Section */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Character Name */}
                          <h3 className="font-bold text-[15px] text-[#171717] tracking-tight leading-snug truncate">
                            {char.name}
                          </h3>

                          {/* Category Badge */}
                          <div className="mt-2 mb-2">
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-none uppercase tracking-wider inline-block ${getCategoryBadgeColor(
                                categoryName
                              )}`}
                            >
                              {categoryName}
                            </span>
                          </div>

                          {/* Bio Description */}
                          <p className="text-[11px] text-[#737373] font-normal leading-[1.4] line-clamp-3 min-h-[44px]">
                            {char.bio || "No description available for this character."}
                          </p>
                        </div>

                        {/* View Profile Button */}
                        <div className="pt-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(char);
                            }}
                            className="w-full bg-[#181A20] hover:bg-[#252834] active:scale-[0.98] text-white font-bold text-[12px] py-2 px-3 rounded-none flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye size={13} className="stroke-[2.2]" />
                            <span>View profile</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export {
  CharactersPage
};
