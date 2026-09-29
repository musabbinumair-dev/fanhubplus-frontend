/**
 * Centralized API service for FanHub
 * 
 * Uses mock data for now with BASE_URL configured so it can be connected
 * to the Node/Express + MongoDB backend seamlessly later.
 */

export const BASE_URL = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:5000/api";

export const MOCK_CONTENT_ITEMS = [
  {
    id: "c-1",
    title: "One Piece: Egghead Arc Breakdown",
    category: "Anime",
    badgeColor: "bg-blue-600",
    type: "ARTICLE",
    year: "2025",
    popularity: "9.2K",
    rating: "9.9",
    genre: "Action, Adventure, Shounen",
    desc: "Deep breakdown of Egghead Island climax, Vegapunk revelations, ancient technology, and Gear 5 Luffy fights.",
    videoThumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=85"
  },
  {
    id: "c-2",
    title: "Elden Ring: Shadow of the Erdtree - First Impressions",
    category: "Gaming",
    badgeColor: "bg-violet-600",
    type: "VIDEO",
    year: "2024",
    popularity: "8.7K",
    rating: "9.8",
    genre: "Dark Fantasy, Action RPG",
    desc: "Our first hands-on impressions of Land of Shadow, new legacy dungeons, and grueling boss fights against Messmer.",
    videoThumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85"
  },
  {
    id: "c-3",
    title: "Dune: Part Two - A Visual Masterpiece",
    category: "Movies",
    badgeColor: "bg-rose-600",
    type: "ARTICLE",
    year: "2024",
    popularity: "7.5K",
    rating: "9.7",
    genre: "Sci-Fi, Epic Adventure",
    desc: "Cinematography breakdown of Denis Villeneuve’s epic sequel, Arrakis desert warfare, sandstorms, and worm-riding effects.",
    videoThumbnail: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&auto=format&fit=crop&q=85"
  },
  {
    id: "c-4",
    title: "Stranger Things S5 - What We Know So Far",
    category: "TV Shows",
    badgeColor: "bg-purple-600",
    type: "VIDEO",
    year: "2025",
    popularity: "12.3K",
    rating: "9.6",
    genre: "Thriller, Sci-Fi, Horror",
    desc: "The final showdown in Hawkins. Cast announcements, release windows, Vecna's revenge, and Upside Down theories.",
    videoThumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=85"
  },
  {
    id: "c-5",
    title: "IVE's New Comeback Teaser Breaks Records",
    category: "K-Pop",
    badgeColor: "bg-emerald-600",
    type: "ARTICLE",
    year: "2025",
    popularity: "10.1K",
    rating: "9.5",
    genre: "Music, Pop Performance",
    desc: "Analyzing the record-breaking teaser statistics and conceptual visuals of IVE’s upcoming world tour album.",
    videoThumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&auto=format&fit=crop&q=85"
  },
  {
    id: "c-6",
    title: "Zoro's Greatest Fights Ranked",
    category: "Anime",
    badgeColor: "bg-blue-600",
    type: "VIDEO",
    year: "2024",
    popularity: "6.8K",
    rating: "9.6",
    genre: "Action, Swordsmanship",
    desc: "From Mihawk to King, ranking Roronoa Zoro’s most legendary three-sword style duels and Conqueror's Haki bursts.",
    videoThumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1920&auto=format&fit=crop&q=85"
  },
  {
    id: "c-7",
    title: "Final Fantasy 7 Rebirth: What Makes It Special",
    category: "Gaming",
    badgeColor: "bg-violet-600",
    type: "ARTICLE",
    year: "2024",
    popularity: "5.6K",
    rating: "9.4",
    genre: "Fantasy, JRPG",
    desc: "Cloud Strife’s open-world adventure analyzed. Minigames, synergy skills, combat depth, and Aerith's destiny.",
    videoThumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&auto=format&fit=crop&q=85"
  },
  {
    id: "c-8",
    title: "Spider-Man: Across the Spider-Verse - A Deeper Look",
    category: "Movies",
    badgeColor: "bg-rose-600",
    type: "VIDEO",
    year: "2023",
    popularity: "11.9K",
    rating: "9.8",
    genre: "Sci-Fi, Multiverse Animation",
    desc: "Breaking down the diverse animation styles, multiverse anomalies, cameos, and tragic canon events of Miles Morales.",
    videoThumbnail: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=85"
  },
  {
    id: "c-9",
    title: "Attack on Titan - Final Season Explained",
    category: "TV Shows",
    badgeColor: "bg-purple-600",
    type: "ARTICLE",
    year: "2023",
    popularity: "14.2K",
    rating: "9.7",
    genre: "Action, Dark Fantasy, Drama",
    desc: "The complex moral dilemma of Eren Yeager, the Rumbling, Ymir's curse, and the final emotional sacrifice explained.",
    videoThumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=85"
  },
  {
    id: "c-10",
    title: "Naruto: The Ultimate Guide to the Series",
    category: "Manga",
    badgeColor: "bg-amber-600",
    type: "IMAGE",
    year: "2020",
    popularity: "18.7K",
    rating: "9.6",
    genre: "Fantasy, Ninja Shounen",
    desc: "The complete reading and watch guide for Naruto Uzumaki’s journey from outcast to the Seventh Hokage.",
    videoThumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=85"
  },
  {
    id: "trend-cyberpunk",
    title: "Cyberpunk 2077: Phantom Liberty",
    category: "Gaming",
    year: "2024",
    rating: "9.8",
    popularity: "15.4K",
    type: "VIDEO",
    genre: "Cyberpunk RPG",
    desc: "Night City opens its clandestine sub-district of Dogtown with an espionage thriller storyline featuring Solomon Reed.",
    videoThumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&auto=format&fit=crop&q=85"
  },
  {
    id: "trend-rdr2",
    title: "Red Dead Redemption 2: Van der Linde Saga",
    category: "Gaming",
    year: "2024",
    rating: "9.9",
    popularity: "22.1K",
    type: "ARTICLE",
    genre: "Western Adventure",
    desc: "Relive the golden age of American outlaws fleeing federal agents across an unforgiving frontier in Dutch's gang.",
    videoThumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80",
    posterImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=85"
  }
];

