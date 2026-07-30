import React, { useState } from 'react';
import { AdvisoryResult as AdvisoryResultType } from '../types';
import { speakAdvisoryText, stopSpeech } from '../services/ttsService';
import { CheckCircle2, ShieldCheck, Volume2, VolumeX, Download, Leaf, CloudSun, Beaker, FileText, AlertTriangle } from 'lucide-react';

interface AdvisoryResultProps {
  result: AdvisoryResultType;
}

export const AdvisoryResult: React.FC<AdvisoryResultProps> = ({ result }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const summaryText = `AgriGemma Advisory for ${result.disease.crop_name} ${result.disease.disease_name}. Verified Treatment: ${result.verifiedTreatment}. Recommended Dosage: ${result.dosage}. Organic option: ${result.organicOption}.`;
      speakAdvisoryText(summaryText, 'en');
      setIsPlayingAudio(true);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="glass-panel p-6 space-y-6 animate-fadeIn">
      {/* Top Header & Audit Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-100">
              {result.disease.crop_name}: {result.disease.disease_name}
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                result.disease.risk_level === 'Critical'
                  ? 'bg-red-950/80 text-red-400 border-red-500/40'
                  : result.disease.risk_level === 'High'
                  ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                  : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
              }`}
            >
              {result.disease.risk_level} Pathogen Risk
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pathogen Type: <strong className="text-slate-200">{result.disease.pathogen_type}</strong> • Ground-Truth ID: <code className="text-cyan-400 font-mono-tech">{result.disease.disease_id}</code>
          </p>
        </div>

        {/* Action Controls: Audio TTS & Download PDF */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleAudio}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
              isPlayingAudio
                ? 'bg-purple-950 border-purple-500 text-purple-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 text-purple-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
            <span>{isPlayingAudio ? 'Stop Voice' : 'Listen Advisory (TTS)'}</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Advisory PDF</span>
          </button>
        </div>
      </div>

      {/* Guardrail Audit Status Banner */}
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
                ? 'Gemma AIShield Audit: Verified 100% Safe'
                : 'Gemma AIShield Interception Alert!'}
            </span>
            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              {result.guardrailReport.provider}
            </span>
          </div>
          <p className="text-slate-300 mt-1">
            {result.guardrailReport.safe
              ? 'This advisory passed 2nd Gemma inference audit against verified CSV chemical ground truth with zero detected hallucinations.'
              : result.guardrailReport.flaggedReason}
          </p>
        </div>
      </div>

      {/* Main Grid: Verified Chemical Treatment & Organic Option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Verified Chemical Treatment */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center space-x-2 mb-2">
            <Beaker className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Verified Ground-Truth Chemical Treatment
            </h3>
          </div>
          <p className="text-sm font-semibold text-slate-100">{result.verifiedTreatment}</p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Recommended Dosage:</span>
            <span className="font-mono-tech text-emerald-400 font-bold">{result.dosage}</span>
          </div>
        </div>

        {/* Organic Remedy Option */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center space-x-2 mb-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Eco-Friendly Organic Remedy
            </h3>
          </div>
          <p className="text-sm font-semibold text-slate-100">{result.organicOption}</p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Biological Safety:</span>
            <span className="font-semibold text-emerald-400">Zero Chemical Residue</span>
          </div>
        </div>
      </div>

      {/* Weather Context Alert Box */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <CloudSun className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-200">
              Farm Microclimate Context ({result.weatherContext.temperature}, Humidity: {result.weatherContext.humidity})
            </span>
            <p className="text-slate-400 mt-0.5">{result.weatherContext.riskAlert}</p>
          </div>
        </div>
        <div className="shrink-0 font-mono-tech text-[11px] text-slate-500 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Dew Point: {result.weatherContext.dewPoint}
        </div>
      </div>

      {/* Gemma Strategy Recovery Plan Narrative */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center space-x-2 mb-3">
          <FileText className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            Gemma Multi-Agent Actionable Strategy Plan
          </h3>
        </div>
        <div className="text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-mono-tech bg-slate-950 p-4 rounded-lg border border-slate-850">
          {result.strategyText}
        </div>
      </div>
    </div>
  );
};
