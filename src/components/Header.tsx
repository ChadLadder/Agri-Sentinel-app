import React from 'react';
import { GemmaProvider } from '../types';
import { ShieldCheck, Cpu, Wifi, WifiOff, Sparkles, Activity, Lock } from 'lucide-react';

interface HeaderProps {
  provider: GemmaProvider;
  onProviderChange: (p: GemmaProvider) => void;
  offGridMode: boolean;
  onToggleOffGrid: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  provider,
  onProviderChange,
  offGridMode,
  onToggleOffGrid,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-1 ring-white/20">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                SentryGuard AI
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-mono-tech badge-emerald">
                Powered by Gemma 4
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Personal Cyber Safety & Scam Protection Assistant</span>
            </p>
          </div>
        </div>

        {/* Controls Header */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Provider Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 mr-2" />
            <select
              value={provider}
              onChange={(e) => onProviderChange(e.target.value as GemmaProvider)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs font-medium"
            >
              <option value="webgpu" className="bg-slate-900">WebGPU (On-Device Local Gemma 4)</option>
              <option value="ollama" className="bg-slate-900">Ollama (Local Gemma 4 Server)</option>
              <option value="groq" className="bg-slate-900">Groq (Cloud Gemma 4)</option>
            </select>
          </div>

          {/* Off-Grid Privacy Toggle */}
          <button
            onClick={onToggleOffGrid}
            className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all border text-xs font-semibold ${
              offGridMode
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Off-Grid local execution for 100% private phone scanning"
          >
            {offGridMode ? <WifiOff className="w-3.5 h-3.5 text-emerald-400" /> : <Wifi className="w-3.5 h-3.5 text-slate-400" />}
            <span>{offGridMode ? '100% Private (Off-Grid)' : 'Cloud Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
