import React, { useEffect, useRef, useState } from 'react';
import { searchGeocodingLocations, GeocodingResult } from '../services/weatherService';
import { MapPin, Navigation, Search, Loader2, Globe } from 'lucide-react';

interface LiveMapExplorerProps {
  onSelectLocation: (locationName: string, lat: number, lng: number) => void;
}

declare const L: any;

const PRESET_HOTSPOTS = [
  { name: 'Coimbatore Delta, TN', lat: 11.0168, lng: 76.9558 },
  { name: 'Nashik Grape Belt, MH', lat: 19.9975, lng: 73.7898 },
  { name: 'Ludhiana Wheat Zone, PB', lat: 30.9010, lng: 75.8573 },
  { name: 'Guntur Chilli Belt, AP', lat: 16.3067, lng: 80.4365 },
  { name: 'Shimla Apple Valley, HP', lat: 31.1048, lng: 77.1734 },
];

export const LiveMapExplorer: React.FC<LiveMapExplorerProps> = ({ onSelectLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof L === 'undefined') return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [15.0, 78.0],
        zoom: 5,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add preset markers
      PRESET_HOTSPOTS.forEach((spot) => {
        const icon = L.divIcon({
          className: 'custom-leaflet-pin',
          html: `<div class="w-8 h-8 rounded-full bg-cyan-500/30 border-2 border-cyan-400 flex items-center justify-center text-xs text-white shadow-lg shadow-cyan-500/50 animate-pulse">📍</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(map);
        marker.bindPopup(`<b>${spot.name}</b><br/>Lat: ${spot.lat}, Lng: ${spot.lng}`);
        marker.on('click', () => {
          onSelectLocation(spot.name, spot.lat, spot.lng);
        });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchGeocodingLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = (res: GeocodingResult) => {
    setSearchQuery(res.displayText);
    setShowDropdown(false);
    onSelectLocation(res.displayText, res.latitude, res.longitude);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([res.latitude, res.longitude], 10, { animate: true });
    }
  };

  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setIsLocatingGPS(false);
        const name = `GPS Pin (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
        onSelectLocation(name, lat, lng);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 11, { animate: true });
        }
      },
      (err) => {
        setIsLocatingGPS(false);
        alert('Could not retrieve GPS location.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="glass-panel p-5 my-6 border-cyan-500/20 shadow-2xl space-y-4">
      {/* Top Map Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Globe className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>Interactive Leaflet Map & Real Geocoding Search Engine</span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech badge-cyan">Leaflet v1.9</span>
            </h3>
            <p className="text-xs text-slate-400">Click any pin or type a location to run OmniGemma 4 Multi-API Telemetry</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGPSDetect}
          disabled={isLocatingGPS}
          className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0"
        >
          {isLocatingGPS ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span>{isLocatingGPS ? 'Locating GPS...' : '📍 GPS Live Map Pin'}</span>
        </button>
      </div>

      {/* Geocoding Search Bar */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Type any city worldwide (e.g. Coimbatore, Delhi, Salem, London)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 pr-10 text-xs font-mono-tech text-slate-200 focus:outline-none focus:border-cyan-500"
          />
          <div className="absolute right-3 top-3">
            {isSearching ? (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </div>

        {showDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-slate-950/95 border border-cyan-500/50 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-800/80 backdrop-blur-2xl">
            {searchResults.map((res) => (
              <div
                key={`${res.latitude}-${res.longitude}`}
                onClick={() => handleSelectSearchResult(res)}
                className="p-3 hover:bg-slate-900 cursor-pointer transition-all flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-bold text-slate-200">{res.displayText}</span>
                </div>
                <span className="text-[10px] font-mono-tech text-slate-500">
                  {res.latitude.toFixed(2)}°N, {res.longitude.toFixed(2)}°E
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[11px] font-mono-tech text-slate-400 self-center mr-1">Active Incident Hotspots:</span>
        {PRESET_HOTSPOTS.map((spot) => (
          <button
            key={spot.name}
            onClick={() => {
              onSelectLocation(spot.name, spot.lat, spot.lng);
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([spot.lat, spot.lng], 9, { animate: true });
              }
            }}
            className="text-[10px] font-mono-tech px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-300 transition-all flex items-center space-x-1"
          >
            <span>📍</span>
            <span>{spot.name}</span>
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-[320px] z-10" />
      </div>
    </div>
  );
};
