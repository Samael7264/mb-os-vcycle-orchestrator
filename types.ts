export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface TestFile {
  name: string;
  code: string;
}

export interface QualityAnalysisRow {
  file: string;
  coverage: number;
  mutationScore: number;
  risk: RiskLevel;
  recommendation: string;
  codeSnippet?: string;
  type?: string;
  status?: string;
  min?: number;
  max?: number;
  scale?: number;
}

export interface QualityReportData {
  summary: {
    totalTests: number;
    coverage: number;
    mutationScore: number;
    riskLevel: RiskLevel;
    totalSignals: number;
    analyzedSignals: number;
    issuesDetected: number;
  };
  details: QualityAnalysisRow[];
}

export enum SummaryType {
  TECHNICAL = 'Technical',
  FUNCTIONAL = 'Functional',
  EXECUTIVE = 'Executive'
}

export enum TestType {
  UNIT = 'Unit',
  INTEGRATION = 'Integration',
  BOTH = 'Both'
}
