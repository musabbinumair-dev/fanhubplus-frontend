import { useState, useEffect } from "react";
import { Bookmark, Check } from "lucide-react";
const PublisherIcon = ({ type }) => {
  if (type === "rockstar") {
    return <span className="w-3.5 h-3.5 rounded-[3px] bg-[#F7A600] text-[#111] font-black text-[8px] flex items-center justify-center font-sans shrink-0 leading-none select-none shadow-xs">
      R<span className="text-[6px] leading-none mb-0.5">*</span>
    </span>;
  }
  if (type === "ea") {
    return <span className="w-3.5 h-3.5 rounded-full bg-white/25 text-white font-extrabold text-[7px] flex items-center justify-center font-sans shrink-0 leading-none select-none border border-white/40">
      EA
    </span>;
  }
  if (type === "cdpr") {
    return <span className="w-3.5 h-3.5 rounded-full bg-[#E52538] text-white font-black text-[7px] flex items-center justify-center shrink-0 leading-none select-none shadow-xs">
      ★
    </span>;
  }
  if (type === "xbox") {
    return <span className="w-3.5 h-3.5 rounded-full bg-[#107C10] text-white font-black text-[8px] flex items-center justify-center shrink-0 leading-none select-none">
      ✕
    </span>;
  }
  if (type === "fromsoftware") {
    return <span className="w-3.5 h-3.5 rounded-[3px] bg-white/35 text-white font-bold text-[6.5px] flex items-center justify-center shrink-0 leading-none select-none">
      FS
    </span>;
  }
  if (type === "jump") {
    return <span className="w-3.5 h-3.5 rounded-[3px] bg-[#E60012] text-white font-bold text-[6.5px] flex items-center justify-center shrink-0 leading-none select-none">
      JP
    </span>;
  }
  return <span className="w-3.5 h-3.5 rounded-full bg-white/25 text-white/90 font-bold text-[7px] flex items-center justify-center shrink-0 select-none border border-white/30">
    ✦
  </span>;
};
const getSafeCover = (item) => {
  if (!item) return "/src/assets/images/one_piece_luffy_1790180189080.jpg";
  const candidates = [
    item.posterImage,
    item.image,
    item.thumbnailUrl,
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

const getSubtleImageColor = (item) => {
  if (item?.cardBgColor) return item.cardBgColor;
  const category = (item?.category || "").toLowerCase();
  if (category.includes("anime")) return "#271E2B";
  if (category.includes("gaming")) return "#1C2522";
  if (category.includes("manga")) return "#1A202C";
  if (category.includes("k-pop") || category.includes("kpop")) return "#2A1B28";
  if (category.includes("movies") || category.includes("cinema")) return "#241F1C";
  if (category.includes("tv")) return "#1C2128";
  if (category.includes("comics")) return "#1C232B";
  if (category.includes("cosplay")) return "#271C22";
  return "#202225";
};

const ContentCard = ({
  item,
  isSaved = false,
  onSelect,
  onToggleSave,
  isLoggedIn = false,
}) => {
  const [localSaved, setLocalSaved] = useState(isSaved);

  useEffect(() => {
    setLocalSaved(isSaved);
  }, [isSaved]);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    if (isLoggedIn) {
      setLocalSaved((prev) => !prev);
    }
    if (onToggleSave) {
      onToggleSave(item);
    }
  };

  const subtleColor = getSubtleImageColor(item);
  const coverImage = getSafeCover(item);

  return (
    <article
      onClick={() => onSelect(item)}
      style={{ backgroundColor: subtleColor }}
      className="group col-span-1 flex flex-col w-full rounded-none overflow-hidden cursor-pointer select-none border border-white/15 hover:border-white/35 transition-colors duration-200 relative"
    >
      {/* 1. ARTWORK SECTION */}
      <div className="relative w-full aspect-[16/10] shrink-0 overflow-hidden bg-black/40 rounded-none">
        <img
          src={coverImage}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover rounded-none"
        />

        {/* Top-Left Floating Fandom Category Tag */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="bg-black/65 backdrop-blur-xs border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-none">
            {item.category}
          </span>
        </div>

        {/* Top-Right Floating Bookmark & Rating */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <span className="bg-black/65 backdrop-blur-xs border border-white/20 text-white text-[10.5px] font-bold px-2 py-1 rounded-none flex items-center gap-1">
            ★ {item.rating}
          </span>
          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`w-7.5 h-7.5 rounded-none flex items-center justify-center transition-colors duration-150 cursor-pointer ${
              localSaved
                ? "bg-[#FFA800] text-black border border-[#FFA800]"
                : "bg-black/65 hover:bg-black/85 backdrop-blur-xs border border-white/20 text-white"
            }`}
            title={localSaved ? "Saved to library" : "Bookmark title"}
          >
            {localSaved ? <Check size={12} strokeWidth={2.8} /> : <Bookmark size={12} strokeWidth={2.2} />}
          </button>
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div
        style={{
          backgroundColor: subtleColor,
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.14) 100%)",
        }}
        className="p-5 sm:p-5.5 flex-1 flex flex-col justify-between relative border-t border-white/10"
      >
        <div className="space-y-2">
          {/* Fandom category & type tag */}
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] font-extrabold text-[#FFA800] uppercase tracking-wider">
              {item.type || "Fandom"}
            </span>
            <span className="text-white/40 text-xs">•</span>
            <span className="text-[11px] font-medium text-white/70">
              {item.year}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-[17px] sm:text-[18.5px] leading-snug tracking-tight line-clamp-2">
            {item.title}
          </h3>

          {/* Uploader Name Row */}
          <div className="flex items-center gap-1.5 text-white/80 text-[12px] font-medium pt-0.5">
            <PublisherIcon type={item.publisherIconType} />
            <span className="truncate">
              Uploaded by <strong className="text-white font-semibold">{item.uploader || item.publisher || "Fandom Staff"}</strong>
            </span>
          </div>

          {/* Content lore summary */}
          <p className="text-white/75 text-xs sm:text-[13px] leading-relaxed font-normal line-clamp-2 pt-1">
            {item.content || item.synopsis || item.subtitle || "Explore extensive community wiki lore archives, guides, character bios, and lore analysis."}
          </p>
        </div>

        {/* 3. BOTTOM ROW */}
        <div className="mt-4 pt-3 flex items-center justify-between gap-3 border-t border-white/10">
          <span className="text-[11px] text-white/85 font-semibold px-2.5 py-1 rounded-none bg-white/10 border border-white/15 truncate uppercase tracking-wider">
            {item.genre || item.category}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className="bg-white/15 hover:bg-white hover:text-black border border-white/20 text-white text-[11.5px] font-bold px-4 py-1.5 rounded-none flex items-center gap-1.5 transition-colors duration-150 cursor-pointer uppercase tracking-wider"
          >
            <span>View</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export { ContentCard };
