import { useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { TRENDING_ITEMS } from "../data/fandomData";

const TrendingSection = ({ onSelectTrending }) => {
  const [savedIds, setSavedIds] = useState(new Set());
  const toggleSave = (e, id) => {
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 border-[#231C14]/10 mb-6">
        <h2 className="text-[#231C14] text-xl sm:text-2xl font-black tracking-wider uppercase font-titan">
          Trending across fandoms
        </h2>
        <a
          href="#trending"
          onClick={(e) => {
            e.preventDefault();
            onSelectTrending(TRENDING_ITEMS[0]);
          }}
          className="text-xs font-bold text-[#FF5F1F] hover:underline uppercase tracking-wider"
        >
          See all
        </a>
      </div>

      {/* Trending Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {TRENDING_ITEMS.map((item, idx) => {
          const categories = ["Beasts & Bosses", "DC Comics", "Twisted Wonderland", "Numberblocks"];
          const isSaved = savedIds.has(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onSelectTrending(item)}
              className="group bg-[#161918]/90 backdrop-blur-xl rounded-none overflow-hidden border border-white/15 hover:border-white/35 transition-all cursor-pointer flex flex-col justify-between select-none shadow-lg hover:-translate-y-1 relative h-[260px]"
            >
              {/* Poster Artwork with bookmark button overlay */}
              <div className="absolute inset-0 w-full h-full bg-[#0B0B0D] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out brightness-90"
                />

                {/* Gradient vignette for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30 pointer-events-none" />

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => toggleSave(e, item.id)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-none flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer z-10 ${isSaved
                      ? "bg-[#FF5F1F] text-white border border-[#FF5F1F]"
                      : "bg-black/55 backdrop-blur-md border border-white/20 text-white hover:bg-black/80"
                    }`}
                  title={isSaved ? "Saved" : "Save bookmark"}
                >
                  {isSaved ? <Check size={13} strokeWidth={2.8} /> : <Bookmark size={13} />}
                </button>

                {/* Glassmorphic content text overlaid on absolute background */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-black/45 backdrop-blur-xs border-t border-white/10 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-[#FF8C5A] uppercase tracking-widest mb-1">
                    {categories[idx % categories.length]}
                  </span>
                  <h3 className={`font-bold text-white group-hover:text-[#FF5F1F] transition-colors line-clamp-2 leading-tight ${idx === 0 ? "text-base sm:text-lg" : "text-xs sm:text-sm"
                    }`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/65">
                      {item.viewsToday || "28k views today"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export { TrendingSection };
