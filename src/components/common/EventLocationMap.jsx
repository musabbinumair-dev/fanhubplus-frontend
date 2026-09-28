import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin, ExternalLink, Loader2 } from "lucide-react";

// Haversine distance formula in kilometers
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

// Event marker pin (brand orange / yellow)
const createEventPin = () => {
  return L.divIcon({
    className: "custom-event-marker",
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 34px; height: 34px; background: #FFA800; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4);"></div>
        <div style="position: relative; z-index: 2; width: 10px; height: 10px; background: #171717; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -34]
  });
};

// User current location pin (blue pulse)
const createUserPin = () => {
  return L.divIcon({
    className: "custom-user-marker",
    html: `
      <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 26px; height: 26px; background: rgba(59, 130, 246, 0.3); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 14px; height: 14px; background: #2563EB; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); position: relative; z-index: 2;"></div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

export const EventLocationMap = ({
  latitude,
  longitude,
  eventName = "Event Location",
  locationAddress = "",
  userCoords = null,
  onUserCoordsChange = null,
  height = "260px"
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [currentUserCoords, setCurrentUserCoords] = useState(userCoords);
  const [isDetecting, setIsDetecting] = useState(false);

  // Fallback coordinates if event doesn't have exact lat/lng
  const eventLat = latitude ? Number(latitude) : 35.6298;
  const eventLng = longitude ? Number(longitude) : 139.7942;

  // Sync incoming userCoords
  useEffect(() => {
    if (userCoords) {
      setCurrentUserCoords(userCoords);
    }
  }, [userCoords]);

  // Request user GPS
  const handleDetectLocation = () => {
    if (!("geolocation" in navigator)) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6))
        };
        setCurrentUserCoords(coords);
        if (onUserCoordsChange) {
          onUserCoordsChange(coords);
        }
        setIsDetecting(false);
      },
      () => {
        setIsDetecting(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Distance calculation
  const distanceKm =
    currentUserCoords && currentUserCoords.lat && currentUserCoords.lng
      ? calculateDistanceKm(
          currentUserCoords.lat,
          currentUserCoords.lng,
          eventLat,
          eventLng
        )
      : null;

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [eventLat, eventLng],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;

      // Event Marker
      const eventMarker = L.marker([eventLat, eventLng], {
        icon: createEventPin()
      }).addTo(map);

      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
          <strong style="color: #171717; display: block; font-size: 13px;">${eventName}</strong>
          ${locationAddress ? `<span style="color: #555; font-size: 11px;">${locationAddress}</span>` : ""}
        </div>
      `;
      eventMarker.bindPopup(popupHtml).openPopup();

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } else {
      mapInstanceRef.current.setView([eventLat, eventLng], 13);
    }

    // Add user marker and line if available
    const map = mapInstanceRef.current;
    let userMarker = null;
    let distanceLine = null;

    if (currentUserCoords && currentUserCoords.lat && currentUserCoords.lng) {
      userMarker = L.marker([currentUserCoords.lat, currentUserCoords.lng], {
        icon: createUserPin()
      })
        .addTo(map)
        .bindTooltip("You are here", { permanent: false });

      distanceLine = L.polyline(
        [
          [currentUserCoords.lat, currentUserCoords.lng],
          [eventLat, eventLng]
        ],
        {
          color: "#2563EB",
          dashArray: "6, 8",
          weight: 2.5,
          opacity: 0.75
        }
      ).addTo(map);

      // Fit both markers into view
      const bounds = L.latLngBounds([
        [currentUserCoords.lat, currentUserCoords.lng],
        [eventLat, eventLng]
      ]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    return () => {
      if (userMarker) map.removeLayer(userMarker);
      if (distanceLine) map.removeLayer(distanceLine);
    };
  }, [eventLat, eventLng, currentUserCoords, eventName, locationAddress]);

  // Clean cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${eventLat},${eventLng}`;

  return (
    <div className="space-y-2 select-none">
      {/* Distance and Location Information Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#FAF9F5] border border-[#E5E7EB]">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin size={15} className="text-[#FFA800] shrink-0" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-[#171717] block truncate">
              {locationAddress || "Exact Location on Map"}
            </span>
            <span className="text-[10.5px] font-semibold text-[#737373] block">
              Lat: {eventLat.toFixed(4)}, Lng: {eventLng.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Live Distance Pill */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {distanceKm !== null ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#B45309] text-xs font-bold shadow-2xs">
              <Navigation size={12} className="rotate-45 text-[#FFA800]" />
              <span>{distanceKm} km away from you</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-stone-50 border border-[#E5E7EB] text-[#171717] text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
            >
              {isDetecting ? (
                <Loader2 size={12} className="animate-spin text-[#FFA800]" />
              ) : (
                <Navigation size={12} className="rotate-45 text-[#737373]" />
              )}
              <span>Calculate distance</span>
            </button>
          )}

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-white border border-[#E5E7EB] hover:bg-stone-50 text-[#171717] transition-colors"
            title="Open in Google Maps / Directions"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Leaflet OpenStreetMap Container */}
      <div className="border border-[#CBD5E1] overflow-hidden relative shadow-2xs">
        <div
          ref={mapContainerRef}
          style={{ height, width: "100%", zIndex: 1 }}
        />
      </div>
    </div>
  );
};

export default EventLocationMap;
