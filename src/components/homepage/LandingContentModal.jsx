import { useState, useEffect, useRef } from "react";
import { X, Bookmark, Check, Star, ExternalLink, FileText } from "lucide-react";

// Check if URL is YouTube embed
const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }
  return null;
};

const isVideoUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const clean = url.toLowerCase();
  return clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".ogg") || clean.includes("/video/upload/");
};

const isAudioUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const clean = url.toLowerCase();
  return clean.endsWith(".mp3") || clean.endsWith(".wav") || clean.endsWith(".ogg") || clean.endsWith(".m4a");
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

const getSafeImageUrl = (item) => {
  if (!item) return "/src/assets/images/one_piece_luffy_1790180189080.jpg";
  const candidates = [
    item.thumbnailUrl,
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

const LandingContentModal = ({
  item,
  onClose,
  isLoggedIn = false,
  isSaved = false,
  onToggleSave
}) => {
  const [localSaved, setLocalSaved] = useState(isSaved);
  const videoRef = useRef(null);

  useEffect(() => {
    setLocalSaved(isSaved);
  }, [isSaved]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const contentType = (item.type || "article").toLowerCase();
  const mediaUrl = item.mediaUrl || "";
  const pdfUrl = getPdfUrl(item);
  const isPdfArticle = contentType === "article" && pdfUrl;
  const ytEmbed = getYouTubeEmbedUrl(mediaUrl);
  const isDirectVideo = isVideoUrl(mediaUrl);
  const isAudio = isAudioUrl(mediaUrl) || contentType === "audio";
  const isVideo = contentType === "video" || ytEmbed || isDirectVideo;
  const isImage = contentType === "image" || (!isVideo && !isAudio && !isPdfArticle && item.images && item.images.length > 0);

  const safeImage = getSafeImageUrl(item);

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (isLoggedIn) {
      setLocalSaved((prev) => !prev);
    }
    if (onToggleSave) {
      onToggleSave(item);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
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
              {contentType.toUpperCase()}
            </span>
            {isPdfArticle && (
              <span className="hidden sm:inline-block text-[10px] bg-red-600/80 text-white font-bold px-1.5 py-0.2 rounded-xs">
                PDF
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
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

            <button
              type="button"
              onClick={handleBookmark}
              className={`p-1.5 border transition-all cursor-pointer ${
                localSaved
                  ? "bg-[#FF5F1F] border-[#FF5F1F] text-white"
                  : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
              }`}
              title={localSaved ? "Saved in library" : "Save Bookmark"}
            >
              {localSaved ? <Check size={14} /> : <Bookmark size={14} />}
            </button>

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
          /* PDF Viewer Frame */
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
                    src={mediaUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                    poster={safeImage}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ) : isImage ? (
              <div className="max-h-[50vh] w-full bg-black flex items-center justify-center p-2">
                <img
                  src={mediaUrl || safeImage}
                  alt={item.title}
                  className="max-h-[48vh] w-auto max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="relative aspect-[21/9] sm:aspect-[16/6] w-full bg-black overflow-hidden">
                <img
                  src={safeImage}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181A20] via-transparent to-black/40" />
              </div>
            )}
          </div>
        )}

        {/* Audio Player if Audio Type */}
        {isAudio && mediaUrl && (
          <div className="p-3 bg-[#1F2330] border-b border-white/10 shrink-0">
            <audio src={mediaUrl} controls className="w-full h-9" />
          </div>
        )}

        {/* Content Body & Info (Scrollable for non-PDF or summary row for PDF) */}
        {isPdfArticle ? (
          <div className="px-4 sm:px-5 py-2.5 bg-[#121418] border-t border-white/10 flex items-center justify-between gap-3 text-xs shrink-0">
            <div className="truncate">
              <span className="font-bold text-white">{item.title}</span>
              {item.body && <span className="text-stone-400 ml-2 hidden sm:inline truncate">— {item.body}</span>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:hidden text-xs font-bold text-[#FFA800] underline"
                >
                  Download PDF
                </a>
              )}
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
                onClick={handleBookmark}
                className="text-xs font-bold text-[#FFA800] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark size={13} />
                <span>{localSaved ? "Saved to Bookmarks" : "Save Bookmark"}</span>
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

export { LandingContentModal };
