import React, { useState } from 'react';
import { GuardrailAuditReport } from '../types';
import { ShieldCheck, AlertTriangle, Cpu, CheckCircle, Bug, FileCode, ShieldAlert, Sparkles } from 'lucide-react';

interface AIShieldInspectorProps {
  lastReport?: GuardrailAuditReport;
  onSimulateUnsafeTest: (forceUnsafe: boolean) => void;
  isLoading: boolean;
}

export const AIShieldInspector: React.FC<AIShieldInspectorProps> = ({
  lastReport,
  onSimulateUnsafeTest,
  isLoading,
}) => {
  const [testSimulate, setTestSimulate] = useState<boolean>(false);

  const handleRunSecurityAudit = () => {
    onSimulateUnsafeTest(testSimulate);
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      {/* Inspector Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <span>Gemma AIShield Security Inspector</span>
              <span className="px-2 py-0.5 text-xs badge-amber">2nd Inference Guardrail</span>
            </h2>
            <p className="text-xs text-slate-400">
              Live audit telemetry verifying Gemma model outputs against deterministic CSV ground-truth chemical rules.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunSecurityAudit}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg transition-all disabled:opacity-50 flex items-center space-x-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run Guardrail Audit Test</span>
        </button>
      </div>

      {/* Live Simulation Controls for Hackathon Judges */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-200 block">Judge Interactive Security Scenario:</span>
          <p className="text-xs text-slate-400">
            Toggle below to test how the 2nd Gemma Guardrail call actively intercepts unapproved chemical hallucinations.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
          <span className="text-xs font-medium text-slate-300">Inject Unsafe Chemical ("Paraquat"):</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={testSimulate}
              onChange={(e) => setTestSimulate(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>
      </div>

      {/* Security Audit Telemetry Report Cards */}
      {lastReport ? (
        <div className="space-y-4">
          <div
            className={`p-5 rounded-xl border ${
              lastReport.safe
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-amber-950/30 border-amber-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {lastReport.safe ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
                <span className="text-sm font-bold text-slate-100">
                  {lastReport.safe ? 'Audit Outcome: SAFE & COMPLIANT' : 'Audit Outcome: INTERCEPTED & MITIGATED'}
                </span>
              </div>
              <span className="text-xs font-mono-tech text-slate-400">
                Audit Latency: {lastReport.executionTimeMs}ms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Gemma Model Auditor:</span>
                <span className="font-mono-tech font-bold text-cyan-400">{lastReport.provider}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Safety Confidence Score:</span>
                <span className="font-mono-tech font-bold text-emerald-400">
                  {(lastReport.confidenceScore * 100).toFixed(1)}%
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Verified Chemical:</span>
                <span className="font-mono-tech font-bold text-purple-400">
                  {lastReport.verifiedChemical || 'Mancozeb 75% WP'}
                </span>
              </div>
            </div>

            {!lastReport.safe && (
              <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs">
                <span className="font-bold text-red-300 block mb-1">Flagged Violation Reason:</span>
                <p className="text-red-200 font-mono-tech">{lastReport.flaggedReason}</p>

                {lastReport.suggestedMitigation && (
                  <div className="mt-2 pt-2 border-t border-red-500/20 text-emerald-300">
                    <span className="font-bold block mb-0.5">Automated Enforced Mitigation:</span>
                    <p className="font-mono-tech">{lastReport.suggestedMitigation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
          <FileCode className="w-8 h-8 mx-auto mb-2 text-slate-600" />
          <p className="text-xs">No active security audit report. Run a Gemma Swarm diagnosis or click "Run Guardrail Audit Test" above.</p>
        </div>
      )}
    </div>
  );
};
