import { useState, useEffect, useRef } from "react";
import {
  Search,
  RotateCcw,
  Calendar,
  Flame,
  Bookmark,
  ChevronDown,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  X,
  ExternalLink,
  FileText,
  Star,
  Check,
  Volume2
} from "lucide-react";
import { BASE_URL } from "../api/api";

const SAMPLE_VIDEO_FALLBACK = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const SAMPLE_AUDIO_FALLBACK = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";

const formatSecondsToTime = (secs) => {
  if (secs === undefined || secs === null || isNaN(secs) || !isFinite(secs) || secs < 0) return null;
  const mins = Math.floor(secs / 60);
  const remainingSecs = Math.floor(secs % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
};

const isDirectVideoUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const clean = url.toLowerCase();
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg") ||
    clean.includes("/video/upload/") ||
    clean.includes(".mp4?")
  );
};

const isAudioUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const clean = url.toLowerCase();
  return clean.endsWith(".mp3") || clean.endsWith(".wav") || clean.endsWith(".ogg") || clean.endsWith(".m4a");
};

const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(ytRegex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }
  return null;
};

const getPdfUrl = (item) => {
  if (!item) return null;
  if (item.pdfUrl && typeof item.pdfUrl === "string") return item.pdfUrl;
  if (item.mediaUrl && typeof item.mediaUrl === "string" && item.mediaUrl.toLowerCase().includes(".pdf")) {
    return item.mediaUrl;
  }
  if (Array.isArray(item.images)) {
    const found = item.images.find((u) => typeof u === "string" && u.toLowerCase().includes(".pdf"));
    if (found) return found;
  }
  return null;
};

const getSafeCoverImage = (item) => {
  if (!item) return "/src/assets/images/one_piece_luffy_1790180189080.jpg";
  const candidates = [
    item.thumbnailUrl,
    item.thumbnail,
    item.posterImage,
    item.image,
    item.videoThumbnail,
    ...(Array.isArray(item.images) ? item.images : [])
  ];
  for (const url of candidates) {
    if (url && typeof url === "string" && !url.toLowerCase().includes(".pdf")) {
      return url;
    }
  }
  return "/src/assets/images/one_piece_luffy_1790180189080.jpg";
};

const getCategoryBadgeStyles = (catName) => {
  if (!catName) return "bg-gray-100 text-gray-800 border border-gray-200";
  const norm = catName.toLowerCase();
  if (norm.includes("anime")) return "bg-pink-50 text-pink-700 border border-pink-200";
  if (norm.includes("gaming") || norm.includes("game")) return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (norm.includes("movie") || norm.includes("film")) return "bg-amber-50 text-amber-800 border border-amber-200";
  if (norm.includes("tv")) return "bg-blue-50 text-blue-700 border border-blue-200";
  if (norm.includes("k-pop") || norm.includes("kpop") || norm.includes("music")) return "bg-purple-50 text-purple-700 border border-purple-200";
  if (norm.includes("comic")) return "bg-rose-50 text-rose-700 border border-rose-200";
  if (norm.includes("manga")) return "bg-orange-50 text-orange-700 border border-orange-200";
  if (norm.includes("cosplay")) return "bg-teal-50 text-teal-700 border border-teal-200";
  return "bg-amber-50 text-amber-800 border border-amber-200";
};

