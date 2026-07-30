import React, { useState } from 'react';
import { CrisisScanRequest } from '../types';
import { ShieldAlert, Zap, ArrowRight, Mic, MapPin, Wind, Flame, CloudRain, Activity } from 'lucide-react';

interface CrisisFormProps {
  onSubmit: (request: CrisisScanRequest) => void;
  isLoading: boolean;
  currentLocationName: string;
  currentLat: number;
  currentLng: number;
  currentProvider: CrisisScanRequest['provider'];
  offGridMode: boolean;
  language: CrisisScanRequest['language'];
}

export const CrisisForm: React.FC<CrisisFormProps> = ({
  onSubmit,
  isLoading,
  currentLocationName,
  currentLat,
  currentLng,
  currentProvider,
  offGridMode,
  language,
}) => {
  const [category, setCategory] = useState<CrisisScanRequest['category']>('Severe Flooding');
  const [incidentNotes, setIncidentNotes] = useState<string>('Rising water levels near river basin. Submerged access roads and isolated residential sectors.');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const categories = [
    { id: 'Severe Flooding', label: 'Severe Flooding', icon: <CloudRain className="w-4 h-4 text-cyan-400" /> },
    { id: 'Wildfire/Heatwave', label: 'Wildfire / Heatwave', icon: <Flame className="w-4 h-4 text-amber-400" /> },
    { id: 'Cyclone/Typhoon', label: 'Cyclone / Typhoon', icon: <Wind className="w-4 h-4 text-blue-400" /> },
    { id: 'Earthquake', label: 'Earthquake / Landslide', icon: <Activity className="w-4 h-4 text-red-400" /> },
  ];

  const handleVoiceInput = () => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIncidentNotes((prev) => `${prev} ${transcript}`);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      locationName: currentLocationName,
      latitude: currentLat,
      longitude: currentLng,
      category,
      incidentNotes,
      provider: currentProvider,
      offGridMode,
      language,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 border-cyan-500/30 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <span>Disaster Incident Operations Configurator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure target incident parameters to initiate Gemma 4 Autonomous Command Swarm
          </p>
        </div>
        <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/40">
          Command Active
        </span>
      </div>

      {/* Target Location Card Display */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-200 block">{currentLocationName}</span>
            <span className="text-[10px] font-mono-tech text-slate-500 block">
              Coordinates: {currentLat.toFixed(4)}°N, {currentLng.toFixed(4)}°E
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
          Map Synced
        </span>
      </div>

      {/* Disaster Category Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">Disaster Hazard Category</label>
        <div className="grid grid-cols-2 gap-2.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setCategory(cat.id as any)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center space-x-2.5 ${
                category === cat.id
                  ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300 font-semibold shadow-md ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {cat.icon}
              <span className="text-xs truncate">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Notes & Voice Dictation */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300">Field Reporter Notes & Telemetry Observations</label>
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border transition-all ${
              isRecording
                ? 'bg-red-950 border-red-500 text-red-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-purple-400 hover:border-purple-500'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
          </button>
        </div>

        <textarea
          rows={3}
          value={incidentNotes}
          onChange={(e) => setIncidentNotes(e.target.value)}
          placeholder="Describe observed infrastructure damage, weather escalation, road closures..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs font-mono-tech text-slate-200 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
        />
      </div>

      {/* Execute Command Swarm Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 hover:scale-[1.01]"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
            <span>Running Gemma 4 Command Swarm Pipeline...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-current" />
            <span>INITIATE GEMMA 4 COMMAND SWARM PIPELINE</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
