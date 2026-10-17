export interface UserCoordinates {
  lat: number;
  lng: number;
  areaName?: string;
}

// Default to Dhaka center if GPS is not yet acquired
export const DEFAULT_BANGLADESH_COORDS: UserCoordinates = {
  lat: 23.777176,
  lng: 90.399452,
  areaName: 'Dhaka',
};

// Calculate distance in kilometers using the Haversine formula
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Generate Google Maps Route URL from user coordinates to destination
export function getGoogleMapsRouteUrl(
  destLat: number,
  destLng: number,
  destName: string,
  userCoords?: UserCoordinates | null
): string {
  if (userCoords) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${destLat},${destLng}&travelmode=driving`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destName)}`;
}

// Determine if restaurant is currently open based on opening hours string
export function isRestaurantOpenNow(openingHoursStr?: string): { isOpen: boolean; labelEn: string; labelBn: string } {
  if (!openingHoursStr) {
    return { isOpen: true, labelEn: 'Open', labelBn: 'খোলা আছে' };
  }

  try {
    // Current time in Bangladesh (UTC+6)
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const bdTime = new Date(utc + 3600000 * 6);
    const currentMinutes = bdTime.getHours() * 60 + bdTime.getMinutes();

    // Parse format like "12:00 PM - 10:30 PM" or "8:00 AM - 11:30 PM"
    const match = openingHoursStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) {
      return { isOpen: true, labelEn: 'Open', labelBn: 'খোলা আছে' };
    }

    const [_, startHStr, startMStr, startP, endHStr, endMStr, endP] = match;
    let startH = parseInt(startHStr, 10);
    if (startP.toUpperCase() === 'PM' && startH !== 12) startH += 12;
    if (startP.toUpperCase() === 'AM' && startH === 12) startH = 0;
    const startMinutes = startH * 60 + parseInt(startMStr, 10);

    let endH = parseInt(endHStr, 10);
    if (endP.toUpperCase() === 'PM' && endH !== 12) endH += 12;
    if (endP.toUpperCase() === 'AM' && endH === 12) endH = 0;
    let endMinutes = endH * 60 + parseInt(endMStr, 10);

    // If opening crosses midnight (e.g. 11:00 AM - 2:00 AM)
    let isOpen = false;
    if (endMinutes < startMinutes) {
      isOpen = currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    } else {
      isOpen = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }

    return isOpen
      ? { isOpen: true, labelEn: 'Open Now', labelBn: 'এখন খোলা' }
      : { isOpen: false, labelEn: 'Closed', labelBn: 'এখন বন্ধ' };
  } catch {
    return { isOpen: true, labelEn: 'Open', labelBn: 'খোলা' };
  }
}

// Free reverse geocoding via OpenStreetMap Nominatim
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { 'User-Agent': 'KothayKhaboApp/1.0' } }
    );
    const data = await res.json();
    const addr = data.address || {};
    return addr.suburb || addr.neighbourhood || addr.city_district || addr.city || addr.town || addr.county || 'My Location';
  } catch {
    return 'My Location';
  }
}

// Free search geocoding for any location in Bangladesh or worldwide
export async function searchLocation(query: string): Promise<UserCoordinates[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=bd`,
      { headers: { 'User-Agent': 'KothayKhaboApp/1.0' } }
    );
    const data = await res.json();
    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      areaName: item.display_name.split(',')[0],
    }));
  } catch {
    return [];
  }
}
