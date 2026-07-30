export type GemmaProvider = 'webgpu' | 'ollama' | 'groq' | 'openrouter';

export type AnalysisSector = 'Disaster & Climate' | 'Agronomic Health' | 'Air Quality & Pollution' | 'Economic Commodity' | 'Pandemic Bio-Security';

export interface PlanetaryAPIData {
  locationName: string;
  latitude: number;
  longitude: number;
  temperature: string;
  humidity: string;
  windSpeed: string;
  pressure: string;
  dewPoint: string;
  airQualityIndex: number; // PM2.5
  co2Ppm: number;
  thermalAnomalyCount: number;
  affectedPopulation: number;
  marketVolatilityIndex: string;
}

export interface OmniScanRequest {
  locationName: string;
  latitude: number;
  longitude: number;
  sector: AnalysisSector;
  queryNotes: string;
  provider: GemmaProvider;
  offGridMode: boolean;
  language: 'en' | 'ta' | 'hi' | 'es';
}

export type StepStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FLAGGED';

export interface OmniAgentStatus {
  id: string;
  name: string;
  role: string;
  status: StepStatus;
  detail: string;
  executionTimeMs?: number;
  modelUsed?: string;
}

export interface OmniScanResult {
  locationName: string;
  latitude: number;
  longitude: number;
  sector: AnalysisSector;
  riskScore: number; // 0 - 100
  threatRating: 'CRITICAL SEVERITY' | 'ELEVATED RISK' | 'MODERATE' | 'OPTIMAL';
  planetaryData: PlanetaryAPIData;
  predictiveInsights: string[];
  actionChecklist: string[];
  executiveBrief: string;
  voiceAdvisoryText: string;
  agentStatuses: OmniAgentStatus[];
  totalExecutionTimeMs: number;
  gemmaModelUsed: string;
  isOfflineMode: boolean;
}
