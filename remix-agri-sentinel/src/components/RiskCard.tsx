import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, Database, Thermometer, Droplets, Bug, Activity } from 'lucide-react';
import { DiseaseMatch } from '../types';
import { Language, t } from '../utils/i18n';

interface RiskCardProps {
  match: DiseaseMatch;
  language: Language;
}

export const RiskCard: React.FC<RiskCardProps> = ({ match, language }) => {
  const { disease, matchScore, tempMatch, humidityMatch, rainfallMatch, riskSeverity, riskDescription } = match;

  const isHighRisk = riskSeverity === 'Critical High' || riskSeverity === 'High';
  const isModerate = riskSeverity === 'Moderate';

  return (
    <div
      className={`rounded-3xl border p-6 shadow-xl backdrop-blur-xl transition-all relative overflow-hidden ${
        isHighRisk
          ? 'bg-gradient-to-br from-rose-50/90 via-white to-white border-rose-300 shadow-rose-100'
          : isModerate
          ? 'bg-gradient-to-br from-amber-50/90 via-white to-white border-amber-300 shadow-amber-100'
          : 'bg-gradient-to-br from-emerald-50/90 via-white to-white border-emerald-300 shadow-emerald-100'
      }`}
    >
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              isHighRisk
                ? 'bg-rose-500 text-white shadow-rose-200'
                : isModerate
                ? 'bg-amber-500 text-white shadow-amber-200'
                : 'bg-emerald-500 text-white shadow-emerald-200'
            }`}
          >
            {isHighRisk ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-black px-3 py-0.5 rounded-full uppercase tracking-wider border shadow-xs ${
                  isHighRisk
                    ? 'bg-rose-100 border-rose-300 text-rose-900'
                    : isModerate
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                }`}
              >
                {riskSeverity}
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                {matchScore}% Weather Vector Match
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-1 tracking-tight">
              {disease.disease_name}
            </h3>
            <p className="text-xs text-slate-500 italic font-medium">
              Pathogen: <span className="font-semibold text-slate-700">{disease.pathogen_scientific_name}</span> ({disease.pathogen_type})
            </p>
          </div>
        </div>

        {/* Deterministic Anchor Architecture Badge */}
        <div className="bg-slate-900 text-white rounded-2xl p-3 max-w-xs text-xs shadow-md border border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-0.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deterministic Ground Truth</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            Disease risk evaluated against verified agronomic database.
          </p>
        </div>
      </div>

      {/* Weather Vector Trigger Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div
          className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
            tempMatch ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-600" />
            <span>Temp Window ({disease.temp_min}°C - {disease.temp_max}°C)</span>
          </div>
          {tempMatch ? <CheckCircle2 className="w-4 h-4 text-amber-600" /> : <span className="text-[10px] text-slate-400">Normal</span>}
        </div>

        <div
          className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
            humidityMatch ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>RH Threshold (&gt;{disease.humidity_min}%)</span>
          </div>
          {humidityMatch ? <CheckCircle2 className="w-4 h-4 text-sky-600" /> : <span className="text-[10px] text-slate-400">Normal</span>}
        </div>

        <div
          className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
            rainfallMatch ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-rose-600" />
            <span>Leaf Wetness ({disease.rainfall_req})</span>
          </div>
          {rainfallMatch ? <CheckCircle2 className="w-4 h-4 text-rose-600" /> : <span className="text-[10px] text-slate-400">Normal</span>}
        </div>
      </div>

      {/* Risk Summary Description */}
      <p className="text-xs text-slate-700 font-medium bg-white/80 p-3.5 rounded-2xl border border-slate-200/80 leading-relaxed shadow-xs">
        {riskDescription}
      </p>
    </div>
  );
};

