import React from 'react';
import { Volume2, VolumeX, Printer, CheckCircle2, ShieldAlert, Sparkles, Droplets, Clock, FileText } from 'lucide-react';
import { AdvisoryResponse } from '../types';
import { Language, t } from '../utils/i18n';

interface AdvisoryCardProps {
  advisory: AdvisoryResponse;
  language: Language;
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({ advisory, language }) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const { diseaseMatch, strategyOutput, guardrailResult } = advisory;
  const disease = diseaseMatch.disease;

  // Text to speech readout
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = `Agri-Sentinel Advisory for ${disease.crop}. Disease: ${disease.disease_name}. Verified treatment: ${strategyOutput.proposedTreatment}. Dosage: ${strategyOutput.dosageInstructions}. Preventive action: ${disease.preventive_action}.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    // Set voice language if available
    const langMap: Record<Language, string> = {
      en: 'en-IN',
      ta: 'ta-IN',
      hi: 'hi-IN',
      te: 'te-IN',
    };
    utterance.lang = langMap[language] || 'en-IN';

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl space-y-6 transition-all print:bg-white print:text-black print:p-2 print:border-none print:shadow-none">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 print:border-black">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-0.5 rounded-full border border-emerald-300 print:border-black print:text-black">
              {disease.crop} Agronomic Plan
            </span>
            {guardrailResult.hallucinationDetected ? (
              <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                AI Shield Intercepted & Guardrailed
              </span>
            ) : (
              <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                100% CSV Ground Truth Verified
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight print:text-black">
            Actionable Field Advisory Plan
          </h2>
          <p className="text-xs text-slate-500 font-medium print:text-gray-700">
            Pathogen: <span className="text-slate-800 font-bold print:text-black">{disease.disease_name}</span> ({disease.pathogen_scientific_name})
          </p>
        </div>

        {/* Audio & Print Controls */}
        <div className="flex items-center gap-2.5 print:hidden shrink-0">
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
              isPlayingAudio
                ? 'bg-rose-100 border-rose-300 text-rose-900 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-600" />
                <span>{t('stopAudio', language)}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>{t('audioReadout', language)}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>{t('exportPdf', language)}</span>
          </button>
        </div>
      </div>

      {/* Verified Treatment Highlight Box */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-6 shadow-lg shadow-emerald-500/20 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-emerald-100">
            <Sparkles className="w-4 h-4" />
            {t('verifiedTreatment', language)}
          </label>
          <span className="text-[10px] bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md">
            VERIFIED GROUND TRUTH
          </span>
        </div>

        <div className="text-xl font-black bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white leading-relaxed">
          {strategyOutput.proposedTreatment}
        </div>
      </div>

      {/* Dosage Instructions & Irrigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-2">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            {t('dosageNotice', language)}
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            {strategyOutput.dosageInstructions}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-2">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-600" />
            {t('irrigationAdvice', language)}
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            {strategyOutput.irrigationAdvice}
          </p>
        </div>
      </div>

      {/* Preventive Cultural Actions */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {t('preventiveAction', language)}
        </div>

        <ul className="space-y-2">
          {strategyOutput.preventiveSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs font-medium text-slate-800 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Safety Verification Footer */}
      <div className="bg-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-semibold text-slate-500 border border-slate-200">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Verification Code: <code className="text-slate-900 font-mono font-bold">AS-{disease.disease_id}-{Date.now().toString().slice(-6)}</code></span>
        </div>
        <span>Zero-hallucination climate defense for smallholder agriculture.</span>
      </div>
    </div>
  );
};

