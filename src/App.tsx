import React, { useState } from 'react';
import { Header } from './components/Header';
import { SafetyForm } from './components/SafetyForm';
import { SafetyResult } from './components/SafetyResult';
import { GemmaProvider, SafetyScanRequest, SafetyScanResult, SafetyAgentStatus } from './types';
import { processSafetyScanRequest } from './services/multiAgentEngine';

export function App() {
  const [provider, setProvider] = useState<GemmaProvider>('webgpu');
  const [offGridMode, setOffGridMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<SafetyScanResult | null>(null);

  const handleScanSubmit = async (request: SafetyScanRequest) => {
    setIsLoading(true);
    try {
      const result = await processSafetyScanRequest(request);
      setScanResult(result);
    } catch (e) {
      console.error('[SentryGuard AI] Processing error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060812] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Clean Header Bar */}
      <Header
        provider={provider}
        onProviderChange={setProvider}
        offGridMode={offGridMode}
        onToggleOffGrid={() => setOffGridMode(!offGridMode)}
      />

      {/* Main Consumer Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Simple Consumer Hero Banner */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
            Protect Yourself & Your Family From Cyber Scams
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            SentryGuard AI runs locally on your device powered by Google DeepMind's Gemma 4. Zero code, zero jargon — just simple, instant protection.
          </p>
        </div>

        {/* Two-Column Consumer Scanner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <SafetyForm
              onSubmit={handleScanSubmit}
              isLoading={isLoading}
              currentProvider={provider}
              offGridMode={offGridMode}
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            {scanResult ? (
              <SafetyResult result={scanResult} />
            ) : (
              <div className="glass-panel p-10 text-center space-y-4 border-dashed border-slate-800 flex flex-col items-center justify-center min-h-[380px]">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/10">
                  🛡️
                </div>
                <h3 className="text-base font-bold text-slate-200">SentryGuard AI Ready</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Paste any SMS, email, or message link on the left to receive an instant safety report and clear step-by-step guidance.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Simple Consumer Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 bg-slate-950 font-mono-tech">
        <span>SentryGuard AI • GDG VIT Chennai "Build with Gemma" Hackathon Submission • Powered by Google DeepMind Gemma 4</span>
      </footer>
    </div>
  );
}

export default App;
