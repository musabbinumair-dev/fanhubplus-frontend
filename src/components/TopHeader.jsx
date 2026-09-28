import { useState } from "react";
import { Search, Bell, User, Bookmark, X, LogOut, ChevronDown, LayoutGrid, Menu } from "lucide-react";
import { NotificationsDropdown } from "./NotificationsDropdown.jsx";
import { Logo } from "./Logo.jsx";

const TopHeader = ({
  searchQuery,
  onSearchChange,
  onOpenNotifications,
  onOpenProfile,
  onOpenDashboard,
  onNavigateHome,
  onToggleMobileSidebar,
  unreadCount = 0,
  onOpenAuth,
  onOpenSaved,
  isLoggedIn = true,
  currentUser = null,
  onLogout,
  theme = "light",
  notifications = [],
  isLoadingNotifications = false,
  onMarkNotifAsRead,
  onMarkAllNotifsAsRead,
  onClearAllNotifs,
  onSelectNotification,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const isDark = theme === "dark" || theme === "detail";

  return (
    <header
      className={`sticky top-0 z-30 px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4 font-baloo select-none shrink-0 transition-all duration-300 relative ${
        isDark
          ? "liquid-glass-dark text-stone-200"
          : "liquid-glass-light text-[#231C14]"
      }`}
    >
      {/* 1. Mobile Left: Collapse button (+ Bookmark icon when logged in) */}
      <div className="flex items-center gap-1 md:hidden shrink-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Open sidebar menu"
          className={`p-1.5 -ml-1 rounded-lg transition-colors cursor-pointer active:scale-95 ${
            isDark
              ? "text-stone-300 hover:text-white hover:bg-stone-800"
              : "text-[#231C14] hover:bg-black/5"
          }`}
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>

        {/* When user is logged in: Bookmark icon is on the left with collapse icon */}
        {isLoggedIn && (
          <button
            type="button"
            onClick={onOpenSaved}
            title="Bookmarks"
            className={`p-1.5 rounded-full transition-colors cursor-pointer active:scale-95 ${
              isDark
                ? "text-stone-300 hover:text-[#FFCC00]"
                : "text-[#7A6F64] hover:text-[#FF5F1F]"
            }`}
          >
            <Bookmark size={20} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* 2. Desktop Left: Brand logo */}
      <div className="hidden md:flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            if (onNavigateHome) {
              onNavigateHome();
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center cursor-pointer transition-transform hover:opacity-90 active:scale-95"
        >
          <Logo size="navbar" />
        </button>
      </div>

      {/* 3. Mobile Center: Brand logo in center */}
      <div className="flex md:hidden absolute left-1/2 -translate-x-1/2 items-center shrink-0">
        <button
          type="button"
          onClick={() => {
            if (onNavigateHome) {
              onNavigateHome();
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center cursor-pointer transition-transform hover:opacity-90 active:scale-95"
        >
          <Logo size="navbar" />
        </button>
      </div>

      {/* 4. Desktop Spacer */}
      <div className="hidden md:flex flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-3.5 shrink-0">
        {/* Saved Bookmark button:
            - Desktop: always on right
            - Mobile: shown on right ONLY in guest mode (!isLoggedIn)
        */}
        <button
          type="button"
          onClick={onOpenSaved}
          title="Bookmarks"
          className={`${
            isLoggedIn ? "hidden md:flex" : "flex"
          } p-1.5 rounded-full transition-colors cursor-pointer active:scale-95 ${
            isDark
              ? "text-stone-300 hover:text-[#FF5F1F]"
              : "text-[#7A6F64] hover:text-[#FF5F1F]"
          }`}
        >
          <Bookmark size={20} strokeWidth={2} />
        </button>

        {/* Notifications Bell with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifDropdown((prev) => !prev);
              setShowDropdown(false);
              if (onOpenNotifications) onOpenNotifications();
            }}
            title="Notifications"
            className={`relative p-1.5 rounded-full transition-colors cursor-pointer active:scale-95 ${
              isDark
                ? "text-stone-300 hover:text-[#FF5F1F]"
                : "text-[#7A6F64] hover:text-[#FF5F1F]"
            }`}
          >
            <Bell size={20} strokeWidth={2} />
            {isLoggedIn && unreadCount > 0 && (
              <span
                className={`absolute top-1 right-1 w-2 h-2 rounded-full ring-2 ${
                  isDark
                    ? "bg-[#FF5F1F] ring-[#121212]"
                    : "bg-[#FF5F1F] ring-white"
                }`}
              />
            )}
          </button>

          <NotificationsDropdown
            isOpen={showNotifDropdown}
            onClose={() => setShowNotifDropdown(false)}
            notifications={notifications}
            unreadCount={unreadCount}
            isLoading={isLoadingNotifications}
            isLoggedIn={isLoggedIn}
            onOpenAuth={onOpenAuth}
            onMarkAsRead={onMarkNotifAsRead}
            onMarkAllAsRead={onMarkAllNotifsAsRead}
            onClearAll={onClearAllNotifs}
            onSelectNotification={(n) => {
              if (onSelectNotification) onSelectNotification(n);
              setShowNotifDropdown(false);
            }}
            theme={theme}
          />
        </div>

        {/* User Profile / Auth State Panel */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center gap-1.5 p-0.5 rounded-full transition-all cursor-pointer ${
                isDark ? "hover:ring-2 hover:ring-[#FFCC00]/40" : "hover:ring-2 hover:ring-[#FF5F1F]/30"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center shrink-0 shadow-sm ${
                  isDark ? "border-[#444] bg-stone-800" : "border-[#D9D1C5] bg-amber-100"
                }`}
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser?.name || "User"}
                    className="w-full h-full object-cover scale-105"
                  />
                ) : (
                  <span className="font-bold text-xs uppercase text-amber-900">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User size={14} />}
                  </span>
                )}
              </div>
              <span
                className={`hidden md:inline text-xs font-black tracking-wide transition-colors ${
                  isDark ? "text-stone-300 hover:text-[#FFCC00]" : "text-[#231C14]"
                }`}
              >
                {currentUser?.name || "User"}
              </span>
              <ChevronDown size={14} className={isDark ? "text-stone-400 hover:text-[#FFCC00]" : "text-[#625547]"} />
            </button>

            {/* Avatar Dropdown */}
            {showDropdown && (
              <div
                className={`absolute right-0 mt-2.5 w-48 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 backdrop-blur-xl ${
                  isDark
                    ? "bg-[#242424]/90 border border-white/10 text-stone-200 shadow-black/50"
                    : "bg-white/90 border border-white/60 text-[#231C14] shadow-black/10"
                }`}
              >
                <div className={`px-4 py-2 border-b ${isDark ? "border-[#383838]" : "border-[#F0E8DD]"}`}>
                  <p className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-stone-400" : "text-[#7A6F64]"}`}>
                    Signed in as
                  </p>
                  <p className={`text-xs font-black mt-0.5 truncate ${isDark ? "text-white" : "text-[#231C14]"}`}>
                    {currentUser?.name || "User Account"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenDashboard) {
                      onOpenDashboard();
                    }
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                    isDark
                      ? "text-stone-300 hover:bg-[#2e2e2e] hover:text-[#FFCC00]"
                      : "text-[#4A3E31] hover:bg-[#F7F2EA]"
                  }`}
                >
                  <LayoutGrid size={14} className={isDark ? "text-[#FFCC00]" : "text-[#FF5F1F]"} />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenProfile) {
                      onOpenProfile();
                    }
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                    isDark
                      ? "text-stone-300 hover:bg-[#2e2e2e] hover:text-[#FFCC00]"
                      : "text-[#4A3E31] hover:bg-[#F7F2EA]"
                  }`}
                >
                  <User size={14} className={isDark ? "text-stone-400" : "text-[#7A6F64]"} />
                  <span>Profile</span>
                </button>
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-black flex items-center gap-2 transition-colors cursor-pointer border-t ${
                      isDark
                        ? "border-[#383838] text-[#FFCC00] hover:bg-[#2e2e2e]"
                        : "border-[#F0E8DD] text-[#FF5F1F] hover:bg-[#FDF3EE]"
                    }`}
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpenAuth?.("login")}
            className="hidden md:flex items-center gap-1.5 bg-[#FF5F1F] hover:bg-[#E04F13] text-white font-extrabold text-[11px] tracking-widest uppercase px-4 py-2 rounded-none transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <User size={13} className="stroke-[2.5]" />
            <span>SIGN IN</span>
          </button>
        )}
      </div>
    </header>
  );
};

export { TopHeader };
