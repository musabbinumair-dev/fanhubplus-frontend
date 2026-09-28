import { useState } from "react";
import { Bell, LogOut, ChevronDown, Menu } from "lucide-react";
import { NotificationsDropdown } from "../NotificationsDropdown.jsx";
import { Logo } from "../Logo.jsx";

const AdminTopHeader = ({

  onOpenNotifications,
  onNavigateHome,
  onNavigateToUserPanel,
  onToggleMobileSidebar,
  unreadCount = 0,
  onLogout,
  notifications = [],
  isLoadingNotifications = false,
  onMarkNotifAsRead,
  onMarkAllNotifsAsRead,
  onClearAllNotifs,
  onSelectNotification,
  theme = "light"
}) => {

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4 font-baloo select-none shrink-0 transition-all duration-300 liquid-glass-light text-gray-800 relative">
      {/* 1. Mobile Left: Collapse button */}
      <div className="flex items-center md:hidden shrink-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Open admin navigation menu"
          className="p-2 -ml-1 rounded-lg text-gray-700 hover:text-black hover:bg-black/5 transition-colors cursor-pointer active:scale-95"
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>
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

      {/* 3. Mobile Center: Brand logo centered */}
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

      {/* Spacer to push right controls to the end */}
      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">

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
            className="relative p-1.5 rounded-full transition-colors cursor-pointer active:scale-95 text-gray-500 hover:text-[#F59E0B] hover:bg-gray-100"
          >
            <Bell size={20} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full ring-2 bg-[#F59E0B] ring-white" />
            )}
          </button>

          <NotificationsDropdown
            isOpen={showNotifDropdown}
            onClose={() => setShowNotifDropdown(false)}
            notifications={notifications}
            unreadCount={unreadCount}
            isLoading={isLoadingNotifications}
            isLoggedIn={true}
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

        {/* Admin Avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 p-0.5 rounded-full transition-all cursor-pointer hover:ring-2 hover:ring-[#F59E0B]/40"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center shrink-0 shadow-sm border-amber-400 bg-amber-100 text-amber-900 font-black text-xs">
              AD
            </div>
            <span className="hidden md:inline text-xs font-bold tracking-wide transition-colors text-gray-800 hover:text-[#F59E0B]">
              Admin
            </span>
            <ChevronDown size={14} className="text-gray-500 hover:text-[#F59E0B]" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2.5 w-48 rounded-xl shadow-lg py-2 z-50 bg-white border border-gray-200 text-gray-800 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-[10px] uppercase font-bold tracking-wider text-amber-600">
                  Administrator
                </p>
                <p className="text-xs font-bold mt-0.5 truncate text-gray-900">
                  Admin Console
                </p>
              </div>
              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export { AdminTopHeader };
export default AdminTopHeader;
