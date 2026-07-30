import React from 'react';
import { GemmaProvider, Language } from '../types';
import { Cpu, ShieldCheck, Wifi, WifiOff, Upload, Globe, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  provider: GemmaProvider;
  onProviderChange: (p: GemmaProvider) => void;
  offGridMode: boolean;
  onToggleOffGrid: () => void;
  language: Language;
  onLanguageChange: (l: Language) => void;
  onOpenCustomDataset: () => void;
  activeTab: 'swarm' | 'shield' | 'alphafold';
  onTabChange: (tab: 'swarm' | 'shield' | 'alphafold') => void;
}

export const Header: React.FC<HeaderProps> = ({
  provider,
  onProviderChange,
  offGridMode,
  onToggleOffGrid,
  language,
  onLanguageChange,
  onOpenCustomDataset,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Ticker */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            <Sparkles className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                AgriGemma Swarm
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech badge-emerald">
                Gemma Native
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Off-Grid Multi-Agent AI • GDG Build with Gemma</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => onTabChange('swarm')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'swarm'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-semibold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Advisory Swarm</span>
          </button>
          <button
            onClick={() => onTabChange('shield')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'shield'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AIShield Inspector</span>
          </button>
        </div>

        {/* Controls Header Right */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Provider Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
            <select
              value={provider}
              onChange={(e) => onProviderChange(e.target.value as GemmaProvider)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
            >
              <option value="ollama" className="bg-slate-900">Ollama (Local Gemma 2)</option>
              <option value="groq" className="bg-slate-900">Groq (Gemma-2-9B)</option>
              <option value="openrouter" className="bg-slate-900">OpenRouter (Gemma 2)</option>
              <option value="webgpu" className="bg-slate-900">WebGPU In-Browser Gemma</option>
            </select>
          </div>

          {/* Off-Grid Toggle Button */}
          <button
            onClick={onToggleOffGrid}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 transition-all border text-xs ${
              offGridMode
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Off-Grid / Local execution for zero internet operation"
          >
            {offGridMode ? <WifiOff className="w-3.5 h-3.5 text-emerald-400" /> : <Wifi className="w-3.5 h-3.5 text-slate-400" />}
            <span>{offGridMode ? 'Off-Grid Active' : 'Online Mode'}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
            <Globe className="w-3.5 h-3.5 text-purple-400 mr-1.5" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
            >
              <option value="en" className="bg-slate-900">English</option>
              <option value="ta" className="bg-slate-900">தமிழ் (Tamil)</option>
              <option value="hi" className="bg-slate-900">हिंदी (Hindi)</option>
              <option value="te" className="bg-slate-900">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Custom Dataset Upload Button */}
          <button
            onClick={onOpenCustomDataset}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition-all"
            title="Upload Custom CSV Dataset"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
