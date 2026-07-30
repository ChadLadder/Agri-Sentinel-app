import React, { useState } from 'react';
import { Header } from './components/Header';
import { LiveMapExplorer } from './components/LiveMapExplorer';
import { GlobeVisualizer } from './components/GlobeVisualizer';
import { CrisisForm } from './components/CrisisForm';
import { CrisisResult } from './components/CrisisResult';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GemmaProvider, CrisisScanRequest, CrisisScanResult, CommandAgentStatus } from './types';
import { processCommandSwarmRequest } from './services/commandSwarmEngine';
import { GLOBAL_DISASTER_MARKERS } from './data/disasters';

export function App() {
  const [provider, setProvider] = useState<GemmaProvider>('webgpu');
  const [offGridMode, setOffGridMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'ta' | 'hi' | 'es'>('en');
  const [activeTab, setActiveTab] = useState<'map' | 'swarm' | 'analytics'>('map');

  const [currentLocationName, setCurrentLocationName] = useState<string>(GLOBAL_DISASTER_MARKERS[0].name);
  const [currentLat, setCurrentLat] = useState<number>(GLOBAL_DISASTER_MARKERS[0].lat);
  const [currentLng, setCurrentLng] = useState<number>(GLOBAL_DISASTER_MARKERS[0].lng);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<CrisisScanResult | null>(null);

  const handleSelectMapLocation = (name: string, lat: number, lng: number) => {
    setCurrentLocationName(name);
    setCurrentLat(lat);
    setCurrentLng(lng);
  };

  const handleCrisisSubmit = async (request: CrisisScanRequest) => {
    setIsLoading(true);
    try {
      const result = await processCommandSwarmRequest(request);
      setScanResult(result);
    } catch (e) {
      console.error('[GeoGemma 4] Processing error:', e);
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Interactive Live Map & Command Configurator */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Real Leaflet Map Canvas */}
            <LiveMapExplorer onSelectLocation={handleSelectMapLocation} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-6">
                <CrisisForm
                  onSubmit={handleCrisisSubmit}
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
                  <CrisisResult result={scanResult} />
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

        {/* Tab 2: Command Swarm Results */}
        {activeTab === 'swarm' && (
          <div className="space-y-6">
            {scanResult ? (
              <CrisisResult result={scanResult} />
            ) : (
              <div className="glass-panel p-10 text-center space-y-4 border-dashed border-slate-800">
                <h3 className="text-base font-bold text-slate-200">No Active Command Swarm Result</h3>
                <p className="text-xs text-slate-400">Select a location on the map and initiate a Command Swarm run.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Global Analytics */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 bg-slate-950 font-mono-tech">
        <span>GeoGemma 4 • GDG VIT Chennai "Build with Gemma" Hackathon Submission • Powered by Google DeepMind Gemma 4</span>
      </footer>
    </div>
  );
}

export default App;
