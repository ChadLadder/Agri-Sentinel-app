import React from 'react';
import { SecurityAgentStatus } from '../types';
import { ShieldCheck, Cpu, Code2, ShieldAlert, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface SwarmPipelineProps {
  statuses: SecurityAgentStatus[];
}

export const SwarmPipeline: React.FC<SwarmPipelineProps> = ({ statuses }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'agent-1':
        return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'agent-2':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'agent-3':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'agent-4':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      default:
        return <Cpu className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: SecurityAgentStatus['status']) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 flex items-center space-x-1 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Scanning</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified</span>
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech bg-amber-950/80 text-amber-400 border border-amber-500/40 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Intercepted</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech bg-slate-900 text-slate-500 border border-slate-800">
            Standby
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-5 my-6 border-cyan-500/20 shadow-2xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-1"></span>
            <span>Live Gemma 4 Autonomous Security Agent Swarm Telemetry</span>
          </h2>
          <p className="text-xs text-slate-400">
            4-Stage Pipeline: AST Analysis ➔ CVE Threat Diagnosis ➔ Self-Healing Git Patch ➔ Gemma 4 AIShield
          </p>
        </div>
        <span className="text-xs font-mono-tech px-2.5 py-1 rounded-md bg-slate-900 text-cyan-400 border border-slate-800">
          Agent Mode: Concurrent Swarm
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statuses.map((agent, index) => {
          const isRunning = agent.status === 'RUNNING';
          const isDone = agent.status === 'COMPLETED';
          const isFlagged = agent.status === 'FLAGGED';

          return (
            <div
              key={agent.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
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
                Agent 0{index + 1}: {agent.name}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-mono-tech">
                {agent.detail}
              </p>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
                <span>{agent.executionTimeMs ? `${agent.executionTimeMs}ms` : '--'}</span>
                <span className="truncate max-w-[100px]">{agent.modelUsed || 'Gemma 4 Edge'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
