import React, { useState } from 'react';
import { TopHeader } from './TopHeader.jsx';
import { LeftSidebar } from './LeftSidebar.jsx';
import { MobileSidebarDrawer } from './MobileSidebarDrawer.jsx';
import { MobileBottomBar } from './MobileBottomBar.jsx';

/**
 * UserLayout - Shared Chassis for all User-Panel Pages
 * 
 * Standardizes the viewport layout:
 * 1. Fixed TopHeader navbar at top (with mobile collapse menu icon on left & centered logo)
 * 2. Left icon rail for desktop (hidden on mobile)
 * 3. Mobile slide-in collapse sidebar drawer with all pages and full page blur
 * 4. Main scrollable content area stretching full width
 * 5. Mobile bottom bar with main pages only
 */
export const UserLayout = ({
  children,
  activeTab,
  onSelectTab,
  savedCount = 0,
  isMoreOpen = false,
  onToggleMore,
  onCloseMore,
  onSelectCategory,
  onStartWiki,
  searchQuery = '',
  onSearchChange,
  onOpenNotifications,
  onOpenProfile,
  onNavigateHome,
  onNavigateToDashboard,
  onOpenAuth,
  onOpenSaved,
  isLoggedIn = true,
  currentUser = null,
  onLogout,
  unreadCount = 0,
  onOpenLinkModal,
  navTheme = 'light',
  notifications = [],
  isLoadingNotifications = false,
  onMarkNotifAsRead,
  onMarkAllNotifsAsRead,
  onClearAllNotifs,
  onSelectNotification,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isDark = navTheme === 'dark';

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-baloo select-none ${
      isDark ? 'bg-[#121212] text-stone-200' : 'bg-[#FFFDF7] text-[#231C14]'
    }`}>
      {/* 1. TOP NAVBAR / HEADER */}
      <TopHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onOpenNotifications={onOpenNotifications}
        onOpenProfile={onOpenProfile}
        onOpenDashboard={onNavigateToDashboard}
        onNavigateHome={onNavigateHome}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        unreadCount={unreadCount}
        onOpenAuth={onOpenAuth}
        onOpenSaved={onOpenSaved}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
        theme={navTheme}
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
        data-panel="user-panel"
      >
        {/* Desktop Left Sidebar Rail (hidden on mobile) */}
        <LeftSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          savedCount={savedCount}
          isMoreOpen={isMoreOpen}
          onToggleMore={onToggleMore}
          onCloseMore={onCloseMore}
          onSelectCategory={onSelectCategory}
          onStartWiki={onStartWiki}
          isLoggedIn={isLoggedIn}
          theme={navTheme}
        />

        {/* Main Content Scrollable Viewport (includes bottom padding on mobile for bottom bar) */}
        <main className={`flex-1 h-full min-w-0 overflow-y-auto flex flex-col justify-between pb-20 md:pb-0 ${
          isDark ? 'bg-[#121212]' : 'bg-[#FFFDF7]'
        }`}>
          <div className="w-full flex-1">
            {children}
          </div>
        </main>
      </div>

      {/* 3. MOBILE COLLAPSE SIDEBAR DRAWER (All Pages + Backdrop Blur) */}
      <MobileSidebarDrawer
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        savedCount={savedCount}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={onLogout}
        onOpenAuth={onOpenAuth}
        onStartWiki={onStartWiki}
        theme={navTheme}
      />

      {/* 4. MOBILE BOTTOM BAR (Main Pages Only) */}
      <MobileBottomBar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        savedCount={savedCount}
        isLoggedIn={isLoggedIn}
        onOpenAuth={onOpenAuth}
        theme={navTheme}
      />
    </div>
  );
};

export default UserLayout;
