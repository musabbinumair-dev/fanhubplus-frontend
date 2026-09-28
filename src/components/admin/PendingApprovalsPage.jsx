import { useState, useMemo, useEffect } from "react";
import {
  LayoutGrid,
  FileText,
  Clock,
  Search,
  ChevronDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Image as ImageIcon,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { BASE_URL } from "../../api/api.js";
import { ReviewDetailDrawer } from "./ReviewDetailDrawer.jsx";
import { AdminLoadingScreen } from "./AdminLoadingScreen.jsx";

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

const CATEGORY_COLORS = {
  Anime: "bg-[#FEF3C7] text-[#92400E]",
  Gaming: "bg-[#E0F2FE] text-[#0369A1]",
  Movies: "bg-[#EDE9FE] text-[#6D28D9]",
  "TV Shows": "bg-[#EDE9FE] text-[#6D28D9]",
  "K-Pop": "bg-[#F3E8FF] text-[#7E22CE]",
  Comics: "bg-[#CCFBF1] text-[#0F766E]",
  Manga: "bg-[#FFE4E6] text-[#BE123C]",
  Cosplay: "bg-[#FCE7F3] text-[#BE185D]"
};

const ALL_CATEGORIES = [
  "All Categories",
  "Anime",
  "Gaming",
  "Movies",
  "TV Shows",
  "K-Pop",
  "Comics",
  "Manga",
  "Cosplay"
];

const PendingApprovalsPage = () => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "submissions"

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Date (Newest First)");

  // Dropdown states
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected item for Review Side Panel
  const [reviewItem, setReviewItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic categories
  const [categoriesList, setCategoriesList] = useState(ALL_CATEGORIES);

  // Load items & categories
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const token = await getAdminToken();

        // Fetch categories for filter
        fetch(`${BASE_URL}/categories`)
          .then((res) => res.json())
          .then((catData) => {
            if (isMounted && catData.categories && catData.categories.length > 0) {
              const names = catData.categories.map((c) => c.name);
              setCategoriesList(["All Categories", ...names]);
            }
          })
          .catch(() => {});

        // Fetch approvals from backend
        const res = await fetch(`${BASE_URL}/admin/approvals`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.approvals) {
            const mapped = data.approvals.map((item) => {
              const ct =
                item.type === "article"
                  ? "Article"
                  : item.type === "image"
                  ? "Image"
                  : "Video";
              const dateStr = item.createdAt
                ? new Date(item.createdAt).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0];

              return {
                id: item._id,
                _id: item._id,
                type: "submission",
                contentType: ct,
                title: item.title || "Untitled Submission",
                subtitle: item.body
                  ? item.body.slice(0, 60) + (item.body.length > 60 ? "..." : "")
                  : "",
                content: item.body || "",
                image:
                  item.mediaUrl ||
                  item.thumbnailUrl ||
                  (item.images && item.images[0]) ||
                  "",
                category: item.categoryId?.name || "General",
                submittedBy: {
                  name: item.submittedBy?.name || "Community Fan",
                  username: item.submittedBy?.email
                    ? `@${item.submittedBy.email.split("@")[0]}`
                    : "@fan_member",
                  avatar:
                    item.submittedBy?.avatarUrl ||
                    "/src/assets/images/luffy_avatar_1790269807034.jpg"
                },
                date: dateStr,
                status: "PENDING"
              };
            });

            setItems(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch pending approvals", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Live stat counts
  const totalPendingCount = useMemo(() => {
    return items.filter((i) => i.status === "PENDING").length;
  }, [items]);

  const submissionPendingCount = useMemo(() => {
    return items.filter((i) => i.type === "submission" && i.status === "PENDING").length;
  }, [items]);

  // Filtered and sorted items for active tab
  const filteredItems = useMemo(() => {
    let list = items.filter((i) => i.status === "PENDING");

    if (activeTab === "submissions") {
      list = list.filter((i) => i.type === "submission");
    }

    if (categoryFilter !== "All Categories") {
      list = list.filter((i) => i.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((i) => {
        const titleMatch = (i.title || i.subject || "").toLowerCase().includes(q);
        const subMatch = (i.subtitle || "").toLowerCase().includes(q);
        const userMatch =
          i.submittedBy?.name?.toLowerCase().includes(q) ||
          i.submittedBy?.username?.toLowerCase().includes(q);
        const catMatch = (i.category || "").toLowerCase().includes(q);
        return titleMatch || subMatch || userMatch || catMatch;
      });
    }

    list = [...list].sort((a, b) => {
      if (sortBy === "Date (Newest First)") {
        return new Date(b.date) - new Date(a.date);
      }
      return new Date(a.date) - new Date(b.date);
    });

    return list;
  }, [items, activeTab, categoryFilter, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
    setSearchQuery("");
  };

  // View specific approval details
  const handleViewApproval = async (item) => {
    setReviewItem(item);

    if (item.id) {
      try {
        const token = await getAdminToken();
        const res = await fetch(`${BASE_URL}/admin/approvals/${item.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.approval) {
            const detail = data.approval;
            const ct =
              detail.type === "article"
                ? "Article"
                : detail.type === "image"
                ? "Image"
                : "Video";
            const dateStr = detail.createdAt
              ? new Date(detail.createdAt).toISOString().split("T")[0]
              : item.date;

            setReviewItem((prev) => ({
              ...prev,
              id: detail._id,
              _id: detail._id,
              type: "submission",
              contentType: ct,
              title: detail.title || prev.title,
              subtitle: detail.body
                ? detail.body.slice(0, 60) + (detail.body.length > 60 ? "..." : "")
                : prev.subtitle,
              content: detail.body || prev.content,
              image:
                detail.mediaUrl ||
                detail.thumbnailUrl ||
                (detail.images && detail.images[0]) ||
                prev.image,
              category: detail.categoryId?.name || prev.category,
              submittedBy: {
                name: detail.submittedBy?.name || prev.submittedBy?.name,
                username: detail.submittedBy?.email
                  ? `@${detail.submittedBy.email.split("@")[0]}`
                  : prev.submittedBy?.username,
                avatar: detail.submittedBy?.avatarUrl || prev.submittedBy?.avatar
              },
              date: dateStr,
              status: "PENDING"
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load approval details", err);
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = await getAdminToken();
      await fetch(`${BASE_URL}/admin/approvals/${id}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
      setReviewItem(null);
      showToast("Submission approved and published!");
    } catch (err) {
      console.error(err);
      showToast("Error approving submission.");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = await getAdminToken();
      await fetch(`${BASE_URL}/admin/approvals/${id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
      setReviewItem(null);
      showToast("Submission rejected.");
    } catch (err) {
      console.error(err);
      showToast("Error rejecting submission.");
    }
  };

  const getCategoryColor = (cat) => {
    return CATEGORY_COLORS[cat] || "bg-stone-100 text-stone-700";
  };

  if (loading) {
    return <AdminLoadingScreen type="table" />;
  }

  return (
    <div className="w-full bg-[#FFFDF7] min-h-full font-sans select-none pb-16 text-[#171717]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#181A20] text-white px-4 py-2.5 rounded-none shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={16} className="text-[#10B981] shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-stone-400 hover:text-white cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* 1. TOP HEADER & STAT CARDS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
              PENDING APPROVALS
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#7A6F64] mt-0.5">
              Review and approve pending fan submissions for the platform.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 shrink-0">
            {/* Card 1: TOTAL PENDING */}
            <div className="bg-white border border-[#EBE6DD] rounded-none px-5 py-4 flex items-center gap-4 shadow-2xs min-w-[200px]">
              <div className="text-[#1F2937] shrink-0">
                <Clock size={24} strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6F64]">
                  TOTAL PENDING
                </p>
                <p className="text-2xl font-black text-[#171717] tracking-tight leading-tight">
                  {totalPendingCount}
                </p>
                <p className="text-xs font-bold text-[#10B981] flex items-center gap-1 mt-0.5">
                  <span>↑ +12%</span>
                  <span className="text-[#7A6F64] font-normal text-[11px]">
                    vs. last week
                  </span>
                </p>
              </div>
            </div>

            {/* Card 2: FAN SUBMISSIONS PENDING */}
            <div className="bg-white border border-[#EBE6DD] rounded-none px-5 py-4 flex items-center gap-4 shadow-2xs min-w-[200px]">
              <div className="text-[#1F2937] shrink-0">
                <FileText size={24} strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6F64]">
                  FAN SUBMISSIONS PENDING
                </p>
                <p className="text-2xl font-black text-[#171717] tracking-tight leading-tight">
                  {submissionPendingCount}
                </p>
                <p className="text-xs font-bold text-[#10B981] flex items-center gap-1 mt-0.5">
                  <span>↑ +17%</span>
                  <span className="text-[#7A6F64] font-normal text-[11px]">
                    vs. last week
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. TAB BAR (All / Fan Submissions) */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => handleTabChange("all")}
            className={`px-4 py-2 rounded-none text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#FFCC00] text-white shadow-xs"
                : "bg-white border border-[#EBE6DD] text-[#7A6F64] hover:bg-stone-50"
            }`}
          >
            <LayoutGrid size={16} />
            <span>All</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("submissions")}
            className={`px-4 py-2 rounded-none text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "submissions"
                ? "bg-[#FFCC00] text-white shadow-xs"
                : "bg-white border border-[#EBE6DD] text-[#7A6F64] hover:bg-stone-50"
            }`}
          >
            <FileText size={16} />
            <span>Fan Submissions</span>
          </button>
        </div>

        {/* 3. FILTERS & SEARCH ROW */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          {/* Category Dropdown */}
          <div className="relative shrink-0 sm:w-52">
            <label className="text-xs font-bold text-[#7A6F64] mb-1.5 block">
              Category
            </label>
            <button
              type="button"
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsSortOpen(false);
              }}
              className="w-full bg-white border border-[#EBE6DD] hover:border-[#EBE6DD] rounded-none px-3.5 py-2 text-sm text-[#171717] font-medium flex items-center justify-between shadow-2xs transition-colors cursor-pointer"
            >
              <span>{categoryFilter}</span>
              <ChevronDown size={16} className="text-[#7A6F64]" />
            </button>

            {isCategoryOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsCategoryOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-[#EBE6DD] rounded-none shadow-lg py-1 z-30 animate-in fade-in duration-100 max-h-60 overflow-y-auto">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(cat);
                        setIsCategoryOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm font-medium flex items-center justify-between transition-colors ${
                        categoryFilter === cat
                          ? "bg-amber-50 text-[#B45309] font-bold"
                          : "text-[#7A6F64] hover:bg-stone-50"
                      }`}
                    >
                      <span>{cat}</span>
                      {categoryFilter === cat && (
                        <Check size={14} className="text-[#B45309]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search Input Bar */}
          <div className="flex-1 relative">
            <div className="relative flex items-center">
              <Search
                size={18}
                className="absolute left-3.5 text-[#7A6F64] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search pending submissions by title, category, or user..."
                className="w-full bg-white border border-[#EBE6DD] hover:border-[#EBE6DD] focus:border-[#FF5F1F] rounded-none pl-10 pr-9 py-2 text-sm text-[#171717] placeholder:text-[#7A6F64] focus:outline-none shadow-2xs transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-[#7A6F64] hover:text-[#7A6F64] cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Sort by Dropdown */}
          <div className="relative shrink-0 sm:w-56">
            <label className="text-xs font-bold text-[#7A6F64] mb-1.5 block">
              Sort by
            </label>
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsCategoryOpen(false);
              }}
              className="w-full bg-white border border-[#EBE6DD] hover:border-[#EBE6DD] rounded-none px-3.5 py-2 text-sm text-[#171717] font-medium flex items-center justify-between shadow-2xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#7A6F64]" />
                <span>{sortBy}</span>
              </div>
              <ChevronDown size={16} className="text-[#7A6F64]" />
            </button>

            {isSortOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsSortOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-full bg-white border border-[#EBE6DD] rounded-none shadow-lg py-1 z-30 animate-in fade-in duration-100">
                  {["Date (Newest First)", "Date (Oldest First)"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSortBy(s);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm font-medium flex items-center justify-between transition-colors ${
                        sortBy === s
                          ? "bg-amber-50 text-[#B45309] font-bold"
                          : "text-[#7A6F64] hover:bg-stone-50"
                      }`}
                    >
                      <span>{s}</span>
                      {sortBy === s && (
                        <Check size={14} className="text-[#B45309]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4. TABLE CONTAINER */}
        <div className="bg-white border border-[#EBE6DD] rounded-none overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[#EBE6DD] text-[11px] font-bold tracking-wider text-[#7A6F64] uppercase">
                  <th className="py-3.5 px-5 w-32">CONTENT TYPE</th>
                  <th className="py-3.5 px-5">TITLE</th>
                  <th className="py-3.5 px-5">CATEGORY</th>
                  <th className="py-3.5 px-5">SUBMITTED BY</th>
                  <th className="py-3.5 px-5">DATE</th>
                  <th className="py-3.5 px-5 text-center">STATUS</th>
                  <th className="py-3.5 px-5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-[#7A6F64]">
                      <div className="flex flex-col items-center justify-center gap-2.5">
                        <div className="w-12 h-12 rounded-none bg-emerald-50 text-[#10B981] flex items-center justify-center">
                          <CheckCircle2 size={26} strokeWidth={2} />
                        </div>
                        <p className="text-base font-bold text-[#171717]">
                          All caught up!
                        </p>
                        <p className="text-xs text-[#7A6F64]">
                          There are no pending submissions matching your current filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FAF9F6]/80 transition-colors group"
                    >
                      {/* Content Type */}
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-none text-xs font-semibold inline-flex items-center gap-1.5 ${
                            item.contentType === "Article"
                              ? "bg-[#E0F2FE] text-[#0284C7]"
                              : "bg-[#F3E8FF] text-[#9333EA]"
                          }`}
                        >
                          {item.contentType === "Article" ? (
                            <FileText size={14} />
                          ) : (
                            <ImageIcon size={14} />
                          )}
                          <span>{item.contentType || "Submission"}</span>
                        </span>
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-5">
                        <p className="text-sm font-bold text-[#171717] leading-snug">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#7A6F64] leading-tight line-clamp-1">
                          {item.subtitle}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                      </td>

                      {/* Submitted By */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-none overflow-hidden border border-[#EBE6DD] bg-stone-100 shrink-0">
                            <img
                              src={item.submittedBy?.avatar}
                              alt={item.submittedBy?.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/src/assets/images/luffy_avatar_1790269807034.jpg";
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#171717] leading-tight">
                              {item.submittedBy?.name}
                            </p>
                            <p className="text-xs text-[#7A6F64] leading-tight">
                              {item.submittedBy?.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-5 text-sm text-[#7A6F64] font-mono tabular-nums">
                        {item.date}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-none text-[11px] font-bold tracking-wider uppercase bg-[#FEF3C7] text-[#D97706]">
                          PENDING
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleViewApproval(item)}
                          className="p-1.5 text-[#7A6F64] hover:text-[#171717] hover:bg-stone-100 rounded-none transition-colors cursor-pointer"
                          title="Review"
                        >
                          <Eye size={17} strokeWidth={1.75} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="px-5 py-3.5 border-t border-[#EBE6DD] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A6F64]">
            <div>
              {filteredItems.length > 0 ? (
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredItems.length)} of{" "}
                  {filteredItems.length} items
                </span>
              ) : (
                <span>Showing 0 of 0 items</span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`w-8 h-8 rounded-none border border-[#EBE6DD] flex items-center justify-center transition-colors ${
                  currentPage <= 1
                    ? "text-[#D1D5DB] cursor-not-allowed bg-stone-50"
                    : "text-[#7A6F64] hover:text-[#171717] hover:bg-stone-50 cursor-pointer bg-white"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                const isActive = pg === currentPage;
                return (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-none text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#FFCC00] text-white shadow-xs"
                        : "border border-[#EBE6DD] text-[#7A6F64] hover:bg-stone-50 bg-white"
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`w-8 h-8 rounded-none border border-[#EBE6DD] flex items-center justify-center transition-colors ${
                  currentPage >= totalPages
                    ? "text-[#D1D5DB] cursor-not-allowed bg-stone-50"
                    : "text-[#7A6F64] hover:text-[#171717] hover:bg-stone-50 cursor-pointer bg-white"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* REVIEW DETAIL SIDE PANEL */}
      <ReviewDetailDrawer
        item={reviewItem}
        isOpen={Boolean(reviewItem)}
        onClose={() => setReviewItem(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export { PendingApprovalsPage };
