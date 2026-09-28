const RECENT_WIKIS_INITIAL = [
  {
    id: "pokemon",
    name: "Pok\xE9mon Wiki",
    slug: "pokemon",
    icon: "/src/assets/images/pokeball_real_render_1790180829855.jpg",
    articlesCount: "52,831",
    description: "The definitive encyclopedic guide to every Generation, Pok\xE9mon, moves, abilities, and regional lore.",
    color: "#ef4444"
  },
  {
    id: "onepiece",
    name: "One Piece Wiki",
    slug: "onepiece",
    icon: "/src/assets/images/one_piece_luffy_1790180189080.jpg",
    articlesCount: "7,892",
    description: "All about the Straw Hat Pirates, Devil Fruits, Grand Line, and Eiichiro Oda masterpiece.",
    color: "#3b82f6"
  },
  {
    id: "eldenring",
    name: "Elden Ring Wiki",
    slug: "eldenring",
    icon: "/src/assets/images/elden_ring_tarnished_1790180785046.jpg",
    articlesCount: "4,846",
    description: "The Lands Between guide: bosses, weapon scaling, incantations, NPC quests, and Shadow of the Erdtree.",
    color: "#ca8a04"
  },
  {
    id: "starwars",
    name: "Wookieepedia",
    slug: "starwars",
    icon: "/src/assets/images/deep_space_warriors_1790180983398.jpg",
    articlesCount: "223,395",
    description: "The Star Wars wiki covering canon and Legends, lightsabers, Jedi Order, Sith, and galaxies far away.",
    color: "#10b981"
  }
];
const WORLDS_TO_DISCOVER = [
  {
    id: "one-piece-wiki",
    name: "One Piece Wiki",
    articlesCount: "7,892 articles",
    image: "/src/assets/images/one_piece_luffy_1790180189080.jpg",
    avatar: "/src/assets/images/one_piece_luffy_1790180189080.jpg",
    category: "Anime & Manga",
    description: "Dive into the world of pirates, Devil Fruits, and the search for Gol D. Roger supreme treasure.",
    color: "#dc2626"
  },
  {
    id: "elden-ring-wiki",
    name: "Elden Ring Wiki",
    articlesCount: "4,846 articles",
    image: "/src/assets/images/elden_ring_tarnished_1790180785046.jpg",
    avatar: "/src/assets/images/elden_ring_tarnished_1790180785046.jpg",
    badgeText: "ELDEN RING",
    category: "Gaming",
    description: "Navigate the Lands Between, defeat Shardbearers, and uncover the mysteries of Queen Marika.",
    color: "#b45309"
  },
  {
    id: "wookieepedia",
    name: "Wookieepedia",
    articlesCount: "223,395 articles",
    image: "/src/assets/images/deep_space_warriors_1790180983398.jpg",
    avatar: "/src/assets/images/deep_space_warriors_1790180983398.jpg",
    badgeText: "WOOKIEEPEDIA",
    category: "Sci-Fi & Movies",
    description: "The grand compendium of Star Wars lore, spanning the High Republic, Galactic Empire, and beyond.",
    color: "#0284c7"
  },
  {
    id: "zelda-wiki",
    name: "Zelda Wiki",
    articlesCount: "11,420 articles",
    image: "/src/assets/images/elden_ring_tarnished_1790180785046.jpg",
    avatar: "/src/assets/images/elden_ring_tarnished_1790180785046.jpg",
    badgeText: "ZELDA WIKI",
    category: "Gaming",
    description: "Hyrule lore, shrines, master sword secrets, Tears of the Kingdom, and timeline chronicles.",
    color: "#059669"
  }
];
const TOP_NEWS_HERO = {
  id: "xbox-changes-2026",
  title: "All The Major Xbox Changes Today: Layoffs, Halo Goes To Activision, And More",
  date: "September 22, 2026",
  excerpt: 'The Xbox "reset" continues.',
  image: "/src/assets/images/xbox_layoffs_news_1790180140645.jpg",
  author: "Logan Plant",
  category: "Gaming News",
  readTime: "4 min read",
  isHero: true,
  content: [
    "Microsoft has announced a sweeping series of structural realignments across its gaming division today, shaking up several flagship franchises and development pipelines.",
    "Most notably, the stewardship of the legendary Halo franchise has transitioned into a collaborative co-development structure involving Activision veteran studios, signaling the biggest creative transformation for Master Chief in over a decade.",
    "Xbox leadership emphasized that these strategic shifts are designed to accelerate content cadence, expand cross-platform accessibility, and focus resources on transformative cloud and multi-device gaming experiences.",
    "Industry analysts view this as the natural culmination of Microsoft recent acquisitions, consolidating engineering horsepower across internal studios to deliver on long-promised roadmaps."
  ]
};
const TOP_NEWS_GRID = [
  {
    id: "halo-next-game",
    title: "Halo's Next Game Is Coming From An Unexpected Developer: Activision",
    date: "September 22, 2026",
    excerpt: "A surprising partnership takes shape as Activision studios take the helm on the next mainline installment.",
    image: "/src/assets/images/halo_master_chief_1790180155350.jpg",
    author: "Kat Bailey",
    category: "Gaming",
    readTime: "3 min read",
    content: [
      "Following internal discussions regarding the future direction of 343 Industries and Halo Studios, Microsoft has formally greenlit a project where Activision battle-tested teams will co-lead the next campaign engine.",
      "Sources familiar with the production report that the game will run entirely on Unreal Engine 5, leaving behind the legacy Slipspace Engine in favor of modular multiplayer tools and advanced cinematic lighting.",
      "Fans can anticipate early technical previews beginning in late 2027 as the teams hone in on core combat loops and arena competitive balance."
    ]
  },
  {
    id: "sledgehammer-haunting-game",
    title: "I've Become An Awful Jerk Whenever I Play This Haunting Sledgehammer Game",
    date: "September 22, 2026",
    excerpt: "A brutal survival horror gem turns players against their moral compass with every swing.",
    image: "/src/assets/images/sledgehammer_red_game_1790180174083.jpg",
    author: "Kenneth Shepard",
    category: "Features",
    readTime: "5 min read",
    content: [
      "There is a distinct tension that grips you when resources dwindle down to a rusted station wagon and an unwieldy steel sledgehammer.",
      "The newly released indie psychological horror title pushes psychological boundaries, forcing players into cutthroat dilemmas to preserve vehicle battery power against nocturnal anomalies.",
      "Every encounter demands precise timing, where hesitation means irreversible damage to your gear and companionship."
    ]
  },
  {
    id: "silent-hill-townfall",
    title: "Silent Hill: Townfall Completes The Series' Comeback With Another Great Entry",
    date: "September 22, 2026",
    excerpt: "Konami and No Code deliver an atmospheric, spine-chilling auditory masterpiece.",
    image: "/src/assets/images/silent_hill_townfall_1790180807707.jpg",
    author: "Diego Perez",
    category: "Reviews",
    readTime: "4 min read",
    content: [
      "Townfall takes the psychological dread of the classic Silent Hill entries and marries it with No Code signature tactile audio-visual interface.",
      "Rather than relying on cheap jump scares, the title immerses players in analog radio frequencies, fog-choked Scottish coastal harbors, and lingering existential dread.",
      "With critical scores hovering at 89, Silent Hill has firmly reclaimed its throne in psychological survival horror."
    ]
  },
  {
    id: "strange-new-worlds-christina",
    title: "Strange New Worlds' Christina Chong on Acting With Herself and Her Dog",
    date: "September 18, 2026",
    excerpt: "The Star Trek fan-favorite opens up about emotional scenes and her four-legged companion on the set of the Enterprise.",
    image: "/src/assets/images/christina_chong_dog_1790180818784.jpg",
    author: "James Whitbrook",
    category: "TV & Film",
    readTime: "4 min read",
    content: [
      "In a candid sit-down, Christina Chong (La'an Noonien-Singh) recounted the uniquely challenging dual-role performance in the latest season episode.",
      "Her real-life rescue dog made a special guest appearance on the bridge of the U.S.S. Enterprise, melting the hearts of cast members and Trekkies worldwide.",
      '"Acting against alternate timeline versions of yourself is one thing, but keeping a terrier calm on a sci-fi set with flashing consoles is the true stunt work," Chong laughed.'
    ]
  }
];
const ACTIVE_DISCUSSIONS = [
  {
    id: "disc-1",
    title: "Jigglypuff New Look",
    author: "Luxaloverzy",
    avatar: "user-jiggly",
    thumbnail: "/src/assets/images/jigglypuff_fanart_art_1790180839623.jpg",
    body: "I made body more balooney! (it makes sense cause Jigglypuff is balloon Pokemon, not furry), i made eye shinier to give small glimmer, and the curl is extra puffy. What do you all think of this redesign concept?",
    likes: 3,
    comments: 0,
    timeAgo: "2h ago",
    community: "Pok\xE9mon Community",
    tags: ["Art", "Pokemon", "Redesign"]
  },
  {
    id: "disc-2",
    title: "just based on what she looks like pt. 4...",
    author: "ChronicallyOnlineAndTermina...",
    avatar: "user-anime",
    thumbnail: "/src/assets/images/mafuyu_anime_art_1790180850935.jpg",
    body: "What pokemon do you think she would have? This is Mafuyu Asahina lol Anyways, hi! I haven't been here in a long time Some people said Ghost or Dark types like Mimikyu, Chandelure, or maybe a quiet Froslass. What fits her vibe best?",
    likes: 0,
    comments: 9,
    timeAgo: "5h ago",
    community: "Project SEKAI Wiki",
    tags: ["Crossover", "Discussion", "Anime"]
  },
  {
    id: "disc-3",
    title: "The Powerpuff pokemon!!!",
    author: "Whatsuphotdogman",
    avatar: "user-powerpuff",
    thumbnail: "/src/assets/images/powerpuff_starters_art_1790180862911.jpg",
    body: "*Powerpuff girls theme plays* YEAH!! thought of making something related Sprigatito, Acquaticogattino, and Litt... Blossom, Bubbles, and Buttercup as starter elemental trio! Check out the color palette test.",
    likes: 2,
    comments: 0,
    timeAgo: "8h ago",
    community: "Pok\xE9mon Fanon",
    tags: ["FanArt", "Powerpuff", "Creativity"]
  }
];
const TRENDING_ITEMS = [
  {
    id: "trend-mephisto",
    title: "Mephisto",
    wikiName: "Hungry Shark Wiki",
    wikiBadge: "shark-badge",
    image: "/src/assets/images/mephisto_shark_art_1790180872847.jpg",
    viewsToday: "42.8k views",
    category: "Beasts & Bosses"
  },
  {
    id: "trend-toyman",
    title: "Toyman (Absolute Universe)",
    wikiName: "Pure Evil Wiki",
    wikiBadge: "evil-badge",
    image: "/src/assets/images/toyman_comic_art_1790180884859.jpg",
    viewsToday: "38.1k views",
    category: "DC Comics"
  },
  {
    id: "trend-ace",
    title: "Ace Trappola/Cards/SSR Great Look",
    wikiName: "Twisted Wonderland Wiki",
    wikiBadge: "mirror-badge",
    image: "/src/assets/images/ace_trappola_card_1790180897062.jpg",
    viewsToday: "29.4k views",
    category: "Characters"
  },
  {
    id: "trend-numberland",
    title: "List of wonders in Numberland",
    wikiName: "Numberblocks Wiki",
    wikiBadge: "number-badge",
    image: "/src/assets/images/numberland_rainbow_blocks_1790180908779.jpg",
    viewsToday: "19.7k views",
    category: "Episodes & Lore"
  }
];
export {
  ACTIVE_DISCUSSIONS,
  RECENT_WIKIS_INITIAL,
  TOP_NEWS_GRID,
  TOP_NEWS_HERO,
  TRENDING_ITEMS,
  WORLDS_TO_DISCOVER
};
