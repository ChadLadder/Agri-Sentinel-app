import React, { useState } from 'react';
import { CropDisease } from '../types';
import { updateCustomDataset } from '../data/diseases';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';

interface CustomDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (diseases: CropDisease[]) => void;
}

export const CustomDatasetModal: React.FC<CustomDatasetModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleParseAndApply = () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = (results.data as any[]).map((row, idx) => ({
          disease_id: row.disease_id || `CUSTOM_${idx}`,
          crop_name: row.crop_name || 'Custom Crop',
          disease_name: row.disease_name || 'Custom Disease',
          symptoms: row.symptoms || '',
          pathogen_type: row.pathogen_type || 'Fungal',
          alphafold_pdb_id: row.alphafold_pdb_id || 'P00321',
          target_protein: row.target_protein || 'Target Protein',
          approved_chemical: row.approved_chemical || 'Approved Chemical',
          verified_treatment: row.verified_treatment || 'Verified Protocol',
          organic_remedy: row.organic_remedy || 'Organic Solution',
          recommended_dosage: row.recommended_dosage || 'Standard dosage',
          risk_level: row.risk_level || 'Medium',
        }));

        if (parsed.length > 0) {
          updateCustomDataset(parsed as CropDisease[]);
          onSuccess(parsed as CropDisease[]);
          setStatusMsg(`Successfully loaded ${parsed.length} custom disease records!`);
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="glass-panel p-6 max-w-md w-full relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-100">Upload Custom Ground-Truth CSV</h3>
        </div>

        <p className="text-xs text-slate-400">
          Upload a custom CSV file (`disease_id, crop_name, disease_name, symptoms, approved_chemical...`) to ground the Gemma Swarm with regional data.
        </p>

        <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center bg-slate-900/50 hover:border-emerald-500/50 transition-all cursor-pointer">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload-input"
          />
          <label htmlFor="csv-upload-input" className="cursor-pointer block">
            <FileText className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
            <span className="text-xs font-semibold text-slate-200 block">
              {file ? file.name : 'Click to select CSV dataset file'}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Supports PapaParse CSV format</span>
          </label>
        </div>

        {statusMsg && (
          <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleParseAndApply}
            disabled={!file}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-50 transition-all"
          >
            Apply Dataset
          </button>
        </div>
      </div>
    </div>
  );
};
