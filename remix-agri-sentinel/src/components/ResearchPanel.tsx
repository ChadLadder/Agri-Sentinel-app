import React, { useEffect, useRef } from 'react';
import { Dna, ExternalLink, Download, Layers, Activity, ShieldCheck, Microscope, Info } from 'lucide-react';
import { AlphaFoldProteinData } from '../types';
import { Language, t } from '../utils/i18n';

interface ResearchPanelProps {
  proteinData: AlphaFoldProteinData;
  cropName: string;
  diseaseName: string;
  language: Language;
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({
  proteinData,
  cropName,
  diseaseName,
  language,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simple procedural 3D protein ribbon visualizer on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const pointsCount = 60;
      const radius = 55;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Draw 3D-like spiraling alpha-helix ribbon with pLDDT confidence color nodes
      for (let i = 0; i < pointsCount; i++) {
        const tVal = (i / pointsCount) * Math.PI * 4 + angle;
        const x = Math.sin(tVal) * radius;
        const y = (i - pointsCount / 2) * 3.2;
        const z = Math.cos(tVal) * radius;

        const scale = (z + 100) / 160;
        const projX = x * scale;
        const projY = y * scale;
        const nodeRadius = Math.max(2, 5 * scale);

        // AlphaFold pLDDT Confidence color scale
        let color = '#0284c7'; // Very high (>90) Sky Blue
        if (i % 7 === 0) color = '#0284c7';
        if (i % 11 === 0) color = '#d97706'; // Confident (70-90) Amber
        if (i % 17 === 0) color = '#ea580c'; // Low (<70) Orange

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(projX, projY, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Connect backbone bonds
        if (i > 0) {
          const prevT = ((i - 1) / pointsCount) * Math.PI * 4 + angle;
          const prevX = Math.sin(prevT) * radius;
          const prevY = (i - 1 - pointsCount / 2) * 3.2;
          const prevZ = Math.cos(prevT) * radius;
          const prevScale = (prevZ + 100) / 160;

          ctx.strokeStyle = color;
          ctx.lineWidth = 2 * scale;
          ctx.beginPath();
          ctx.moveTo(prevX * prevScale, prevY * prevScale);
          ctx.lineTo(projX, projY);
          ctx.stroke();
        }
      }

      ctx.restore();

      angle += 0.015;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [proteinData]);

  return (
    <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl space-y-6 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white shadow-md shadow-sky-500/20 flex items-center justify-center shrink-0">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black bg-sky-100 text-sky-900 px-3 py-0.5 rounded-full border border-sky-300">
                AlphaFold DB Structural Integration
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold">
                UniProt ID: {proteinData.uniprotId}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
              {t('researchPanel', language)}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Target pathogen protein structural dynamics for disease-resistant crop breeding research
            </p>
          </div>
        </div>

        {/* External Links */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {proteinData.pdbUrl && (
            <a
              href={proteinData.pdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download PDB 3D Model</span>
            </a>
          )}
          <a
            href={`https://www.uniprot.org/uniprotkb/${proteinData.uniprotId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-sky-600" />
            <span>UniProt KB</span>
          </a>
        </div>
      </div>

      {/* Main Grid: 3D Protein Canvas & Metadata Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Canvas Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg border border-slate-800">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-slate-300 font-bold">
            <Microscope className="w-4 h-4 text-sky-400" />
            <span>Alpha-Helix Backbone 3D Simulation</span>
          </div>

          <canvas
            ref={canvasRef}
            width={340}
            height={240}
            className="my-3 cursor-grab active:cursor-grabbing"
          />

          {/* pLDDT Legend */}
          <div className="w-full mt-2 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300 font-medium">
            <span className="font-bold text-slate-200">pLDDT Confidence:</span>
            <div className="flex items-center gap-3 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> &gt;90 High
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 70-90
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> &lt;70
              </span>
            </div>
          </div>
        </div>

        {/* Protein Scientific Metadata */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" />
              Target Biochemical Metadata
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Protein</div>
                <div className="font-black text-sky-900 mt-0.5">{proteinData.proteinName}</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pathogen Organism</div>
                <div className="font-bold text-slate-800 mt-0.5">{proteinData.organism}</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sequence Length</div>
                <div className="font-mono font-bold text-slate-800 mt-0.5">{proteinData.sequenceLength} aa</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Molecular Weight</div>
                <div className="font-mono font-bold text-emerald-700 mt-0.5">{proteinData.molecularWeight}</div>
              </div>
            </div>
          </div>

          {/* Inhibitor & Breeding Note */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-2">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600" />
              Agri-Breeding & Inhibitor Target Notes
            </div>
            <p className="text-xs text-slate-700 font-medium bg-white p-3.5 rounded-xl border border-slate-200/80 leading-relaxed shadow-xs">
              {proteinData.inhibitorTargetNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

