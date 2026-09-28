const AdminSidebar = ({
  activeTab = "dashboard",
  onSelectTab,
  theme = "light"
}) => {
  const isDark = theme === "dark";

  const getTabClass = (tabKey) => {
    const isActive = activeTab === tabKey;
    if (isDark) {
      return `flex flex-col items-center justify-center w-full py-1.5 group cursor-pointer transition-colors ${
        isActive ? "text-[#FFCC00]" : "text-stone-300 hover:text-[#FFCC00]"
      }`;
    }
    return `flex flex-col items-center justify-center w-full py-1.5 group cursor-pointer transition-colors ${
      isActive ? "text-[#FF5F1F]" : "text-[#7A6F64] hover:text-[#231C14]"
    }`;
  };

  return (
    <div className="hidden md:flex relative shrink-0 h-full z-20 select-none font-baloo">
      <aside
        className={`w-16 h-full flex flex-col justify-between items-center py-3 shrink-0 transition-colors duration-200 overflow-y-auto scrollbar-none ${
          isDark
            ? "bg-[#1a1a1a] border-r border-[#2a2a2a]"
            : "bg-white border-r border-[#F0E8DD]"
        }`}
      >
        {/* Navigation Items */}
        <div className="flex flex-col items-center gap-2.5 w-full">
          {/* 1. Dashboard */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("dashboard")}
            className={getTabClass("dashboard")}
            title="Dashboard"
          >
            <svg
              width="19"
              height="19"
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
            <span className="text-[10px] mt-0.5 font-semibold tracking-tight">Dashboard</span>
          </button>

          {/* 2. Content */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("content")}
            className={getTabClass("content")}
            title="Manage Content"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <span className="text-[10px] mt-0.5 font-semibold tracking-tight">Content</span>
          </button>

          {/* 3. Characters */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("characters")}
            className={getTabClass("characters")}
            title="Manage Characters"
          >
            <svg
              width="19"
              height="19"
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
            <span className="text-[10px] mt-0.5 font-semibold tracking-tight">Characters</span>
          </button>

          {/* 4. Merchandise */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("merchandise")}
            className={getTabClass("merchandise")}
            title="Manage Merchandise"
          >
            <svg
              width="19"
              height="19"
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
            <span className="text-[10px] mt-0.5 font-semibold tracking-tight">Merch</span>
          </button>

          {/* 5. Categories */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("categories")}
            className={getTabClass("categories")}
            title="Manage Categories"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-[10px] mt-0.5 font-semibold tracking-tight">Category</span>
          </button>

          {/* 6. Events */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("events")}
            className={getTabClass("events")}
            title="Manage Events"
          >
            <svg
              width="19"
              height="19"
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
            <span className="text-[10px] mt-0.5 font-semibold tracking-tight">Events</span>
          </button>

          {/* 7. Users */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("users")}
            className={getTabClass("users")}
            title="Manage Users"
          >
            <svg
              width="19"
              height="19"
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
            <span className="text-[10px] mt-0.5 font-semibold tracking-tight">Users</span>
          </button>

          {/* 8. Pending Approvals */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("approvals")}
            className={getTabClass("approvals")}
            title="Pending Approvals"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <span className="text-[10px] mt-0.5 font-semibold tracking-tight text-center leading-tight">Approvals</span>
          </button>

          {/* 9. Feedback */}
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab("feedback")}
            className={getTabClass("feedback")}
            title="Feedback"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-[10px] mt-0.5 font-semibold tracking-tight">Feedback</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export { AdminSidebar };
