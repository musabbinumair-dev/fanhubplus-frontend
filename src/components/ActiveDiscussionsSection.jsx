const ActiveDiscussionsSection = ({
  discussions,
  onSelectDiscussion,
  onJoinClick,
  onLikeDiscussion,
  likedIds
}) => {
  return <section className="mb-8">
      {
    /* Section Header: small, sentence case, right-aligned See all */
  }
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#F5F5F5] tracking-tight">
          Active discussions
        </h2>
        <a
    href="#all-discussions"
    onClick={(e) => {
      e.preventDefault();
      onJoinClick();
    }}
    className="text-xs text-[#8A8A8E] hover:text-[#F5F5F5] transition-colors"
  >
          See all
        </a>
      </div>

      {
    /* Discussion Cards Grid: Charcoal #151517 with 1px border #232326 */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {discussions.map((item, idx) => {
    const isLiked = likedIds.has(item.id);
    const ratings = ["8.9", "9.2", "8.6"];
    const categories = ["Theory", "Lore", "Community"];
    const counts = ["1.2K comments", "840 comments", "420 comments"];
    const isOnline = idx % 2 === 0;
    return <div
      key={item.id}
      onClick={() => onSelectDiscussion(item)}
      className="group bg-[#151517] rounded-none border border-[#232326] hover:border-[#35353a] p-3.5 transition-colors cursor-pointer flex flex-col justify-between"
    >
              <div>
                {
                  /* Real Thumbnail with IMDb Rating Badge */
                }
                <div className="relative aspect-[16/9] w-full bg-[#0B0B0D] rounded-none overflow-hidden mb-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-[#0B0B0D]/95 border border-[#232326] px-1.5 py-0.5 rounded-none text-[10px] font-bold text-[#F5F5F5] flex items-center gap-1 select-none">
                    <span className="text-[#E1121E]">★</span> {ratings[idx % ratings.length]}
                  </div>
                </div>

                {
      /* Creator avatar with Discord-style status dot */
    }
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative shrink-0">
                    <div className="w-5 h-5 rounded-full bg-[#232326] overflow-hidden flex items-center justify-center text-[10px] font-bold text-[#F5F5F5]">
                      {item.author[0].toUpperCase()}
                    </div>
                    {
      /* Discord-style status dot on bottom-right */
    }
                    {isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#23a55a] rounded-full ring-1 ring-[#151517]" />}
                  </div>
                  <span className="text-xs text-[#8A8A8E] font-medium truncate">
                    {item.author}
                  </span>
                  <span className="text-[10px] text-[#8A8A8E] ml-auto">
                    {item.timeAgo}
                  </span>
                </div>

                {
      /* Title */
    }
                <h3 className="text-xs sm:text-sm font-semibold text-[#F5F5F5] group-hover:text-white transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                {
      /* Letterboxd/Reddit style small metadata row: category · year · count */
    }
                <p className="text-[11px] text-[#8A8A8E] mt-1.5">
                  {categories[idx % categories.length]} · 2026 · {counts[idx % counts.length]}
                </p>

                {
      /* Body snippet */
    }
                <p className="text-xs text-[#8A8A8E] line-clamp-2 mt-2 leading-relaxed">
                  {item.body}
                </p>
              </div>

              {
      /* Card Footer: clean, hairline divider */
    }
              <div className="flex items-center justify-between pt-2.5 mt-3 border-t border-[#232326] text-[11px] text-[#8A8A8E]">
                <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onLikeDiscussion(item.id);
      }}
      className={`hover:text-[#F5F5F5] transition-colors ${isLiked ? "text-[#E1121E] font-medium" : ""}`}
    >
                  {item.likes + (isLiked ? 1 : 0)} upvotes
                </button>
                <span>{item.comments} replies</span>
              </div>
            </div>;
  })}
      </div>
    </section>;
};
export {
  ActiveDiscussionsSection
};
