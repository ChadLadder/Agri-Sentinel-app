import React from 'react';
import { GemmaProvider } from '../types';
import { Cpu, Wifi, WifiOff, Globe, Sparkles, Activity, ShieldCheck, Compass } from 'lucide-react';

interface HeaderProps {
  provider: GemmaProvider;
  onProviderChange: (p: GemmaProvider) => void;
  offGridMode: boolean;
  onToggleOffGrid: () => void;
  language: 'en' | 'ta' | 'hi' | 'es';
  onLanguageChange: (l: 'en' | 'ta' | 'hi' | 'es') => void;
  activeTab: 'map' | 'swarm' | 'analytics';
  onTabChange: (tab: 'map' | 'swarm' | 'analytics') => void;
}

export const Header: React.FC<HeaderProps> = ({
  provider,
  onProviderChange,
  offGridMode,
  onToggleOffGrid,
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
            <Compass className="w-6 h-6 text-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                GeoGemma 4
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-mono-tech badge-cyan">
                GDG Build with Gemma
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1.5">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Global Disaster & Climate Command Center • DeepMind Gemma 4</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => onTabChange('map')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all ${
              activeTab === 'map'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Interactive Live Map</span>
          </button>

          <button
            onClick={() => onTabChange('swarm')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all ${
              activeTab === 'swarm'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Command Swarm</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Global Analytics</span>
          </button>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Provider Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 mr-2" />
            <select
              value={provider}
              onChange={(e) => onProviderChange(e.target.value as GemmaProvider)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs font-mono-tech"
            >
              <option value="webgpu" className="bg-slate-900">WebGPU (Gemma 4 Local Edge)</option>
              <option value="ollama" className="bg-slate-900">Ollama (Local Gemma 4 Server)</option>
              <option value="groq" className="bg-slate-900">Groq (Gemma 4 9B)</option>
            </select>
          </div>

          {/* Off-Grid Disaster Toggle */}
          <button
            onClick={onToggleOffGrid}
            className={`px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all border text-xs font-semibold ${
              offGridMode
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Off-Grid execution for zero cell tower dependency during disasters"
          >
            {offGridMode ? <WifiOff className="w-3.5 h-3.5 text-emerald-400" /> : <Wifi className="w-3.5 h-3.5 text-slate-400" />}
            <span>{offGridMode ? 'Disaster Off-Grid Active' : 'Online Mode'}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-400 mr-2" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as any)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs font-medium"
            >
              <option value="en" className="bg-slate-900">English</option>
              <option value="ta" className="bg-slate-900">தமிழ் (Tamil)</option>
              <option value="hi" className="bg-slate-900">हिंदी (Hindi)</option>
              <option value="es" className="bg-slate-900">Español</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
