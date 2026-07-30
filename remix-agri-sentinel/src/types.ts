export interface DiseaseRecord {
  crop: string;
  disease_id: string;
  disease_name: string;
  pathogen_type: 'Fungal' | 'Bacterial' | 'Viral';
  pathogen_scientific_name: string;
  temp_min: number;
  temp_max: number;
  humidity_min: number;
  rainfall_req: 'high' | 'moderate' | 'any';
  risk_level: 'Critical High' | 'High' | 'Moderate';
  verified_treatment: string;
  preventive_action: string;
  uniprot_id: string;
  target_protein_name: string;
}

export interface WeatherData {
  locationName: string;
  latitude: number;
  longitude: number;
  temperature: number; // Celsius
  humidity: number; // %
  rainfall: number; // mm in last 24h
  windSpeed: number; // km/h
  conditionText: string;
  isSimulated?: boolean;
}

export interface DiseaseMatch {
  disease: DiseaseRecord;
  matchScore: number; // 0-100%
  tempMatch: boolean;
  humidityMatch: boolean;
  rainfallMatch: boolean;
  riskSeverity: 'Critical High' | 'High' | 'Moderate' | 'Low Risk';
  riskDescription: string;
}

export interface StrategyAgentOutput {
  rawResponse: string;
  proposedTreatment: string;
  preventiveSteps: string[];
  irrigationAdvice: string;
  monitoringFrequency: string;
  dosageInstructions: string;
  chemicalMentions: string[];
}

export interface GuardrailResult {
  isVerified: boolean;
  hallucinationDetected: boolean;
  sanitizedOutput: StrategyAgentOutput;
  flaggedChemicals: string[];
  approvedChemicals: string[];
  auditLog: AgronomicAuditLog;
}

export interface AgronomicAuditLog {
  timestamp: string;
  agentGemma7BStatus: 'COMPLETED';
  agentGemma2BStatus: 'VERIFIED_SAFE' | 'INTERCEPTED_HALLUCINATION';
  guardrailChecks: {
    checkName: string;
    passed: boolean;
    details: string;
  }[];
  executionTimeMs: number;
}

export interface AlphaFoldProteinData {
  uniprotId: string;
  proteinName: string;
  organism: string;
  sequenceLength: number;
  plddtAverageScore: number;
  pdbUrl?: string;
  cifUrl?: string;
  bcifUrl?: string;
  uniprotSequence?: string;
  molecularWeight?: string;
  inhibitorTargetNote?: string;
}

export interface AdvisoryRequest {
  crop: string;
  growthStage: string;
  weather: WeatherData;
  language?: 'en' | 'ta' | 'hi' | 'te';
  forceSimulateHallucination?: boolean;
  offGridMode?: boolean;
}

export interface AdvisoryResponse {
  diseaseMatch: DiseaseMatch;
  strategyOutput: StrategyAgentOutput;
  guardrailResult: GuardrailResult;
  alphaFoldData?: AlphaFoldProteinData;
  isOffGrid: boolean;
  executionTimestamp: string;
}
