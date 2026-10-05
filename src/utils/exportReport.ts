import { 
  BENCHMARKS, 
  HARDWARE_PRESETS, 
  CAPABILITIES, 
  SECURITY_LAYERS, 
  ATTACK_SCENARIOS, 
  NOTE_APP_COMPARISONS, 
  PRICING_PLANS, 
  RISKS_AND_CONTROVERSIES, 
  ECOSYSTEM_COMPARISON, 
  DOMESTIC_PLATFORM_IMPACT,
  BASELINE_MODELS,
  MODEL_DEFENSE_COMPARISONS
} from '../data/reportData';
import { ModelDefenseComparison } from '../types';

export interface FullReportPayload {
  reportTitle: string;
  generatedAt: string;
  version: string;
  source: string;
  executiveSummary: {
    kpis: {
      totalDownloads: string;
      localModel: string;
      peakInferenceSpeed: string;
      weeklyFreeTokens: string;
    };
    description: string;
  };
  benchmarks: typeof BENCHMARKS;
  hardwarePresets: typeof HARDWARE_PRESETS;
  capabilities: typeof CAPABILITIES;
  securityArchitecture: {
    corePillars: {
      virtualMachine: string;
      credentialIsolation: string;
      packetInspection: string;
    };
    layers: typeof SECURITY_LAYERS;
    simulatedAttackScenarios: typeof ATTACK_SCENARIOS;
    modelDefenseComparisons: typeof MODEL_DEFENSE_COMPARISONS;
    baselineModels: typeof BASELINE_MODELS;
  };
  pricingModel: typeof PRICING_PLANS;
  spatialCanvasComparison: typeof NOTE_APP_COMPARISONS;
  criticalRisks: typeof RISKS_AND_CONTROVERSIES;
  marketOutlook: {
    bigTechRivalry: typeof ECOSYSTEM_COMPARISON;
    domesticImpact: typeof DOMESTIC_PLATFORM_IMPACT;
  };
}

export interface RecentExportRecord {
  id: string;
  fileName: string;
  format: 'JSON' | 'PDF' | 'MARKDOWN';
  timestamp: string;
  fileSizeBytes: number;
  title: string;
}

const STORAGE_KEY = 'meta_muse_recent_exports';

export function getRecentExports(): RecentExportRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read recent exports from localStorage', err);
  }

  // Initial seed exports so user sees a pre-populated history
  const defaultHistory: RecentExportRecord[] = [
    {
      id: 'exp-init-1',
      fileName: 'meta-muse-full-benchmark-v1.3.json',
      format: 'JSON',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      fileSizeBytes: 24576,
      title: '뮤즈 30B 벤치마크 & 하드웨어 프리셋 데이터셋',
    },
    {
      id: 'exp-init-2',
      fileName: 'meta-muse-security-whitepaper.pdf',
      format: 'PDF',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      fileSizeBytes: 148200,
      title: '메타 뮤즈 5계층 프롬프트 인젝션 방어 백서',
    },
    {
      id: 'exp-init-3',
      fileName: 'meta-muse-model-comparison.json',
      format: 'JSON',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      fileSizeBytes: 19840,
      title: 'Glimmer 30B vs Baseline 모델 차등 방어 결과표',
    }
  ];
  return defaultHistory;
}

export function saveRecentExport(record: RecentExportRecord): void {
  try {
    const list = getRecentExports();
    const updated = [record, ...list.filter((item) => item.id !== record.id)].slice(0, 8);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save export to localStorage', err);
  }
}

export function generateReportData(): FullReportPayload {
  return {
    reportTitle: 'Meta Muse & Agentic AI Technical Intelligence Report',
    generatedAt: new Date().toISOString(),
    version: '2026.09-v1.3',
    source: 'Meta AI Official Technical Whitepaper & On-device Evaluation Suite',
    executiveSummary: {
      kpis: {
        totalDownloads: '5,000,000+ (3주 차, US 마켓 1위)',
        localModel: 'Glimmer 30B (29.6B, Apache 2.0)',
        peakInferenceSpeed: '233.4 tok/s (RTX 5090 DFlash Speculative Decoding)',
        weeklyFreeTokens: '100,000,000 tokens (Free Tier)',
      },
      description: '2026년 9월 8일 공개된 메타의 뮤즈(Meta Muse) 심층 분석 보고서. 단순 텍스트 챗봇을 넘어 웹 브라우징, 쇼핑 결제, 비즈니스 콜링을 자율 수행하는 행동 중심 AI 에이전트 분석.'
    },
    benchmarks: BENCHMARKS,
    hardwarePresets: HARDWARE_PRESETS,
    capabilities: CAPABILITIES,
    securityArchitecture: {
      corePillars: {
        virtualMachine: 'Muse Secure VM (systemd-nspawn, seccomp filters, Confidential VM)',
        credentialIsolation: 'hatch-authd daemon & Stripe Link single-use virtual tokens',
        packetInspection: 'Sentinel Daemon & eBPF Kernel-level Taint Tracking',
      },
      layers: SECURITY_LAYERS,
      simulatedAttackScenarios: ATTACK_SCENARIOS,
      modelDefenseComparisons: MODEL_DEFENSE_COMPARISONS,
      baselineModels: BASELINE_MODELS,
    },
    pricingModel: PRICING_PLANS,
    spatialCanvasComparison: NOTE_APP_COMPARISONS,
    criticalRisks: RISKS_AND_CONTROVERSIES,
    marketOutlook: {
      bigTechRivalry: ECOSYSTEM_COMPARISON,
      domesticImpact: DOMESTIC_PLATFORM_IMPACT,
    }
  };
}

