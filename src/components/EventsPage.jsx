import { useState, useEffect } from "react";
import {
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  Navigation,
  Ticket,
  ChevronLeft,
  Plus,
  Minus,
  X,
  Check,
  Users,
  Tv,
  Search,
  Loader2,
  ExternalLink,
  Clock
} from "lucide-react";
import { BASE_URL } from "../api/api";
import EventLocationMap from "./common/EventLocationMap";

const EVENT_FORMAT_FILTERS = [
  "All",
  "Convention",
  "Cosplay Meetup",
  "Screening",
  "Online"
];

// Approximate city coordinates for GPS distance calculation and map pin rendering
const CITY_COORDS = {
  karachi: { lat: 24.8607, lng: 67.0011, x: 65, y: 35 },
  lahore: { lat: 31.5204, lng: 74.3587, x: 72, y: 30 },
  islamabad: { lat: 33.6844, lng: 73.0479, x: 70, y: 24 },
  tokyo: { lat: 35.6762, lng: 139.6503, x: 82, y: 40 },
  seoul: { lat: 37.5665, lng: 126.978, x: 78, y: 38 },
  london: { lat: 51.5074, lng: -0.1278, x: 30, y: 32 },
  "los angeles": { lat: 34.0522, lng: -118.2437, x: 20, y: 45 },
  "new york": { lat: 40.7128, lng: -74.006, x: 28, y: 42 }
};

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

const getEventImage = (event) => {
  if (event.imageUrl && event.imageUrl.trim()) return event.imageUrl;
  if (event.images && event.images.length > 0 && event.images[0]) return event.images[0];
  return "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80";
};

const getEventTypeStyle = (format) => {
  const f = (format || "").toLowerCase();
  if (f.includes("meetup") || f.includes("cosplay")) return "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]";
  if (f.includes("screening") || f.includes("movie") || f.includes("cinema")) return "bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]";
  if (f.includes("online") || f.includes("stream")) return "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]";
  return "bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]";
};

