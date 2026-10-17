import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, Navigation, Compass, Star, Camera, Clock, 
  ExternalLink, Sparkles, Search, Crosshair, ArrowRight 
} from 'lucide-react';
import { Restaurant, Language } from '../types';
import { translations } from '../data/translations';
import { 
  UserCoordinates, DEFAULT_BANGLADESH_COORDS, 
  calculateDistanceKm, getGoogleMapsRouteUrl, 
  isRestaurantOpenNow, searchLocation 
} from '../utils/geo';

interface LiveMapViewProps {
  restaurants: Restaurant[];
  lang: Language;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  userCoords: UserCoordinates | null;
  onUpdateUserCoords: (coords: UserCoordinates) => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  restaurants,
  lang,
  onSelectRestaurant,
  userCoords,
  onUpdateUserCoords,
}) => {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [selectedSpot, setSelectedSpot] = useState<Restaurant | null>(null);
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [filterOpenOnly, setFilterOpenOnly] = useState(false);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = userCoords?.lat || DEFAULT_BANGLADESH_COORDS.lat;
      const initialLng = userCoords?.lng || DEFAULT_BANGLADESH_COORDS.lng;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false,
      });

      // Add Zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap Free Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add resize invalidate timeout
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update user marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const coords = userCoords || DEFAULT_BANGLADESH_COORDS;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([coords.lat, coords.lng]);
    } else {
      const userIcon = L.divIcon({
        className: 'user-pulse-marker',
        html: `
          <div style="
            width: 22px; 
            height: 22px; 
            background: #2563eb; 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 0 14px rgba(37, 99, 235, 0.9);
          "></div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([coords.lat, coords.lng], { icon: userIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(lang === 'bn' ? '<b>আপনার বর্তমান অবস্থান</b>' : '<b>Your Current Location</b>');
      userMarkerRef.current = marker;
    }
  }, [userCoords, lang]);

  // Update restaurant markers on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const currentCoords = userCoords || DEFAULT_BANGLADESH_COORDS;

    restaurants.forEach((restaurant) => {
      const lat = restaurant.coordinates?.lat || (currentCoords.lat + (Math.random() - 0.5) * 0.04);
      const lng = restaurant.coordinates?.lng || (currentCoords.lng + (Math.random() - 0.5) * 0.04);

      const openStatus = isRestaurantOpenNow(restaurant.openingHours);
      if (filterOpenOnly && !openStatus.isOpen) return;

      const dist = calculateDistanceKm(currentCoords.lat, currentCoords.lng, lat, lng);
      const displayName = lang === 'bn' ? restaurant.nameBn : restaurant.name;

      // Create Custom 2D Pin HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'restaurant-map-pin',
        html: `
          <div style="
            background: ${openStatus.isOpen ? '#e11d48' : '#4b5563'}; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 9999px; 
            font-size: 11px; 
            font-weight: 800; 
            display: inline-flex; 
            align-items: center; 
            gap: 5px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            border: 2px solid white;
            white-space: nowrap;
            cursor: pointer;
          ">
            <span style="font-size: 12px;">${openStatus.isOpen ? '🟢' : '⚪'}</span>
            <span style="max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${displayName}
            </span>
            <span style="background: rgba(0,0,0,0.25); padding: 1px 5px; border-radius: 6px; font-size: 10px;">
              ৳${restaurant.avgPricePerPersonBDT}
            </span>
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; min-width: 170px;">
          <h4 style="font-weight: 800; font-size: 14px; margin-bottom: 2px;">${displayName}</h4>
          <p style="font-size: 11px; color: #71717a; margin-bottom: 6px;">${restaurant.area}, ${restaurant.city}</p>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 8px;">
            <span>${dist} km away</span>
            <span style="color: ${openStatus.isOpen ? '#059669' : '#dc2626'};">${openStatus.isOpen ? 'Open Now' : 'Closed'}</span>
          </div>
          <a href="${getGoogleMapsRouteUrl(lat, lng, restaurant.name, userCoords)}" target="_blank" style="display: block; background: #e11d48; color: white; text-align: center; font-size: 11px; font-weight: 700; padding: 6px; border-radius: 8px; text-decoration: none;">
            Get Route on Google Maps
          </a>
        </div>
      `);

      marker.on('click', () => {
        setSelectedSpot(restaurant);
        map.setView([lat, lng], 15, { animate: true });
      });

      markersGroup.addLayer(marker);
    });
  }, [restaurants, userCoords, filterOpenOnly, lang]);

  // Handle GPS location trigger
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert(lang === 'bn' ? 'আপনার ব্রাউজার জিপিএস সমর্থন করে না।' : 'Geolocation not supported by browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords: UserCoordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          areaName: 'Current Location',
        };
        onUpdateUserCoords(coords);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([coords.lat, coords.lng], 15, { animate: true });
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Search any location anywhere in Bangladesh or beyond
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocationQuery.trim()) return;
    const results = await searchLocation(searchLocationQuery);
    if (results.length > 0) {
      const top = results[0];
      onUpdateUserCoords(top);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([top.lat, top.lng], 14, { animate: true });
      }
    }
  };

  // Sort restaurants by proximity to current coordinates
  const sortedByProximity = [...restaurants].map((r) => {
    const coords = userCoords || DEFAULT_BANGLADESH_COORDS;
    const lat = r.coordinates?.lat || coords.lat;
    const lng = r.coordinates?.lng || coords.lng;
    const dist = calculateDistanceKm(coords.lat, coords.lng, lat, lng);
    const openStatus = isRestaurantOpenNow(r.openingHours);
    return { ...r, distanceKm: dist, openStatus };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="space-y-4 animate-fade-in pb-16">
      
      {/* Top Map Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Any Location / City Anywhere */}
        <form onSubmit={handleLocationSearch} className="flex-1 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchLocationQuery}
            onChange={(e) => setSearchLocationQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'যেকোনো শহর বা এলাকা খুঁজুন (যেমন: রাজশাহী, খুলনা, সিলেট, মিরপুর)...' : 'Search any location across Bangladesh (e.g. Rajshahi, Cox’s Bazar)...'}
            className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold hover:bg-rose-600 transition-colors"
          >
            {lang === 'bn' ? 'খুঁজুন' : 'Search'}
          </button>
        </form>

        {/* GPS Locate Me & Filter Open Now */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-rose-400 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 shadow-xs"
            title="Locate my GPS position"
          >
            <Crosshair className={`w-4 h-4 text-rose-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? (lang === 'bn' ? 'খোঁজা হচ্ছে...' : 'Locating...') : (lang === 'bn' ? 'আমার অবস্থান' : 'Locate Me')}</span>
          </button>

          <button
            onClick={() => setFilterOpenOnly(!filterOpenOnly)}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs ${
              filterOpenOnly
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-400'
                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{lang === 'bn' ? 'এখন খোলা আছে' : 'Open Now Only'}</span>
          </button>
        </div>
      </div>

      {/* Map & Split Drawer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[650px]">
        
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg relative bg-zinc-100 dark:bg-zinc-900">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-3 shadow-md pointer-events-none">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>{lang === 'bn' ? 'আপনার অবস্থান' : 'You'}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>{lang === 'bn' ? 'খোলা আছে' : 'Open'}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
              <span>{lang === 'bn' ? 'বন্ধ' : 'Closed'}</span>
            </span>
          </div>
        </div>

        {/* Selected Spot Details & Nearest List Sidebar */}
        <div className="flex flex-col h-full rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg overflow-hidden">
          
          {selectedSpot ? (
            <div className="p-5 flex flex-col justify-between h-full overflow-y-auto space-y-4">
              <div>
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden mb-3">
                  <img
                    src={selectedSpot.coverImage}
                    alt={selectedSpot.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{selectedSpot.photogenicScore}/10</span>
                  </div>

                  <div className="absolute bottom-2 left-2">
                    {(() => {
                      const status = isRestaurantOpenNow(selectedSpot.openingHours);
                      return (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs ${
                          status.isOpen ? 'bg-emerald-500/90 text-white' : 'bg-zinc-800/90 text-zinc-200'
                        }`}>
                          {lang === 'bn' ? status.labelBn : status.labelEn}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                      {lang === 'bn' ? selectedSpot.nameBn : selectedSpot.name}
                    </h3>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{selectedSpot.address}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-rose-600 block">
                      ৳{selectedSpot.avgPricePerPersonBDT}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {t.avgPerPerson}
                    </span>
                  </div>
                </div>

                {/* Distance & Opening Hours */}
                <div className="mt-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-semibold">
                    <Compass className="w-4 h-4 text-rose-600" />
                    <span>
                      {calculateDistanceKm(
                        userCoords?.lat || DEFAULT_BANGLADESH_COORDS.lat,
                        userCoords?.lng || DEFAULT_BANGLADESH_COORDS.lng,
                        selectedSpot.coordinates?.lat || DEFAULT_BANGLADESH_COORDS.lat,
                        selectedSpot.coordinates?.lng || DEFAULT_BANGLADESH_COORDS.lng
                      )} km {lang === 'bn' ? 'দূরে' : 'away'}
                    </span>
                  </div>

                  {selectedSpot.openingHours && (
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{selectedSpot.openingHours}</span>
                    </div>
                  )}
                </div>

                {/* AI Photography & Food Tip */}
                <div className="mt-3 p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-xs">
                  <div className="flex items-center gap-1 text-rose-700 dark:text-rose-400 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'এআই ফটো ও খাবার টিপস:' : 'AI Photography & Dish Tip:'}</span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 italic">
                    "{lang === 'bn' ? selectedSpot.photographyHighlights.bn : selectedSpot.photographyHighlights.en}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                {/* Google Maps Route Button */}
                <a
                  href={getGoogleMapsRouteUrl(
                    selectedSpot.coordinates?.lat || DEFAULT_BANGLADESH_COORDS.lat,
                    selectedSpot.coordinates?.lng || DEFAULT_BANGLADESH_COORDS.lng,
                    selectedSpot.name,
                    userCoords
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'গুগল ম্যাপসে ডিরেকশন ও রুট' : 'Get Route on Google Maps'}</span>
                </a>

                <button
                  onClick={() => onSelectRestaurant(selectedSpot)}
                  className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{lang === 'bn' ? 'সম্পূর্ণ মেনু ও ফটোস্পট' : 'View Full Menu & Photos'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-rose-600" />
                  <span>{lang === 'bn' ? 'নিকটবর্তী খাবার স্পটসমূহ' : 'Nearest Food Spots'}</span>
                </span>
                <span className="text-[11px] text-zinc-400">
                  {sortedByProximity.length} {lang === 'bn' ? 'টি' : 'places'}
                </span>
              </div>

              <div className="overflow-y-auto space-y-2.5 pt-3 flex-1">
                {sortedByProximity.slice(0, 10).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedSpot(r);
                      if (mapInstanceRef.current && r.coordinates) {
                        mapInstanceRef.current.setView([r.coordinates.lat, r.coordinates.lng], 15, { animate: true });
                      }
                    }}
                    className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-zinc-100 dark:border-zinc-800 cursor-pointer transition-all flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={r.coverImage}
                        alt={r.name}
                        className="w-11 h-11 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                          {lang === 'bn' ? r.nameBn : r.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                          <span className={r.openStatus.isOpen ? 'text-emerald-600 font-semibold' : 'text-zinc-500'}>
                            {r.openStatus.isOpen ? '🟢 Open' : '⚪ Closed'}
                          </span>
                          <span>•</span>
                          <span>{r.distanceKm} km</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
                      ৳{r.avgPricePerPersonBDT}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
