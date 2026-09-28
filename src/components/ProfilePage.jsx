import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Trash2,
  User,
  Mail,
  Sun,
  Moon,
  Check,
  Save,
  X,
  Plus,
  Gamepad2,
  Film,
  Tv,
  Music,
  BookOpen,
  Book,
  Lock,
  Sparkles
} from "lucide-react";
import { BASE_URL } from "../api/api";

const ProfilePage = ({
  onBackToHome,
  onSaveSuccess
}) => {
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [userName, setUserName] = useState(user?.name || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");
  const [userAvatar, setUserAvatar] = useState(user?.avatarUrl || "");
  const [theme, setTheme] = useState(user?.displayPrefs?.darkMode ? "dark" : "light");
  const [fontSize, setFontSize] = useState(user?.displayPrefs?.fontSize || "medium");
  const [allDbCategories, setAllDbCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [favorites, setFavorites] = useState([
    { label: "Anime", enabled: true },
    { label: "Gaming", enabled: true },
    { label: "Movies", enabled: true },
    { label: "K-Pop", enabled: true },
    { label: "Manga", enabled: true },
    { label: "TV Shows", enabled: false },
    { label: "Comics", enabled: false },
    { label: "Cosplay", enabled: false }
  ]);

  const [categories, setCategories] = useState([
    { id: "anime", label: "Anime", checked: true, icon: "swirl" },
    { id: "gaming", label: "Gaming", checked: true, icon: "gamepad" },
    { id: "movies", label: "Movies", checked: true, icon: "film" },
    { id: "tv", label: "TV Shows", checked: true, icon: "tv" },
    { id: "kpop", label: "K-Pop", checked: true, icon: "music" },
    { id: "comics", label: "Comics", checked: true, icon: "book" },
    { id: "manga", label: "Manga", checked: true, icon: "book-open" },
    { id: "cosplay", label: "Cosplay", checked: true, icon: "sparkles" }
  ]);

  // Load user profile and categories from backend
  useEffect(() => {
    const fetchProfileAndCategories = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      try {
        // 1. Fetch categories
        const catRes = await fetch(`${BASE_URL}/categories`);
        let fetchedCats = [];
        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData.categories) && catData.categories.length > 0) {
            fetchedCats = catData.categories;
            setAllDbCategories(fetchedCats);
          }
        }

        // 2. Fetch user profile from DB
        if (token) {
          const profileRes = await fetch(`${BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData.user) {
              const u = profileData.user;
              setUser(u);
              setUserName(u.name || "");
              setUserEmail(u.email || "");
              setUserAvatar(u.avatarUrl || "");
              if (u.displayPrefs) {
                setTheme(u.displayPrefs.darkMode ? "dark" : "light");
                setFontSize(u.displayPrefs.fontSize || "medium");
              }

              // Sync favorites & categories from DB
              const userFavNames = (u.favoriteCategories || []).map(
                (c) => (typeof c === "object" ? c.name : c)
              );

              if (fetchedCats.length > 0) {
                setFavorites(
                  fetchedCats.map((cat) => ({
                    label: cat.name,
                    enabled: userFavNames.some(
                      (fav) => fav?.toLowerCase() === cat.name.toLowerCase()
                    ),
                    id: cat._id
                  }))
                );

                setCategories(
                  fetchedCats.map((cat) => {
                    const lName = cat.name.toLowerCase();
                    let icon = "sparkles";
                    if (lName.includes("anime")) icon = "swirl";
                    else if (lName.includes("gaming")) icon = "gamepad";
                    else if (lName.includes("movie")) icon = "film";
                    else if (lName.includes("tv")) icon = "tv";
                    else if (lName.includes("k-pop") || lName.includes("music")) icon = "music";
                    else if (lName.includes("comic")) icon = "book";
                    else if (lName.includes("manga")) icon = "book-open";

                    return {
                      id: cat._id || cat.slug || cat.name,
                      label: cat.name,
                      checked: userFavNames.some(
                        (fav) => fav?.toLowerCase() === cat.name.toLowerCase()
                      ),
                      icon
                    };
                  })
                );
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
      }
    };

    fetchProfileAndCategories();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Photo must be less than 5MB");
      return;
    }

    setIsUploadingPhoto(true);
    showToast("Uploading avatar photo...");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      setUserAvatar(base64Data);

      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      try {
        const res = await fetch(`${BASE_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            image: base64Data,
            folder: "avatars"
          })
        });

        const data = await res.json();
        if (res.ok && data.url) {
          setUserAvatar(data.url);
          showToast("Avatar uploaded! Remember to save changes.");
        } else {
          showToast("Avatar image loaded. Click 'Save Changes' to update.");
        }
      } catch (err) {
        console.error("Upload avatar error:", err);
        showToast("Avatar image loaded. Click 'Save Changes' to update.");
      } finally {
        setIsUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setUserAvatar("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showToast("Avatar removed. Click 'Save Changes' to apply.");
  };

  const toggleFavorite = (index) => {
    setFavorites((prev) =>
      prev.map((fav, idx) => (idx === index ? { ...fav, enabled: !fav.enabled } : fav))
    );
  };

  const toggleCategory = (id) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, checked: !cat.checked } : cat))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    // Collect all selected fandoms / categories
    const selectedFandomNames = favorites
      .filter((f) => f.enabled)
      .map((f) => f.label);

    const selectedCategoryNames = categories
      .filter((c) => c.checked)
      .map((c) => c.label);

    const combinedFavorites = Array.from(
      new Set([...selectedFandomNames, ...selectedCategoryNames])
    );

    let updatedUserObj = {
      ...user,
      name: userName.trim() || "User",
      avatarUrl: userAvatar || "",
      favoriteCategories: combinedFavorites,
      displayPrefs: {
        darkMode: theme === "dark",
        fontSize
      }
    };

    try {
      if (token) {
        const res = await fetch(`${BASE_URL}/users/me`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: userName.trim() || "User",
            avatarUrl: userAvatar || "",
            favoriteCategories: combinedFavorites,
            displayPrefs: {
              darkMode: theme === "dark",
              fontSize
            }
          })
        });

        const data = await res.json();
        if (res.ok && data.user) {
          updatedUserObj = {
            ...updatedUserObj,
            ...data.user,
            name: data.user.name || userName.trim(),
            avatarUrl: data.user.avatarUrl !== undefined ? data.user.avatarUrl : userAvatar
          };
        }
      }

      localStorage.setItem("user", JSON.stringify(updatedUserObj));
      setUser(updatedUserObj);

      showToast("Profile preferences successfully saved!");

      if (onSaveSuccess) {
        onSaveSuccess(updatedUserObj);
      }
    } catch (err) {
      console.error("Save profile error:", err);
      showToast("Error saving profile changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderCategoryIcon = (iconName) => {
    switch (iconName) {
      case "swirl":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-7 h-7 stroke-[#231C14]"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 15a5 5 0 1 1 5-5 5 5 0 0 1-5 5z" />
            <path d="M12 10a2 2 0 1 0 2 2 2 2 0 0 0-2-2z" />
            <path d="M17 12a5 5 0 0 1-5 5" />
          </svg>
        );
      case "gamepad":
        return <Gamepad2 size={26} className="text-[#231C14]" />;
      case "film":
        return <Film size={26} className="text-[#231C14]" />;
      case "tv":
        return <Tv size={26} className="text-[#231C14]" />;
      case "music":
        return <Music size={26} className="text-[#231C14]" />;
      case "book":
        return <Book size={26} className="text-[#231C14]" />;
      case "book-open":
        return <BookOpen size={26} className="text-[#231C14]" />;
      default:
        return <Sparkles size={26} className="text-[#231C14]" />;
    }
  };

  return (
    <div className="w-full antialiased select-none bg-[#FAF8F5] min-h-screen font-baloo pb-12 relative">
      
      {/* Hidden File Input for Avatar */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Profile Header Welcome Banner */}
      <div className="relative w-full h-[180px] sm:h-[200px] overflow-hidden bg-zinc-950 border-b border-[#F0E8DD]">
        <img
          src="/src/assets/images/fandom_banner_1790273074334.jpg"
          alt="Profile Cover Background"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.75] opacity-90 contrast-[1.1]"
        />
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-12 z-10">
          <div className="flex flex-col text-white">
            <h1 className="text-3xl sm:text-4.5xl font-black tracking-wider uppercase font-titan drop-shadow-md text-white">
              PROFILE
            </h1>
            <p className="text-sm sm:text-base font-extrabold text-amber-300 drop-shadow-xs mt-1">
              Manage your account details, preferences and fandoms.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-stone-300 mt-1">
              Customize your viewing experience.
            </p>
          </div>

          <div className="hidden md:block text-right">
            <p className="font-titan text-white/95 text-md leading-tight uppercase max-w-xs drop-shadow-sm rotate-[-2deg] tracking-wide text-amber-300">
              SAME FANDOM.
              <br />
              DIFFERENT STORIES.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Row 1: Profile Photo, Personal Details & Preferences */}
        <div className="grid grid-cols-12 gap-5.5">
          
          {/* Column 1: Profile Photo Card */}
          <div className="col-span-12 sm:col-span-3 bg-white border border-[#EDE4D6] rounded-xl p-5.5 flex flex-col items-center justify-center text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-amber-50 flex-shrink-0 flex items-center justify-center">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName || "Avatar"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-900 font-titan text-4xl">
                  {userName ? userName.charAt(0).toUpperCase() : <User size={44} className="text-amber-800/60" />}
                </div>
              )}
              
              {/* Photo Indicator camera circle */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0.5 right-0.5 w-7.5 h-7.5 rounded-full bg-stone-900 hover:bg-[#FF5F1F] border-2 border-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
                title="Choose new avatar"
              >
                <Camera size={13} className="text-white" />
              </button>
            </div>

            <div className="w-full mt-5 space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="w-full flex items-center justify-center gap-1.5 bg-[#FFCC00] hover:bg-[#F2C200] disabled:opacity-50 text-black font-black text-[11px] tracking-wider uppercase py-2.5 rounded-lg border border-[#E6B800] transition-colors cursor-pointer"
              >
                <Camera size={13} className="stroke-[2.5]" />
                <span>{isUploadingPhoto ? "UPLOADING..." : "UPLOAD PHOTO"}</span>
              </button>
              
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={!userAvatar}
                className="w-full flex items-center justify-center gap-1.5 bg-transparent hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent text-red-600 font-extrabold text-[11px] tracking-wider uppercase py-2 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <Trash2 size={12} />
                <span>REMOVE PHOTO</span>
              </button>
            </div>
          </div>

          {/* Column 2: Personal Details Card */}
          <div className="col-span-12 sm:col-span-5 bg-white border border-[#EDE4D6] rounded-xl p-5.5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div>
              <h2 className="text-sm font-black tracking-wider text-[#231C14] uppercase">
                PERSONAL DETAILS
              </h2>
              <p className="text-[11px] font-bold text-[#8E8272] mt-0.5">Your basic information</p>

              <div className="space-y-4 mt-5">
                {/* Name field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-[#7A6F64] uppercase tracking-wider block">Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#7A6F64] pointer-events-none">
                      <User size={14} />
                    </span>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full text-xs font-bold pl-9 pr-4 py-2.5 rounded-lg border border-[#EAE2D2] focus:outline-none focus:border-[#FF5F1F] bg-[#FAF9F5] text-stone-900"
                    />
                  </div>
                </div>

                {/* Email field (Uneditable) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold text-[#7A6F64] uppercase tracking-wider block">Email</label>
                    <span className="text-[9.5px] font-bold text-stone-400 flex items-center gap-1">
                      <Lock size={10} />
                      Not editable
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 pointer-events-none">
                      <Mail size={14} />
                    </span>
                    <input
                      type="email"
                      value={userEmail}
                      disabled
                      readOnly
                      title="Email cannot be changed"
                      className="w-full text-xs font-bold pl-9 pr-4 py-2.5 rounded-lg border border-[#EAE2D2] bg-stone-100/90 text-stone-500 cursor-not-allowed select-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Display Preferences Card */}
          <div className="col-span-12 sm:col-span-4 bg-white border border-[#EDE4D6] rounded-xl p-5.5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div>
              <h2 className="text-sm font-black tracking-wider text-[#231C14] uppercase">
                DISPLAY PREFERENCES
              </h2>
              <p className="text-[11px] font-bold text-[#8E8272] mt-0.5">Customize your viewing experience</p>

              <div className="space-y-4.5 mt-5">
                {/* Theme */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-[#7A6F64] uppercase tracking-wider block">Theme</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        theme === "light"
                          ? "bg-[#FEF2CF] border-[#F2C200] text-amber-900 shadow-xs font-extrabold"
                          : "bg-white border-[#EAE2D2] text-[#4A3E31] hover:bg-stone-50"
                      }`}
                    >
                      <Sun size={13} className="text-[#B45309]" />
                      <span>Light</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        theme === "dark"
                          ? "bg-[#121824] border-[#313B4D] text-white shadow-xs font-extrabold"
                          : "bg-white border-[#EAE2D2] text-[#4A3E31] hover:bg-stone-50"
                      }`}
                    >
                      <Moon size={13} />
                      <span>Dark</span>
                    </button>
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-[#7A6F64] uppercase tracking-wider block">Font Size</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFontSize("small")}
                      className={`py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        fontSize === "small"
                          ? "bg-[#FEF2CF] border-[#F2C200] text-amber-900 shadow-xs font-extrabold"
                          : "bg-white border-[#EAE2D2] text-[#4A3E31] hover:bg-stone-50"
                      }`}
                    >
                      A- Small
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFontSize("medium")}
                      className={`py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        fontSize === "medium"
                          ? "bg-[#FEF2CF] border-[#F2C200] text-amber-900 shadow-xs font-extrabold"
                          : "bg-white border-[#EAE2D2] text-[#4A3E31] hover:bg-stone-50"
                      }`}
                    >
                      A Medium
                    </button>

                    <button
                      type="button"
                      onClick={() => setFontSize("large")}
                      className={`py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        fontSize === "large"
                          ? "bg-[#FEF2CF] border-[#F2C200] text-amber-900 shadow-xs font-extrabold"
                          : "bg-white border-[#EAE2D2] text-[#4A3E31] hover:bg-stone-50"
                      }`}
                    >
                      A+ Large
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: FAVORITE FANDOMS */}
        <div className="bg-white border border-[#EDE4D6] rounded-xl p-5.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#F0E8DD] pb-2">
            <div>
              <h2 className="text-sm font-black tracking-wider text-[#231C14] uppercase">
                FAVORITE FANDOMS
              </h2>
              <p className="text-[11px] font-bold text-[#8E8272] mt-0.5">
                Select your favorite fandoms. You can add or remove them anytime.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => showToast("Tap any fandom tag to add or remove it from your favorites")}
              className="text-[11px] font-extrabold tracking-widest text-[#FF5F1F] hover:text-[#E04F13] transition-colors flex items-center gap-1 cursor-pointer uppercase font-sans"
            >
              <span>MANAGE FAVORITES</span>
              <svg viewBox="0 0 24 24" fill="none" className="w-[12px] h-[12px] stroke-current" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1.5">
            {favorites.map((fav, index) => (
              <button
                type="button"
                key={fav.label}
                onClick={() => toggleFavorite(index)}
                className={`flex items-center gap-1.5 text-[11px] font-black px-4 py-2 rounded-full tracking-wider uppercase border transition-all cursor-pointer ${
                  fav.enabled
                    ? "bg-[#FFCC00] border-[#E6B800] text-black font-black"
                    : "bg-white border-[#EDE4D6] text-[#4A3E31] hover:bg-stone-50 font-extrabold"
                }`}
              >
                <span>{fav.label}</span>
                {fav.enabled ? (
                  <X size={12} className="stroke-[3.5] text-black/70" />
                ) : (
                  <Plus size={12} className="stroke-[3.5] text-[#FF5F1F]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: CATEGORIES OF INTEREST */}
        <div className="bg-white border border-[#EDE4D6] rounded-xl p-5.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5">
          <div className="border-b border-[#F0E8DD] pb-2">
            <h2 className="text-sm font-black tracking-wider text-[#231C14] uppercase">
              CATEGORIES OF INTEREST
            </h2>
            <p className="text-[11px] font-bold text-[#8E8272] mt-0.5">
              Choose the content categories you're most interested in.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 pt-1.5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                  cat.checked
                    ? "bg-white border-[#D9D1C5] shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
                    : "bg-white border-[#EAE2D2] opacity-70 hover:opacity-100"
                }`}
                style={{ minHeight: "110px" }}
              >
                <div
                  className={`absolute top-2.5 right-2.5 w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                    cat.checked
                      ? "bg-[#FF5F1F] border-[#FF5F1F]"
                      : "border-[#C4BBAF] bg-white"
                  }`}
                >
                  {cat.checked && <Check size={12} className="stroke-[4.5] text-white" />}
                </div>

                <div className="mb-2 text-[#231C14]">
                  {renderCategoryIcon(cat.icon)}
                </div>

                <span className="font-extrabold text-[12px] tracking-wider text-[#231C14] uppercase text-center truncate w-full">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Panel Action Buttons */}
        <div className="flex items-center gap-3 pt-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#FFCC00] hover:bg-[#F2C200] disabled:opacity-60 text-black font-black text-xs tracking-wider uppercase px-6 py-3.5 rounded-lg shadow-md border border-[#E6B800] transition-colors cursor-pointer active:scale-95"
          >
            <Save size={14} className="stroke-[3]" />
            <span>{isSaving ? "SAVING..." : "SAVE CHANGES"}</span>
          </button>
          
          <button
            type="button"
            onClick={onBackToHome}
            className="px-6 py-3.5 bg-white hover:bg-stone-50 text-[#4A3E31] font-black text-xs tracking-wider uppercase rounded-lg border border-[#EDE4D6] transition-colors cursor-pointer"
          >
            <span>CANCEL</span>
          </button>
        </div>

      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1D24] border border-[#2B2F3D] text-amber-400 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check size={14} className="text-[#FFA800]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export { ProfilePage };
