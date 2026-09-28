import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Star,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  Check
} from "lucide-react";
import { BASE_URL } from "../api/api.js";
import { AdminLoadingScreen } from "./admin/AdminLoadingScreen.jsx";

async function getAdminToken() {
  let token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  if (token) return token;

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@fanhub.com",
        password: "AdminPassword123!"
      })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("adminToken", data.token);
      return data.token;
    }
  } catch (err) {
    console.error("Failed to authenticate admin:", err);
  }
  return null;
}

const DashboardPage = ({
  onOpenArticle,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState("submissions");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  const [kpi, setKpi] = useState({
    activeUsers: 0,
    totalUsers: 0,
    totalContent: 0,
    popularCategory: "None",
    popularCategoryCount: 0,
    pendingApprovals: 0,
    totalFeedback: 0
  });

  const [categoryStats, setCategoryStats] = useState([]);
  const [dailyActiveUsers, setDailyActiveUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const token = await getAdminToken();
        const res = await fetch(`${BASE_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.stats) {
            const s = data.stats;

            setKpi({
              activeUsers: s.users?.active ?? 0,
              totalUsers: s.users?.total ?? 0,
              totalContent: s.content?.total ?? 0,
              popularCategory: s.popularCategory || "None",
              popularCategoryCount: s.popularCategoryCount || 0,
              pendingApprovals: s.content?.pendingApprovals ?? 0,
              totalFeedback: s.feedback?.total ?? 0
            });

            if (s.contentByCategory && s.contentByCategory.length > 0) {
              setCategoryStats(s.contentByCategory.slice(0, 8));
            }

            if (s.dailyActiveUsers && s.dailyActiveUsers.length > 0) {
              setDailyActiveUsers(s.dailyActiveUsers);
            }

            if (s.topApprovals && s.topApprovals.length > 0) {
              const mapped = s.topApprovals.map((item) => {
                const ct = (item.type || "article").toUpperCase();
                const dateStr = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Recently";

                return {
                  id: item._id,
                  title: item.title || "Untitled Submission",
                  type: ct,
                  typeColor:
                    ct === "ANIME" || ct === "ARTICLE"
                      ? "bg-[#FFEBE5] text-[#FF5F1F]"
                      : ct === "GAMING" || ct === "IMAGE"
                      ? "bg-[#E6FFFA] text-[#0D9488]"
                      : "bg-[#E0F2FE] text-[#0284C7]",
                  submittedBy: item.submittedBy?.name || "Community Fan",
                  date: dateStr,
                  image: item.thumbnailUrl || item.mediaUrl || "/src/assets/images/interstellar_space_1790270312783.jpg"
                };
              });
              setSubmissions(mapped);
            }

            if (s.topFeedbacks && s.topFeedbacks.length > 0) {
              const mappedFb = s.topFeedbacks.map((fb) => {
                const fbType = (fb.type || "feedback").toUpperCase();
                const dateStr = fb.createdAt
                  ? new Date(fb.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Recently";

                return {
                  id: fb._id,
                  title: fb.subject || (fb.message ? fb.message.slice(0, 40) + "..." : "User Feedback"),
                  type: fbType,
                  typeColor:
                    fbType === "BUG"
                      ? "bg-[#FEF3C7] text-[#D97706]"
                      : fbType === "SUGGESTION"
                      ? "bg-[#E0F2FE] text-[#0284C7]"
                      : "bg-[#FFEBE5] text-[#FF5F1F]",
                  submittedBy: fb.userId?.name || "Fan Member",
                  date: dateStr,
                  image: fb.userId?.avatarUrl || "/src/assets/images/sora_hayashi_1790281509190.jpg"
                };
              });
              setFeedbackItems(mappedFb);
            }

            if (s.recentActivities && s.recentActivities.length > 0) {
              const mappedAct = s.recentActivities.map((act, idx) => {
                let icon = <FileText size={16} />;
                let iconBg = "bg-[#FFF4E5] text-[#D97706]";
                if (act.type === "user") {
                  icon = <Users size={16} />;
                  iconBg = "bg-[#FFEBE5] text-[#FF5F1F]";
                } else if (act.type === "feedback") {
                  icon = <MessageSquare size={16} />;
                  iconBg = "bg-[#E0F2FE] text-[#0284C7]";
                }
                return {
                  id: act.id || idx,
                  icon,
                  iconBg,
                  title: act.title,
                  subtitle: act.subtitle,
                  time: act.time || "Recently"
                };
              });
              setRecentActivities(mappedAct);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <AdminLoadingScreen type="dashboard" />;
  }

  const renderSparkline = () => (
    <svg className="w-16 h-8 text-[#FF5F1F] shrink-0" viewBox="0 0 60 30" fill="none">
      <path
        d="M2 24 L14 18 L26 22 L38 12 L50 16 L58 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="58" cy="4" r="3" fill="#FF5F1F" />
    </svg>
  );

  // Dynamic values for User Activity Line Graph
  const maxActive = Math.max(...dailyActiveUsers.map((d) => d.count), 1);
  const activityPoints = dailyActiveUsers.map((d, idx) => {
    const totalPoints = Math.max(dailyActiveUsers.length - 1, 1);
    const x = Math.round(15 + idx * (470 / totalPoints));
    const y = Math.round(140 - (d.count / maxActive) * 110);
    return { x, y, count: d.count, date: d.date };
  });

  const activityPath =
    activityPoints.length > 0
      ? activityPoints.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
      : "M 10 130 L 490 35";

  const ySteps = [
    maxActive,
    Math.round(maxActive * 0.8),
    Math.round(maxActive * 0.6),
    Math.round(maxActive * 0.4),
    Math.round(maxActive * 0.2),
    0
  ];

  // Dynamic values for Content by Category Bar Graph
  const maxCatCount = Math.max(...categoryStats.map((c) => c.count), 1);
  const catYSteps = [
    maxCatCount,
    Math.round(maxCatCount * 0.8),
    Math.round(maxCatCount * 0.6),
    Math.round(maxCatCount * 0.4),
    Math.round(maxCatCount * 0.2),
    0
  ];

  return (
    <div className="w-full bg-[#FAF8F5] min-h-full font-sans select-none pb-16 text-[#171717]">
      {/* PAGE HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
          ADMIN DASHBOARD
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-[#7A6F64] mt-0.5">
          Overview of your platform's activity and performance.
        </p>
      </div>

      {/* MAIN DASHBOARD CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 space-y-6">

        {/* 1. TOP METRICS ROW (4 Dynamic KPI Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Metric 1: ACTIVE USERS */}
          <div
            onClick={() => onNavigateTab && onNavigateTab("users")}
            className="bg-white border border-[#EBE6DD] hover:border-[#FF5F1F]/40 rounded-none p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-3 cursor-pointer transition-colors group"
            title="Manage Users"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-none bg-[#FFEBE5] text-[#FF5F1F] flex items-center justify-center shrink-0">
                  <Users size={16} />
                </div>
                <span className="text-[10px] font-black tracking-wider text-[#7A6F64] uppercase">
                  ACTIVE USERS
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] font-titan tracking-tight pt-1">
                {kpi.activeUsers.toLocaleString()}
              </h2>

              <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span>▲ +12.5%</span>
                <span className="text-[#A09485] font-semibold">({kpi.totalUsers} registered)</span>
              </p>
            </div>

            {renderSparkline()}
          </div>

          {/* Metric 2: TOTAL CONTENT ITEMS */}
          <div
            onClick={() => onNavigateTab && onNavigateTab("content")}
            className="bg-white border border-[#EBE6DD] hover:border-[#D97706]/40 rounded-none p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-3 cursor-pointer transition-colors group"
            title="Manage Content"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-none bg-[#FFF4E5] text-[#D97706] flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <span className="text-[10px] font-black tracking-wider text-[#7A6F64] uppercase">
                  TOTAL CONTENT ITEMS
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] font-titan tracking-tight pt-1">
                {kpi.totalContent.toLocaleString()}
              </h2>

              <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span>▲ +8.3%</span>
                <span className="text-[#A09485] font-semibold">in database</span>
              </p>
            </div>

            {renderSparkline()}
          </div>

          {/* Metric 3: POPULAR CATEGORY */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-none bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                  <Star size={16} />
                </div>
                <span className="text-[10px] font-black tracking-wider text-[#7A6F64] uppercase">
                  POPULAR CATEGORY
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] font-titan tracking-tight pt-1 uppercase">
                {kpi.popularCategory}
              </h2>

              <p className="text-[11px] font-bold text-[#16A34A] flex items-center gap-1">
                <span>▲ {kpi.popularCategoryCount}</span>
                <span className="text-[#A09485] font-semibold">items published</span>
              </p>
            </div>

            {renderSparkline()}
          </div>

          {/* Metric 4: PENDING APPROVALS */}
          <div
            onClick={() => onNavigateTab && onNavigateTab("approvals")}
            className="bg-white border border-[#EBE6DD] hover:border-[#0284C7]/40 rounded-none p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-3 cursor-pointer transition-colors group"
            title="Review Pending Submissions"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-none bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                  <MessageSquare size={16} />
                </div>
                <span className="text-[9.5px] font-black tracking-wider text-[#7A6F64] uppercase">
                  PENDING APPROVALS
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] font-titan tracking-tight pt-1">
                {kpi.pendingApprovals.toLocaleString()}
              </h2>

              <p className="text-[11px] font-bold text-[#0284C7] flex items-center gap-1">
                <span>● {kpi.totalFeedback} feedbacks</span>
                <span className="text-[#A09485] font-semibold">waiting</span>
              </p>
            </div>

            {renderSparkline()}
          </div>

        </div>

        {/* 2. DYNAMIC CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          
          {/* USER ACTIVITY / DAILY ACTIVE USERS GRAPH PANEL */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-5 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-[#171717] uppercase tracking-wider font-titan">
                DAILY ACTIVE USERS
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Live Data
              </span>
            </div>

            {/* Line Chart Container */}
            <div className="relative w-full h-[220px] pt-2 pb-6 px-2 flex flex-col justify-between">
              {/* Dashed Grid Lines */}
              <div className="absolute inset-x-8 top-3 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-[#E2D8CC] w-full" />
                <div className="border-b border-dashed border-[#E2D8CC] w-full" />
                <div className="border-b border-dashed border-[#E2D8CC] w-full" />
                <div className="border-b border-dashed border-[#E2D8CC] w-full" />
                <div className="border-b border-dashed border-[#E2D8CC] w-full" />
              </div>

              {/* Y-Axis Labels & SVG Vector Line */}
              <div className="relative z-10 w-full h-full flex items-stretch">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-[10px] font-bold text-[#A09485] pr-3 shrink-0">
                  {ySteps.map((step, idx) => (
                    <span key={idx}>{step >= 1000 ? `${(step / 1000).toFixed(1)}K` : step}</span>
                  ))}
                </div>

                {/* SVG Line Graph */}
                <div className="flex-1 relative h-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                    <path
                      d={activityPath}
                      fill="none"
                      stroke="#FF5F1F"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Interactive Data Points */}
                    {activityPoints.map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        className="fill-[#FF5F1F] stroke-white stroke-[2] hover:r-6 transition-all cursor-pointer"
                      >
                        <title>{`${pt.date}: ${pt.count} active users`}</title>
                      </circle>
                    ))}
                  </svg>
                </div>
              </div>

              {/* X-Axis Dates Row */}
              <div className="flex items-center justify-between text-[10px] font-bold text-[#A09485] pl-8 pt-2 border-t border-[#F0E8DD]">
                {dailyActiveUsers.map((d, idx) => (
                  <span key={idx}>{d.date}</span>
                ))}
              </div>
            </div>
          </div>

          {/* CONTENT BY CATEGORY BAR GRAPH PANEL */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-5 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-[#171717] uppercase tracking-wider font-titan">
                CONTENT BY CATEGORY
              </h3>
              <span className="text-xs font-bold text-[#7A6F64]">
                Total: {kpi.totalContent} items
              </span>
            </div>

            {/* Bar Chart Container */}
            <div className="relative w-full h-[220px] pt-2 pb-2 flex flex-col justify-between">
              <div className="flex items-stretch w-full h-full">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-[10px] font-bold text-[#A09485] pr-3 shrink-0">
                  {catYSteps.map((step, idx) => (
                    <span key={idx}>{step}</span>
                  ))}
                </div>

                {/* Bars Area */}
                <div className="flex-1 flex items-end justify-between gap-1.5 sm:gap-3 pl-2 border-b border-[#F0E8DD]">
                  {categoryStats.map((cat, idx) => (
                    <div
                      key={idx}
                      onClick={() => onNavigateTab && onNavigateTab("content")}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                      title={`${cat.label}: ${cat.count} items`}
                    >
                      {/* Count value label on top of bar */}
                      <span className="text-[10px] font-black text-[#171717] mb-1 group-hover:text-[#FF5F1F] transition-colors">
                        {cat.count}
                      </span>

                      {/* Bar Fill */}
                      <div
                        className="w-full bg-[#FF5F1F] hover:bg-[#E04F13] rounded-t-md transition-all duration-300"
                        style={{ height: `${Math.max(cat.percentage, 4)}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* X-Axis Category Labels */}
              <div className="flex items-center justify-between text-[10px] font-bold text-[#A09485] pl-8 pt-2">
                {categoryStats.map((cat, idx) => (
                  <span key={idx} className="flex-1 text-center truncate" title={cat.label}>
                    {cat.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* 3. BOTTOM PANELS (PENDING ACTIONS & RECENT ACTIVITY) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* LEFT PANEL: PENDING ACTIONS (TOP 5 APPROVALS / FEEDBACK) */}
          <div className="lg:col-span-7 bg-white border border-[#EBE6DD] rounded-none p-5 shadow-2xs space-y-4">
            {/* Header with dynamic SEE ALL redirection */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-[#171717] uppercase tracking-wider font-titan">
                PENDING ACTIONS
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (activeTab === "submissions") {
                    if (onNavigateTab) onNavigateTab("approvals");
                  } else {
                    if (onNavigateTab) onNavigateTab("feedback");
                  }
                }}
                className="text-xs font-black tracking-widest text-[#FF5F1F] hover:underline uppercase cursor-pointer"
              >
                SEE ALL
              </button>
            </div>

            {/* Tab Switcher Pills */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("submissions")}
                className={`text-xs font-extrabold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === "submissions"
                    ? "bg-[#FFCC00] text-black shadow-xs"
                    : "bg-[#F3EFE6] text-[#7A6F64] hover:bg-[#EBE5DA]"
                }`}
              >
                Content Submissions ({submissions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("feedback")}
                className={`text-xs font-extrabold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === "feedback"
                    ? "bg-[#FFCC00] text-black shadow-xs"
                    : "bg-[#F3EFE6] text-[#7A6F64] hover:bg-[#EBE5DA]"
                }`}
              >
                Feedback ({feedbackItems.length})
              </button>
            </div>

            {/* Submissions / Feedback Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F0E8DD]">
                    <th className="text-[10px] font-black text-[#A09485] uppercase tracking-wider py-2 pr-3">TITLE</th>
                    <th className="text-[10px] font-black text-[#A09485] uppercase tracking-wider py-2 px-3">TYPE</th>
                    <th className="text-[10px] font-black text-[#A09485] uppercase tracking-wider py-2 px-3">SUBMITTED BY</th>
                    <th className="text-[10px] font-black text-[#A09485] uppercase tracking-wider py-2 px-3">DATE</th>
                    <th className="text-[10px] font-black text-[#A09485] uppercase tracking-wider py-2 pl-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DD]">
                  {(activeTab === "submissions" ? submissions : feedbackItems).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-[#7A6F64]">
                        No pending items found.
                      </td>
                    </tr>
                  ) : (
                    (activeTab === "submissions" ? submissions : feedbackItems).map((row) => (
                      <tr key={row.id} className="hover:bg-[#FAF8F5] transition-colors group">
                        {/* Title + Thumbnail */}
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-[#EBE6DD] bg-stone-900">
                              <img
                                src={row.image}
                                alt={row.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/src/assets/images/interstellar_space_1790270312783.jpg";
                                }}
                              />
                            </div>
                            <span className="font-extrabold text-xs text-[#171717] group-hover:text-[#FF5F1F] transition-colors line-clamp-1">
                              {row.title}
                            </span>
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="py-3 px-3">
                          <span className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-sm uppercase tracking-wider inline-block ${row.typeColor}`}>
                            {row.type}
                          </span>
                        </td>

                        {/* Submitted By */}
                        <td className="py-3 px-3 text-xs font-semibold text-[#7A6F64]">
                          {row.submittedBy}
                        </td>

                        {/* Date */}
                        <td className="py-3 px-3 text-xs font-semibold text-[#A09485]">
                          {row.date}
                        </td>

                        {/* Review Action Button */}
                        <td className="py-3 pl-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (activeTab === "submissions") {
                                if (onNavigateTab) onNavigateTab("approvals");
                              } else {
                                if (onNavigateTab) onNavigateTab("feedback");
                              }
                            }}
                            className="bg-[#FF3B30] hover:bg-[#E02B20] text-white text-[10px] font-black uppercase px-3.5 py-1.5 rounded-md transition-all active:scale-95 cursor-pointer shadow-2xs"
                          >
                            REVIEW
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT PANEL: RECENT ACTIVITY */}
          <div className="lg:col-span-5 bg-white border border-[#EBE6DD] rounded-none p-5 shadow-2xs space-y-4">
            {/* Header without See All button */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-[#171717] uppercase tracking-wider font-titan">
                RECENT ACTIVITY
              </h3>
            </div>

            {/* Recent Activity List Items */}
            <div className="space-y-3.5 pt-1">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-[#7A6F64] py-4 text-center">No recent activity logged.</p>
              ) : (
                recentActivities.map((act) => (
                  <div key={act.id} className="flex items-center justify-between gap-3 p-1.5 hover:bg-[#FAF8F5] rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${act.iconBg}`}>
                        {act.icon}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-[#171717]">
                          {act.title}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#7A6F64]">
                          {act.subtitle}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-[#A09485] shrink-0">
                      {act.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* REVIEW ACTION POPUP MODAL (IF TRIGGERED LOCALLY) */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#EDE4D6] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDE4D6] pb-3">
              <h3 className="text-lg font-black tracking-tight text-[#171717] font-titan uppercase">
                Review Submission
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-[#7A6F64] hover:text-[#171717] text-xs font-bold px-2 py-1 bg-stone-100 rounded-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#EDE4D6]">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#EDE4D6]">
                <img src={selectedSubmission.image} alt={selectedSubmission.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#171717]">{selectedSubmission.title}</h4>
                <p className="text-xs text-[#7A6F64] font-medium">Submitted by {selectedSubmission.submittedBy}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 border border-[#EDE4D6] text-xs font-bold text-[#7A6F64] hover:bg-stone-50 uppercase rounded-lg cursor-pointer"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  if (onNavigateTab) onNavigateTab("approvals");
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} className="stroke-[3]" />
                <span>Go to Approvals</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export { DashboardPage };
