// Utility for mapping content items to related background pictures for ContentDetailPage

const BACKGROUND_IMAGES = [
  "/src/assets/images/cyberpunk_liberty_1790270202706.jpg",
  "/src/assets/images/anime_sunset_banner_1790269825004.jpg",
  "/src/assets/images/solaris_protocol_1790282386178.jpg",
  "/src/assets/images/shadow_realm_ruins_1790282841812.jpg",
  "/src/assets/images/feedback_cliff_sky_1790286020079.jpg",
  "/src/assets/images/aetheria_wanderer_1790282784893.jpg",
  "/src/assets/images/midnight_signal_rain_1790283977485.jpg",
  "/src/assets/images/neon_beat_festival_1790282824470.jpg",
  "/src/assets/images/velvet_sky_premiere_1790282805907.jpg",
  "/src/assets/images/emberfall_dragon_sky_1790284017457.jpg",
  "/src/assets/images/solaris_rise_sunset_1790283958868.jpg",
  "/src/assets/images/lumiere_stage_debut_1790283998932.jpg",
  "/src/assets/images/cinema_screening_1790284828452.jpg",
  "/src/assets/images/starlight_expo_con_1790282403579.jpg",
  "/src/assets/images/fan_content_banner_art_1790284032615.jpg",
  "/src/assets/images/deep_space_warriors_1790180983398.jpg"
];

export function getRelatedBgImage(item) {
  if (!item) return BACKGROUND_IMAGES[0];

  // If item already has a custom background image that is not default banner
  if (
    item.backgroundImage &&
    !item.backgroundImage.includes("fandom_banner_1790273074334")
  ) {
    return item.backgroundImage;
  }

  const searchText = `${item.id || ""} ${item.title || ""} ${item.category || ""} ${item.genre || ""} ${item.fandom || ""} ${item.subtitle || ""}`.toLowerCase();

  if (searchText.includes("cyberpunk") || searchText.includes("dogtown")) {
    return "/src/assets/images/cyberpunk_liberty_1790270202706.jpg";
  }
  if (searchText.includes("one piece") || searchText.includes("luffy") || searchText.includes("straw hat") || searchText.includes("egghead") || searchText.includes("zoro") || searchText.includes("sanji")) {
    return "/src/assets/images/anime_sunset_banner_1790269825004.jpg";
  }
  if (searchText.includes("call of duty") || searchText.includes("mw2") || searchText.includes("ghost") || searchText.includes("modern warfare") || searchText.includes("solaris")) {
    return "/src/assets/images/solaris_protocol_1790282386178.jpg";
  }
  if (searchText.includes("elden ring") || searchText.includes("erdtree") || searchText.includes("tarnished") || searchText.includes("shadow of the erdtree")) {
    return "/src/assets/images/shadow_realm_ruins_1790282841812.jpg";
  }
  if (searchText.includes("solo leveling") || searchText.includes("jinwoo") || searchText.includes("aetheria") || searchText.includes("skyward")) {
    return "/src/assets/images/aetheria_wanderer_1790282784893.jpg";
  }
  if (searchText.includes("red dead") || searchText.includes("rdr2") || searchText.includes("morgan") || searchText.includes("outlaw") || searchText.includes("western")) {
    return "/src/assets/images/feedback_cliff_sky_1790286020079.jpg";
  }
  if (searchText.includes("halo") || searchText.includes("chief") || searchText.includes("master chief") || searchText.includes("star wars") || searchText.includes("wookieepedia") || searchText.includes("interstellar")) {
    return "/src/assets/images/deep_space_warriors_1790180983398.jpg";
  }
  if (searchText.includes("classroom") || searchText.includes("elite") || searchText.includes("study") || searchText.includes("school")) {
    return "/src/assets/images/anime_desk_study_1790284532931.jpg";
  }
  if (searchText.includes("twisted") || searchText.includes("wonderland") || searchText.includes("trappola") || searchText.includes("fan content")) {
    return "/src/assets/images/fan_content_banner_art_1790284032615.jpg";
  }
  if (searchText.includes("silent hill") || searchText.includes("townfall") || searchText.includes("midnight") || searchText.includes("stranger things") || searchText.includes("horror") || searchText.includes("thriller")) {
    return "/src/assets/images/midnight_signal_rain_1790283977485.jpg";
  }
  if (searchText.includes("newjeans") || searchText.includes("ive") || searchText.includes("k-pop") || searchText.includes("kpop") || searchText.includes("bts") || searchText.includes("lumiere")) {
    return "/src/assets/images/neon_beat_festival_1790282824470.jpg";
  }
  if (searchText.includes("dc") || searchText.includes("toyman") || searchText.includes("spiderman") || searchText.includes("deadpool") || searchText.includes("comic") || searchText.includes("superman")) {
    return "/src/assets/images/velvet_sky_premiere_1790282805907.jpg";
  }
  if (searchText.includes("horseman") || searchText.includes("bloodruth") || searchText.includes("rippa")) {
    return "/src/assets/images/horseman_comic_hero_1790251215245.jpg";
  }
  if (searchText.includes("dune") || searchText.includes("movie") || searchText.includes("cinema") || searchText.includes("joker")) {
    return "/src/assets/images/solaris_rise_sunset_1790283958868.jpg";
  }
  if (searchText.includes("pokemon") || searchText.includes("jigglypuff") || searchText.includes("pikachu")) {
    return "/src/assets/images/pokemon_family_grid_1790188678999.jpg";
  }
  if (searchText.includes("dragon") || searchText.includes("emberfall") || searchText.includes("attack on titan")) {
    return "/src/assets/images/emberfall_dragon_sky_1790284017457.jpg";
  }

  // Deterministic fallback based on string hash
  let hash = 0;
  const str = item.id || item.title || "fandom";
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % BACKGROUND_IMAGES.length;
  return BACKGROUND_IMAGES[index];
}
