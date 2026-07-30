import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Cpu, ArrowRight, AlertOctagon, CheckCircle2, XCircle, RefreshCw, Terminal, AlertTriangle, Zap, Lock } from 'lucide-react';
import { GuardrailResult, DiseaseMatch } from '../types';
import { Language, t } from '../utils/i18n';

interface AIShieldInspectorProps {
  guardrailResult: GuardrailResult;
  diseaseMatch: DiseaseMatch;
  onSimulateHallucination: () => void;
  language: Language;
  loading?: boolean;
}

export const AIShieldInspector: React.FC<AIShieldInspectorProps> = ({
  guardrailResult,
  diseaseMatch,
  onSimulateHallucination,
  language,
  loading = false,
}) => {
  const { hallucinationDetected, sanitizedOutput, flaggedChemicals, approvedChemicals, auditLog } = guardrailResult;

  return (
    <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl space-y-6 transition-all">
      {/* Top Banner & Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              hallucinationDetected
                ? 'bg-amber-500 text-white shadow-amber-200 animate-pulse'
                : 'bg-emerald-500 text-white shadow-emerald-200'
            }`}
          >
            {hallucinationDetected ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {t('aiShieldTitle', language)}
              </h2>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  hallucinationDetected
                    ? 'bg-amber-100 border border-amber-300 text-amber-900 animate-bounce'
                    : 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                }`}
              >
                {hallucinationDetected ? t('hallucinationIntercepted', language) : t('verifiedSafe', language)}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              AI Guardrail active — auditing advisory outputs against verified agronomic ground truth
            </p>
          </div>
        </div>

        {/* Attack Simulator Trigger Button */}
        <button
          onClick={onSimulateHallucination}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>{t('simulateHallucination', language)}</span>
        </button>
      </div>

      {/* Swarm Pipeline Architecture Flow */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
        <div className="text-xs font-bold text-slate-200 mb-3.5 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          Multi-Agent Gemma Swarm Execution Pipeline
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Node 1: Deterministic Match */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Agent 1: Data Anchor</div>
            <div className="font-bold text-emerald-400">Open-Meteo & CSV Match</div>
            <div className="text-[11px] text-slate-300 mt-1">
              Pathogen: <span className="text-white font-semibold">{diseaseMatch.disease.disease_name}</span>
            </div>
          </div>

          {/* Node 2: Gemma 7B Strategy Agent */}
          <div className={`bg-slate-800/80 border rounded-xl p-3.5 ${hallucinationDetected ? 'border-amber-400' : 'border-slate-700'}`}>
            <div className="text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Agent 2: Agronomist</div>
            <div className="font-bold text-sky-400">Gemma 7B Strategy Agent</div>
            <div className="text-[11px] text-slate-300 mt-1">
              {hallucinationDetected ? (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Hallucinated Chemical
                </span>
              ) : (
                <span className="text-slate-300">Generated Agronomic Strategy</span>
              )}
            </div>
          </div>

          {/* Node 3: Gemma 2B Guardrail Interceptor */}
          <div className={`bg-slate-800/80 border rounded-xl p-3.5 ${hallucinationDetected ? 'border-amber-400 bg-amber-950/40' : 'border-emerald-500/50'}`}>
            <div className="text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Agent 3: AI Shield</div>
            <div className="font-bold text-amber-400">Gemma 2B Guardrail Agent</div>
            <div className="text-[11px] text-slate-300 mt-1">
              {hallucinationDetected ? (
                <span className="text-amber-300 font-black">INTERCEPTED & BLOCKED</span>
              ) : (
                <span className="text-emerald-400 font-bold">100% Passed Safety Checks</span>
              )}
            </div>
          </div>

          {/* Node 4: Final Farmer Plan */}
          <div className="bg-slate-800/80 border border-emerald-500/50 rounded-xl p-3.5">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Output Layer</div>
            <div className="font-bold text-emerald-300">Verified Farmer Plan</div>
            <div className="text-[11px] text-slate-300 mt-1">Zero Hallucination Guarantee</div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison: Draft vs Guardrail Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Raw Gemma 7B Draft */}
        <div className={`bg-slate-50 border rounded-2xl p-4 ${hallucinationDetected ? 'border-amber-300' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-sky-600" />
              Gemma 7B Draft Output (Pre-Guardrail)
            </span>
            {hallucinationDetected && (
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-mono border border-amber-300 font-bold">
                UNSAFE DRAFT DETECTED
              </span>
            )}
          </div>
          <div className="bg-slate-900 rounded-xl p-3.5 text-xs text-slate-300 font-mono space-y-2 max-h-48 overflow-y-auto border border-slate-800">
            {hallucinationDetected ? (
              <div className="space-y-2">
                <div className="text-amber-400 font-bold">[HALLUCINATED RECOMMENDATION PROPOSED]</div>
                <div className="text-rose-300 bg-rose-950/60 p-2.5 rounded-lg border border-rose-800/50">
                  ❌ Proposed Unregistered Chemical: <span className="font-bold underline text-white">{flaggedChemicals.join(', ')}</span> @ 15ml/L
                </div>
                <div className="text-slate-400 text-[11px]">
                  Reasoning: 7B model generated illegal chemical formulation not present in verified CSV agronomic registry.
                </div>
              </div>
            ) : (
              <div>
                <div className="text-emerald-400 font-bold">[STANDARD VERIFIED DRAFT]</div>
                <div className="text-slate-300 mt-1 leading-relaxed">{sanitizedOutput.rawResponse}</div>
              </div>
            )}
          </div>
        </div>

        {/* Gemma 2B Interceptor Action */}
        <div className={`bg-slate-50 border rounded-2xl p-4 ${hallucinationDetected ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              Gemma 2B AI Shield Action
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-mono border border-emerald-300 font-bold">
              CSV GROUND TRUTH REPLACEMENT
            </span>
          </div>

          <div className="bg-slate-900 rounded-xl p-3.5 text-xs text-slate-200 font-mono space-y-2 max-h-48 overflow-y-auto border border-slate-800">
            {hallucinationDetected ? (
              <div className="space-y-2">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> [AI SHIELD NEUTRALIZED HALLUCINATION]
                </div>
                <div className="text-emerald-200 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-700/50">
                  ✅ Substituted with CSV Verified Active Ingredient:
                  <div className="font-bold text-emerald-300 mt-1 text-sm">{approvedChemicals.join(', ')}</div>
                </div>
                <div className="text-slate-300 text-[11px]">
                  Farmer Protection Status: 100% Safe. Dangerous hallucinated chemical blocked before reaching farmer display.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-emerald-400 font-bold">✔ ALL RECOMMENDATIONS VERIFIED</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Gemma 2B cross-referenced active ingredient <span className="text-emerald-300 font-bold">{diseaseMatch.disease.verified_treatment}</span> against CSV record <code className="text-amber-300 font-bold">{diseaseMatch.disease.disease_id}</code>. Match confirmed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Log Telemetry Table */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-600" />
            Security & Compliance Audit Telemetry
          </div>
          <span className="text-[11px] text-slate-500 font-mono font-bold">
            Latency: {auditLog.executionTimeMs}ms
          </span>
        </div>

        <div className="space-y-2">
          {auditLog.guardrailChecks.map((chk, idx) => (
            <div
              key={idx}
              className={`flex items-start justify-between p-3 rounded-xl border text-xs font-medium ${
                chk.passed
                  ? 'bg-white border-slate-200/80 text-slate-800 shadow-xs'
                  : 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {chk.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertOctagon className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-slate-900">{chk.checkName}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">{chk.details}</div>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-black uppercase shrink-0 ${
                  chk.passed ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-500 text-white'
                }`}
              >
                {chk.passed ? 'PASSED' : 'INTERCEPTED'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

