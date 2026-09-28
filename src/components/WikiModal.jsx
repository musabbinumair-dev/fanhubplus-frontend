import { useState } from "react";
import { X, Star, BookmarkPlus, Check } from "lucide-react";

const WikiModal = ({
  wiki,
  onClose,
  onPinToRecent,
  isPinned
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!wiki) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden border border-gray-200 my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col text-gray-900">
        {/* Header Cover Banner */}
        <div className="relative h-44 sm:h-52 w-full bg-black overflow-hidden shrink-0">
          <img
            src={wiki.image || wiki.avatar || "/src/assets/images/pokeball_real_render_1790180829855.jpg"}
            alt={wiki.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/40 to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Banner bottom details */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="inline-block bg-[#FFA800] text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                {wiki.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                {wiki.name}
              </h2>
              <p className="text-white/80 text-xs font-medium">{wiki.articlesCount}</p>
            </div>

            <button
              onClick={() => onPinToRecent(wiki.id)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer ${
                isPinned ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              {isPinned ? (
                <>
                  <Check size={14} />
                  <span>Pinned</span>
                </>
              ) : (
                <>
                  <BookmarkPlus size={14} />
                  <span>Pin to Recent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-gray-200 px-6 bg-[#15151C] text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-[#FFA800] text-[#FFA800] font-bold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Overview & Lore
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "popular"
                ? "border-[#FFA800] text-[#FFA800] font-bold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Essential Articles
          </button>
          <button
            onClick={() => setActiveTab("guidelines")}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "guidelines"
                ? "border-[#FFA800] text-[#FFA800] font-bold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Community Bureaucrats
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-900">
          {activeTab === "overview" && (
            <div>
              <p className="leading-relaxed mb-4 text-xs sm:text-sm text-gray-500">{wiki.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                <div className="bg-[#F8F9FA] rounded-xl p-3 border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Articles</span>
                  <div className="text-base font-black text-gray-900 mt-0.5">{wiki.articlesCount}</div>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-3 border border-gray-200">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Active Editors</span>
                  <div className="text-base font-black text-gray-900 mt-0.5">1,420+</div>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-3 border border-gray-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Quality Tier</span>
                  <div className="text-base font-black text-[#FFA800] flex items-center gap-1 mt-0.5">
                    <Star size={15} fill="currentColor" />
                    <span>Gold Standard</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-gray-100 border border-gray-200 text-xs text-gray-500">
                <span className="font-bold text-[#FFA800]">Contribute to this Wiki: </span>
                Anyone can edit and propose revisions. Adhere to community manual of style and maintain citations.
              </div>
            </div>
          )}

          {activeTab === "popular" && (
            <div className="space-y-2">
              {[
                { title: "Protagonists & Factions Breakdown", views: "1.2M views", status: "Featured" },
                { title: "Timeline of Major Canon Events", views: "840K views", status: "Comprehensive" },
                { title: "Artifacts, Powers, and Mechanics Guide", views: "610K views", status: "Guide" },
                { title: "Infobox Templates & Formatting Standard", views: "320K views", status: "Meta" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-[#F8F9FA] hover:border-[#FFA800]/50 hover:bg-gray-100 transition-all cursor-pointer group"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#FFA800] text-xs sm:text-sm">{item.title}</h4>
                    <span className="text-[11px] text-gray-500">{item.views}</span>
                  </div>
                  <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 font-bold px-2 py-0.5 rounded-full">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "guidelines" && (
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">Wiki Bureaucracy</h4>
              <p className="text-xs text-gray-500 mb-4">
                Maintained by dedicated volunteer sysops, admins, and editors.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-xl border border-gray-200">
                  <div className="w-7 h-7 rounded-full bg-[#FFA800] text-black flex items-center justify-center font-extrabold text-[11px]">A</div>
                  <div>
                    <div className="font-bold text-gray-900">Archmage_Editor (Admin)</div>
                    <div className="text-[10px] text-gray-500">14,291 edits • Active today</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-xl border border-gray-200">
                  <div className="w-7 h-7 rounded-full bg-[#60A5FA] text-black flex items-center justify-center font-extrabold text-[11px]">L</div>
                  <div>
                    <div className="font-bold text-gray-900">Lorekeeper_Prime (Bureaucrat)</div>
                    <div className="text-[10px] text-gray-500">9,810 edits • Active 2h ago</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { WikiModal };
