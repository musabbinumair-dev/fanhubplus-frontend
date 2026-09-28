import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Bookmark,
  LayoutGrid,
  CircleDot,
  Gamepad2,
  Film,
  Tv,
  Music,
  BookOpen,
  Book,
  Smile,
  Headphones,
  Sparkles,
  Star,
  Check,
  Search,
  X,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { BASE_URL } from "../api/api";

const SAMPLE_VIDEO_FALLBACK = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const SAMPLE_AUDIO_FALLBACK = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";

// Format seconds into MM:SS
const formatSecondsToTime = (secs) => {
  if (secs === undefined || secs === null || isNaN(secs) || !isFinite(secs) || secs < 0) return null;
  const mins = Math.floor(secs / 60);
  const remainingSecs = Math.floor(secs % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
};

// Helper to check if a URL is a direct video
const isDirectVideoUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return (
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".ogg") ||
    url.includes("/video/upload/") ||
    url.includes(".mp4?")
  );
};

// Helper to check if a URL is YouTube and get clean embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(ytRegex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }
  return null;
};

// Video Player Modal
const VideoPlayerModal = ({ video, onClose, onReaction, onBookmark, isBookmarked }) => {
  const [videoDuration, setVideoDuration] = useState(() => {
    if (video.duration && video.duration !== "YOUTUBE" && video.duration !== "HD") {
      return video.duration;
    }
    return null;
  });
  const videoRef = useRef(null);

  const ytEmbed = getYouTubeEmbedUrl(video.mediaUrl);
  const directVideo = isDirectVideoUrl(video.mediaUrl) ? video.mediaUrl : SAMPLE_VIDEO_FALLBACK;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#181A20] border border-[#2B2F3D] text-white rounded-none max-w-3xl w-full overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/9] w-full bg-black flex items-center justify-center">
          {ytEmbed ? (
            <iframe
              src={ytEmbed}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              ref={videoRef}
              src={directVideo}
              poster={video.thumbnail || video.mediaUrl}
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

        <div className="p-5 bg-[#1F2330]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-[#FFA800] uppercase tracking-widest">
                  {video.category}
                </span>
                {videoDuration && (
                  <>
                    <span className="text-stone-500">•</span>
                    <span className="text-xs font-semibold text-stone-300">
                      Duration: {videoDuration}
                    </span>
                  </>
                )}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {video.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-2.5 py-1">
                <button
                  type="button"
                  onClick={(e) => onReaction && onReaction(e, video, "up")}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    video.userVote === "up"
                      ? "text-emerald-400 font-black"
                      : "text-stone-300 hover:text-emerald-400"
                  }`}
                  title="Thumbs Up"
                >
                  <ThumbsUp
                    size={13}
                    className={video.userVote === "up" ? "fill-emerald-400 text-emerald-400" : ""}
                  />
                  <span>{video.thumbsUpCount || 0}</span>
                </button>

                <span className="text-white/20 text-xs">|</span>

                <button
                  type="button"
                  onClick={(e) => onReaction && onReaction(e, video, "down")}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    video.userVote === "down"
                      ? "text-rose-400 font-black"
                      : "text-stone-300 hover:text-rose-400"
                  }`}
                  title="Thumbs Down"
                >
                  <ThumbsDown
                    size={13}
                    className={video.userVote === "down" ? "fill-rose-400 text-rose-400" : ""}
                  />
                  <span>{video.thumbsDownCount || 0}</span>
                </button>
              </div>

              {onBookmark && (
                <button
                  type="button"
                  onClick={(e) => onBookmark(e, video)}
                  className="p-1.5 bg-white/10 hover:bg-white/25 border border-white/20 text-white rounded-none cursor-pointer"
                  title={isBookmarked ? "Bookmarked" : "Bookmark this"}
                >
                  <Bookmark
                    size={14}
                    className={isBookmarked ? "fill-[#FFA800] text-[#FFA800]" : "text-white"}
                  />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/25 border border-white/20 text-white font-extrabold text-xs rounded-none transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            {video.body || "Playing media from the fan community archives."}
          </p>
        </div>
      </div>
    </div>
  );
};

// Image Viewer Modal
const ImageViewerModal = ({ image, onClose, onBookmark, isBookmarked, onReaction }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const imageUrl = image.mediaUrl || image.thumbnail || "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#181A20] border border-[#2B2F3D] text-white rounded-none max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1F2330] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#FFA800] uppercase tracking-widest">
              {image.category}
            </span>
            <span className="text-stone-500">•</span>
            <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
              {image.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-2 py-1 rounded-none">
              <button
                type="button"
                onClick={(e) => onReaction && onReaction(e, image, "up")}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  image.userVote === "up"
                    ? "text-emerald-400 font-black"
                    : "text-stone-300 hover:text-emerald-400"
                }`}
                title="Thumbs Up"
              >
                <ThumbsUp
                  size={13}
                  className={image.userVote === "up" ? "fill-emerald-400 text-emerald-400" : ""}
                />
                <span>{image.thumbsUpCount || 0}</span>
              </button>

              <span className="text-white/20 text-xs">|</span>

              <button
                type="button"
                onClick={(e) => onReaction && onReaction(e, image, "down")}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  image.userVote === "down"
                    ? "text-rose-400 font-black"
                    : "text-stone-300 hover:text-rose-400"
                }`}
                title="Thumbs Down"
              >
                <ThumbsDown
                  size={13}
                  className={image.userVote === "down" ? "fill-rose-400 text-rose-400" : ""}
                />
                <span>{image.thumbsDownCount || 0}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={(e) => onBookmark && onBookmark(e, image)}
              className="p-1.5 rounded-none bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isBookmarked ? "Bookmarked" : "Save Bookmark"}
            >
              <Bookmark
                size={14}
                className={isBookmarked ? "fill-[#FFA800] text-[#FFA800]" : "text-white"}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-none bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center p-2 overflow-hidden">
          <img
            src={imageUrl}
            alt={image.title}
            className="max-h-[65vh] w-auto max-w-full object-contain rounded-none shadow-lg"
          />
        </div>

        {/* Bottom Details */}
        <div className="p-4 bg-[#1F2330] border-t border-white/10 flex items-center justify-between text-xs shrink-0">
          <p className="text-stone-400 line-clamp-2 max-w-xl">
            {image.body || "High resolution visual artwork from the fandom gallery."}
          </p>
          <div className="flex items-center gap-1 font-bold text-[#FFA800] shrink-0 ml-4">
            <Star size={14} className="fill-[#FFA800]" />
            <span>{image.rating || "5.0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MultimediaCenterPage = ({
  onNavigateHome,
  selectedCategory = "All",
  isLoggedIn = false,
  onOpenAuth,
  onToggleSaveItem,
  savedItemIds,
  onRequireLogin
}) => {
  const [categories, setCategories] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [activeMediaType, setActiveMediaType] = useState("all");
  const [activeFandom, setActiveFandom] = useState(() => selectedCategory || "All");
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [activeModalImage, setActiveModalImage] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => savedItemIds || new Set());
  const [bookmarkMap, setBookmarkMap] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef(null);

  useEffect(() => {
    if (selectedCategory) {
      setActiveFandom(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (savedItemIds) {
      setBookmarkedIds(new Set(savedItemIds));
    }
  }, [savedItemIds]);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/categories`);
        const data = await response.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`${BASE_URL}/content`, { headers });
        const data = await response.json();

        let currentUserId = null;
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            currentUserId = parsed?._id || parsed?.id;
          } catch {}
        }

        if (data.success && Array.isArray(data.contents)) {
          const nonArticles = data.contents
            .filter((item) => item.type && item.type.toLowerCase() !== "article")
            .map((item) => {
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

              return {
                id: item._id,
                _id: item._id,
                title: item.title,
                category: item.categoryId?.name || "General",
                type: item.type.toLowerCase(),
                thumbnail: item.thumbnailUrl || item.mediaUrl || "",
                mediaUrl: item.mediaUrl || item.thumbnailUrl || "",
                duration: initialDuration,
                rating: item.thumbsUpRatio ? (item.thumbsUpRatio / 20).toFixed(1) : "5.0",
                tags: item.tags || [],
                body: item.body || "",
                thumbsUpCount: item.thumbsUpCount || 0,
                thumbsDownCount: item.thumbsDownCount || 0,
                thumbsUpRatio: item.thumbsUpRatio || 0,
                userVote: userVote,
                reactions: item.reactions || []
              };
            });

          setMediaItems(nonArticles);

          // Dynamically detect real media durations for direct video/audio files
          nonArticles.forEach((item) => {
            if (isDirectVideoUrl(item.mediaUrl) || item.mediaUrl?.endsWith(".mp3")) {
              const tempMedia = document.createElement(item.type === "audio" ? "audio" : "video");
              tempMedia.src = item.mediaUrl;
              tempMedia.preload = "metadata";
              tempMedia.onloadedmetadata = () => {
                if (tempMedia.duration && isFinite(tempMedia.duration)) {
                  const formatted = formatSecondsToTime(tempMedia.duration);
                  if (formatted) {
                    setMediaItems((prev) =>
                      prev.map((m) => (m.id === item.id ? { ...m, duration: formatted } : m))
                    );
                  }
                }
              };
            }
          });
        } else {
          setMediaItems([]);
        }
      } catch (err) {
        setMediaItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, [isLoggedIn]);

  const handleReaction = async (e, item, voteType) => {
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

    const itemId = item.id || item._id;
    if (!itemId) return;

    // Optimistic update
    const previousItems = [...mediaItems];
    setMediaItems((prev) =>
      prev.map((m) => {
        if (m.id === itemId) {
          const wasVote = m.userVote;
          let newVote = null;
          let up = m.thumbsUpCount || 0;
          let down = m.thumbsDownCount || 0;

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
            ...m,
            userVote: newVote,
            thumbsUpCount: up,
            thumbsDownCount: down,
            thumbsUpRatio: ratio,
            rating: ratio ? (ratio / 20).toFixed(1) : "5.0"
          };
        }
        return m;
      })
    );

    if (activeModalVideo && (activeModalVideo.id === itemId || activeModalVideo._id === itemId)) {
      setActiveModalVideo((prev) => {
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

    if (activeModalImage && (activeModalImage.id === itemId || activeModalImage._id === itemId)) {
      setActiveModalImage((prev) => {
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
        setMediaItems((prev) =>
          prev.map((m) => {
            if (m.id === itemId) {
              return {
                ...m,
                userVote: data.userVote,
                thumbsUpCount: data.thumbsUpCount,
                thumbsDownCount: data.thumbsDownCount,
                thumbsUpRatio: data.thumbsUpRatio,
                rating: data.thumbsUpRatio ? (data.thumbsUpRatio / 20).toFixed(1) : "5.0"
              };
            }
            return m;
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
        setMediaItems(previousItems);
      }
    } catch (err) {
      console.error("Failed to react to content:", err);
      setMediaItems(previousItems);
    }
  };

  // Handle audio play/pause
  const handleToggleAudio = (track) => {
    if (!audioRef.current) return;

    if (playingAudioId === track.id) {
      audioRef.current.pause();
      setPlayingAudioId(null);
    } else {
      const audioUrl = isDirectVideoUrl(track.mediaUrl) || track.mediaUrl?.endsWith(".mp3")
        ? track.mediaUrl
        : SAMPLE_AUDIO_FALLBACK;

      audioRef.current.src = audioUrl;
      audioRef.current
        .play()
        .then(() => {
          setPlayingAudioId(track.id);
        })
        .catch(() => {
          audioRef.current.src = SAMPLE_AUDIO_FALLBACK;
          audioRef.current.play().catch(() => {});
          setPlayingAudioId(track.id);
        });
    }
  };

  const handleToggleBookmark = async (e, item) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

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

  const getCategoryIcon = (categoryName) => {
    const name = (categoryName || "").toLowerCase();
    if (name.includes("anime")) return <CircleDot size={15} className="text-[#E11D48]" />;
    if (name.includes("gaming")) return <Gamepad2 size={15} className="text-[#4F46E5]" />;
    if (name.includes("movie")) return <Film size={15} className="text-[#D97706]" />;
    if (name.includes("tv")) return <Tv size={15} className="text-[#0D9488]" />;
    if (name.includes("k-pop")) return <Music size={15} className="text-[#EC4899]" />;
    if (name.includes("comic")) return <BookOpen size={15} className="text-[#0284C7]" />;
    if (name.includes("manga")) return <Book size={15} className="text-[#7C3AED]" />;
    if (name.includes("cosplay")) return <Smile size={15} className="text-[#E11D48]" />;
    return <Sparkles size={15} className="text-[#FFA800]" />;
  };

  const getCategoryColor = (categoryName) => {
    const name = (categoryName || "").toLowerCase();
    if (name.includes("anime")) return "bg-[#FBCFE8] text-[#831843]";
    if (name.includes("gaming")) return "bg-[#D1FAE5] text-[#065F46]";
    if (name.includes("movie")) return "bg-[#BAE6FD] text-[#0369A1]";
    if (name.includes("tv")) return "bg-[#E9D5FF] text-[#6B21A8]";
    if (name.includes("k-pop")) return "bg-[#FCE7F3] text-[#9D174D]";
    if (name.includes("comic")) return "bg-[#FEF08A] text-[#854D0E]";
    if (name.includes("manga")) return "bg-[#DDD6FE] text-[#5B21B6]";
    if (name.includes("cosplay")) return "bg-[#FECDD3] text-[#9F1239]";
    return "bg-[#FEF08A] text-black";
  };

  // Filter items based on active media tab, active fandom category, and search query
  const filteredItems = mediaItems.filter((item) => {
    const matchesMediaType =
      activeMediaType === "all" ||
      (activeMediaType === "videos" && item.type === "video") ||
      (activeMediaType === "audio" && item.type === "audio") ||
      (activeMediaType === "images" && item.type === "image");

    const matchesFandom =
      activeFandom === "All" ||
      item.category.toLowerCase().trim() === activeFandom.toLowerCase().trim();

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.body && item.body.toLowerCase().includes(query)) ||
      (Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase().includes(query)));

    return matchesMediaType && matchesFandom && matchesSearch;
  });

  const videosList = filteredItems.filter((item) => item.type === "video");
  const audioList = filteredItems.filter((item) => item.type === "audio");
  const imagesList = filteredItems.filter((item) => item.type === "image");

  return (
    <div className="w-full bg-[#FAF8F5] min-h-full py-6 px-4 sm:px-6 select-none font-sans">
      {/* Hidden Audio element for real playback */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingAudioId(null)}
        onError={() => setPlayingAudioId(null)}
      />

      <div className="max-w-7xl mx-auto space-y-8">

        {/* 1. PAGE HEADER */}
        <div className="pt-2 pb-1">
          <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
            MULTIMEDIA CENTER
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#7A6F64] mt-0.5">
            Watch your favorite videos, listen to podcasts & soundtracks, and explore images across all fandoms.
          </p>
        </div>

        {/* 2. SEARCH BAR */}
        <div className="max-w-md w-full relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#737373] pointer-events-none">
            <Search size={14} className="text-[#737373]" />
          </span>
          <input
            type="text"
            placeholder="Search media files by title, category, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-bold pl-9 pr-8 py-2.5 border border-[#E5E7EB] rounded-none bg-white text-[#171717] focus:outline-none focus:border-[#FFA800] transition-colors shadow-2xs"
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

        {/* 3. ROW 1 FILTER TABS: All, Videos, Audio, Images */}
        <div className="border-b border-stone-200/80 pb-1">
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold text-[#525252]">
            {/* All */}
            <button
              type="button"
              onClick={() => setActiveMediaType("all")}
              className={`flex items-center gap-2 pb-2.5 transition-all cursor-pointer relative ${
                activeMediaType === "all"
                  ? "text-[#FF5F1F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FF5F1F]"
                  : "hover:text-black"
              }`}
            >
              <div className="w-4 h-4 rounded bg-[#FF5F1F] flex items-center justify-center text-white">
                <Play size={10} className="fill-white ml-0.5" />
              </div>
              <span>All Media</span>
            </button>

            {/* Videos */}
            <button
              type="button"
              onClick={() => setActiveMediaType("videos")}
              className={`flex items-center gap-2 pb-2.5 transition-all cursor-pointer relative ${
                activeMediaType === "videos"
                  ? "text-[#FF5F1F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FF5F1F]"
                  : "hover:text-black"
              }`}
            >
              <div className="w-4 h-4 rounded bg-[#1C1917] flex items-center justify-center text-white">
                <Play size={10} className="fill-white ml-0.5" />
              </div>
              <span>Videos</span>
            </button>

            {/* Audio */}
            <button
              type="button"
              onClick={() => setActiveMediaType("audio")}
              className={`flex items-center gap-2 pb-2.5 transition-all cursor-pointer relative ${
                activeMediaType === "audio"
                  ? "text-[#FF5F1F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FF5F1F]"
                  : "hover:text-black"
              }`}
            >
              <Headphones size={16} className="text-[#1C1917]" />
              <span>Audio</span>
            </button>

            {/* Images */}
            <button
              type="button"
              onClick={() => setActiveMediaType("images")}
              className={`flex items-center gap-2 pb-2.5 transition-all cursor-pointer relative ${
                activeMediaType === "images"
                  ? "text-[#FF5F1F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FF5F1F]"
                  : "hover:text-black"
              }`}
            >
              <Sparkles size={16} className="text-[#1C1917]" />
              <span>Images</span>
            </button>
          </div>
        </div>

        {/* 4. ROW 2 DYNAMIC CATEGORY PILLS */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
          {/* All category pill */}
          <button
            type="button"
            onClick={() => setActiveFandom("All")}
            className={`text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 rounded-none transition-all flex items-center gap-2 cursor-pointer shadow-2xs shrink-0 ${
              activeFandom === "All"
                ? "bg-[#FFA800] text-black font-extrabold shadow-sm"
                : "bg-white text-[#404040] hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <LayoutGrid size={15} />
            <span>All</span>
          </button>

          {/* Dynamic categories */}
          {categories.map((cat) => {
            const isSelected = activeFandom.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat._id || cat.name}
                type="button"
                onClick={() => setActiveFandom(cat.name)}
                className={`text-xs sm:text-sm font-semibold px-4 sm:px-4.5 py-2 rounded-none transition-all flex items-center gap-2 cursor-pointer shadow-2xs shrink-0 ${
                  isSelected
                    ? "bg-[#FFA800] text-black font-extrabold shadow-sm"
                    : "bg-white text-[#404040] hover:bg-stone-50 border border-stone-200"
                }`}
              >
                {getCategoryIcon(cat.name)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1A1D24] border border-[#2B2F3D] text-white text-xs px-4 py-2.5 rounded-none shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <Check size={15} className="text-[#FFA800]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* NO RESULTS DISPLAY */}
        {filteredItems.length === 0 && !isLoading && (
          <div className="bg-white border border-stone-200 p-8 text-center space-y-3">
            <p className="text-sm font-bold text-stone-600">No multimedia items match your selected filters.</p>
            <button
              onClick={() => {
                setActiveFandom("All");
                setActiveMediaType("all");
                setSearchQuery("");
              }}
              className="text-xs font-extrabold text-[#FF5F1F] uppercase tracking-wider underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 5. SECTION 1: VIDEOS */}
        {(activeMediaType === "all" || activeMediaType === "videos") && videosList.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#1C1917] flex items-center justify-center text-white">
                  <Play size={11} className="fill-white ml-0.5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#171717] uppercase tracking-wide">
                  VIDEOS ({videosList.length})
                </h3>
              </div>
              {activeMediaType === "all" && (
                <button
                  type="button"
                  onClick={() => setActiveMediaType("videos")}
                  className="text-xs font-bold text-[#FF5F1F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>See all</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {videosList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveModalVideo(item)}
                  className="bg-white hover:bg-stone-50 rounded-none flex flex-col justify-between shadow-2xs transition-colors cursor-pointer group border border-[#EDE4D6] text-gray-900 overflow-hidden"
                >
                  {/* Thumbnail container */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black shrink-0 border-b border-[#EDE4D6]">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-none"
                    />

                    {/* Bookmark Button Top Right */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleBookmark(e, item)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-none bg-black/60 hover:bg-black/85 flex items-center justify-center text-white transition-colors cursor-pointer z-10"
                      title={bookmarkedIds.has(item.id) ? "Bookmarked" : "Bookmark this"}
                    >
                      <Bookmark
                        size={13}
                        className={bookmarkedIds.has(item.id) ? "fill-[#FFA800] text-[#FFA800]" : "text-white"}
                      />
                    </button>

                    {/* Duration Pill Bottom Right */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-none shadow-sm">
                      {item.duration}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 group-hover:text-[#FF5F1F] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-100">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-none uppercase ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/60 px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={(e) => handleReaction(e, item, "up")}
                            className={`flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                              item.userVote === "up"
                                ? "text-emerald-600 font-black"
                                : "text-stone-500 hover:text-emerald-600"
                            }`}
                            title="Thumbs Up"
                          >
                            <ThumbsUp
                              size={12}
                              className={item.userVote === "up" ? "fill-emerald-600 text-emerald-600" : ""}
                            />
                            <span>{item.thumbsUpCount || 0}</span>
                          </button>

                          <span className="text-stone-300 text-[10px]">|</span>

                          <button
                            type="button"
                            onClick={(e) => handleReaction(e, item, "down")}
                            className={`flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                              item.userVote === "down"
                                ? "text-rose-600 font-black"
                                : "text-stone-500 hover:text-rose-600"
                            }`}
                            title="Thumbs Down"
                          >
                            <ThumbsDown
                              size={12}
                              className={item.userVote === "down" ? "fill-rose-600 text-rose-600" : ""}
                            />
                            <span>{item.thumbsDownCount || 0}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-stone-700">
                          <Star size={13} className="fill-[#FFA800] text-[#FFA800]" />
                          <span>{item.rating || "5.0"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. SECTION 2: AUDIO */}
        {(activeMediaType === "all" || activeMediaType === "audio") && audioList.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones size={18} className="text-[#1C1917]" />
                <h3 className="text-base sm:text-lg font-bold text-[#171717] uppercase tracking-wide">
                  AUDIO (PODCASTS AND SOUNDTRACKS) ({audioList.length})
                </h3>
              </div>
              {activeMediaType === "all" && (
                <button
                  type="button"
                  onClick={() => setActiveMediaType("audio")}
                  className="text-xs font-bold text-[#FF5F1F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>See all</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audioList.map((track) => {
                const isPlayingThis = playingAudioId === track.id;
                return (
                  <div
                    key={track.id}
                    className="bg-white rounded-none p-3.5 border border-stone-200/90 shadow-2xs hover:shadow-sm flex items-center justify-between gap-3 transition-all"
                  >
                    {/* Left thumbnail */}
                    <div className="w-13 h-13 rounded-none overflow-hidden shrink-0 bg-stone-900 border border-stone-100">
                      <img
                        src={track.thumbnail}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Center details & waveform */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 truncate">
                          {track.title}
                        </h4>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-none uppercase ${getCategoryColor(track.category)} shrink-0`}>
                          {track.category}
                        </span>
                      </div>

                      {/* Audio scrubber & waveform */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleToggleAudio(track)}
                          className="w-6 h-6 rounded-full bg-[#1C1917] hover:bg-[#FF5F1F] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                          title={isPlayingThis ? "Pause" : "Play"}
                        >
                          {isPlayingThis ? <Pause size={11} className="fill-white" /> : <Play size={11} className="fill-white ml-0.5" />}
                        </button>

                        <div className="flex-1 flex items-center gap-[2px] h-4">
                          {[4, 8, 12, 6, 14, 9, 5, 12, 16, 8, 10, 14, 7, 11, 15, 6, 9, 13, 8, 5, 11, 14, 7, 10].map((h, i) => (
                            <div
                              key={i}
                              className={`w-[2px] rounded-full transition-all duration-200 ${
                                isPlayingThis ? "bg-[#FF5F1F] animate-pulse" : "bg-stone-300"
                              }`}
                              style={{ height: `${h}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right metadata & reactions */}
                    <div className="flex flex-col items-end justify-between min-h-13 shrink-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/60 px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={(e) => handleReaction(e, track, "up")}
                            className={`flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                              track.userVote === "up"
                                ? "text-emerald-600 font-black"
                                : "text-stone-500 hover:text-emerald-600"
                            }`}
                            title="Thumbs Up"
                          >
                            <ThumbsUp
                              size={11}
                              className={track.userVote === "up" ? "fill-emerald-600 text-emerald-600" : ""}
                            />
                            <span>{track.thumbsUpCount || 0}</span>
                          </button>

                          <span className="text-stone-300 text-[10px]">|</span>

                          <button
                            type="button"
                            onClick={(e) => handleReaction(e, track, "down")}
                            className={`flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                              track.userVote === "down"
                                ? "text-rose-600 font-black"
                                : "text-stone-500 hover:text-rose-600"
                            }`}
                            title="Thumbs Down"
                          >
                            <ThumbsDown
                              size={11}
                              className={track.userVote === "down" ? "fill-rose-600 text-rose-600" : ""}
                            />
                            <span>{track.thumbsDownCount || 0}</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmark(e, track)}
                          className="text-stone-400 hover:text-stone-800 cursor-pointer p-0.5"
                          title={bookmarkedIds.has(track.id) ? "Bookmarked" : "Bookmark this"}
                        >
                          <Bookmark
                            size={14}
                            className={bookmarkedIds.has(track.id) ? "fill-[#FFA800] text-[#FFA800]" : ""}
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                        <span>{track.duration}</span>
                        <div className="flex items-center gap-0.5 text-stone-700 font-bold">
                          <Star size={11} className="fill-[#FFA800] text-[#FFA800]" />
                          <span>{track.rating || "4.8"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 7. SECTION 3: IMAGES */}
        {(activeMediaType === "all" || activeMediaType === "images") && imagesList.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#1C1917]" />
                <h3 className="text-base sm:text-lg font-bold text-[#171717] uppercase tracking-wide">
                  IMAGES ({imagesList.length})
                </h3>
              </div>
              {activeMediaType === "all" && (
                <button
                  type="button"
                  onClick={() => setActiveMediaType("images")}
                  className="text-xs font-bold text-[#FF5F1F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>See all</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {imagesList.map((imgItem) => (
                <div
                  key={imgItem.id}
                  onClick={() => setActiveModalImage(imgItem)}
                  className="bg-white hover:bg-stone-50 rounded-none flex flex-col justify-between shadow-2xs transition-colors cursor-pointer group border border-[#EDE4D6] text-gray-900 overflow-hidden"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black shrink-0 border-b border-[#EDE4D6]">
                    <img
                      src={imgItem.thumbnail}
                      alt={imgItem.title}
                      className="w-full h-full object-cover rounded-none"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleToggleBookmark(e, imgItem)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-none bg-black/60 hover:bg-black/85 flex items-center justify-center text-white transition-colors cursor-pointer z-10"
                      title={bookmarkedIds.has(imgItem.id) ? "Bookmarked" : "Bookmark this"}
                    >
                      <Bookmark
                        size={13}
                        className={bookmarkedIds.has(imgItem.id) ? "fill-[#FFA800] text-[#FFA800]" : "text-white"}
                      />
                    </button>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 group-hover:text-[#FF5F1F] transition-colors line-clamp-2">
                      {imgItem.title}
                    </h4>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-100">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-none uppercase ${getCategoryColor(imgItem.category)}`}>
                        {imgItem.category}
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/60 px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={(e) => handleReaction(e, imgItem, "up")}
                            className={`flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                              imgItem.userVote === "up"
                                ? "text-emerald-600 font-black"
                                : "text-stone-500 hover:text-emerald-600"
                            }`}
                            title="Thumbs Up"
                          >
                            <ThumbsUp
                              size={12}
                              className={imgItem.userVote === "up" ? "fill-emerald-600 text-emerald-600" : ""}
                            />
                            <span>{imgItem.thumbsUpCount || 0}</span>
                          </button>

                          <span className="text-stone-300 text-[10px]">|</span>

                          <button
                            type="button"
                            onClick={(e) => handleReaction(e, imgItem, "down")}
                            className={`flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${
                              imgItem.userVote === "down"
                                ? "text-rose-600 font-black"
                                : "text-stone-500 hover:text-rose-600"
                            }`}
                            title="Thumbs Down"
                          >
                            <ThumbsDown
                              size={12}
                              className={imgItem.userVote === "down" ? "fill-rose-600 text-rose-600" : ""}
                            />
                            <span>{imgItem.thumbsDownCount || 0}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-stone-700">
                          <Star size={13} className="fill-[#FFA800] text-[#FFA800]" />
                          <span>{imgItem.rating || "5.0"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. VIDEO PLAYER MODAL */}
        {activeModalVideo && (
          <VideoPlayerModal
            video={activeModalVideo}
            onClose={() => setActiveModalVideo(null)}
            onReaction={handleReaction}
            onBookmark={(e, v) => handleToggleBookmark(e, v)}
            isBookmarked={bookmarkedIds.has(activeModalVideo.id || activeModalVideo._id)}
          />
        )}

        {/* 9. IMAGE VIEWER MODAL */}
        {activeModalImage && (
          <ImageViewerModal
            image={activeModalImage}
            onClose={() => setActiveModalImage(null)}
            onBookmark={(e) => handleToggleBookmark(e, activeModalImage)}
            isBookmarked={bookmarkedIds.has(activeModalImage.id || activeModalImage._id)}
            onReaction={handleReaction}
          />
        )}
      </div>
    </div>
  );
};

export { MultimediaCenterPage };
