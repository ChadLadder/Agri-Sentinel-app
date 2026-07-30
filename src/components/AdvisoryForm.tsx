import React, { useState } from 'react';
import { AdvisoryRequest } from '../types';
import { Sprout, Mic, Camera, MapPin, AlertOctagon, Sparkles, Send } from 'lucide-react';

interface AdvisoryFormProps {
  onSubmit: (request: AdvisoryRequest) => void;
  isLoading: boolean;
  currentProvider: AdvisoryRequest['provider'];
  offGridMode: boolean;
  currentLanguage: AdvisoryRequest['language'];
}

export const AdvisoryForm: React.FC<AdvisoryFormProps> = ({
  onSubmit,
  isLoading,
  currentProvider,
  offGridMode,
  currentLanguage,
}) => {
  const [cropName, setCropName] = useState<string>('Tomato');
  const [symptoms, setSymptoms] = useState<string>('Dark concentric spots on lower leaves with yellow halos');
  const [location, setLocation] = useState<string>('Coimbatore, Tamil Nadu');
  const [forceSimulateUnsafe, setForceSimulateUnsafe] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const sampleCrops = [
    { name: 'Tomato', symptom: 'Dark concentric spots on lower leaves yellow halo leaf drops' },
    { name: 'Rice', symptom: 'Water-soaked lesions on leaf margins turning yellow-white wilting' },
    { name: 'Potato', symptom: 'Dark water-soaked patches on leaves white fungal growth underneath stem rot' },
    { name: 'Cotton', symptom: 'Yellowing of leaf veins drooping vascular discoloration stunting' },
    { name: 'Wheat', symptom: 'White greyish powdery spots on upper leaf surfaces leaf curling' },
  ];

  const handleVoiceInput = () => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
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
      location,
      language: currentLanguage,
      provider: currentProvider,
      offGridMode,
      forceSimulateUnsafe,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Sprout className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-slate-100">Farmer Agronomic Diagnosis Input</h2>
        </div>
        <span className="text-xs text-slate-400">Step 1 of 2</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Crop Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Target Crop</label>
          <select
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
          >
            <option value="Tomato">Tomato (தக்காளி / टमाटर)</option>
            <option value="Rice">Rice / Paddy (நெல் / चावल)</option>
            <option value="Potato">Potato (உருளைக்கிழங்கு / आलू)</option>
            <option value="Cotton">Cotton (பருத்தி / कपास)</option>
            <option value="Corn/Maize">Corn / Maize (மக்காச்சோளம் / मक्का)</option>
            <option value="Wheat">Wheat (கோலம்பம் / गेहूं)</option>
            <option value="Grape">Grape (திராட்சை / अंगूर)</option>
            <option value="Chilli/Pepper">Chilli / Pepper (மிளகாய் / मिर्च)</option>
          </select>
        </div>

        {/* Location Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1" />
            <span>Farm Region / Microclimate Location</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Coimbatore, Tamil Nadu"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Symptom Input & Voice */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-slate-300">Observed Leaf / Stem Symptoms</label>
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1 border transition-all ${
              isRecording
                ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe leaf spots, color changes, wilting, rust, fungal mold..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all resize-none"
        />
      </div>

      {/* Quick Sample Presets */}
      <div className="mt-3">
        <span className="text-[11px] text-slate-400 mr-2">Quick Test Presets:</span>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {sampleCrops.map((sc) => (
            <button
              key={sc.name}
              type="button"
              onClick={() => {
                setCropName(sc.name);
                setSymptoms(sc.symptom);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
            >
              {sc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Judge Demo Toggle: Simulate Hallucinated Unsafe Chemical */}
      <div className="mt-5 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-amber-300">Hackathon Judge Demo Toggle</span>
            <p className="text-[11px] text-slate-400">
              Force Strategy Agent to output an unapproved chemical to test Gemma Safety Shield interception live.
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
        className="w-full mt-5 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
            <span>Running Gemma Multi-Agent Swarm...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Diagnose & Run Gemma Swarm</span>
          </>
        )}
      </button>
    </form>
  );
};
