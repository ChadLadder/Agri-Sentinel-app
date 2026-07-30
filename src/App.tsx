import React, { useState } from 'react';
import { Header } from './components/Header';
import { SwarmPipeline } from './components/SwarmPipeline';
import { SecurityForm } from './components/SecurityForm';
import { SecurityResult } from './components/SecurityResult';
import { ASTVisualizer } from './components/ASTVisualizer';
import { GemmaProvider, SecurityScanRequest, SecurityScanResult, SecurityAgentStatus } from './types';
import { processSecurityScanRequest } from './services/multiAgentEngine';
import { HACKATHON_EXPLOIT_PRESETS } from './data/exploits';

export function App() {
  const [provider, setProvider] = useState<GemmaProvider>('webgpu');
  const [offGridMode, setOffGridMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'swarm' | 'playground' | 'ast'>('swarm');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<SecurityScanResult | null>(null);

  const [agentStatuses, setAgentStatuses] = useState<SecurityAgentStatus[]>([
    {
      id: 'agent-1',
      name: 'Gemma 4 Static Code & AST Auditor',
      role: 'Parses code Abstract Syntax Tree (AST) & scans for OWASP Top 10 vulnerabilities',
      status: 'IDLE',
      detail: 'Ready for source code input or 1-click CVE scenario injection.',
    },
    {
      id: 'agent-2',
      name: 'Gemma 4 Threat & CVE Diagnostician',
      role: 'Cross-references vulnerability signatures against National Vulnerability Database (NVD)',
      status: 'IDLE',
      detail: 'Waiting for AST analysis output...',
    },
    {
      id: 'agent-3',
      name: 'Gemma 4 Self-Healing Patch Generator',
      role: 'Generates refactored, secure code & automated Git diff patch',
      status: 'IDLE',
      detail: 'Waiting for vulnerability isolation...',
    },
    {
      id: 'agent-4',
      name: 'Gemma 4 AIShield Security Guardrail',
      role: 'Executes 2nd Gemma inference audit on generated patch to prevent regression vulnerabilities',
      status: 'IDLE',
      detail: 'Waiting for candidate code patch...',
    },
  ]);

  const handleScanSubmit = async (request: SecurityScanRequest) => {
    setIsLoading(true);
    try {
      const result = await processSecurityScanRequest(request, (updatedStatuses) => {
        setAgentStatuses(updatedStatuses);
      });
      setScanResult(result);
    } catch (e) {
      console.error('[AegisGemma 4] Swarm Execution Error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060812] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Bar */}
      <Header
        provider={provider}
        onProviderChange={setProvider}
        offGridMode={offGridMode}
        onToggleOffGrid={() => setOffGridMode(!offGridMode)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Live Autonomous Swarm Agent Pipeline Telemetry Bar */}
        <SwarmPipeline statuses={agentStatuses} />

        {/* Tab 1 & Tab 2: Swarm Audit & Exploit Playground */}
        {(activeTab === 'swarm' || activeTab === 'playground') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-6">
              <SecurityForm
                onSubmit={handleScanSubmit}
                isLoading={isLoading}
                currentProvider={provider}
                offGridMode={offGridMode}
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              {scanResult ? (
                <SecurityResult result={scanResult} />
              ) : (
                <div className="glass-panel p-8 text-center space-y-4 border-dashed border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
                    ⚡
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">AegisGemma 4 Security Swarm Ready</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Select a 1-click CVE exploit scenario or paste source code to trigger Gemma 4 multi-agent AST analysis, automated Git diff patch generation, and AIShield verification.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: 3D AST WebGL Visualizer */}
        {activeTab === 'ast' && (
          <ASTVisualizer
            nodes={
              scanResult?.astNodes || [
                { id: 'n1', name: 'req.body (Input)', type: 'input', status: 'safe', position: [-6, 2, 0] },
                { id: 'n2', name: 'Raw SQL Concatenation', type: 'exploit', status: 'vulnerable', cve: 'CVE-2024-8931', position: [0, 4, 2] },
                { id: 'n3', name: 'Database Query Engine', type: 'database', status: 'vulnerable', cve: 'CVE-2024-8931', position: [6, 2, 0] },
              ]
            }
          />
        )}
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 bg-slate-950 font-mono-tech">
        <span>AegisGemma 4 • GDG VIT Chennai "Build with Gemma" Hackathon Submission • Powered by Google DeepMind Gemma 4 Open Models</span>
      </footer>
    </div>
  );
}

export default App;
