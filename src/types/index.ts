export interface BenchmarkScore {
  metric: string;
  category: string;
  glimmer30B: number;
  prevWeekGlimmer30B: number;
  gemma4_31B: number;
  qwen36_27B: number;
  description: string;
  unit: string;
}

export interface HardwarePreset {
  id: string;
  name: string;
  vramGb: number;
  computeTflops: number;
  dflashSupported: boolean;
  baseToksPerSec: number;
  dflashToksPerSec: number;
  description: string;
}

export interface CapabilityItem {
  id: string;
  title: string;
  icon: string;
  category: 'software' | 'hardware' | 'memory' | 'payment';
  summary: string;
  description: string;
  pipeline: {
    input: string;
    reasoning: string;
    sandboxAction: string;
    verification: string;
  };
  keyTech: string;
}

export interface SecurityLayer {
  layer: number;
  name: string;
  shortName: string;
  headline: string;
  mechanism: string;
  technicalDetails: string[];
  failureModePrevented: string;
  color: string;
}

export interface AttackScenario {
  id: string;
  title: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium';
  attackPayload: string;
  attackVector: string;
  targetObjective: string;
  layerResults: {
    layer: number;
    status: 'neutralized' | 'flagged' | 'mitigated' | 'blocked';
    log: string;
  }[];
  finalOutcome: string;
}

export interface NoteAppComparison {
  name: string;
  isAllume: boolean;
  platforms: string[];
  storageType: string;
  primaryFeatures: string;
  pricing: string;
  targetAudience: string;
  strengths: string[];
  limitations: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  target: string;
  monthlyPriceUsd: number;
  tokenAllocation: string;
  features: string[];
  vmLevel: string;
  highlighted?: boolean;
}

export interface RiskAnalysis {
  id: string;
  title: string;
  category: 'Privacy' | 'Ecosystem Conflict' | 'Financial & UX';
  severity: 'Critical' | 'High' | 'Moderate';
  incidentCase: string;
  technicalRootCause: string;
  userMitigation: string;
  developerCountermeasure: string;
}

export interface BaselineModelPreset {
  id: string;
  name: string;
  architecture: string;
  guardrailLevel: string;
  description: string;
}

export interface ModelDefenseComparison {
  scenarioId: string;
  scenarioTitle: string;
  category: string;
  glimmer30B: {
    status: 'Blocked' | 'Neutralized';
    stoppedAtLayer: string;
    exfiltrationPrevented: boolean;
    financialLoss: string;
    detectionLatencyMs: number;
    log: string;
  };
  baselineModel: {
    status: 'Breached' | 'Partially Blocked' | 'Exploited';
    breachPoint: string;
    exfiltrationPrevented: boolean;
    financialLoss: string;
    detectionLatencyMs: number;
    log: string;
  };
  differentialBenefit: string;
  resilienceDeltaPercent: number;
}

