import { useState, useEffect } from "react";
import { BASE_URL } from "./api/api";
import { LeftSidebar } from "./components/LeftSidebar";
import { TopHeader } from "./components/TopHeader";
import { UserLayout } from "./components/UserLayout";
import { NewReleaseCategories } from "./components/homepage/NewReleaseCategories";
import { Hero } from "./components/homepage/Hero";
import { FilterBar } from "./components/homepage/FilterBar";
import { ContentCard } from "./components/homepage/ContentCard";
import { SignInPromptModal } from "./components/homepage/SignInPromptModal";
import { LoginRequiredModal } from "./components/common/LoginRequiredModal";
import { LandingContentModal } from "./components/homepage/LandingContentModal";
import { DashboardPage } from "./components/DashboardPage";
import { UserDashboardPage } from "./components/UserDashboardPage";
import { ManageContentPage } from "./components/ManageContentPage";
import { ManageUsersPage } from "./components/admin/ManageUsersPage";
import { ManageEventsPage } from "./components/admin/ManageEventsPage";
import { PendingApprovalsPage } from "./components/admin/PendingApprovalsPage";
import { ManageFeedbackPage } from "./components/admin/ManageFeedbackPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminSectionPlaceholder } from "./components/admin/AdminSectionPlaceholder";
import { SavedBookmarksPage } from "./components/SavedBookmarksPage";
import { UtilitiesView } from "./components/UtilitiesView";
import { ProfilePage } from "./components/ProfilePage";
import { ExplorePage } from "./components/ExplorePage";
import { CharacterDetailPage } from "./components/CharacterDetailPage";
import { CategoryPage } from "./components/CategoryPage";
import { MultimediaCenterPage } from "./components/MultimediaCenterPage";
import { CharactersPage } from "./components/CharactersPage";
import { ArticlesAndEventsPage } from "./components/ArticlesAndEventsPage";
import { SubmitFanContentPage } from "./components/SubmitFanContentPage";
import { EventsPage } from "./components/EventsPage";
import { MerchandisePage } from "./components/MerchandisePage";
import { FeedbackPage } from "./components/FeedbackPage";
import {
  ProfileDrawer,
  SettingsDrawer
} from "./components/SideDrawers";
import { StartWikiModal } from "./components/StartWikiModal";
import {
  TRENDING_CONTENT,
  HERO_FEATURED
} from "./data/homepageData";
import { ChatWidget } from "./components/Chatbot/ChatWidget";

