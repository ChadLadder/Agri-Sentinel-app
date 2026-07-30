import React, { useState, useRef, useEffect } from 'react';
import { AdvisoryRequest } from '../types';
import { Sprout, Mic, MapPin, AlertOctagon, Sparkles, Check, ChevronDown, Image as ImageIcon } from 'lucide-react';

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
}

const INDIAN_AGRI_LOCATIONS: LocationOption[] = [
  { city: 'Coimbatore', state: 'Tamil Nadu', zone: 'Tropical Humid Spore Risk', humidity: '82%' },
  { city: 'Nashik', state: 'Maharashtra', zone: 'Semi-Arid Grape Belt', humidity: '65%' },
  { city: 'Ludhiana', state: 'Punjab', zone: 'Continental Dew Rust Zone', humidity: '74%' },
  { city: 'Guntur', state: 'Andhra Pradesh', zone: 'Coastal Chilli Anthracnose Belt', humidity: '79%' },
  { city: 'Wayanad', state: 'Kerala', zone: 'High Altitude Humid Fungal', humidity: '88%' },
  { city: 'Shimla', state: 'Himachal Pradesh', zone: 'Temperate Apple Scab Zone', humidity: '70%' },
  { city: 'Indore', state: 'Madhya Pradesh', zone: 'Central Plateau Soybean Zone', humidity: '62%' },
  { city: 'Karnal', state: 'Haryana', zone: 'Indo-Gangetic Rice Blast Belt', humidity: '76%' },
];

export const AdvisoryForm: React.FC<AdvisoryFormProps> = ({
  onSubmit,
  isLoading,
  currentProvider,
  offGridMode,
  currentLanguage,
}) => {
  const [cropName, setCropName] = useState<string>('Tomato');
  const [symptoms, setSymptoms] = useState<string>('Dark concentric spots on lower leaves with yellow halos and leaf drop');
  const [locationInput, setLocationInput] = useState<string>('Coimbatore, Tamil Nadu');
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
  const [forceSimulateUnsafe, setForceSimulateUnsafe] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const samplePresets = [
    {
      name: 'Tomato Early Blight',
      crop: 'Tomato',
      symptoms: 'Dark concentric spots on lower leaves yellow halo leaf drops stem rot',
      tag: 'Fungal Risk',
      color: 'from-red-500/20 to-orange-500/20 border-red-500/40 text-red-300',
    },
    {
      name: 'Rice Bacterial Blight',
      crop: 'Rice',
      symptoms: 'Water-soaked lesions on leaf margins turning yellow-white wilting drying',
      tag: 'Bacterial Critical',
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300',
    },
    {
      name: 'Potato Late Blight',
      crop: 'Potato',
      symptoms: 'Dark water-soaked patches on leaves white fungal growth underneath stem rot',
      tag: 'Critical Outbreak',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300',
    },
    {
      name: 'Chilli Fruit Rot',
      crop: 'Chilli/Pepper',
      symptoms: 'Sunken circular dark lesions on fruit yellowing foliage shoot dieback',
      tag: 'Anthracnose',
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300',
    },
  ];

  // Location suggestions filter
  const filteredLocations = INDIAN_AGRI_LOCATIONS.filter(
    (loc) =>
      `${loc.city} ${loc.state} ${loc.zone}`.toLowerCase().includes(locationInput.toLowerCase())
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
    <form onSubmit={handleSubmit} className="glass-panel p-6 border-emerald-500/20 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
            <Sprout className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <span>Farmer Agronomic Diagnosis Suite</span>
              <span className="px-2 py-0.5 text-[10px] badge-emerald">Interactive Diagnosis</span>
            </h2>
            <p className="text-xs text-slate-400">Enter crop symptoms or select location for AI microclimate matching</p>
          </div>
        </div>
      </div>

      {/* Main Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Crop Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
            <Sprout className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
            <span>Target Crop</span>
          </label>
          <select
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer"
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

        {/* Location Input with Interactive Autocomplete Suggestions */}
        <div ref={locationRef} className="relative">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
              <span>Farm Region / Microclimate Location</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-mono-tech">Auto-Suggest Active</span>
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
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-3 pr-9 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Autocomplete Dropdown List */}
          {showLocationDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-slate-800/60 backdrop-blur-md">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <div
                    key={`${loc.city}-${loc.state}`}
                    onClick={() => handleSelectLocation(loc)}
                    className="p-2.5 hover:bg-slate-800/80 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 flex items-center space-x-1.5">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{loc.city}, {loc.state}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{loc.zone}</span>
                    </div>
                    <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                      RH: {loc.humidity}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-xs text-slate-400 text-center">
                  Press enter to use "{locationInput}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Symptom Input & Voice Dictation */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300">Observed Leaf, Stem & Fruit Symptoms</label>
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
            <span>{isRecording ? 'Listening Voice...' : 'Voice Dictate'}</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe observed yellowing, dark spots, wilting, powdery coating, stem rot..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none font-mono-tech text-xs"
        />
      </div>

      {/* 1-Click Interactive Diagnostic Cards */}
      <div className="mt-4">
        <span className="text-[11px] font-semibold text-slate-400 block mb-2">1-Click Sample Diagnostic Cases:</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {samplePresets.map((sp) => (
            <div
              key={sp.name}
              onClick={() => {
                setCropName(sp.crop);
                setSymptoms(sp.symptoms);
              }}
              className={`p-2.5 rounded-xl border bg-gradient-to-br ${sp.color} cursor-pointer hover:scale-[1.03] transition-all flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold truncate">{sp.name}</span>
                <Check className="w-3 h-3 opacity-60" />
              </div>
              <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-slate-950/60 w-fit">
                {sp.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Judge Interactive Security Toggle */}
      <div className="mt-5 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-amber-300">Hackathon Judge Demo Toggle</span>
            <p className="text-[11px] text-slate-400">
              Inject an unapproved toxic chemical ("Paraquat") to test live Gemma Safety Shield interception.
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
        className="w-full mt-6 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01]"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
            <span>Running Gemma Multi-Agent Swarm...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Diagnose & Run Gemma Swarm Pipeline</span>
          </>
        )}
      </button>
    </form>
  );
};
