import { useState, useRef, useEffect } from "react";
import { BASE_URL } from "../../api/api";
import LocationMapPicker from "../common/LocationMapPicker";
import { AdminLoadingScreen } from "./AdminLoadingScreen.jsx";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Upload,
  Folder,
  X,
  ChevronsUpDown,
  Clock,
  Sparkles
} from "lucide-react";

/* ========================================================================= */
/*   INITIAL MOCK EVENTS DATA                                                */
/* ========================================================================= */

const INITIAL_EVENTS_DATA = [
  {
    id: "evt-1",
    title: "Emberfall Anime Expo 2025",
    subtitle: "The annual international anime & cosplay gathering.",
    category: "ANIME",
    categoryBadge: "bg-[#F5EADF] text-[#B87033]",
    format: "In-Person Convention",
    date: "Jul 18, 2025",
    time: "10:00 AM - 08:00 PM",
    location: "Tokyo Big Sight Expo Center",
    city: "Tokyo",
    latitude: 35.6298,
    longitude: 139.7942,
    attendees: 12400,
    status: "UPCOMING",
    statusBadge: "bg-[#DCFCE7] text-[#16A34A]",
    image: "/src/assets/images/emberfall_con_expo_1790285333899.jpg"
  },
  {
    id: "evt-2",
    title: "Starlight K-Pop Live Stage & Fanmeet",
    subtitle: "Global live stream screening and interactive Q&A.",
    category: "K-POP",
    categoryBadge: "bg-[#FCE7F3] text-[#C026D3]",
    format: "Virtual Watch Party",
    date: "Jun 24, 2025",
    time: "07:00 PM EST",
    location: "FanHub Live Stream Arena, Seoul",
    city: "Seoul",
    latitude: 37.5665,
    longitude: 126.9780,
    attendees: 8900,
    status: "UPCOMING",
    statusBadge: "bg-[#DCFCE7] text-[#16A34A]",
    image: "/src/assets/images/neon_beat_festival_1790282824470.jpg"
  },
  {
    id: "evt-3",
    title: "Cyberpunk Gaming Speedrun Championship",
    subtitle: "Pro gamers compete for the ultimate cyber trophy.",
    category: "GAMING",
    categoryBadge: "bg-[#E2E8F0] text-[#475569]",
    format: "Tournament",
    date: "May 30, 2025",
    time: "02:00 PM EST",
    location: "Twitch / Discord Arena, Los Angeles",
    city: "Los Angeles",
    latitude: 34.0522,
    longitude: -118.2437,
    attendees: 15300,
    status: "ONGOING",
    statusBadge: "bg-[#FEF3C7] text-[#D97706]",
    image: "/src/assets/images/starlight_expo_con_1790282403579.jpg"
  },
  {
    id: "evt-4",
    title: "Velvet Sky World Premiere Red Carpet",
    subtitle: "Exclusive premiere screening and voice cast interview.",
    category: "MOVIES",
    categoryBadge: "bg-[#DCEEFE] text-[#0284C7]",
    format: "Cinema Screening",
    date: "Apr 12, 2025",
    time: "06:00 PM PST",
    location: "Los Angeles Dolby Theatre",
    city: "Los Angeles",
    latitude: 34.1016,
    longitude: -118.3401,
    attendees: 3200,
    status: "COMPLETED",
    statusBadge: "bg-[#F1F5F9] text-[#64748B]",
    image: "/src/assets/images/velvet_sky_premiere_1790282805907.jpg"
  },
  {
    id: "evt-5",
    title: "Global Cosplay Crafting Workshop",
    subtitle: "Master armor crafting and wig styling with top cosplayers.",
    category: "COSPLAY",
    categoryBadge: "bg-[#FFE4E6] text-[#E11D48]",
    format: "Workshop / Panel",
    date: "Aug 05, 2025",
    time: "11:00 AM EST",
    location: "ExCeL London Exhibition Centre",
    city: "London",
    latitude: 51.5074,
    longitude: -0.1278,
    attendees: 1800,
    status: "DRAFT",
    statusBadge: "bg-[#F5EADF] text-[#B87033]",
    image: "/src/assets/images/cinema_screening_1790284828452.jpg"
  }
];

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

