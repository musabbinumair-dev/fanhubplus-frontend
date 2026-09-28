import { HERO_FEATURED } from "../../data/homepageData";

const Hero = ({ onOpenArticle, onExplore }) => {
  return (
    <section className="relative w-full overflow-hidden border-b border-gray-200 bg-[#0A0A0C] select-none group">
      {/* 1. COMIC BOOK MULTI-PANEL COLLAGE BACKGROUND */}
      <div className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] lg:h-[600px] overflow-hidden">
        {/* Main Comic Artwork Image */}
        <img
          src="/src/assets/images/horseman_comic_hero_1790251215245.jpg"
          alt="The Horseman: Welcome to Florespark"
          className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.015]"
        />

        {/* Comic Panel Grid & Gutters Accent Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left panel subtle border line */}
          <div className="absolute top-0 bottom-0 left-[28%] w-[2px] bg-black/40 hidden md:block" />
          {/* Right panel subtle border line */}
          <div className="absolute top-0 bottom-0 right-[32%] w-[2px] bg-black/40 hidden lg:block" />
          {/* Horizontal panel dividing line on right side */}
          <div className="absolute top-[48%] right-0 w-[32%] h-[2px] bg-black/50 hidden lg:block" />
        </div>

        {/* Cinematic Vignette & Text Readability Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent w-full md:w-[70%]" />
        
        {/* Top subtle dark gradient */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/75 to-transparent pointer-events-none" />

        {/* Bottom subtle dark gradient */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

        {/* Subtle comic book halftone texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(#FFF 1px, transparent 1px)",
            backgroundSize: "8px 8px"
          }}
        />

        {/* 2. HERO CONTENT OVERLAY (LEFT-ALIGNED MATCHING SCREENSHOT) */}
        <div className="absolute inset-0 z-10">
          <div className="max-w-7xl mx-auto h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16">
            <div className="max-w-xl">
              {/* Red Subheader */}
              <div className="mb-2 sm:mb-3">
                <span className="text-[#FF2A2A] text-xs sm:text-sm font-black tracking-widest uppercase">
                  THE HORSEMAN
                </span>
              </div>

              {/* Massive Headline (The Horseman: Welcome to Florespark) */}
              <h1 className="font-titan text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[1.04]">
                THE HORSEMAN:
                <br />
                WELCOME TO
                <br />
                FLORESPARK
              </h1>

              {/* Action Button: Chamfered Yellow "EXPLORE" */}
              <div className="mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={() => {
                    if (onExplore) {
                      onExplore();
                    } else if (onOpenArticle) {
                      onOpenArticle(HERO_FEATURED);
                    }
                  }}
                  className="relative inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-3.5 bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] text-black text-xs sm:text-sm font-black tracking-wider uppercase transition-colors duration-200 cursor-pointer"
                  style={{
                    clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)"
                  }}
                >
                  <span>EXPLORE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
