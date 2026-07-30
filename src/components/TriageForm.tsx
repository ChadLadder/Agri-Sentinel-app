import React, { useState } from 'react';
import { TriageRequest } from '../types';
import { CLINICAL_EMERGENCY_PRESETS } from '../data/emergencies';
import { ShieldAlert, HeartPulse, Activity, Zap, Check, ArrowRight, Mic, MapPin } from 'lucide-react';

interface TriageFormProps {
  onSubmit: (request: TriageRequest) => void;
  isLoading: boolean;
  currentProvider: TriageRequest['provider'];
  offGridMode: boolean;
  language: TriageRequest['language'];
}

export const TriageForm: React.FC<TriageFormProps> = ({
  onSubmit,
  isLoading,
  currentProvider,
  offGridMode,
  language,
}) => {
  const [patientSymptoms, setPatientSymptoms] = useState<string>(CLINICAL_EMERGENCY_PRESETS[0].symptoms);
  const [category, setCategory] = useState<TriageRequest['category']>('Hemorrhage/Bleeding');
  const [location, setLocation] = useState<string>('Coimbatore, Tamil Nadu (Disaster Zone)');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('severe-hemorrhage');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = CLINICAL_EMERGENCY_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setPatientSymptoms(found.symptoms);
      setCategory(found.category);
    }
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPatientSymptoms((prev) => `${prev} ${transcript}`);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      patientSymptoms,
      category,
      location,
      language,
      provider: currentProvider,
      offGridMode,
      selectedPresetId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 border-red-500/30 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
            <span>Emergency Medical Triage & First-Responder Input</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Describe victim symptoms or tap 1-click clinical crisis presets for instant WHO protocol execution.
          </p>
        </div>
        <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded-lg bg-red-950 text-red-400 border border-red-500/40">
          🚨 Golden Hour Active
        </span>
      </div>

      {/* 1-Click Clinical Emergency Presets */}
      <div>
        <span className="text-xs font-semibold text-slate-300 block mb-2">1-Tap Clinical Crisis Scenarios:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CLINICAL_EMERGENCY_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] flex items-center justify-between ${
                selectedPresetId === preset.id
                  ? 'bg-red-950/40 border-red-500/60 text-red-300 font-semibold shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-200 block">{preset.title}</span>
                <span className="text-[10px] text-slate-400 font-mono-tech mt-0.5 block">{preset.triagePriority}</span>
              </div>
              {selectedPresetId === preset.id && <Check className="w-4 h-4 text-red-400 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Category & Location Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
            <HeartPulse className="w-3.5 h-3.5 text-red-400 mr-1.5" />
            <span>Emergency Category</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-slate-200 focus:outline-none focus:border-red-500 font-medium"
          >
            <option value="Hemorrhage/Bleeding">🩸 Arterial Hemorrhage / Bleeding</option>
            <option value="Cardiac Distress">🫀 Cardiac Arrest / CPR Protocol</option>
            <option value="Snake Bite">🐍 Snake Bite / Envenomation</option>
            <option value="Burn Injury">🔥 Third-Degree Thermal Burn</option>
            <option value="Heatstroke">☀️ Severe Heatstroke / Collapse</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
            <span>Disaster Zone Location</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-xs font-mono-tech text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Observed Symptoms Text Area & Voice Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300">Observed Trauma Symptoms & Vitals</label>
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
          rows={4}
          value={patientSymptoms}
          onChange={(e) => setPatientSymptoms(e.target.value)}
          placeholder="Describe bleeding, pulse rate, skin color, consciousness level, respiratory effort..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono-tech text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all resize-none leading-relaxed"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-500 via-rose-600 to-amber-600 hover:from-red-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-red-500/25 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 hover:scale-[1.01]"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
            <span>Executing Gemma 4 Emergency Triage Swarm...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-current" />
            <span>🚨 START EMERGENCY TRIAGE & FIRST-AID PROTOCOL</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
