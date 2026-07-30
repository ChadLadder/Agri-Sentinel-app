import React from 'react';
import { Activity, ShieldAlert, Users, CloudRain, Wind, Thermometer, Database } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 border-cyan-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Global Risk Index</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono-tech text-cyan-300">88.4 / 100</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Level 5 Extreme Alert</span>
        </div>

        <div className="glass-panel p-5 border-red-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Population At Risk</span>
            <Users className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono-tech text-red-400">506,000</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Across 5 Active Zones</span>
        </div>

        <div className="glass-panel p-5 border-emerald-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Evacuation Corridors</span>
            <CloudRain className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono-tech text-emerald-400">18 Routes</div>
          <span className="text-[10px] text-slate-500 mt-1 block">100% Map Mapped</span>
        </div>

        <div className="glass-panel p-5 border-purple-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Gemma Swarm Speed</span>
            <Wind className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono-tech text-purple-300">42.5 Tok/s</div>
          <span className="text-[10px] text-slate-500 mt-1 block">0ms WebGPU Latency</span>
        </div>
      </div>

      {/* Telemetry Visual Charts Section */}
      <div className="glass-panel p-6 border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Real-time Atmospheric Moisture & Wind Velocity Telemetry</span>
        </h3>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 font-mono-tech text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span>Coimbatore Flooding Corridor:</span>
            <span className="text-cyan-400 font-bold">92% RH • 42 km/h NE</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full w-[92%]"></div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span>Coastal Andhra Cyclone Belt:</span>
            <span className="text-red-400 font-bold">96% RH • 115 km/h ENE</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-[96%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
