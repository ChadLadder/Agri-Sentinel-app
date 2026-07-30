import React, { useEffect, useRef, useState } from 'react';
import { MapLocationMarker } from '../types';
import { GLOBAL_DISASTER_MARKERS } from '../data/disasters';
import { searchGeocodingLocations, GeocodingResult } from '../services/weatherService';
import { MapPin, Navigation, Search, Layers, Compass, Loader2, Globe } from 'lucide-react';

interface LiveMapExplorerProps {
  onSelectLocation: (locationName: string, lat: number, lng: number) => void;
  selectedMarkerId?: string;
}

declare const L: any;

export const LiveMapExplorer: React.FC<LiveMapExplorerProps> = ({ onSelectLocation, selectedMarkerId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [tileMode, setTileMode] = useState<'dark' | 'satellite' | 'street'>('dark');

  // Initialize Real Leaflet Interactive Map Canvas
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof L === 'undefined') return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [15.0, 78.0],
        zoom: 5,
        zoomControl: false,
      });

      // Dark Matter CartoDB Basemap Tiles
      const darkTile = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      );

      darkTile.addTo(map);
      mapInstanceRef.current = map;

      // Add Custom Marker Pin Points
      GLOBAL_DISASTER_MARKERS.forEach((markerData) => {
        const markerIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div class="w-8 h-8 rounded-full bg-red-500/30 border-2 border-red-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-red-500/50 animate-pulse">
                  📍
                </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([markerData.lat, markerData.lng], { icon: markerIcon }).addTo(map);

        marker.bindPopup(`
          <div style="color: #0f172a; font-family: sans-serif; padding: 4px;">
            <strong style="font-size: 13px;">${markerData.name}</strong><br/>
            <span style="font-size: 11px; color: #ef4444; font-weight: bold;">${markerData.category} (${markerData.severity})</span><br/>
            <span style="font-size: 10px; color: #64748b;">Population at Risk: ${markerData.populationAtRisk.toLocaleString()}</span>
          </div>
        `);

        marker.on('click', () => {
          onSelectLocation(markerData.name, markerData.lat, markerData.lng);
        });

        markersRef.current[markerData.id] = marker;
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Debounced Real Geocoding Search
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
        const name = `GPS Incident Zone (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
        onSelectLocation(name, lat, lng);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 11, { animate: true });
        }
      },
      (err) => {
        setIsLocatingGPS(false);
        alert('Could not retrieve GPS coordinates. Please select from the map.');
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
              <span>Interactive OpenStreetMap & Geocoding Canvas</span>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech badge-cyan">Leaflet v1.9</span>
            </h3>
            <p className="text-xs text-slate-400">Click anywhere on the map or type a location to deploy Gemma 4 Command Swarm</p>
          </div>
        </div>

        {/* GPS Location Button */}
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
            placeholder="Type any location worldwide (e.g. Coimbatore, Chennai, London, California)..."
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

        {/* Real-time Worldwide Places Search Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-slate-950/95 border border-cyan-500/50 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-800/80 backdrop-blur-2xl">
            {searchResults.map((res) => (
              <div
                key={`${res.latitude}-${res.longitude}`}
                onClick={() => handleSelectSearchResult(res)}
                className="p-3 hover:bg-slate-900 cursor-pointer transition-all flex items-center justify-between group text-xs"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-bold text-slate-200 group-hover:text-cyan-300">{res.displayText}</span>
                </div>
                <span className="text-[10px] font-mono-tech text-slate-500">
                  {res.latitude.toFixed(2)}°N, {res.longitude.toFixed(2)}°E
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preset Incident Marker Chips */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[11px] font-mono-tech text-slate-400 self-center mr-1">Active Crisis Hotspots:</span>
        {GLOBAL_DISASTER_MARKERS.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              onSelectLocation(m.name, m.lat, m.lng);
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([m.lat, m.lng], 9, { animate: true });
              }
            }}
            className="text-[10px] font-mono-tech px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-300 transition-all flex items-center space-x-1"
          >
            <span>🚨</span>
            <span>{m.name.split(',')[0]}</span>
          </button>
        ))}
      </div>

      {/* Real Leaflet Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-[340px] z-10" />
      </div>
    </div>
  );
};
