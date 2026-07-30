import React from 'react';
import { LocalGemmaStatus } from '../types';
import { WifiOff, Cpu, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';

interface OffGridStatusProps {
  status: LocalGemmaStatus;
  offGridMode: boolean;
}

export const OffGridStatus: React.FC<OffGridStatusProps> = ({ status, offGridMode }) => {
  return (
    <div className="glass-panel p-4 my-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg border ${offGridMode ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">
              {offGridMode ? 'Off-Grid Zero-Internet Mode Active' : 'Online Hybrid Provider Engine'}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech ${status.ollamaConnected ? 'badge-emerald' : 'badge-amber'}`}>
              {status.ollamaConnected ? 'Ollama Online' : 'Local Standalone Fallback'}
            </span>
          </div>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Model Engine: <strong className="text-cyan-400 font-mono-tech">{status.recommendedModel}</strong> • WebGPU Acceleration: <strong className="text-purple-400">{status.webGpuSupported ? 'Supported' : 'Standard CPU'}</strong>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-slate-400 font-mono-tech text-[11px] bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850">
        <HardDrive className="w-3.5 h-3.5 text-slate-500" />
        <span>VRAM Footprint: ~4.2 GB</span>
      </div>
    </div>
  );
};
