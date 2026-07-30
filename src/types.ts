export type GemmaProvider = 'webgpu' | 'ollama' | 'groq' | 'openrouter';

export type TriagePriority = 'RED - IMMEDIATE LIFE THREAT' | 'YELLOW - URGENT CARE' | 'GREEN - NON-URGENT';

export type EmergencyCategory = 'Hemorrhage/Bleeding' | 'Cardiac Distress' | 'Snake Bite' | 'Burn Injury' | 'Heatstroke' | 'Respiratory Distress';

export interface EmergencyPreset {
  id: string;
  title: string;
  category: EmergencyCategory;
  symptoms: string;
  icdCode: string;
  triagePriority: TriagePriority;
  vitalSigns: {
    heartRate: string;
    bloodPressure: string;
    oxygenSat: string;
    respiratoryRate: string;
  };
  traumaZone: 'Head/Neck' | 'Chest' | 'Abdomen' | 'Upper Limb' | 'Lower Limb' | 'Systemic';
  goldenWindowMinutes: number;
}

export interface TriageRequest {
  patientSymptoms: string;
  category: EmergencyCategory;
  location: string;
  language: 'en' | 'ta' | 'hi';
  provider: GemmaProvider;
  offGridMode: boolean;
  selectedPresetId?: string;
}

export type StepStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FLAGGED';

export interface TriageAgentStatus {
  id: string;
  name: string;
  role: string;
  status: StepStatus;
  detail: string;
  executionTimeMs?: number;
  modelUsed?: string;
}

export interface TriageResult {
  emergencyTitle: string;
  category: EmergencyCategory;
  triagePriority: TriagePriority;
  icdCode: string;
  vitalSigns: {
    heartRate: string;
    bloodPressure: string;
    oxygenSat: string;
    respiratoryRate: string;
  };
  goldenWindowMinutes: number;
  plainEnglishSummary: string;
  firstAidSteps: string[];
  doNotDoWarnings: string[];
  voiceAdvisoryText: string;
  traumaZone: string;
  agentStatuses: TriageAgentStatus[];
  totalExecutionTimeMs: number;
  gemmaModelUsed: string;
  isOfflineMode: boolean;
}
