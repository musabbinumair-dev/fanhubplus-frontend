import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WORLDS_TO_DISCOVER } from "../data/fandomData";
const WorldsToDiscoverSection = ({
  onSelectWiki
}) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  return <section className="mb-8">
      {
    /* Section Header: small, sentence case, right-aligned See all & arrows */
  }
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#F5F5F5] tracking-tight">
          Worlds to discover
        </h2>
        <div className="flex items-center gap-3">
          <a
    href="#all-worlds"
    onClick={(e) => {
      e.preventDefault();
      onSelectWiki(WORLDS_TO_DISCOVER[0]);
    }}
    className="text-xs text-[#8A8A8E] hover:text-[#F5F5F5] transition-colors"
  >
            See all
          </a>
          <div className="flex items-center gap-1">
            <button
    onClick={() => scroll("left")}
    className="p-1 rounded text-[#8A8A8E] hover:text-[#F5F5F5] hover:bg-[#151517] transition-colors"
    title="Previous"
  >
              <ChevronLeft size={16} />
            </button>
            <button
    onClick={() => scroll("right")}
    className="p-1 rounded text-[#8A8A8E] hover:text-[#F5F5F5] hover:bg-[#151517] transition-colors"
    title="Next"
  >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {
    /* Cards Row: Charcoal #151517 with 1px hairline border #232326 */
  }
      <div
    ref={scrollRef}
    className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
        {WORLDS_TO_DISCOVER.map((wiki, idx) => {
    const ratings = ["9.4", "9.1", "8.9", "9.3", "9.0"];
    const counts = ["142K watching", "89K watching", "56K watching", "120K watching", "78K watching"];
    return <div
      key={wiki.id}
      onClick={() => onSelectWiki(wiki)}
      className="group relative flex-none w-[240px] sm:w-[260px] rounded-none overflow-hidden border border-[#232326] bg-[#151517] hover:border-[#35353a] transition-colors cursor-pointer snap-start flex flex-col justify-between"
    >
              <div>
                {
                  /* Poster Artwork filling most of the card */
                }
                <div className="relative aspect-[16/10] w-full bg-[#0B0B0D] overflow-hidden">
                  <img
                    src={wiki.image}
                    alt={wiki.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  {
                    /* Compact IMDb Rating Badge */
                  }
                  <div className="absolute top-2 left-2 bg-[#0B0B0D]/95 border border-[#232326] px-1.5 py-0.5 rounded-none text-[10px] font-bold text-[#F5F5F5] flex items-center gap-1 select-none">
                    <span className="text-[#E1121E]">★</span> {ratings[idx % ratings.length]}
                  </div>
                </div>

                {
      /* Card Metadata */
    }
                <div className="p-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-[#F5F5F5] truncate group-hover:text-white transition-colors">
                    {wiki.name}
                  </h3>
                  {
      /* Letterboxd-style metadata row: category · year · count */
    }
                  <p className="text-[11px] text-[#8A8A8E] mt-1 truncate">
                    {wiki.category} · 2026 · {counts[idx % counts.length]}
                  </p>
                </div>
              </div>
            </div>;
  })}
      </div>
    </section>;
};
export {
  WorldsToDiscoverSection
};
