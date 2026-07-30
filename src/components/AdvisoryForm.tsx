import React, { useState, useRef, useEffect } from 'react';
import { AdvisoryRequest } from '../types';
import { Sprout, Mic, MapPin, AlertOctagon, Sparkles, Check, ChevronDown, Image as ImageIcon, Zap, Compass, ShieldCheck } from 'lucide-react';

interface AdvisoryFormProps {
  onSubmit: (request: AdvisoryRequest) => void;
  isLoading: boolean;
  currentProvider: AdvisoryRequest['provider'];
  offGridMode: boolean;
  currentLanguage: AdvisoryRequest['language'];
}

interface LocationOption {
  city: string;
  state: string;
  zone: string;
  humidity: string;
  temp: string;
  icon: string;
}

const INDIAN_AGRI_LOCATIONS: LocationOption[] = [
  { city: 'Coimbatore', state: 'Tamil Nadu', zone: 'Tropical Humid Spore Belt', humidity: '82%', temp: '31°C', icon: '🌴' },
  { city: 'Nashik', state: 'Maharashtra', zone: 'Semi-Arid Grape & Onion Belt', humidity: '65%', temp: '29°C', icon: '🍇' },
  { city: 'Ludhiana', state: 'Punjab', zone: 'Indo-Gangetic Wheat Rust Zone', humidity: '74%', temp: '28°C', icon: '🌾' },
  { city: 'Guntur', state: 'Andhra Pradesh', zone: 'Coastal Chilli Rot Region', humidity: '79%', temp: '33°C', icon: '🌶️' },
  { city: 'Wayanad', state: 'Kerala', zone: 'High Altitude Tea & Coffee Moisture', humidity: '88%', temp: '24°C', icon: '⛰️' },
  { city: 'Shimla', state: 'Himachal Pradesh', zone: 'Temperate Apple Scab Zone', humidity: '70%', temp: '21°C', icon: '🍎' },
  { city: 'Indore', state: 'Madhya Pradesh', zone: 'Malwa Plateau Soybean Belt', humidity: '62%', temp: '30°C', icon: '🌱' },
  { city: 'Karnal', state: 'Haryana', zone: 'Basmati Rice Blast Zone', humidity: '76%', temp: '29°C', icon: '🌾' },
  { city: 'Jaipur', state: 'Rajasthan', zone: 'Arid Mustard Mildew Belt', humidity: '48%', temp: '35°C', icon: '☀️' },
  { city: 'Pune', state: 'Maharashtra', zone: 'Western Ghats Vegetable Belt', humidity: '72%', temp: '27°C', icon: '🥦' },
];