const ManageEventsPage = () => {
  const [events, setEvents] = useState(INITIAL_EVENTS_DATA);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "Anime",
    format: "In-Person Convention",
    date: "2025-08-10",
    time: "10:00 AM - 06:00 PM",
    location: "Tokyo Big Sight Expo Center",
    city: "Tokyo",
    latitude: 35.6298,
    longitude: 139.7942,
    attendees: 2500,
    status: "Upcoming",
    ticketLink: "",
    image: "/src/assets/images/starlight_expo_con_1790282403579.jpg"
  });

  const getCategoryBadgeStyle = (cat) => {
    switch ((cat || "").toUpperCase()) {
      case "ANIME":
        return "bg-[#F5EADF] text-[#B87033]";
      case "GAMING":
        return "bg-[#E2E8F0] text-[#475569]";
      case "MOVIES":
        return "bg-[#DCEEFE] text-[#0284C7]";
      case "TV SHOWS":
        return "bg-[#F3E8FF] text-[#9333EA]";
      case "K-POP":
        return "bg-[#FCE7F3] text-[#C026D3]";
      case "COMICS":
        return "bg-[#CCFBF1] text-[#0F766E]";
      case "MANGA":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "COSPLAY":
        return "bg-[#FFE4E6] text-[#E11D48]";
      default:
        return "bg-[#F1F5F9] text-[#475569]";
    }
  };

  const getEventStatusByDate = (dateVal, explicitStatus) => {
    if (explicitStatus && explicitStatus.toUpperCase() === "DRAFT") {
      return "DRAFT";
    }
    if (!dateVal) return explicitStatus || "UPCOMING";

    const eventDate = new Date(dateVal);
    if (isNaN(eventDate.getTime())) return explicitStatus || "UPCOMING";

    const today = new Date();
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const eventZero = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();

    if (eventZero > todayZero) {
      return "UPCOMING";
    } else if (eventZero === todayZero) {
      return "ONGOING";
    } else {
      return "COMPLETED";
    }
  };

  const getStatusBadgeStyle = (st) => {
    switch ((st || "").toUpperCase()) {
      case "UPCOMING":
        return "bg-[#DCFCE7] text-[#16A34A]";
      case "ONGOING":
        return "bg-[#FEF3C7] text-[#D97706]";
      case "COMPLETED":
        return "bg-[#F1F5F9] text-[#64748B]";
      case "DRAFT":
        return "bg-[#F5EADF] text-[#B87033]";
      default:
        return "bg-[#DCFCE7] text-[#16A34A]";
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await fetch(`${BASE_URL}/categories`);
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.categories && catData.categories.length > 0) {
            setCategories(catData.categories);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }

      try {
        const evtRes = await fetch(`${BASE_URL}/events`);
        if (evtRes.ok) {
          const evtData = await evtRes.json();
          if (evtData.events && evtData.events.length > 0) {
            const mapped = evtData.events.map((e) => {
              let displayDate = "";
              if (e.date) {
                const d = new Date(e.date);
                displayDate = !isNaN(d.getTime())
                  ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : e.date;
              }
              const catName = e.categoryId?.name || "Anime";
              const st = getEventStatusByDate(e.date, e.status);
              return {
                id: e._id,
                title: e.title,
                subtitle: e.subtitle || e.description || "",
                category: catName.toUpperCase(),
                categoryId: e.categoryId?._id || e.categoryId,
                categoryBadge: getCategoryBadgeStyle(catName),
                format: e.format || "In-Person Convention",
                date: displayDate,
                rawDate: e.date,
                time: e.time || "10:00 AM - 08:00 PM",
                location: e.location || e.city || "FanHub Arena",
                city: e.city || "",
                latitude: e.latitude || null,
                longitude: e.longitude || null,
                attendees: Number(e.attendees) || 0,
                status: st,
                statusBadge: getStatusBadgeStyle(st),
                ticketLink: e.ticketLink || "",
                image: e.imageUrl || "/src/assets/images/emberfall_con_expo_1790285333899.jpg"
              };
            });
            setEvents(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredEvents = events.filter((evt) => {
    const matchesCategory =
      selectedCategory === "All" ||
      evt.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus =
      selectedStatus === "All" ||
      evt.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalEvents = events.length;
  const upcomingCount = events.filter((e) => e.status === "UPCOMING").length;
  const ongoingCount = events.filter((e) => e.status === "ONGOING").length;
  const completedCount = events.filter((e) => e.status === "COMPLETED").length;

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setSelectedFile(null);
    setFormError("");

    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    setFormData({
      title: "",
      subtitle: "",
      category: categories[0]?.name || "Anime",
      format: "In-Person Convention",
      date: futureDate,
      time: "10:00",
      location: "",
      city: "",
      latitude: 35.6298,
      longitude: 139.7942,
      attendees: 2500,
      status: "Upcoming",
      ticketLink: "",
      image: "/src/assets/images/starlight_expo_con_1790282403579.jpg"
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (evt) => {
    setEditingEvent(evt);
    setSelectedFile(null);
    setFormError("");

    let formattedDate = "";
    if (evt.rawDate) {
      try {
        formattedDate = new Date(evt.rawDate).toISOString().split("T")[0];
      } catch {
        formattedDate = evt.date;
      }
    } else if (evt.date) {
      try {
        const d = new Date(evt.date);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().split("T")[0];
        } else {
          formattedDate = evt.date;
        }
      } catch {
        formattedDate = evt.date;
      }
    }

    let formattedTime = "10:00";
    if (evt.time) {
      const match = evt.time.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        let hrs = parseInt(match[1], 10);
        const mins = match[2];
        if (evt.time.toUpperCase().includes("PM") && hrs < 12) hrs += 12;
        if (evt.time.toUpperCase().includes("AM") && hrs === 12) hrs = 0;
        formattedTime = `${String(hrs).padStart(2, "0")}:${mins}`;
      } else {
        formattedTime = evt.time;
      }
    }

    const calculatedStatus = getEventStatusByDate(formattedDate || evt.rawDate || evt.date, evt.status);

    setFormData({
      title: evt.title,
      subtitle: evt.subtitle || "",
      category: evt.category.charAt(0).toUpperCase() + evt.category.slice(1).toLowerCase(),
      format: evt.format || "In-Person Convention",
      date: formattedDate || new Date().toISOString().split("T")[0],
      time: formattedTime,
      location: evt.location || "FanHub Arena",
      city: evt.city || "",
      latitude: evt.latitude || null,
      longitude: evt.longitude || null,
      attendees: evt.attendees || 2500,
      status:
        calculatedStatus === "UPCOMING"
          ? "Upcoming"
          : calculatedStatus === "ONGOING"
            ? "Ongoing"
            : calculatedStatus === "COMPLETED"
              ? "Completed"
              : "Draft",
      ticketLink: evt.ticketLink || "",
      image: evt.image || "/src/assets/images/starlight_expo_con_1790282403579.jpg"
    });
    setIsAddModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsSubmitting(true);
    setFormError("");

    try {
      const token = await getAdminToken();

      let matchedCat = categories.find(
        (c) => c.name?.toLowerCase() === (formData.category || "").toLowerCase() || c._id === formData.category
      );
      let categoryId = matchedCat ? matchedCat._id : (categories[0]?._id || "");

      const postData = new FormData();
      postData.append("title", formData.title.trim());
      postData.append("subtitle", formData.subtitle || "");
      postData.append("description", formData.subtitle || "");
      postData.append("format", formData.format || "In-Person Convention");
      postData.append("date", formData.date);
      postData.append("time", formData.time || "");
      postData.append("location", formData.location || "");
      postData.append("city", formData.city || formData.location || "");
      if (formData.latitude !== null && formData.latitude !== undefined && formData.latitude !== "") {
        postData.append("latitude", formData.latitude);
      }
      if (formData.longitude !== null && formData.longitude !== undefined && formData.longitude !== "") {
        postData.append("longitude", formData.longitude);
      }
      postData.append("attendees", formData.attendees || 0);
      postData.append("status", (formData.status || "UPCOMING").toUpperCase());
      if (categoryId) postData.append("categoryId", categoryId);
      postData.append("category", formData.category || "Anime");
      postData.append("ticketLink", formData.ticketLink || "");

      if (selectedFile) {
        postData.append("image", selectedFile);
      } else if (formData.image && !formData.image.startsWith("blob:")) {
        postData.append("imageUrl", formData.image);
      }

      const isEdit = Boolean(editingEvent && editingEvent.id && !editingEvent.id.startsWith("evt-"));
      const url = isEdit ? `${BASE_URL}/events/${editingEvent.id}` : `${BASE_URL}/events`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: postData
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || "Failed to save event");
        setIsSubmitting(false);
        return;
      }

      const saved = data.event;
      if (saved) {
        let displayDate = "";
        if (saved.date) {
          const d = new Date(saved.date);
          displayDate = !isNaN(d.getTime())
            ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : saved.date;
        }
        const catName = saved.categoryId?.name || formData.category || "Anime";
        const st = (saved.status || "UPCOMING").toUpperCase();

        const formatted = {
          id: saved._id,
          title: saved.title,
          subtitle: saved.subtitle || saved.description || "",
          category: catName.toUpperCase(),
          categoryId: saved.categoryId?._id || saved.categoryId,
          categoryBadge: getCategoryBadgeStyle(catName),
          format: saved.format || formData.format,
          date: displayDate || formData.date,
          rawDate: saved.date,
          time: saved.time || formData.time,
          location: saved.location || saved.city || formData.location,
          city: saved.city || formData.city,
          latitude: saved.latitude || formData.latitude,
          longitude: saved.longitude || formData.longitude,
          attendees: Number(saved.attendees) || Number(formData.attendees) || 0,
          status: st,
          statusBadge: getStatusBadgeStyle(st),
          ticketLink: saved.ticketLink || formData.ticketLink || "",
          image: saved.imageUrl || formData.image
        };

        if (editingEvent) {
          setEvents((prev) => prev.map((item) => (item.id === editingEvent.id ? formatted : item)));
        } else {
          setEvents((prev) => [formatted, ...prev]);
        }
      }

      setIsAddModalOpen(false);
      setEditingEvent(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("Error saving event:", err);
      setFormError("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;

    try {
      const token = await getAdminToken();
      if (!deletingEvent.id.startsWith("evt-")) {
        const res = await fetch(`${BASE_URL}/events/${deletingEvent.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const errData = await res.json();
          console.warn("Delete warning from server:", errData.message);
        }
      }
    } catch (err) {
      console.error("Error deleting event from server:", err);
    }

    setEvents((prev) => prev.filter((item) => item.id !== deletingEvent.id));
    setDeletingEvent(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: objectUrl
      }));
    }
  };

  if (loading) {
    return <AdminLoadingScreen type="table" />;
  }

  return (
    <div className="w-full bg-[#FFFDF7] min-h-screen text-[#231C14] font-baloo pb-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* 1. HEADER ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
              MANAGE EVENTS
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#7A6F64] mt-0.5">
              Create, edit, schedule, and manage fandom conventions, watch parties, and community live events.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-xs uppercase tracking-wider px-5 py-3 rounded-none shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Plus size={16} className="stroke-[3]" />
            <span>ADD EVENT</span>
          </button>
        </div>

        {/* 2. STAT CARDS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Card 1: Total Events */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FFF2ED] text-[#FF5F1F] flex items-center justify-center shrink-0">
              <Calendar size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">TOTAL EVENTS</p>
              <p className="text-xl font-black text-[#171717]">{totalEvents}</p>
            </div>
          </div>

          {/* Card 2: Upcoming */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <Sparkles size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">UPCOMING</p>
              <p className="text-xl font-black text-[#171717]">{upcomingCount}</p>
            </div>
          </div>

          {/* Card 3: Ongoing */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Clock size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">ONGOING LIVE</p>
              <p className="text-xl font-black text-[#171717]">{ongoingCount}</p>
            </div>
          </div>

          {/* Card 4: Completed */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-4 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
              <Users size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#7A6F64] uppercase tracking-wider">PAST / COMPLETED</p>
              <p className="text-xl font-black text-[#171717]">{completedCount}</p>
            </div>
          </div>
        </div>

        {/* 3. FILTERS ROW */}
        <div className="flex flex-wrap items-end gap-3.5 pt-1">
          {/* Category Dropdown */}
          <div className="flex flex-col gap-1 w-full sm:w-[200px]">
            <label className="text-[11px] font-bold text-[#7A6F64] uppercase tracking-wider pl-0.5">
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-none border border-[#EDE4D6] bg-white text-[#171717] appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer shadow-2xs pr-8"
              >
                <option value="All">All Categories</option>
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Anime">Anime</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Movies">Movies</option>
                    <option value="TV Shows">TV Shows</option>
                    <option value="K-Pop">K-Pop</option>
                    <option value="Comics">Comics</option>
                    <option value="Cosplay">Cosplay</option>
                  </>
                )}
              </select>
              <ChevronsUpDown size={14} className="absolute right-3 top-3 text-[#A09485] pointer-events-none" />
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 min-w-[260px] relative">
            <Search size={14} className="absolute left-3.5 top-3.5 text-[#A09485] pointer-events-none" />
            <input
              type="text"
              placeholder="Search events by title, location, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold pl-9 pr-4 py-2.5 rounded-none border border-[#EDE4D6] bg-white text-[#171717] placeholder:text-[#A09485] focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col gap-1 w-full sm:w-[200px]">
            <label className="text-[11px] font-bold text-[#7A6F64] uppercase tracking-wider pl-0.5">
              Status
            </label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-none border border-[#EDE4D6] bg-white text-[#171717] appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer shadow-2xs pr-8"
              >
                <option value="All">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>
              <ChevronsUpDown size={14} className="absolute right-3 top-3 text-[#A09485] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. EVENTS TABLE */}
        <div className="bg-white border border-[#EBE6DD] rounded-none overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-[#F0E8DD] bg-[#FAF8F5] text-[10px] font-black text-[#A09485] uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-20">COVER</th>
                  <th className="py-3.5 px-4">EVENT TITLE</th>
                  <th className="py-3.5 px-4">CATEGORY</th>
                  <th className="py-3.5 px-4">DATE &amp; TIME</th>
                  <th className="py-3.5 px-4">LOCATION</th>
                  <th className="py-3.5 px-4">ATTENDEES</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0E8DD]">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-xs font-bold text-[#7A6F64]">
                      No events found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-[#FAF8F5] transition-colors group">
                      {/* Cover */}
                      <td className="py-3.5 px-4">
                        <div className="w-14 h-10 rounded-none overflow-hidden border border-[#EBE6DD] bg-stone-900 shrink-0">
                          <img
                            src={evt.image}
                            alt={evt.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </td>

                      {/* Title & Format */}
                      <td className="py-3.5 px-4">
                        <div>
                          <h3 className="font-extrabold text-xs text-[#171717] group-hover:text-[#FF5F1F] transition-colors line-clamp-1">
                            {evt.title}
                          </h3>
                          <p className="text-[11px] font-semibold text-[#7A6F64] line-clamp-1 mt-0.5">
                            {evt.subtitle}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-none uppercase tracking-wider inline-block ${evt.categoryBadge}`}>
                          {evt.category}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#171717] flex items-center gap-1">
                            <Calendar size={12} className="text-[#FF5F1F]" />
                            <span>{evt.date}</span>
                          </span>
                          <span className="text-[11px] text-[#7A6F64] font-medium mt-0.5">
                            {evt.time}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold text-[#171717] flex items-center gap-1.5 line-clamp-1">
                          <MapPin size={13} className="text-[#7A6F64] shrink-0" />
                          <span>{evt.location}</span>
                        </span>
                      </td>

                      {/* Attendees */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-bold text-[#171717] flex items-center gap-1">
                          <Users size={13} className="text-[#A09485]" />
                          <span>{Number(evt.attendees || 0).toLocaleString()}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-none uppercase tracking-wider inline-block ${evt.statusBadge}`}>
                          {evt.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(evt)}
                            className="p-1.5 rounded-none border border-[#EDE4D6] bg-white hover:bg-[#F7F2EA] text-[#171717] transition-colors cursor-pointer shadow-2xs"
                            title="Edit Event"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingEvent(evt)}
                            className="p-1.5 rounded-none border border-[#EDE4D6] bg-white hover:bg-[#FFEBEB] text-[#E11D48] transition-colors cursor-pointer shadow-2xs"
                            title="Delete Event"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-[#F0E8DD] bg-[#FAF8F5] flex items-center justify-between">
            <span className="text-xs font-bold text-[#7A6F64]">
              Showing {filteredEvents.length} of {events.length} total events
            </span>
          </div>
        </div>

      </div>

      {/* ADD / EDIT EVENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-none border border-stone-200 max-w-2xl w-full shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 text-stone-900 font-sans">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-start justify-between bg-white">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-stone-900 stroke-[2.2] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-black font-titan uppercase tracking-tight text-stone-900 leading-none">
                    {editingEvent ? "EDIT EVENT" : "ADD NEW EVENT"}
                  </h3>
                  <p className="text-xs font-medium text-stone-500 mt-1">
                    Schedule and configure fandom convention, stream, or meetups.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">

              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Tokyo Anime Con 2025"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-none border border-stone-200 bg-[#FAF9F5] text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full text-xs font-bold px-3.5 py-2.5 rounded-none border border-stone-200 bg-[#FAF9F5] text-stone-900 appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer pr-9 shadow-2xs"
                    >
                      {categories.length > 0 ? (
                        categories.map((c) => (
                          <option key={c._id} value={c.name}>
                            {c.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Anime">Anime</option>
                          <option value="Gaming">Gaming</option>
                          <option value="Movies">Movies</option>
                          <option value="TV Shows">TV Shows</option>
                          <option value="K-Pop">K-Pop</option>
                          <option value="Comics">Comics</option>
                          <option value="Cosplay">Cosplay</option>
                        </>
                      )}
                    </select>
                    <ChevronsUpDown size={14} className="absolute right-3 top-3 text-stone-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      const calculatedStatus = getEventStatusByDate(newDate, formData.status);
                      const displayStatus =
                        calculatedStatus === "UPCOMING"
                          ? "Upcoming"
                          : calculatedStatus === "ONGOING"
                            ? "Ongoing"
                            : calculatedStatus === "DRAFT"
                              ? "Draft"
                              : "Completed";
                      setFormData({
                        ...formData,
                        date: newDate,
                        status: displayStatus
                      });
                    }}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-none border border-stone-200 bg-[#FAF9F5] text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-none border border-stone-200 bg-[#FAF9F5] text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs cursor-pointer"
                  />
                </div>
              </div>

              {/* Row 3: Format & Attendees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Event Format
                  </label>
                  <div className="relative">
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                      className="w-full text-xs font-bold px-3.5 py-2.5 rounded-none border border-stone-200 bg-[#FAF9F5] text-stone-900 appearance-none focus:outline-none focus:border-[#FF5F1F] cursor-pointer pr-9 shadow-2xs"
                    >
                      <option value="In-Person Convention">In-Person Convention</option>
                      <option value="Virtual Watch Party">Virtual Watch Party</option>
                      <option value="Tournament">Tournament</option>
                      <option value="Cinema Screening">Cinema Screening</option>
                      <option value="Workshop / Panel">Workshop / Panel</option>
                    </select>
                    <ChevronsUpDown size={14} className="absolute right-3 top-3 text-stone-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    Expected Attendees
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="E.g. 2500"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-none border border-stone-200 bg-[#FAF9F5] text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 3b: Ticket Link / URL */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  Ticket Link / URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://tickets.example.com/event"
                  value={formData.ticketLink || ""}
                  onChange={(e) => setFormData({ ...formData, ticketLink: e.target.value })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-none border border-stone-200 bg-[#FAF9F5] text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs"
                />
              </div>

              {/* Row 3c: Map Location Picker (Free Maps API) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">
                    Exact Location & Coordinates <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-semibold text-stone-500">
                    Search or click anywhere on the map to set exact coordinates
                  </span>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Venue or Address name (e.g. Tokyo Big Sight, Tokyo)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-none border border-stone-200 bg-[#FAF9F5] text-stone-900 focus:outline-none focus:border-[#FF5F1F] shadow-2xs mb-1"
                />

                <LocationMapPicker
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  locationName={formData.location}
                  onChange={({ latitude, longitude, location, city }) => {
                    setFormData((prev) => ({
                      ...prev,
                      latitude,
                      longitude,
                      location: location || prev.location,
                      city: city || prev.city || prev.location
                    }));
                  }}
                />
              </div>

              {/* Row 4: Subtitle / Summary */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  Event Subtitle / Overview <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Enter event details, guest highlights or schedule summary..."
                  className="w-full text-xs font-medium p-3 rounded-none border border-stone-200 bg-[#FAF9F5] text-stone-900 leading-relaxed focus:outline-none focus:border-[#FF5F1F] shadow-2xs resize-y"
                />
              </div>

              {/* Row 5: Cover Image */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  Event Cover Image
                </label>
                <div className="border-2 border-dashed border-stone-300 bg-[#FAF9F5] rounded-none p-4 flex flex-col items-center justify-center text-center space-y-3">
                  {formData.image && (
                    <div className="w-32 h-20 rounded-none overflow-hidden border border-stone-300 shadow-2xs">
                      <img src={formData.image} alt="Event Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-none shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Folder size={13} className="fill-black" />
                    <span>BROWSE COVER IMAGE</span>
                  </button>
                  {selectedFile && (
                    <span className="text-[11px] font-semibold text-emerald-600">
                      Selected: {selectedFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 6: Status */}
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1.5">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Upcoming", "Ongoing", "Completed", "Draft"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: st })}
                      className={`px-4 py-1.5 rounded-none text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${formData.status === st
                          ? "bg-[#171717] text-white shadow-xs"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 border border-red-200">
                  {formError}
                </p>
              )}

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2.5 border border-stone-300 bg-white hover:bg-stone-50 text-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-none cursor-pointer transition-colors shadow-2xs"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#FFCC00] hover:bg-[#F2C200] text-black font-black text-xs uppercase tracking-wider rounded-none cursor-pointer shadow-2xs transition-transform active:scale-95 disabled:opacity-60"
                >
                  {isSubmitting ? "SAVING..." : "SAVE EVENT"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none border border-[#EDE4D6] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-black text-[#171717] font-titan uppercase">
              Confirm Delete
            </h3>
            <p className="text-xs text-[#7A6F64] font-medium leading-relaxed">
              Are you sure you want to delete <strong className="text-[#171717]">"{deletingEvent.title}"</strong>? This action cannot be undone.
            </p>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingEvent(null)}
                className="px-4 py-2 border border-[#EDE4D6] text-xs font-bold text-[#7A6F64] hover:bg-stone-50 uppercase rounded-none cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs tracking-wider uppercase rounded-none cursor-pointer shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export { ManageEventsPage };
