const MOCK_USER_SUMMARY = {
  name: "Ahsan",
  username: "ahsan_fandom",
  email: "ahsan@FanHub.com",
  level: 18,
  memberSince: "2024",
  avatar: "/src/assets/images/roblox_matteus_avatar_1790188659547.jpg",
  fandomsFollowedCount: 3,
  savedItemsCount: 8
};
const MOCK_FAVORITE_FANDOMS = [
  {
    id: "fandom-anime",
    name: "Anime",
    category: "Animation & Shows",
    articlesCount: "48,290 articles",
    activityCount: "1.8k active discussions",
    image: "/src/assets/images/one_piece_luffy_1790180189080.jpg",
    avatar: "/src/assets/images/one_piece_luffy_1790180189080.jpg",
    color: "#ef4444",
    description: "Explore seasonal anime charts, character stats, voice actors, and ongoing manga adaptations.",
    slug: "anime",
    hasNewContent: true
  },
  {
    id: "fandom-gaming",
    name: "Gaming",
    category: "Interactive Entertainment",
    articlesCount: "124,500 articles",
    activityCount: "3.4k active guides",
    image: "/src/assets/images/elden_ring_tarnished_1790180785046.jpg",
    avatar: "/src/assets/images/pokeball_real_render_1790180829855.jpg",
    color: "#ca8a04",
    description: "Walkthroughs, boss mechanics, patch notes, build planners, and esports tournaments.",
    slug: "gaming",
    hasNewContent: true
  },
  {
    id: "fandom-kpop",
    name: "K-Pop",
    category: "Music & Culture",
    articlesCount: "15,800 articles",
    activityCount: "620 comeback trackers",
    image: "/src/assets/images/pokemon_trainers_grid_1790188697828.jpg",
    avatar: "/src/assets/images/pokemon_trainers_grid_1790188697828.jpg",
    color: "#fa005a",
    description: "Discographies, music video theories, world tours, member profiles, and lightstick lore.",
    slug: "k-pop",
    hasNewContent: false
  },
  {
    id: "fandom-manga",
    name: "Manga",
    category: "Comics & Graphic Novels",
    articlesCount: "32,100 articles",
    activityCount: "890 weekly reviews",
    image: "/src/assets/images/best_top_characters_1790188715557.jpg",
    avatar: "/src/assets/images/best_top_characters_1790188715557.jpg",
    color: "#10b981",
    description: "Weekly chapter breakdowns, author interviews, serialization news, and official translations.",
    slug: "manga",
    hasNewContent: true
  }
];
const MOCK_CONTINUE_EXPLORING = [
  {
    id: "rec-1",
    title: "One Piece: The Truth Behind Void Century & Ancient Weapons",
    category: "Anime & Manga",
    type: "article",
    actionLabel: "Read",
    image: "/src/assets/images/one_piece_luffy_1790180189080.jpg",
    readTimeOrDuration: "5 min read",
    fandomOrigin: "Anime Fandom",
    isSaved: false,
    authorOrSource: "StrawHatLore",
    description: "A deep dive into Eiichiro Oda\u2019s latest Elbaf revelations, Joy Boy\u2019s ancient alliance, and the true power of the Ancient Weapons."
  },
  {
    id: "rec-2",
    title: "Character Spotlight: Master Chief Legacy & SPARTAN-II Records",
    category: "Halo Canon",
    type: "character",
    actionLabel: "View profile",
    image: "/src/assets/images/xbox_layoffs_news_1790180140645.jpg",
    readTimeOrDuration: "Canon Profile",
    fandomOrigin: "Gaming Fandom",
    isSaved: true,
    authorOrSource: "UNSC Archive",
    description: "Explore John-117\u2019s complete military dossier, MJOLNIR armor generational upgrades, and historical battle honours."
  },
  {
    id: "rec-3",
    title: "Featured Trailer: GTA VI Vice City Immersion & Next-Gen Physics",
    category: "Gaming / Trailers",
    type: "trailer",
    actionLabel: "Watch",
    image: "/src/assets/images/best_top_characters_1790188715557.jpg",
    readTimeOrDuration: "2:45 min",
    fandomOrigin: "Gaming Fandom",
    isSaved: false,
    authorOrSource: "Rockstar Showcase",
    description: "Frame-by-frame analysis of Vice City wildlife systems, NPC crowd density, and vehicle customization mechanics."
  },
  {
    id: "rec-4",
    title: "Elden Ring: Shadow of the Erdtree Full Boss Progression Guide",
    category: "Gaming Guides",
    type: "guide",
    actionLabel: "Read guide",
    image: "/src/assets/images/elden_ring_tarnished_1790180785046.jpg",
    readTimeOrDuration: "8 min guide",
    fandomOrigin: "Gaming Fandom",
    isSaved: true,
    authorOrSource: "TarnishedScholar",
    description: "Recommended blessing levels, remembrance weapon scaling, and weakness charts for every major Remembrance boss."
  }
];
const MOCK_SAVED_ORBIT = [
  {
    id: "save-1",
    title: "All The Major Xbox Changes Today: Layoffs, Halo Goes To Activision",
    contentType: "News Story",
    category: "Gaming News",
    image: "/src/assets/images/xbox_layoffs_news_1790180140645.jpg",
    savedAt: "Today",
    readTime: "4 min read",
    author: "Logan Plant"
  },
  {
    id: "save-2",
    title: "Pok\xE9mon Generation 10 Rumors and Competitive Meta Analysis",
    contentType: "Discussion Thread",
    category: "Pok\xE9mon Lore",
    image: "/src/assets/images/pokemon_family_grid_1790188678999.jpg",
    savedAt: "Yesterday",
    readTime: "5 min read",
    author: "DecisivePelican695"
  },
  {
    id: "save-3",
    title: "Elden Ring: Complete Questline Progression Map for Shadow of the Erdtree",
    contentType: "Strategy Guide",
    category: "Gaming",
    image: "/src/assets/images/elden_ring_tarnished_1790180785046.jpg",
    savedAt: "3 days ago",
    readTime: "8 min read",
    author: "LandsBetweenScholar"
  }
];
const MOCK_RECENT_ACTIVITY = [
  {
    id: "act-1",
    type: "saved",
    title: "Saved \u201CCharacter Spotlight\u201D",
    meta: "Today \xB7 Anime",
    timeAgo: "Today",
    iconName: "bookmark",
    relatedId: "rec-2"
  },
  {
    id: "act-2",
    type: "rated",
    title: "Rated \u201CFeatured Trailer\u201D 4/5",
    meta: "Yesterday \xB7 Movies & TV",
    timeAgo: "Yesterday",
    iconName: "star",
    ratingValue: "4/5",
    relatedId: "rec-3"
  },
  {
    id: "act-3",
    type: "explored",
    title: "Explored Gaming",
    meta: "Interactive Wiki Hub",
    timeAgo: "2 days ago",
    iconName: "compass",
    relatedId: "fandom-gaming"
  },
  {
    id: "act-4",
    type: "event",
    title: "Viewed Karachi Anime Meetup",
    meta: "Community Gathering",
    timeAgo: "3 days ago",
    iconName: "calendar",
    relatedId: "event-karachi-anime"
  }
];
const MOCK_UPCOMING_EVENTS = [
  {
    id: "event-karachi-anime",
    title: "Karachi Anime Meetup",
    date: "28 September 2026",
    displayDate: "28 SEP",
    time: "4:00 PM PKT",
    location: "Karachi, Pakistan",
    isOnline: false,
    category: "Anime",
    image: "/src/assets/images/one_piece_luffy_1790180189080.jpg",
    attendeesCount: 340,
    description: "Annual gathering of anime fans, cosplay showcases, manga trivia quizzes, and exclusive artist alley prints.",
    isFeatured: true
  },
  {
    id: "event-tokyo-game-show",
    title: "Tokyo Game Show Watch Party",
    date: "30 September 2026",
    displayDate: "30 SEP",
    time: "10:00 AM PKT",
    location: "Online \u2022 Discord Live Stage",
    isOnline: true,
    category: "Gaming",
    image: "/src/assets/images/elden_ring_tarnished_1790180785046.jpg",
    attendeesCount: 1250,
    description: "Community live stream reaction and roundtable breakdown of world premiere game announcements.",
    isFeatured: false
  },
  {
    id: "event-comic-con-panel",
    title: "Comic Con Superhero Panel",
    date: "5 October 2026",
    displayDate: "05 OCT",
    time: "6:00 PM PKT",
    location: "Expo Centre Karachi & Virtual Stream",
    isOnline: false,
    category: "Comics & TV",
    image: "/src/assets/images/best_top_characters_1790188715557.jpg",
    attendeesCount: 820,
    description: "Special screening and creator Q&A session discussing upcoming comic book movie adaptations.",
    isFeatured: false
  }
];
export {
  MOCK_CONTINUE_EXPLORING,
  MOCK_FAVORITE_FANDOMS,
  MOCK_RECENT_ACTIVITY,
  MOCK_SAVED_ORBIT,
  MOCK_UPCOMING_EVENTS,
  MOCK_USER_SUMMARY
};
