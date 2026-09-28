import { useState, useEffect } from "react";
import { BASE_URL } from "../../api/api";

const CATEGORY_IMAGE_MAP = {
  anime: "/src/assets/images/category_anime_1790259342339.jpg",
  gaming: "/src/assets/images/category_gaming_1790259361539.jpg",
  movies: "/src/assets/images/category_movies_1790259375752.jpg",
  movie: "/src/assets/images/category_movies_1790259375752.jpg",
  "tv shows": "/src/assets/images/category_tvshows_1790259388971.jpg",
  tvshows: "/src/assets/images/category_tvshows_1790259388971.jpg",
  tv: "/src/assets/images/category_tvshows_1790259388971.jpg",
  "k-pop": "/src/assets/images/category_kpop_1790259404900.jpg",
  kpop: "/src/assets/images/category_kpop_1790259404900.jpg",
  comics: "/src/assets/images/category_comics_1790259419220.jpg",
  comic: "/src/assets/images/category_comics_1790259419220.jpg",
  manga: "/src/assets/images/category_manga_1790259433020.jpg",
  cosplay: "/src/assets/images/category_cosplay_1790259445408.jpg"
};

const getCategoryCover = (cat) => {
  if (cat && cat.iconUrl && typeof cat.iconUrl === "string" && cat.iconUrl.trim() !== "") {
    return cat.iconUrl;
  }
  const nameKey = (cat?.name || cat?.title || "").toLowerCase().trim();
  if (CATEGORY_IMAGE_MAP[nameKey]) {
    return CATEGORY_IMAGE_MAP[nameKey];
  }
  for (const key of Object.keys(CATEGORY_IMAGE_MAP)) {
    if (nameKey.includes(key)) {
      return CATEGORY_IMAGE_MAP[key];
    }
  }
  return "/src/assets/images/anime_category_cover_1790259649949.jpg";
};

