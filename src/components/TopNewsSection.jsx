import { TOP_NEWS_HERO, TOP_NEWS_GRID } from "../data/fandomData";
const TopNewsSection = ({ onSelectStory }) => {
  return <section className="mb-8">
      {
    /* Section Header: small, sentence case, right-aligned See all (IMDb/Letterboxd style) */
  }
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#F5F5F5] tracking-tight">
          Top news
        </h2>
        <a
    href="#all-news"
    onClick={(e) => {
      e.preventDefault();
      onSelectStory(TOP_NEWS_HERO);
    }}
    className="text-xs text-[#8A8A8E] hover:text-[#F5F5F5] transition-colors"
  >
          See all
        </a>
      </div>

      {
    /* Hero Card: Charcoal #151517, hairline border #232326, real artwork fills card */
  }
      <div
    onClick={() => onSelectStory(TOP_NEWS_HERO)}
    className="group mb-3.5 bg-[#151517] rounded-none overflow-hidden border border-[#232326] transition-colors hover:border-[#35353a] cursor-pointer"
  >
        {
    /* Real Thumbnail Artwork */
  }
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#0B0B0D] overflow-hidden">
          <img
    src={TOP_NEWS_HERO.image}
    alt={TOP_NEWS_HERO.title}
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
  />
          {
    /* IMDb-style Rating Badge: Black chip with red star and white number in top-left */
  }
          <div className="absolute top-2.5 left-2.5 bg-[#0B0B0D]/95 border border-[#232326] px-2 py-0.5 rounded-none text-[11px] font-bold text-[#F5F5F5] flex items-center gap-1 select-none">
            <span className="text-[#E1121E]">★</span> 9.2
          </div>
        </div>

        {
    /* Hero Content */
  }
        <div className="p-4 sm:p-5">
          {
    /* Bebas Neue for Hero headline only */
  }
          <h3 className="font-hero text-2xl sm:text-3xl text-[#F5F5F5] tracking-wide leading-tight group-hover:text-white transition-colors">
            {TOP_NEWS_HERO.title}
          </h3>

          {
    /* Letterboxd/Reddit style small metadata row: category · year · count */
  }
          <p className="text-xs text-[#8A8A8E] mt-1.5 font-normal">
            Gaming · 2026 · 68K readers · 4 min read
          </p>

          <p className="text-xs sm:text-sm text-[#8A8A8E] mt-2 line-clamp-2 leading-relaxed">
            {TOP_NEWS_HERO.excerpt}
          </p>

          {
    /* The Single CTA button allowed on this screen: Ink Red #E1121E */
  }
          <div className="mt-3.5">
            <button
              type="button"
              className="inline-flex items-center px-3.5 py-1.5 rounded-none bg-[#E1121E] hover:bg-[#c90f1a] text-white text-xs font-semibold tracking-wide transition-colors"
            >
              Read article
            </button>
          </div>
        </div>
      </div>

      {
        /* Secondary Stories Grid: 2-column with poster artwork and IMDb rating badge */
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TOP_NEWS_GRID.map((story, idx) => {
          const ratings = ["8.8", "8.5"];
          const counts = ["34K reading", "22K reading"];
          const tags = ["Industry", "Hardware"];
          return <div
            key={story.id}
            onClick={() => onSelectStory(story)}
            className="group bg-[#151517] rounded-none overflow-hidden border border-[#232326] hover:border-[#35353a] transition-colors cursor-pointer flex flex-col justify-between"
          >
                    <div>
                      {
                        /* Poster image filling top */
                      }
                      <div className="relative aspect-[16/9] w-full bg-[#0B0B0D] overflow-hidden">
                        <img
                          src={story.image}
                          alt={story.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                        />
                        {
                          /* Rating Badge */
                        }
                        <div className="absolute top-2 left-2 bg-[#0B0B0D]/95 border border-[#232326] px-1.5 py-0.5 rounded-none text-[10px] font-bold text-[#F5F5F5] flex items-center gap-1 select-none">
                          <span className="text-[#E1121E]">★</span> {ratings[idx % ratings.length]}
                        </div>
                      </div>

                <div className="p-3 sm:p-3.5">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#F5F5F5] group-hover:text-white transition-colors line-clamp-2 leading-snug">
                    {story.title}
                  </h4>
                  {
      /* Metadata row */
    }
                  <p className="text-[11px] text-[#8A8A8E] mt-1.5">
                    {tags[idx % tags.length]} · 2026 · {counts[idx % counts.length]}
                  </p>
                </div>
              </div>
            </div>;
  })}
      </div>
    </section>;
};
export {
  TopNewsSection
};
