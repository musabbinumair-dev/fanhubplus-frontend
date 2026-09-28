import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { fetchCategoriesFromApi } from "../api/api";

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

const FALLBACK_CATEGORIES = [
  {
    name: "Anime",
    slug: "anime",
    iconUrl: "/src/assets/images/category_anime_1790259342339.jpg",
  },
  {
    name: "Gaming",
    slug: "gaming",
    iconUrl: "/src/assets/images/category_gaming_1790259361539.jpg",
  },
  {
    name: "Movies",
    slug: "movies",
    iconUrl: "/src/assets/images/category_movies_1790259375752.jpg",
  },
  {
    name: "TV Shows",
    slug: "tv-shows",
    iconUrl: "/src/assets/images/category_tvshows_1790259388971.jpg",
  },
  {
    name: "K-Pop",
    slug: "k-pop",
    iconUrl: "/src/assets/images/category_kpop_1790259404900.jpg",
  },
  {
    name: "Manga",
    slug: "manga",
    iconUrl: "/src/assets/images/category_manga_1790259433020.jpg",
  },
  {
    name: "Comics",
    slug: "comics",
    iconUrl: "/src/assets/images/category_comics_1790259419220.jpg",
  },
  {
    name: "Cosplay",
    slug: "cosplay",
    iconUrl: "/src/assets/images/category_cosplay_1790259445408.jpg",
  },
];

const getCategoryCover = (cat) => {
  if (cat && cat.iconUrl && typeof cat.iconUrl === "string" && cat.iconUrl.trim() !== "") {
    return cat.iconUrl;
  }
  const nameKey = (cat?.name || cat?.slug || "").toLowerCase().trim();
  if (CATEGORY_IMAGE_MAP[nameKey]) {
    return CATEGORY_IMAGE_MAP[nameKey];
  }
  for (const key of Object.keys(CATEGORY_IMAGE_MAP)) {
    if (nameKey.includes(key)) {
      return CATEGORY_IMAGE_MAP[key];
    }
  }
  return "/src/assets/images/category_anime_1790259342339.jpg";
};

const CategoryPage = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategoriesFromApi();
        if (isMounted) {
          if (data && data.length > 0) {
            setCategories(data);
          } else {
            setCategories(FALLBACK_CATEGORIES);
          }
        }
      } catch (err) {
        if (isMounted) {
          setCategories(FALLBACK_CATEGORIES);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category.name || category.slug);
    }
  };

  return (
    <div className="w-full bg-white min-h-screen font-baloo select-none pb-20 text-[#171717]">
      {/* 1. HERO CATEGORIES BANNER */}
      <div className="w-full overflow-hidden border-b border-[#EDE4D6] bg-zinc-950 shadow-sm">
        <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden">
          <img
            src="/src/assets/images/fandom_banner_1790273074334.jpg"
            alt="Categories Banner"
            className="w-full h-full object-cover object-center brightness-[0.70] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent sm:w-3/4" />

          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 max-w-4xl text-white z-10">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase font-titan mb-1 text-white drop-shadow-md">
              CATEGORIES
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-stone-200 leading-relaxed max-w-2xl drop-shadow-xs">
              Explore curated fandom universes, discover diverse genres, and dive straight into their multimedia content.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Section Header matching reference design */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EDE4D6]">
          <h2 className="text-lg sm:text-xl font-black tracking-wider uppercase text-stone-900 font-titan">
            ALL CATEGORIES
          </h2>
          <span className="text-[#FF5F1F] text-xs sm:text-[13px] font-black tracking-wider uppercase cursor-pointer hover:underline">
            SEE MORE
          </span>
        </div>

        {/* 2. CATEGORIES GRID */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col space-y-2">
                <div className="aspect-square bg-stone-100 rounded-none w-full border border-[#EDE4D6]" />
                <div className="h-4 bg-stone-200 rounded-none w-3/4 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => {
              const image =
                getCategoryCover(cat) ||
                cat.iconUrl ||
                FALLBACK_CATEGORIES[idx % FALLBACK_CATEGORIES.length]?.iconUrl ||
                "/src/assets/images/category_anime_1790259342339.jpg";

              return (
                <div
                  key={cat._id || cat.slug || idx}
                  onClick={() => handleCategoryClick(cat)}
                  className="cursor-pointer flex flex-col text-left"
                >
                  {/* Category Image Poster - Square, Border-radius 0 */}
                  <div className="relative aspect-square w-full overflow-hidden bg-stone-100 rounded-none border border-[#EDE4D6] shadow-2xs">
                    <img
                      src={image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-none"
                      loading="lazy"
                    />
                  </div>

                  {/* Title under the image - Left aligned text without hover effects */}
                  <h3 className="font-bold text-sm sm:text-[15px] text-stone-900 mt-2.5 tracking-wide truncate font-sans">
                    {cat.name}
                  </h3>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export { CategoryPage };
export default CategoryPage;
