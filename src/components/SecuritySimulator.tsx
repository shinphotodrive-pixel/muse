import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Terminal, 
  Play, 
  RotateCcw, 
  AlertOctagon, 
  CheckCircle2, 
  Lock, 
  Server, 
  Key, 
  EyeOff, 
  Activity,
  Download,
  ArrowRightLeft,
  XCircle,
  AlertTriangle,
  Zap,
  TrendingUp,
  Layers,
  Cpu,
  FileDown,
  FileSpreadsheet
} from 'lucide-react';
import { 
  SECURITY_LAYERS, 
  ATTACK_SCENARIOS, 
  BASELINE_MODELS, 
  MODEL_DEFENSE_COMPARISONS 
} from '../data/reportData';
import { AttackScenario, SecurityLayer, BaselineModelPreset } from '../types';
import { downloadReportAsJson, downloadComparisonReportAsJson } from '../utils/exportReport';
import { useToast } from '../context/ToastContext';

export const SecuritySimulator: React.FC = () => {
  const { showToast } = useToast();
  const [simulatorMode, setSimulatorMode] = useState<'single' | 'compare'>('single');
  const [selectedLayerNum, setSelectedLayerNum] = useState<number>(1);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('atk-css');
  const [selectedBaselineId, setSelectedBaselineId] = useState<string>('vanilla-agent');
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(5); // completed by default
  const [liveLogs, setLiveLogs] = useState<string[]>([]);

  // Side-by-side simulation logs
  const [compareLogs, setCompareLogs] = useState<{
    glimmer: string[];
    baseline: string[];
    glimmerFinished: boolean;
    baselineFinished: boolean;
  }>({
    glimmer: ['[GLIMMER 30B] 다층 방어 커널 대기 중...'],
    baseline: ['[BASELINE AGENT] 표준 대화 컨텍스트 대기 중...'],
    glimmerFinished: true,
    baselineFinished: true,
  });

  const selectedScenario: AttackScenario = 
    ATTACK_SCENARIOS.find((s) => s.id === selectedScenarioId) || ATTACK_SCENARIOS[0];
  const selectedLayer: SecurityLayer = 
    SECURITY_LAYERS.find((l) => l.layer === selectedLayerNum) || SECURITY_LAYERS[0];
  const selectedBaseline: BaselineModelPreset = 
    BASELINE_MODELS.find((b) => b.id === selectedBaselineId) || BASELINE_MODELS[0];

  const currentComparisons = MODEL_DEFENSE_COMPARISONS[selectedBaselineId] || MODEL_DEFENSE_COMPARISONS['vanilla-agent'];
  const activeComparison = currentComparisons.find((c) => c.scenarioId === selectedScenarioId) || currentComparisons[0];

  // Single simulation runner
  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setActiveStep(0);
    setLiveLogs(['[SIMULATOR] 공격 페이로드 주입 시작...']);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setActiveStep(step);
      
      const layerRes = selectedScenario.layerResults.find((r) => r.layer === step);
      if (layerRes) {
        setLiveLogs((prev) => [
          ...prev,
          `[LAYER ${step}] ${layerRes.status.toUpperCase()}: ${layerRes.log}`,
        ]);
      }

      if (step >= 5) {
        clearInterval(interval);
        setIsRunningSim(false);
        setLiveLogs((prev) => [
          ...prev,
          `[RESULT] 최종 판정: ${selectedScenario.finalOutcome}`,
        ]);
        showToast({
          type: 'success',
          title: '단일 보안 시뮬레이션 완료',
          description: `${selectedScenario.title} 공격에 대한 5계층 방어가 성공적으로 검증되었습니다.`
        });
      }
    }, 600);
  };

  // Compare models simulation runner
  const handleRunCompareSimulation = () => {
    setIsRunningSim(true);
    setCompareLogs({
      glimmer: ['[GLIMMER 30B] 적대적 페이로드 수신 및 5계층 인프라 가동...'],
      baseline: [`[${selectedBaseline.name}] 프롬프트 입력 파싱 중...`],
      glimmerFinished: false,
      baselineFinished: false,
    });

    // Step 1: Ingestion
    setTimeout(() => {
      setCompareLogs((prev) => ({
        ...prev,
        glimmer: [...prev.glimmer, '[L1/L2] 비신뢰 태그 분리 완료. HTML 제로 폰트 및 리다이렉트 격리 태깅.'],
        baseline: [...prev.baseline, '[INPUT] 웹페이지 DOM 텍스트를 시스템 프롬프트에 직접 병합.'],
      }));
    }, 500);

    // Step 2: Evaluation
    setTimeout(() => {
      setCompareLogs((prev) => ({
        ...prev,
        glimmer: [...prev.glimmer, `[L3/L4] ${activeComparison.glimmer30B.stoppedAtLayer} 트리거: ${activeComparison.glimmer30B.log}`],
        baseline: [...prev.baseline, `[EXPLOIT] ${activeComparison.baselineModel.breachPoint}: 악성 인젝션 명령어가 상위 지침으로 덮어써짐!`],
      }));
    }, 1100);

    // Step 3: Final Outcome
    setTimeout(() => {
      setCompareLogs((prev) => ({
        ...prev,
        glimmer: [
          ...prev.glimmer, 
          `[DEFENSE SUCCESS] 자산 유출 방어 100%. 손실액: ${activeComparison.glimmer30B.financialLoss} (지연시간: ${activeComparison.glimmer30B.detectionLatencyMs}ms)`
        ],
        baseline: [
          ...prev.baseline, 
          `[CRITICAL BREACH] 취약점 침해 발생! 손실 위험: ${activeComparison.baselineModel.financialLoss} (통제 상실)`
        ],
        glimmerFinished: true,
        baselineFinished: true,
      }));
      setIsRunningSim(false);
      showToast({
        type: 'warning',
        title: '모델 비교 시뮬레이션 완료',
        description: `Glimmer 30B는 완전 차단한 반면, ${selectedBaseline.name} 모델에서는 침해가 발생했습니다.`
      });
    }, 1800);
  };

  const handleReset = () => {
    setActiveStep(5);
    setLiveLogs([]);
    setCompareLogs({
      glimmer: ['[GLIMMER 30B] 다층 방어 커널 초기화됨.'],
      baseline: ['[BASELINE AGENT] 대화 컨텍스트 초기화됨.'],
      glimmerFinished: true,
      baselineFinished: true,
    });
  };

  const handleExportJson = () => {
    const fileName = downloadReportAsJson();
    showToast({
      type: 'success',
      title: '보안 시뮬레이션 데이터 내보내기',
      description: `${fileName} 파일이 정상적으로 다운로드되었습니다.`
    });
  };

  const handleExportComparisonResults = () => {
    const fileName = downloadComparisonReportAsJson(selectedBaselineId);
    showToast({
      type: 'success',
      title: '비교 분석 결과 내보내기 완료',
      description: `Glimmer 30B vs ${selectedBaseline.name.split('(')[0]} 차등 방어 결과표(${fileName})가 저장되었습니다.`
    });
  };

  return (
    <section 
      id="sec-security" 
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8"
      role="region"
      aria-label="5계층 보안 체계 및 모델 비교 시뮬레이터"
    >
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide uppercase">
            <span>Security Architecture & Threat Defense Simulator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            메타 뮤즈 다중 격리 보안 체계 & 5계층 프롬프트 인젝션 방어 시뮬레이터
          </h2>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-4xl">
            에이전트가 악성 웹페이지나 피싱 이메일의 프롬프트 인젝션에 노출되더라도, 
            사용자의 금융 자산과 개인정보가 유출되지 않도록 설계된 OS 레벨 다층 방어(Defense-in-Depth) 인프라입니다.
          </p>
        </div>

        {/* View Switcher: Single vs Compare Models */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0 self-start md:self-auto no-print">
          <button
            onClick={() => setSimulatorMode('single')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              simulatorMode === 'single'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            aria-pressed={simulatorMode === 'single'}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>단일 5계층 시뮬레이션</span>
          </button>
          <button
            onClick={() => setSimulatorMode('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              simulatorMode === 'compare'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            aria-pressed={simulatorMode === 'compare'}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>모델 비교 (Compare Models)</span>
          </button>
        </div>
      </div>

      {/* 3 Core Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="group" aria-label="메타 뮤즈 3대 보안 핵심 기둥">
        
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-blue-700">
            <Server className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">독립 가상 격리</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Muse Secure VM</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-[11px]">systemd-nspawn</code> 기반의 
            비특권 사용자 매핑 및 seccomp 시스템콜 엄격 필터링. 2026 하반기 Confidential VM(하드웨어 암호화 Enclave)으로 완전 전환 예정.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700">
            <Key className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">자격증명 은닉</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">hatch-authd & 1회용 토큰</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            실제 API 키 및 카드 번호는 에이전트가 실행되는 VM 내부에 존재하지 않습니다. 외장 데몬이 마스킹된 가상 프록시 토큰만을 
            전달하여 프로세스 탈취 시에도 원본 키 노출이 불가능합니다.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-amber-700">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">네트워크 게이트키퍼</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Sentinel Daemon & eBPF</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            VM 내부 프로세스의 원시 RAW 소켓 생성 권한을 원천 박탈하고, L4/L7 패킷 심층 분석(DPI)으로 DNS 리바인딩 및 
            AWS/GCP 내부 메타데이터(169.254.169.254) 탈취 시도를 차단합니다.
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SINGLE 5-LAYER SIMULATION                                         */}
      {/* ========================================================================= */}
      {simulatorMode === 'single' ? (
        <div className="pt-4 border-t border-slate-200 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" />
                <span>실시간 적대적 공격 & 다층 방어 인터랙티브 시뮬레이션</span>
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                실제 발생할 수 있는 4대 공격 벡터를 선택하고 5단계 보안 계층이 이를 탐지/차단하는 과정을 확인하세요.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={isRunningSim}
                onClick={handleRunSimulation}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs transition-colors ${
                  isRunningSim ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
                aria-label="공격 시뮬레이션 실행"
              >
                <Play className="w-3.5 h-3.5" />
                <span>공격 시뮬레이션 실행</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="초기화"
                aria-label="시뮬레이터 초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition-colors shadow-2xs"
                title="시뮬레이션 및 보안 계층 데이터 JSON 내보내기"
                aria-label="JSON 보고서 내보내기"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>
          </div>

          {/* Scenario Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2" role="tablist" aria-label="적대적 공격 시나리오 목록">
            {ATTACK_SCENARIOS.map((sc) => {
              const isSelected = sc.id === selectedScenarioId;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenarioId(sc.id)}
                  role="tab"
                  aria-selected={isSelected}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-red-500 bg-red-50/50 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-500">{sc.category}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      sc.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {sc.severity}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {sc.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Attack Payload Detail Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-red-400">
                <ShieldAlert className="w-4 h-4" />
                <span>주입된 공격 벡터: {selectedScenario.attackVector}</span>
              </span>
              <span className="text-[11px] text-slate-500">Target: {selectedScenario.targetObjective}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950/80 text-red-300 text-xs overflow-x-auto border border-red-950/50">
              <code>{selectedScenario.attackPayload}</code>
            </div>
          </div>

          {/* 5-Layer Defense Progression Stepper */}
          <div className="space-y-3" role="region" aria-label="5단계 보안 방어 진행 상황">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
              <span>5계층 다층 방어선 통과 검증</span>
              <span className="text-slate-500 font-normal">
                {activeStep < 5 ? `검증 진행 중: ${activeStep}/5` : '전 계층 방어 검증 완료'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {SECURITY_LAYERS.map((layer) => {
                const isPassedOrCurrent = activeStep >= layer.layer;
                const layerRes = selectedScenario.layerResults.find((r) => r.layer === layer.layer);
                const isSelected = selectedLayerNum === layer.layer;

                let statusBadge = (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                    대기 중
                  </span>
                );

                if (isPassedOrCurrent && layerRes) {
                  if (layerRes.status === 'blocked') {
                    statusBadge = (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                        차단됨 (Blocked)
                      </span>
                    );
                  } else if (layerRes.status === 'mitigated' || layerRes.status === 'neutralized') {
                    statusBadge = (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                        무력화 (Neutralized)
                      </span>
                    );
                  } else {
                    statusBadge = (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">
                        이상 탐지 (Flagged)
                      </span>
                    );
                  }
                }

                return (
                  <div
                    key={layer.layer}
                    onClick={() => setSelectedLayerNum(layer.layer)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-blue-700">L{layer.layer}</span>
                      {statusBadge}
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      {layer.shortName}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {layer.mechanism}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Inspection Terminal & Layer Deep-dive */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            
            {/* Live Terminal Output (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-950 rounded-xl p-4 border border-slate-800 text-slate-300 font-mono text-xs flex flex-col justify-between min-h-[220px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-slate-400 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MUSE-SENTINEL KERNEL MONITOR (eBPF TRACE)</span>
                </div>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>

              <div className="flex-1 space-y-1.5 overflow-y-auto max-h-48 text-[11px] leading-relaxed">
                {liveLogs.length === 0 ? (
                  <div className="text-slate-600 italic">
                    상단의 '공격 시뮬레이션 실행' 버튼을 누르면 eBPF 및 앙상블 계층의 실시간 탐지 로그가 출력됩니다.
                  </div>
                ) : (
                  liveLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-slate-600 select-none">&gt;</span>
                      <span className={log.includes('BLOCKED') || log.includes('최종 판정') ? 'text-emerald-300 font-bold' : 'text-slate-300'}>
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                <span>Memory Taint Tracking: ACTIVE</span>
                <span>Virtual Tokens: ENCRYPTED</span>
              </div>
            </div>

            {/* Layer Detail Focus (5 Cols) */}
            <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Layer {selectedLayer.layer}: {selectedLayer.name}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {selectedLayer.headline}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedLayer.mechanism}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-700">방어하는 핵심 실패 모드:</span>
                <div className="p-2 rounded bg-white border border-slate-200 text-xs text-slate-700">
                  {selectedLayer.failureModePrevented}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700">핵심 구현 스펙:</span>
                <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                  {selectedLayer.technicalDetails.map((td, i) => (
                    <li key={i}>{td}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: COMPARE MODELS (Glimmer 30B vs Baseline Agent)                    */
        /* ========================================================================= */
        <div className="pt-4 border-t border-slate-200 space-y-6" role="region" aria-label="모델 간 보안 방어 비교 분석">
          
          {/* Compare Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4" />
                <span>글리머 30B vs 기준 모델 (Baseline) 차등 보안 방어 비교</span>
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                동일한 적대적 프롬프트 인젝션 공격에 노출되었을 때 발생하는 방어 성공 여부, 자산 손실 위험, 탐지 지연시간을 실시간 비교합니다.
              </p>
            </div>

            {/* Baseline Model Preset Dropdown / Segmented buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600">비교 기준 모델:</span>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {BASELINE_MODELS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBaselineId(b.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      selectedBaselineId === b.id
                        ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    aria-pressed={selectedBaselineId === b.id}
                  >
                    {b.name.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scenario Selector & Run Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-700">테스트 공격 시나리오:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {ATTACK_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenarioId(sc.id)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                      selectedScenarioId === sc.id
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {sc.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                disabled={isRunningSim}
                onClick={handleRunCompareSimulation}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs transition-colors ${
                  isRunningSim ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                aria-label="공격 비교 시뮬레이션 실행"
              >
                <Play className="w-3.5 h-3.5" />
                <span>공격 비교 시뮬레이션 실행</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                title="초기화"
                aria-label="초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleExportComparisonResults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors shadow-2xs"
                title="Glimmer 30B와 기준 모델 간 차등 방어 결과만 별도 리포트로 내보내기"
                aria-label="비교 분석 결과 내보내기"
              >
                <FileDown className="w-3.5 h-3.5 text-indigo-600" />
                <span>비교 결과 내보내기</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Simulation Viewport */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Glimmer 30B (Meta Muse Multi-Layer Defense) */}
            <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50/20 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Glimmer 30B + Meta Muse</h3>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      5계층 통합 격리 아키텍처 (Secure VM + eBPF + Stripe Link)
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  완전 방어 (100% BLOCKED)
                </span>
              </div>

              {/* Status KPIs */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-white border border-emerald-200">
                  <div className="text-[10px] text-slate-500">최종 상태</div>
                  <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">차단 성공</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-emerald-200">
                  <div className="text-[10px] text-slate-500">차단 계층</div>
                  <div className="text-xs font-bold text-slate-800 font-mono mt-0.5 truncate" title={activeComparison.glimmer30B.stoppedAtLayer}>
                    {activeComparison.glimmer30B.stoppedAtLayer.split(' ')[0]}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-emerald-200">
                  <div className="text-[10px] text-slate-500">추정 손실액</div>
                  <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">$0 (0원)</div>
                </div>
              </div>

              {/* Terminal Logs */}
              <div className="bg-slate-950 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-1 min-h-[140px] max-h-40 overflow-y-auto border border-slate-800">
                <div className="text-emerald-400 text-[10px] border-b border-slate-800 pb-1 mb-1 font-bold">
                  [GLIMMER 30B KERNEL AUDIT TRAIL]
                </div>
                {compareLogs.glimmer.map((msg, i) => (
                  <div key={i} className="leading-relaxed">
                    <span className="text-emerald-400 mr-1.5">✓</span>
                    <span>{msg}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-900 leading-relaxed font-medium">
                <strong>차등 방어 효과:</strong> {activeComparison.differentialBenefit}
              </div>
            </div>

            {/* Right: Selected Baseline Model */}
            <div className="rounded-xl border-2 border-red-400 bg-red-50/20 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-red-200 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                    B
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{selectedBaseline.name}</h3>
                    <p className="text-[11px] text-red-700 font-semibold truncate max-w-[200px]" title={selectedBaseline.architecture}>
                      {selectedBaseline.guardrailLevel}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
                  침해 발생 (BREACHED)
                </span>
              </div>

              {/* Status KPIs */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-white border border-red-200">
                  <div className="text-[10px] text-slate-500">최종 상태</div>
                  <div className="text-xs font-bold text-red-700 font-mono mt-0.5">권한 탈취</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-red-200">
                  <div className="text-[10px] text-slate-500">취약 지점</div>
                  <div className="text-xs font-bold text-slate-800 font-mono mt-0.5 truncate" title={activeComparison.baselineModel.breachPoint}>
                    {activeComparison.baselineModel.breachPoint}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-red-200">
                  <div className="text-[10px] text-slate-500">손실 위험</div>
                  <div className="text-xs font-bold text-red-700 font-mono mt-0.5 truncate" title={activeComparison.baselineModel.financialLoss}>
                    {activeComparison.baselineModel.financialLoss.split(' ')[0]}
                  </div>
                </div>
              </div>

              {/* Terminal Logs */}
              <div className="bg-slate-950 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-1 min-h-[140px] max-h-40 overflow-y-auto border border-slate-800">
                <div className="text-red-400 text-[10px] border-b border-slate-800 pb-1 mb-1 font-bold">
                  [BASELINE AGENT SECURITY BREACH LOG]
                </div>
                {compareLogs.baseline.map((msg, i) => (
                  <div key={i} className="leading-relaxed">
                    <span className="text-red-400 mr-1.5">✗</span>
                    <span>{msg}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-red-100/70 border border-red-300 text-xs text-red-900 leading-relaxed font-medium">
                <strong>근본적 원인:</strong> {selectedBaseline.description}
              </div>
            </div>

          </div>

          {/* Differential Defense Metrics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">인젝션 공격 차단율</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-emerald-600">100%</span>
                <span className="text-xs text-slate-400 font-mono">vs 25% (Delta +75%p)</span>
              </div>
              <p className="text-[11px] text-slate-500">앙상블 및 커널 소켓 패킷 드롭</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">자산/기밀정보 유출 방어</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-emerald-600">100%</span>
                <span className="text-xs text-slate-400 font-mono">vs 0% (Delta +100%p)</span>
              </div>
              <p className="text-[11px] text-slate-500">Stripe Link 1회용 토큰화</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">평균 금전적 침해 위험액</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-emerald-600">$0</span>
                <span className="text-xs text-red-500 font-mono font-semibold">vs $450~$1,420+</span>
              </div>
              <p className="text-[11px] text-slate-500">물리적 생체 FaceID 필수 승인</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">방어 검사 오버헤드 (지연)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-blue-600">8.4ms</span>
                <span className="text-xs text-slate-400 font-mono">실시간 체감 불가</span>
              </div>
              <p className="text-[11px] text-slate-500">C++ Sentinel & 비동기 검사</p>
            </div>
          </div>

          {/* Differential Defense Metrics Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  4대 공격 벡터별 상세 차등 방어 메트릭 비교표 (Differential Defense Table)
                </h3>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-500 font-mono hidden md:inline">
                  기준 모델: {selectedBaseline.name.split('(')[0]}
                </span>
                <button
                  onClick={handleExportComparisonResults}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold transition-colors shadow-xs"
                  title="이 차등 방어 비교표만 독립 JSON 보고서로 저장"
                  aria-label="비교 분석 결과 내보내기"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>비교 분석 결과 내보내기 (Export Comparison Results)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table 
                className="w-full text-left text-xs"
                aria-label="4대 공격 벡터별 모델 차등 방어 메트릭 비교표"
              >
                <caption className="sr-only">
                  Glimmer 30B와 기준 모델 간 공격 시나리오별 방어 결과, 지연시간, 피해 위험액 차이 비교
                </caption>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th scope="col" className="p-3.5">공격 시나리오 & 카테고리</th>
                    <th scope="col" className="p-3.5">글리머 30B 방어 결과 (차단 계층/지연)</th>
                    <th scope="col" className="p-3.5">기준 모델 침해 결과 (취약점)</th>
                    <th scope="col" className="p-3.5">차등 방어 혜택 (Differential Benefit)</th>
                    <th scope="col" className="p-3.5 text-center">저항 격차</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {currentComparisons.map((comp) => (
                    <tr 
                      key={comp.scenarioId} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        comp.scenarioId === selectedScenarioId ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <th scope="row" className="p-3.5 font-bold text-slate-900 align-top">
                        <div>{comp.scenarioTitle}</div>
                        <span className="text-[11px] font-normal text-slate-500 mt-0.5 block">
                          [{comp.category}]
                        </span>
                      </th>

                      <td className="p-3.5 align-top">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{comp.glimmer30B.status}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          • {comp.glimmer30B.stoppedAtLayer}
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">
                          • 피해액: {comp.glimmer30B.financialLoss}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          • 검사 시간: {comp.glimmer30B.detectionLatencyMs}ms
                        </div>
                      </td>

                      <td className="p-3.5 align-top">
                        <div className="flex items-center gap-1.5 text-red-600 font-bold mb-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{comp.baselineModel.status}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          • 침해 지점: {comp.baselineModel.breachPoint}
                        </div>
                        <div className="text-[11px] text-red-600 font-medium">
                          • 피해 위험: {comp.baselineModel.financialLoss}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          • 지연: {comp.baselineModel.detectionLatencyMs}ms
                        </div>
                      </td>

                      <td className="p-3.5 align-top text-xs text-slate-700 font-medium leading-relaxed">
                        {comp.differentialBenefit}
                      </td>

                      <td className="p-3.5 text-center align-top">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                          +{comp.resilienceDeltaPercent}%p
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </section>
  );
};
