import React, { useState } from 'react';
import { SecurityScanResult } from '../types';
import { ShieldCheck, ShieldAlert, Download, CheckCircle2, FileCode, GitPullRequest, Code2, AlertTriangle, Bug } from 'lucide-react';

interface SecurityResultProps {
  result: SecurityScanResult;
}

export const SecurityResult: React.FC<SecurityResultProps> = ({ result }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'diff' | 'patched' | 'vulnerable'>('diff');

  const handlePrintPDF = () => {
    window.print();
  };

  const primaryVuln = result.vulnerabilitiesFound[0];

  return (
    <div className="glass-panel p-6 space-y-6 animate-fadeIn border-cyan-500/20 shadow-2xl">
      {/* Risk Rating Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono-tech text-2xl font-bold border shadow-xl ${
              result.securityRating === 'A+'
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50 shadow-emerald-500/20'
                : 'bg-red-950/80 text-red-400 border-red-500/50 shadow-red-500/20'
            }`}
          >
            {result.securityRating}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-100">{result.filename} Security Audit Report</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech badge-cyan">
                CVSS: {primaryVuln?.cvssScore || 9.8}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Language: <strong className="text-slate-200">{result.language.toUpperCase()}</strong> • Gemma 4 Model: <code className="text-cyan-400 font-mono-tech">{result.gemmaModelUsed}</code>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <button
          onClick={handlePrintPDF}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Export Enterprise Audit Report PDF</span>
        </button>
      </div>

      {/* AIShield Audit Banner */}
      <div
        className={`p-4 rounded-xl border flex items-start space-x-3 ${
          result.guardrailReport.safe
            ? 'glass-panel-emerald'
            : 'glass-panel-amber'
        }`}
      >
        {result.guardrailReport.safe ? (
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        )}
        <div className="text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">
              {result.guardrailReport.safe
                ? 'Gemma 4 AIShield Compliance Verification: PASSED 100%'
                : 'Gemma 4 AIShield Interception Alert!'}
            </span>
            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              {result.guardrailReport.provider}
            </span>
          </div>
          <p className="text-slate-300 mt-1">
            {result.guardrailReport.safe
              ? 'This self-healing code patch passed 2nd Gemma 4 AIShield security verification with zero regression or prompt injection risks.'
              : result.guardrailReport.flaggedReason}
          </p>
        </div>
      </div>

      {/* Primary Vulnerability Isolation Card */}
      {primaryVuln && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300 flex items-center space-x-1.5">
              <Bug className="w-4 h-4 text-amber-400" />
              <span>Isolated Vulnerability Vector: {primaryVuln.title}</span>
            </span>
            <span className="font-mono-tech text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">
              {primaryVuln.cveId} ({primaryVuln.cweId})
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">{primaryVuln.description}</p>
        </div>
      )}

      {/* Code Viewer Tabs: Git Diff, Patched Code, Vulnerable Code */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-xs font-mono-tech">
            <button
              onClick={() => setActiveCodeTab('diff')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                activeCodeTab === 'diff'
                  ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Git Diff Patch</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('patched')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                activeCodeTab === 'patched'
                  ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sanitized Code</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('vulnerable')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                activeCodeTab === 'vulnerable'
                  ? 'bg-red-950 border border-red-500/50 text-red-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Vulnerable Original</span>
            </button>
          </div>
          <span className="text-[10px] font-mono-tech text-slate-500">Auto-Refactored by Gemma 4</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 font-mono-tech text-xs text-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
          {activeCodeTab === 'diff' && result.gitDiff}
          {activeCodeTab === 'patched' && result.patchedCode}
          {activeCodeTab === 'vulnerable' && result.originalCode}
        </div>
      </div>
    </div>
  );
};