export const fetchCategoriesFromApi = async () => {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    const data = await res.json();
    if (data.success && data.categories) {
      return data.categories;
    }
    return [];
  } catch (err) {
    console.error("Fetch categories error:", err);
    return [];
  }
};

export const fetchCharactersFromApi = async (categoryQuery = "") => {
  try {
    const query = categoryQuery && categoryQuery !== "All"
      ? `?category=${encodeURIComponent(categoryQuery)}`
      : "";
    const res = await fetch(`${BASE_URL}/characters${query}`);
    const data = await res.json();
    if (data.success && data.characters) {
      return data.characters;
    }
    return [];
  } catch (err) {
    console.error("Fetch characters error:", err);
    return [];
  }
};

export const fetchContentByCategoryId = async (categorySlugOrId) => {
  try {
    const query = categorySlugOrId && categorySlugOrId !== "All"
      ? `?category=${encodeURIComponent(categorySlugOrId)}`
      : "";
    const res = await fetch(`${BASE_URL}/content${query}`);
    const data = await res.json();
    if (data.success && data.contents) {
      return data.contents;
    }
    return [];
  } catch (err) {
    console.error("Fetch category content error:", err);
    return [];
  }
};

export const fetchContentItems = async () => {
  try {
    const res = await fetch(`${BASE_URL}/content`);
    const data = await res.json();
    if (data.success && Array.isArray(data.contents)) {
      return data.contents.map((item) => ({
        id: item._id,
        _id: item._id,
        title: item.title,
        category: item.categoryId?.name || "Anime",
        type: (item.type || "VIDEO").toUpperCase(),
        year: item.createdAt ? new Date(item.createdAt).getFullYear().toString() : "2025",
        popularity: `${item.popularityScore || 100}`,
        rating: item.thumbsUpRatio ? (item.thumbsUpRatio / 10).toFixed(1) : "9.5",
        genre: item.tags?.join(", ") || "Action",
        desc: item.body || "",
        image: item.thumbnailUrl || item.mediaUrl || "/src/assets/images/mafuyu_anime_art_1790180850935.jpg",
        posterImage: item.thumbnailUrl || item.mediaUrl || "/src/assets/images/mafuyu_anime_art_1790180850935.jpg",
        videoThumbnail: item.mediaUrl || item.thumbnailUrl || "/src/assets/images/mafuyu_anime_art_1790180850935.jpg",
        backgroundImage: item.thumbnailUrl || item.mediaUrl,
      }));
    }
    return [];
  } catch (err) {
    console.error("Fetch content error:", err);
    return [];
  }
};

