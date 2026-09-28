import { X, Flame, Eye, ArrowRight } from "lucide-react";

const TrendingModal = ({ item, onClose, onExploreWiki }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 border border-gray-200 animate-in fade-in zoom-in-95 duration-150 text-gray-900">
        {/* Cover Art */}
        <div className="relative aspect-[16/10] w-full bg-black overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-bold border border-white/10">
            <Flame size={12} className="text-[#FB923C] fill-[#FB923C]" />
            <span>Trending in {item.category}</span>
          </div>
        </div>

        {/* Details */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
            <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center font-bold text-[9px] border border-gray-200">
              <img
                src={item.image}
                alt={item.wikiName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-gray-900">{item.wikiName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {item.viewsToday}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
            {item.title}
          </h3>

          <p className="text-gray-500 text-xs leading-relaxed mb-6">
            This entry is currently surging in readership across the community. Fans are actively researching lore, battle stats, recent plot developments, and infobox revisions.
          </p>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onExploreWiki?.(item.wikiName);
                onClose();
              }}
              className="px-4 py-2 text-xs font-extrabold bg-[#FFA800] hover:bg-[#FFB51A] text-black rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Visit Article</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TrendingModal };
