import React, { useState } from 'react';
import { OmniScanResult } from '../types';
import { speakAdvisoryText, stopSpeech } from '../services/ttsService';
import { ShieldCheck, Volume2, VolumeX, Download, CheckSquare, Activity, Thermometer, Wind, Droplets, Flame, Users } from 'lucide-react';

interface OmniResultProps {
  result: OmniScanResult;
}

export const OmniResult: React.FC<OmniResultProps> = ({ result }) => {
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

  const handlePrintPDF = () => {
    window.print();
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const p = result.planetaryData;

  return (
    <div className="glass-panel p-6 space-y-6 animate-fadeIn border-cyan-500/30 shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-red-950 text-red-400 border border-red-500/50 uppercase tracking-wide">
              {result.threatRating}
            </span>
            <span className="text-xs font-mono-tech px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
              Risk Index: {result.riskScore}/100
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 mt-2">{result.sector}: {result.locationName}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitored Population: <strong className="text-amber-400 font-mono-tech">{p.affectedPopulation.toLocaleString()} Civilians</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleToggleAudio}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all border ${
              isPlayingAudio
                ? 'bg-purple-950 border-purple-500 text-purple-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 text-purple-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
            <span>{isPlayingAudio ? 'Stop Audio' : 'Voice Summary'}</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Executive PDF</span>
          </button>
        </div>
      </div>

      {/* Multi-API Live Telemetry Grid (6 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[9px] text-slate-400 font-mono-tech block">OPEN-METEO TEMP</span>
          <span className="text-xs font-bold text-amber-400 font-mono-tech mt-0.5 block">{p.temperature}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[9px] text-slate-400 font-mono-tech block">OPEN-METEO HUMIDITY</span>
          <span className="text-xs font-bold text-cyan-400 font-mono-tech mt-0.5 block">{p.humidity}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[9px] text-slate-400 font-mono-tech block">WIND VELOCITY</span>
          <span className="text-xs font-bold text-purple-400 font-mono-tech mt-0.5 block">{p.windSpeed}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[9px] text-slate-400 font-mono-tech block">OPENAQ PM2.5 AQI</span>
          <span className="text-xs font-bold text-emerald-400 font-mono-tech mt-0.5 block">{p.airQualityIndex}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[9px] text-slate-400 font-mono-tech block">NASA THERMAL</span>
          <span className="text-xs font-bold text-red-400 font-mono-tech mt-0.5 block">{p.thermalAnomalyCount} Hotspots</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[9px] text-slate-400 font-mono-tech block">MARKET VOLATILITY</span>
          <span className="text-xs font-bold text-yellow-400 font-mono-tech mt-0.5 block">{p.marketVolatilityIndex}</span>
        </div>
      </div>

      {/* Gemma 4 Predictive Insights List */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Gemma 4 Predictive Anomaly Insights (Multi-API Synthesized)</span>
        </h3>
        <div className="space-y-2 text-xs">
          {result.predictiveInsights.map((insight, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-850">
              <span className="text-cyan-400 font-bold mt-0.5">•</span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Checklist */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-2">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <span>Autonomous Action & Resource Deployment Checklist</span>
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
