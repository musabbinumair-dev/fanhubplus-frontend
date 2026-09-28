import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopHeader } from "./AdminTopHeader";
import { Logo } from "../Logo";
import {
  X,
  LayoutDashboard,
  FileText,
  Users,
  Grid,
  Calendar,
  UserCheck,
  MessageSquare,
  ShieldCheck,
  HelpCircle,
  Settings,
  ArrowLeft
} from "lucide-react";

const AdminLayout = ({
  children,
  activeTab = "dashboard",
  onSelectTab,
  searchQuery = "",
  onSearchChange,
  onNavigateToUserPanel,
  onOpenNotifications,
  onOpenProfile,
  onLogout,
  onOpenLinkModal,
  navTheme = "light",
  unreadCount = 0,
  notifications = [],
  isLoadingNotifications = false,
  onMarkNotifAsRead,
  onMarkAllNotifsAsRead,
  onClearAllNotifs,
  onSelectNotification
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isDark = navTheme === "dark";

  const adminPages = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "content", label: "Manage Content", icon: FileText },
    { key: "characters", label: "Characters", icon: Users },
    { key: "categories", label: "Categories", icon: Grid },
    { key: "events", label: "Events", icon: Calendar },
    { key: "users", label: "Users", icon: UserCheck },
    { key: "feedback", label: "Feedback", icon: MessageSquare },
    { key: "approvals", label: "Pending Approvals", icon: ShieldCheck },
    { key: "chatbot-faqs", label: "Chatbot FAQs", icon: HelpCircle },
    { key: "settings", label: "Admin Settings", icon: Settings }
  ];

  const handleSelectTab = (tabKey) => {
    if (onSelectTab) onSelectTab(tabKey);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-baloo select-none ${
      isDark ? "bg-[#121212] text-stone-200" : "bg-[#FFFDF7] text-[#231C14]"
    }`}>
      {/* 1. TOP NAVBAR / HEADER */}
      <AdminTopHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onOpenNotifications={onOpenNotifications}
        onOpenProfile={onOpenProfile}
        onNavigateHome={() => onSelectTab && onSelectTab("dashboard")}
        onNavigateToUserPanel={onNavigateToUserPanel}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        onLogout={onLogout}
        theme={navTheme}
        unreadCount={unreadCount}
        notifications={notifications}
        isLoadingNotifications={isLoadingNotifications}
        onMarkNotifAsRead={onMarkNotifAsRead}
        onMarkAllNotifsAsRead={onMarkAllNotifsAsRead}
        onClearAllNotifs={onClearAllNotifs}
        onSelectNotification={onSelectNotification}
      />

      {/* 2. BODY CONTENT CHASSIS: Left Sidebar + Main Content Area */}
      <div
        className={`flex-1 flex h-full min-h-0 overflow-hidden transition-all duration-300 ${
          isMobileSidebarOpen ? "filter blur-sm pointer-events-none select-none" : ""
        }`}
        data-panel="admin-panel"
      >
        {/* Left Sidebar Rail for Desktop (hidden on mobile) */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onNavigateToUserPanel={onNavigateToUserPanel}
          theme={navTheme}
        />

        {/* Main Content Scrollable Viewport */}
        <main className={`flex-1 h-full min-w-0 overflow-y-auto flex flex-col justify-between ${
          isDark ? "bg-[#121212]" : "bg-[#FFFDF7]"
        }`}>
          <div className="w-full flex-1">
            {children}
          </div>
        </main>
      </div>

      {/* 3. MOBILE COLLAPSE SIDEBAR DRAWER (Admin) */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300 md:hidden cursor-pointer"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-label="Close admin menu"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] h-full shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col font-baloo select-none bg-white text-gray-800 border-r border-gray-200 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <Logo size="navbar" />
          </div>
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Admin Navigation
          </div>

          {adminPages.map((page) => {
            const Icon = page.icon;
            const isActive = activeTab === page.key;

            return (
              <button
                key={page.key}
                type="button"
                onClick={() => handleSelectTab(page.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#F59E0B]/15 text-[#B45309] font-bold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{page.label}</span>
              </button>
            );
          })}
        </div>

        {/* Drawer Footer: Back to User Panel */}
        <div className="p-3 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onNavigateToUserPanel) onNavigateToUserPanel();
              setIsMobileSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Return to User Hub</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export { AdminLayout };
