import React, { useState } from 'react';
import { SafetyScanRequest } from '../types';
import { CONSUMER_SCAM_PRESETS } from '../data/scams';
import { ShieldCheck, MessageSquare, Mail, Link, PhoneCall, Sparkles, Check, ArrowRight } from 'lucide-react';

interface SafetyFormProps {
  onSubmit: (request: SafetyScanRequest) => void;
  isLoading: boolean;
  currentProvider: SafetyScanRequest['provider'];
  offGridMode: boolean;
}

export const SafetyForm: React.FC<SafetyFormProps> = ({
  onSubmit,
  isLoading,
  currentProvider,
  offGridMode,
}) => {
  const [sourceType, setSourceType] = useState<SafetyScanRequest['sourceType']>('sms');
  const [inputText, setInputText] = useState<string>(CONSUMER_SCAM_PRESETS[0].message);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bank-kyc-scam');

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = CONSUMER_SCAM_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setInputText(found.message);
      if (found.category === 'Banking Scam') setSourceType('sms');
      else if (found.category === 'WhatsApp Fraud') setSourceType('whatsapp');
      else if (found.category === 'Crypto Phishing') setSourceType('email');
      else setSourceType('link');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      inputText,
      sourceType,
      provider: currentProvider,
      offGridMode,
      selectedPresetId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 border-emerald-500/20 shadow-2xl space-y-6">
      {/* Step Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Paste Any Suspicious Message or Link Below</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          SentryGuard AI analyzes SMS, WhatsApp messages, emails, and links to protect you from financial scams.
        </p>
      </div>

      {/* Source Type Selector */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { type: 'sms', label: 'SMS Text', icon: <MessageSquare className="w-4 h-4" /> },
          { type: 'whatsapp', label: 'WhatsApp', icon: <PhoneCall className="w-4 h-4" /> },
          { type: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
          { type: 'link', label: 'Website Link', icon: <Link className="w-4 h-4" /> },
        ].map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => setSourceType(item.type as any)}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all text-xs font-semibold ${
              sourceType === item.type
                ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500 text-emerald-300 shadow-md'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Textarea Input */}
      <div>
        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste suspicious message text, SMS alert, email contents, or web link here..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none leading-relaxed"
        />
      </div>

      {/* 1-Click Common Scam Examples */}
      <div>
        <span className="text-xs font-semibold text-slate-300 block mb-2">Or click a sample message to test:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CONSUMER_SCAM_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] flex items-center justify-between ${
                selectedPresetId === preset.id
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300 font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-200 block">{preset.title}</span>
                <span className="text-[10px] text-slate-400 font-mono-tech mt-0.5 block">{preset.category}</span>
              </div>
              {selectedPresetId === preset.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 hover:scale-[1.01]"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
            <span>SentryGuard AI Analyzing Message...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Check Safety & Scan Message Now</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
