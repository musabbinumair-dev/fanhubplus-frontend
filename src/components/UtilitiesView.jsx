const FANDOM_TOOLS = [
  {
    id: "resonance-clash",
    title: "Resonance Clash",
    tagline: "Pick two Wuthering Waves Resonators, compare their stats, and simulate an Arena battle to see who comes out on top.",
    category: "Gaming Simulator",
    badge: "ARENA SIM",
    image: "/src/assets/images/halo_master_chief_1790180155350.jpg",
    description: "Stat calculator and damage multiplier comparison engine for Wuthering Waves characters including Jiyan, Yinlin, and Changli."
  },
  {
    id: "shindo-life",
    title: "Shindo Life Build Maker",
    tagline: "Plan your Shindo Life loadout: pick bloodlines, elements, and moves, check for GCD conflicts, and share your build via link.",
    category: "Build Planner",
    badge: "PLAN YOUR BUILD",
    image: "/src/assets/images/sledgehammer_red_game_1790180174083.jpg",
    description: "Optimize sub-abilities, companion synergies, and global cooldown timers for Roblox Shindo Life competitive PvP."
  },
  {
    id: "steal-an-egg",
    title: "Steal An Egg Pet Index",
    tagline: "A Pet Index guide for the Roblox game Steal An Egg — browse all pets and eggs by biome and rarity, track which ones you've collected.",
    category: "Database & Tracker",
    badge: "COLLECTION TRACKER",
    image: "/src/assets/images/pokeball_real_render_1790180829855.jpg",
    description: "Complete drop rates, hatching probabilities, secret multipliers, and biome maps for all collectible pets."
  },
  {
    id: "tier-list-maker",
    title: "Tier List Maker",
    tagline: "Create, rank, and share! Drag-and-drop tier lists for any Fandom in seconds, share your rankings with the world.",
    category: "Community Tool",
    badge: "S A B C D",
    image: "/src/assets/images/one_piece_luffy_1790180189080.jpg",
    description: "Preloaded with anime power scalers, Pokémon competitive tiers, Elden Ring weapon rankings, and movie franchises."
  },
  {
    id: "vtmb2-planner",
    title: "VTMB2 Build Planner",
    tagline: "Plan your Bloodlines 2 build on an interactive skill tree: order unlocks, track AP, Blood Resonance and trainer visits, and share builds via link.",
    category: "Skill Tree",
    badge: "SKILL TREE",
    image: "/src/assets/images/elden_ring_tarnished_1790180785046.jpg",
    description: "Vampire: The Masquerade – Bloodlines 2 clan discipline matrix, feeding affinities, and social stealth trees."
  },
  {
    id: "warp-factor",
    title: "Warp Factor",
    tagline: "Find the shortest connection path between any two Star Trek characters through shared episode appearances.",
    category: "Six Degrees Game",
    badge: "PLAY DAILY",
    image: "/src/assets/images/christina_chong_dog_1790180818784.jpg",
    description: "Six Degrees of the Federation — test your Star Trek canon trivia by linking Picard, Spock, Janeway, and La'an Noonien-Singh."
  }
];

const UtilitiesView = ({
  onBackToHome,
  onOpenToolModal
}) => {
  return (
    <div className="py-2 text-gray-900">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-titan uppercase">
            FanHub Utilities &amp; Tools
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Interactive calculators, build planners, pet indexes, and community games
          </p>
        </div>
        <button
          onClick={onBackToHome}
          className="text-xs font-bold text-[#FFA800] hover:underline cursor-pointer"
        >
          Back to Feed
        </button>
      </div>

      {/* Grid of 6 Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FANDOM_TOOLS.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onOpenToolModal(tool)}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm border border-gray-200 hover:border-[#FFA800]/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            {/* Visual Header */}
            <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
              <img
                src={tool.image}
                alt={tool.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/30 to-transparent pointer-events-none" />

              {/* Badge top right */}
              {tool.badge && (
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-xs text-[#FFA800] border border-[#FFA800]/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow-sm">
                  {tool.badge}
                </div>
              )}

              {/* Title overlay at bottom of image */}
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[10px] font-black text-[#FFA800] uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded border border-white/10">
                  {tool.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5 drop-shadow-sm group-hover:text-[#FFA800] transition-colors">
                  {tool.title}
                </h3>
              </div>
            </div>

            {/* Description Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-gray-500 leading-relaxed">
                {tool.tagline}
              </p>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-200 text-xs">
                <span className="text-[11px] text-gray-500/70 font-medium">Free interactive tool</span>
                <span className="text-xs font-bold text-[#FFA800] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Launch Tool &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export {
  FANDOM_TOOLS,
  UtilitiesView
};
