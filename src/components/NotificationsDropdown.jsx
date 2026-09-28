import { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  Film,
  UserCheck,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  FileText,
  LogIn,
  RefreshCw,
  Trash2
} from "lucide-react";

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "pending_submission":
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
          <FileText size={16} />
        </div>
      );
    case "content":
      return (
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-[#FF5F1F] flex items-center justify-center shrink-0">
          <Film size={16} />
        </div>
      );
    case "character":
      return (
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
          <UserCheck size={16} />
        </div>
      );
    case "merchandise":
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
          <ShoppingBag size={16} />
        </div>
      );
    case "submission_approved":
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 size={16} />
        </div>
      );
    case "submission_rejected":
      return (
        <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
          <AlertCircle size={16} />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-lg bg-stone-200/70 text-stone-600 flex items-center justify-center shrink-0">
          <Bell size={16} />
        </div>
      );
  }
};

export const NotificationsDropdown = ({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  isLoading = false,
  isLoggedIn = false,
  onOpenAuth,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
  theme = "light"
}) => {
  const [filter, setFilter] = useState("all");
  const dropdownRef = useRef(null);
  const isDark = theme === "dark" || theme === "detail";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayList =
    filter === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications;

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 top-full mt-2.5 w-80 sm:w-96 rounded-2xl shadow-2xl z-50 border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 font-sans ${
        isDark
          ? "bg-[#18181b] border-[#27272a] text-stone-200 shadow-black/60"
          : "bg-[#FAF8F5] border-[#EBE6DD] text-[#171717]"
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b ${
          isDark ? "border-[#27272a] bg-[#1f1f23]" : "border-[#EBE6DD] bg-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#FF5F1F]/10 rounded-lg text-[#FF5F1F]">
            <Bell size={16} />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="font-titan font-black tracking-tight uppercase text-xs sm:text-sm">
              Notifications
            </h3>
            {isLoggedIn && unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#FF5F1F] text-white rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? "text-stone-400 hover:text-white hover:bg-stone-800"
              : "text-[#7A6F64] hover:text-[#171717] hover:bg-stone-200/60"
          }`}
        >
          <X size={16} />
        </button>
      </div>

      {/* Guest View: Prompt to Log In */}
      {!isLoggedIn ? (
        <div className="p-6 text-center space-y-3">
          <div
            className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
              isDark ? "bg-stone-800 text-stone-400" : "bg-stone-200/70 text-[#8E8272]"
            }`}
          >
            <Bell size={24} />
          </div>
          <div>
            <p className="font-bold text-sm">
              Log in to your account to view notifications
            </p>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-stone-400" : "text-[#7A6F64]"}`}>
              Sign in to receive real-time alerts when new content is published or when your fan submissions are reviewed.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenAuth) onOpenAuth("login");
            }}
            className="w-full mt-2 py-2.5 px-4 bg-[#FF5F1F] hover:bg-[#E04F13] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn size={15} />
            <span>Log In / Sign Up</span>
          </button>
        </div>
      ) : (
        /* Logged In View: Filters & Notifications List */
        <>
          {/* Filter Bar */}
          <div
            className={`px-4 py-2 flex items-center justify-between text-xs border-b ${
              isDark ? "border-[#27272a] bg-[#141416]" : "border-[#EBE6DD] bg-stone-50"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  filter === "all"
                    ? isDark
                      ? "bg-white text-black"
                      : "bg-[#171717] text-white"
                    : isDark
                    ? "bg-stone-800 text-stone-400 hover:text-white"
                    : "bg-stone-200/60 text-[#7A6F64] hover:text-[#171717]"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  filter === "unread"
                    ? "bg-[#FF5F1F] text-white"
                    : isDark
                    ? "bg-stone-800 text-stone-400 hover:text-[#FF5F1F]"
                    : "bg-stone-200/60 text-[#7A6F64] hover:text-[#FF5F1F]"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {notifications.length > 0 && onClearAll && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-[11px] font-semibold text-[#8E8272] hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* List Area */}
          <div className="max-h-80 overflow-y-auto p-3 space-y-2">
            {isLoading && notifications.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#7A6F64]">
                <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#FF5F1F]" />
                <p>Loading notifications...</p>
              </div>
            ) : displayList.length === 0 ? (
              <div className="text-center py-8 text-xs space-y-1.5">
                <div
                  className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${
                    isDark ? "bg-stone-800 text-stone-500" : "bg-stone-100 text-[#8E8272]"
                  }`}
                >
                  <Bell size={20} />
                </div>
                <p className="font-bold text-xs">No notifications right now</p>
                <p className={`text-[11px] max-w-[200px] mx-auto ${isDark ? "text-stone-400" : "text-[#8E8272]"}`}>
                  {filter === "unread"
                    ? "You are all caught up!"
                    : "You will receive alerts when new content is added or reviewed."}
                </p>
              </div>
            ) : (
              displayList.map((n) => {
                const icon = getNotificationIcon(n.type);
                return (
                  <div
                    key={n.id || n._id}
                    onClick={() => {
                      if (onSelectNotification) onSelectNotification(n);
                    }}
                    className={`p-2.5 border text-xs transition-all rounded-xl cursor-pointer flex gap-2.5 group relative ${
                      n.unread
                        ? isDark
                          ? "bg-stone-800/80 border-[#FF5F1F]/50 shadow-sm hover:border-[#FF5F1F]"
                          : "bg-white border-[#FF5F1F]/40 shadow-xs hover:border-[#FF5F1F]"
                        : isDark
                        ? "bg-stone-900/50 border-[#27272a] hover:bg-stone-800/60"
                        : "bg-white/60 border-[#EBE6DD] hover:bg-white hover:border-stone-300"
                    }`}
                  >
                    {icon}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {n.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F] shrink-0 inline-block" />
                          )}
                          <span
                            className={`font-bold truncate text-[11.5px] ${
                              n.unread
                                ? isDark
                                  ? "text-white"
                                  : "text-[#171717]"
                                : isDark
                                ? "text-stone-300"
                                : "text-stone-700"
                            }`}
                          >
                            {n.title}
                          </span>
                        </div>
                        <span className="text-[9.5px] font-semibold text-[#8E8272] shrink-0 whitespace-nowrap ml-1">
                          {formatTimeAgo(n.createdAt)}
                        </span>
                      </div>

                      <p
                        className={`leading-relaxed text-[10.5px] line-clamp-2 ${
                          isDark ? "text-stone-400" : "text-[#7A6F64]"
                        }`}
                      >
                        {n.message}
                      </p>
                    </div>

                    {n.thumbnailUrl && (
                      <div
                        className={`w-9 h-9 rounded-lg overflow-hidden bg-stone-100 shrink-0 border ${
                          isDark ? "border-stone-700" : "border-[#EBE6DD]"
                        }`}
                      >
                        <img
                          src={n.thumbnailUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Mark all as read button at bottom */}
          {unreadCount > 0 && onMarkAllAsRead && (
            <div
              className={`p-2.5 border-t text-center ${
                isDark ? "border-[#27272a] bg-[#1f1f23]" : "border-[#EBE6DD] bg-white"
              }`}
            >
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="w-full py-1.5 text-xs font-bold text-[#FF5F1F] hover:text-[#E04F13] transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
