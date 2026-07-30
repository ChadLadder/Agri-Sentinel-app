import React from 'react';
import { SwarmAgentStatus } from '../types';
import { Database, Cpu, Dna, ShieldCheck, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface SwarmPipelineProps {
  statuses: SwarmAgentStatus[];
}

export const SwarmPipeline: React.FC<SwarmPipelineProps> = ({ statuses }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'agent-1':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'agent-2':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'agent-3':
        return <Dna className="w-5 h-5 text-purple-400" />;
      case 'agent-4':
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      default:
        return <Cpu className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: SwarmAgentStatus['status']) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 flex items-center space-x-1 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Active Agent</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified</span>
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-950/80 text-amber-400 border border-amber-500/40 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Intercepted</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-900 text-slate-500 border border-slate-800">
            Idle
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-5 my-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1"></span>
            <span>Live Multi-Agent Gemma Swarm Telemetry</span>
          </h2>
          <p className="text-xs text-slate-400">
            4-Stage Pipeline: CSV Grounding ➔ Gemma Strategy Agent ➔ AlphaFold PDB Analysis ➔ Gemma Safety Shield
          </p>
        </div>
        <span className="text-xs font-mono-tech px-2.5 py-1 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
          Swarm Mode: Multi-Agent Parallel
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {statuses.map((agent, index) => {
          const isRunning = agent.status === 'RUNNING';
          const isDone = agent.status === 'COMPLETED';
          const isFlagged = agent.status === 'FLAGGED';

          return (
            <div
              key={agent.id}
              className={`p-4 rounded-xl border transition-all duration-300 relative ${
                isRunning
                  ? 'bg-slate-900/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                  : isDone
                  ? 'bg-slate-900/50 border-emerald-500/30'
                  : isFlagged
                  ? 'bg-slate-900/50 border-amber-500/40'
                  : 'bg-slate-950/40 border-slate-850 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                  {getIcon(agent.id)}
                </div>
                {getStatusBadge(agent.status)}
              </div>

              <div className="text-xs font-bold text-slate-300 mt-2">
                Stage 0{index + 1}: {agent.name}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {agent.detail}
              </p>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
                <span>{agent.executionTimeMs ? `${agent.executionTimeMs}ms` : '--'}</span>
                <span className="truncate max-w-[100px]">{agent.modelUsed || 'Gemma Native'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
