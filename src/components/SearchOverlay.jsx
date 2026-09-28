import { Search, BookOpen, Newspaper, MessageSquare, ArrowRight, Flame } from "lucide-react";
import {
  WORLDS_TO_DISCOVER,
  TOP_NEWS_HERO,
  TOP_NEWS_GRID,
  ACTIVE_DISCUSSIONS,
  TRENDING_ITEMS
} from "../data/fandomData";

const SearchOverlay = ({
  query,
  onClose,
  onSelectWiki,
  onSelectStory,
  onSelectDiscussion,
  onSelectTrending
}) => {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return null;

  const matchedWikis = WORLDS_TO_DISCOVER.filter(
    (w) => w.name.toLowerCase().includes(cleanQ) || w.category.toLowerCase().includes(cleanQ)
  );
  const allNews = [TOP_NEWS_HERO, ...TOP_NEWS_GRID];
  const matchedNews = allNews.filter(
    (n) => n.title.toLowerCase().includes(cleanQ) || n.excerpt.toLowerCase().includes(cleanQ)
  );
  const matchedDiscussions = ACTIVE_DISCUSSIONS.filter(
    (d) => d.title.toLowerCase().includes(cleanQ) || d.body.toLowerCase().includes(cleanQ) || d.author.toLowerCase().includes(cleanQ)
  );
  const matchedTrending = TRENDING_ITEMS.filter(
    (t) => t.title.toLowerCase().includes(cleanQ) || t.wikiName.toLowerCase().includes(cleanQ)
  );

  const hasAnyResults = matchedWikis.length > 0 || matchedNews.length > 0 || matchedDiscussions.length > 0 || matchedTrending.length > 0;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-sm border border-gray-200 border border-gray-200 z-40 max-h-[75vh] overflow-y-auto p-4 animate-in fade-in duration-100 text-gray-900">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-3 text-xs text-gray-500">
        <span>Search results for &quot;<span className="font-bold text-[#FFA800]">{query}</span>&quot;</span>
        <button onClick={onClose} className="hover:text-gray-900 font-semibold cursor-pointer">Clear</button>
      </div>

      {!hasAnyResults ? (
        <div className="text-center py-8 text-gray-500 text-xs">
          <Search size={28} className="mx-auto mb-2 opacity-30 text-gray-500" />
          <p>No results found matching &quot;{query}&quot;.</p>
          <p className="mt-1 text-[11px] text-gray-500/70">Try searching for &quot;Halo&quot;, &quot;Xbox&quot;, &quot;Jigglypuff&quot;, or &quot;One Piece&quot;.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Wikis */}
          {matchedWikis.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                <BookOpen size={13} className="text-[#FFA800]" />
                <span>Wikis ({matchedWikis.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedWikis.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      onSelectWiki(w);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 text-left transition-colors group cursor-pointer"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#FFA800]">{w.name}</h4>
                      <span className="text-[11px] text-gray-500">{w.articlesCount} • {w.category}</span>
                    </div>
                    <ArrowRight size={14} className="text-gray-500 group-hover:text-[#FFA800] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* News */}
          {matchedNews.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                <Newspaper size={13} className="text-[#FFA800]" />
                <span>News Stories ({matchedNews.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedNews.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      onSelectStory(n);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 text-left transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#FFA800]">{n.title}</h4>
                      <span className="text-[11px] text-gray-500">{n.date} • {n.category}</span>
                    </div>
                    <ArrowRight size={14} className="text-gray-500 shrink-0 group-hover:text-[#FFA800] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Discussions */}
          {matchedDiscussions.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                <MessageSquare size={13} className="text-[#FFA800]" />
                <span>Discussions ({matchedDiscussions.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedDiscussions.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDiscussion(d);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 text-left transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#FFA800]">{d.title}</h4>
                      <span className="text-[11px] text-gray-500">By {d.author} • {d.community}</span>
                    </div>
                    <ArrowRight size={14} className="text-gray-500 shrink-0 group-hover:text-[#FFA800] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending */}
          {matchedTrending.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                <Flame size={13} className="text-[#FB923C]" />
                <span>Trending ({matchedTrending.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedTrending.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTrending(t);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 text-left transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#FFA800]">{t.title}</h4>
                      <span className="text-[11px] text-gray-500">{t.wikiName} • {t.viewsToday}</span>
                    </div>
                    <ArrowRight size={14} className="text-gray-500 shrink-0 group-hover:text-[#FFA800] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { SearchOverlay };
