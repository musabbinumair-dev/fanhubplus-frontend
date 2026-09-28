const LeftSidebar = ({
  activeTab,
  onSelectTab,
  savedCount = 0,
  isLoggedIn = true,
  theme = "light"
}) => {
  const isDark = theme === "dark" || theme === "detail";

  // Helper for tab button styles
  const getTabClass = (tabKey) => {
    const isActive = activeTab === tabKey;
    if (isDark) {
      return `flex flex-col items-center justify-center w-full py-2 group cursor-pointer transition-colors ${
        isActive ? "text-[#FFCC00]" : "text-stone-300 hover:text-[#FFCC00]"
      }`;
    }
    return `flex flex-col items-center justify-center w-full py-2 group cursor-pointer transition-colors ${
      isActive ? "text-[#FF5F1F]" : "text-[#7A6F64] hover:text-[#231C14]"
    }`;
  };

  return (
    <div className="hidden md:flex relative shrink-0 h-full z-20 select-none font-baloo">
      <aside
        className={`w-16 h-full flex flex-col items-center py-2 shrink-0 transition-colors duration-200 ${
          isDark
            ? "bg-[#121212] border-r border-[#27272a] shadow-md"
            : "bg-white border-r border-[#F0E8DD]"
        }`}
      >
        {/* Scrollable Container for All Sidebar Links */}
        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center gap-3 py-1.5 px-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* 1. Dashboard - First link for logged-in users in user panel */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => onSelectTab("dashboard")}
              className={getTabClass("dashboard")}
              title="Dashboard"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
              </svg>
              <span className="text-[10px] mt-1 font-semibold tracking-tight">Dashboard</span>
            </button>
          )}

          {/* 2. Explorer */}
          <button
            type="button"
            onClick={() => onSelectTab("home")}
            className={getTabClass("home")}
            title="Explorer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <span className="text-[11px] mt-1 font-semibold tracking-tight">Explorer</span>
          </button>

          {/* 3. Categories */}
          <button
            type="button"
            onClick={() => onSelectTab("category")}
            className={getTabClass("category")}
            title="Categories"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
            </svg>
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Categories</span>
          </button>

          {/* 4. Characters */}
          <button
            type="button"
            onClick={() => onSelectTab("characters")}
            className={getTabClass("characters")}
            title="Characters"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Characters</span>
          </button>

          {/* 5. Multimedia Center */}
          <button
            type="button"
            onClick={() => onSelectTab("multimedia")}
            className={getTabClass("multimedia")}
            title="Multimedia Center"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2.5" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-[11px] mt-1 font-semibold tracking-tight">Media</span>
          </button>

          {/* 6. Articles */}
          <button
            type="button"
            onClick={() => onSelectTab("articles-events")}
            className={getTabClass("articles-events")}
            title="Articles & Events"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Articles</span>
          </button>

          {/* 7. Events */}
          <button
            type="button"
            onClick={() => onSelectTab("events")}
            className={getTabClass("events")}
            title="Events"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Events</span>
          </button>

          {/* 8. Merchandise */}
          <button
            type="button"
            onClick={() => onSelectTab("merchandise")}
            className={getTabClass("merchandise")}
            title="Merchandise"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="text-[10px] mt-1 font-semibold tracking-tight">Merch</span>
          </button>

          {/* 9. Feedback - Only for logged-in users */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => onSelectTab("feedback")}
              className={getTabClass("feedback")}
              title="Feedback"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10l2 2 2-3 2 2" />
              </svg>
              <span className="text-[10px] mt-1 font-semibold tracking-tight">Feedback</span>
            </button>
          )}

          {/* 10. Bookmarks - Only for logged-in users */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => onSelectTab("saved")}
              className={getTabClass("saved")}
              title="Bookmarks"
            >
              <div className="relative">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21L12 16L5 21V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V21Z" />
                </svg>
                {savedCount > 0 && (
                  <span
                    className={`absolute -top-0.5 -right-1 w-2 h-2 rounded-full ring-2 ${
                      isDark ? "bg-[#FFCC00] ring-[#1a1a1a]" : "bg-[#FF5F1F] ring-white"
                    }`}
                  />
                )}
              </div>
              <span className="text-[11px] mt-1 font-semibold tracking-tight">Bookmarks</span>
            </button>
          )}

          {/* 10. Submit Fan Content */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => onSelectTab("submit-content")}
              className={getTabClass("submit-content")}
              title="Submit Content"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              <span className="text-[10px] mt-1 font-semibold tracking-tight">Submit</span>
            </button>
          )}

          {/* 11. Profile */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => onSelectTab("profile")}
              className={getTabClass("profile")}
              title="Profile"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-[11px] mt-1 font-semibold tracking-tight">Profile</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

export { LeftSidebar };