export const fetchContentById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/content/${id}`);
    const data = await res.json();
    if (data.success && data.content) {
      const item = data.content;
      return {
        id: item._id,
        _id: item._id,
        title: item.title,
        category: item.categoryId?.name || "Anime",
        categoryDesc: item.categoryId?.description || "",
        type: (item.type || "VIDEO").toUpperCase(),
        year: item.createdAt ? new Date(item.createdAt).getFullYear().toString() : "2025",
        popularity: `${item.popularityScore || 100}`,
        rating: item.thumbsUpRatio ? (item.thumbsUpRatio / 10).toFixed(1) : "9.5",
        thumbsUpCount: item.thumbsUpCount || 0,
        genre: item.tags?.join(", ") || "Action",
        desc: item.body || "",
        image: item.thumbnailUrl || item.mediaUrl || "/src/assets/images/mafuyu_anime_art_1790180850935.jpg",
        posterImage: item.thumbnailUrl || item.mediaUrl || "/src/assets/images/mafuyu_anime_art_1790180850935.jpg",
        videoThumbnail: item.mediaUrl || item.thumbnailUrl || "/src/assets/images/mafuyu_anime_art_1790180850935.jpg",
        backgroundImage: item.thumbnailUrl || item.mediaUrl,
        submittedBy: item.submittedBy,
      };
    }
  } catch (err) {
    console.error("Fetch content by id error, using fallback:", err);
  }
  const fallback = MOCK_CONTENT_ITEMS.find((c) => c.id === id);
  return Promise.resolve(fallback || null);
};

/* ========================================================================= */
/*   ADMIN USER MANAGEMENT MOCK DATA & API METHODS                          */
/* ========================================================================= */

export const MOCK_USERS_STATS = {
  totalUsers: "2,847",
  totalUsersTrend: "+12%",
  totalUsersComparison: "vs. last month",
  activeToday: "642",
  activeTodayTrend: "+8%",
  activeTodayComparison: "vs. yesterday",
  newThisWeek: "318",
  newThisWeekTrend: "+15%",
  newThisWeekComparison: "vs. last week"
};

export const MOCK_USERS_DATA = [
  {
    id: "user-1",
    avatar: "/src/assets/images/kael_vex_1790281397401.jpg",
    name: "Rayan Frost",
    username: "@rayanfrost",
    email: "rayan.frost@FanHub.io",
    role: "Admin",
    joinedDate: "2025-04-12",
    favoriteFandoms: ["Anime", "Gaming", "Comics", "Movies"],
    categoriesOfInterest: ["Anime", "Gaming", "Comics", "Movies", "Manga"],
    status: "ACTIVE",
    bio: "Passionate anime collector and lore theorist.",
    bookmarksCount: 32,
    fanSubmissionsCount: 8,
    feedbackSentCount: 3,
    postsCount: 34,
    commentsCount: 142
  },
  {
    id: "user-2",
    avatar: "/src/assets/images/lumi_idol_1790281470774.jpg",
    name: "Sana Rivers",
    username: "@sanarivers",
    email: "sana.rivers@FanHub.io",
    role: "User",
    joinedDate: "2025-03-28",
    favoriteFandoms: ["K-Pop", "Movies", "TV Shows", "Cosplay"],
    categoriesOfInterest: ["K-Pop", "Movies", "TV Shows", "Cosplay", "Anime"],
    status: "ACTIVE",
    bio: "Stage performance enthusiast & playlist curator.",
    bookmarksCount: 64,
    fanSubmissionsCount: 19,
    feedbackSentCount: 11,
    postsCount: 89,
    commentsCount: 310
  },
  {
    id: "user-3",
    avatar: "/src/assets/images/orion_steel_1790281419734.jpg",
    name: "Kai Summers",
    username: "@kaisummers",
    email: "kai.summers@FanHub.io",
    role: "User",
    joinedDate: "2025-03-15",
    favoriteFandoms: ["Gaming", "Manga", "Cosplay", "Comics"],
    categoriesOfInterest: ["Gaming", "Manga", "Cosplay", "Comics", "Anime"],
    status: "ACTIVE",
    bio: "Competitive speedrunner & weekly manga reviewer.",
    bookmarksCount: 27,
    fanSubmissionsCount: 15,
    feedbackSentCount: 5,
    postsCount: 52,
    commentsCount: 228
  },
  {
    id: "user-4",
    avatar: "/src/assets/images/elara_voss_1790281586127.jpg",
    name: "Elara Voss",
    username: "@elaravoss",
    email: "elara.voss@FanHub.io",
    role: "User",
    joinedDate: "2025-02-21",
    favoriteFandoms: ["Anime", "TV Shows", "Comics", "Gaming", "Manga"],
    categoriesOfInterest: ["Anime", "Gaming", "Movies", "K-Pop", "Comics", "Manga", "TV Shows"],
    status: "ACTIVE",
    bio: "Account active with extensive bookmarks and curated fandom discussions.",
    bookmarksCount: 48,
    fanSubmissionsCount: 12,
    feedbackSentCount: 7,
    postsCount: 12,
    commentsCount: 45
  },
  {
    id: "user-5",
    avatar: "/src/assets/images/seraphine_vale_1790281437502.jpg",
    name: "Tobias Reed",
    username: "@tobiasreed",
    email: "tobias.reed@FanHub.io",
    role: "User",
    joinedDate: "2025-01-30",
    favoriteFandoms: ["Movies", "Gaming", "Cosplay", "TV Shows"],
    categoriesOfInterest: ["Movies", "Gaming", "Cosplay", "TV Shows", "Comics"],
    status: "ACTIVE",
    bio: "Film cinematography critic & indie game developer.",
    bookmarksCount: 53,
    fanSubmissionsCount: 14,
    feedbackSentCount: 9,
    postsCount: 61,
    commentsCount: 194
  },
  {
    id: "user-6",
    avatar: "/src/assets/images/jace_rivers_1790281454743.jpg",
    name: "Lila Chen",
    username: "@lilachen",
    email: "lila.chen@FanHub.io",
    role: "User",
    joinedDate: "2025-01-18",
    favoriteFandoms: ["Comics", "Manga", "Anime", "Movies"],
    categoriesOfInterest: ["Comics", "Manga", "Anime", "Movies", "Gaming"],
    status: "ACTIVE",
    bio: "Comic collector & webtoon artist in progress.",
    bookmarksCount: 39,
    fanSubmissionsCount: 10,
    feedbackSentCount: 4,
    postsCount: 47,
    commentsCount: 163
  },
  {
    id: "user-7",
    avatar: "/src/assets/images/zane_rook_1790281570770.jpg",
    name: "Zane Patel",
    username: "@zanepatel",
    email: "zane.patel@FanHub.io",
    role: "Admin",
    joinedDate: "2024-12-04",
    favoriteFandoms: ["Gaming", "Movies", "TV Shows", "Anime"],
    categoriesOfInterest: ["Gaming", "Movies", "TV Shows", "Anime", "Comics"],
    status: "ACTIVE",
    bio: "Cyberpunk genre addict & RPG completionist.",
    bookmarksCount: 71,
    fanSubmissionsCount: 22,
    feedbackSentCount: 14,
    postsCount: 104,
    commentsCount: 421
  },
  {
    id: "user-8",
    avatar: "/src/assets/images/nix_ember_1790281532486.jpg",
    name: "Mira Sullivan",
    username: "@mirasullivan",
    email: "mira.sullivan@FanHub.io",
    role: "User",
    joinedDate: "2024-11-20",
    favoriteFandoms: ["K-Pop", "Cosplay", "Manga", "Anime"],
    categoriesOfInterest: ["K-Pop", "Cosplay", "Manga", "Anime", "TV Shows"],
    status: "ACTIVE",
    bio: "Convention photographer & creative costume designer.",
    bookmarksCount: 41,
    fanSubmissionsCount: 16,
    feedbackSentCount: 8,
    postsCount: 78,
    commentsCount: 382
  }
];

export const fetchUsers = async () => {
  return Promise.resolve([...MOCK_USERS_DATA]);
};

export const fetchUserStats = async () => {
  return Promise.resolve({ ...MOCK_USERS_STATS });
};

export const updateUserStatus = async (userId, newStatus) => {
  const user = MOCK_USERS_DATA.find((u) => u.id === userId);
  if (user) {
    user.status = newStatus;
  }
  return Promise.resolve(user);
};

export const updateUserRole = async (userId, newRole) => {
  const user = MOCK_USERS_DATA.find((u) => u.id === userId);
  if (user) {
    user.role = newRole;
  }
  return Promise.resolve(user);
};

export const createUser = async (userData) => {
  const newUser = {
    id: `user-${Date.now()}`,
    avatar: userData.avatar || "/src/assets/images/kael_vex_1790281397401.jpg",
    name: userData.name || "New User",
    username: userData.username || `@user${Date.now()}`,
    email: userData.email || "user@FanHub.io",
    joinedDate: new Date().toISOString().split("T")[0],
    favoriteFandoms: userData.favoriteFandoms || ["Anime", "Gaming"],
    categoriesOfInterest: userData.categoriesOfInterest || ["Anime", "Gaming"],
    status: userData.status || "ACTIVE",
    role: userData.role || "USER",
    bio: userData.bio || "",
    bookmarksCount: 0,
    fanSubmissionsCount: 0,
    feedbackSentCount: 0,
    postsCount: 0,
    commentsCount: 0
  };
  MOCK_USERS_DATA.unshift(newUser);
  return Promise.resolve(newUser);
};

export const updateUserDetails = async (userId, updatedFields) => {
  const user = MOCK_USERS_DATA.find((u) => u.id === userId);
  if (user) {
    Object.assign(user, updatedFields);
  }
  return Promise.resolve(user);
};

/* ========================================================================= */
/*   ADMIN FEEDBACK MANAGEMENT MOCK DATA & API METHODS                      */
/* ========================================================================= */

export const MOCK_FEEDBACK_STATS = {
  totalFeedback: "247",
  totalFeedbackTrend: "+12%",
  totalFeedbackComparison: "vs. last month",
  newCount: "68",
  newTrend: "+18%",
  newComparison: "vs. last week",
  resolvedCount: "179",
  resolvedTrend: "+9%",
  resolvedComparison: "vs. last week"
};

export const MOCK_FEEDBACK_ITEMS = [
  {
    id: "fb-1",
    type: "BUG",
    subject: "Character images not loading on mobile",
    submittedBy: {
      name: "NovaRaven",
      username: "@novaraven",
      avatar: "/src/assets/images/nix_ember_1790281532486.jpg"
    },
    date: "2025-05-17",
    status: "NEW",
    message: "When opening character profile galleries on mobile Safari and Chrome, character portrait cards remain blank or fail to load until the page is refreshed multiple times. Specifically occurs on the Characters Explorer tab."
  },
  {
    id: "fb-2",
    type: "SUGGESTION",
    subject: "Add dark mode for articles",
    submittedBy: {
      name: "PixelDreamer",
      username: "@pixeldreamer",
      avatar: "/src/assets/images/lumi_idol_1790281470774.jpg"
    },
    date: "2025-05-16",
    status: "RESOLVED",
    message: "Reading lengthy lore articles and manga breakdown reviews at night is straining on the eyes. A dedicated dark mode toggle or automatic system theme detection would greatly improve reading comfort."
  },
  {
    id: "fb-3",
    type: "QUERY",
    subject: "How to submit a cosplay event?",
    submittedBy: {
      name: "LunaTide",
      username: "@lunatide",
      avatar: "/src/assets/images/elara_voss_1790281586127.jpg"
    },
    date: "2025-05-15",
    status: "NEW",
    message: "Our regional anime and gaming fan club is organizing an autumn cosplay convention. Which submission form or verification steps do we need to follow to get our gathering listed on the official Events tab?"
  },
  {
    id: "fb-4",
    type: "SUGGESTION",
    subject: "More filters for event search",
    submittedBy: {
      name: "StormByte",
      username: "@stormbyte",
      avatar: "/src/assets/images/elara_voss_1790281586127.jpg"
    },
    date: "2025-05-14",
    status: "RESOLVED",
    message: "It would be really helpful to have more filters when searching for events. Right now it's a bit hard to find specific types of events, like only cosplay events or only online events. Adding more filter options (e.g., event type, format, location) would make it much easier to discover relevant events."
  },
  {
    id: "fb-5",
    type: "BUG",
    subject: "Video player keeps buffering",
    submittedBy: {
      name: "ZaraFlux",
      username: "@zaraflux",
      avatar: "/src/assets/images/seraphine_vale_1790281437502.jpg"
    },
    date: "2025-05-13",
    status: "NEW",
    message: "Trailers and multimedia AMVs in 1080p constantly stall and loop every 4 seconds despite a 300Mbps fiber connection. Lower resolutions (720p) play fine. Seems like a stream segment chunking issue."
  },
  {
    id: "fb-6",
    type: "QUERY",
    subject: "Is there a mobile app planned?",
    submittedBy: {
      name: "KaiZen",
      username: "@kaizen",
      avatar: "/src/assets/images/kael_vex_1790281397401.jpg"
    },
    date: "2025-05-12",
    status: "RESOLVED",
    message: "Are there any plans for native iOS and Android apps with push notifications for new wiki articles and community replies, or should we continue using the PWA installable prompt?"
  },
  {
    id: "fb-7",
    type: "SUGGESTION",
    subject: "Add more manga recommendations",
    submittedBy: {
      name: "EchoSage",
      username: "@echosage",
      avatar: "/src/assets/images/sae_jihyun_1790281620416.jpg"
    },
    date: "2025-05-11",
    status: "NEW",
    message: "A 'You Might Also Like' algorithm at the end of each manga review based on shared themes, authors, and genres would keep readers engaged and finding hidden gems."
  },
  {
    id: "fb-8",
    type: "BUG",
    subject: "Profile picture not saving",
    submittedBy: {
      name: "OrionVex",
      username: "@orionvex",
      avatar: "/src/assets/images/zane_rook_1790281570770.jpg"
    },
    date: "2025-05-10",
    status: "RESOLVED",
    message: "When uploading a custom square PNG avatar in user settings, the upload succeeds in the preview but resets to default upon page reload or navigation."
  }
];

export const fetchFeedbackItems = async () => {
  return Promise.resolve([...MOCK_FEEDBACK_ITEMS]);
};

export const fetchFeedbackStats = async () => {
  return Promise.resolve({ ...MOCK_FEEDBACK_STATS });
};

export const updateFeedbackStatus = async (feedbackId, newStatus) => {
  const item = MOCK_FEEDBACK_ITEMS.find((f) => f.id === feedbackId);
  if (item) {
    item.status = newStatus;
  }
  return Promise.resolve(item);
};

export const updateFeedbackItem = async (feedbackId, updatedFields) => {
  const item = MOCK_FEEDBACK_ITEMS.find((f) => f.id === feedbackId);
  if (item) {
    Object.assign(item, updatedFields);
  }
  return Promise.resolve(item);
};

/* ========================================================================= */
/*   PENDING APPROVALS (SUBMISSIONS + FEEDBACK MODERATION QUEUE)            */
/* ========================================================================= */

export const MOCK_PENDING_APPROVALS = [
  // --- SUBMISSIONS (14 items) ---
  {
    id: "sub-1",
    type: "submission",
    contentType: "Article",
    title: "The Art of Open Worlds",
    subtitle: "A deep dive into what makes open...",
    category: "Gaming",
    submittedBy: {
      name: "KaiZen",
      username: "@kaizen",
      avatar: "/src/assets/images/kael_vex_1790281397401.jpg"
    },
    date: "2025-05-18",
    status: "PENDING",
    content: "Open world games have redefined what it means to be immersed in a virtual world. The freedom to explore, choose your path, and shape your own story creates an experience unlike any other. From breathtaking landscapes to complex characters, open worlds offer endless possibilities for adventure and discovery.",
    image: "/src/assets/images/aetheria_wanderer_1790282784893.jpg"
  },
  {
    id: "sub-2",
    type: "submission",
    contentType: "Image",
    title: "Celestial Realms - Fan Art",
    subtitle: "A digital illustration of a sky city...",
    category: "Anime",
    submittedBy: {
      name: "NovaRaven",
      username: "@novaraven",
      avatar: "/src/assets/images/nix_ember_1790281532486.jpg"
    },
    date: "2025-05-18",
    status: "PENDING",
    content: "An original high-fantasy landscape illustration portraying floating sky citadels, glowing ether rivers, and soaring cloud drakes over Aetheria.",
    image: "/src/assets/images/shadow_realm_ruins_1790282841812.jpg"
  },
  {
    id: "sub-3",
    type: "submission",
    contentType: "Image",
    title: "Sunset City",
    subtitle: "A beautiful landscape from my latest...",
    category: "Anime",
    submittedBy: {
      name: "ZaraFlux",
      username: "@zaraflux",
      avatar: "/src/assets/images/seraphine_vale_1790281437502.jpg"
    },
    date: "2025-05-17",
    status: "PENDING",
    content: "A vibrant neon dusk skyline capturing nostalgic anime aesthetics with train crossings and warm sunset glow over futuristic Tokyo rooftops.",
    image: "/src/assets/images/neon_beat_festival_1790282824470.jpg"
  },
  {
    id: "sub-4",
    type: "submission",
    contentType: "Article",
    title: "Shadow Veil - Fan Fiction",
    subtitle: "A story about choices and second...",
    category: "Gaming",
    submittedBy: {
      name: "LunaTide",
      username: "@lunatide",
      avatar: "/src/assets/images/elara_voss_1790281586127.jpg"
    },
    date: "2025-05-16",
    status: "PENDING",
    content: "Chapter 1 of Shadow Veil explores what happens when a rogue operative in Night City uncovers an AI construct harboring memories of a lost companion.",
    image: "/src/assets/images/cyberpunk_2077_art_1790255907017.jpg"
  },
  {
    id: "sub-5",
    type: "submission",
    contentType: "Article",
    title: "Hidden Gems in Gaming",
    subtitle: "Some underrated games that are...",
    category: "Gaming",
    submittedBy: {
      name: "StormByte",
      username: "@stormbyte",
      avatar: "/src/assets/images/orion_steel_1790281419734.jpg"
    },
    date: "2025-05-16",
    status: "PENDING",
    content: "A curated retrospective on indie masterpieces that deserved more spotlight in 2024, featuring innovative gameplay loops and heartfelt stories.",
    image: "/src/assets/images/elden_ring_thumb_1790269858443.jpg"
  },
  {
    id: "sub-6",
    type: "submission",
    contentType: "Image",
    title: "My Cosplay Journey",
    subtitle: "From idea to final look — here's...",
    category: "Cosplay",
    submittedBy: {
      name: "LunaTide",
      username: "@lunatide",
      avatar: "/src/assets/images/elara_voss_1790281586127.jpg"
    },
    date: "2025-05-15",
    status: "PENDING",
    content: "Behind-the-scenes foam armor fabrication, LED soldering, and fabric dyeing for my regional convention costume debut.",
    image: "/src/assets/images/kaneki_cosplay_1790277871710.jpg"
  },
  {
    id: "sub-7",
    type: "submission",
    contentType: "Article",
    title: "The Lost Horizon - Fan Video",
    subtitle: "A cinematic edit with original...",
    category: "Movies",
    submittedBy: {
      name: "ZaraFlux",
      username: "@zaraflux",
      avatar: "/src/assets/images/seraphine_vale_1790281437502.jpg"
    },
    date: "2025-05-14",
    status: "PENDING",
    content: "An orchestral cinematic edit highlighting interstellar voyages and the timeless human drive to reach beyond the known stars.",
    image: "/src/assets/images/interstellar_space_1790270312783.jpg"
  },
  {
    id: "sub-8",
    type: "submission",
    contentType: "Article",
    title: "The Rise of Retro TV",
    subtitle: "Why old shows still capture our...",
    category: "TV Shows",
    submittedBy: {
      name: "NovaRaven",
      username: "@novaraven",
      avatar: "/src/assets/images/nix_ember_1790281532486.jpg"
    },
    date: "2025-05-14",
    status: "PENDING",
    content: "Exploring the aesthetic nostalgia and cozy storytelling of 90s serialized television that keeps modern audiences re-watching.",
    image: "/src/assets/images/stranger_things_thumb_1790269900192.jpg"
  },
  {
    id: "sub-9",
    type: "submission",
    contentType: "Image",
    title: "Manga Panel Study",
    subtitle: "A collection of panels I really love...",
    category: "Manga",
    submittedBy: {
      name: "EchoSage",
      username: "@echosage",
      avatar: "/src/assets/images/sae_jihyun_1790281620416.jpg"
    },
    date: "2025-05-13",
    status: "PENDING",
    content: "Dynamic line-weight analysis and screentone composition breakdown of high-impact shonen combat panels.",
    image: "/src/assets/images/jjk_manga_cover_1790257065556.jpg"
  },
  {
    id: "sub-10",
    type: "submission",
    contentType: "Article",
    title: "Pixel Quest - Game Mod",
    subtitle: "A new character mod with custom...",
    category: "Gaming",
    submittedBy: {
      name: "EchoSage",
      username: "@echosage",
      avatar: "/src/assets/images/sae_jihyun_1790281620416.jpg"
    },
    date: "2025-05-12",
    status: "PENDING",
    content: "Detailed documentation and sprite sheet preview for a total overhaul character mod adding unique animations and weapon skills.",
    image: "/src/assets/images/minecraft_scenery_1790270298136.jpg"
  },
  {
    id: "sub-11",
    type: "submission",
    contentType: "Article",
    title: "K-Pop Fashion Trends",
    subtitle: "How idols are shaping style in 2025...",
    category: "K-Pop",
    submittedBy: {
      name: "PixelDreamer",
      username: "@pixeldreamer",
      avatar: "/src/assets/images/lumi_idol_1790281470774.jpg"
    },
    date: "2025-05-12",
    status: "PENDING",
    content: "From stage outfits to airport looks, exploring how 5th generation K-Pop aesthetics are blending cyberpunk streetwear with couture chic.",
    image: "/src/assets/images/newjeans_thumb_1790269920672.jpg"
  },
  {
    id: "sub-12",
    type: "submission",
    contentType: "Image",
    title: "Epic Battle Scene",
    subtitle: "A dramatic moment from my favorite...",
    category: "Comics",
    submittedBy: {
      name: "TobiasReed",
      username: "@tobiasreed",
      avatar: "/src/assets/images/seraphine_vale_1790281437502.jpg"
    },
    date: "2025-05-11",
    status: "PENDING",
    content: "Hand-inked comic spread featuring the climax of the dimensional war, filled with cinematic speedlines and kinetic impact.",
    image: "/src/assets/images/spiderman_comic_1790270342039.jpg"
  },
  {
    id: "sub-13",
    type: "submission",
    contentType: "Image",
    title: "Neon Skies & Cyberpunk Alleyways",
    subtitle: "Concept art study for futuristic city...",
    category: "Gaming",
    submittedBy: {
      name: "OrionVex",
      username: "@orionvex",
      avatar: "/src/assets/images/zane_rook_1790281570770.jpg"
    },
    date: "2025-05-10",
    status: "PENDING",
    content: "Environmental matte painting depicting rain-slicked neon alleys, holographic adverts, and hovering transit pods.",
    image: "/src/assets/images/midnight_signal_rain_1790283977485.jpg"
  },
  {
    id: "sub-14",
    type: "submission",
    contentType: "Article",
    title: "Voice Acting Legends: Behind the Mic",
    subtitle: "Celebrating iconic voice performers...",
    category: "Anime",
    submittedBy: {
      name: "KaiZen",
      username: "@kaizen",
      avatar: "/src/assets/images/kael_vex_1790281397401.jpg"
    },
    date: "2025-05-09",
    status: "PENDING",
    content: "An interview retrospective exploring how veteran voice actors bring depth and emotional resonance to unforgettable anime heroes.",
    image: "/src/assets/images/anime_desk_study_1790284532931.jpg"
  },

  // --- FEEDBACK (9 items) ---
  {
    id: "fb-1",
    type: "feedback",
    feedbackType: "Bug",
    subject: "Login issue on mobile",
    subtitle: "I can't seem to log in using the mobile app...",
    category: "Bug",
    submittedBy: {
      name: "KaiZen",
      username: "@kaizen",
      avatar: "/src/assets/images/kael_vex_1790281397401.jpg"
    },
    date: "2025-05-18",
    status: "PENDING",
    message: "When opening the mobile site on iOS Chrome, clicking the login button causes an endless loading spinner without opening the authentication modal."
  },
  {
    id: "fb-2",
    type: "feedback",
    feedbackType: "Bug",
    subject: "App keeps crashing",
    subtitle: "The game closes unexpectedly...",
    category: "Bug",
    submittedBy: {
      name: "PixelDreamer",
      username: "@pixeldreamer",
      avatar: "/src/assets/images/lumi_idol_1790281470774.jpg"
    },
    date: "2025-05-17",
    status: "PENDING",
    message: "The interactive media player unexpectedly closes when attempting to stream 4K resolution content on older mobile devices."
  },
  {
    id: "fb-3",
    type: "feedback",
    feedbackType: "Suggestion",
    subject: "Add dark mode for the community",
    subtitle: "A dark mode option would be great for longer...",
    category: "Suggestion",
    submittedBy: {
      name: "ZaraFlux",
      username: "@zaraflux",
      avatar: "/src/assets/images/seraphine_vale_1790281437502.jpg"
    },
    date: "2025-05-17",
    status: "PENDING",
    message: "A dark mode option would be great for longer reading sessions on articles and fandom lore wikis during night hours."
  },
  {
    id: "fb-4",
    type: "feedback",
    feedbackType: "Query",
    subject: "How to change my username?",
    subtitle: "I'd like to change my username but I can't find...",
    category: "Query",
    submittedBy: {
      name: "NovaRaven",
      username: "@novaraven",
      avatar: "/src/assets/images/nix_ember_1790281532486.jpg"
    },
    date: "2025-05-16",
    status: "PENDING",
    message: "I'd like to change my username but I can't find the setting in the user dashboard. Is there an official request procedure for handle migration?"
  },
  {
    id: "fb-5",
    type: "feedback",
    feedbackType: "Suggestion",
    subject: "Feature Request: Dark Mode",
    subtitle: "Would love to see a proper dark...",
    category: "Suggestion",
    submittedBy: {
      name: "StormByte",
      username: "@stormbyte",
      avatar: "/src/assets/images/orion_steel_1790281419734.jpg"
    },
    date: "2025-05-15",
    status: "PENDING",
    message: "Would love to see a proper dark theme toggle across all wiki entries, comments sections, and article pages to reduce eye strain."
  },
  {
    id: "fb-6",
    type: "feedback",
    feedbackType: "Bug",
    subject: "Images not loading in gallery",
    subtitle: "Some images are not loading properly in the...",
    category: "Bug",
    submittedBy: {
      name: "StormByte",
      username: "@stormbyte",
      avatar: "/src/assets/images/orion_steel_1790281419734.jpg"
    },
    date: "2025-05-15",
    status: "PENDING",
    message: "Some images are not loading properly in the character gallery on mobile browsers unless the page is manually refreshed twice."
  },
  {
    id: "fb-7",
    type: "feedback",
    feedbackType: "Query",
    subject: "More filters for articles",
    subtitle: "It would be helpful to have more filter options...",
    category: "Query",
    submittedBy: {
      name: "LunaTide",
      username: "@lunatide",
      avatar: "/src/assets/images/elara_voss_1790281586127.jpg"
    },
    date: "2025-05-14",
    status: "PENDING",
    message: "Is there a way to get more detailed information about upcoming events? I'd love to see a calendar view or at least more dates and times listed in the event descriptions. Also, it would be great if we could filter events by location or whether they're online or in person. The current info is a bit limited and makes it hard to plan ahead.\n\nThanks for all the amazing work on the platform! It's my favorite place to be part of the community."
  },
  {
    id: "fb-8",
    type: "feedback",
    feedbackType: "Query",
    subject: "More cosplay event options",
    subtitle: "It would be great to have events...",
    category: "Query",
    submittedBy: {
      name: "KaiZen",
      username: "@kaizen",
      avatar: "/src/assets/images/kael_vex_1790281397401.jpg"
    },
    date: "2025-05-13",
    status: "PENDING",
    message: "It would be great to have events categorized by regional cities and prize pool tournaments for competitive cosplay crafters."
  },
  {
    id: "fb-9",
    type: "feedback",
    feedbackType: "Query",
    subject: "Event registration not working",
    subtitle: "I'm getting an error when trying to register for...",
    category: "Query",
    submittedBy: {
      name: "EchoSage",
      username: "@echosage",
      avatar: "/src/assets/images/sae_jihyun_1790281620416.jpg"
    },
    date: "2025-05-13",
    status: "PENDING",
    message: "I'm getting an error when trying to register for the upcoming Starlight Expo fan panel. The confirmation email doesn't seem to trigger."
  }
];

export const fetchPendingApprovals = async () => {
  return Promise.resolve([...MOCK_PENDING_APPROVALS]);
};

export const updatePendingApprovalStatus = async (itemId, newStatus) => {
  const item = MOCK_PENDING_APPROVALS.find((i) => i.id === itemId);
  if (item) {
    item.status = newStatus;
  }
  return Promise.resolve(item);
};