export function downloadReportAsJson(): string {
  const data = generateReportData();
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `meta-muse-agentic-ai-report-${dateStr}.json`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  saveRecentExport({
    id: `exp-${Date.now()}`,
    fileName,
    format: 'JSON',
    timestamp: new Date().toISOString(),
    fileSizeBytes: blob.size,
    title: '메타 뮤즈 2026 종합 기술 보고서 (.json)',
  });

  return fileName;
}

export function triggerPrintReport(): string {
  const fileName = `meta-muse-executive-whitepaper-${new Date().toISOString().slice(0, 10)}.pdf`;
  saveRecentExport({
    id: `exp-${Date.now()}`,
    fileName,
    format: 'PDF',
    timestamp: new Date().toISOString(),
    fileSizeBytes: 154200,
    title: '메타 뮤즈 경영진 브리핑 화이트페이퍼 (.pdf)',
  });
  window.print();
  return fileName;
}

export function copySummaryToClipboard(): Promise<string> {
  const data = generateReportData();
  const text = `# ${data.reportTitle} (${data.version})
발행일자: ${new Date(data.generatedAt).toLocaleDateString('ko-KR')}

## 1. Executive Summary
- 누적 다운로드: ${data.executiveSummary.kpis.totalDownloads}
- 온디바이스 모델: ${data.executiveSummary.kpis.localModel}
- 최고 생성 속도: ${data.executiveSummary.kpis.peakInferenceSpeed}
- 주간 무료 토큰: ${data.executiveSummary.kpis.weeklyFreeTokens}

## 2. Glimmer 30B 벤치마크 결과
${data.benchmarks.map(b => `- ${b.metric}: 글리머 ${b.glimmer30B}점 vs 젬마4 ${b.gemma4_31B}점 vs 큐웬3.6 ${b.qwen36_27B}점`).join('\n')}

## 3. 5계층 프롬프트 인젝션 보안 방어 체계
- Layer 1: 모델 내성 훈련 (Alignment & Resilience)
- Layer 2: 비신뢰 데이터 태깅 (Untrusted Tagging)
- Layer 3: 병렬 분류기 앙상블 (Ensemble Classifiers)
- Layer 4: eBPF 커널 오염 추적 (Taint Tracking)
- Layer 5: 대화 밖 강제 생체 승인 (Out-of-band Approval)

## 4. 실증 공격 시뮬레이션 결과
${data.securityArchitecture.simulatedAttackScenarios.map(s => `- [${s.category}] ${s.title}: ${s.finalOutcome}`).join('\n')}

출처: ${data.source}
`;

  saveRecentExport({
    id: `exp-${Date.now()}`,
    fileName: `meta-muse-summary-${new Date().toISOString().slice(0, 10)}.md`,
    format: 'MARKDOWN',
    timestamp: new Date().toISOString(),
    fileSizeBytes: new Blob([text]).size,
    title: '마크다운 형식 기술 요약 브리핑',
  });

  return navigator.clipboard.writeText(text).then(() => '마크다운 요약이 클립보드에 복사되었습니다.');
}

export interface ComparisonReportPayload {
  reportTitle: string;
  generatedAt: string;
  reportType: 'SIDE_BY_SIDE_DEFENSE_EVALUATION';
  baselineModel: {
    id: string;
    name: string;
    architecture: string;
    guardrailLevel: string;
    description: string;
  };
  glimmerModel: {
    name: string;
    parameters: string;
    license: string;
    securityFramework: string;
  };
  differentialMetricsSummary: {
    attackBlockRate: { glimmer: string; baseline: string; delta: string };
    dataExfiltrationPrevention: { glimmer: string; baseline: string; delta: string };
    averageFinancialRisk: { glimmer: string; baseline: string };
    inspectionLatencyMs: { glimmer: number; baseline: number };
  };
  sideBySideDefenseTable: ModelDefenseComparison[];
}

export function downloadComparisonReportAsJson(baselineId: string): string {
  const baseline = BASELINE_MODELS.find((b) => b.id === baselineId) || BASELINE_MODELS[0];
  const comparisons = MODEL_DEFENSE_COMPARISONS[baselineId] || MODEL_DEFENSE_COMPARISONS['vanilla-agent'];

  const data: ComparisonReportPayload = {
    reportTitle: `Glimmer 30B vs ${baseline.name} 차등 보안 방어 비교 분석 보고서`,
    generatedAt: new Date().toISOString(),
    reportType: 'SIDE_BY_SIDE_DEFENSE_EVALUATION',
    baselineModel: {
      id: baseline.id,
      name: baseline.name,
      architecture: baseline.architecture,
      guardrailLevel: baseline.guardrailLevel,
      description: baseline.description,
    },
    glimmerModel: {
      name: 'Glimmer 30B (Meta Muse)',
      parameters: '29.6B',
      license: 'Apache 2.0',
      securityFramework: '5-Layer Defense-in-Depth (Secure VM, eBPF Sentinel, hatch-authd)',
    },
    differentialMetricsSummary: {
      attackBlockRate: { glimmer: '100%', baseline: '25%', delta: '+75%p' },
      dataExfiltrationPrevention: { glimmer: '100%', baseline: '0%', delta: '+100%p' },
      averageFinancialRisk: { glimmer: '$0', baseline: '$450~$1,420+' },
      inspectionLatencyMs: { glimmer: 8.4, baseline: 3.2 },
    },
    sideBySideDefenseTable: comparisons,
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `glimmer-vs-${baseline.id}-defense-comparison-${dateStr}.json`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  saveRecentExport({
    id: `exp-comp-${Date.now()}`,
    fileName,
    format: 'JSON',
    timestamp: new Date().toISOString(),
    fileSizeBytes: blob.size,
    title: `Glimmer 30B vs ${baseline.name.split('(')[0]} 차등 방어 결과표`,
  });

  return fileName;
}
