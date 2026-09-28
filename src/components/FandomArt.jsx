import { Logo } from "./Logo.jsx";

const PokeballIcon = ({ size = 48, className = "" }) => <svg
  width={size}
  height={size}
  viewBox="0 0 100 100"
  className={`drop-shadow-sm select-none ${className}`}
>
    <defs>
      <radialGradient id="pokeTopGrad" cx="40%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#ff4d4d" />
        <stop offset="60%" stopColor="#e60000" />
        <stop offset="100%" stopColor="#b30000" />
      </radialGradient>
      <radialGradient id="pokeBottomGrad" cx="40%" cy="70%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#eef0f2" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </radialGradient>
      <radialGradient id="pokeBtnGrad" cx="45%" cy="45%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="80%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </radialGradient>
      <filter id="pokeGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
      </filter>
    </defs>
    {
  /* Base shadow */
}
    <ellipse cx="50" cy="94" rx="36" ry="6" fill="rgba(0,0,0,0.15)" />
    
    {
  /* Clip circle */
}
    <g filter="url(#pokeGlow)">
      {
  /* Outer shell border */
}
      <circle cx="50" cy="50" r="46" fill="#1e293b" />
      
      {
  /* Top half red */
}
      <path d="M 6,50 A 44,44 0 0,1 94,50 Z" fill="url(#pokeTopGrad)" />
      
      {
  /* Bottom half white */
}
      <path d="M 6,50 A 44,44 0 0,0 94,50 Z" fill="url(#pokeBottomGrad)" />
      
      {
  /* Black dividing band */
}
      <rect x="6" y="45" width="88" height="10" fill="#111827" />
      
      {
  /* Outer button ring */
}
      <circle cx="50" cy="50" r="16" fill="#111827" />
      
      {
  /* Inner white button */
}
      <circle cx="50" cy="50" r="11" fill="url(#pokeBtnGrad)" stroke="#334155" strokeWidth="1.5" />
      
      {
  /* Center detail */
}
      <circle cx="50" cy="50" r="5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
    </g>
  </svg>;
const FandomFlameIcon = ({ size = 28, className = "" }) => <svg
  width={size}
  height={size}
  viewBox="0 0 120 120"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className={className}
>
    <defs>
      <linearGradient id="flameBack" x1="10" y1="110" x2="110" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fa005a" />
        <stop offset="50%" stopColor="#ff3366" />
        <stop offset="100%" stopColor="#ffb800" />
      </linearGradient>
      <linearGradient id="flameFront" x1="30" y1="90" x2="90" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ff0055" />
        <stop offset="70%" stopColor="#ffdd00" />
        <stop offset="100%" stopColor="#ffffff" />
      </linearGradient>
    </defs>
    {
  /* Outer stylised flame heart */
}
    <path
  d="M60 112 C28 92 12 70 12 44 C12 22 30 8 50 14 C55 16 60 22 60 22 C60 22 65 16 70 14 C90 8 108 22 108 44 C108 70 92 92 60 112 Z"
  fill="url(#flameBack)"
/>
    {
  /* Inner fiery flame tongue */
}
    <path
  d="M60 96 C42 82 30 66 30 48 C30 34 40 24 52 28 C56 29 60 35 60 35 C60 35 64 29 68 28 C80 24 90 34 90 48 C90 66 78 82 60 96 Z"
  fill="url(#flameFront)"
  opacity="0.9"
/>
    <path
  d="M60 84 C48 74 42 62 42 50 C42 42 48 36 56 38 C59 39 60 44 60 44 C60 44 61 39 64 38 C72 36 78 42 78 50 C78 62 72 74 60 84 Z"
  fill="#ffffff"
  opacity="0.75"
/>
  </svg>;