export const AdvisoryForm: React.FC<AdvisoryFormProps> = ({
  onSubmit,
  isLoading,
  currentProvider,
  offGridMode,
  currentLanguage,
}) => {
  const [cropName, setCropName] = useState<string>('Tomato');
  const [symptoms, setSymptoms] = useState<string>('Dark concentric spots on lower leaves with yellow halos and premature leaf drop');
  const [locationInput, setLocationInput] = useState<string>('Coimbatore, Tamil Nadu');
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
  const [forceSimulateUnsafe, setForceSimulateUnsafe] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<string>('Tomato Early Blight');
  const locationRef = useRef<HTMLDivElement>(null);

  const visualDiseasePresets = [
    {
      id: 'tomato-blight',
      title: 'Tomato Early Blight',
      crop: 'Tomato',
      symptoms: 'Dark concentric target spots on lower foliage with bright yellow halos and progressive leaf drop.',
      badge: 'Fungal Pathogen',
      bgColor: 'border-red-500/50 bg-red-950/30 text-red-300',
      svgPattern: '🔴⬛🟡',
    },
    {
      id: 'rice-blight',
      title: 'Rice Bacterial Blight',
      crop: 'Rice',
      symptoms: 'Water-soaked wavy lesions starting at leaf margins, turning grayish-white with bacterial ooze drops.',
      badge: 'Bacterial Critical',
      bgColor: 'border-amber-500/50 bg-amber-950/30 text-amber-300',
      svgPattern: '🌾💧⚡',
    },
    {
      id: 'potato-blight',
      title: 'Potato Late Blight',
      crop: 'Potato',
      symptoms: 'Large dark brown water-soaked lesions with white downy fungal mold on leaf underside.',
      badge: 'Oomycete Outbreak',
      bgColor: 'border-purple-500/50 bg-purple-950/30 text-purple-300',
      svgPattern: '🥔🦠⛈️',
    },
    {
      id: 'chilli-rot',
      title: 'Chilli Fruit Rot / Anthracnose',
      crop: 'Chilli/Pepper',
      symptoms: 'Dark sunken circular lesions on maturing pods with pinkish spore rings and shoot dieback.',
      badge: 'Fruit Rot',
      bgColor: 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300',
      svgPattern: '🌶️⭕🍂',
    },
  ];

  const filteredLocations = INDIAN_AGRI_LOCATIONS.filter(
    (loc) =>
      `${loc.city} ${loc.state} ${loc.zone}`.toLowerCase().includes(locationInput.toLowerCase()) ||
      locationInput.length === 0
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: LocationOption) => {
    setLocationInput(`${loc.city}, ${loc.state}`);
    setShowLocationDropdown(false);
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = currentLanguage === 'ta' ? 'ta-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms((prev) => `${prev} ${transcript}`);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cropName,
      symptoms,
      location: locationInput,
      language: currentLanguage,
      provider: currentProvider,
      offGridMode,
      forceSimulateUnsafe,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 border-emerald-500/30 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Neon Accent Glow */}
      <div className="absolute -right-24 -top-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-24 -bottom-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10">
            <Sprout className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <span>Farmer Agronomic Diagnosis Suite</span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono-tech badge-emerald">Google Maps Smart Suggest</span>
            </h2>
            <p className="text-xs text-slate-400">Specify farm symptoms & select microclimate region for Gemma Swarm execution</p>
          </div>
        </div>
        <span className="text-xs font-mono-tech px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
          Step 1 of 2
        </span>
      </div>

      {/* Main Grid: Crop Select & Google Maps Style Location Autocomplete */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Crop Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
            <Sprout className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
            <span>Target Crop</span>
          </label>
          <select
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer font-medium"
          >
            <option value="Tomato">🍅 Tomato (தக்காளி / टमाटर)</option>
            <option value="Rice">🌾 Rice / Paddy (நெல் / चावल)</option>
            <option value="Potato">🥔 Potato (உருளைக்கிழங்கு / आलू)</option>
            <option value="Cotton">☁️ Cotton (பருத்தி / कपास)</option>
            <option value="Corn/Maize">🌽 Corn / Maize (மக்காச்சோளம் / मक्का)</option>
            <option value="Wheat">🌾 Wheat (கோலம்பம் / गेहूं)</option>
            <option value="Grape">🍇 Grape (திராட்சை / अंगूर)</option>
            <option value="Chilli/Pepper">🌶️ Chilli / Pepper (மிளகாய் / मिर्च)</option>
          </select>
        </div>

        {/* Google Maps Interactive Autocomplete Location Dropdown */}
        <div ref={locationRef} className="relative">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
              <span>Farm Region / Microclimate Location</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-mono-tech flex items-center space-x-1">
              <Compass className="w-3 h-3 text-cyan-400 animate-spin" />
              <span>Maps Autocomplete</span>
            </span>
          </label>

          <div className="relative">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                setShowLocationDropdown(true);
              }}
              onFocus={() => setShowLocationDropdown(true)}
              placeholder="Type city or state (e.g. Coimbatore, Nashik, Punjab)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 pr-10 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono-tech text-xs"
            />
            <div
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="absolute right-3 top-3 cursor-pointer p-0.5 rounded hover:bg-slate-800 text-slate-400"
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* 1-Click Quick Location Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {INDIAN_AGRI_LOCATIONS.slice(0, 5).map((loc) => (
              <button
                key={loc.city}
                type="button"
                onClick={() => handleSelectLocation(loc)}
                className={`text-[10px] font-mono-tech px-2 py-0.5 rounded-lg border transition-all flex items-center space-x-1 ${
                  locationInput.includes(loc.city)
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{loc.icon}</span>
                <span>{loc.city}</span>
              </button>
            ))}
          </div>

          {/* Floating Maps-Style Autocomplete Dropdown List */}
          {showLocationDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-slate-950/95 border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto divide-y divide-slate-800/80 backdrop-blur-xl animate-fadeIn">
              <div className="px-3 py-1.5 bg-slate-900 text-[10px] font-mono-tech text-slate-400 flex items-center justify-between border-b border-slate-800">
                <span>SUGGESTED AGRICULTURAL MICROCLIMATE ZONES</span>
                <span>{filteredLocations.length} Matching Regions</span>
              </div>
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <div
                    key={`${loc.city}-${loc.state}`}
                    onClick={() => handleSelectLocation(loc)}
                    className="p-3 hover:bg-slate-900 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm">
                        {loc.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 flex items-center space-x-1.5">
                          <span>{loc.city}, {loc.state}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{loc.zone}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 block">
                        RH: {loc.humidity}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono-tech mt-0.5 block">{loc.temp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-xs text-slate-400 text-center">
                  Use "{locationInput}" as custom location
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Visual Crop Disease Pathology Cards (1-Click Auto-Fill) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Pathology Visual Sample Library (1-Click Auto-Fill)</span>
          </span>
          <span className="text-[10px] font-mono-tech text-purple-400">Click to load symptoms</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {visualDiseasePresets.map((vp) => (
            <div
              key={vp.id}
              onClick={() => {
                setCropName(vp.crop);
                setSymptoms(vp.symptoms);
                setSelectedPhotoPreset(vp.title);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] flex flex-col justify-between ${
                selectedPhotoPreset === vp.title
                  ? `${vp.bgColor} shadow-lg ring-1 ring-cyan-500/50`
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-200 truncate">{vp.title}</span>
                <span className="text-xs">{vp.svgPattern}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-mono-tech">
                {vp.symptoms}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono-tech">
                <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 text-cyan-400">{vp.crop}</span>
                <span className="text-emerald-400 font-bold">1-Click Load</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observed Symptoms Text Area & Voice Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300">Detailed Observed Leaf / Stem / Fruit Symptoms</label>
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border transition-all ${
              isRecording
                ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse shadow-lg shadow-red-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-purple-400" />
            <span>{isRecording ? 'Listening Dictation...' : 'Voice Dictate'}</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe observed leaf spots, wilting, rust pustules, bacterial ooze, stem rot..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none font-mono-tech text-xs"
        />
      </div>

      {/* Judge Interactive Security Toggle */}
      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-amber-300">Hackathon Judge Demo Toggle</span>
            <p className="text-[11px] text-slate-400">
              Inject an unapproved chemical ("Paraquat") to test live Gemma Safety Shield Guardrail interception.
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
          <input
            type="checkbox"
            checked={forceSimulateUnsafe}
            onChange={(e) => setForceSimulateUnsafe(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 hover:scale-[1.01]"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
            <span>Running Gemma Multi-Agent Swarm Pipeline...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-current" />
            <span>Diagnose & Run Gemma Swarm Pipeline</span>
          </>
        )}
      </button>
    </form>
  );
};
