import { useState, useEffect } from "react";
import {
  Calendar,
  Bookmark,
  Check,
  X,
  Search,
  Loader2,
  ExternalLink,
  ThumbsUp,
  ThumbsDown
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

const getCategoryBadgeClass = (categoryName) => {
  const cat = (categoryName || "").toLowerCase();
  if (cat.includes("anime") || cat.includes("manga")) return "bg-[#EDE9FE] text-[#6B21A8]";
  if (cat.includes("gaming")) return "bg-[#E0F2FE] text-[#0369A1]";
  if (cat.includes("movie") || cat.includes("tv")) return "bg-[#FFE4E6] text-[#BE123C]";
  if (cat.includes("k-pop") || cat.includes("music")) return "bg-[#F3E8FF] text-[#7E22CE]";
  if (cat.includes("comic")) return "bg-[#FEF3C7] text-[#B45309]";
  if (cat.includes("cosplay")) return "bg-[#DCFCE7] text-[#15803D]";
  return "bg-[#F1F5F9] text-[#475569]";
};

const formatDate = (dateStr) => {
  if (!dateStr) return { month: "MAY", day: "15", full: "May 15, 2025" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { month: "MAY", day: "15", full: dateStr };
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.toLocaleDateString("en-US", { day: "2-digit" });
  const full = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return { month, day, full };
};

const getArticleImage = (article) => {
  if (article.thumbnailUrl && article.thumbnailUrl.trim()) return article.thumbnailUrl;
  if (article.images && article.images.length > 0 && article.images[0]) return article.images[0];
  if (
    article.mediaUrl &&
    article.mediaUrl.trim() &&
    !article.mediaUrl.includes(".mp4") &&
    !article.mediaUrl.toLowerCase().includes(".pdf")
  ) {
    return article.mediaUrl;
  }
  return "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80";
};

const getArticlePdfUrl = (article) => {
  if (!article) return null;
  if (article.pdfUrl && typeof article.pdfUrl === "string") return article.pdfUrl;
  if (article.fileUrl && typeof article.fileUrl === "string") return article.fileUrl;
  if (article.mediaUrl && typeof article.mediaUrl === "string") {
    const urls = article.mediaUrl.split(",");
    const pdf = urls.find((u) => u.toLowerCase().includes(".pdf")) || urls[0];
    if (pdf && (pdf.toLowerCase().includes(".pdf") || pdf.startsWith("http"))) {
      return pdf.trim();
    }
  }
  return null;
};

const ArticlesAndEventsPage = ({
  onNavigateHome,
  onNavigateSubmit,
  onOpenArticle,
  isLoggedIn = true,
  onOpenAuth,
  onRequireLogin
}) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [bookmarkMap, setBookmarkMap] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [activePdfModal, setActivePdfModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const artRes = await fetch(`${BASE_URL}/content?type=article`, { headers });

        let currentUserId = null;
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            currentUserId = parsed?._id || parsed?.id;
          } catch {}
        }

        if (artRes.ok) {
          const artData = await artRes.json();
          const mappedArticles = (artData.contents || []).map((art) => {
            let userVote = art.userVote || null;
            if (!userVote && currentUserId && Array.isArray(art.reactions)) {
              const r = art.reactions.find(
                (react) => (react.user?._id || react.user)?.toString() === currentUserId.toString()
              );
              if (r) userVote = r.vote;
            }
            return {
              ...art,
              userVote,
              thumbsUpCount: art.thumbsUpCount || 0,
              thumbsDownCount: art.thumbsDownCount || 0,
              thumbsUpRatio: art.thumbsUpRatio || 0,
            };
          });
          setArticles(mappedArticles);
        } else {
          setArticles([]);
        }

        // Fetch user bookmarks from DB if logged in
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
        setArticles([]);
      }
      setLoading(false);
    };

    loadData();
  }, [isLoggedIn]);

  const handleReaction = async (e, article, voteType) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) {
      if (onRequireLogin) {
        onRequireLogin("This feature requires login");
      } else {
        setToastMessage("Login required to react to this");
        setTimeout(() => setToastMessage(null), 2500);
      }
      return;
    }

    const rawId = article._id || article.id;
    const artId = rawId ? rawId.toString() : "";
    if (!artId) return;

    // Optimistically update
    const previousArticles = [...articles];
    setArticles((prev) =>
      prev.map((a) => {
        const id = (a._id || a.id)?.toString();
        if (id === artId) {
          const wasVote = a.userVote;
          let newVote = null;
          let up = a.thumbsUpCount || 0;
          let down = a.thumbsDownCount || 0;

          if (wasVote === voteType) {
            newVote = null;
            if (voteType === "up") up = Math.max(0, up - 1);
            if (voteType === "down") down = Math.max(0, down - 1);
          } else {
            newVote = voteType;
            if (voteType === "up") {
              up += 1;
              if (wasVote === "down") down = Math.max(0, down - 1);
            } else {
              down += 1;
              if (wasVote === "up") up = Math.max(0, up - 1);
            }
          }

          const total = up + down;
          const ratio = total > 0 ? Number(((up / total) * 100).toFixed(1)) : 0;

          return {
            ...a,
            userVote: newVote,
            thumbsUpCount: up,
            thumbsDownCount: down,
            thumbsUpRatio: ratio,
          };
        }
        return a;
      })
    );

    if (activePdfModal && ((activePdfModal._id || activePdfModal.id)?.toString() === artId)) {
      setActivePdfModal((prev) => {
        const wasVote = prev.userVote;
        const newVote = wasVote === voteType ? null : voteType;
        let up = prev.thumbsUpCount || 0;
        let down = prev.thumbsDownCount || 0;
        if (wasVote === voteType) {
          if (voteType === "up") up = Math.max(0, up - 1);
          if (voteType === "down") down = Math.max(0, down - 1);
        } else {
          if (voteType === "up") {
            up += 1;
            if (wasVote === "down") down = Math.max(0, down - 1);
          } else {
            down += 1;
            if (wasVote === "up") up = Math.max(0, up - 1);
          }
        }
        return { ...prev, userVote: newVote, thumbsUpCount: up, thumbsDownCount: down };
      });
    }

    try {
      const res = await fetch(`${BASE_URL}/content/${artId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vote: voteType }),
      });

      if (res.ok) {
        const data = await res.json();
        setArticles((prev) =>
          prev.map((a) => {
            const id = (a._id || a.id)?.toString();
            if (id === artId) {
              return {
                ...a,
                userVote: data.userVote,
                thumbsUpCount: data.thumbsUpCount,
                thumbsDownCount: data.thumbsDownCount,
                thumbsUpRatio: data.thumbsUpRatio,
              };
            }
            return a;
          })
        );
        if (data.userVote === "up") {
          setToastMessage("Added thumbs up!");
        } else if (data.userVote === "down") {
          setToastMessage("Added thumbs down!");
        } else {
          setToastMessage("Reaction removed");
        }
        setTimeout(() => setToastMessage(null), 2000);
      } else {
        setArticles(previousArticles);
      }
    } catch (err) {
      console.error("Failed to react to article:", err);
      setArticles(previousArticles);
    }
  };

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
            itemType: "content",
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

  const handleOpenPdfReader = (article) => {
    const pdfUrl = getArticlePdfUrl(article);
    const img = getArticleImage(article);
    setActivePdfModal({
      ...article,
      pdfUrl,
      image: img
    });
  };

  const handleSubmitFanContentClick = () => {
    if (!isLoggedIn) {
      if (onRequireLogin) {
        onRequireLogin("This feature requires login");
      } else {
        setToastMessage("You need to login first to submit fan content");
        setTimeout(() => {
          setToastMessage(null);
          if (onOpenAuth) {
            onOpenAuth("login");
          }
        }, 1500);
      }
      return;
    }
    if (onNavigateSubmit) {
      onNavigateSubmit();
    }
  };

  const filteredArticles = articles.filter((art) => {
    const catName = art.categoryId?.name || art.category || "";
    const matchesCat =
      activeCategory === "All" ||
      catName.toLowerCase().includes(activeCategory.toLowerCase()) ||
      (art.tags && art.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase())));

    const matchesSearch =
      !searchQuery.trim() ||
      (art.title && art.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.body && art.body.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.description && art.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      catName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full bg-[#FAF8F5] min-h-full py-6 px-4 sm:px-6 font-sans select-none text-[#171717]">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* PAGE HEADER */}
        <div className="pt-2 pb-1">
          <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
            FEATURED ARTICLES
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#7A6F64] mt-0.5">
            Stay updated with the latest articles, exclusive stories from across all fandoms.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md w-full relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#737373] pointer-events-none">
            <Search size={14} className="text-[#737373]" />
          </span>
          <input
            type="text"
            placeholder="Search articles..."
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

        {/* CATEGORY TABS */}
        <div className="pt-1 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-6 sm:gap-9 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`pb-2.5 text-xs sm:text-[13px] font-medium transition-all relative whitespace-nowrap cursor-pointer ${isActive ? "text-[#E05315] font-bold" : "text-[#525252] hover:text-[#171717]"
                    }`}
                >
                  <span>{cat}</span>
                  {isActive && <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#E05315] rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ARTICLES GRID */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[15px] font-black uppercase tracking-tight font-titan text-[#171717]">
              {activeCategory === "All" ? "FEATURED ARTICLES" : `${activeCategory.toUpperCase()} ARTICLES`}
            </h2>
            {loading && <Loader2 size={13} className="animate-spin text-stone-400 ml-2" />}
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-none border border-[#E5E7EB] p-8 text-center space-y-3">
              <p className="text-sm font-bold text-stone-500">
                No articles found matching "{activeCategory}".
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="px-4 py-1.5 bg-[#E05315] text-white text-xs font-extrabold rounded-none cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5.5">
              {filteredArticles.map((article, idx) => {
                const artId = article._id || article.id || `art-${idx}`;
                const catName = article.categoryId?.name || article.category || "Anime";
                const img = getArticleImage(article);
                const isBookmarked = bookmarkedIds.has(artId);
                const dateFormatted = formatDate(article.createdAt || article.date).full;
                const snippet =
                  article.body ||
                  article.description ||
                  article.desc ||
                  "Explore the latest stories and insights from the fandom community.";

                return (
                  <div
                    key={artId}
                    onClick={() => handleOpenPdfReader(article)}
                    className="bg-white rounded-none border border-[#E5E7EB] overflow-hidden shadow-xs hover:border-stone-300 transition-colors cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900 border-b border-[#E5E7EB]">
                      <img
                        src={img}
                        alt={article.title}
                        className="w-full h-full object-cover rounded-none"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-none uppercase tracking-wider shadow-xs ${getCategoryBadgeClass(
                            catName
                          )}`}
                        >
                          {catName}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(e, artId)}
                        className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/70 rounded-none text-white transition-colors cursor-pointer"
                        title="Bookmark"
                      >
                        <Bookmark
                          size={14}
                          className={
                            isBookmarked
                              ? "fill-[#FFA800] text-[#FFA800]"
                              : "text-white stroke-[2]"
                          }
                        />
                      </button>
                    </div>

                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-[14px] sm:text-[15px] text-[#171717] leading-snug line-clamp-2 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs text-[#737373] line-clamp-2 leading-relaxed">
                          {snippet}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                        <div className="flex items-center text-[11px] text-[#9CA3AF] font-medium">
                          <Calendar size={12} className="mr-1.5" />
                          <span>{dateFormatted}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded-none">
                            <button
                              type="button"
                              onClick={(e) => handleReaction(e, article, "up")}
                              className={`flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                                article.userVote === "up"
                                  ? "text-emerald-600 font-black"
                                  : "text-stone-500 hover:text-emerald-600"
                              }`}
                              title="Thumbs Up"
                            >
                              <ThumbsUp
                                size={12}
                                className={article.userVote === "up" ? "fill-emerald-600 text-emerald-600" : ""}
                              />
                              <span>{article.thumbsUpCount || 0}</span>
                            </button>

                            <span className="text-stone-300 text-[10px]">|</span>

                            <button
                              type="button"
                              onClick={(e) => handleReaction(e, article, "down")}
                              className={`flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                                article.userVote === "down"
                                  ? "text-rose-600 font-black"
                                  : "text-stone-500 hover:text-rose-600"
                              }`}
                              title="Thumbs Down"
                            >
                              <ThumbsDown
                                size={12}
                                className={article.userVote === "down" ? "fill-rose-600 text-rose-600" : ""}
                              />
                              <span>{article.thumbsDownCount || 0}</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPdfReader(article);
                            }}
                            className="inline-flex items-center gap-1.5 bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#5B21B6] font-extrabold text-[11.5px] py-1.5 px-3 rounded-none shadow-2xs transition-all active:scale-95 cursor-pointer"
                          >
                            <span>Read article</span>
                            <span className="text-sm leading-none">&rarr;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* BOTTOM BANNER: SUBMIT YOUR FAN CONTENT */}
        <section className="pt-2 pb-6">
          <div className="relative rounded-none overflow-hidden border border-[#E2E8F0] bg-gradient-to-r from-[#FAF8F5] via-[#EFF6FF] to-transparent shadow-xs flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 min-h-[96px]">
            <div className="absolute inset-y-0 right-0 w-2/3 sm:w-1/2 overflow-hidden pointer-events-none opacity-85">
              <img
                src="/src/assets/images/fan_content_banner_art_1790284032615.jpg"
                alt="Banner Illustration"
                className="w-full h-full object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#EFF6FF]/80 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <div>
                <h3 className="text-sm sm:text-[15px] font-black uppercase tracking-tight font-titan text-[#171717]">
                  Submit your fan content
                </h3>
                <p className="text-[11.5px] text-[#737373] font-medium">
                  Share your articles, artwork, and stories with the community.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-3 sm:pt-0">
              <button
                type="button"
                onClick={handleSubmitFanContentClick}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-[12px] py-2 px-4 rounded-none shadow-xs transition-all active:scale-[0.98] cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Submit content</span>
                <span className="text-sm leading-none">&rarr;</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1D24] border border-[#2B2F3D] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check size={14} className="text-[#FFA800]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ARTICLE PDF READER MODAL */}
      {activePdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-6">
          <div className="bg-[#181A20] border border-[#2B2F3D] text-white rounded-2xl max-w-4xl w-full h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#121418] border-b border-[#262A36] px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <span
                  className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-full uppercase shrink-0 ${getCategoryBadgeClass(
                    activePdfModal.categoryId?.name || activePdfModal.category
                  )}`}
                >
                  {activePdfModal.categoryId?.name || activePdfModal.category || "Article"}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-white truncate">
                  {activePdfModal.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg">
                  <button
                    type="button"
                    onClick={(e) => handleReaction(e, activePdfModal, "up")}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      activePdfModal.userVote === "up"
                        ? "text-emerald-400 font-black"
                        : "text-stone-300 hover:text-emerald-400"
                    }`}
                    title="Thumbs Up"
                  >
                    <ThumbsUp
                      size={13}
                      className={activePdfModal.userVote === "up" ? "fill-emerald-400 text-emerald-400" : ""}
                    />
                    <span>{activePdfModal.thumbsUpCount || 0}</span>
                  </button>

                  <span className="text-white/20 text-xs">|</span>

                  <button
                    type="button"
                    onClick={(e) => handleReaction(e, activePdfModal, "down")}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      activePdfModal.userVote === "down"
                        ? "text-rose-400 font-black"
                        : "text-stone-300 hover:text-rose-400"
                    }`}
                    title="Thumbs Down"
                  >
                    <ThumbsDown
                      size={13}
                      className={activePdfModal.userVote === "down" ? "fill-rose-400 text-rose-400" : ""}
                    />
                    <span>{activePdfModal.thumbsDownCount || 0}</span>
                  </button>
                </div>

                {activePdfModal.pdfUrl && (
                  <a
                    href={activePdfModal.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#262A36] hover:bg-[#323746] text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
                    title="Open PDF in new window"
                  >
                    <ExternalLink size={13} />
                    <span className="hidden sm:inline">Open PDF</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActivePdfModal(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#262A36] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: PDF Viewer or Article Content */}
            <div className="flex-1 w-full bg-[#0F1115] overflow-hidden relative">
              {activePdfModal.pdfUrl ? (
                <iframe
                  src={`${activePdfModal.pdfUrl}#toolbar=1`}
                  title={activePdfModal.title}
                  className="w-full h-full border-0 bg-white"
                />
              ) : (
                <div className="p-6 sm:p-8 max-w-2xl mx-auto space-y-4 overflow-y-auto h-full text-stone-200">
                  {activePdfModal.image && (
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-black mb-4">
                      <img
                        src={activePdfModal.image}
                        alt={activePdfModal.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-[#8E95A5]">
                    <Calendar size={13} />
                    <span>{formatDate(activePdfModal.createdAt || activePdfModal.date).full}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {activePdfModal.title}
                  </h1>
                  <div className="text-sm text-stone-300 leading-relaxed whitespace-pre-line pt-2">
                    {activePdfModal.body || activePdfModal.description || "No text content available for this article."}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#121418] border-t border-[#262A36] px-5 py-3 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-[#8E95A5]">Official FanHub Chronicle</span>
              <button
                type="button"
                onClick={() => setActivePdfModal(null)}
                className="px-4 py-1.5 bg-[#FFA800] hover:bg-[#FFB51A] text-black font-extrabold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ArticlesAndEventsPage };
