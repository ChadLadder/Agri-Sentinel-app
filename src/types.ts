export type GemmaProvider = 'webgpu' | 'ollama' | 'groq' | 'openrouter';

export type ThreatLevel = 'Safe' | 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical Scam';

export interface ScamPreset {
  id: string;
  title: string;
  category: 'Banking Scam' | 'WhatsApp Fraud' | 'Package Delivery' | 'Crypto Phishing';
  message: string;
  sender: string;
  riskScore: number;
  verdict: ThreatLevel;
}

export interface SafetyScanRequest {
  inputText: string;
  sourceType: 'sms' | 'email' | 'whatsapp' | 'link';
  provider: GemmaProvider;
  offGridMode: boolean;
  selectedPresetId?: string;
}

export type StepStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FLAGGED';

export interface SafetyAgentStatus {
  id: string;
  name: string;
  role: string;
  status: StepStatus;
  detail: string;
  executionTimeMs?: number;
}

export interface SafetyScanResult {
  sourceType: string;
  userInputText: string;
  threatLevel: ThreatLevel;
  safetyScore: number; // 0 - 100
  scamType: string;
  plainEnglishVerdict: string;
  keyRedFlags: string[];
  actionChecklist: string[];
  voiceAdvisoryText: string;
  agentStatuses: SafetyAgentStatus[];
  totalExecutionTimeMs: number;
  gemmaModelUsed: string;
  isOfflineMode: boolean;
}
