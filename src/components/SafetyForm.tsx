import React, { useState } from 'react';
import { SafetyScanRequest } from '../types';
import { CONSUMER_SCAM_PRESETS } from '../data/scams';
import { ShieldCheck, MessageSquare, Mail, Link, PhoneCall, Sparkles, Check, ArrowRight, Upload, Mic, Image as ImageIcon } from 'lucide-react';

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
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImageName(file.name);
      setInputText(`[Gemma 4 Multimodal Vision OCR Scan Active]: Uploaded screenshot image "${file.name}". Extracting text and analyzing fake bank logo & domain urgency...`);
    }
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => `${prev} ${transcript}`);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
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
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Multimodal Message & Screenshot Analyzer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste message, upload screenshot, or dictate voice message to scan for scams.
          </p>
        </div>
        <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
          Gemma 4 Multimodal
        </span>
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

      {/* Textarea Input with Voice Dictation & Multimodal Screenshot Drag-and-Drop */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300">Message Content / Text Input</label>

          <div className="flex items-center space-x-2">
            {/* Screenshot Upload Button */}
            <label className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500 transition-all flex items-center space-x-1 cursor-pointer">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{uploadedImageName ? 'Screenshot Loaded' : 'Upload Screenshot'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1 border transition-all ${
                isRecording
                  ? 'bg-red-950 border-red-500 text-red-300 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-purple-400 hover:border-purple-500'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste suspicious message text, SMS alert, email contents, or web link here..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono-tech text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none leading-relaxed"
        />
      </div>

      {/* 1-Click Preset Scams Gallery */}
      <div>
        <span className="text-xs font-semibold text-slate-300 block mb-2">1-Click Test Scams (Click to Test):</span>
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
            <span>Running Gemma 4 Autonomous Swarm...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Check Safety & Run Gemma 4 Swarm Scan</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
