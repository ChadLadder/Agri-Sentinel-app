import React, { useState } from 'react';
import { Header } from './components/Header';
import { TriageForm } from './components/TriageForm';
import { TriageResult } from './components/TriageResult';
import { PatientVisualizer } from './components/PatientVisualizer';
import { GemmaProvider, TriageRequest, TriageResult as TriageResultType } from './types';
import { processEmergencyTriageRequest } from './services/triageEngine';

export function App() {
  const [provider, setProvider] = useState<GemmaProvider>('webgpu');
  const [offGridMode, setOffGridMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'ta' | 'hi'>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [triageResult, setTriageResult] = useState<TriageResultType | null>(null);

  const handleTriageSubmit = async (request: TriageRequest) => {
    setIsLoading(true);
    try {
      const result = await processEmergencyTriageRequest(request);
      setTriageResult(result);
    } catch (e) {
      console.error('[MediGemma 4] Processing error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060812] text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-slate-950">
      {/* Header Bar */}
      <Header
        provider={provider}
        onProviderChange={setProvider}
        offGridMode={offGridMode}
        onToggleOffGrid={() => setOffGridMode(!offGridMode)}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Main Consumer Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Disaster Triage Hero Banner */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-rose-200 to-red-400 bg-clip-text text-transparent">
            Autonomous Emergency Medical Triage & First-Responder Swarm
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            MediGemma 4 runs locally on-device powered by Google DeepMind's Gemma 4. Zero cell tower or internet required during disaster medical crises.
          </p>
        </div>

        {/* 3D WebGL Patient Anatomical Model */}
        <PatientVisualizer
          traumaZone={triageResult?.traumaZone || 'Lower Limb'}
          category={triageResult?.category || 'Hemorrhage/Bleeding'}
        />

        {/* Two-Column Medical Triage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <TriageForm
              onSubmit={handleTriageSubmit}
              isLoading={isLoading}
              currentProvider={provider}
              offGridMode={offGridMode}
              language={language}
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            {triageResult ? (
              <TriageResult result={triageResult} />
            ) : (
              <div className="glass-panel p-10 text-center space-y-4 border-dashed border-slate-800 flex flex-col items-center justify-center min-h-[380px]">
                <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-400 flex items-center justify-center text-2xl shadow-lg shadow-red-500/10">
                  🚑
                </div>
                <h3 className="text-base font-bold text-slate-200">MediGemma 4 Ready</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Select a clinical emergency scenario or describe trauma symptoms on the left to receive instant Red/Yellow/Green triage priority and 1-2-3 first-aid steps.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 bg-slate-950 font-mono-tech">
        <span>MediGemma 4 • GDG VIT Chennai "Build with Gemma" Hackathon Submission • Track 2: Intelligence with Purpose • Powered by Google DeepMind Gemma 4</span>
      </footer>
    </div>
  );
}

export default App;
