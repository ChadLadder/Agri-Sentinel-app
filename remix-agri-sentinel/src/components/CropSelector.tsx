import React from 'react';
import { Sprout, Layers, Leaf, Sparkles } from 'lucide-react';
import { getDiseaseDatabase } from '../data/diseases';
import { Language, t } from '../utils/i18n';
import { motion } from 'motion/react';

interface CropSelectorProps {
  selectedCrop: string;
  onSelectCrop: (crop: string) => void;
  growthStage: string;
  onChangeGrowthStage: (stage: string) => void;
  language: Language;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  selectedCrop,
  onSelectCrop,
  growthStage,
  onChangeGrowthStage,
  language,
}) => {
  const db = getDiseaseDatabase();
  const availableCrops = Array.from(new Set(db.map((d) => d.crop)));

  const STAGES = [
    { id: 'Seedling', label: t('seedling', language) },
    { id: 'Vegetative', label: t('vegetative', language) },
    { id: 'Flowering', label: t('flowering', language) },
    { id: 'Fruiting', label: t('fruiting', language) },
    { id: 'Pre-Harvest', label: t('harvest', language) },
  ];

  return (
    <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl space-y-5 transition-all">
      {/* Crop Cards Selector Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            {t('selectCrop', language)}
          </label>
          <span className="text-[11px] text-slate-500 font-semibold">
            {availableCrops.length} Supported Crops
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5">
          {availableCrops.map((cropName) => {
            const isSelected = selectedCrop.toLowerCase() === cropName.toLowerCase();
            return (
              <motion.button
                key={cropName}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCrop(cropName)}
                className={`relative flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-500 to-teal-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-50 border-slate-200/90 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <Leaf className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                <span className="truncate max-w-full">{cropName}</span>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-white" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Growth Stage Selector Section */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 shrink-0">
          <Layers className="w-4 h-4 text-sky-600" />
          {t('growthStage', language)}:
        </label>

        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {STAGES.map((stg) => {
            const isSel = growthStage === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => onChangeGrowthStage(stg.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSel
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {stg.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

