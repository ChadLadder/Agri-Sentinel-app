import React, { useState } from 'react';
import { Sparkles, Cpu, Loader2, ShieldCheck, CheckCircle2, ArrowRight, CornerDownRight, Tag, HelpCircle } from 'lucide-react';
import { Language, t } from '../utils/i18n';

export interface GemmaAnalysisResult {
  disease_name: string;
  crop: string;
  pathogen_type: 'Fungal' | 'Bacterial' | 'Viral';
  pathogen_scientific_name: string;
  confidence: number;
  diagnostic_reasoning: string;
  verified_treatment: string;
  dosage_instructions?: string;
  preventive_action: string;
  temp_min: number;
  temp_max: number;
  humidity_min: number;
  uniprot_id: string;
  target_protein_name: string;
  model_used?: string;
  source: string;
}

interface GemmaSymptomAnalyzerProps {
  language: Language;
  selectedCrop: string;
  onApplySolutionToMainPage?: (result: GemmaAnalysisResult) => void;
}

export const GemmaSymptomAnalyzer: React.FC<GemmaSymptomAnalyzerProps> = ({
  language,
  selectedCrop,
  onApplySolutionToMainPage,
}) => {
  const [symptomsText, setSymptomsText] = useState<string>('');
  const [cropHint, setCropHint] = useState<string>(selectedCrop);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<GemmaAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleSymptoms = [
    'Concentric ring dark brown spots on lower leaves with halo, foliar yellowing and stem lesions',
    'Water-soaked lesions on leaf undersides, white fuzzy fungal growth during humid mornings',
    'Interveinal chlorosis, stunted plant growth, mosaic yellow mottling on young leaf tissue',
  ];

  const handleRunGemma27B = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsText.trim()) {
      setErrorMsg('Please enter visual crop symptoms before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/agri/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomsText.trim(),
          cropHint: cropHint || selectedCrop,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: GemmaAnalysisResult = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.warn('Gemma 27B API call error:', err);
      setErrorMsg('Failed to query Gemma 27B model server. Please verify network connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyToMain = () => {
    if (analysisResult && onApplySolutionToMainPage) {
      onApplySolutionToMainPage(analysisResult);
    }
  };

  return (
    <div id="gemma-analysis-box" className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-500/30 space-y-6 transition-all relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 shrink-0">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2.5 py-0.5 rounded-full">
                Gemma 27B Model Direct Integration
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Solutions
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              Gemma 27B Symptom Analysis & Verified Solution Engine
            </h2>
          </div>
        </div>

        <div className="text-xs text-purple-200/80 font-medium hidden md:block text-right">
          <div>Powered by Google Gemma 27B AI</div>
          <div className="text-[11px] text-slate-400">Step-by-step diagnostic reasoning</div>
        </div>
      </div>

      {/* Form Input Section */}
      <form onSubmit={handleRunGemma27B} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
              <span>Enter Field Visual Symptoms for Gemma 27B Model Analysis *</span>
            </label>
            <span className="text-[11px] text-slate-400">Directly sent to Gemma 27B Agent</span>
          </div>

          <textarea
            rows={3}
            value={symptomsText}
            onChange={(e) => setSymptomsText(e.target.value)}
            placeholder="e.g. Concentric yellow and brown necrotic lesions on foliage with severe wilting, water-soaked stem rot during monsoon humidity..."
            className="w-full bg-slate-950/80 border border-purple-400/30 rounded-2xl p-4 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all shadow-inner"
          />
        </div>

        {/* Quick Sample Prompts */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            Try Quick Symptoms:
          </span>
          {sampleSymptoms.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSymptomsText(sample)}
              className="text-[11px] text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 px-3 py-1 rounded-lg transition-all text-left truncate max-w-xs cursor-pointer"
            >
              "{sample.slice(0, 38)}..."
            </button>
          ))}
        </div>

        {/* Optional Crop & Trigger Button Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 max-w-xs">
            <span className="text-xs font-bold text-slate-300 shrink-0">Target Crop Hint:</span>
            <input
              type="text"
              value={cropHint}
              onChange={(e) => setCropHint(e.target.value)}
              placeholder="e.g. Potato, Tomato, Rice"
              className="bg-slate-950/80 border border-purple-400/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 hover:from-purple-400 hover:to-emerald-400 text-white font-black text-xs px-6 py-3 rounded-2xl transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Gemma 27B Model Thinking & Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Send to Gemma 27B Model & Generate Verified Solution</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="text-xs font-bold text-rose-300 bg-rose-950/80 border border-rose-500/30 p-3 rounded-xl">
            {errorMsg}
          </div>
        )}
      </form>

      {/* Output Display Card (Solution rendered on Main Page) */}
      {analysisResult && (
        <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border-2 border-purple-300 space-y-5 animate-fadeIn">
          {/* Header of Analysis Result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold bg-purple-100 text-purple-900 border border-purple-300 px-3 py-0.5 rounded-full">
                  {analysisResult.model_used || 'Gemma 27B Model Output'}
                </span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {analysisResult.confidence}% Verified Diagnostic Match
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                {analysisResult.disease_name}
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                Crop Target: <span className="text-emerald-700 font-bold">{analysisResult.crop}</span> | Pathogen: <span className="italic text-slate-800">{analysisResult.pathogen_scientific_name}</span> ({analysisResult.pathogen_type})
              </p>
            </div>

            {onApplySolutionToMainPage && (
              <button
                onClick={handleApplyToMain}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer hover:scale-[1.02]"
              >
                <span>Update Main Advisory with Verified Solution</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Carefully Thought Out Symptom Reasoning */}
          <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-4.5 space-y-2">
            <div className="text-xs font-bold text-purple-950 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Gemma 27B Carefully Thought-out Symptom Breakdown</span>
            </div>
            <p className="text-xs text-purple-900/90 font-medium leading-relaxed bg-white/80 p-3.5 rounded-xl border border-purple-100 shadow-2xs">
              {analysisResult.diagnostic_reasoning}
            </p>
          </div>

          {/* Verified Solution Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-emerald-100">
                <ShieldCheck className="w-4 h-4" />
                Gemma 27B Verified ICAR/FAO Agricultural Solution
              </span>
              <span className="text-[10px] bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                VERIFIED SOLUTION
              </span>
            </div>

            <div className="text-base sm:text-lg font-black bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 leading-relaxed text-white">
              {analysisResult.verified_treatment}
            </div>

            {analysisResult.dosage_instructions && (
              <div className="text-xs text-emerald-50 font-medium pt-1 flex items-start gap-2">
                <CornerDownRight className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span><strong className="text-white">Spray Instructions:</strong> {analysisResult.dosage_instructions}</span>
              </div>
            )}
          </div>

          {/* Preventive Action & Microclimate Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
              <div className="font-bold text-slate-800">Preventive Field Actions</div>
              <p className="text-slate-600 font-medium leading-relaxed">{analysisResult.preventive_action}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
              <div className="font-bold text-slate-800">Target Microclimate Drivers</div>
              <div className="text-slate-600 font-medium">
                Temperature Window: <span className="font-bold text-amber-700">{analysisResult.temp_min}°C - {analysisResult.temp_max}°C</span>
              </div>
              <div className="text-slate-600 font-medium">
                Relative Humidity Threshold: <span className="font-bold text-sky-700">{analysisResult.humidity_min}% RH</span>
              </div>
              <div className="text-slate-600 font-medium truncate">
                Protein Target (AlphaFold): <span className="font-mono text-xs font-bold text-slate-700">{analysisResult.uniprot_id}</span> ({analysisResult.target_protein_name})
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
