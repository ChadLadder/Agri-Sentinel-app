import React, { useState } from 'react';
import { TriageResult as TriageResultType } from '../types';
import { ShieldAlert, Volume2, VolumeX, CheckSquare, AlertOctagon, Heart, Clock, Activity, Ambulance } from 'lucide-react';
import { speakAdvisoryText, stopSpeech } from '../services/ttsService';

interface TriageResultProps {
  result: TriageResultType;
}

export const TriageResult: React.FC<TriageResultProps> = ({ result }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      speakAdvisoryText(result.voiceAdvisoryText, 'en');
      setIsPlayingAudio(true);
    }
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="glass-panel p-6 space-y-6 animate-fadeIn border-red-500/30 shadow-2xl">
      {/* Top Banner: Triage Priority Score & Audio Warning */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-red-950 text-red-400 border border-red-500/50 uppercase tracking-wide">
              {result.triagePriority}
            </span>
            <span className="text-xs font-mono-tech px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
              {result.icdCode}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 mt-2">{result.emergencyTitle}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Golden Hour Survival Window: <strong className="text-amber-400 font-mono-tech">{result.goldenWindowMinutes} Minutes</strong></p>
        </div>

        <button
          onClick={handleToggleAudio}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shrink-0 border ${
            isPlayingAudio
              ? 'bg-purple-950 border-purple-500 text-purple-300 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
          }`}
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4 text-purple-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
          <span>{isPlayingAudio ? 'Stop Audio' : 'Listen Voice First-Aid'}</span>
        </button>
      </div>

      {/* Physiological Vital Signs Monitor */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono-tech block">HEART RATE</span>
          <span className="text-xs font-bold text-red-400 font-mono-tech mt-0.5 block">{result.vitalSigns.heartRate}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono-tech block">BLOOD PRESSURE</span>
          <span className="text-xs font-bold text-amber-400 font-mono-tech mt-0.5 block">{result.vitalSigns.bloodPressure}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono-tech block">OXYGEN SATO2</span>
          <span className="text-xs font-bold text-cyan-400 font-mono-tech mt-0.5 block">{result.vitalSigns.oxygenSat}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono-tech block">RESPIRATION</span>
          <span className="text-xs font-bold text-purple-400 font-mono-tech mt-0.5 block">{result.vitalSigns.respiratoryRate}</span>
        </div>
      </div>

      {/* Step-by-Step Emergency First-Aid Action Checklist */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-2">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <span>Immediate Bystander First-Aid Action Steps</span>
        </h3>
        <div className="space-y-2 text-xs">
          {result.firstAidSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                checkedSteps[idx]
                  ? 'bg-emerald-950/40 border-emerald-500/40 line-through text-slate-500'
                  : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                  checkedSteps[idx] ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-700'
                }`}
              >
                {checkedSteps[idx] && '✓'}
              </div>
              <span className="font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Warnings (What NOT To Do) */}
      <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
        <h3 className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 text-red-400" />
          <span>Critical Medical Warnings (DO NOT DO)</span>
        </h3>
        <div className="space-y-2 text-xs">
          {result.doNotDoWarnings.map((warn, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-red-300 bg-slate-950 p-3 rounded-xl border border-slate-850">
              <span className="text-red-400 font-bold mt-0.5">•</span>
              <span>{warn}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
