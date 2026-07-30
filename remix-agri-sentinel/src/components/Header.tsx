import React from 'react';
import { Shield, Globe, Sparkles, Dna, CloudSun, Database, Sprout, Sun, User, Settings, Wifi, WifiOff } from 'lucide-react';
import { Language, t } from '../utils/i18n';
import { WeatherData } from '../types';
import { motion } from 'motion/react';

interface HeaderProps {
  offGridMode: boolean;
  onToggleOffGrid: (val: boolean) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: 'advisory' | 'shield' | 'alphafold' | 'simulator' | 'dataset';
  onSelectTab: (tab: 'advisory' | 'shield' | 'alphafold' | 'simulator' | 'dataset') => void;
  hallucinationDetected?: boolean;
  weather?: WeatherData;
}

export const Header: React.FC<HeaderProps> = ({
  offGridMode,
  onToggleOffGrid,
  language,
  onLanguageChange,
  activeTab,
  onSelectTab,
  hallucinationDetected = false,
  weather,
}) => {
  const tabs = [
    { id: 'advisory' as const, label: 'Advisory Plan', icon: Sparkles },
    { id: 'shield' as const, label: 'AI Guardrail', icon: Shield, alert: hallucinationDetected },
    { id: 'alphafold' as const, label: '3D Research', icon: Dna },
    { id: 'simulator' as const, label: 'Climate Simulator', icon: CloudSun },
    { id: 'dataset' as const, label: 'Dataset', icon: Database },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/80 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md shadow-emerald-500/15 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Agri Sentinel <span className="text-emerald-600">AI</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Smart Agricultural Intelligence Platform
            </p>
          </div>
        </div>

        {/* Tab Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-slate-900 bg-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.alert && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Controls: Weather Chip, Off-Grid Toggle, Language, User */}
        <div className="flex items-center gap-2.5">
          {weather && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/80 text-slate-700 text-xs font-semibold">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{weather.locationName.split(',')[0]}</span>
              <span className="text-emerald-600 font-bold">{weather.temperature}°C</span>
            </div>
          )}

          {/* Off-Grid Toggle */}
          <button
            onClick={() => onToggleOffGrid(!offGridMode)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
              offGridMode
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
            title="Toggle offline/online mode"
          >
            {offGridMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Online</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-100/80 border border-slate-200/80 rounded-xl px-2.5 py-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer hover:bg-slate-800 transition-colors">
            <User className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs Header (Mobile/Tablet view) */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 flex items-center gap-1 border-t border-slate-100 overflow-x-auto no-scrollbar py-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-slate-900 bg-slate-100 border border-slate-200'
                  : 'text-slate-600'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};


