import { CATEGORIES } from "../../data/homepageData";

const catColors = {
  Anime: { color: "#FF6B9D", border: "#FF6B9D", activeBg: "#FF6B9D", activeText: "#000" },
  Gaming: { color: "#4ADE80", border: "#4ADE80", activeBg: "#4ADE80", activeText: "#000" },
  Movies: { color: "#FBBF24", border: "#FBBF24", activeBg: "#FBBF24", activeText: "#000" },
  "TV Shows": { color: "#60A5FA", border: "#60A5FA", activeBg: "#60A5FA", activeText: "#000" },
  "K-Pop": { color: "#C084FC", border: "#C084FC", activeBg: "#C084FC", activeText: "#000" },
  Comics: { color: "#F87171", border: "#F87171", activeBg: "#F87171", activeText: "#000" },
  Manga: { color: "#FB923C", border: "#FB923C", activeBg: "#FB923C", activeText: "#000" },
  Cosplay: { color: "#2DD4BF", border: "#2DD4BF", activeBg: "#2DD4BF", activeText: "#000" },
  All: { color: "#F59E0B", border: "#F59E0B", activeBg: "#F59E0B", activeText: "#000" },
};

const CategoryChips = ({
  selectedCategory,
  onSelectCategory,
  className = ""
}) => {
  const allCategories = ["All", ...CATEGORIES];
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth select-none ${className}`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {allCategories.map((cat) => {
        const isActive = selectedCategory === cat;
        const config = catColors[cat] || catColors["All"];
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            style={
              isActive
                ? {
                    backgroundColor: config.activeBg,
                    color: config.activeText,
                    borderColor: config.border,
                  }
                : {
                    color: config.color,
                  }
            }
            className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer border ${
              isActive
                ? "scale-105 shadow-md font-extrabold"
                : "bg-gray-100 border-gray-200 hover:border-[#F59E0B]/50 hover:bg-gray-200 hover:scale-105 active:scale-95"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export { CategoryChips };
