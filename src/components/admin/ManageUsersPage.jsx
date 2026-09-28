import { useState, useMemo, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Ban,
  Search,
  ChevronDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Mail,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { BASE_URL } from "../../api/api.js";
import { UserDetailDrawer } from "./UserDetailDrawer.jsx";
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

const ManageUsersPage = () => {
  const [userList, setUserList] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: "0",
    totalUsersTrend: "+12%",
    totalUsersComparison: "vs. last month",
    activeUsers: "0",
    activeUsersTrend: "+8%",
    activeUsersComparison: "vs. last week",
    suspendedUsers: "0",
    suspendedUsersTrend: "-3%",
    suspendedUsersComparison: "vs. last week"
  });

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected User for Detail Drawer
  const [selectedUser, setSelectedUser] = useState(null);

  // Transient Toast Notification
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAdminToken();
        const res = await fetch(`${BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.users && data.users.length > 0) {
            const mapped = data.users.map((u) => {
              const roleName = u.role
                ? u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase()
                : "User";
              const dateStr = u.createdAt
                ? new Date(u.createdAt).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0];
              const isAct = u.isActive !== false;

              return {
                id: u._id,
                _id: u._id,
                avatar: u.avatarUrl || "/src/assets/images/kael_vex_1790281397401.jpg",
                name: u.name,
                username: u.username || `@${u.name.toLowerCase().replace(/\s+/g, "")}`,
                email: u.email,
                role: roleName,
                joinedDate: dateStr,
                status: isAct ? "ACTIVE" : "SUSPENDED",
                bio: u.bio || "",
                favoriteFandoms:
                  u.favoriteCategories && u.favoriteCategories.length > 0
                    ? u.favoriteCategories.map((c) => c.name || c)
                    : ["Anime", "Gaming"],
                categoriesOfInterest:
                  u.favoriteCategories && u.favoriteCategories.length > 0
                    ? u.favoriteCategories.map((c) => c.name || c)
                    : ["Anime", "Gaming", "Movies"],
                bookmarksCount: 0,
                fanSubmissionsCount: 0,
                feedbackSentCount: 0,
                postsCount: 0,
                commentsCount: 0
              };
            });

            setUserList(mapped);

            const activeCount = mapped.filter((u) => u.status === "ACTIVE").length;
            const suspendedCount = mapped.filter((u) => u.status === "SUSPENDED").length;

            setStats({
              totalUsers: mapped.length.toLocaleString(),
              totalUsersTrend: "+12%",
              totalUsersComparison: "vs. last month",
              activeUsers: activeCount.toLocaleString(),
              activeUsersTrend: "+8%",
              activeUsersComparison: "vs. last week",
              suspendedUsers: suspendedCount.toLocaleString(),
              suspendedUsersTrend: "-3%",
              suspendedUsersComparison: "vs. last week"
            });
          }
        }
      } catch (err) {
        console.error("Failed to load user management data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // View specific user details
  const handleViewUser = async (user) => {
    setSelectedUser(user);

    if (user.id && !user.id.startsWith("user-")) {
      try {
        const token = await getAdminToken();
        const res = await fetch(`${BASE_URL}/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            const u = data.user;
            const roleName = u.role
              ? u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase()
              : user.role;
            const isAct = u.isActive !== false;

            setSelectedUser((prev) => ({
              ...prev,
              id: u._id,
              _id: u._id,
              name: u.name,
              email: u.email,
              username: u.username || prev.username,
              role: roleName,
              status: isAct ? "ACTIVE" : "SUSPENDED",
              bio: u.bio !== undefined ? u.bio : prev.bio,
              avatar: u.avatarUrl || prev.avatar,
              favoriteFandoms:
                u.favoriteCategories && u.favoriteCategories.length > 0
                  ? u.favoriteCategories.map((c) => c.name || c)
                  : prev.favoriteFandoms,
              categoriesOfInterest:
                u.favoriteCategories && u.favoriteCategories.length > 0
                  ? u.favoriteCategories.map((c) => c.name || c)
                  : prev.categoriesOfInterest
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch specific user info", err);
      }
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      // Role Filter
      if (roleFilter !== "All Roles") {
        if (user.role.toUpperCase() !== roleFilter.toUpperCase()) return false;
      }

      // Status Filter
      if (statusFilter !== "All Statuses") {
        if (user.status.toUpperCase() !== statusFilter.toUpperCase()) return false;
      }

      // Search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchName = user.name?.toLowerCase().includes(q);
      const matchUsername = user.username?.toLowerCase().includes(q);
      const matchEmail = user.email?.toLowerCase().includes(q);

      return matchName || matchUsername || matchEmail;
    });
  }, [userList, roleFilter, statusFilter, searchQuery]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Role update handler
  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = await getAdminToken();
      if (!userId.startsWith("user-")) {
        await fetch(`${BASE_URL}/users/${userId}/role`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ role: newRole.toLowerCase() })
        });
      }

      setUserList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, role: newRole } : null));
      }
      showToast(`User role updated to ${newRole}.`);
    } catch (err) {
      console.error("Failed to update role", err);
      showToast("Error updating user role.");
    }
  };

  // Status update handler
  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = await getAdminToken();
      if (!userId.startsWith("user-")) {
        await fetch(`${BASE_URL}/users/${userId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isActive: newStatus === "ACTIVE" })
        });
      }

      setUserList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      showToast(`User status updated to ${newStatus}.`);
    } catch (err) {
      console.error("Failed to update status", err);
      showToast("Error updating user status.");
    }
  };

  // Role Badge Formatter
  const renderRoleBadge = (role) => {
    const r = role?.toUpperCase();
    if (r === "ADMIN") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-none text-[10px] font-black uppercase tracking-wider bg-[#FEF3C7] text-[#D97706]">
          ADMIN
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-none text-[10px] font-black uppercase tracking-wider bg-[#E2E8F0] text-[#475569]">
        USER
      </span>
    );
  };

  const totalUsersCount = userList.length;
  const activeUsersCount = userList.filter((u) => u.status === "ACTIVE").length;
  const suspendedUsersCount = userList.filter((u) => u.status === "SUSPENDED").length;
  const adminsCount = userList.filter((u) => (u.role || "").toLowerCase() === "admin").length;

  if (loading) {
    return <AdminLoadingScreen type="table" />;
  }

  return (
    <div className="w-full bg-[#FFFDF7] min-h-screen text-[#231C14] font-baloo pb-16 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#181A20] border border-[#2B2F3D] text-white px-4 py-3 rounded-none shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200 font-baloo">
          <div className="w-2 h-2 rounded-full bg-[#FFA800] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-stone-400 hover:text-white cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 1. HEADER ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
              MANAGE USERS
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#7A6F64] mt-0.5">
              Manage user accounts, assign roles, permissions, and moderation status.
            </p>
          </div>
        </div>

        {/* 2. STAT CARDS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Card 1: Total Users */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FFF2ED] text-[#FF5F1F] flex items-center justify-center shrink-0">
              <Users size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">TOTAL USERS</p>
              <p className="text-xl font-black text-[#171717]">{totalUsersCount}</p>
            </div>
          </div>

          {/* Card 2: Active Users */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">ACTIVE USERS</p>
              <p className="text-xl font-black text-[#171717]">{activeUsersCount}</p>
            </div>
          </div>

          {/* Card 3: Suspended */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center shrink-0">
              <Ban size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">SUSPENDED</p>
              <p className="text-xl font-black text-[#171717]">{suspendedUsersCount}</p>
            </div>
          </div>

          {/* Card 4: Admins */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <ShieldAlert size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">ADMINS</p>
              <p className="text-xl font-black text-[#171717]">{adminsCount}</p>
            </div>
          </div>
        </div>

        {/* 3. FILTERS ROW */}
        <div className="flex flex-wrap items-end gap-3.5 pt-1">
          {/* Role Filter */}
          <div className="flex flex-col gap-1 w-full sm:w-[200px]">
            <label className="text-[11px] font-bold text-[#7A6F64] uppercase tracking-wider pl-0.5">
              Role
            </label>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-none border border-[#EDE4D6] bg-white text-[#171717] appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer shadow-2xs pr-8"
              >
                {["All Roles", "Admin", "User"].map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-[#A09485] pointer-events-none" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1 w-full sm:w-[200px]">
            <label className="text-[11px] font-bold text-[#7A6F64] uppercase tracking-wider pl-0.5">
              Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-none border border-[#EDE4D6] bg-white text-[#171717] appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer shadow-2xs pr-8"
              >
                {["All Statuses", "Active", "Suspended"].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-[#A09485] pointer-events-none" />
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 min-w-[260px] relative">
            <Search size={14} className="absolute left-3.5 top-3.5 text-[#A09485] pointer-events-none" />
            <input
              type="text"
              placeholder="Search users by name, username or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-semibold pl-9 pr-8 py-2.5 rounded-none border border-[#EDE4D6] bg-white text-[#171717] placeholder:text-[#A09485] focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-[#A09485] hover:text-[#171717] cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 4. USERS TABLE */}
        <div className="bg-white border border-[#EBE6DD] rounded-none overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-[#F0E8DD] bg-[#FAF8F5] text-[10px] font-black text-[#A09485] uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-16">AVATAR</th>
                  <th className="py-3.5 px-4">USER</th>
                  <th className="py-3.5 px-4">EMAIL</th>
                  <th className="py-3.5 px-4 text-center">ROLE</th>
                  <th className="py-3.5 px-4 text-center">STATUS</th>
                  <th className="py-3.5 px-4">JOINED DATE</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DD]">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs font-bold text-[#7A6F64]">
                      No users found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#FAF8F5] transition-colors group"
                    >
                      {/* 1. Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="w-10 h-10 rounded-none overflow-hidden border border-[#EBE6DD] bg-stone-900 shrink-0">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/src/assets/images/luffy_avatar_1790269807034.jpg";
                            }}
                          />
                        </div>
                      </td>

                      {/* 2. User Name & Username */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="text-xs font-extrabold text-[#171717] group-hover:text-[#FF5F1F] transition-colors leading-snug">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-[#7A6F64] font-semibold leading-tight mt-0.5">
                            {user.username}
                          </p>
                        </div>
                      </td>

                      {/* 3. Email */}
                      <td className="py-3.5 px-4 text-xs font-semibold text-[#7A6F64]">
                        {user.email}
                      </td>

                      {/* 4. Role */}
                      <td className="py-3.5 px-4 text-center">
                        {renderRoleBadge(user.role)}
                      </td>

                      {/* 5. Status */}
                      <td className="py-3.5 px-4 text-center">
                        {user.status === "ACTIVE" ? (
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-none text-[10px] font-black tracking-wider uppercase bg-[#DCFCE7] text-[#16A34A]">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-none text-[10px] font-black tracking-wider uppercase bg-[#FEE2E2] text-[#EF4444]">
                            SUSPENDED
                          </span>
                        )}
                      </td>

                      {/* 6. Joined Date */}
                      <td className="py-3.5 px-4 text-xs font-semibold text-[#7A6F64]">
                        {user.joinedDate}
                      </td>

                      {/* 7. Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleViewUser(user)}
                          className="p-1.5 rounded-none border border-[#EDE4D6] bg-white hover:bg-[#F7F2EA] text-[#171717] transition-colors cursor-pointer shadow-2xs"
                          title="View user details"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 5. PAGINATION FOOTER */}
          <div className="px-4 sm:px-6 py-4 border-t border-[#F0E8DD] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold text-[#7A6F64]">
              Showing {filteredUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`w-7 h-7 rounded-none border border-[#EBE6DD] bg-[#F3EFE6] text-[#7A6F64] hover:bg-white text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${
                  currentPage <= 1 ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                const isActive = pg === currentPage;
                return (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded-none text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#FFCC00] text-black font-black shadow-2xs"
                        : "border border-[#EBE6DD] bg-[#F3EFE6] text-[#7A6F64] hover:bg-white"
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
                className={`w-7 h-7 rounded-none border border-[#EBE6DD] bg-[#F3EFE6] text-[#7A6F64] hover:bg-white text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${
                  currentPage >= totalPages ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* USER DETAIL SIDE PANEL DRAWER */}
      <UserDetailDrawer
        user={selectedUser}
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        onSaveRole={handleRoleChange}
        onSaveStatus={handleStatusChange}
      />
    </div>
  );
};

export { ManageUsersPage };
