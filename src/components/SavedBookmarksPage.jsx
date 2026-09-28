import { useState, useEffect } from "react";
import {
  Bookmark,
  ChevronRight,
  FileText,
  Users,
  Film,
  Tag,
  Calendar,
  Flame,
  Edit3,
  Eye,
  Trash2,
  X,
  Undo2,
  Search,
  Loader2
} from "lucide-react";
import { BASE_URL } from "../api/api";

const SavedBookmarksPage = ({
  onSelectStory,
  onOpenCharacter,
  onRemoveSavedStory,
  onNavigateHome,
  parentLabel = "Dashboard",
  isLoggedIn = true,
  onOpenAuth,
  onRequireLogin
}) => {
  if (!isLoggedIn) {
    return (
      <div className="w-full bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-12 px-4 select-none font-sans">
        <div className="max-w-md w-full bg-white rounded-none border border-[#EDE4D6] p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-none bg-[#FFEBE5] text-[#FF5F1F] flex items-center justify-center mx-auto">
            <Bookmark size={32} className="stroke-[2.2]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight font-titan uppercase">
              SIGN IN REQUIRED
            </h2>
            <p className="text-xs sm:text-sm text-[#737373]">
              Bookmarks are private to registered user accounts. Please sign in or create an account to save and view your favorite fandoms.
            </p>
          </div>
          <div className="pt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                if (onRequireLogin) {
                  onRequireLogin("This feature requires login");
                } else if (onOpenAuth) {
                  onOpenAuth("login");
                }
              }}
              className="w-full py-2.5 px-4 bg-[#FF5F1F] hover:bg-[#E04F13] text-white font-extrabold text-xs tracking-wider uppercase rounded-none transition-colors cursor-pointer"
            >
              Sign In To Access Bookmarks
            </button>
            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full py-2 px-4 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer rounded-none border border-transparent hover:border-stone-200"
            >
              Back to Explorer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [recentlyRemoved, setRecentlyRemoved] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setBookmarks([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/bookmarks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        const rawList = data.bookmarks || [];
        const formatted = rawList.map((b) => {
          const target = b.itemId || {};
          let calcType = "ARTICLE";
          if (b.itemType === "character") calcType = "CHARACTER";
          else if (b.itemType === "merchandise") calcType = "MERCHANDISE";
          else if (target.type) calcType = target.type.toUpperCase();

          const catName = target.categoryId?.name || target.category || "ANIME";
          const img =
            target.thumbnailUrl ||
            target.imageUrl ||
            target.mediaUrl ||
            (target.images && target.images[0]) ||
            "/src/assets/images/fandom_banner_1790273074334.jpg";

          return {
            id: b._id,
            bookmarkId: b._id,
            itemId: target._id || b.itemId,
            itemType: b.itemType || "content",
            title: target.title || target.name || "Untitled",
            category: catName.toUpperCase(),
            type: calcType,
            year: target.createdAt ? new Date(target.createdAt).getFullYear().toString() : "2025",
            views: target.views ? `${target.views}` : "1.2K",
            note: b.note || "Bookmarked from fandom collection.",
            image: img,
            rawItem: target
          };
        });
        setBookmarks(formatted);
      } else {
        setBookmarks([]);
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [isLoggedIn]);

  const handleRemoveBookmark = async (id) => {
    const itemToRemove = bookmarks.find((b) => b.id === id);
    if (!itemToRemove) return;

    setRecentlyRemoved(itemToRemove);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    if (onRemoveSavedStory) {
      onRemoveSavedStory(id);
    }

    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/bookmarks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  const handleUndoRemove = async () => {
    if (!recentlyRemoved) return;
    const restored = recentlyRemoved;
    setBookmarks((prev) => [restored, ...prev]);
    setRecentlyRemoved(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          itemType: restored.itemType || "content",
          itemId: restored.itemId,
          note: restored.note
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.bookmark?._id) {
          setBookmarks((prev) =>
            prev.map((b) => (b.id === restored.id ? { ...b, id: data.bookmark._id } : b))
          );
        }
      }
    } catch (err) {
      console.error("Error restoring bookmark:", err);
    }
  };

  const handleOpenEditNote = (item) => {
    setEditingItem(item);
    setNoteDraft(item.note);
  };

  const handleSaveNote = async () => {
    if (!editingItem) return;
    const targetId = editingItem.id;
    const updatedNote = noteDraft.trim();

    setBookmarks((prev) =>
      prev.map((b) => (b.id === targetId ? { ...b, note: updatedNote } : b))
    );
    setEditingItem(null);

    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/bookmarks/${targetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note: updatedNote })
      });
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  const filteredBookmarks = bookmarks.filter((item) => {
    const matchesQuery =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;
    if (activeFilter === "all") return true;
    if (activeFilter === "article") {
      return item.type === "ARTICLE" || item.type === "MANGA";
    }
    if (activeFilter === "character") {
      return item.type === "CHARACTER" || item.itemType === "character";
    }
    if (activeFilter === "video") {
      return item.type === "VIDEO" || item.type === "TRAILER";
    }
    if (activeFilter === "merchandise") {
      return item.type === "MERCHANDISE" || item.itemType === "merchandise" || item.type === "IMAGE";
    }
    return true;
  });

  const handleOpenItem = (item) => {
    if (item.itemType === "character" && onOpenCharacter) {
      onOpenCharacter(item.rawItem || item);
    } else if (onSelectStory) {
      onSelectStory(
        item.rawItem || {
          id: item.itemId || item.id,
          title: item.title,
          category: item.category,
          image: item.image,
          year: item.year,
          views: item.views,
          type: item.type
        }
      );
    }
  };

  const getCategoryBadgeColor = (category) => {
    const cat = (category || "").toUpperCase();
    if (cat.includes("ANIME")) return "bg-[#FBCFE8] text-black";
    if (cat.includes("GAMING")) return "bg-[#D8B4FE] text-black";
    if (cat.includes("MOVIES") || cat.includes("MOVIE")) return "bg-[#FDE68A] text-black";
    if (cat.includes("K-POP") || cat.includes("KPOP")) return "bg-[#FBCFE8] text-black";
    if (cat.includes("COMIC")) return "bg-[#BAE6FD] text-black";
    if (cat.includes("MANGA")) return "bg-[#DDD6FE] text-black";
    if (cat.includes("COSPLAY")) return "bg-[#FECDD3] text-black";
    if (cat.includes("TV")) return "bg-[#A7F3D0] text-black";
    return "bg-[#E5E7EB] text-black";
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-full py-6 px-4 sm:px-6 select-none font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* PAGE HEADER TITLE */}
        <div className="pt-2 pb-1">
          <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
            BOOKMARKS ({filteredBookmarks.length} {filteredBookmarks.length === 1 ? "item" : "items"})
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#7A6F64] mt-0.5">
            Your saved content, all in one place.
          </p>
        </div>

        {/* Small Page-specific Search Bar */}
        <div className="max-w-md w-full relative mb-6">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#737373] pointer-events-none">
            <Search size={14} className="text-[#737373]" />
          </span>
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-bold pl-9 pr-8 py-2 border border-[#EDE4D6] rounded-none bg-white text-[#171717] focus:outline-none focus:border-[#FFA800] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-[#FFA800] rounded-none cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* 3. FILTER TABS */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none mb-7">
          {/* Tab 1: All */}
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 rounded-none transition-colors flex items-center justify-center cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#FFA800] text-black font-extrabold"
                : "bg-white text-[#404040] hover:bg-stone-50 border border-[#EDE4D6]"
            }`}
          >
            All
          </button>

          {/* Tab 2: Articles */}
          <button
            type="button"
            onClick={() => setActiveFilter("article")}
            className={`text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-none transition-colors flex items-center gap-2 cursor-pointer ${
              activeFilter === "article"
                ? "bg-[#FFA800] text-black font-extrabold"
                : "bg-white text-[#404040] hover:bg-stone-50 border border-[#EDE4D6]"
            }`}
          >
            <FileText
              size={15}
              className={activeFilter === "article" ? "text-black stroke-[2.4]" : "text-[#737373]"}
            />
            <span>Articles</span>
          </button>

          {/* Tab 3: Characters */}
          <button
            type="button"
            onClick={() => setActiveFilter("character")}
            className={`text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-none transition-colors flex items-center gap-2 cursor-pointer ${
              activeFilter === "character"
                ? "bg-[#FFA800] text-black font-extrabold"
                : "bg-white text-[#404040] hover:bg-stone-50 border border-[#EDE4D6]"
            }`}
          >
            <Users
              size={15}
              className={activeFilter === "character" ? "text-black stroke-[2.4]" : "text-[#737373]"}
            />
            <span>Characters</span>
          </button>

          {/* Tab 4: Videos */}
          <button
            type="button"
            onClick={() => setActiveFilter("video")}
            className={`text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-none transition-colors flex items-center gap-2 cursor-pointer ${
              activeFilter === "video"
                ? "bg-[#FFA800] text-black font-extrabold"
                : "bg-white text-[#404040] hover:bg-stone-50 border border-[#EDE4D6]"
            }`}
          >
            <Film
              size={15}
              className={activeFilter === "video" ? "text-black stroke-[2.4]" : "text-[#737373]"}
            />
            <span>Videos</span>
          </button>

          {/* Tab 5: Merchandise */}
          <button
            type="button"
            onClick={() => setActiveFilter("merchandise")}
            className={`text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-none transition-colors flex items-center gap-2 cursor-pointer ${
              activeFilter === "merchandise"
                ? "bg-[#FFA800] text-black font-extrabold"
                : "bg-white text-[#404040] hover:bg-stone-50 border border-[#EDE4D6]"
            }`}
          >
            <Tag
              size={15}
              className={activeFilter === "merchandise" ? "text-black stroke-[2.4]" : "text-[#737373]"}
            />
            <span>Merchandise</span>
          </button>
        </div>

        {/* 4. UNDO TOAST NOTIFICATION */}
        {recentlyRemoved && (
          <div className="mb-6 p-3 bg-[#1A1D24] border border-[#2B2F3D] text-white text-xs rounded-none flex items-center justify-between shadow-lg animate-in fade-in duration-200">
            <span>
              Removed <strong>&ldquo;{recentlyRemoved.title}&rdquo;</strong> from your bookmarks.
            </span>
            <button
              type="button"
              onClick={handleUndoRemove}
              className="text-[#FFA800] font-bold hover:underline flex items-center gap-1.5 px-2 py-1 cursor-pointer rounded-none"
            >
              <Undo2 size={13} />
              <span>Undo</span>
            </button>
          </div>
        )}

        {/* 5. CARDS GRID */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-none border border-[#EDE4D6] p-8 flex flex-col items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#FFA800] mb-3" />
            <p className="text-xs font-bold text-stone-500">Loading your bookmarks...</p>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-none border border-[#EDE4D6] p-8">
            <Bookmark size={42} className="mx-auto mb-3 text-stone-400 stroke-1" />
            <h3 className="text-base font-bold text-stone-800">No bookmarks found in this category</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t saved any items under this category yet.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="mt-4 px-4 py-2 bg-[#FFA800] hover:bg-[#FFB51A] text-black font-bold text-xs rounded-none transition-colors cursor-pointer"
            >
              View All Bookmarks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredBookmarks.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className="group bg-white rounded-none overflow-hidden border border-[#EDE4D6] shadow-2xs hover:border-stone-400 transition-colors flex flex-col justify-between text-gray-900 cursor-pointer"
              >
                {/* Visual Header Image with Bookmark Button in Top Right */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black shrink-0 border-b border-[#EDE4D6]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-none"
                    loading="lazy"
                  />

                  {/* Bookmark Button in Top Right */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBookmark(item.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-none bg-black/60 hover:bg-black/90 flex items-center justify-center text-white transition-colors cursor-pointer shadow-xs"
                    title="Remove from bookmarks"
                  >
                    <Bookmark size={13} className="stroke-[2.4] fill-[#FFA800] text-[#FFA800]" />
                  </button>

                  {/* Category Pill Overlay */}
                  <div
                    className={`absolute bottom-2 left-2 text-[9px] font-black px-2 py-0.5 rounded-none uppercase tracking-wider shadow-xs ${getCategoryBadgeColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </div>

                  {/* Type Tag Overlay */}
                  <div className="absolute bottom-2 right-2 bg-black/75 text-stone-200 font-bold text-[8.5px] px-1.5 py-0.5 rounded-none uppercase tracking-wider">
                    {item.type}
                  </div>
                </div>

                {/* Card Content Area: Crisp White Background */}
                <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-2 bg-white">
                  {/* Title */}
                  <h3 className="font-sans font-bold text-xs sm:text-[13px] text-stone-900 leading-snug tracking-tight line-clamp-2 min-h-[32px] group-hover:text-[#FF5F1F] transition-colors">
                    {item.title}
                  </h3>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium pt-1 border-t border-[#EDE4D6]">
                    <div className="flex items-center gap-1">
                      <Calendar size={11} className="text-stone-400" />
                      <span>{item.year}</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500 font-bold">
                      <Flame size={11} className="fill-orange-500" />
                      <span>{item.views}</span>
                    </div>
                  </div>

                  {/* Personal Note Snippet (if exists) */}
                  {item.note && (
                    <div className="flex items-center justify-between gap-1 text-[10px] text-stone-500 pt-0.5">
                      <p className="line-clamp-1 text-stone-600 italic flex-1">
                        &ldquo;{item.note}&rdquo;
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditNote(item);
                        }}
                        className="text-[#FF5F1F] hover:underline shrink-0 font-bold p-0.5 rounded-none cursor-pointer"
                        title="Edit note"
                      >
                        <Edit3 size={10} />
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {/* View Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenItem(item);
                      }}
                      className="flex-1 bg-[#FFA800] hover:bg-[#FFB51A] text-black font-black text-[11px] py-1.5 px-2 rounded-none flex items-center justify-center gap-1 transition-colors cursor-pointer uppercase tracking-wider"
                    >
                      <Eye size={12} className="stroke-[2.5]" />
                      <span>View</span>
                    </button>

                    {/* Edit Note Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditNote(item);
                      }}
                      className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-none transition-colors cursor-pointer"
                      title="Edit note"
                    >
                      <Edit3 size={12} />
                    </button>

                    {/* Remove Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBookmark(item.id);
                      }}
                      className="p-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-500 border border-stone-200 rounded-none transition-colors cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. EDIT NOTE INTERACTIVE MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#EDE4D6] text-gray-900 rounded-none max-w-md w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-[#FF5F1F]" />
                <h3 className="text-sm sm:text-base font-bold text-stone-900">Edit Personal Note</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-stone-400 hover:text-black p-1 rounded-none transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3">
              <span className="text-[11px] text-stone-600 font-semibold block mb-1 truncate">
                Bookmark: <strong className="text-stone-900">{editingItem.title}</strong>
              </span>
              <textarea
                rows={4}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Write your personal thoughts, reminder notes, or impressions..."
                className="w-full bg-[#FAF9F6] border border-stone-200 rounded-none p-3 text-xs text-stone-900 focus:outline-none focus:border-[#FF5F1F] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-xs text-stone-600 hover:text-black px-3.5 py-2 border border-stone-200 rounded-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="text-xs font-bold px-4 py-2 bg-[#FFA800] hover:bg-[#FFB51A] text-black rounded-none shadow-2xs transition-colors cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { SavedBookmarksPage };
