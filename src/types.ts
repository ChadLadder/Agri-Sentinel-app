export type GemmaProvider = 'ollama' | 'groq' | 'openrouter' | 'webgpu';

export type Language = 'en' | 'ta' | 'hi' | 'te';

export interface CropDisease {
  disease_id: string;
  crop_name: string;
  disease_name: string;
  symptoms: string;
  pathogen_type: 'Fungal' | 'Bacterial' | 'Oomycete' | 'Viral';
  alphafold_pdb_id: string;
  target_protein: string;
  approved_chemical: string;
  verified_treatment: string;
  organic_remedy: string;
  recommended_dosage: string;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface AdvisoryRequest {
  cropName: string;
  symptoms: string;
  location?: string;
  imageUrl?: string;
  language: Language;
  provider: GemmaProvider;
  offGridMode: boolean;
  forceSimulateUnsafe?: boolean;
}

export type StepStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FLAGGED' | 'FAILED';

export interface SwarmAgentStatus {
  id: string;
  name: string;
  role: string;
  status: StepStatus;
  detail: string;
  executionTimeMs?: number;
  modelUsed?: string;
}

export interface GuardrailAuditReport {
  safe: boolean;
  auditPassed: boolean;
  confidenceScore: number;
  flaggedReason?: string;
  suggestedMitigation?: string;
  verifiedChemical?: string;
  provider: string;
  executionTimeMs: number;
}

export interface AlphaFoldProtein {
  pdbId: string;
  proteinName: string;
  uniprotId: string;
  organism: string;
  bindingSiteResidues: string[];
  mechanismExplanation: string;
  molecularWeight: string;
}

export interface AdvisoryResult {
  disease: CropDisease;
  strategyText: string;
  verifiedTreatment: string;
  organicOption: string;
  dosage: string;
  weatherContext: {
    temperature: string;
    humidity: string;
    condition: string;
    riskAlert: string;
  };
  proteinTarget: AlphaFoldProtein;
  guardrailReport: GuardrailAuditReport;
  agentStatuses: SwarmAgentStatus[];
  totalExecutionTimeMs: number;
  gemmaModelUsed: string;
  isOfflineMode: boolean;
}

export interface LocalGemmaStatus {
  ollamaConnected: boolean;
  availableModels: string[];
  recommendedModel: string;
  webGpuSupported: boolean;
}
