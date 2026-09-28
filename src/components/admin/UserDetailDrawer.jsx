import { useState, useEffect } from "react";
import {
  X,
  FileText,
  Calendar,
  Bookmark,
  MessageSquare,
  Plus
} from "lucide-react";
import { getCategoryBadgeClass } from "../../utils/categoryColors.js";

const ALL_FANDOMS = [
  "Anime",
  "TV Shows",
  "Comics",
  "Gaming",
  "Movies",
  "K-Pop",
  "Manga",
  "Cosplay"
];

const ALL_CATEGORIES = [
  "Anime",
  "Gaming",
  "Movies",
  "K-Pop",
  "Comics",
  "Manga",
  "TV Shows",
  "Cosplay"
];

const UserDetailDrawer = ({
  user,
  isOpen,
  onClose,
  onSaveRole,
  onSaveStatus,
  onSave
}) => {
  const [status, setStatus] = useState("ACTIVE");
  const [role, setRole] = useState("User");
  const [favoriteFandoms, setFavoriteFandoms] = useState([]);
  const [categoriesOfInterest, setCategoriesOfInterest] = useState([]);
  const [showAllFandoms, setShowAllFandoms] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isAddingFandom, setIsAddingFandom] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Sync state when user changes or drawer opens
  useEffect(() => {
    if (user) {
      setStatus(user.status || "ACTIVE");
      setRole(user.role || "User");
      setFavoriteFandoms(
        user.favoriteFandoms ? [...user.favoriteFandoms] : ["Anime", "TV Shows", "Comics"]
      );
      setCategoriesOfInterest(
        user.categoriesOfInterest
          ? [...user.categoriesOfInterest]
          : ["Anime", "Gaming", "Movies", "K-Pop", "Comics", "Manga"]
      );
      setShowAllFandoms(false);
      setShowAllCategories(false);
      setIsAddingFandom(false);
      setIsAddingCategory(false);
    }
  }, [user, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  // Toggle fandom tag
  const handleToggleFandom = (fandom) => {
    setFavoriteFandoms((prev) => {
      if (prev.includes(fandom)) {
        return prev.filter((f) => f !== fandom);
      } else {
        return [...prev, fandom];
      }
    });
  };

  // Toggle category tag
  const handleToggleCategory = (cat) => {
    setCategoriesOfInterest((prev) => {
      if (prev.includes(cat)) {
        return prev.filter((c) => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  // Save handler
  const handleSave = () => {
    if (onSaveStatus) onSaveStatus(user.id, status);
    if (onSaveRole) onSaveRole(user.id, role);
    if (onSave) {
      onSave({
        ...user,
        status,
        role,
        favoriteFandoms,
        categoriesOfInterest
      });
    }
    onClose();
  };

  const displayedFandoms = showAllFandoms
    ? favoriteFandoms
    : favoriteFandoms.slice(0, 3);
  const hiddenFandomsCount = Math.max(0, favoriteFandoms.length - 3);

  const displayedCategories = showAllCategories
    ? categoriesOfInterest
    : categoriesOfInterest.slice(0, 6);
  const hiddenCategoriesCount = Math.max(0, categoriesOfInterest.length - 6);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none text-gray-900">
      {/* 1. DIMMED BACKDROP */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. SLIDE-IN SIDE PANEL */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg md:max-w-[490px] bg-white border-l border-gray-200 shadow-sm border border-gray-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out">
          
          {/* HEADER BAR */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-2.5">
              <FileText size={22} className="text-[#FFA800]" strokeWidth={2} />
              <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 font-titan">
                USER DETAIL
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              title="Close panel"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* MAIN SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
            
            {/* USER PROFILE SUMMARY CARD */}
            <div className="px-6 py-5 flex items-center gap-4.5 bg-white">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-gray-200 bg-black shrink-0 shadow-2xs">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/src/assets/images/luffy_avatar_1790269807034.jpg";
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5 truncate font-mono">
                  {user.email}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-2">
                  <Calendar size={14} className="text-gray-500 shrink-0" />
                  <span>Joined: {user.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* FORM FIELDS BODY */}
            <div className="px-6 py-5 space-y-6 bg-white">
              
              {/* FIELD 1: STATUS */}
              <div>
                <label className="text-sm font-bold text-gray-900 flex items-center gap-1 mb-2.5">
                  <span>Status</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* ACTIVE OPTION */}
                  <button
                    type="button"
                    onClick={() => setStatus("ACTIVE")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer border ${
                      status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-2xs"
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <span>Active</span>
                    {status === "ACTIVE" ? (
                      <span className="w-5 h-5 rounded-full border-2 border-emerald-400 flex items-center justify-center shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </span>
                    ) : (
                      <span className="w-4.5 h-4.5 rounded-full border-2 border-[#64748B] shrink-0" />
                    )}
                  </button>

                  {/* SUSPENDED/BANNED OPTION */}
                  <button
                    type="button"
                    onClick={() => setStatus("SUSPENDED")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer border ${
                      status === "SUSPENDED" || status === "BANNED"
                        ? "bg-red-500/20 text-red-400 border-red-500/40 shadow-2xs"
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <span>Suspended</span>
                    {status === "SUSPENDED" || status === "BANNED" ? (
                      <span className="w-5 h-5 rounded-full border-2 border-red-400 flex items-center justify-center shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      </span>
                    ) : (
                      <span className="w-4.5 h-4.5 rounded-full border-2 border-[#64748B] shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              {/* FIELD 2: ROLE */}
              <div>
                <label className="text-sm font-bold text-gray-900 flex items-center gap-1 mb-2.5">
                  <span>Role</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {["User", "Admin"].map((r) => {
                    const isSelected = role.toLowerCase() === r.toLowerCase();
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#FFA800] text-black border-[#FFA800] font-extrabold"
                            : "bg-gray-100 text-gray-500 border-gray-200 hover:text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FIELD 3: FAVORITE FANDOMS */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    <span>Favorite Fandoms</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingFandom(!isAddingFandom)}
                    className="text-xs font-bold text-[#FFA800] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>{isAddingFandom ? "Done" : "Manage"}</span>
                  </button>
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-2">
                  {displayedFandoms.map((fandom) => (
                    <span
                      key={fandom}
                      onClick={() => isAddingFandom && handleToggleFandom(fandom)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        isAddingFandom ? "cursor-pointer ring-1 ring-white/20 hover:opacity-80" : ""
                      } ${getCategoryBadgeClass(fandom)}`}
                    >
                      <span>{fandom}</span>
                      {isAddingFandom && <X size={12} className="opacity-70" />}
                    </span>
                  ))}

                  {/* +X More Button */}
                  {!showAllFandoms && hiddenFandomsCount > 0 && !isAddingFandom && (
                    <button
                      type="button"
                      onClick={() => setShowAllFandoms(true)}
                      className="bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 border border-gray-200 px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      +{hiddenFandomsCount} more
                    </button>
                  )}

                  {showAllFandoms && !isAddingFandom && (
                    <button
                      type="button"
                      onClick={() => setShowAllFandoms(false)}
                      className="bg-gray-100 text-gray-500 hover:bg-gray-200 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Show less
                    </button>
                  )}
                </div>

                {/* Available Fandoms Picker */}
                {isAddingFandom && (
                  <div className="mt-3 p-3 bg-[#F8F9FA] rounded-xl border border-gray-200 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Click to toggle fandoms:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_FANDOMS.map((fandom) => {
                        const isSelected = favoriteFandoms.includes(fandom);
                        return (
                          <button
                            key={fandom}
                            type="button"
                            onClick={() => handleToggleFandom(fandom)}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? `${getCategoryBadgeClass(fandom)} border-transparent shadow-2xs`
                                : "bg-white text-gray-500 border-gray-200 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            {fandom} {isSelected ? "✓" : "+"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* FIELD 4: CATEGORIES OF INTEREST */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    <span>Categories of Interest</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                    className="text-xs font-bold text-[#FFA800] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>{isAddingCategory ? "Done" : "Manage"}</span>
                  </button>
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-2">
                  {displayedCategories.map((cat) => (
                    <span
                      key={cat}
                      onClick={() => isAddingCategory && handleToggleCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        isAddingCategory ? "cursor-pointer ring-1 ring-white/20 hover:opacity-80" : ""
                      } ${getCategoryBadgeClass(cat)}`}
                    >
                      <span>{cat}</span>
                      {isAddingCategory && <X size={12} className="opacity-70" />}
                    </span>
                  ))}

                  {/* +X More Button */}
                  {!showAllCategories && hiddenCategoriesCount > 0 && !isAddingCategory && (
                    <button
                      type="button"
                      onClick={() => setShowAllCategories(true)}
                      className="bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 border border-gray-200 px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      +{hiddenCategoriesCount} more
                    </button>
                  )}

                  {showAllCategories && !isAddingCategory && (
                    <button
                      type="button"
                      onClick={() => setShowAllCategories(false)}
                      className="bg-gray-100 text-gray-500 hover:bg-gray-200 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Show less
                    </button>
                  )}
                </div>

                {/* Available Categories Picker */}
                {isAddingCategory && (
                  <div className="mt-3 p-3 bg-[#F8F9FA] rounded-xl border border-gray-200 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Click to toggle categories:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_CATEGORIES.map((cat) => {
                        const isSelected = categoriesOfInterest.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleToggleCategory(cat)}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? `${getCategoryBadgeClass(cat)} border-transparent shadow-2xs`
                                : "bg-white text-gray-500 border-gray-200 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            {cat} {isSelected ? "✓" : "+"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: USER STATS */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2.5">
                  User Stats
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs min-h-[92px]">
                    <div className="text-[#FFA800]">
                      <Bookmark size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium leading-tight">
                        Bookmarks
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1 leading-tight font-sans">
                        {user.bookmarksCount ?? 48}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs min-h-[92px]">
                    <div className="text-[#FFA800]">
                      <FileText size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium leading-tight">
                        Fan Submissions
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1 leading-tight font-sans">
                        {user.fanSubmissionsCount ?? 12}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs min-h-[92px]">
                    <div className="text-[#FFA800]">
                      <MessageSquare size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium leading-tight">
                        Feedback Sent
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1 leading-tight font-sans">
                        {user.feedbackSentCount ?? 7}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTNOTE */}
              <p className="text-[11px] text-gray-500/70 italic pt-1">
                * Fields marked with an asterisk are required.
              </p>
            </div>
          </div>

          {/* FOOTER ACTION BUTTONS */}
          <div className="border-t border-gray-200 bg-white px-6 py-4 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 px-4 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 uppercase tracking-wider transition-colors cursor-pointer text-center"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-1/2 py-3 px-4 bg-[#FFA800] hover:bg-[#FFB51A] text-black rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-xs transition-colors cursor-pointer text-center"
            >
              SAVE CHANGES
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export { UserDetailDrawer };
