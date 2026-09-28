import { ChevronsUpDown, RotateCcw } from "lucide-react";

const FilterBar = ({
  searchTerm = "",
  onSearchChange,
  onSearchSubmit,
  category = "All",
  onCategoryChange,
  categoriesList = [],
  contentType = "All",
  onContentTypeChange,
  popularity = "All",
  onPopularityChange,
  selectedTag = "All",
  onTagChange,
  tagsList = [],
  onReset
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <div className="w-full bg-white rounded-[8px] p-4 sm:p-5 shadow-theme-card border border-gray-200 select-none font-baloo">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. TOP ROW: Search Term + SEARCH Button */}
        <div>
          <label className="text-gray-900 text-xs sm:text-[13px] font-bold block mb-1.5 tracking-wide">
            Search Term:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search anime, manga, gaming, comics..."
              className="flex-1 bg-gray-100 hover:bg-gray-200 focus:bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 text-xs sm:text-[13px] font-medium px-3.5 py-2 rounded-[6px] focus:outline-none focus:border-[#F59E0B] transition-colors shadow-2xs"
            />
            <button
              type="submit"
              className="bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] text-black text-xs font-black tracking-wider uppercase px-5 sm:px-7 py-2 rounded-[6px] cursor-pointer transition-all shrink-0 shadow-xs active:scale-95"
            >
              SEARCH
            </button>
          </div>
        </div>

        {/* 2. BOTTOM ROW: 4 Filter Selectors + Clear Filters Button */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 pt-1 items-end">
          {/* 1. Category */}
          <div>
            <label className="text-gray-900 text-xs font-bold block mb-1 tracking-wide">
              Category:
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
                className="w-full appearance-none h-8.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-900 text-xs font-semibold pl-2.5 pr-6 rounded-[6px] focus:outline-none focus:border-[#F59E0B] transition-colors cursor-pointer shadow-2xs truncate"
              >
                <option value="All" className="bg-white text-gray-900">All Categories</option>
                {categoriesList.map((catName) => (
                  <option key={catName} value={catName} className="bg-white text-gray-900">
                    {catName}
                  </option>
                ))}
              </select>
              <ChevronsUpDown
                size={13}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* 2. Content Type */}
          <div>
            <label className="text-gray-900 text-xs font-bold block mb-1 tracking-wide">
              Content Type:
            </label>
            <div className="relative">
              <select
                value={contentType}
                onChange={(e) => onContentTypeChange && onContentTypeChange(e.target.value)}
                className="w-full appearance-none h-8.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-900 text-xs font-semibold pl-2.5 pr-6 rounded-[6px] focus:outline-none focus:border-[#F59E0B] transition-colors cursor-pointer shadow-2xs"
              >
                <option value="All" className="bg-white text-gray-900">All Types</option>
                <option value="article" className="bg-white text-gray-900">Article</option>
                <option value="video" className="bg-white text-gray-900">Video</option>
                <option value="image" className="bg-white text-gray-900">Image</option>
                <option value="audio" className="bg-white text-gray-900">Audio</option>
              </select>
              <ChevronsUpDown
                size={13}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* 3. Popularity */}
          <div>
            <label className="text-gray-900 text-xs font-bold block mb-1 tracking-wide">
              Popularity:
            </label>
            <div className="relative">
              <select
                value={popularity}
                onChange={(e) => onPopularityChange && onPopularityChange(e.target.value)}
                className="w-full appearance-none h-8.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-900 text-xs font-semibold pl-2.5 pr-6 rounded-[6px] focus:outline-none focus:border-[#F59E0B] transition-colors cursor-pointer shadow-2xs"
              >
                <option value="All" className="bg-white text-gray-900">Default Order</option>
                <option value="most_popular" className="bg-white text-gray-900">Most Popular</option>
                <option value="highest_rated" className="bg-white text-gray-900">Highest Rated</option>
                <option value="latest" className="bg-white text-gray-900">Latest Uploads</option>
              </select>
              <ChevronsUpDown
                size={13}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* 4. Tags */}
          <div>
            <label className="text-gray-900 text-xs font-bold block mb-1 tracking-wide">
              Tags:
            </label>
            <div className="relative">
              <select
                value={selectedTag}
                onChange={(e) => onTagChange && onTagChange(e.target.value)}
                className="w-full appearance-none h-8.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-900 text-xs font-semibold pl-2.5 pr-6 rounded-[6px] focus:outline-none focus:border-[#F59E0B] transition-colors cursor-pointer shadow-2xs truncate"
              >
                <option value="All" className="bg-white text-gray-900">All Tags</option>
                {tagsList.map((t) => (
                  <option key={t} value={t} className="bg-white text-gray-900">
                    #{t}
                  </option>
                ))}
              </select>
              <ChevronsUpDown
                size={13}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* 5. Clear Filters Button */}
          <div className="col-span-2 sm:col-span-1">
            <button
              type="button"
              onClick={onReset}
              className="w-full h-8.5 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 text-xs font-bold rounded-[6px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export { FilterBar };
