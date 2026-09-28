import React from "react";
import {
  X,
  Compass,
  LayoutGrid,
  Film,
  Users,
  FileText,
  Calendar,
  ShoppingBag,
  MessageSquare,
  Bookmark,
  PlusCircle,
  User,
  Wrench,
  LayoutDashboard,
  LogOut,
  LogIn
} from "lucide-react";
import { Logo } from "./Logo";

export const MobileSidebarDrawer = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  savedCount = 0,
  isLoggedIn = true,
  currentUser = null,
  onLogout,
  onOpenAuth,
  onStartWiki,
  theme = "light"
}) => {
  const isDark = theme === "dark" || theme === "detail";

  const handleItemClick = (tabKey) => {
    onSelectTab(tabKey);
    onClose();
  };

  const pages = [
    ...(isLoggedIn
      ? [
          {
            key: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
          }
        ]
      : []),
    {
      key: "home",
      label: "Explorer",
      icon: Compass
    },
    {
      key: "category",
      label: "Categories",
      icon: LayoutGrid
    },
    {
      key: "characters",
      label: "Characters",
      icon: Users
    },
    {
      key: "multimedia",
      label: "Multimedia Center",
      icon: Film
    },
    {
      key: "articles-events",
      label: "Articles & News",
      icon: FileText
    },
    {
      key: "events",
      label: "Events",
      icon: Calendar
    },
    {
      key: "merchandise",
      label: "Merchandise",
      icon: ShoppingBag
    },
    {
      key: "feedback",
      label: "Feedback",
      icon: MessageSquare
    },
    {
      key: "saved",
      label: "Bookmarks",
      icon: Bookmark,
      badge: savedCount
    },
    {
      key: "submit-content",
      label: "Submit Fan Content",
      icon: PlusCircle
    },
    {
      key: "profile",
      label: "Profile",
      icon: User
    },
    {
      key: "utilities",
      label: "Utilities",
      icon: Wrench
    }
  ];

  return (
    <>
      {/* 1. Backdrop Overlay: blurs and makes background page unclickable */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300 md:hidden"
          onClick={onClose}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* 2. Slide-out Drawer with All Pages */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] h-full shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col font-baloo select-none ${
          isDark
            ? "bg-[#18181b] text-stone-200 border-r border-zinc-800"
            : "bg-[#FFFDF7] text-[#231C14] border-r border-[#F0E8DD]"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-black/10 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Logo size="navbar" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? "text-stone-400 hover:text-white hover:bg-white/10"
                : "text-stone-600 hover:text-black hover:bg-black/5"
            }`}
            aria-label="Close navigation"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable list of ALL pages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            All Pages
          </div>

          {pages.map((page) => {
            const Icon = page.icon;
            const isActive = activeTab === page.key;

            return (
              <button
                key={page.key}
                type="button"
                onClick={() => handleItemClick(page.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? "bg-[#FFCC00]/15 text-[#FFCC00] font-bold"
                      : "bg-[#FF5F1F]/10 text-[#FF5F1F] font-bold"
                    : isDark
                    ? "text-stone-300 hover:bg-zinc-800/80 hover:text-white"
                    : "text-stone-700 hover:bg-stone-100 hover:text-black"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{page.label}</span>
                </div>

                {page.badge > 0 && (
                  <span
                    className={`text-[10px] font-black min-w-[18px] h-4 px-1 rounded-full flex items-center justify-center text-white ${
                      isDark ? "bg-[#FFCC00] text-black" : "bg-[#FF5F1F]"
                    }`}
                  >
                    {page.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer with User / Auth Section */}
        <div className="p-3 border-t border-black/10 dark:border-white/10 shrink-0">
          {isLoggedIn ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-xs uppercase">
                  {currentUser?.name ? currentUser.name.charAt(0) : <User size={14} />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">
                    {currentUser?.name || "User Account"}
                  </p>
                  <p className="text-[10px] text-stone-400 truncate">
                    {currentUser?.email || "Member"}
                  </p>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  title="Log out"
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onOpenAuth) onOpenAuth("login");
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#FF5F1F] hover:bg-[#E04F13] text-white font-black text-xs uppercase tracking-wider py-2.5 rounded-xl cursor-pointer transition-all active:scale-98 shadow-sm"
            >
              <LogIn size={15} strokeWidth={2.5} />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
