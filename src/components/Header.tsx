import React from 'react';
import { GemmaProvider } from '../types';
import { ShieldCheck, Cpu, Wifi, WifiOff, Terminal, ShieldAlert, Sparkles, Activity, FileCode } from 'lucide-react';

interface HeaderProps {
  provider: GemmaProvider;
  onProviderChange: (p: GemmaProvider) => void;
  offGridMode: boolean;
  onToggleOffGrid: () => void;
  activeTab: 'swarm' | 'playground' | 'ast';
  onTabChange: (tab: 'swarm' | 'playground' | 'ast') => void;
}

export const Header: React.FC<HeaderProps> = ({
  provider,
  onProviderChange,
  offGridMode,
  onToggleOffGrid,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Gemma 4 Ticker */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
                AegisGemma 4
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech badge-cyan">
                DeepMind Gemma 4
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Autonomous Off-Grid Security Swarm • GDG Gemma 4 Hackathon</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => onTabChange('swarm')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'swarm'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Security Swarm</span>
          </button>

          <button
            onClick={() => onTabChange('playground')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'playground'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Exploit Playground</span>
          </button>

          <button
            onClick={() => onTabChange('ast')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'ast'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>3D AST Graph</span>
          </button>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Gemma 4 Model Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
            <select
              value={provider}
              onChange={(e) => onProviderChange(e.target.value as GemmaProvider)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs font-mono-tech"
            >
              <option value="webgpu" className="bg-slate-900">WebGPU (Gemma 4 Edge Browser)</option>
              <option value="ollama" className="bg-slate-900">Ollama (Local Gemma 4)</option>
              <option value="groq" className="bg-slate-900">Groq (Gemma 4 9B)</option>
              <option value="openrouter" className="bg-slate-900">OpenRouter (Gemma 4)</option>
            </select>
          </div>

          {/* Off-Grid Toggle */}
          <button
            onClick={onToggleOffGrid}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 transition-all border text-xs ${
              offGridMode
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Off-Grid local execution for zero external server code leakage"
          >
            {offGridMode ? <WifiOff className="w-3.5 h-3.5 text-emerald-400" /> : <Wifi className="w-3.5 h-3.5 text-slate-400" />}
            <span>{offGridMode ? 'Off-Grid Active' : 'Cloud Hybrid'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
