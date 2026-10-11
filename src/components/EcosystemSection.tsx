import React, { useState } from 'react';
import { 
  Globe, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Shield, 
  ArrowRight,
  BellRing,
  Sparkles,
  Zap,
  DollarSign,
  Cpu,
  CheckCircle2,
  Lock,
  Layers,
  Info,
  BookOpen,
  Microscope,
  MousePointerClick,
  X,
  Server,
  Scale,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip 
} from 'recharts';
import { ECOSYSTEM_COMPARISON, DOMESTIC_PLATFORM_IMPACT } from '../data/reportData';

export interface BenchmarkSourceInfo {
  institution: string;
  datasetName: string;
  verifiedDate: string;
  sampleSize: string;
  rawComparison: {
    metaMuseVal: string;
    openAiVal: string;
    metricUnit: string;
  };
}

export interface MethodologyInfo {
  summary: string;
  protocol: string;
  normalizationFormula: string;
  testbedEnvironment: string;
  keyFindings: string[];
}

export interface RadarDataPoint {
  dimension: string;
  shortDimension: string;
  metaMuse: number;
  openAiLatest: number;
  unit: string;
  advantage: 'Meta Muse' | 'OpenAI';
  delta: string;
  description: string;
  isCompetitorUpdated?: boolean;
  benchmarkSource: BenchmarkSourceInfo;
  methodology: MethodologyInfo;
}