const ExploreContentModal = ({
  item,
  onClose,
  isLoggedIn,
  isBookmarked,
  onToggleBookmark,
  onReaction
}) => {
  const videoRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(() => {
    if (item.duration && item.duration !== "YOUTUBE" && item.duration !== "HD") {
      return item.duration;
    }
    return null;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const rawType = (item.type || "article").toLowerCase();
  const mediaUrl = item.mediaUrl || "";
  const pdfUrl = getPdfUrl(item);
  const isPdfArticle = rawType === "article" && pdfUrl;
  const ytEmbed = getYouTubeEmbedUrl(mediaUrl);
  const isDirectVideo = isDirectVideoUrl(mediaUrl);
  const isVideo = rawType === "video" || ytEmbed || isDirectVideo;
  const isAudio = rawType === "audio" || isAudioUrl(mediaUrl);
  const isImage = rawType === "image" || (!isVideo && !isAudio && !isPdfArticle && item.images && item.images.length > 0);
  const safeCover = getSafeCoverImage(item);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-[#181A20] border border-[#2B2F3D] text-white rounded-none w-full overflow-hidden shadow-2xl relative my-auto flex flex-col ${
          isPdfArticle ? "max-w-5xl h-[90vh]" : "max-w-3xl max-h-[90vh]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#1F2330] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold text-[#FFA800] uppercase tracking-wider bg-white/10 px-2 py-0.5 border border-white/15">
              {item.category || "FANDOM"}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-[10px] sm:text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1">
              {isPdfArticle && <FileText size={12} className="text-[#FFA800]" />}
              {rawType.toUpperCase()}
            </span>
            {isPdfArticle && (
              <span className="hidden sm:inline-block text-[10px] bg-red-600/80 text-white font-bold px-1.5 py-0.2 rounded-xs">
                PDF
              </span>
            )}
            {videoDuration && (
              <span className="hidden sm:inline-block text-xs font-semibold text-stone-300">
                Duration: {videoDuration}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Thumbs Up & Thumbs Down Reactions */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-2.5 py-1">
              <button
                type="button"
                onClick={(e) => onReaction && onReaction(e, item, "up")}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  item.userVote === "up"
                    ? "text-emerald-400 font-black"
                    : "text-stone-300 hover:text-emerald-400"
                }`}
                title="Thumbs Up"
              >
                <ThumbsUp
                  size={13}
                  className={item.userVote === "up" ? "fill-emerald-400 text-emerald-400" : ""}
                />
                <span>{item.thumbsUpCount || 0}</span>
              </button>

              <span className="text-white/20 text-xs">|</span>

              <button
                type="button"
                onClick={(e) => onReaction && onReaction(e, item, "down")}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  item.userVote === "down"
                    ? "text-rose-400 font-black"
                    : "text-stone-300 hover:text-rose-400"
                }`}
                title="Thumbs Down"
              >
                <ThumbsDown
                  size={13}
                  className={item.userVote === "down" ? "fill-rose-400 text-rose-400" : ""}
                />
                <span>{item.thumbsDownCount || 0}</span>
              </button>
            </div>

            {/* External PDF link */}
            {isPdfArticle && pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 transition-colors"
                title="Open PDF in new tab"
              >
                <ExternalLink size={12} />
                <span>Open in Tab</span>
              </a>
            )}

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={(e) => onToggleBookmark && onToggleBookmark(e, item)}
              className={`p-1.5 border transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-[#FF5F1F] border-[#FF5F1F] text-white"
                  : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
              }`}
              title={isBookmarked ? "Saved in library" : "Save Bookmark"}
            >
              {isBookmarked ? <Check size={14} /> : <Bookmark size={14} />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Media or Visual Section */}
        {isPdfArticle ? (
          <div className="flex-1 w-full bg-[#0F1115] overflow-hidden relative min-h-[350px]">
            <iframe
              src={`${pdfUrl}#toolbar=1`}
              title={item.title}
              className="w-full h-full border-0 bg-white"
            />
          </div>
        ) : (
          <div className="relative w-full bg-black shrink-0 overflow-hidden flex items-center justify-center">
            {isVideo ? (
              <div className="aspect-[16/9] w-full bg-black flex items-center justify-center">
                {ytEmbed ? (
                  <iframe
                    src={ytEmbed}
                    title={item.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={mediaUrl || SAMPLE_VIDEO_FALLBACK}
                    poster={safeCover}
                    controls
                    autoPlay
                    playsInline
                    onLoadedMetadata={(e) => {
                      if (e.target.duration && isFinite(e.target.duration)) {
                        const formatted = formatSecondsToTime(e.target.duration);
                        if (formatted) setVideoDuration(formatted);
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ) : isImage ? (
              <div className="max-h-[50vh] w-full bg-black flex items-center justify-center p-2">
                <img
                  src={mediaUrl || safeCover}
                  alt={item.title}
                  className="max-h-[48vh] w-auto max-w-full object-contain"
                />
              </div>
            ) : isAudio ? (
              <div className="w-full bg-[#1F2330] p-6 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#FFA800]">
                  <Volume2 size={36} />
                </div>
                <div className="w-full max-w-md">
                  <audio
                    src={mediaUrl || SAMPLE_AUDIO_FALLBACK}
                    controls
                    autoPlay
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="relative aspect-[21/9] sm:aspect-[16/6] w-full bg-black overflow-hidden">
                <img
                  src={safeCover}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181A20] via-transparent to-black/40" />
              </div>
            )}
          </div>
        )}

        {/* Audio Player bar */}
        {isAudio && mediaUrl && (
          <div className="p-3 bg-[#1F2330] border-b border-white/10 shrink-0">
            <audio src={mediaUrl} controls className="w-full h-9" />
          </div>
        )}

        {/* Content Body & Info */}
        {isPdfArticle ? (
          <div className="px-4 sm:px-5 py-2.5 bg-[#121418] border-t border-white/10 flex items-center justify-between gap-3 text-xs shrink-0">
            <div className="truncate">
              <span className="font-bold text-white">{item.title}</span>
              {item.body && <span className="text-stone-400 ml-2 hidden sm:inline truncate">— {item.body}</span>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1 bg-[#F59E0B] hover:bg-[#D97706] text-black font-extrabold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-[#181A20] flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-xl font-extrabold text-white leading-snug tracking-tight">
                    {item.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mt-1 flex-wrap font-medium">
                    {item.year && <span>{item.year}</span>}
                    {item.year && <span>•</span>}
                    <span>{item.uploader ? `By ${item.uploader}` : "Community Contribution"}</span>
                    {item.rating && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#FFA800] font-bold">
                          <Star size={12} className="fill-[#FFA800]" /> {item.rating}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-stone-300 leading-relaxed space-y-2 whitespace-pre-line">
                {item.body || item.content || item.desc || item.synopsis || "Explore complete community-curated character dossiers, episode summaries, lore progression charts, and interactive walkthroughs for this title."}
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/10">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white/10 border border-white/15 text-stone-300 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Footer Actions */}
            <div className="px-4 sm:px-6 py-3 bg-[#1F2330] border-t border-white/10 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={(e) => onToggleBookmark && onToggleBookmark(e, item)}
                className="text-xs font-bold text-[#FFA800] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark size={13} />
                <span>{isBookmarked ? "Saved to Bookmarks" : "Save Bookmark"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-black font-extrabold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ExplorePage = ({
  onOpenArticle,
  isLoggedIn = false,
  savedItemIds,
  onToggleSaveItem,
  onRequireLogin
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedPopularity, setSelectedPopularity] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const [visibleCount, setVisibleCount] = useState(15);

  const [categories, setCategories] = useState([]);
  const [contentCards, setContentCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [bookmarkedIds, setBookmarkedIds] = useState(() => savedItemIds || new Set());
  const [bookmarkMap, setBookmarkMap] = useState({});
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  useEffect(() => {
    if (savedItemIds) {
      setBookmarkedIds(new Set(savedItemIds));
    }
  }, [savedItemIds]);

  // Fetch bookmarks from DB if logged in
  useEffect(() => {
    const fetchUserBookmarks = async () => {
      const token = localStorage.getItem("token");
      if (!isLoggedIn || !token) return;

      try {
        const res = await fetch(`${BASE_URL}/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const ids = new Set();
          const bMap = {};
          (data.bookmarks || []).forEach((b) => {
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
      } catch (err) {
        console.error("Failed to load user bookmarks:", err);
      }
    };

    fetchUserBookmarks();
  }, [isLoggedIn]);

  // Fetch categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/categories`);
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch all contents from DB
  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${BASE_URL}/content`, { headers });
        const data = await res.json();

        let currentUserId = null;
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            currentUserId = parsed?._id || parsed?.id;
          } catch {}
        }

        if (data.success && Array.isArray(data.contents)) {
          const formatted = data.contents.map((item) => {
            const rawType = (item.type || "article").toLowerCase();
            const categoryName = item.categoryId?.name || item.category || "Fandom";
            const yearStr = item.year || (item.createdAt ? new Date(item.createdAt).getFullYear().toString() : "2025");
            const isYT = !!getYouTubeEmbedUrl(item.mediaUrl);
            const initialDuration = item.duration && item.duration.trim() !== ""
              ? item.duration
              : isYT
              ? "YOUTUBE"
              : "HD";

            let userVote = item.userVote || null;
            if (!userVote && currentUserId && Array.isArray(item.reactions)) {
              const r = item.reactions.find(
                (react) => (react.user?._id || react.user)?.toString() === currentUserId.toString()
              );
              if (r) userVote = r.vote;
            }

            const cover = getSafeCoverImage(item);
            const tagsList = Array.isArray(item.tags) ? item.tags : [];

            return {
              id: item._id,
              _id: item._id,
              title: item.title,
              category: categoryName,
              type: rawType,
              year: yearStr,
              createdAt: item.createdAt,
              duration: initialDuration,
              rating: item.thumbsUpRatio ? (item.thumbsUpRatio / 20).toFixed(1) : "5.0",
              popularity: item.popularityScore ? `${item.popularityScore}K` : `${(item.thumbsUpCount || 0) * 10 + 100}`,
              popularityScore: item.popularityScore || 0,
              image: cover,
              posterImage: cover,
              thumbnailUrl: item.thumbnailUrl,
              videoThumbnail: cover,
              mediaUrl: item.mediaUrl || "",
              images: item.images || [],
              body: item.body || item.content || "",
              tags: tagsList,
              thumbsUpCount: item.thumbsUpCount || 0,
              thumbsDownCount: item.thumbsDownCount || 0,
              thumbsUpRatio: item.thumbsUpRatio || 0,
              userVote: userVote,
              reactions: item.reactions || []
            };
          });

          setContentCards(formatted);
        } else {
          setContentCards([]);
        }
      } catch (err) {
        console.error("Failed to load content for explore page:", err);
        setContentCards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, [isLoggedIn]);

  // Handle reaction Thumbs Up / Down
  const handleReaction = async (e, item, voteType) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) {
      if (onRequireLogin) {
        onRequireLogin("This feature requires login");
      } else {
        showToast("Login required to react to content");
      }
      return;
    }

    const itemId = item.id || item._id;
    if (!itemId) return;

    // Optimistic state update
    const previousCards = [...contentCards];
    setContentCards((prev) =>
      prev.map((c) => {
        if (c.id === itemId) {
          const wasVote = c.userVote;
          let newVote = null;
          let up = c.thumbsUpCount || 0;
          let down = c.thumbsDownCount || 0;

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
            ...c,
            userVote: newVote,
            thumbsUpCount: up,
            thumbsDownCount: down,
            thumbsUpRatio: ratio,
            rating: ratio ? (ratio / 20).toFixed(1) : "5.0"
          };
        }
        return c;
      })
    );

    if (activeModalItem && (activeModalItem.id === itemId || activeModalItem._id === itemId)) {
      setActiveModalItem((prev) => {
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
      const res = await fetch(`${BASE_URL}/content/${itemId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ vote: voteType })
      });

      if (res.ok) {
        const data = await res.json();
        setContentCards((prev) =>
          prev.map((c) => {
            if (c.id === itemId) {
              return {
                ...c,
                userVote: data.userVote,
                thumbsUpCount: data.thumbsUpCount,
                thumbsDownCount: data.thumbsDownCount,
                thumbsUpRatio: data.thumbsUpRatio,
                rating: data.thumbsUpRatio ? (data.thumbsUpRatio / 20).toFixed(1) : "5.0"
              };
            }
            return c;
          })
        );
        if (data.userVote === "up") {
          showToast("Added thumbs up!");
        } else if (data.userVote === "down") {
          showToast("Added thumbs down!");
        } else {
          showToast("Reaction removed");
        }
      } else {
        setContentCards(previousCards);
      }
    } catch (err) {
      console.error("Failed to react:", err);
      setContentCards(previousCards);
    }
  };

  // Handle bookmark toggle
  const handleToggleBookmark = async (e, item) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) {
      if (onRequireLogin) {
        onRequireLogin("This feature requires login");
      } else {
        showToast("Login required to bookmark this");
      }
      return;
    }

    if (onToggleSaveItem) {
      onToggleSaveItem(item);
    }

    const rawId = item.id || item._id;
    const id = rawId ? rawId.toString() : "";
    if (!id) return;

    const isCurrentlySaved = bookmarkedIds.has(id);

    if (isCurrentlySaved) {
      const bookmarkId = bookmarkMap[id];
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast("Removed from bookmarks");

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
            return bId && bId.toString() === id;
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
      setBookmarkedIds((prev) => new Set([...prev, id]));
      showToast("Saved to bookmarks!");

      try {
        const res = await fetch(`${BASE_URL}/bookmarks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            itemType: "content",
            itemId: id
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.bookmark?._id) {
            setBookmarkMap((prev) => ({ ...prev, [id]: data.bookmark._id }));
          }
        }
      } catch (err) {
        console.error("Failed to save bookmark:", err);
      }
    }
  };

  const handleCardClick = (card) => {
    setActiveModalItem(card);
    if (onOpenArticle) {
      onOpenArticle(card);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedType("All");
    setSelectedPopularity("All");
    setSelectedTag("All");
    setSortBy("Latest");
  };

  // Dynamic lists for filters
  const categoryNamesList = ["All", ...new Set([
    "Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay",
    ...categories.map((c) => c.name)
  ])];

  const uniqueTags = ["All", ...new Set(
    contentCards.flatMap((c) => (Array.isArray(c.tags) ? c.tags : []))
  )];

  // Filter content
  const filteredCards = contentCards.filter((card) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      card.title.toLowerCase().includes(q) ||
      card.body.toLowerCase().includes(q) ||
      (card.tags && card.tags.some((t) => t.toLowerCase().includes(q))) ||
      card.category.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === "All" ||
      card.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();

    const matchesType =
      selectedType === "All" ||
      card.type.toLowerCase() === selectedType.toLowerCase();

    const matchesPopularity =
      selectedPopularity === "All" ||
      (selectedPopularity === "High" && ((card.thumbsUpCount || 0) >= 5 || (card.popularityScore || 0) >= 5)) ||
      (selectedPopularity === "Medium" && ((card.thumbsUpCount || 0) >= 1 || (card.popularityScore || 0) >= 1));

    const matchesTag =
      selectedTag === "All" ||
      (Array.isArray(card.tags) && card.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()));

    return matchesSearch && matchesCategory && matchesType && matchesPopularity && matchesTag;
  });

  // Sort content by Latest or Popular
  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === "Latest") {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA && timeB && timeA !== timeB) {
        return timeB - timeA;
      }
      return (b.id || "").localeCompare(a.id || "");
    }
    if (sortBy === "Popular") {
      const scoreA = (a.thumbsUpCount || 0) * 10 + (a.popularityScore || 0);
      const scoreB = (b.thumbsUpCount || 0) * 10 + (b.popularityScore || 0);
      return scoreB - scoreA;
    }
    return 0;
  });

  const displayedCards = sortedCards.slice(0, visibleCount);

  return (
    <div className="w-full antialiased select-none bg-[#FAF8F5] min-h-screen font-baloo pb-16 relative">
      
      {/* 1. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F2330] text-amber-400 border border-amber-500/30 px-4 py-2.5 rounded-lg shadow-xl text-xs font-black tracking-wide uppercase animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* 2. HEADER BANNER */}
      <div className="relative w-full h-[180px] sm:h-[200px] overflow-hidden bg-zinc-950 border-b border-[#F0E8DD]">
        <img
          src="/src/assets/images/fandom_banner_1790273074334.jpg"
          alt="Content Explorer Cover"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.70] opacity-90 contrast-[1.1]"
        />
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-12 z-10">
          <div className="flex flex-col text-white">
            <h1 className="text-3xl sm:text-4.5xl font-black tracking-wider uppercase font-titan drop-shadow-md text-white">
              CONTENT EXPLORER
            </h1>
            <p className="text-sm sm:text-base font-extrabold text-amber-300 drop-shadow-xs mt-1">
              Discover amazing content from your favorite fandoms.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-stone-300 mt-1">
              Articles, videos, and more — all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* 3. FILTER BAR (Categories / Content Type / Popularity / Tags / Clear Filters) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-white border border-[#EBE6DD] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-wrap items-center gap-3">
          
          {/* Keyword Search */}
          <div className="flex-1 min-w-[200px] relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8E8272] pointer-events-none">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search by title, tag or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-bold pl-9 pr-4 py-3 rounded-lg border border-[#EDE4D6] focus:outline-none focus:border-[#FF5F1F] bg-[#FAF9F5] text-[#231C14]"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-[140px] flex flex-col gap-1">
            <span className="text-[9px] font-black text-[#8E8272] uppercase tracking-wider pl-1">Categories</span>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-lg border border-[#EDE4D6] bg-[#FAF9F5] text-[#231C14] appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer pr-7"
              >
                {categoryNamesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-3.5 text-[#8E8272] pointer-events-none" />
            </div>
          </div>

          {/* Content Type Dropdown */}
          <div className="w-[140px] flex flex-col gap-1">
            <span className="text-[9px] font-black text-[#8E8272] uppercase tracking-wider pl-1">Content Type</span>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-lg border border-[#EDE4D6] bg-[#FAF9F5] text-[#231C14] appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer pr-7"
              >
                <option value="All">All Types</option>
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-3.5 text-[#8E8272] pointer-events-none" />
            </div>
          </div>

          {/* Popularity Dropdown */}
          <div className="w-[140px] flex flex-col gap-1">
            <span className="text-[9px] font-black text-[#8E8272] uppercase tracking-wider pl-1">Popularity</span>
            <div className="relative">
              <select
                value={selectedPopularity}
                onChange={(e) => setSelectedPopularity(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-lg border border-[#EDE4D6] bg-[#FAF9F5] text-[#231C14] appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer pr-7"
              >
                <option value="All">All Levels</option>
                <option value="High">Most Popular</option>
                <option value="Medium">Trending (1+ Likes)</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-3.5 text-[#8E8272] pointer-events-none" />
            </div>
          </div>

          {/* Tags Dropdown */}
          <div className="w-[140px] flex flex-col gap-1">
            <span className="text-[9px] font-black text-[#8E8272] uppercase tracking-wider pl-1">Tags</span>
            <div className="relative">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-lg border border-[#EDE4D6] bg-[#FAF9F5] text-[#231C14] appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer pr-7"
              >
                {uniqueTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag === "All" ? "All Tags" : `#${tag}`}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-3.5 text-[#8E8272] pointer-events-none" />
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 bg-white hover:bg-stone-50 border border-[#EDE4D6] text-[#4A3E31] px-4 py-3 rounded-lg text-xs font-extrabold tracking-wider uppercase cursor-pointer self-end shadow-xs"
          >
            <RotateCcw size={13} className="text-[#8E8272]" />
            <span>Clear Filters</span>
          </button>

        </div>
      </div>

      {/* 4. RESULTS SUBHEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 flex items-center justify-between">
        <span className="text-xs font-black tracking-wide text-[#231C14]">
          Showing <span className="text-[#FF5F1F]">{sortedCards.length}</span> results
        </span>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-[#8E8272] uppercase tracking-wider">Sort by</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-black border border-[#EDE4D6] rounded-md px-3 py-1.5 bg-white text-[#231C14] cursor-pointer appearance-none pr-7"
            >
              <option value="Latest">Latest</option>
              <option value="Popular">Popularity</option>
            </select>
            <ChevronDown size={11} className="absolute right-2 top-2.5 text-[#8E8272] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 5. RESULTS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-stone-200 rounded-none h-64 border border-[#EDE4D6]" />
            ))}
          </div>
        ) : displayedCards.length === 0 ? (
          <div className="bg-white border border-[#EDE4D6] rounded-none py-12 text-center">
            <p className="text-sm font-bold text-[#8E8272]">No matching content items found.</p>
            <button
              onClick={handleClearFilters}
              className="text-xs font-extrabold text-[#FF5F1F] uppercase tracking-widest mt-3 underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayedCards.map((card) => {
              const cardId = card.id || card._id;
              const isSaved = bookmarkedIds.has(cardId ? cardId.toString() : "");
              const isPdf = getPdfUrl(card);

              return (
                <div
                  key={cardId}
                  onClick={() => handleCardClick(card)}
                  className="bg-white hover:bg-stone-50 rounded-none flex flex-col justify-between shadow-2xs transition-colors cursor-pointer group border border-[#EDE4D6] text-gray-900 overflow-hidden"
                  style={{ minHeight: "270px" }}
                >
                  {/* Image area */}
                  <div className="relative h-36 w-full overflow-hidden bg-stone-900 shrink-0 border-b border-[#EDE4D6]">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover rounded-none"
                      loading="lazy"
                    />
                    
                    {/* Top-Right Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleBookmark(e, card)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-none bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 hover:bg-[#FF5F1F] hover:text-white transition-colors cursor-pointer"
                      title={isSaved ? "Bookmarked" : "Bookmark this"}
                    >
                      <Bookmark
                        size={13}
                        className={isSaved ? "fill-[#FFA800] text-[#FFA800]" : "text-white"}
                      />
                    </button>

                    {/* Category Overlay */}
                    <div className={`absolute bottom-2 left-2 font-black text-[9.5px] px-2 py-0.5 rounded-none tracking-wider uppercase shadow-xs ${getCategoryBadgeStyles(card.category)}`}>
                      {card.category}
                    </div>

                    {/* Content Type Tag */}
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-[#EAEAEA] font-black text-[9px] px-2 py-0.5 rounded-none tracking-wider uppercase border border-white/20 flex items-center gap-1">
                      {isPdf && <span className="text-red-400 font-bold">PDF</span>}
                      <span>{card.type.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Details Card Content */}
                  <div className="p-3 flex-1 flex flex-col justify-between bg-white group-hover:bg-stone-50 transition-colors">
                    <h3 className="font-bold text-xs sm:text-[13px] leading-snug text-stone-900 group-hover:text-[#FF5F1F] transition-colors line-clamp-2">
                      {card.title}
                    </h3>

                    {/* Meta row at bottom */}
                    <div className="flex items-center justify-between border-t border-[#EDE4D6] pt-2 mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold uppercase tracking-tight">
                        <Calendar size={11} className="stroke-[2] text-stone-400 shrink-0" />
                        <span>{card.year}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {/* Reaction quick indicator */}
                        <div className="flex items-center gap-1 text-emerald-700 text-[10px] font-bold">
                          <ThumbsUp size={11} className={card.userVote === "up" ? "fill-emerald-600 text-emerald-600" : "text-emerald-600"} />
                          <span>{card.thumbsUpCount || 0}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[#FF5F1F] text-[10px] font-bold uppercase tracking-tight">
                          <Flame size={11} className="stroke-[2.5]" />
                          <span>{card.popularity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. LOAD MORE BUTTON */}
      {sortedCards.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="flex items-center gap-2 bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-xs tracking-widest uppercase px-8 py-3.5 rounded-lg shadow-md border border-[#E6B800] active:scale-[0.98] transition-all cursor-pointer"
          >
            <RefreshCw size={13} className="stroke-[3]" />
            <span>LOAD MORE</span>
          </button>
        </div>
      )}

      {/* 7. DYNAMIC CONTENT MODAL */}
      {activeModalItem && (
        <ExploreContentModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
          isLoggedIn={isLoggedIn}
          isBookmarked={bookmarkedIds.has(activeModalItem.id ? activeModalItem.id.toString() : (activeModalItem._id ? activeModalItem._id.toString() : ""))}
          onToggleBookmark={handleToggleBookmark}
          onReaction={handleReaction}
        />
      )}

    </div>
  );
};

export { ExplorePage };