function App() {
  const getTabFromPath = (path) => {
    if (path === "/dashboard") return "dashboard";
    if (path.startsWith("/category")) return "category";
    if (path.startsWith("/characters")) return "characters";
    if (path.startsWith("/multimedia")) return "multimedia";
    if (path.startsWith("/articles") || path.startsWith("/articles-events")) return "articles-events";
    if (path.startsWith("/events")) return "events";
    if (path.startsWith("/merchandise")) return "merchandise";
    if (path.startsWith("/feedback")) return "feedback";
    if (path.startsWith("/saved")) return "saved";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/submit-content")) return "submit-content";
    if (path.startsWith("/utilities")) return "utilities";
    return "home";
  };

  const getAdminTabFromPath = (path) => {
    if (path.includes("/admin/content")) return "content";
    if (path.includes("/admin/multimedia")) return "content";
    if (path.includes("/admin/characters")) return "characters";
    if (path.includes("/admin/articles")) return "content";
    if (path.includes("/admin/merchandise")) return "merchandise";
    if (path.includes("/admin/categories") || path.includes("/admin/category")) return "categories";
    if (path.includes("/admin/events")) return "events";
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/feedback")) return "feedback";
    if (path.includes("/admin/approvals") || path.includes("/admin/pending-approvals") || path.includes("/admin/submissions")) return "approvals";
    if (path.includes("/admin/chatbot-faqs")) return "chatbot-faqs";
    if (path.includes("/admin/settings")) return "settings";
    return "dashboard";
  };

  const getPathFromTab = (tab) => {
    if (tab === "home") return "/";
    if (tab === "articles-events") return "/articles";
    return `/${tab}`;
  };

  // Panel mode: "user" | "admin"
  const [panelMode, setPanelMode] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
      return "admin";
    }
    return "user";
  });

  // Admin routing tab (/admin/dashboard, /admin/content, etc.)
  const [adminTab, setAdminTab] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
      return getAdminTabFromPath(path);
    }
    const savedAdmin = localStorage.getItem("adminTab");
    return savedAdmin || "dashboard";
  });

  // User panel active tab
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname;
    if (!path.startsWith("/admin") && path !== "/" && path !== "") {
      return getTabFromPath(path);
    }
    const savedTab = localStorage.getItem("activeTab");
    return savedTab || "home";
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterPopularity, setFilterPopularity] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [infoModal, setInfoModal] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStartWikiOpen, setIsStartWikiOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(3);
  const [savedItemIds, setSavedItemIds] = useState(
    new Set(["trend-1", "trend-3"])
  );

  // Dynamic Real Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    try {
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(`${BASE_URL}/notifications`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
          setUnreadNotifCount(data.unreadCount || 0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [isLoggedIn, panelMode]);

  useEffect(() => {
    if (isNotificationsOpen) {
      fetchNotifications();
    }
  }, [isNotificationsOpen]);

  const handleMarkNotifAsRead = async (id) => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) return;
    try {
      await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id || n._id === id ? { ...n, unread: false } : n))
      );
      setUnreadNotifCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllNotifsAsRead = async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) return;
    try {
      await fetch(`${BASE_URL}/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      setUnreadNotifCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  const handleClearAllNotifs = async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) return;
    try {
      await fetch(`${BASE_URL}/notifications/clear-all`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
      setUnreadNotifCount(0);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  const handleSelectNotification = async (notif) => {
    if (notif.unread) {
      await handleMarkNotifAsRead(notif.id || notif._id);
    }
    setIsNotificationsOpen(false);

    if (panelMode === "admin") {
      if (notif.type === "pending_submission" || notif.link === "/admin/approvals") {
        handleAdminSelectTab("approvals");
      } else if (notif.link === "/characters" || notif.type === "character") {
        handleAdminSelectTab("characters");
      } else if (notif.link === "/merchandise" || notif.type === "merchandise") {
        handleAdminSelectTab("merchandise");
      } else if (notif.link === "/dashboard") {
        handleAdminSelectTab("dashboard");
      } else {
        handleAdminSelectTab("content");
      }
    } else {
      if (notif.link === "/characters" || notif.type === "character") {
        handleSelectTab("characters");
      } else if (notif.link === "/merchandise" || notif.type === "merchandise") {
        handleSelectTab("merchandise");
      } else if (notif.link === "/dashboard") {
        handleSelectTab("dashboard");
      } else if (notif.link === "/multimedia") {
        handleSelectTab("multimedia");
      } else {
        handleSelectTab("home");
      }
    }
  };

  // Synchronize browser history / URL paths
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/admin")) {
        setPanelMode("admin");
        setAdminTab(getAdminTabFromPath(path));
      } else {
        setPanelMode("user");
        setActiveTab(getTabFromPath(path));
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleOpenAuth = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.setItem("panelMode", "user");
    localStorage.setItem("activeTab", "home");
    setCurrentUser(null);
    setIsLoggedIn(false);
    setPanelMode("user");
    setActiveTab("home");
    window.history.pushState(null, "", "/");
  };

  const handleLoginSuccess = (userData) => {
    if (userData) {
      setCurrentUser(userData);
    }
    setIsLoggedIn(true);
    if (userData?.role === "admin") {
      setPanelMode("admin");
      setAdminTab("dashboard");
      localStorage.setItem("panelMode", "admin");
      localStorage.setItem("adminTab", "dashboard");
      window.history.pushState(null, "", "/admin/dashboard");
    } else {
      setPanelMode("user");
      setActiveTab("home");
      localStorage.setItem("panelMode", "user");
      localStorage.setItem("activeTab", "home");
      window.history.pushState(null, "", "/");
    }
  };

  const [toastMessage, setToastMessage] = useState(null);

  const [loginPrompt, setLoginPrompt] = useState({
    isOpen: false,
    message: "This feature requires login"
  });

  const handleRequireLogin = (msg = "This feature requires login") => {
    setLoginPrompt({
      isOpen: true,
      message: msg
    });
  };

  const handleCloseLoginPrompt = () => {
    setLoginPrompt((prev) => ({ ...prev, isOpen: false }));
  };

  const handleRedirectToLogin = () => {
    setLoginPrompt((prev) => ({ ...prev, isOpen: false }));
    handleOpenAuth("login");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const [backendTrending, setBackendTrending] = useState([]);

  const getSafePoster = (item) => {
    if (!item) return "/src/assets/images/one_piece_luffy_1790180189080.jpg";
    const candidates = [
      item.thumbnailUrl,
      item.posterImage,
      item.image,
      item.videoThumbnail,
      ...(Array.isArray(item.images) ? item.images : [])
    ];
    for (const url of candidates) {
      if (url && typeof url === "string" && !url.toLowerCase().includes(".pdf")) {
        return url;
      }
    }
    return "/src/assets/images/one_piece_luffy_1790180189080.jpg";
  };

  // Fetch trending content dynamically
  useEffect(() => {
    const fetchTrendingContent = async () => {
      try {
        const res = await fetch(`${BASE_URL}/content?sort=popular`);
        const data = await res.json();
        if (data && data.success && Array.isArray(data.contents) && data.contents.length > 0) {
          const formatted = data.contents.map((item) => {
            const categoryName = item.categoryId?.name || item.category || "Fandom";
            const itemType = (item.type || "ARTICLE").toUpperCase();
            const yearStr = item.year || (item.createdAt ? new Date(item.createdAt).getFullYear().toString() : "2025");
            const ratingStr = item.thumbsUpRatio ? (item.thumbsUpRatio / 10).toFixed(1) : (item.ratingAvg ? item.ratingAvg.toFixed(1) : "9.6");
            const coverImg = getSafePoster(item);

            return {
              id: item._id,
              _id: item._id,
              title: item.title,
              category: categoryName,
              year: yearStr,
              rating: ratingStr,
              publisher: item.submittedBy?.name || "FanHub Community",
              uploader: item.submittedBy?.name || "FanHub Creator",
              content: item.body || item.content || "Explore community lore archives, guides, and walkthroughs.",
              synopsis: item.body || item.content || "Explore community lore archives, guides, and walkthroughs.",
              genre: item.tags && item.tags.length > 0 ? item.tags.join(", ") : categoryName,
              tags: item.tags || [],
              posterImage: coverImg,
              videoThumbnail: coverImg,
              image: coverImg,
              thumbnailUrl: item.thumbnailUrl,
              backgroundImage: coverImg,
              type: itemType,
              mediaUrl: item.mediaUrl,
              images: item.images,
              body: item.body,
              popularityScore: item.popularityScore || 0,
              thumbsUpCount: item.thumbsUpCount || 0
            };
          });
          setBackendTrending(formatted);
        }
      } catch (err) {
        console.error("Failed to load trending content:", err);
      }
    };

    fetchTrendingContent();
  }, []);

  const handleToggleSaveItem = (item) => {
    if (!isLoggedIn) {
      handleRequireLogin("This feature requires login");
      return;
    }
    const targetId = item.id || item._id;
    let isSavedNow = false;

    setSavedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(targetId)) {
        next.delete(targetId);
        setSavedCount((c) => Math.max(0, c - 1));
        isSavedNow = false;
      } else {
        next.add(targetId);
        setSavedCount((c) => c + 1);
        isSavedNow = true;
      }
      return next;
    });

    showToast(isSavedNow ? "Saved to your bookmarks!" : "Removed from bookmarks.");
  };

  const handleOpenItem = (item) => {
    if (!item) return;
    const cover = getSafePoster(item);
    setSelectedItem({
      id: item._id || item.id || `item-${Date.now()}`,
      _id: item._id || item.id,
      title: item.title || item.name || "Fandom Feature",
      category: item.categoryId?.name || item.category || item.fandom || "Fandom",
      year: item.year || item.releaseYear || "2025",
      rating: item.rating || "9.5",
      popularity: item.popularity || item.views || "10K",
      posterImage: cover,
      image: cover,
      thumbnailUrl: item.thumbnailUrl,
      videoThumbnail: cover,
      backgroundImage: item.backgroundImage || cover,
      type: item.type || "article",
      genre: item.genre || (item.tags && item.tags.length > 0 ? item.tags.join(", ") : item.category || "Lore & Action"),
      tags: item.tags || [],
      desc: item.desc || item.description || item.body || item.content || item.synopsis || item.lore || item.bio,
      body: item.body || item.content || item.desc || item.description,
      mediaUrl: item.mediaUrl,
      pdfUrl: item.pdfUrl,
      images: item.images,
      uploader: item.submittedBy?.name || item.uploader || item.publisher
    });
  };

  const handleSelectTab = (tab, cat = null) => {
    setSelectedItem(null);
    setSelectedCharacter(null);
    if ((tab === "saved" || tab === "profile") && !isLoggedIn) {
      handleRequireLogin("This feature requires login");
      return;
    }
    if (tab === "settings") {
      setIsSettingsOpen(true);
      return;
    }
    if (cat) {
      setSelectedCategory(cat);
    }
    setActiveTab(tab);
    setPanelMode("user");
    localStorage.setItem("activeTab", tab);
    localStorage.setItem("panelMode", "user");
    const targetPath = getPathFromTab(tab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
    setIsMoreOpen(false);
  };

  const handleAdminSelectTab = (tabKey) => {
    setAdminTab(tabKey);
    setPanelMode("admin");
    localStorage.setItem("adminTab", tabKey);
    localStorage.setItem("panelMode", "admin");
    const targetPath = `/admin/${tabKey}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  };

  const handleNavigateToUserPanel = () => {
    setPanelMode("user");
    localStorage.setItem("panelMode", "user");
    const targetPath = getPathFromTab(activeTab);
    window.history.pushState(null, "", targetPath);
  };

  // Base list prioritizing dynamic backend contents with fallback
  const baseTrendingList = backendTrending.length > 0 ? backendTrending : TRENDING_CONTENT;

  // Extract unique category names and unique tags for FilterBar
  const uniqueCategories = Array.from(
    new Set(
      baseTrendingList
        .map((item) => item.category)
        .filter(Boolean)
    )
  ).sort();

  const uniqueTags = Array.from(
    new Set(
      baseTrendingList
        .flatMap((item) => (Array.isArray(item.tags) ? item.tags : []))
        .filter(Boolean)
    )
  ).sort();

  const filtered = baseTrendingList.filter((item) => {
    const itemCategory = (item.category || "").toLowerCase();
    const itemType = (item.type || "").toLowerCase();
    const itemTitle = (item.title || "").toLowerCase();
    const itemContent = (item.content || item.body || item.synopsis || "").toLowerCase();
    const searchLower = searchQuery.trim().toLowerCase();

    // 1. Search Query filter (matches title, category, content, or tags)
    const matchesSearch =
      !searchLower ||
      itemTitle.includes(searchLower) ||
      itemCategory.includes(searchLower) ||
      itemContent.includes(searchLower) ||
      (Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase().includes(searchLower)));

    // 2. Category filter
    const matchesCategory =
      selectedCategory === "All" ||
      itemCategory === selectedCategory.toLowerCase();

    // 3. Content Type filter
    const matchesType =
      filterType === "All" ||
      itemType === filterType.toLowerCase() ||
      (filterType === "video" && (itemType === "video" || itemType === "series")) ||
      (filterType === "article" && (itemType === "article" || itemType === "comic" || itemType === "guide")) ||
      (filterType === "image" && (itemType === "image" || itemType === "pic")) ||
      (filterType === "audio" && (itemType === "audio" || itemType === "album"));

    // 4. Tag filter
    const matchesTag =
      filterTag === "All" ||
      (Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase() === filterTag.toLowerCase()));

    return matchesSearch && matchesCategory && matchesType && matchesTag;
  });

  // Sort by popularity / order
  const sortedContent = [...filtered].sort((a, b) => {
    if (filterPopularity === "most_popular") {
      const aScore = (a.thumbsUpCount || 0) * 10 + (a.popularityScore || 0);
      const bScore = (b.thumbsUpCount || 0) * 10 + (b.popularityScore || 0);
      return bScore - aScore;
    }
    if (filterPopularity === "highest_rated") {
      return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
    }
    if (filterPopularity === "latest") {
      return new Date(b.createdAt || b.year || 0) - new Date(a.createdAt || a.year || 0);
    }
    return 0;
  });

  // Limit to 4 or 8 items in trending across fandoms
  const displayedContent = sortedContent.length > 4 && sortedContent.length <= 8 ? sortedContent : sortedContent.slice(0, 8);

  const handleChatNavigation = (path) => {
    if (!path) return;
    if (path === "/" || path === "home") {
      handleSelectTab("home");
      return;
    }
    const clean = path.startsWith("/") ? path.slice(1) : path;
    if (clean.startsWith("category")) {
      handleSelectTab("category");
    } else if (clean.startsWith("characters")) {
      handleSelectTab("characters");
    } else if (clean.startsWith("merchandise")) {
      handleSelectTab("merchandise");
    } else if (clean.startsWith("events")) {
      handleSelectTab("events");
    } else if (clean.startsWith("submit-content") || clean.startsWith("submit")) {
      handleSelectTab("submit-content");
    } else if (clean.startsWith("saved") || clean.startsWith("bookmarks")) {
      handleSelectTab("saved");
    } else if (clean.startsWith("profile")) {
      handleSelectTab("profile");
    } else if (clean.startsWith("dashboard")) {
      handleSelectTab("dashboard");
    } else if (clean.startsWith("multimedia") || clean.startsWith("articles")) {
      handleSelectTab("multimedia");
    } else {
      handleSelectTab("home");
    }
  };

  /* ========================================================================= */
  /*   1. COMPLETELY SEPARATE ADMIN PANEL ROUTING & LAYOUT                     */
  /* ========================================================================= */
  if (panelMode === "admin") {
    return (
      <AdminLayout
        activeTab={adminTab}
        onSelectTab={handleAdminSelectTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateToUserPanel={handleNavigateToUserPanel}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setAdminTab("dashboard")}
        onLogout={handleLogout}
        onOpenLinkModal={(title, desc) => setInfoModal({ title, desc })}
        unreadCount={unreadNotifCount}
        notifications={notifications}
        isLoadingNotifications={isLoadingNotifications}
        onMarkNotifAsRead={handleMarkNotifAsRead}
        onMarkAllNotifsAsRead={handleMarkAllNotifsAsRead}
        onClearAllNotifs={handleClearAllNotifs}
        onSelectNotification={handleSelectNotification}
      >
        {adminTab === "content" ? (
          <ManageContentPage pageTab="content" onOpenArticle={handleOpenItem} />
        ) : adminTab === "characters" ? (
          <ManageContentPage pageTab="characters" onOpenArticle={handleOpenItem} />
        ) : adminTab === "merchandise" ? (
          <ManageContentPage pageTab="merchandise" onOpenArticle={handleOpenItem} />
        ) : adminTab === "categories" || adminTab === "category" ? (
          <ManageContentPage pageTab="category" onOpenArticle={handleOpenItem} />
        ) : adminTab === "events" ? (
          <ManageEventsPage />
        ) : adminTab === "users" ? (
          <ManageUsersPage />
        ) : adminTab === "feedback" ? (
          <ManageFeedbackPage />
        ) : adminTab === "approvals" || adminTab === "pending-approvals" || adminTab === "submissions" ? (
          <PendingApprovalsPage />
        ) : (
          <DashboardPage
            onOpenArticle={handleOpenItem}
            onNavigateTab={handleAdminSelectTab}
          />
        )}
      </AdminLayout>
    );
  }

  /* ========================================================================= */
  /*   2. USER PANEL (REGISTERED & GUEST) WITH NO TRACE OF ADMIN PAGES        */
  /* ========================================================================= */
  return (
    <>
      {/* USER PANEL WRAPPED IN SHARED UserLayout CHASSIS */}
      <UserLayout
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (!isLoggedIn && (tab === "feedback" || tab === "submit-content")) {
            handleRequireLogin("This feature requires login");
          } else {
            handleSelectTab(tab);
          }
        }}
        savedCount={savedCount}
        isMoreOpen={isMoreOpen}
        onToggleMore={() => setIsMoreOpen(!isMoreOpen)}
        onCloseMore={() => setIsMoreOpen(false)}
        onSelectCategory={(category) => {
          handleSelectTab("multimedia", category);
        }}
        onStartWiki={() => {
          if (!isLoggedIn) {
            handleRequireLogin("This feature requires login");
          } else {
            setIsStartWikiOpen(true);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => {
          if (!isLoggedIn) {
            handleOpenAuth("login");
          } else {
            handleSelectTab("profile");
          }
        }}
        onNavigateToDashboard={() => {
          if (!isLoggedIn) {
            handleRequireLogin("This feature requires login");
          } else {
            handleSelectTab("dashboard");
          }
        }}
        onNavigateHome={() => {
          handleSelectTab("home");
        }}
        onOpenAuth={handleOpenAuth}
        onOpenSaved={() => {
          if (!isLoggedIn) {
            handleRequireLogin("This feature requires login");
          } else {
            handleSelectTab("saved");
          }
        }}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
        unreadCount={isLoggedIn ? unreadNotifCount : 0}
        notifications={notifications}
        isLoadingNotifications={isLoadingNotifications}
        onMarkNotifAsRead={handleMarkNotifAsRead}
        onMarkAllNotifsAsRead={handleMarkAllNotifsAsRead}
        onClearAllNotifs={handleClearAllNotifs}
        onSelectNotification={handleSelectNotification}
        onOpenLinkModal={(title, desc) => setInfoModal({ title, desc })}
        navTheme={selectedCharacter ? "detail" : "light"}
      >
        {selectedCharacter ? (
          <div className="w-full">
            <CharacterDetailPage
              character={selectedCharacter}
              onBack={() => setSelectedCharacter(null)}
              isLoggedIn={isLoggedIn}
              onOpenAuth={handleOpenAuth}
              onRequireLogin={handleRequireLogin}
            />
          </div>
        ) : (
          <>
            {/* VIEW 1: USER EXPLORER PAGE (LOGGED IN) / HERO & TRENDING (GUEST) */}
            {activeTab === "home" && (
              isLoggedIn ? (
                <div className="w-full">
                  <ExplorePage
                    isLoggedIn={isLoggedIn}
                    savedItemIds={savedItemIds}
                    onToggleSaveItem={handleToggleSaveItem}
                    onOpenAuth={handleOpenAuth}
                    onRequireLogin={handleRequireLogin}
                  />
                </div>
              ) : (
                <div className="flex flex-col min-h-full bg-[#FFFDF7]">
                  <Hero
                    onExplore={() => handleSelectTab("multimedia")}
                    onOpenArticle={() => handleSelectTab("multimedia")}
                    onOpenAuth={handleOpenAuth}
                  />

                  <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-12">
                    <NewReleaseCategories
                      onSelectItem={handleOpenItem}
                      onSelectCategory={(category) => {
                        handleSelectTab("multimedia", category);
                      }}
                      onSeeMore={() => {
                        const heading = document.getElementById("trending-heading");
                        if (heading) heading.scrollIntoView({ behavior: "smooth" });
                      }}
                    />

                    <section className="w-full space-y-5" aria-labelledby="trending-heading">
                      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 border-[#231C14]/10 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                          <h2 id="trending-heading" className="text-[#231C14] text-xl sm:text-2xl font-black tracking-wider uppercase font-titan">
                            TRENDING ACROSS FANDOMS
                          </h2>
                        </div>
                      </div>

                      <FilterBar
                        searchTerm={searchQuery}
                        onSearchChange={setSearchQuery}
                        category={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        categoriesList={uniqueCategories}
                        contentType={filterType}
                        onContentTypeChange={setFilterType}
                        popularity={filterPopularity}
                        onPopularityChange={setFilterPopularity}
                        selectedTag={filterTag}
                        onTagChange={setFilterTag}
                        tagsList={uniqueTags}
                        onReset={() => {
                          setSelectedCategory("All");
                          setSearchQuery("");
                          setFilterType("All");
                          setFilterPopularity("All");
                          setFilterTag("All");
                        }}
                      />

                      {displayedContent.length === 0 ? (
                        <p className="text-sm font-bold text-stone-500 text-center py-8">No matching fandoms found.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-2">
                          {displayedContent.map((item) => {
                            const itemId = item.id || item._id;
                            return (
                              <ContentCard
                                key={itemId}
                                item={item}
                                isSaved={savedItemIds.has(itemId)}
                                onSelect={handleOpenItem}
                                onOpenAuth={handleOpenAuth}
                                onToggleSave={handleToggleSaveItem}
                                isLoggedIn={isLoggedIn}
                              />
                            );
                          })}
                        </div>
                      )}
                    </section>
                  </main>
                </div>
              )
            )}

            {/* VIEW 1B: USER DASHBOARD PAGE */}
            {activeTab === "dashboard" && (
              <div className="w-full">
                <UserDashboardPage
                  onNavigateHome={() => handleSelectTab("home")}
                  onNavigateCategory={(cat) => {
                    handleSelectTab("multimedia", cat);
                  }}
                  onNavigateSaved={() => handleSelectTab("saved")}
                  onNavigateSubmit={() => handleSelectTab("submit-content")}
                  onNavigateProfile={() => handleSelectTab("profile")}
                  onOpenArticle={(item) => {
                    if (item?.category) {
                      handleSelectTab("multimedia", item.category);
                    }
                  }}
                />
              </div>
            )}

            {/* VIEW 2: PROFILE PAGE */}
            {activeTab === "profile" && (
              <div className="w-full">
                <ProfilePage
                  onBackToHome={() => handleSelectTab("home")}
                  onSaveSuccess={(updated) => {
                    if (updated) setCurrentUser(updated);
                    showToast("Profile preferences successfully saved!");
                    handleSelectTab("home");
                  }}
                />
              </div>
            )}

            {/* VIEW 3: EXACT CATEGORY PAGE */}
            {activeTab === "category" && (
              <div className="w-full">
                <CategoryPage
                  onSelectCategory={(catName) => {
                    handleSelectTab("multimedia", catName);
                  }}
                />
              </div>
            )}

            {/* VIEW 4: CHARACTERS PAGE */}
            {activeTab === "characters" && (
              <div className="w-full">
                <CharactersPage
                  onNavigateHome={() => handleSelectTab("home")}
                  onOpenCharacter={(char) => setSelectedCharacter(char)}
                  onOpenArticle={handleOpenItem}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={handleOpenAuth}
                  onRequireLogin={handleRequireLogin}
                />
              </div>
            )}

            {/* VIEW 5: MULTIMEDIA CENTER */}
            {activeTab === "multimedia" && (
              <div className="w-full">
                <MultimediaCenterPage
                  onNavigateHome={() => handleSelectTab("home")}
                  selectedCategory={selectedCategory}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={handleOpenAuth}
                  onRequireLogin={handleRequireLogin}
                />
              </div>
            )}

            {/* VIEW 6: FEATURED ARTICLES*/}
            {activeTab === "articles-events" && (
              <div className="w-full">
                <ArticlesAndEventsPage
                  onNavigateHome={() => handleSelectTab("home")}
                  onNavigateSubmit={() => handleSelectTab("submit-content")}
                  onOpenArticle={handleOpenItem}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={handleOpenAuth}
                  onRequireLogin={handleRequireLogin}
                />
              </div>
            )}

            {/* VIEW 7: SUBMIT FAN CONTENT */}
            {activeTab === "submit-content" && (
              <div className="w-full">
                <SubmitFanContentPage
                  onNavigateHome={() => handleSelectTab("home")}
                  onNavigateArticles={() => handleSelectTab("articles-events")}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={handleOpenAuth}
                  onRequireLogin={handleRequireLogin}
                />
              </div>
            )}

            {/* VIEW 8: EVENTS PAGE */}
            {activeTab === "events" && (
              <div className="w-full">
                <EventsPage
                  onNavigateHome={() => handleSelectTab("home")}
                  onNavigateSubmit={() => handleSelectTab("submit-content")}
                  onOpenArticle={handleOpenItem}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={handleOpenAuth}
                  onRequireLogin={handleRequireLogin}
                />
              </div>
            )}

            {/* VIEW 9: MERCHANDISE PAGE */}
            {activeTab === "merchandise" && (
              <div className="w-full">
                <MerchandisePage
                  onNavigateHome={() => handleSelectTab("home")}
                  onOpenArticle={handleOpenItem}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={handleOpenAuth}
                  onRequireLogin={handleRequireLogin}
                />
              </div>
            )}

            {/* VIEW 10: FEEDBACK PAGE */}
            {activeTab === "feedback" && (
              <div className="w-full">
                <FeedbackPage
                  onNavigateHome={() => handleSelectTab("home")}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={handleOpenAuth}
                  onRequireLogin={handleRequireLogin}
                />
              </div>
            )}

            {/* VIEW 11: SAVED BOOKMARKS */}
            {activeTab === "saved" && (
              <div className="w-full">
                <SavedBookmarksPage
                  parentLabel="Explorer"
                  onNavigateHome={() => handleSelectTab("home")}
                  onSelectStory={handleOpenItem}
                  onOpenCharacter={(char) => setSelectedCharacter(char)}
                  onRemoveSavedStory={() => {
                    setSavedCount((prev) => Math.max(0, prev - 1));
                  }}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={handleOpenAuth}
                  onRequireLogin={handleRequireLogin}
                />
              </div>
            )}

            {/* VIEW 12: UTILITIES */}
            {activeTab === "utilities" && (
              <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                <UtilitiesView
                  onBackToHome={() => handleSelectTab("home")}
                  onOpenToolModal={handleOpenItem}
                />
              </div>
            )}
          </>
        )}
      </UserLayout>

      {/* GLOBAL OVERLAYS & DRAWERS */}
      <LoginRequiredModal
        isOpen={loginPrompt.isOpen}
        message={loginPrompt.message}
        onClose={handleCloseLoginPrompt}
        onRedirectToLogin={handleRedirectToLogin}
      />

      <SignInPromptModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleLoginSuccess}
        onOpenAdmin={(userData) => {
          if (userData) {
            setCurrentUser(userData);
          }
          setIsLoggedIn(true);
          setIsAuthOpen(false);
          setPanelMode("admin");
          setAdminTab("dashboard");
          localStorage.setItem("panelMode", "admin");
          localStorage.setItem("adminTab", "dashboard");
          window.history.pushState(null, "", "/admin/dashboard");
        }}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenEditProfile={() => handleSelectTab("profile")}
        onOpenBookmarks={() => handleSelectTab("saved")}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <StartWikiModal
        isOpen={isStartWikiOpen}
        onClose={() => setIsStartWikiOpen(false)}
      />

      {selectedItem && (
        <LandingContentModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isLoggedIn={isLoggedIn}
          onOpenAuth={handleOpenAuth}
          isSaved={savedItemIds.has(selectedItem.id || selectedItem._id)}
          onToggleSave={handleToggleSaveItem}
        />
      )}

      {infoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setInfoModal(null)}
        >
          <div
            className="bg-white rounded-2xl border border-[#EDE4D6] p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EDE4D6] pb-3">
              <h3 className="text-lg font-black tracking-tight text-[#231C14] font-titan uppercase">
                {infoModal.title}
              </h3>
              <button
                onClick={() => setInfoModal(null)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold px-2 py-1 bg-stone-100 rounded-md cursor-pointer"
              >
                ESC
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#7A6F64] leading-relaxed">
              {infoModal.desc}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInfoModal(null)}
                className="px-4 py-2 bg-[#FF5F1F] hover:bg-[#E04F13] text-white font-extrabold text-xs tracking-wider uppercase rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic AI Chatbot Widget */}
      <ChatWidget onNavigate={handleChatNavigation} currentUser={currentUser} />

      {/* Guest & User Bookmark Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#181A20] border border-[#2B2F3D] text-white px-4 py-3 rounded-none shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200 font-baloo">
          <div className="w-2 h-2 rounded-full bg-[#FFA800] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export default App;