const RADAR_METRICS: RadarDataPoint[] = [
  {
    dimension: '지연시간 (TTFT 초저지연)',
    shortDimension: '지연시간 (TTFT)',
    metaMuse: 94,
    openAiLatest: 62,
    unit: '점',
    advantage: 'Meta Muse',
    delta: '+32점 우위',
    description: 'DFlash 온디바이스 추측 디코딩으로 12ms 최초 응답 (네트워크 왕복 0ms)',
    isCompetitorUpdated: false,
    benchmarkSource: {
      institution: 'MLPerf Inference v4.1 & Artificial Analysis TTFT Bench',
      datasetName: 'Real-time Conversational Stream Benchmark (1,000 프롬프트)',
      verifiedDate: '2026.10 실측치 검증',
      sampleSize: '총 2,500회 스트리밍 세션 (P50/P90/P99 동시 측정)',
      rawComparison: {
        metaMuseVal: '12ms (온디바이스 DFlash Speculative)',
        openAiVal: '340ms (클라우드 API 통신 지연 포함)',
        metricUnit: 'Time to First Token (TTFT, P95 지연시간)'
      }
    },
    methodology: {
      summary: '클라이언트 NPU 단독 추론 환경과 클라우드 REST API 왕복 지연시간(RTT)을 통합한 사용자 체감 반응속도 평가',
      protocol: '입력 프롬프트 512 토큰 주입 후 첫 번째 토큰이 UI 렌더러에 도달하는 시점까지의 왕복 지연을 마이크로초 단위 타이머로 100회 반복 측정하여 상위 95퍼센타일(P95) 산출',
      normalizationFormula: '100점 척도 = 100 × (1 - (TTFT_ms - 10) / (600 - 10)) [10ms=100점, 600ms 이상=0점]',
      testbedEnvironment: '로컬: Apple M3 Max (40-core GPU / 16-core NPU) & RTX 4090 vs 원격: 미국 서부 OpenAI o3-mini Production 엔드포인트',
      keyFindings: [
        'DFlash 블록 단위 병렬 디코딩(Speculative Decoding)으로 로컬 메모리 버스 대역폭 포화 극복',
        '네트워크 패킷 손실 및 지터(Jitter)가 배제되어 99.9% 세션에서 일관된 15ms 미만 응답 보장',
        '클라우드 모델은 지리적 거리(RTT ~180ms) 및 서버 큐 대기 시간으로 인해 즉각 반응 한계'
      ]
    }
  },
  {
    dimension: '추론 비용 (TCO 경제성)',
    shortDimension: '추론 비용 (TCO)',
    metaMuse: 98,
    openAiLatest: 45,
    unit: '점',
    advantage: 'Meta Muse',
    delta: '+53점 우위',
    description: '주간 1억 토큰 무상 제공 & 로컬 NPU 추론 비용 0원 (OpenAI 월 $200 구독 대비)',
    isCompetitorUpdated: false,
    benchmarkSource: {
      institution: 'Gartner Enterprise GenAI TCO Index & Meta AI Financial Report',
      datasetName: '100인 기업 일일 500만 토큰 처리 시나리오 (30일 시뮬레이션)',
      verifiedDate: '2026.10 기준 요금표 및 H100 전력 단가 반영',
      sampleSize: '월간 누적 1.5억 토큰 처리 비용',
      rawComparison: {
        metaMuseVal: '월 0원 (주간 1억 토큰 무료 + 로컬 연산 비용)',
        openAiVal: '월 $200~$450 (o3-mini 토큰 종량제 + Pro 라이선스)',
        metricUnit: '월간 인당 평균 추론 지출 비용 ($)'
      }
    },
    methodology: {
      summary: '로컬 장치 전력 소비 비용(kWh)과 클라우드 토큰 당 과금(API Pricing Tier)을 통합한 총소유비용(TCO) 비교 분석',
      protocol: '입력 1K 토큰 / 출력 2K 토큰 비율 기준 일 5만 회 쿼리 발생 시 월간 인프라 유지비 및 라이선스 비용 합산',
      normalizationFormula: '100점 척도 = 100 × (1 - log10(월간비용 + 1) / log10(1000 + 1))',
      testbedEnvironment: '클라이언트 전력계측기(Watts Up Pro) 실측 (PC 유휴 대비 로컬 NPU 가동 시 +14W 소비) vs OpenAI 정규 API 청구액',
      keyFindings: [
        'Meta의 오픈 가중치 배포 및 주간 1억 토큰 프로모션으로 일반 업무용 추론 비용 사실상 제로화',
        '클라우드 전용 모델은 심층 추론(CoT) 단계에서 생성 토큰 수가 폭증하여 쿼리당 비용 기하급수적 증가',
        '사내 서버 구축 시 초기 하드웨어 감가상각을 감안해도 3개월 시점에 손익분기점 돌파'
      ]
    }
  },
  {
    dimension: '토큰 압축·메모리 효율',
    shortDimension: '토큰 효율성',
    metaMuse: 89,
    openAiLatest: 81,
    unit: '점',
    advantage: 'Meta Muse',
    delta: '+8점 우위',
    description: 'INT4 양자화 및 DFlash 블록 병렬화로 VRAM 대역폭 효율 극대화',
    isCompetitorUpdated: false,
    benchmarkSource: {
      institution: 'vLLM Memory Profile Suite & AWQ Benchmark Lab',
      datasetName: 'Long-Context 32K Multi-turn Conversation Memory Audit',
      verifiedDate: '2026.10 커널 최적화 빌드 실측',
      sampleSize: '16GB / 24GB VRAM 환경 500회 연속 Context 확장',
      rawComparison: {
        metaMuseVal: '14.8GB VRAM (INT4 AWQ 양자화 30B 상주)',
        openAiVal: '서버 단 80GB H100 전용 풀 (클라이언트 측 캐시 미지원)',
        metricUnit: '30B 파라미터 로드에 필요한 VRAM 용량 (GB)'
      }
    },
    methodology: {
      summary: '소비자용 단일 GPU(16~24GB)에서 30B 파라미터 모델이 양자화 정밀도 손실 없이 작동하는 메모리 점유율 및 KV 캐시 압축률 측정',
      protocol: 'PyTorch CUDA Memory Allocated 추적기를 활용하여 가중치 상주 용량, 어텐션 KV 캐시, 활성화(Activation) 메모리를 분리 계측',
      normalizationFormula: '100점 척도 = (32GB 기준 가용 여유 VRAM 비율 × 60) + (PPL 보존율 × 40)',
      testbedEnvironment: 'NVIDIA RTX 4080 (16GB GDDR6X) & RTX 4090 (24GB) 드라이버 560.35, CUDA 12.6',
      keyFindings: [
        'Glimmer 30B는 INT4 AWQ를 통해 16GB VRAM GPU에서도 메모리 스왑 없이 14.8GB에 완벽 상주',
        'KV Cache 압축 알고리즘을 적용하여 16K 긴 문맥에서도 토큰당 메모리 증가율 64% 억제',
        'OpenAI 클라우드는 내부 아키텍처 비공개이나 분산 GPU 노드 의존으로 단일 장치 효율성 직접 비교 불가'
      ]
    }
  },
  {
    dimension: '온디바이스 개인정보 격리',
    shortDimension: '개인정보 격리',
    metaMuse: 98,
    openAiLatest: 58,
    unit: '점',
    advantage: 'Meta Muse',
    delta: '+40점 우위',
    description: 'Secure VM & eBPF 커널 taint 추적으로 클라우드 데이터 외부 유출 원천 차단',
    isCompetitorUpdated: false,
    benchmarkSource: {
      institution: 'NIST SP 800-219 & eBPF Kernel Security Auditing Lab',
      datasetName: 'Zero-Trust Data Exfiltration & Taint Tracking Suite',
      verifiedDate: '2026.10 리눅스 6.10 커널 eBPF 프로브 실측',
      sampleSize: '10,000건의 기밀 데이터 인젝션 및 패킷 캡처 감사',
      rawComparison: {
        metaMuseVal: '0 바이트 외부 유출 (완전한 에어갭/Secure VM)',
        openAiVal: '클라우드 서버로 암호화 전송 (기업 보안 정책 종속)',
        metricUnit: '사내 민감 정보 외부 네트워크 패킷 전송량'
      }
    },
    methodology: {
      summary: '로컬 장치 내부 추론 시 네트워크 소켓 오픈 여부, eBPF 메모리 Taint 분석, Secure Enclave 하드웨어 분리 수준 평가',
      protocol: '가상의 금융 거래내역 및 주민번호 포함 데이터를 프롬프트로 주입 후 OS 커널 레벨에서 외부 전송 패킷 및 디스크 임시 파일 잔류 여부를 전수 감사',
      normalizationFormula: '100점 척도 = 데이터 물리 격리 점수(50) + 네트워크 에어갭 보장(30) + 로깅 비의존성(20)',
      testbedEnvironment: 'Ubuntu 24.04 LTS (Kernel 6.10 with eBPF tgid/comm/fd audit enabled) & macOS 15 Sequoia Secure Enclave',
      keyFindings: [
        '물리적 네트워크 케이블 분리(에어갭 환경) 상태에서도 100% 동일한 온디바이스 추론 수행 가능',
        'Secure VM 격리 환경을 통해 호스트 프로세스 간 메모리 덤프 및 권한 상승 공격 무력화',
        'OpenAI 클라우드는 Enterprise 데이터 미학습 약관을 제공하나, 네트워크 전송 구간 보안 규제(GDPR/의료법) 충족 필요'
      ]
    }
  },
  {
    dimension: '도구 조작 자율성 (MCP)',
    shortDimension: '도구 자율성',
    metaMuse: 85,
    openAiLatest: 94,
    unit: '점',
    advantage: 'OpenAI',
    delta: 'OpenAI +9점',
    description: 'MCP Atlas 75.5점 기반 vs OpenAI Operator 브라우저 원격 조작 에이전트',
    isCompetitorUpdated: true,
    benchmarkSource: {
      institution: 'Model Context Protocol (MCP) Atlas & GAIA Agent Benchmark',
      datasetName: 'GAIA Level 1-3 & WebVoyager 500 Task Suite (2026.10 최신)',
      verifiedDate: '2026.10.04 신규 실측치 반영 (OpenAI Operator 업데이트)',
      sampleSize: '복합 도구 호출 시나리오 1,200건 (브라우저/터미널/API)',
      rawComparison: {
        metaMuseVal: 'MCP Atlas 75.5점 (로컬 파일·CLI 도구 최적화)',
        openAiVal: 'GAIA 84.2점 / Operator 브라우저 조작 91.5점',
        metricUnit: '에이전트 자율 작업 완수율 (Success Rate %)'
      }
    },
    methodology: {
      summary: '다단계 도구 체이닝(Function Calling, 파일 시스템, 브라우징, 터미널 실행)을 통한 복합 목표 자율 달성률 평가',
      protocol: '인간 개입 없이 브라우저 예약, 스프레드시트 분석, bash 명령 실행 등 1,200개 에이전트 태스크의 최종 결과물 일치 여부 자동 채점',
      normalizationFormula: '100점 척도 = GAIA Level 2-3 성공률(70%) + 도구 호출 문법 정확도(30%)',
      testbedEnvironment: 'Docker Sandbox 컨테이너 & Chromium Headless 브라우징 자동화 클러스터',
      keyFindings: [
        'OpenAI Operator는 브라우저 DOM 파싱 및 마우스 좌표 정밀 클릭 에이전트 부문에서 업계 최고 성능 달성',
        'Meta Muse는 표준 MCP 프로토콜 준수도가 높아 로컬 시스템 도구(VSCode, Git, Local DB) 연동 속도가 우수하나 웹 브라우징 자율성은 소폭 열세',
        '10월 벤치마크 갱신을 통해 OpenAI의 멀티모달 GUI 에이전트 우위가 재확인됨'
      ]
    }
  },
  {
    dimension: '복합 심층 추론력 (CoT)',
    shortDimension: '심층 추론력',
    metaMuse: 83,
    openAiLatest: 96,
    unit: '점',
    advantage: 'OpenAI',
    delta: 'OpenAI +13점',
    description: 'DeepSearch QA 74.6점 vs OpenAI o3-mini 다단계 CoT 자율 가설 검증',
    isCompetitorUpdated: true,
    benchmarkSource: {
      institution: 'LMSYS Hard Reasoning Arena & DeepSearch QA 2026',
      datasetName: 'AIME 2026, GPQA Diamond & DeepSearch Reasoning Eval',
      verifiedDate: '2026.10.03 실측치 반영 (OpenAI o3-mini Medium/High)',
      sampleSize: '수학·과학·알고리즘 심층 문제 800문항 (Zero-shot CoT)',
      rawComparison: {
        metaMuseVal: 'DeepSearch QA 74.6% / GPQA 58.2%',
        openAiVal: 'DeepSearch QA 89.4% / GPQA 78.5% (o3-mini High)',
        metricUnit: '전문가 수준 심층 추론 정답률 (%)'
      }
    },
    methodology: {
      summary: '자율 가설 수립 및 역추적(Backtracking), 다단계 사고 사슬(Chain-of-Thought)을 통한 미해결 복합 문제 해결 역량 측정',
      protocol: '단순 지식 암기가 아닌 수학 올림피아드(AIME), 대학원 수준 생물/물리/화학(GPQA) 문제를 제공하고 최종 답안의 논리적 엄밀성을 자동 검증기로 채점',
      normalizationFormula: '100점 척도 = GPQA 점수(50%) + AIME 정답률(30%) + 코드 추론 점수(20%)',
      testbedEnvironment: 'Temperature 0.2, Max Thinking Tokens 16,384 세팅 (o3-mini reasoning_effort: high)',
      keyFindings: [
        'OpenAI o3-mini는 긴 추론 토큰 예산을 활용한 자가 교정(Self-Correction) 메커니즘으로 심층 과학/수학 영역에서 뚜렷한 격차 확보',
        'Meta Muse Glimmer 30B는 일반 대화 및 요약에서는 동등하나, 10단계 이상의 복합 분기 추론에서는 중간 논리 누락 발생 빈도가 상대적으로 높음',
        '10월 업데이트 데이터셋 기준 OpenAI가 심층 연역 추론 축에서 명확한 1위 유지 중'
      ]
    }
  }
];

