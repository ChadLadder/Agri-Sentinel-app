import React, { useState } from 'react';
import { Header } from './components/Header';
import { LiveMapExplorer } from './components/LiveMapExplorer';
import { GlobeVisualizer } from './components/GlobeVisualizer';
import { OmniForm } from './components/OmniForm';
import { OmniResult } from './components/OmniResult';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GemmaProvider, OmniScanRequest, OmniScanResult } from './types';
import { processOmniSwarmRequest } from './services/omniSwarmEngine';

export function App() {
  const [provider, setProvider] = useState<GemmaProvider>('webgpu');
  const [offGridMode, setOffGridMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'ta' | 'hi' | 'es'>('en');
  const [activeTab, setActiveTab] = useState<'map' | 'swarm' | 'analytics'>('map');

  const [currentLocationName, setCurrentLocationName] = useState<string>('Coimbatore Delta, Tamil Nadu');
  const [currentLat, setCurrentLat] = useState<number>(11.0168);
  const [currentLng, setCurrentLng] = useState<number>(76.9558);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<OmniScanResult | null>(null);

  const handleSelectMapLocation = (name: string, lat: number, lng: number) => {
    setCurrentLocationName(name);
    setCurrentLat(lat);
    setCurrentLng(lng);
  };

  const handleOmniSubmit = async (request: OmniScanRequest) => {
    setIsLoading(true);
    try {
      const result = await processOmniSwarmRequest(request);
      setScanResult(result);
    } catch (e) {
      console.error('[OmniGemma 4] Swarm Execution Error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Bar */}
      <Header
        provider={provider}
        onProviderChange={setProvider}
        offGridMode={offGridMode}
        onToggleOffGrid={() => setOffGridMode(!offGridMode)}
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Interactive Leaflet Map & Multi-API Configurator */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <LiveMapExplorer onSelectLocation={handleSelectMapLocation} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-6">
                <OmniForm
                  onSubmit={handleOmniSubmit}
                  isLoading={isLoading}
                  currentLocationName={currentLocationName}
                  currentLat={currentLat}
                  currentLng={currentLng}
                  currentProvider={provider}
                  offGridMode={offGridMode}
                  language={language}
                />
              </div>

              <div className="lg:col-span-6 space-y-6">
                {scanResult ? (
                  <OmniResult result={scanResult} />
                ) : (
                  <GlobeVisualizer
                    locationName={currentLocationName}
                    latitude={currentLat}
                    longitude={currentLng}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Gemma Swarm Results */}
        {activeTab === 'swarm' && (
          <div className="space-y-6">
            {scanResult ? (
              <OmniResult result={scanResult} />
            ) : (
              <div className="glass-panel p-10 text-center space-y-4 border-dashed border-slate-800">
                <h3 className="text-base font-bold text-slate-200">No Active Multi-API Swarm Result</h3>
                <p className="text-xs text-slate-400">Select a location on the map and run a Multi-API Swarm Scan.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Big Data Analytics */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 bg-slate-950 font-mono-tech">
        <span>OmniGemma 4 • GDG VIT Chennai "Build with Gemma" Hackathon Submission • Powered by Google DeepMind Gemma 4</span>
      </footer>
    </div>
  );
}

export default App;
