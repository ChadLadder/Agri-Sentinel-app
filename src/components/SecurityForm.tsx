import React, { useState } from 'react';
import { SecurityScanRequest } from '../types';
import { HACKATHON_EXPLOIT_PRESETS } from '../data/exploits';
import { ShieldAlert, Terminal, Zap, AlertTriangle, Code2, Sparkles, Check } from 'lucide-react';

interface SecurityFormProps {
  onSubmit: (request: SecurityScanRequest) => void;
  isLoading: boolean;
  currentProvider: SecurityScanRequest['provider'];
  offGridMode: boolean;
}

export const SecurityForm: React.FC<SecurityFormProps> = ({
  onSubmit,
  isLoading,
  currentProvider,
  offGridMode,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sqli-zero-day');
  const [sourceCode, setSourceCode] = useState<string>(HACKATHON_EXPLOIT_PRESETS[0].code);
  const [filename, setFilename] = useState<string>('authController.ts');
  const [language, setLanguage] = useState<SecurityScanRequest['language']>('typescript');
  const [forceSimulateExploit, setForceSimulateExploit] = useState<boolean>(false);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = HACKATHON_EXPLOIT_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSourceCode(found.code);
      setFilename(found.filename);
      setLanguage(found.language as any);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      sourceCode,
      filename,
      language,
      provider: currentProvider,
      offGridMode,
      forceSimulateExploit,
      selectedExploitPreset: selectedPresetId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 border-cyan-500/30 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <span>Code Audit & Zero-Day Exploit Injection Suite</span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono-tech badge-cyan">AST Deep Scan</span>
            </h2>
            <p className="text-xs text-slate-400">Paste source code or select a pre-packaged CVE exploit scenario</p>
          </div>
        </div>
      </div>

      {/* 1-Click Interactive Exploit Scenario Cards for Hackathon Judges */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Hackathon Judge 1-Click Exploit Vectors</span>
          </span>
          <span className="text-[10px] font-mono-tech text-cyan-400">Click to inject code</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {HACKATHON_EXPLOIT_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] flex flex-col justify-between ${
                selectedPresetId === preset.id
                  ? 'bg-amber-950/30 border-amber-500/50 ring-1 ring-amber-500/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-100 truncate">{preset.name}</span>
                {selectedPresetId === preset.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>

              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300 w-fit mb-2">
                {preset.cveId} • {preset.severity}
              </span>

              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-mono-tech">
                {preset.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Source Code Text Area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono-tech text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono-tech text-slate-300 focus:outline-none"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>

        <textarea
          rows={10}
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono-tech text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-y leading-relaxed"
        />
      </div>

      {/* Judge Simulated Regression Toggle */}
      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-amber-300">Hackathon Judge Guardrail Demo Toggle</span>
            <p className="text-[11px] text-slate-400">
              Inject an unsafe `eval()` regression in the patch to test live Gemma 4 AIShield interception.
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
          <input
            type="checkbox"
            checked={forceSimulateExploit}
            onChange={(e) => setForceSimulateExploit(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>

      {/* Submit Scan Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 hover:scale-[1.01]"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
            <span>Executing Gemma 4 Security Agent Swarm...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-current" />
            <span>Audit Code & Synthesize Self-Healing Patch</span>
          </>
        )}
      </button>
    </form>
  );
};
