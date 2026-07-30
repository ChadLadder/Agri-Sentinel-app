import React from 'react';
import { CloudRain, Thermometer, Droplets, Wind, MapPin, Sliders, Navigation, Sun, CloudLightning, Search, X, Loader2 } from 'lucide-react';
import { WeatherData } from '../types';
import { fetchLiveWeather, searchLocations, reverseGeocode, GeocodingResult } from '../services/weather';
import { Language, t } from '../utils/i18n';

interface WeatherBarProps {
  weather: WeatherData;
  onUpdateWeather: (w: WeatherData) => void;
  language: Language;
  onOpenSimulator: () => void;
}

export const WeatherBar: React.FC<WeatherBarProps> = ({
  weather,
  onUpdateWeather,
  language,
  onOpenSimulator,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced geocoding search
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setShowDropdown(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = async (result: GeocodingResult) => {
    setShowDropdown(false);
    setSearchQuery('');
    setLoading(true);
    const data = await fetchLiveWeather(result.latitude, result.longitude, result.name);
    onUpdateWeather(data);
    setLoading(false);
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const locationLabel = await reverseGeocode(lat, lon);
        const data = await fetchLiveWeather(lat, lon, locationLabel);
        onUpdateWeather(data);
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLoading(false);
        alert('Could not acquire GPS position. Please check browser location permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl relative transition-all">
      {/* Top Controls Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        {/* Region, Custom Search & GPS Controls */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs shrink-0">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Field Region:</span>
          </div>

          {/* Search Any Custom Location Input */}
          <div className="relative min-w-[220px] sm:w-72 flex-1 sm:flex-initial" ref={dropdownRef}>
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                placeholder="Search any village, town or city..."
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl pl-8 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full shadow-2xs"
              />
              {isSearching ? (
                <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin absolute right-2.5" />
              ) : searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>

            {/* Geocoding Search Dropdown Results */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto min-w-[280px]">
                {searchResults.length > 0 ? (
                  searchResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelectSearchResult(r)}
                      className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 truncate">{r.name}</div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3.5 py-3 text-xs text-slate-500 text-center font-medium">
                    {isSearching ? 'Searching...' : 'No matching location found'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* GPS Location Button */}
          <button
            onClick={handleUseGeolocation}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-xl transition-all border border-slate-200 cursor-pointer shadow-2xs shrink-0"
            title="Locate via GPS"
          >
            <Navigation className={`w-3.5 h-3.5 text-sky-600 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Locating...' : 'GPS'}</span>
          </button>

          {weather.isSimulated && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-amber-300 font-bold shrink-0">
              [SIMULATED]
            </span>
          )}
        </div>

        {/* Action Button: Simulator */}
        <div className="flex items-center justify-end shrink-0">
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-2 text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer hover:scale-[1.02] shrink-0"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Climate Simulator</span>
          </button>
        </div>
      </div>

      {/* Main Temperature Hero Display */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            Local Weather Intelligence
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {weather.locationName}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {weather.conditionText}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter">
              {weather.temperature}°
            </span>
            <span className="text-lg font-bold text-slate-400">C</span>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
            {weather.humidity > 85 ? (
              <CloudRain className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : weather.temperature > 32 ? (
              <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <CloudLightning className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </div>
        </div>
      </div>

      {/* Apple Weather Style Grid Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Temp Card */}
        <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/40 border border-amber-200/60 rounded-2xl p-3.5 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-amber-900/80 uppercase tracking-wider truncate">
              {t('temperature', language)}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {weather.temperature}°C
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-gradient-to-br from-sky-50/80 to-sky-100/40 border border-sky-200/60 rounded-2xl p-3.5 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-sky-900/80 uppercase tracking-wider truncate">
              {t('humidity', language)}
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-700 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {weather.humidity}% <span className="text-xs font-semibold text-sky-700">RH</span>
          </div>
        </div>

        {/* Rainfall Card */}
        <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/40 border border-blue-200/60 rounded-2xl p-3.5 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-blue-900/80 uppercase tracking-wider truncate">
              {t('rainfall', language)}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-700 flex items-center justify-center shrink-0">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {weather.rainfall} <span className="text-xs font-semibold text-blue-700">mm</span>
          </div>
        </div>

        {/* Wind Speed Card */}
        <div className="bg-gradient-to-br from-teal-50/80 to-teal-100/40 border border-teal-200/60 rounded-2xl p-3.5 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-teal-900/80 uppercase tracking-wider truncate">
              {t('wind', language)}
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-700 flex items-center justify-center shrink-0">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {weather.windSpeed} <span className="text-xs font-semibold text-teal-700">km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

