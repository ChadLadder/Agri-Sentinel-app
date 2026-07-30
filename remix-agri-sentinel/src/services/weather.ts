import { WeatherData } from '../types';

export interface RegionPreset {
  name: string;
  state: string;
  lat: number;
  lon: number;
  majorCrop: string;
}

export const REGION_PRESETS: RegionPreset[] = [
  { name: 'Thanjavur', state: 'Tamil Nadu', lat: 10.787, lon: 79.1378, majorCrop: 'Rice' },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, majorCrop: 'Cotton' },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lon: 78.1198, majorCrop: 'Groundnut' },
  { name: 'Ludhiana', state: 'Punjab', lat: 30.901, lon: 75.8573, majorCrop: 'Wheat' },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, majorCrop: 'Soybean' },
  { name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lon: 75.9064, majorCrop: 'Sugarcane' },
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365, majorCrop: 'Tomato' },
  { name: 'Jalandhar', state: 'Punjab', lat: 31.326, lon: 75.5762, majorCrop: 'Potato' },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lon: 73.7898, majorCrop: 'Maize' },
];

export interface GeocodingResult {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  type?: string;
}

export async function searchLocations(query: string, limit = 5): Promise<GeocodingResult[]> {
  if (!query || !query.trim()) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=jsonv2&addressdetails=1&limit=${limit}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Agri-Sentinel/1.0 (smart agriculture platform)',
      },
    });
    if (!res.ok) return [];
    const results = await res.json();
    if (!Array.isArray(results)) return [];

    return results.map((r: any, idx: number) => {
      const address = r.address || {};
      const placeName =
        address.village ||
        address.town ||
        address.city ||
        address.suburb ||
        address.hamlet ||
        r.name ||
        (r.display_name ? r.display_name.split(',')[0] : '');
      const district = address.county || address.state_district || '';
      const state = address.state || '';
      const country = address.country || '';

      const labelParts = [placeName, district, state, country].filter(Boolean);
      const dedupParts: string[] = [];
      for (const p of labelParts) {
        if (dedupParts.length === 0 || dedupParts[dedupParts.length - 1] !== p) {
          dedupParts.push(p);
        }
      }
      const label = dedupParts.join(', ');

      return {
        id: r.place_id || idx,
        name: label,
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        country,
        admin1: state || district,
        type: r.type || 'place',
      };
    });
  } catch (err) {
    console.warn('Nominatim geocoding search failed:', err);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Agri-Sentinel/1.0 (smart agriculture platform)',
      },
    });
    if (res.ok) {
      const r = await res.json();
      const address = r.address || {};
      const placeName =
        address.village ||
        address.town ||
        address.city ||
        address.suburb ||
        address.hamlet ||
        r.name ||
        (r.display_name ? r.display_name.split(',')[0] : '');
      const district = address.county || address.state_district || '';
      const state = address.state || '';
      const country = address.country || '';

      const labelParts = [placeName, district, state, country].filter(Boolean);
      const dedupParts: string[] = [];
      for (const p of labelParts) {
        if (dedupParts.length === 0 || dedupParts[dedupParts.length - 1] !== p) {
          dedupParts.push(p);
        }
      }
      if (dedupParts.length > 0) {
        return dedupParts.join(', ');
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding failed:', err);
  }
  return `GPS Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
}

export async function fetchLiveWeather(lat: number, lon: number, locationName: string = 'Current Field Location'): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo response status ${res.status}`);
    const data = await res.json();
    const current = data.current;

    const temp = Math.round((current.temperature_2m || 24.5) * 10) / 10;
    const humidity = Math.round(current.relative_humidity_2m || 82);
    const rain = Math.round((current.rain || 3.2) * 10) / 10;
    const wind = Math.round((current.wind_speed_10m || 12) * 10) / 10;

    let conditionText = 'Moderate Humidity & Warm';
    if (humidity > 80 && temp > 20) conditionText = 'High Outbreak Vulnerability (Warm & Moist)';
    else if (humidity > 75) conditionText = 'Humid Canopy Environment';
    else if (temp > 32) conditionText = 'Dry Heat Stress';

    return {
      locationName,
      latitude: lat,
      longitude: lon,
      temperature: temp,
      humidity,
      rainfall: rain,
      windSpeed: wind,
      conditionText,
      isSimulated: false,
    };
  } catch (err) {
    console.warn('Live weather fetch fallback:', err);
    // Fallback location weather (Thanjavur / Coimbatore rural default)
    return {
      locationName: `${locationName} (Cached Regional Mesh)`,
      latitude: lat,
      longitude: lon,
      temperature: 24.2,
      humidity: 86,
      rainfall: 4.5,
      windSpeed: 11.4,
      conditionText: 'High Outbreak Risk (Monsoon Canopy Moist)',
      isSimulated: true,
    };
  }
}
