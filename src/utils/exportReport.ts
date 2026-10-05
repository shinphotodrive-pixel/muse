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
  format: 'JSON' | 'PDF' | 'MARKDOWN' | 'CSV';
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

function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

export function downloadReportAsCsv(): string {
  const data = generateReportData();
  const rows: string[] = [];

  // Metadata block
  rows.push(`${escapeCsvCell('보고서 제목')},${escapeCsvCell(data.reportTitle)}`);
  rows.push(`${escapeCsvCell('버전')},${escapeCsvCell(data.version)}`);
  rows.push(`${escapeCsvCell('생성 일시')},${escapeCsvCell(new Date(data.generatedAt).toLocaleString('ko-KR'))}`);
  rows.push(`${escapeCsvCell('데이터 출처')},${escapeCsvCell(data.source)}`);
  rows.push('');

  // 1. Executive Summary KPIs
  rows.push(escapeCsvCell('=== 1. 핵심 성과 지표 (Executive Summary KPIs) ==='));
  rows.push(`${escapeCsvCell('지표명')},${escapeCsvCell('측정값')}`);
  rows.push(`${escapeCsvCell('누적 다운로드 수')},${escapeCsvCell(data.executiveSummary.kpis.totalDownloads)}`);
  rows.push(`${escapeCsvCell('탑재 온디바이스 모델')},${escapeCsvCell(data.executiveSummary.kpis.localModel)}`);
  rows.push(`${escapeCsvCell('최고 생성 속도')},${escapeCsvCell(data.executiveSummary.kpis.peakInferenceSpeed)}`);
  rows.push(`${escapeCsvCell('주간 무료 토큰 제공량')},${escapeCsvCell(data.executiveSummary.kpis.weeklyFreeTokens)}`);
  rows.push('');

  // 2. Glimmer 30B Benchmarks
  rows.push(escapeCsvCell('=== 2. Glimmer 30B 벤치마크 평가 결과 (Benchmarks) ==='));
  rows.push([
    escapeCsvCell('평가 지표 (Metric)'),
    escapeCsvCell('카테고리 (Category)'),
    escapeCsvCell('Glimmer 30B (현재)'),
    escapeCsvCell('Glimmer 30B (전주 대비 성장)'),
    escapeCsvCell('Gemma 4 31B'),
    escapeCsvCell('Qwen 3.6 27B'),
    escapeCsvCell('최고 우수 모델 (Winner)'),
    escapeCsvCell('상세 분석 요약 (Description)')
  ].join(','));

  data.benchmarks.forEach((b) => {
    const winner = b.glimmer30B >= b.gemma4_31B && b.glimmer30B >= b.qwen36_27B ? 'Glimmer 30B' : 'Baseline';
    const wowDelta = b.glimmer30B - b.prevWeekGlimmer30B;
    const wowPct = ((wowDelta / b.prevWeekGlimmer30B) * 100).toFixed(1);
    rows.push([
      escapeCsvCell(b.metric),
      escapeCsvCell(b.category),
      escapeCsvCell(`${b.glimmer30B} ${b.unit}`),
      escapeCsvCell(`+${wowDelta.toFixed(1)}점 (+${wowPct}%)`),
      escapeCsvCell(`${b.gemma4_31B} ${b.unit}`),
      escapeCsvCell(`${b.qwen36_27B} ${b.unit}`),
      escapeCsvCell(winner),
      escapeCsvCell(b.description)
    ].join(','));
  });
  rows.push('');

  // 3. Hardware Presets & Performance
  rows.push(escapeCsvCell('=== 3. 온디바이스 하드웨어 사양별 추론 속도 및 VRAM (Hardware Presets) ==='));
  rows.push([
    escapeCsvCell('하드웨어 모델명'),
    escapeCsvCell('연산 성능 (Compute)'),
    escapeCsvCell('VRAM 용량'),
    escapeCsvCell('DFlash 추측 디코딩 지원'),
    escapeCsvCell('기본 생성 속도 (Base tok/s)'),
    escapeCsvCell('DFlash 부스트 속도 (Boost tok/s)'),
    escapeCsvCell('하드웨어 특성 및 권장 용도')
  ].join(','));

  data.hardwarePresets.forEach((h) => {
    rows.push([
      escapeCsvCell(h.name),
      escapeCsvCell(`${h.computeTflops} TFLOPS`),
      escapeCsvCell(`${h.vramGb} GB`),
      escapeCsvCell(h.dflashSupported ? 'DFlash 가속 지원' : '표준 실행'),
      escapeCsvCell(`${h.baseToksPerSec} tok/s`),
      escapeCsvCell(`${h.dflashToksPerSec} tok/s`),
      escapeCsvCell(h.description)
    ].join(','));
  });
  rows.push('');

  // 4. 5-Layer Prompt Injection Security Architecture
  rows.push(escapeCsvCell('=== 4. 5계층 프롬프트 인젝션 방어 체계 (Security Defense Layers) ==='));
  rows.push([
    escapeCsvCell('방어 계층 (Layer)'),
    escapeCsvCell('계층 명칭 (Name)'),
    escapeCsvCell('단축명 (Short Name)'),
    escapeCsvCell('주요 방어 영역 (Headline)'),
    escapeCsvCell('핵심 방어 메커니즘 (Mechanism)'),
    escapeCsvCell('차단하는 침해 유형 (Failure Mode Prevented)')
  ].join(','));

  data.securityArchitecture.layers.forEach((l) => {
    rows.push([
      escapeCsvCell(`Layer ${l.layer}`),
      escapeCsvCell(l.name),
      escapeCsvCell(l.shortName),
      escapeCsvCell(l.headline),
      escapeCsvCell(l.mechanism),
      escapeCsvCell(l.failureModePrevented)
    ].join(','));
  });
  rows.push('');

  // 5. Simulated Attack Scenarios
  rows.push(escapeCsvCell('=== 5. 실증 공격 시뮬레이션 결과 (Simulated Attack Scenarios) ==='));
  rows.push([
    escapeCsvCell('시나리오 ID'),
    escapeCsvCell('공격 벡터 (Category)'),
    escapeCsvCell('위험도 (Severity)'),
    escapeCsvCell('시나리오 제목 (Title)'),
    escapeCsvCell('공격 페이로드 (Attack Payload)'),
    escapeCsvCell('공격 침투 경로 (Attack Vector)'),
    escapeCsvCell('공격 목표 (Target Objective)'),
    escapeCsvCell('최종 방어 결과 (Final Outcome)')
  ].join(','));

  data.securityArchitecture.simulatedAttackScenarios.forEach((s) => {
    rows.push([
      escapeCsvCell(s.id),
      escapeCsvCell(s.category),
      escapeCsvCell(s.severity),
      escapeCsvCell(s.title),
      escapeCsvCell(s.attackPayload),
      escapeCsvCell(s.attackVector),
      escapeCsvCell(s.targetObjective),
      escapeCsvCell(s.finalOutcome)
    ].join(','));
  });
  rows.push('');

  // 6. Model Comparative Defense (Glimmer 30B vs Baseline Models)
  rows.push(escapeCsvCell('=== 6. 모델 간 차등 보안 방어 비교표 (Model Comparative Defense) ==='));
  rows.push([
    escapeCsvCell('기준 모델 (Baseline Model)'),
    escapeCsvCell('공격 시나리오'),
    escapeCsvCell('Glimmer 30B 방어 상태'),
    escapeCsvCell('Glimmer 차단 계층'),
    escapeCsvCell('Glimmer 손실액'),
    escapeCsvCell('기준 모델 침해 상태'),
    escapeCsvCell('기준 모델 침해 지점'),
    escapeCsvCell('기준 모델 손실액'),
    escapeCsvCell('차등 방어 혜택 (Differential Benefit)'),
    escapeCsvCell('방어 저항력 격차 (Delta %)')
  ].join(','));

  BASELINE_MODELS.forEach((baseline) => {
    const comparisons = MODEL_DEFENSE_COMPARISONS[baseline.id] || [];
    comparisons.forEach((c) => {
      rows.push([
        escapeCsvCell(baseline.name),
        escapeCsvCell(c.scenarioTitle),
        escapeCsvCell(c.glimmer30B.status),
        escapeCsvCell(c.glimmer30B.stoppedAtLayer),
        escapeCsvCell(c.glimmer30B.financialLoss),
        escapeCsvCell(c.baselineModel.status),
        escapeCsvCell(c.baselineModel.breachPoint),
        escapeCsvCell(c.baselineModel.financialLoss),
        escapeCsvCell(c.differentialBenefit),
        escapeCsvCell(`+${c.resilienceDeltaPercent}%`)
      ].join(','));
    });
  });
  rows.push('');

  // 7. Pricing & Token Limits
  rows.push(escapeCsvCell('=== 7. 요금제 및 토큰 한도 (Pricing & Token Plans) ==='));
  rows.push([
    escapeCsvCell('플랜명'),
    escapeCsvCell('월간 요금'),
    escapeCsvCell('주간 토큰 할당량'),
    escapeCsvCell('가상머신 보안 격리 수준'),
    escapeCsvCell('주요 타겟 대상'),
    escapeCsvCell('주요 기능 명세')
  ].join(','));

  data.pricingModel.forEach((p) => {
    rows.push([
      escapeCsvCell(p.name),
      escapeCsvCell(`$${p.monthlyPriceUsd}/월`),
      escapeCsvCell(p.tokenAllocation),
      escapeCsvCell(p.vmLevel),
      escapeCsvCell(p.target),
      escapeCsvCell(p.features.join(' | '))
    ].join(','));
  });

  // Prepend UTF-8 BOM for Microsoft Excel / Google Sheets compatibility
  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `meta-muse-intelligence-data-${dateStr}.csv`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  saveRecentExport({
    id: `exp-csv-${Date.now()}`,
    fileName,
    format: 'CSV',
    timestamp: new Date().toISOString(),
    fileSizeBytes: blob.size,
    title: '메타 뮤즈 원시 스프레드시트 데이터셋 (.csv)',
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