const getTimeAgo = (dateStr) => {
  if (!dateStr) return "RECENT";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 60) return `${mins > 0 ? mins : 1}M AGO`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}H AGO`;
  const days = Math.floor(hours / 24);
  return `${days}D AGO`;
};

const getSafeCoverImage = (item) => {
  if (!item) return "/src/assets/images/one_piece_luffy_1790180189080.jpg";
  const candidates = [
    item.thumbnailUrl,
    item.posterImage,
    item.image,
    item.videoThumbnail,
    ...(Array.isArray(item.images) ? item.images : [])
  ];
  for (const url of candidates) {
    if (url && typeof url === "string" && !url.toLowerCase().includes(".pdf")) {
      return url;
    }
  }
  return "/src/assets/images/one_piece_luffy_1790180189080.jpg";
};

const NewReleaseCategories = ({
  onSelectItem,
  onSeeMore,
  onSelectCategory
}) => {
  const [categories, setCategories] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [catRes, contentRes] = await Promise.all([
          fetch(`${BASE_URL}/categories`),
          fetch(`${BASE_URL}/content?sort=latest`)
        ]);

        const catData = await catRes.json();
        const contentData = await contentRes.json();

        if (isMounted) {
          if (catData && catData.success && Array.isArray(catData.categories)) {
            setCategories(catData.categories);
          }
          if (contentData && contentData.success && Array.isArray(contentData.contents)) {
            setRecentItems(contentData.contents);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic categories or content:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSeeMore = () => {
    if (onSeeMore) {
      onSeeMore();
    } else {
      const el = document.getElementById("trending-heading");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategoryClick = (cat) => {
    const categoryName = cat.name || cat.title || cat.category;
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    } else if (onSelectItem) {
      onSelectItem(cat);
    }
  };

  const handleRecentItemClick = (item) => {
    if (!onSelectItem) return;
    const coverImage = getSafeCoverImage(item);
    onSelectItem({
      _id: item._id,
      id: item._id,
      title: item.title,
      category: item.categoryId?.name || item.category || "Fandom",
      year: item.year || (item.createdAt ? new Date(item.createdAt).getFullYear().toString() : "2025"),
      rating: item.thumbsUpRatio ? (item.thumbsUpRatio / 10).toFixed(1) : (item.ratingAvg ? item.ratingAvg.toFixed(1) : "9.5"),
      popularity: "Recent update",
      posterImage: coverImage,
      image: coverImage,
      thumbnailUrl: item.thumbnailUrl,
      videoThumbnail: coverImage,
      mediaUrl: item.mediaUrl,
      images: item.images,
      body: item.body,
      type: item.type || "article",
      tags: item.tags || []
    });
  };

  return (
    <section className="w-full font-baloo select-none">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-6 lg:gap-8 items-start">
        
        {/* ================= LEFT SECTION: POPULAR FANDOMS ================= */}
        <div className="md:col-span-8 flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-gray-200">
            <h2 className="text-gray-900 text-lg sm:text-xl font-black tracking-wider uppercase font-titan">
              POPULAR FANDOMS
            </h2>
            <button
              type="button"
              onClick={handleSeeMore}
              className="text-[#F59E0B] hover:text-[#D97706] transition-colors text-xs sm:text-[13px] font-bold tracking-wider uppercase cursor-pointer hover:underline"
            >
              SEE ALL
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-44 rounded-none" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-stone-500 font-bold text-sm bg-white border border-gray-200 p-6">
              No fandom categories found in the database.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
              {categories.map((cat) => {
                const catName = cat.name;
                const catImg = getCategoryCover(cat);

                return (
                  <div
                    key={cat._id || catName}
                    onClick={() => handleCategoryClick(cat)}
                    className="group relative cursor-pointer overflow-hidden bg-stone-900 border border-gray-200 hover:border-[#F59E0B] shadow-sm hover:shadow-xl transition-all duration-300 h-40 sm:h-44 md:h-[175px] flex flex-col justify-between p-4 sm:p-5"
                  >
                    {/* Background Image */}
                    <img
                      src={catImg}
                      alt={catName}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out brightness-90 group-hover:brightness-100"
                      loading="lazy"
                    />

                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 group-hover:from-black/85 transition-colors" />

                    {/* Top Tag */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 text-[9.5px] font-black uppercase tracking-widest bg-black/60 text-[#F59E0B] border border-[#F59E0B]/30 backdrop-blur-xs">
                        FANDOM
                      </span>
                    </div>

                    {/* Bottom Info */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-white group-hover:text-[#F59E0B] text-xl sm:text-2xl font-black uppercase font-titan tracking-wide drop-shadow-md transition-colors">
                          {catName}
                        </h3>
                        <span className="text-[#F59E0B] text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 hidden sm:inline-flex items-center gap-1 font-baloo">
                          Explore &rarr;
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-xs sm:text-[13px] line-clamp-1 mt-1 font-baloo">
                        {cat.description || `Explore ${catName} characters, lore & community media.`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= RIGHT SECTION: RECENT ================= */}
        <div className="md:col-span-4 flex flex-col">
          <div className="pb-2 mb-4 flex items-center justify-between border-b border-gray-200">
            <h2 className="text-gray-900 text-lg sm:text-xl font-black tracking-wider uppercase font-titan">
              RECENT UPDATES
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3 py-2 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gray-200" />
                  <div className="w-12 h-12 bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 w-3/4" />
                    <div className="h-2 bg-gray-200 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentItems.length === 0 ? (
            <div className="py-8 text-center text-stone-500 font-bold text-xs bg-white border border-gray-200 p-4">
              No recent fandom updates published yet.
            </div>
          ) : (
            <div className="flex flex-col">
              {recentItems.slice(0, 10).map((item, index) => {
                const rank = String(index + 1).padStart(2, "0");
                const categoryName = item.categoryId?.name || item.category || "Fandom";
                const itemType = (item.type || "article").toUpperCase();
                const timeTag = getTimeAgo(item.createdAt);
                
                const tags = [itemType, categoryName.toUpperCase(), timeTag];
                if (item.tags && item.tags.length > 0) {
                  tags.push(item.tags[0].toUpperCase());
                }

                const itemImage = getSafeCoverImage(item);

                return (
                  <div
                    key={item._id || `recent-${index}`}
                    onClick={() => handleRecentItemClick(item)}
                    className="group flex items-center gap-3 sm:gap-3.5 py-2.5 sm:py-2.5 border-b border-gray-200 last:border-b-0 hover:bg-amber-50/40 hover:pl-1 transition-all duration-150 cursor-pointer"
                  >
                    <span className="font-stencil-rank text-2xl sm:text-3xl md:text-[32px] font-extrabold text-outline-rank w-7 sm:w-8 text-center shrink-0 transition-all leading-none select-none">
                      {rank}
                    </span>

                    <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-13 md:h-13 aspect-square rounded-none overflow-hidden bg-white shrink-0 border border-gray-200 shadow-2xs">
                      <img
                        src={itemImage}
                        alt={item.title}
                        className="w-full h-full object-cover object-center rounded-none group-hover:scale-108 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 group-hover:text-[#F59E0B] text-xs sm:text-[13px] font-extrabold uppercase tracking-tight truncate transition-colors font-baloo leading-tight">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[8.5px] sm:text-[9px] text-gray-500 font-bold mt-1 tracking-wider uppercase truncate">
                        {tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-none border border-gray-200 shrink-0"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export { NewReleaseCategories };

