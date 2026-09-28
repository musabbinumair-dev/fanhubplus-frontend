import React from "react";
import { Compass, LayoutGrid, Film, Bookmark, User } from "lucide-react";

export const MobileBottomBar = ({
  activeTab,
  onSelectTab,
  savedCount = 0,
  isLoggedIn = true,
  onOpenAuth,
  theme = "light"
}) => {
  const isDark = theme === "dark" || theme === "detail";

  const navItems = [
    {
      id: "home",
      label: "Explorer",
      icon: Compass,
      onClick: () => onSelectTab("home")
    },
    {
      id: "category",
      label: "Categories",
      icon: LayoutGrid,
      onClick: () => onSelectTab("category")
    },
    {
      id: "multimedia",
      label: "Media",
      icon: Film,
      onClick: () => onSelectTab("multimedia")
    },
    {
      id: "saved",
      label: "Bookmarks",
      icon: Bookmark,
      badge: savedCount,
      onClick: () => {
        if (!isLoggedIn && onOpenAuth) {
          onOpenAuth("login");
        } else {
          onSelectTab("saved");
        }
      }
    },
    {
      id: "profile",
      label: isLoggedIn ? "Profile" : "Sign In",
      icon: User,
      onClick: () => {
        if (!isLoggedIn && onOpenAuth) {
          onOpenAuth("login");
        } else {
          onSelectTab("profile");
        }
      }
    }
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-30 h-16 px-2 flex items-center justify-around border-t select-none md:hidden transition-colors ${
        isDark
          ? "bg-[#141416]/95 backdrop-blur-xl border-white/10 text-stone-400"
          : "bg-white/95 backdrop-blur-xl border-[#F0E8DD] text-[#7A6F64] shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      }`}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 cursor-pointer relative ${
              isActive
                ? isDark
                  ? "text-[#FFCC00] font-bold"
                  : "text-[#FF5F1F] font-bold"
                : isDark
                ? "hover:text-stone-200"
                : "hover:text-[#231C14]"
            }`}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.badge > 0 && (
                <span
                  className={`absolute -top-1 -right-2 text-[10px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-white ${
                    isDark ? "bg-[#FFCC00] text-black" : "bg-[#FF5F1F]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1 leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
