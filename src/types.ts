export type GemmaProvider = 'webgpu' | 'ollama' | 'groq' | 'openrouter';

export type DisasterCategory = 'Wildfire/Heatwave' | 'Severe Flooding' | 'Cyclone/Typhoon' | 'Earthquake' | 'Drought/Aridity' | 'Medical Crisis';

export type SeverityRating = 'CAT-5 CRITICAL' | 'CAT-4 HIGH RISK' | 'CAT-3 MODERATE' | 'CAT-1 SAFE';

export interface MapLocationMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: DisasterCategory;
  severity: SeverityRating;
  populationAtRisk: number;
  humidity: string;
  temp: string;
  windSpeed: string;
  evacuationStatus: 'Mandatory Evacuation' | 'Watch & Act' | 'Normal Operations';
}

export interface CrisisScanRequest {
  locationName: string;
  latitude: number;
  longitude: number;
  category: DisasterCategory;
  incidentNotes: string;
  provider: GemmaProvider;
  offGridMode: boolean;
  language: 'en' | 'ta' | 'hi' | 'es';
}

export type StepStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FLAGGED';

export interface CommandAgentStatus {
  id: string;
  name: string;
  role: string;
  status: StepStatus;
  detail: string;
  executionTimeMs?: number;
  modelUsed?: string;
}

export interface CrisisScanResult {
  locationName: string;
  latitude: number;
  longitude: number;
  category: DisasterCategory;
  severity: SeverityRating;
  riskIndexScore: number; // 0 - 100
  affectedPopulation: number;
  weatherMetrics: {
    temp: string;
    humidity: string;
    windSpeed: string;
    pressure: string;
    airQualityIndex: number;
  };
  evacuationRoutePlan: string[];
  logisticsChecklist: string[];
  executiveBrief: string;
  voiceBroadcastText: string;
  agentStatuses: CommandAgentStatus[];
  totalExecutionTimeMs: number;
  gemmaModelUsed: string;
  isOfflineMode: boolean;
}
