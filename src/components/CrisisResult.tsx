import React, { useState } from 'react';
import { CrisisScanResult } from '../types';
import { speakAdvisoryText, stopSpeech } from '../services/ttsService';
import { ShieldAlert, Volume2, VolumeX, Download, CheckSquare, Wind, Thermometer, Droplets, Compass, ShieldCheck } from 'lucide-react';

interface CrisisResultProps {
  result: CrisisScanResult;
}

export const CrisisResult: React.FC<CrisisResultProps> = ({ result }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      speakAdvisoryText(result.voiceBroadcastText, 'en');
      setIsPlayingAudio(true);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="glass-panel p-6 space-y-6 animate-fadeIn border-cyan-500/30 shadow-2xl">
      {/* Top Banner: Incident Severity & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-red-950 text-red-400 border border-red-500/50 uppercase tracking-wide">
              {result.severity}
            </span>
            <span className="text-xs font-mono-tech px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
              Risk Index: {result.riskIndexScore}/100
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 mt-2">{result.category}: {result.locationName}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Estimated Population at Risk: <strong className="text-amber-400 font-mono-tech">{result.affectedPopulation.toLocaleString()} Civilians</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Voice Broadcast Button */}
          <button
            onClick={handleToggleAudio}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all border ${
              isPlayingAudio
                ? 'bg-purple-950 border-purple-500 text-purple-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 text-purple-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
            <span>{isPlayingAudio ? 'Stop Audio' : 'Voice Broadcast'}</span>
          </button>

          {/* Export PDF Button */}
          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Incident PDF</span>
          </button>
        </div>
      </div>

      {/* Real Weather Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono-tech block">TEMPERATURE</span>
          <span className="text-sm font-bold text-amber-400 font-mono-tech mt-0.5 block">{result.weatherMetrics.temp}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono-tech block">REL. HUMIDITY</span>
          <span className="text-sm font-bold text-cyan-400 font-mono-tech mt-0.5 block">{result.weatherMetrics.humidity}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono-tech block">WIND SPEED</span>
          <span className="text-sm font-bold text-purple-400 font-mono-tech mt-0.5 block">{result.weatherMetrics.windSpeed}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono-tech block">ATM. PRESSURE</span>
          <span className="text-sm font-bold text-emerald-400 font-mono-tech mt-0.5 block">{result.weatherMetrics.pressure}</span>
        </div>
      </div>

      {/* Autonomous Evacuation Route Corridors */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Gemma 4 Autonomous Evacuation Route Corridors</span>
        </h3>
        <div className="space-y-2 text-xs">
          {result.evacuationRoutePlan.map((route, idx) => (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                checkedSteps[idx]
                  ? 'bg-cyan-950/40 border-cyan-500/40 line-through text-slate-500'
                  : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                  checkedSteps[idx] ? 'bg-cyan-500 border-cyan-500 text-slate-950 font-bold' : 'border-slate-700'
                }`}
              >
                {checkedSteps[idx] && '✓'}
              </div>
              <span className="font-medium">{route}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Logistics Deployment Checklist */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-2">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <span>Emergency Logistics & Supply Drop Deployment</span>
        </h3>
        <div className="space-y-2 text-xs">
          {result.logisticsChecklist.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-850">
              <span className="text-emerald-400 font-bold mt-0.5">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