const formatEventDate = (dateStr) => {
  if (!dateStr) return { day: 15, month: "May", year: 2025, full: "May 15, 2025" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { day: 15, month: "May", year: 2025, full: dateStr };
  return {
    day: d.getDate(),
    month: d.toLocaleDateString("en-US", { month: "short" }),
    year: d.getFullYear(),
    full: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  };
};

const EventsPage = ({
  onNavigateHome,
  onNavigateSubmit,
  isLoggedIn = true,
  onOpenAuth,
  onRequireLogin
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [userCoords, setUserCoords] = useState(null);
  const [activePopupEvent, setActivePopupEvent] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapMode, setMapMode] = useState("map");

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const [ticketModalEvent, setTicketModalEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Auto-detect GPS location on mount if available
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: parseFloat(pos.coords.latitude.toFixed(6)),
            lng: parseFloat(pos.coords.longitude.toFixed(6))
          });
        },
        () => {
          // ignore or fallback
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/events`);
        if (res.ok) {
          const data = await res.json();
          const list = data.events || [];
          setEvents(list);
          if (list.length > 0) {
            setActivePopupEvent(list[0]);
          }
        } else {
          setEvents([]);
        }
      } catch (err) {
        setEvents([]);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  // Extract unique cities from events
  const dynamicCities = [
    "All Cities",
    ...Array.from(new Set(events.map((e) => e.city).filter(Boolean)))
  ];

  // GPS Location handler
  const handleUseLocation = () => {
    if ("geolocation" in navigator) {
      setToastMessage("Detecting your GPS location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          setToastMessage(`Location updated (GPS: ${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
          setTimeout(() => setToastMessage(null), 3000);
        },
        () => {
          setUserCoords({ lat: 24.8607, lng: 67.0011 });
          setToastMessage("Using default location to sort nearby events");
          setTimeout(() => setToastMessage(null), 3000);
        }
      );
    } else {
      setToastMessage("Geolocation is not supported by your browser");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleGetTickets = (event) => {
    if (event.ticketLink && event.ticketLink.trim()) {
      const url = event.ticketLink.startsWith("http") ? event.ticketLink.trim() : `https://${event.ticketLink.trim()}`;
      window.open(url, "_blank");
      return;
    }
    setTicketModalEvent(event);
    setTicketQuantity(1);
    setTicketSuccess(false);
  };

  const handleSubmitFanContentClick = () => {
    if (!isLoggedIn) {
      if (onRequireLogin) {
        onRequireLogin("This feature requires login");
      } else {
        setToastMessage("Login required to submit fan content");
        setTimeout(() => setToastMessage(null), 2500);
      }
      return;
    }
    if (onNavigateSubmit) {
      onNavigateSubmit();
    }
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesCity =
      selectedCity === "All Cities" ||
      (event.city && event.city.toLowerCase() === selectedCity.toLowerCase());

    const eventFormat = event.format || "Convention";
    const matchesType =
      selectedType === "All" ||
      eventFormat.toLowerCase().includes(selectedType.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesType && matchesSearch;
  });

  // Calculate distance & sort if userCoords available
  const sortedEvents = [...filteredEvents].map((event, idx) => {
    const cityKey = (event.city || "karachi").toLowerCase();
    const cityData = CITY_COORDS[cityKey] || { lat: 24.8607 + idx * 0.05, lng: 67.0011 + idx * 0.05, x: 60 + (idx % 3) * 10, y: 30 + (idx % 2) * 10 };

    const eventLat = event.latitude ? Number(event.latitude) : cityData.lat;
    const eventLng = event.longitude ? Number(event.longitude) : cityData.lng;

    let distanceStr = `${(2.4 + idx * 2.1).toFixed(1)} km away`;
    if (userCoords && userCoords.lat && userCoords.lng) {
      const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, eventLat, eventLng);
      distanceStr = `${dist} km away`;
    }

    return {
      ...event,
      latitude: eventLat,
      longitude: eventLng,
      distanceStr,
      mapX: cityData.x,
      mapY: cityData.y
    };
  });

  // Calendar calculations
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthName = calendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  // Find events on selected calendar day
  const eventsOnSelectedDate = sortedEvents.filter((ev) => {
    if (!ev.date) return false;
    const d = new Date(ev.date);
    return (
      d.getDate() === selectedDay &&
      d.getMonth() === month &&
      d.getFullYear() === year
    );
  });

  return (
    <div className="w-full bg-[#FAF8F5] min-h-full py-6 px-4 sm:px-6 font-sans select-none text-[#171717]">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* PAGE HEADER */}
        <div className="pt-2 pb-1">
          <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight uppercase font-titan text-[#171717]">
            EVENTS
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#7A6F64] mt-0.5">
            Discover fan conventions, cosplay meetups, and screening events near you with GPS & location services.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md w-full relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#737373] pointer-events-none">
            <Search size={14} className="text-[#737373]" />
          </span>
          <input
            type="text"
            placeholder="Search events, conventions, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-bold pl-9 pr-8 py-2 border border-[#E5E7EB] rounded-none bg-white text-[#171717] focus:outline-none focus:border-[#FFA800] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-[#FFA800] cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* FILTER BAR: City Select, Event Type Pills, GPS location button */}
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-3 sm:p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* City Selector */}
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#525252] shrink-0" />
              <div>
                <span className="block text-[10px] font-bold text-[#737373] leading-none">City</span>
                <div className="relative mt-0.5">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="text-xs font-bold text-[#171717] bg-transparent pr-4 outline-hidden cursor-pointer"
                  >
                    {dynamicCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronRight size={12} className="rotate-90 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#737373]" />
                </div>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-stone-200 hidden sm:block" />

            {/* Event Format / Type Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-[#171717] mr-1">Event Type</span>
              {EVENT_FORMAT_FILTERS.map((type) => {
                const isActive = selectedType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${isActive
                        ? "bg-[#FEF3C7] text-black border border-[#F59E0B] shadow-2xs"
                        : "bg-white text-[#525252] border border-[#E5E7EB] hover:bg-stone-50"
                      }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GPS Location Button */}
          <button
            type="button"
            onClick={handleUseLocation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold text-[#171717] border border-[#E5E7EB] hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs ml-auto"
          >
            <Navigation size={13} className="text-[#525252]" />
            <span>Use my location</span>
          </button>
        </div>

        {/* TOP SECTION: NEARBY EVENTS & INTERACTIVE GPS MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-1">
          {/* LEFT 6 COLUMNS: NEARBY EVENTS LIST */}
          <div className="lg:col-span-6 space-y-3 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-black uppercase tracking-tight font-titan text-[#171717]">
                Nearby Events ({sortedEvents.length})
              </h2>
              {loading && <Loader2 size={13} className="animate-spin text-stone-400 ml-1" />}
            </div>

            {sortedEvents.length === 0 && !loading ? (
              <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-8 text-center text-xs text-stone-500 font-semibold space-y-2">
                <p>No events found for this selection.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity("All Cities");
                    setSelectedType("All");
                    setSearchQuery("");
                  }}
                  className="px-3 py-1.5 bg-[#FFA800] text-black font-extrabold text-xs rounded-lg cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 flex-1 flex flex-col justify-start">
                {sortedEvents.map((event) => {
                  const eventImg = getEventImage(event);
                  const isSelected = activePopupEvent?._id === event._id || activePopupEvent?.id === event.id;
                  const dateInfo = formatEventDate(event.date);

                  return (
                    <div
                      key={event._id || event.id}
                      onClick={() => {
                        setActivePopupEvent(event);
                        setViewingEvent(event);
                      }}
                      className={`bg-white rounded-[12px] border p-2.5 sm:p-3 flex gap-3 sm:gap-3.5 items-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all cursor-pointer group ${isSelected
                          ? "border-[#FFA800] ring-1 ring-[#FFA800]/30"
                          : "border-[#E5E7EB] hover:border-stone-300"
                        }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-[100px] sm:w-[110px] aspect-[4/3] rounded-[8px] overflow-hidden shrink-0 bg-stone-900 shadow-2xs">
                        <img
                          src={eventImg}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 py-0.5 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${getEventTypeStyle(
                              event.format
                            )}`}
                          >
                            {event.format || "Convention"}
                          </span>
                          <span className="text-[10px] font-semibold text-[#737373] flex items-center gap-0.5 shrink-0">
                            <Navigation size={9} className="rotate-45" />
                            {event.distanceStr}
                          </span>
                        </div>

                        <h3 className="font-bold text-[12.5px] sm:text-[13px] text-[#171717] leading-snug truncate group-hover:text-[#E05315] transition-colors">
                          {event.title}
                        </h3>

                        <div className="text-[10.5px] text-[#737373] space-y-0.5 font-medium">
                          <div className="flex items-center gap-1">
                            <CalendarIcon size={11} className="shrink-0 text-[#9CA3AF]" />
                            <span>
                              {dateInfo.full} {event.time ? `• ${event.time}` : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={11} className="shrink-0 text-[#9CA3AF]" />
                            <span className="truncate">
                              {event.location || event.venue || event.city}
                            </span>
                          </div>
                        </div>

                        <div className="pt-0.5 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingEvent(event);
                            }}
                            className="text-[11px] font-bold text-stone-600 hover:text-black transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <MapPin size={11} className="text-[#FFA800]" />
                            <span>View Map</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGetTickets(event);
                            }}
                            className="text-[11px] font-bold text-[#E05315] hover:text-[#C2410C] transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Get tickets</span>
                            <span className="text-xs">&rarr;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT 6 COLUMNS: INTERACTIVE GPS MAP CANVAS */}
          <div className="lg:col-span-6 bg-[#E8ECEF] rounded-[14px] border border-[#CBD5E1] overflow-hidden shadow-xs relative min-h-[380px] flex flex-col justify-between select-none">
            {/* Map Canvas Background */}
            <div
              className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={
                  mapMode === "satellite"
                    ? "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&auto=format&fit=crop&q=80"
                    : "/src/assets/images/google_maps_karachi_1790285156619.jpg"
                }
                alt="Interactive Map"
                className="w-full h-full object-cover brightness-[1.02] contrast-[1.02]"
              />
            </div>

            {/* Map / Satellite Toggle */}
            <div className="absolute top-3 left-3 z-20 flex bg-white rounded-md shadow-md border border-stone-200 overflow-hidden text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setMapMode("map")}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${mapMode === "map"
                    ? "bg-white text-[#1A73E8] font-bold border-r border-stone-100"
                    : "bg-stone-50 text-[#5F6368]"
                  }`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setMapMode("satellite")}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${mapMode === "satellite"
                    ? "bg-white text-[#1A73E8] font-bold"
                    : "bg-stone-50 text-[#5F6368]"
                  }`}
              >
                Satellite
              </button>
            </div>

            {/* Interactive GPS Markers */}
            <div className="absolute inset-0 pointer-events-none">
              {sortedEvents.map((ev, index) => {
                const posX = ev.mapX || 50 + ((index * 13) % 40);
                const posY = ev.mapY || 35 + ((index * 17) % 35);
                const isSelected = activePopupEvent?._id === ev._id || activePopupEvent?.id === ev.id;

                return (
                  <div
                    key={ev._id || ev.id || index}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                    onClick={() => setActivePopupEvent(ev)}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white ring-2 transition-transform ${isSelected
                          ? "bg-[#FFA800] text-black scale-125 ring-[#FFA800]/50 z-30"
                          : "bg-[#9333EA] text-white ring-[#9333EA]/30 group-hover:scale-110"
                        }`}
                    >
                      <Ticket size={11} className="stroke-[2.5]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Popup Window on Map */}
            {activePopupEvent && (
              <div
                style={{ left: "55%", top: "25%" }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95 duration-150"
              >
                <div className="bg-white rounded-[12px] p-2.5 shadow-xl border border-stone-200 flex gap-2.5 items-center max-w-[230px] relative">
                  <button
                    type="button"
                    onClick={() => setActivePopupEvent(null)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-stone-300 shadow-xs flex items-center justify-center text-stone-500 hover:text-black cursor-pointer"
                  >
                    <X size={11} className="stroke-[2.5]" />
                  </button>

                  <div className="w-12 h-12 rounded-[6px] overflow-hidden shrink-0 bg-black">
                    <img
                      src={getEventImage(activePopupEvent)}
                      alt={activePopupEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-bold text-[11px] text-[#171717] truncate leading-tight">
                      {activePopupEvent.title}
                    </h4>
                    <div>
                      <span
                        className={`text-[7.5px] font-black px-1.5 py-0.2 rounded-full uppercase ${getEventTypeStyle(
                          activePopupEvent.format
                        )}`}
                      >
                        {activePopupEvent.format || "Convention"}
                      </span>
                    </div>
                    <div className="text-[8.5px] text-[#737373] flex items-center gap-0.5">
                      <CalendarIcon size={8} />
                      <span>{formatEventDate(activePopupEvent.date).full}</span>
                    </div>
                    <div className="text-[8.5px] text-[#737373] flex items-center gap-0.5 truncate">
                      <MapPin size={8} />
                      <span className="truncate">{activePopupEvent.location || activePopupEvent.city}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setViewingEvent(activePopupEvent)}
                      className="mt-1.5 w-full text-[9.5px] font-bold text-black bg-[#FFA800] hover:bg-[#FFB51A] py-1 text-center cursor-pointer transition-colors block shadow-2xs"
                    >
                      Open Map & Details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Google Watermark */}
            <div className="absolute bottom-2.5 left-3 z-20 pointer-events-none select-none">
              <span className="font-bold text-xs tracking-tight text-[#4285F4] drop-shadow-xs">
                G<span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5 items-center">
              <button
                type="button"
                onClick={handleUseLocation}
                className="w-7 h-7 rounded-lg bg-white border border-stone-200 shadow-sm flex items-center justify-center text-[#525252] hover:text-black cursor-pointer transition-colors"
                title="Locate Me (GPS)"
              >
                <Navigation size={12} className="rotate-45" />
              </button>

              <div className="flex flex-col bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                  className="w-7 h-7 flex items-center justify-center text-[#525252] hover:text-black hover:bg-stone-50 cursor-pointer border-b border-stone-100"
                  title="Zoom In"
                >
                  <Plus size={13} className="stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                  className="w-7 h-7 flex items-center justify-center text-[#525252] hover:text-black hover:bg-stone-50 cursor-pointer"
                  title="Zoom Out"
                >
                  <Minus size={13} className="stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: EVENT CALENDAR & EVENTS ON SELECTED DATE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pt-2">
          {/* LEFT 6 COLUMNS: EVENT CALENDAR */}
          <div className="lg:col-span-6 bg-white rounded-[14px] border border-[#E5E7EB] p-4 sm:p-5 shadow-2xs space-y-4">
            {/* Header: Month Navigator */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-[15px] font-black uppercase tracking-tight font-titan text-[#171717]">
                Event Calendar
              </h3>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded hover:bg-stone-100 text-[#737373] hover:text-black cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-[#171717]">{monthName}</span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 rounded hover:bg-stone-100 text-[#737373] hover:text-black cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Calendar Table */}
            <div>
              <div className="grid grid-cols-7 text-center text-[10.5px] font-semibold text-[#737373] pb-2 border-b border-[#F3F4F6]">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              <div className="grid grid-cols-7 gap-y-2 pt-2 text-center text-xs">
                {/* Empty slots for month start offset */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="py-1 text-[#D1D5DB]" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = selectedDay === dayNum;

                  // Check if any events fall on this day
                  const hasEvents = sortedEvents.some((ev) => {
                    if (!ev.date) return false;
                    const d = new Date(ev.date);
                    return d.getDate() === dayNum && d.getMonth() === month && d.getFullYear() === year;
                  });

                  return (
                    <div
                      key={dayNum}
                      onClick={() => setSelectedDay(dayNum)}
                      className="py-0.5 flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-transform ${isSelected
                            ? "bg-[#FFA800] text-black scale-105"
                            : "hover:bg-stone-100 text-[#171717]"
                          }`}
                      >
                        {dayNum}
                      </div>
                      {hasEvents && (
                        <div className="flex justify-center gap-0.5 mt-0.5">
                          <span className="w-1 h-1 rounded-full bg-[#E05315]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT 6 COLUMNS: EVENTS ON SELECTED DATE */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-sm sm:text-[14px] font-bold text-[#171717]">
              Events on {calendarDate.toLocaleDateString("en-US", { month: "short" })} {selectedDay}, {year}
            </h3>

            {eventsOnSelectedDate.length === 0 ? (
              <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 text-center text-xs text-stone-500 font-semibold space-y-2">
                <p>No events scheduled for this specific date.</p>
                <button
                  type="button"
                  onClick={() => {
                    // Jump to first day that has events or reset
                    const nextEv = sortedEvents.find((e) => e.date);
                    if (nextEv) {
                      const d = new Date(nextEv.date);
                      setSelectedDay(d.getDate());
                      setCalendarDate(new Date(d.getFullYear(), d.getMonth(), 1));
                    }
                  }}
                  className="text-xs text-[#E05315] font-bold hover:underline cursor-pointer"
                >
                  View upcoming events this month
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {eventsOnSelectedDate.map((event) => {
                  const eventImg = getEventImage(event);
                  const dateInfo = formatEventDate(event.date);

                  return (
                    <div
                      key={event._id || event.id}
                      className="bg-white rounded-[12px] border border-[#E5E7EB] p-2.5 sm:p-3 flex gap-3 sm:gap-3.5 items-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-stone-300 transition-all group"
                    >
                      <div className="w-[100px] sm:w-[110px] aspect-[4/3] rounded-[8px] overflow-hidden shrink-0 bg-stone-900 shadow-2xs">
                        <img
                          src={eventImg}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0 py-0.5 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${getEventTypeStyle(
                              event.format
                            )}`}
                          >
                            {event.format || "Convention"}
                          </span>
                          <span className="text-[10px] font-semibold text-[#737373] flex items-center gap-0.5 shrink-0">
                            <Navigation size={9} className="rotate-45" />
                            {event.distanceStr}
                          </span>
                        </div>

                        <h4 className="font-bold text-[12.5px] sm:text-[13px] text-[#171717] leading-snug truncate group-hover:text-[#E05315] transition-colors">
                          {event.title}
                        </h4>

                        <div className="text-[10.5px] text-[#737373] space-y-0.5 font-medium">
                          <div className="flex items-center gap-1">
                            <CalendarIcon size={11} className="shrink-0 text-[#9CA3AF]" />
                            <span>
                              {dateInfo.full} {event.time ? `• ${event.time}` : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={11} className="shrink-0 text-[#9CA3AF]" />
                            <span className="truncate">
                              {event.location || event.venue || event.city}
                            </span>
                          </div>
                        </div>

                        <div className="pt-0.5 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingEvent(event);
                            }}
                            className="text-[11px] font-bold text-stone-600 hover:text-black transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <MapPin size={11} className="text-[#FFA800]" />
                            <span>View Map</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGetTickets(event);
                            }}
                            className="text-[11px] font-bold text-[#E05315] hover:text-[#C2410C] transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Get tickets</span>
                            <span className="text-xs">&rarr;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM BANNER: SUBMIT YOUR FAN CONTENT */}
        <section className="pt-2 pb-6">
          <div className="relative rounded-[16px] overflow-hidden border border-[#E2E8F0] bg-gradient-to-r from-[#FAF8F5] via-[#EFF6FF] to-transparent shadow-xs flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 min-h-[96px]">
            <div className="absolute inset-y-0 right-0 w-2/3 sm:w-1/2 overflow-hidden pointer-events-none opacity-85">
              <img
                src="/src/assets/images/fan_content_banner_art_1790284032615.jpg"
                alt="Banner Illustration"
                className="w-full h-full object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#EFF6FF]/80 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <div>
                <h3 className="text-sm sm:text-[15px] font-black uppercase tracking-tight font-titan text-[#171717]">
                  Submit your fan content
                </h3>
                <p className="text-[11.5px] text-[#737373] font-medium">
                  Share your articles, artwork, and stories with the community.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-3 sm:pt-0">
              <button
                type="button"
                onClick={handleSubmitFanContentClick}
                className="bg-[#FFA800] hover:bg-[#FFB51A] text-black font-extrabold text-[12px] py-2 px-4 rounded-[8px] shadow-xs transition-all active:scale-[0.98] cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Submit content</span>
                <span className="text-sm leading-none">&rarr;</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1D24] border border-[#2B2F3D] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check size={14} className="text-[#FFA800]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TICKET RESERVATION MODAL */}
      {ticketModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#181A20] border border-[#2B2F3D] text-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${getEventTypeStyle(
                  ticketModalEvent.format
                )}`}
              >
                {ticketModalEvent.format || "Convention"}
              </span>
              <button
                type="button"
                onClick={() => setTicketModalEvent(null)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {ticketSuccess ? (
              <div className="py-6 text-center space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check size={24} className="stroke-[3]" />
                </div>
                <h4 className="text-base font-bold">Tickets Confirmed!</h4>
                <p className="text-xs text-stone-300 max-w-xs mx-auto">
                  You reserved {ticketQuantity} pass(es) for <strong>{ticketModalEvent.title}</strong> in {ticketModalEvent.city}.
                </p>
                <button
                  type="button"
                  onClick={() => setTicketModalEvent(null)}
                  className="mt-3 px-5 py-2 bg-[#FFA800] text-black font-extrabold text-xs rounded-lg cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-900">
                    <img
                      src={getEventImage(ticketModalEvent)}
                      alt={ticketModalEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{ticketModalEvent.title}</h3>
                    <p className="text-[11px] text-stone-400">
                      {formatEventDate(ticketModalEvent.date).full} {ticketModalEvent.time ? `• ${ticketModalEvent.time}` : ""}
                    </p>
                    <p className="text-[11px] text-[#FFA800] font-semibold">
                      {ticketModalEvent.location || ticketModalEvent.venue || ticketModalEvent.city}
                    </p>
                  </div>
                </div>

                <div className="bg-[#121418] p-3 rounded-xl border border-[#262A36] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-300">Standard Pass</span>
                    <span className="font-bold text-[#FFA800]">Free Admission</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#262A36]">
                    <span className="text-xs text-stone-400">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setTicketQuantity((q) => Math.max(1, q - 1))}
                        className="w-6 h-6 rounded bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-white cursor-pointer"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{ticketQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setTicketQuantity((q) => Math.min(8, q + 1))}
                        className="w-6 h-6 rounded bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-white cursor-pointer"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTicketModalEvent(null)}
                    className="px-4 py-2 border border-stone-700 text-xs font-semibold rounded-lg text-stone-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setTicketSuccess(true)}
                    className="px-5 py-2 bg-[#FFA800] hover:bg-[#FFB51A] text-black font-extrabold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Reserve Tickets
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EVENT DETAILS & EXACT MAP LOCATION MODAL */}
      {viewingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#CBD5E1] text-[#171717] rounded-none max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#E5E7EB] bg-[#FAF9F5]">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[8.5px] font-black px-2.5 py-0.5 rounded-none uppercase tracking-wider border ${getEventTypeStyle(
                    viewingEvent.format
                  )}`}
                >
                  {viewingEvent.format || "Convention"}
                </span>
                <span className="text-xs font-bold text-[#737373]">
                  {formatEventDate(viewingEvent.date).full}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingEvent(null)}
                className="p-1 hover:bg-stone-200 text-stone-500 hover:text-black cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Event Hero */}
              <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-start">
                <div className="w-full sm:w-44 aspect-[4/3] rounded-none overflow-hidden shrink-0 bg-stone-900 border border-[#E5E7EB] shadow-2xs">
                  <img
                    src={getEventImage(viewingEvent)}
                    alt={viewingEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <h2 className="text-lg sm:text-xl font-black text-[#171717] leading-snug">
                    {viewingEvent.title}
                  </h2>
                  <p className="text-xs text-[#525252] leading-relaxed">
                    {viewingEvent.description || viewingEvent.subtitle || "Discover exclusive panels, creators, fan meetups and cosplay showcases."}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#737373] pt-1 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-[#FFA800]" />
                      {viewingEvent.time || "10:00 AM - 06:00 PM"}
                    </span>
                    {viewingEvent.attendees > 0 && (
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-[#FFA800]" />
                        {Number(viewingEvent.attendees).toLocaleString()} attendees
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket Link if available */}
              {viewingEvent.ticketLink && (
                <div className="p-3 bg-[#FFFDF7] border border-[#F5E6CC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <Ticket size={16} className="text-[#FFA800] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#171717]">Official Tickets Available</p>
                      <p className="text-[11px] text-[#7A6F64] font-medium truncate max-w-sm">{viewingEvent.ticketLink}</p>
                    </div>
                  </div>
                  <a
                    href={viewingEvent.ticketLink.startsWith("http") ? viewingEvent.ticketLink.trim() : `https://${viewingEvent.ticketLink.trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FFA800] hover:bg-[#FFB51A] text-black text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs shrink-0 rounded-none"
                  >
                    <span>Get Tickets</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}

              {/* Exact Map Location Section */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#FFA800]" />
                    <span>Exact Map Location & Distance</span>
                  </h3>
                </div>

                {/* Free Leaflet OpenStreetMap View with Live Distance to User GPS */}
                <EventLocationMap
                  latitude={viewingEvent.latitude}
                  longitude={viewingEvent.longitude}
                  eventName={viewingEvent.title}
                  locationAddress={viewingEvent.location || viewingEvent.city}
                  userCoords={userCoords}
                  onUserCoordsChange={(coords) => setUserCoords(coords)}
                  height="260px"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setViewingEvent(null)}
                  className="px-4 py-2 border border-[#E5E7EB] bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 cursor-pointer rounded-none"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const evt = viewingEvent;
                    setViewingEvent(null);
                    handleGetTickets(evt);
                  }}
                  className="px-5 py-2 bg-[#FFA800] hover:bg-[#FFB51A] text-black font-extrabold text-xs cursor-pointer shadow-xs rounded-none flex items-center gap-1.5"
                >
                  <Ticket size={13} />
                  <span>{viewingEvent.ticketLink ? "Get Tickets" : "Reserve Tickets"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { EventsPage };
