import React, { useState } from 'react';
import { SafetyScanResult } from '../types';
import { ShieldAlert, ShieldCheck, AlertOctagon, CheckCircle, Volume2, VolumeX, AlertTriangle, ArrowRight, CornerDownRight } from 'lucide-react';
import { speakAdvisoryText, stopSpeech } from '../services/ttsService';

interface SafetyResultProps {
  result: SafetyScanResult;
}

export const SafetyResult: React.FC<SafetyResultProps> = ({ result }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const isScam = result.threatLevel === 'Critical Scam' || result.threatLevel === 'High Risk';

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      speakAdvisoryText(result.voiceAdvisoryText, 'en');
      setIsPlayingAudio(true);
    }
  };

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="glass-panel p-6 space-y-6 animate-fadeIn border-emerald-500/20 shadow-2xl">
      {/* Top Banner: Big Plain-English Safety Verdict */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isScam
            ? 'bg-red-950/40 border-red-500/50 text-red-300'
            : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
        }`}
      >
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-current shrink-0 mt-0.5">
            {isScam ? <ShieldAlert className="w-7 h-7 text-red-400" /> : <ShieldCheck className="w-7 h-7 text-emerald-400" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold uppercase tracking-wide">
                {result.threatLevel} DETECTED
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono-tech bg-slate-900 border border-slate-800 text-slate-300">
                {result.scamType}
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed max-w-xl">
              {result.plainEnglishVerdict}
            </p>
          </div>
        </div>

        {/* Listen Voice Advisory Button */}
        <button
          onClick={handleToggleAudio}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shrink-0 border ${
            isPlayingAudio
              ? 'bg-purple-950 border-purple-500 text-purple-300 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
          }`}
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4 text-purple-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
          <span>{isPlayingAudio ? 'Stop Audio' : 'Listen Voice Warning'}</span>
        </button>
      </div>

      {/* Red Flags Breakdown */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 text-amber-400" />
          <span>Why SentryGuard Flagged This Message (Red Flags)</span>
        </h3>
        <div className="space-y-2 text-xs">
          {result.keyRedFlags.map((flag, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-850">
              <span className="text-amber-400 font-bold mt-0.5">•</span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended 1-Tap Action Steps */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>What You Should Do Now (Action Checklist)</span>
        </h3>
        <div className="space-y-2 text-xs">
          {result.actionChecklist.map((step, idx) => (
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
    </div>
  );
};