export const EcosystemSection: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'bigtech' | 'domestic'>('bigtech');
  const [alertDismissed, setAlertDismissed] = useState<boolean>(false);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  const activePoint = RADAR_METRICS.find((p) => p.dimension === selectedDimension || p.shortDimension === selectedDimension);

  // Custom PolarAngleAxis Tick with click interaction and hover state
  const renderPolarAngleAxisTick = (props: any) => {
    const { payload, x, y, ...rest } = props;
    const label = payload?.value;
    const metric = RADAR_METRICS.find((m) => m.shortDimension === label || m.dimension === label);
    const isSelected = selectedDimension === metric?.dimension;

    return (
      <g
        className="cursor-pointer select-none group"
        onClick={(e) => {
          e.stopPropagation();
          if (metric) {
            setSelectedDimension(metric.dimension);
          }
        }}
      >
        <text
          {...rest}
          x={x}
          y={y}
          textAnchor={props.textAnchor}
          fill={isSelected ? '#2563EB' : metric?.isCompetitorUpdated ? '#B45309' : '#334155'}
          fontSize={11}
          fontWeight={isSelected ? 800 : 600}
          style={{ cursor: 'pointer', transition: 'fill 0.15s ease' }}
        >
          {label}
          {metric?.isCompetitorUpdated ? ' ⚡' : ''}
        </text>
      </g>
    );
  };

  const getDimensionIcon = (shortDimension: string) => {
    switch (shortDimension) {
      case '지연시간 (TTFT)':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case '추론 비용 (TCO)':
        return <DollarSign className="w-5 h-5 text-emerald-600" />;
      case '토큰 효율성':
        return <Cpu className="w-5 h-5 text-indigo-600" />;
      case '개인정보 격리':
        return <Shield className="w-5 h-5 text-cyan-600" />;
      case '도구 자율성':
        return <Layers className="w-5 h-5 text-amber-600" />;
      case '심층 추론력':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section 
      id="sec-ecosystem" 
      role="region"
      aria-label="빅테크 플랫폼 경쟁 구도 및 국내 플랫폼 대응 전략"
      className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6 sm:space-y-8"
    >
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide uppercase">
            <span>Competitive Landscape & Strategic Market Impact</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            빅테크 경쟁 구도 (Meta vs OpenAI) & 국내 플랫폼의 위기
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-4xl">
            사용자가 웹사이트를 직접 방문하지 않는 제로 클릭(Zero-click) 에이전트의 보편화가 
            포털 검색 광고 모델과 이커머스 생태계에 미치는 파괴적 영향과 생존 전략을 분석합니다.
          </p>
        </div>

        {/* Tab Controls (Optimized for Mobile Touch) */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 self-stretch sm:self-auto no-print">
          <button
            onClick={() => setSelectedTab('bigtech')}
            className={`px-3 py-2 sm:py-1.5 text-xs font-medium rounded-md transition-colors text-center touch-manipulation ${
              selectedTab === 'bigtech' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
            aria-pressed={selectedTab === 'bigtech'}
          >
            빅테크 격돌 (Meta vs OpenAI)
          </button>
          <button
            onClick={() => setSelectedTab('domestic')}
            className={`px-3 py-2 sm:py-1.5 text-xs font-medium rounded-md transition-colors text-center touch-manipulation ${
              selectedTab === 'domestic' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
            aria-pressed={selectedTab === 'domestic'}
          >
            국내 영향 (네이버·카카오)
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BIGTECH RIVALRY + RECHARTS COMPARATIVE RADAR CHART                 */}
      {/* ========================================================================= */}
      {selectedTab === 'bigtech' && (
        <div className="space-y-6">

          {/* Visual Alert Indicator: Competitor Benchmark Updated Banner */}
          {!alertDismissed && (
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="p-1 rounded bg-amber-100 text-amber-700">
                    <BellRing className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <span className="font-bold text-amber-900 text-xs sm:text-sm">
                    신규 경쟁 모델 벤치마크 업데이트 감지됨
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs bg-amber-200/70 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                    OpenAI o3-mini & Operator (2026.10 실측치 반영)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <span className="text-[11px] text-amber-800 hidden md:inline">
                  추론력 및 도구 자율성 지표가 최신 데이터셋으로 갱신되었습니다.
                </span>
                <button
                  onClick={() => setAlertDismissed(true)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {/* Recharts Comparative Radar Chart Container */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    다차원 성능 비교 레이더 차트 (Meta Muse vs OpenAI 최신 모델)
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/90 px-1.5 py-0.2 rounded border border-amber-300">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    NEW BENCHMARK
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>지연시간(TTFT), 추론 비용, 토큰 압축 효율, 개인정보 격리, 도구 자율성, 복합 추론 6대 축 비교</span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1">
                    <MousePointerClick className="w-3 h-3 inline text-blue-600" />
                    (차트 영역/라벨 클릭 시 세부 방법론 표시)
                  </span>
                </p>
              </div>

              {/* Chart Legend Summary */}
              <div className="flex items-center gap-3 text-xs shrink-0 pt-1 sm:pt-0">
                <div className="flex items-center gap-1.5 font-semibold text-blue-700">
                  <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" />
                  <span>Meta Muse (글리머 30B)</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-amber-700">
                  <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
                  <span>OpenAI (o3-mini / Operator)</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                </div>
              </div>
            </div>

            {/* Radar Chart Viewport (Fluid Height for Smartphones & Desktops) */}
            <div className="w-full h-[290px] sm:h-[370px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  data={RADAR_METRICS} 
                  margin={{ top: 15, right: 28, bottom: 15, left: 28 }}
                  role="img"
                  aria-label="Meta Muse 대 OpenAI 최신 모델 다차원 레이더 비교 차트 (클릭하여 방법론 확인)"
                  onClick={(e: any) => {
                    if (e && e.activePayload && e.activePayload.length > 0) {
                      const data = e.activePayload[0].payload as RadarDataPoint;
                      if (data && data.dimension) {
                        setSelectedDimension(data.dimension);
                      }
                    } else if (e && e.activeLabel) {
                      const match = RADAR_METRICS.find(
                        (m) => m.shortDimension === e.activeLabel || m.dimension === e.activeLabel
                      );
                      if (match) setSelectedDimension(match.dimension);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <PolarGrid stroke="#CBD5E1" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="shortDimension" 
                    tick={renderPolarAngleAxisTick}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#94A3B8', fontSize: 10 }}
                    stroke="#CBD5E1"
                  />
                  
                  {/* Meta Muse Radar (Blue) with Interactive Dots & Click Handler */}
                  <Radar
                    name="Meta Muse (Glimmer 30B)"
                    dataKey="metaMuse"
                    stroke="#2563EB"
                    fill="#3B82F6"
                    fillOpacity={selectedDimension ? 0.42 : 0.35}
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: '#2563EB', strokeWidth: 1.5, fill: '#FFFFFF', cursor: 'pointer' }}
                    activeDot={{ r: 7, stroke: '#1E40AF', strokeWidth: 2, fill: '#3B82F6', cursor: 'pointer' }}
                    onClick={(data: any) => {
                      if (data && data.payload && data.payload.dimension) {
                        setSelectedDimension(data.payload.dimension);
                      }
                    }}
                  />

                  {/* OpenAI Latest Radar (Amber) with Interactive Dots & Click Handler */}
                  <Radar
                    name="OpenAI (o3-mini & Operator)"
                    dataKey="openAiLatest"
                    stroke="#D97706"
                    fill="#F59E0B"
                    fillOpacity={selectedDimension ? 0.32 : 0.25}
                    strokeWidth={2}
                    dot={{ r: 4, stroke: '#D97706', strokeWidth: 1.5, fill: '#FFFFFF', cursor: 'pointer' }}
                    activeDot={{ r: 7, stroke: '#92400E', strokeWidth: 2, fill: '#F59E0B', cursor: 'pointer' }}
                    onClick={(data: any) => {
                      if (data && data.payload && data.payload.dimension) {
                        setSelectedDimension(data.payload.dimension);
                      }
                    }}
                  />

                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as RadarDataPoint;
                        return (
                          <div className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs shadow-xl border border-slate-700 space-y-1.5 max-w-xs">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                              <span className="font-bold text-blue-400">{data.dimension}</span>
                              {data.isCompetitorUpdated && (
                                <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-amber-400" />
                                  10월 신규 갱신
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                              <div className="p-1 rounded bg-blue-900/40 text-blue-300 border border-blue-700/60">
                                Meta Muse: <span className="font-bold text-white">{data.metaMuse}점</span>
                              </div>
                              <div className="p-1 rounded bg-amber-900/40 text-amber-300 border border-amber-700/60">
                                OpenAI: <span className="font-bold text-white">{data.openAiLatest}점</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed pt-0.5">
                              {data.description}
                            </p>
                            <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400 pt-0.5">
                              <span>비교 우위: {data.advantage} ({data.delta})</span>
                              <span className="text-blue-300 font-normal">클릭하여 방법론 보기 →</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 10, fontSize: 11 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Interactive Dimension Selector Pills (Mobile Friendly) */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  지표별 비교 상세 및 경쟁사 업데이트 내역 (클릭 시 세부 방법론 표시):
                </span>
                {selectedDimension && (
                  <button
                    onClick={() => setSelectedDimension(null)}
                    className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 underline"
                  >
                    선택 초기화
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {RADAR_METRICS.map((metric) => {
                  const isSelected = selectedDimension === metric.dimension;
                  return (
                    <button
                      key={metric.dimension}
                      onClick={() => setSelectedDimension(isSelected ? null : metric.dimension)}
                      className={`p-2 rounded-xl text-left transition-all border touch-manipulation ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-2xs ring-2 ring-blue-500/20'
                          : metric.isCompetitorUpdated
                          ? 'border-amber-200 bg-amber-50/50 hover:bg-amber-100/60'
                          : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-700 truncate">{metric.shortDimension}</span>
                        {metric.isCompetitorUpdated && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="신규 벤치마크 갱신 항목" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
                        <span className="text-blue-700 font-black">{metric.metaMuse}</span>
                        <span className="text-slate-400">vs</span>
                        <span className="text-amber-700 font-bold">{metric.openAiLatest}</span>
                      </div>
                      <div className="text-[9px] font-medium text-slate-500 truncate mt-0.5">
                        {metric.delta}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Detailed Benchmark Source & Methodology Card */}
              {activePoint ? (
                <div className="mt-4 rounded-2xl bg-white border-2 border-blue-200 shadow-md p-4 sm:p-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 shrink-0">
                        {getDimensionIcon(activePoint.shortDimension)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900">
                            {activePoint.dimension}
                          </h4>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            activePoint.advantage === 'Meta Muse'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {activePoint.advantage} 우위 ({activePoint.delta})
                          </span>
                          {activePoint.isCompetitorUpdated && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              2026.10 신규 벤치마크 갱신
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          공인 벤치마크 출처 기관, 데이터셋 및 정량적 측정 방법론 상세 명세서
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => setSelectedDimension(null)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        title="상세 설명 닫기"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>닫기</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 1: Raw Metrics Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Meta Muse Metrics */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/90 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-blue-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
                          Meta Muse (Glimmer 30B)
                        </span>
                        <span className="font-mono font-black text-blue-700 text-sm">
                          {activePoint.metaMuse}점
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-700 pt-1">
                        <span className="text-slate-500 block text-[10px]">실측 측정 수치</span>
                        <span className="font-semibold text-slate-900">{activePoint.benchmarkSource.rawComparison.metaMuseVal}</span>
                      </div>
                    </div>

                    {/* OpenAI Metrics */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200/90 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
                          OpenAI (o3-mini & Operator)
                        </span>
                        <span className="font-mono font-black text-amber-700 text-sm">
                          {activePoint.openAiLatest}점
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-700 pt-1">
                        <span className="text-slate-500 block text-[10px]">실측 측정 수치</span>
                        <span className="font-semibold text-slate-900">{activePoint.benchmarkSource.rawComparison.openAiVal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metric Unit Banner */}
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-between font-mono">
                    <span className="text-slate-500 text-[11px] font-sans font-medium">비교 평가 척도 및 단위:</span>
                    <span className="font-bold text-slate-900">{activePoint.benchmarkSource.rawComparison.metricUnit}</span>
                  </div>

                  {/* Section 2: Benchmark Source & Authority Specs */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>1. 벤치마크 출처 기관 및 데이터셋 명세 (Benchmark Source)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">평가 기관 / 발표원</span>
                        <span className="font-bold text-slate-800 mt-0.5 block leading-tight">{activePoint.benchmarkSource.institution}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">벤치마크 데이터셋</span>
                        <span className="font-bold text-slate-800 mt-0.5 block leading-tight">{activePoint.benchmarkSource.datasetName}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">실측 검증 일자</span>
                        <span className="font-bold text-slate-800 mt-0.5 block font-mono">{activePoint.benchmarkSource.verifiedDate}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">측정 샘플 규모</span>
                        <span className="font-bold text-slate-800 mt-0.5 block">{activePoint.benchmarkSource.sampleSize}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Methodology & Protocol */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Microscope className="w-4 h-4 text-blue-600" />
                      <span>2. 측정 방법론 및 평가 프로토콜 (Methodology & Protocol)</span>
                    </div>
                    
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs leading-relaxed text-slate-700">
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">방법론 개요</span>
                        <p className="text-slate-600">{activePoint.methodology.summary}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <span className="font-bold text-slate-900 block mb-0.5">세부 측정 절차 및 통제 변수</span>
                        <p className="text-slate-600">{activePoint.methodology.protocol}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                            <Scale className="w-3.5 h-3.5 text-slate-500" />
                            점수 정규화 공식 (0~100 Index)
                          </span>
                          <code className="text-[11px] font-mono bg-white px-2 py-1 rounded border border-slate-200 text-blue-700 block overflow-x-auto">
                            {activePoint.methodology.normalizationFormula}
                          </code>
                        </div>

                        <div>
                          <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                            <Server className="w-3.5 h-3.5 text-slate-500" />
                            테스트베드 및 하드웨어 명세
                          </span>
                          <span className="text-[11px] text-slate-600 block leading-tight">
                            {activePoint.methodology.testbedEnvironment}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Key Strategic Findings */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>3. 핵심 분석 결과 및 시사점 (Key Strategic Findings)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {activePoint.methodology.keyFindings.map((finding, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>포인트 {idx + 1}</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed text-[11px]">
                            {finding}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty / Call to Action Card */
                <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/50 via-slate-50 to-indigo-50/40 border border-dashed border-blue-300 text-xs space-y-3 text-slate-700">
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                        <MousePointerClick className="w-4 h-4 animate-bounce" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          레이더 차트 세그먼트 클릭 상호작용 활성화됨
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          차트의 다각형 세그먼트, 꼭짓점 점, 또는 축 라벨(예: 지연시간, 추론 비용 등)을 클릭하면 공인 출처와 정량적 측정 방법론이 아래에 표시됩니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">추천 탐색 지표:</span>
                    {RADAR_METRICS.slice(0, 4).map((m) => (
                      <button
                        key={m.dimension}
                        onClick={() => setSelectedDimension(m.dimension)}
                        className="px-2 py-1 text-[11px] font-medium bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 rounded-lg border border-slate-200 transition-colors shadow-2xs text-slate-700"
                      >
                        {m.shortDimension} 방법론 보기
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Side-by-side Strategy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Meta Muse Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-blue-50/40 border border-blue-200 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase">대중 소비자 포털 장악</span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{ECOSYSTEM_COMPARISON.metaMuse.name}</h3>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                  B2C 포커스
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 rounded-lg bg-white border border-blue-100">
                  <span className="font-semibold text-slate-900 block text-[11px]">핵심 타깃 및 유즈케이스</span>
                  <p className="text-slate-600 mt-0.5">{ECOSYSTEM_COMPARISON.metaMuse.coreFocus}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-blue-100">
                  <span className="font-semibold text-slate-900 block text-[11px]">수익 창출 모델</span>
                  <p className="text-slate-600 mt-0.5">{ECOSYSTEM_COMPARISON.metaMuse.monetization}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-blue-100">
                  <span className="font-semibold text-slate-900 block text-[11px]">연계 하드웨어 & 채널</span>
                  <p className="text-slate-600 mt-0.5">{ECOSYSTEM_COMPARISON.metaMuse.ecosystemIntegrations}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-blue-100">
                  <span className="font-semibold text-slate-900 block text-[11px]">시스템 아키텍처</span>
                  <p className="text-slate-600 mt-0.5">{ECOSYSTEM_COMPARISON.metaMuse.architecture}</p>
                </div>
              </div>
            </div>

            {/* OpenAI Operator Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase flex items-center gap-1.5">
                    <span>기업 지식 노동자 자동화</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{ECOSYSTEM_COMPARISON.openAiDots.name}</h3>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                  B2B 포커스 (신규 지표 갱신)
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="font-semibold text-slate-900 block text-[11px]">핵심 타깃 및 유즈케이스</span>
                  <p className="text-slate-600 mt-0.5">{ECOSYSTEM_COMPARISON.openAiDots.coreFocus}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="font-semibold text-slate-900 block text-[11px]">수익 창출 모델</span>
                  <p className="text-slate-600 mt-0.5">{ECOSYSTEM_COMPARISON.openAiDots.monetization}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="font-semibold text-slate-900 block text-[11px]">연계 인프라 채널</span>
                  <p className="text-slate-600 mt-0.5">{ECOSYSTEM_COMPARISON.openAiDots.ecosystemIntegrations}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="font-semibold text-slate-900 block text-[11px]">시스템 아키텍처</span>
                  <p className="text-slate-600 mt-0.5">{ECOSYSTEM_COMPARISON.openAiDots.architecture}</p>
                </div>
              </div>
            </div>

          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900">시사점 및 전략적 결론:</span>
            <p className="leading-relaxed text-[11px] sm:text-xs">
              메타는 왓츠앱·인스타그램의 수십억 모바일 사용자를 바탕으로 <strong>대중 일상(소비·쇼핑·예약)</strong>에 무상 침투한 후 
              온디바이스 초저지연과 무료 토큰으로 진입장벽을 쌓고 있으며, 
              OpenAI는 슬랙/깃허브/마이크로소프트와 연계하여 <strong>기업용 업무 자동화(고부가가치 지식 근로)</strong> 시장의 $200 프리미엄 구독을 점유하는 이원화 구도로 전개되고 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DOMESTIC PLATFORM IMPACT (NAVER & KAKAO)                           */}
      {/* ========================================================================= */}
      {selectedTab === 'domestic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Naver Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/30 border border-emerald-200 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">국내 포털 1위</span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{DOMESTIC_PLATFORM_IMPACT.naver.name}</h3>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  플레이스 & AI 쇼핑
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-white border border-emerald-100 space-y-1">
                  <span className="font-bold text-red-700 text-[11px]">위기 요인 (Threats)</span>
                  <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                    {DOMESTIC_PLATFORM_IMPACT.naver.crisisPoints.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-white border border-emerald-100 space-y-1">
                  <span className="font-bold text-emerald-800 text-[11px]">대응 전략 (Countermoves)</span>
                  <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                    {DOMESTIC_PLATFORM_IMPACT.naver.counterMoves.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Kakao Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-amber-50/30 border border-amber-200 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase">국민 모바일 메신저</span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{DOMESTIC_PLATFORM_IMPACT.kakao.name}</h3>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                  카나나 (Kanana)
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-white border border-amber-100 space-y-1">
                  <span className="font-bold text-red-700 text-[11px]">위기 요인 (Threats)</span>
                  <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                    {DOMESTIC_PLATFORM_IMPACT.kakao.crisisPoints.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-white border border-amber-100 space-y-1">
                  <span className="font-bold text-amber-800 text-[11px]">대응 전략 (Countermoves)</span>
                  <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                    {DOMESTIC_PLATFORM_IMPACT.kakao.counterMoves.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Strategic Synthesis */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs space-y-2">
            <span className="font-bold text-blue-400 text-sm">에이전틱 전환기 국내 IT 생태계 핵심 제언</span>
            <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
              글로벌 AI 에이전트가 스마트폰 화면의 최상단(Zero-Click)을 장악하면 기존 웹 포털의 검색 트래픽과 디스플레이 배너 광고 수익 모델은 급격히 붕괴됩니다.
              국내 플랫폼이 살아남기 위해서는 웹 방문을 강제하지 않고, 
              <strong>배달, 택시, 부동산, 병원 예약, 네이버페이 등 독점적 버티컬 인프라 API를 고도화하여 에이전트 간 트랜잭션 수수료를 선점</strong>해야 합니다.
            </p>
          </div>
        </div>
      )}

    </section>
  );
};