const FandomBrand = ({ size = "md" }) => {
  const logoSize = size === "sm" ? "footer" : size === "lg" ? "login" : "navbar";
  return (
    <div className="flex items-center select-none">
      <Logo size={logoSize} />
    </div>
  );
};
const EldenRingArt = ({ className = "" }) => <div className={`relative w-full h-full bg-slate-900 overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/60 to-slate-900" />
    <svg className="absolute inset-0 w-full h-full object-cover" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="erTorch" cx="35%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ffd88a" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#d97706" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="erGoldRays" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#b45309" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
      </defs>
      {
  /* Stone chamber arches */
}
      <rect width="400" height="300" fill="#090d16" />
      <circle cx="150" cy="120" r="140" fill="url(#erTorch)" />
      
      {
  /* Distant Erdtree ambient golden rays */
}
      <circle cx="200" cy="80" r="180" fill="url(#erGoldRays)" />
      
      {
  /* Gothic arches in silhouette */
}
      <path d="M 40,300 L 40,110 Q 90,60 140,110 L 140,300 Z" fill="#070b12" opacity="0.8" />
      <path d="M 160,300 L 160,90 Q 220,30 280,90 L 280,300 Z" fill="#05080e" opacity="0.9" />
      <path d="M 290,300 L 290,120 Q 340,70 390,120 L 390,300 Z" fill="#070b12" opacity="0.8" />

      {
  /* Tarnished knight armored silhouette & helm */
}
      <g transform="translate(140, 50)">
        {
  /* Knight armor highlights */
}
        {
  /* Ornate Winged/horned helm */
}
        <path d="M 60,30 Q 35,45 25,20 Q 40,55 55,60 L 55,90 L 85,90 L 85,60 Q 100,55 115,20 Q 105,45 80,30 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <path d="M 45,60 L 95,60 L 88,100 L 52,100 Z" fill="#334155" />
        {
  /* Visor slit glow */
}
        <line x1="62" y1="75" x2="78" y2="75" stroke="#fcd34d" strokeWidth="2" />
        
        {
  /* Armor shoulders & plate */
}
        <path d="M 15,100 L 125,100 L 140,240 L 0,240 Z" fill="#1e293b" />
        <path d="M 30,105 L 110,105 L 105,180 L 35,180 Z" fill="#334155" opacity="0.6" />
        {
  /* Heavy battle hammer / staff */
}
        <line x1="10" y1="230" x2="30" y2="70" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
        <circle cx="32" cy="65" r="14" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="22" y1="65" x2="42" y2="65" stroke="#fef08a" strokeWidth="2" />
      </g>
    </svg>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
  </div>;
const StarWarsArt = ({ className = "" }) => <div className={`relative w-full h-full bg-slate-950 overflow-hidden ${className}`}>
    <svg className="absolute inset-0 w-full h-full object-cover" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="swSun" cx="65%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#b45309" stopOpacity="0.6" />
          <stop offset="80%" stopColor="#1e1b4b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#090514" />
        </radialGradient>
        <linearGradient id="blueSaber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {
  /* Space & desert duel background */
}
      <rect width="400" height="300" fill="url(#swSun)" />

      {
  /* Distant stars & laser bolts */
}
      <circle cx="80" cy="50" r="1.5" fill="#fff" />
      <circle cx="120" cy="70" r="1" fill="#fff" />
      <circle cx="280" cy="40" r="1.5" fill="#fff" />
      <circle cx="340" cy="60" r="1" fill="#fff" />

      {
  /* Gunship & starfighters in sky */
}
      <polygon points="50,60 85,68 70,72 45,64" fill="#334155" />
      <polygon points="290,40 320,46 308,50 285,44" fill="#1e293b" />

      {
  /* Jango Fett bounty hunter helmet profile */
}
      <g transform="translate(190, 20)">
        <ellipse cx="70" cy="70" rx="45" ry="55" fill="#94a3b8" />
        {
  /* T-visor */
}
        <rect x="64" y="50" width="12" height="48" fill="#020617" />
        <rect x="42" y="58" width="56" height="12" fill="#020617" />
        {
  /* Rangefinder antenna */
}
        <line x1="110" y1="35" x2="110" y2="70" stroke="#0284c7" strokeWidth="4" />
        <rect x="104" y="25" width="16" height="12" fill="#38bdf8" />
      </g>

      {
  /* Obi-Wan & Anakin lightsabers glowing in front */
}
      <line x1="80" y1="260" x2="220" y2="120" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
      <line x1="80" y1="260" x2="220" y2="120" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

      {
  /* Green lightsaber clash */
}
      <line x1="260" y1="250" x2="160" y2="110" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <line x1="260" y1="250" x2="160" y2="110" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

      {
  /* Clone troopers ranks in foreground */
}
      <path d="M 0,220 L 400,210 L 400,300 L 0,300 Z" fill="#090d16" opacity="0.95" />
      <text x="200" y="55" textAnchor="middle" fill="#ffffff" opacity="0.25" fontSize="28" fontWeight="900" letterSpacing="4">
        STAR WARS
      </text>
    </svg>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
  </div>;
const SilentHillArt = ({ className = "" }) => <div className={`relative w-full h-full bg-[#0a0505] overflow-hidden ${className}`}>
    <svg className="absolute inset-0 w-full h-full object-cover" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="shRedFog" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#450a0a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#050202" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#shRedFog)" />
      {
  /* Fog mist textures */
}
      <ellipse cx="200" cy="180" rx="160" ry="80" fill="#991b1b" opacity="0.25" />
      
      {
  /* Distant moody figure in red doorway */
}
      <rect x="165" y="80" width="70" height="150" fill="#090303" stroke="#b91c1c" strokeWidth="1" />
      <ellipse cx="200" cy="115" rx="12" ry="14" fill="#1c0707" />
      <path d="M 188,130 L 212,130 L 220,200 L 180,200 Z" fill="#180404" />
      
      {
  /* Creepy TV scanlines & analog noise */
}
      <line x1="0" y1="60" x2="400" y2="60" stroke="#fca5a5" strokeWidth="0.5" opacity="0.3" />
      <line x1="0" y1="140" x2="400" y2="140" stroke="#fca5a5" strokeWidth="0.5" opacity="0.2" />
      <line x1="0" y1="220" x2="400" y2="220" stroke="#fca5a5" strokeWidth="0.5" opacity="0.3" />
    </svg>
    {
  /* Cinematic Title Banner overlay matching screenshot */
}
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/40">
      <span className="text-white text-2xl md:text-3xl font-light tracking-[0.25em] drop-shadow-md">
        SILENT HILL
      </span>
      <span className="text-red-500 font-serif italic text-lg tracking-widest mt-0.5">
        townfall
      </span>
    </div>
  </div>;
const StrangeNewWorldsArt = ({ className = "" }) => <div className={`relative w-full h-full bg-slate-950 overflow-hidden ${className}`}>
    <svg className="absolute inset-0 w-full h-full object-cover" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="trekBridge" cx="60%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#0f172a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#trekBridge)" />

      {
  /* Enterprise consoles */
}
      <path d="M 0,240 L 400,240 L 400,300 L 0,300 Z" fill="#090d16" />
      <circle cx="80" cy="270" r="3" fill="#38bdf8" />
      <circle cx="110" cy="270" r="3" fill="#fbbf24" />
      <circle cx="140" cy="270" r="3" fill="#f43f5e" />

      {
  /* Starfleet officer silhouette with maroon uniform */
}
      <g transform="translate(100, 60)">
        <ellipse cx="60" cy="45" rx="22" ry="26" fill="#fbcfe8" />
        {
  /* Dark hair sleek ponytail */
}
        <path d="M 38,40 Q 60,15 82,40 Q 90,70 82,90 L 38,70 Z" fill="#0f172a" />
        {
  /* Starfleet uniform & gold delta badge */
}
        <path d="M 25,75 L 95,75 L 110,180 L 10,180 Z" fill="#991b1b" />
        <polygon points="48,95 55,85 62,95 55,92" fill="#fbbf24" />
      </g>

      {
  /* Cute companion dog on the bridge */
}
      <g transform="translate(230, 110)">
        <ellipse cx="50" cy="60" rx="30" ry="24" fill="#78350f" />
        <circle cx="30" cy="45" rx="16" ry="16" fill="#92400e" />
        {
  /* Floppy ears */
}
        <ellipse cx="20" cy="40" rx="6" ry="14" fill="#451a03" />
        <ellipse cx="40" cy="40" rx="6" ry="14" fill="#451a03" />
        {
  /* Shiny nose */
}
        <circle cx="18" cy="48" r="4" fill="#0f172a" />
      </g>
    </svg>
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
  </div>;
const JigglypuffThumb = ({ size = 64, className = "" }) => <div className={`relative flex items-center justify-center bg-pink-50 rounded-lg border border-pink-200 overflow-hidden ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full p-1">
      {
  /* Balloon body */
}
      <circle cx="50" cy="52" r="38" fill="#fbcfe8" stroke="#1e293b" strokeWidth="2.5" />
      
      {
  /* Pointy ears */
}
      <polygon points="22,32 15,8 38,20" fill="#fbcfe8" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="20,28 17,14 32,22" fill="#475569" />
      
      <polygon points="78,32 85,8 62,20" fill="#fbcfe8" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="80,28 83,14 68,22" fill="#475569" />

      {
  /* Signature puffy curl hair */
}
      <path d="M 40,24 C 40,8 60,6 64,18 C 68,28 54,34 50,30" fill="#fbcfe8" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

      {
  /* Big shiny anime/balloon eyes */
}
      <circle cx="36" cy="48" r="11" fill="#0284c7" stroke="#1e293b" strokeWidth="2" />
      <circle cx="38" cy="46" r="5" fill="#ffffff" />
      <circle cx="33" cy="52" r="2" fill="#bae6fd" />

      <circle cx="64" cy="48" r="11" fill="#0284c7" stroke="#1e293b" strokeWidth="2" />
      <circle cx="66" cy="46" r="5" fill="#ffffff" />
      <circle cx="61" cy="52" r="2" fill="#bae6fd" />

      {
  /* Tiny happy open mouth */
}
      <path d="M 46,62 Q 50,68 54,62 Z" fill="#f43f5e" stroke="#1e293b" strokeWidth="1.5" />

      {
  /* Cute stubby arms */
}
      <ellipse cx="26" cy="62" rx="6" ry="4" fill="#fbcfe8" stroke="#1e293b" strokeWidth="2" />
      <ellipse cx="74" cy="62" rx="6" ry="4" fill="#fbcfe8" stroke="#1e293b" strokeWidth="2" />
    </svg>
  </div>;
const AnimeMafuyuThumb = ({ size = 64, className = "" }) => <div className={`relative flex items-center justify-center bg-slate-100 rounded-lg border border-slate-300 overflow-hidden ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full p-1">
      <rect width="100" height="100" fill="#f1f5f9" />
      {
  /* Melancholic anime girl with long purple strands */
}
      {
  /* Hair back */
}
      <path d="M 20,40 C 15,70 25,95 30,100 L 75,100 C 80,95 85,70 80,40 Z" fill="#4338ca" opacity="0.3" />
      {
  /* Face outline */
}
      <polygon points="35,40 50,75 65,40" fill="#fed7aa" stroke="#334155" strokeWidth="1.5" />
      {
  /* Long dark front bangs */
}
      <path d="M 30,25 Q 50,20 70,25 Q 65,55 58,60 Q 50,45 42,60 Q 35,50 30,25 Z" fill="#312e81" stroke="#1e1b4b" strokeWidth="1.5" />
      {
  /* Gentle anime eyes */
}
      <ellipse cx="42" cy="46" rx="4" ry="5" fill="#3730a3" />
      <circle cx="43" cy="44" r="1.5" fill="#ffffff" />
      <ellipse cx="58" cy="46" rx="4" ry="5" fill="#3730a3" />
      <circle cx="59" cy="44" r="1.5" fill="#ffffff" />
      {
  /* Tiny blush & mouth */
}
      <line x1="48" y1="58" x2="52" y2="58" stroke="#475569" strokeWidth="1.2" />
    </svg>
  </div>;
const PowerpuffThumb = ({ size = 64, className = "" }) => <div className={`relative flex items-center justify-center bg-pink-100 rounded-lg border border-pink-300 overflow-hidden ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full p-0.5">
      <defs>
        <linearGradient id="ppgBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#ppgBg)" opacity="0.3" />
      {
  /* Three Powerpuff style pokemon heads */
}
      {
  /* Blossom / Pink cat in middle */
}
      <circle cx="50" cy="40" r="18" fill="#f43f5e" stroke="#1e293b" strokeWidth="2" />
      <polygon points="40,24 50,10 52,24" fill="#dc2626" />
      <circle cx="45" cy="38" r="6" fill="#f43f5e" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="45" cy="38" r="3" fill="#ffffff" />
      <circle cx="55" cy="38" r="6" fill="#f43f5e" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="55" cy="38" r="3" fill="#ffffff" />

      {
  /* Bubbles / Blue on left */
}
      <circle cx="24" cy="58" r="14" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="22" cy="56" r="4.5" fill="#0284c7" />
      <circle cx="23" cy="55" r="2" fill="#ffffff" />

      {
  /* Buttercup / Green on right */
}
      <circle cx="76" cy="58" r="14" fill="#22c55e" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="74" cy="56" r="4.5" fill="#15803d" />
      <circle cx="75" cy="55" r="2" fill="#ffffff" />
    </svg>
  </div>;
const MephistoArt = ({ className = "" }) => <div className={`relative w-full h-full bg-indigo-950 overflow-hidden ${className}`}>
    <svg className="absolute inset-0 w-full h-full object-cover" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="mephGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="40%" stopColor="#6b21a8" />
          <stop offset="80%" stopColor="#3b0764" />
          <stop offset="100%" stopColor="#0f0728" />
        </radialGradient>
      </defs>
      <rect width="200" height="150" fill="url(#mephGrad)" />
      {
  /* Flaming shark jaws & horns */
}
      <path d="M 20,130 C 50,40 130,20 180,60 C 140,80 120,130 90,140 Z" fill="#7e22ce" stroke="#e879f9" strokeWidth="2" />
      <polygon points="120,50 160,30 140,70" fill="#f43f5e" />
      <polygon points="90,45 110,20 105,55" fill="#f43f5e" />
      {
  /* Glowing purple eye */
}
      <circle cx="130" cy="65" r="7" fill="#fbbf24" stroke="#7e22ce" strokeWidth="2" />
      <circle cx="130" cy="65" r="3" fill="#ffffff" />
      {
  /* Fierce razor teeth */
}
      <polygon points="135,85 145,95 155,85 165,95 175,85" fill="#ffffff" />
    </svg>
    <div className="absolute top-1 left-2 bg-purple-900/80 text-[9px] font-bold text-amber-300 px-1 rounded uppercase">
      Evolution
    </div>
  </div>;
const ToymanArt = ({ className = "" }) => <div className={`relative w-full h-full bg-slate-900 overflow-hidden ${className}`}>
    <svg className="absolute inset-0 w-full h-full object-cover" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="150" fill="#0f172a" />
      {
  /* Cybernetic yellow visor & helmet */
}
      <g transform="translate(45, 10)">
        {
  /* Head */
}
        <ellipse cx="55" cy="70" rx="42" ry="50" fill="#fed7aa" stroke="#0f172a" strokeWidth="2" />
        {
  /* Yellow high-tech helmet/visor */
}
        <path d="M 12,40 C 25,10 85,10 98,40 L 102,70 L 8,70 Z" fill="#eab308" stroke="#854d0e" strokeWidth="2" />
        <rect x="20" y="52" width="70" height="16" rx="4" fill="#ca8a04" stroke="#fef08a" strokeWidth="1" />
        <line x1="25" y1="60" x2="85" y2="60" stroke="#fef08a" strokeWidth="2" />
        {
  /* Ear cups */
}
        <circle cx="12" cy="60" r="10" fill="#854d0e" />
        <circle cx="98" cy="60" r="10" fill="#854d0e" />
        {
  /* Manic grin with white teeth */
}
        <path d="M 28,95 Q 55,125 82,95 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
        <line x1="40" y1="95" x2="40" y2="108" stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1="55" y1="95" x2="55" y2="112" stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1="70" y1="95" x2="70" y2="108" stroke="#cbd5e1" strokeWidth="1.5" />
      </g>
    </svg>
  </div>;
const AceTrappolaArt = ({ className = "" }) => <div className={`relative w-full h-full bg-rose-950 overflow-hidden ${className}`}>
    <svg className="absolute inset-0 w-full h-full object-cover" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="aceBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e11d48" />
          <stop offset="70%" stopColor="#881337" />
          <stop offset="100%" stopColor="#4c0519" />
        </radialGradient>
      </defs>
      <rect width="200" height="150" fill="url(#aceBg)" />
      {
  /* Anime boy with spiky ginger hair */
}
      <g transform="translate(50, 15)">
        <polygon points="50,15 15,40 30,55 50,75 70,55 85,40" fill="#f97316" />
        <ellipse cx="50" cy="65" rx="24" ry="26" fill="#fed7aa" />
        {
  /* Hair bangs */
}
        <polygon points="35,45 50,60 65,45 50,30" fill="#ea580c" />
        {
  /* Heart/Ace eye tattoo */
}
        <path d="M 38,58 C 34,54 34,50 38,48 C 42,48 42,54 38,58 Z" fill="#e11d48" />
        <circle cx="60" cy="55" r="3" fill="#881337" />
        {
  /* Confident smile */
}
        <path d="M 44,76 Q 52,82 58,76" stroke="#881337" strokeWidth="1.5" fill="none" />
      </g>
      {
  /* Playing cards flying */
}
      <rect x="15" y="20" width="22" height="32" rx="2" fill="#fff" transform="rotate(-15 15 20)" stroke="#e11d48" strokeWidth="1" />
      <rect x="160" y="80" width="22" height="32" rx="2" fill="#fff" transform="rotate(25 160 80)" stroke="#111" strokeWidth="1" />
      <div className="absolute top-1 left-1 text-[8px] bg-red-600 text-white font-bold px-1 rounded">SSR</div>
    </svg>
  </div>;
const NumberlandArt = ({ className = "" }) => <div className={`relative w-full h-full bg-cyan-900 overflow-hidden ${className}`}>
    <svg className="absolute inset-0 w-full h-full object-cover" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="nbSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill="url(#nbSky)" />
      {
  /* Rainbow lantern block structure */
}
      <g transform="translate(60, 25)">
        <rect x="10" y="10" width="60" height="12" fill="#ef4444" rx="2" />
        <rect x="10" y="22" width="60" height="12" fill="#f97316" rx="2" />
        <rect x="10" y="34" width="60" height="12" fill="#eab308" rx="2" />
        <rect x="10" y="46" width="60" height="12" fill="#22c55e" rx="2" />
        <rect x="10" y="58" width="60" height="12" fill="#3b82f6" rx="2" />
        <rect x="10" y="70" width="60" height="12" fill="#a855f7" rx="2" />
        {
  /* Glow prism */
}
        <polygon points="40,2 10,84 70,84" fill="#ffffff" opacity="0.35" />
      </g>
    </svg>
  </div>;
export {
  AceTrappolaArt,
  AnimeMafuyuThumb,
  EldenRingArt,
  FandomBrand,
  FandomFlameIcon,
  JigglypuffThumb,
  MephistoArt,
  NumberlandArt,
  PokeballIcon,
  PowerpuffThumb,
  SilentHillArt,
  StarWarsArt,
  StrangeNewWorldsArt,
  ToymanArt
};
