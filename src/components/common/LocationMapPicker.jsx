import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Navigation, MapPin, Loader2, Check } from "lucide-react";

// Custom pin marker icon using inline SVG
const createPinIcon = (color = "#FF5F1F") => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 32px; height: 32px; background: ${color}; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.35);"></div>
        <div style="position: relative; z-index: 2; width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32]
  });
};

export const LocationMapPicker = ({
  latitude,
  longitude,
  locationName,
  onChange
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Default coordinates (Tokyo Big Sight if none provided)
  const currentLat = latitude ? Number(latitude) : 35.6298;
  const currentLng = longitude ? Number(longitude) : 139.7942;

  // Reverse geocode to get a clean address/venue name from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "en" }
      });
      if (res.ok) {
        const data = await res.json();
        const address = data.display_name || "";
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.state ||
          "";
        return { address, city };
      }
    } catch (err) {
      // ignore network errors
    }
    return null;
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: latitude && longitude ? 14 : 11,
        zoomControl: true
      });

      // Free OpenStreetMap Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);

      // Add pin marker
      const marker = L.marker([currentLat, currentLng], {
        icon: createPinIcon("#FF5F1F"),
        draggable: true
      }).addTo(map);

      markerRef.current = marker;
      mapInstanceRef.current = map;

      // Handle map click
      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);

        const geo = await reverseGeocode(lat, lng);
        onChange({
          latitude: parseFloat(lat.toFixed(6)),
          longitude: parseFloat(lng.toFixed(6)),
          location: geo?.address || locationName || "",
          city: geo?.city || ""
        });
      });

      // Handle marker drag
      marker.on("dragend", async (e) => {
        const { lat, lng } = e.target.getLatLng();
        const geo = await reverseGeocode(lat, lng);
        onChange({
          latitude: parseFloat(lat.toFixed(6)),
          longitude: parseFloat(lng.toFixed(6)),
          location: geo?.address || locationName || "",
          city: geo?.city || ""
        });
      });

      // Invalidate size after modal animation
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position when props change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && latitude && longitude) {
      const lat = Number(latitude);
      const lng = Number(longitude);
      markerRef.current.setLatLng([lat, lng]);
    }
  }, [latitude, longitude]);

  // Search location using OpenStreetMap Nominatim
  const handleSearchLocation = async (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setSearchError("");

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "en" }
      });

      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const item = results[0];
          const lat = parseFloat(Number(item.lat).toFixed(6));
          const lng = parseFloat(Number(item.lon).toFixed(6));
          const city =
            item.address?.city ||
            item.address?.town ||
            item.address?.village ||
            item.address?.state ||
            "";

          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1 });
            markerRef.current.setLatLng([lat, lng]);
          }

          onChange({
            latitude: lat,
            longitude: lng,
            location: item.display_name || query,
            city: city || ""
          });
        } else {
          setSearchError("No results found. Try typing a city or venue name.");
        }
      } else {
        setSearchError("Search temporarily unavailable. You can click on the map directly.");
      }
    } catch (err) {
      setSearchError("Failed to search location. Please click on the map.");
    } finally {
      setIsSearching(false);
    }
  };

  // Detect current GPS location
  const handleUseMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setSearchError("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingGps(true);
    setSearchError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1 });
          markerRef.current.setLatLng([lat, lng]);
        }

        const geo = await reverseGeocode(lat, lng);
        onChange({
          latitude: lat,
          longitude: lng,
          location: geo?.address || "Current Location",
          city: geo?.city || ""
        });
        setIsDetectingGps(false);
      },
      () => {
        setSearchError("Unable to retrieve your current location. Please pick on the map.");
        setIsDetectingGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-2">
      {/* Search Bar + GPS Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search venue or city (e.g. Tokyo Big Sight, Karachi Expo Centre)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchLocation();
              }
            }}
            className="w-full text-xs px-3 py-2 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-[#FF5F1F]"
          />
        </div>

        <button
          type="button"
          onClick={handleSearchLocation}
          disabled={isSearching || !searchQuery.trim()}
          className="px-3 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shrink-0"
        >
          {isSearching ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
          <span>Find</span>
        </button>

        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isDetectingGps}
          className="px-3 py-2 border border-stone-300 hover:bg-stone-50 bg-white text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          title="Detect Current GPS Location"
        >
          {isDetectingGps ? (
            <Loader2 size={13} className="animate-spin text-[#FF5F1F]" />
          ) : (
            <Navigation size={13} className="text-[#FF5F1F]" />
          )}
          <span>My GPS</span>
        </button>
      </div>

      {searchError && (
        <p className="text-[11px] text-red-600 font-semibold">{searchError}</p>
      )}

      {/* Leaflet Map Canvas */}
      <div className="border border-stone-300 overflow-hidden relative shadow-2xs">
        <div ref={mapContainerRef} style={{ height: "230px", width: "100%", zIndex: 1 }} />
      </div>

      {/* Selected Coordinates Status Bar */}
      <div className="flex flex-wrap items-center justify-between text-[11px] bg-stone-50 border border-stone-200 px-3 py-1.5 gap-2">
        <div className="flex items-center gap-2">
          <MapPin size={13} className="text-[#FF5F1F] shrink-0" />
          <span className="font-semibold text-stone-700">
            {latitude && longitude ? (
              <>
                <span className="font-bold text-stone-900">Lat:</span> {latitude},{" "}
                <span className="font-bold text-stone-900">Lng:</span> {longitude}
              </>
            ) : (
              <span className="text-stone-500">Click on the map to pin exact coordinates</span>
            )}
          </span>
        </div>

        {latitude && longitude && (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
            <Check size={11} className="stroke-[3]" /> Coordinates Captured
          </span>
        )}
      </div>
    </div>
  );
};

export default LocationMapPicker;
