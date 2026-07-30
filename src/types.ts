export type GemmaProvider = 'ollama' | 'groq' | 'openrouter' | 'webgpu';

export type VulnerabilityCategory = 'SQLi' | 'XSS' | 'RCE' | 'BrokenAuth' | 'PathTraversal' | 'HardcodedSecrets';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Safe';

export interface SecurityVulnerability {
  id: string;
  cveId: string;
  title: string;
  category: VulnerabilityCategory;
  severity: SeverityLevel;
  cvssScore: number;
  vulnerableLineNumber: number;
  vulnerableSnippet: string;
  description: string;
  remediationGuidance: string;
  cweId: string;
}

export interface SecurityScanRequest {
  sourceCode: string;
  filename: string;
  language: 'typescript' | 'javascript' | 'python' | 'go' | 'rust';
  provider: GemmaProvider;
  offGridMode: boolean;
  forceSimulateExploit?: boolean;
  selectedExploitPreset?: string;
}

export type StepStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FLAGGED' | 'FAILED';

export interface SecurityAgentStatus {
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
  verifiedFixSnippet?: string;
  provider: string;
  executionTimeMs: number;
}

export interface ASTNode3D {
  id: string;
  name: string;
  type: 'function' | 'variable' | 'input' | 'database' | 'auth' | 'exploit';
  status: 'safe' | 'vulnerable' | 'patched';
  cve?: string;
  position: [number, number, number];
}

export interface SecurityScanResult {
  filename: string;
  language: string;
  originalCode: string;
  patchedCode: string;
  gitDiff: string;
  vulnerabilitiesFound: SecurityVulnerability[];
  overallRiskScore: number;
  securityRating: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  astNodes: ASTNode3D[];
  guardrailReport: GuardrailAuditReport;
  agentStatuses: SecurityAgentStatus[];
  totalExecutionTimeMs: number;
  gemmaModelUsed: string;
  isOfflineMode: boolean;
}
