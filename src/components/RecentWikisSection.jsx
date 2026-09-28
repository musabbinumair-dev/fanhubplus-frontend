import { Plus } from "lucide-react";
import { RECENT_WIKIS_INITIAL } from "../data/fandomData";
const RecentWikisSection = ({
  onSelectWiki,
  onAddWiki
}) => {
  return <section className="mb-7">
      {
    /* Section Header: small, sentence case, right-aligned See all */
  }
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#F5F5F5] tracking-tight">
          Recent wikis
        </h2>
        <a
    href="#explore-wikis"
    onClick={(e) => {
      e.preventDefault();
      onSelectWiki("pokemon");
    }}
    className="text-xs text-[#8A8A8E] hover:text-[#F5F5F5] transition-colors"
  >
          See all
        </a>
      </div>

      {
    /* Content-driven Cards Row: Charcoal #151517 with 1px hairline border #232326 */
  }
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
        {
    /* Pinned Primary Wiki: Pokémon */
  }
        <div
    onClick={() => onSelectWiki("pokemon")}
    className="group bg-[#151517] rounded-none border border-[#232326] hover:border-[#35353a] overflow-hidden transition-colors cursor-pointer flex flex-col"
  >
          {
    /* Real Poster Thumbnail filling top */
  }
          <div className="relative aspect-[4/3] w-full bg-[#0B0B0D] overflow-hidden">
            <img
    src="/src/assets/images/pokeball_real_render_1790180829855.jpg"
    alt="Pokémon Wiki"
    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
  />
            {
    /* IMDb Rating Chip */
  }
            <div className="absolute top-1.5 left-1.5 bg-[#0B0B0D]/95 border border-[#232326] px-1.5 py-0.5 rounded-none text-[10px] font-bold text-[#F5F5F5] flex items-center gap-0.5 select-none">
              <span className="text-[#E1121E]">★</span> 9.5
            </div>
          </div>
          {
    /* Card Info */
  }
          <div className="p-2.5 flex-1 flex flex-col justify-between">
            <h3 className="text-xs font-semibold text-[#F5F5F5] truncate group-hover:text-white transition-colors">
              Pokémon
            </h3>
            <p className="text-[10px] text-[#8A8A8E] mt-0.5">
              Gaming · 2026 · 142K entries
            </p>
          </div>
        </div>

        {
    /* Other Recent Wikis */
  }
        {RECENT_WIKIS_INITIAL.filter((w) => w.id !== "pokemon").slice(0, 3).map((wiki, idx) => {
    const ratings = ["9.1", "8.9", "9.4"];
    const counts = ["85K entries", "64K entries", "110K entries"];
    const tags = ["Anime", "Gaming", "Lore"];
    return <div
      key={wiki.id}
      onClick={() => onSelectWiki(wiki.id)}
      className="group bg-[#151517] rounded-none border border-[#232326] hover:border-[#35353a] overflow-hidden transition-colors cursor-pointer flex flex-col"
    >
              {
                /* Thumbnail filling top */
              }
              <div className="relative aspect-[4/3] w-full bg-[#0B0B0D] overflow-hidden">
                <img
                  src={wiki.icon}
                  alt={wiki.name}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                />
                {
                  /* Rating Chip */
                }
                <div className="absolute top-1.5 left-1.5 bg-[#0B0B0D]/95 border border-[#232326] px-1.5 py-0.5 rounded-none text-[10px] font-bold text-[#F5F5F5] flex items-center gap-0.5 select-none">
                  <span className="text-[#E1121E]">★</span> {ratings[idx % ratings.length]}
                </div>
              </div>
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <h3 className="text-xs font-semibold text-[#F5F5F5] truncate group-hover:text-white transition-colors">
                  {wiki.name.replace(" Wiki", "")}
                </h3>
                <p className="text-[10px] text-[#8A8A8E] mt-0.5">
                  {tags[idx % tags.length]} · 2026 · {counts[idx % counts.length]}
                </p>
              </div>
            </div>;
  })}

        {
          /* Add Wiki Action Slot */
        }
        <button
          onClick={onAddWiki}
          className="group bg-[#151517] rounded-none border border-dashed border-[#232326] hover:border-[#35353a] hover:bg-[#1a1a1c] p-4 flex flex-col items-center justify-center text-[#8A8A8E] hover:text-[#F5F5F5] transition-colors cursor-pointer aspect-[4/3] sm:aspect-auto"
          title="Add a wiki to pinned list"
        >
          <Plus size={18} className="text-[#8A8A8E] group-hover:text-[#F5F5F5] mb-1" />
          <span className="text-xs font-medium">Add wiki</span>
          <span className="text-[10px] text-[#8A8A8E] mt-0.5">Custom pin</span>
        </button>
      </div>
    </section>;
};
export {
  RecentWikisSection
};
