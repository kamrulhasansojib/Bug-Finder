
export interface BugAnalysis {
  isValid: boolean;
  message: string;
  line?: number;
  column?: number;
  type: 'syntax' | 'logical' | 'runtime' | 'none';
  aiSuggestion?: string;
  fixedCode?: string;
  // Added missing logicalErrorExplanation property
  logicalErrorExplanation?: string;
  // Added missing performanceTips property
  performanceTips?: string;
  severity: 'error' | 'warning' | 'success';
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}