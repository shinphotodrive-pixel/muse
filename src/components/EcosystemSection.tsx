import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
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
  FileText,
  History,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Award,
  BarChart3,
  Target,
  Sliders,
  Download,
  FileSpreadsheet,
  ChevronDown
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

export type RadarTimeframe = 'current' | 'historical';

export interface RelativeStrengthInfo {
  strengthLevel: '초격차 핵심 강점 (Top Tier)' | '확고한 경쟁 우위 (Strong)' | '경쟁 우위 (Advantage)' | '업계 표준 부합 (Parity)';
  levelBadgeColor: string;
  relativeDelta: number;
  relativePercent: number;
  whyOutperforms: string;
  industryBottleneck: string;
  strategicImpact: string;
}

export interface RadarDataPoint {
  dimension: string;
  shortDimension: string;
  metaMuse: number;
  openAiLatest: number;
  // Baseline Fields (Industry Average Benchmark)
  industryBaseline: number;       // 최신 업계 표준 평균
  baselineHistorical: number;     // 과거 업계 표준 평균
  baselineLabel: string;          // 기준선 명칭
  relativeStrength: RelativeStrengthInfo;
  // Historical Benchmark Fields (Glimmer 초기 가중치 v1.0 & GPT-4o 초기 대비)
  metaMuseHistorical: number;
  openAiHistorical: number;
  metaMuseGrowth: number;       // 성장률 %
  openAiGrowth: number;         // 경쟁사 성장률 %
  historicalMilestone: string;  // 이전 측정 시점 및 버전
  historicalDate: string;       // 측정일
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
    industryBaseline: 52,
    baselineHistorical: 44,
    baselineLabel: '2026 일반 클라우드 API 평균 (TTFT 850ms, 52점)',
    relativeStrength: {
      strengthLevel: '초격차 핵심 강점 (Top Tier)',
      levelBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      relativeDelta: 42,
      relativePercent: 80.8,
      whyOutperforms: 'DFlash 온디바이스 Speculative 병렬 디코딩과 NPU 직결 가속으로 네트워크 왕복 지연(RTT)을 원천 제거(0ms)하여 12ms 초저지연 구현',
      industryBottleneck: '일반 클라우드 API는 대륙 간 네트워크 지연(RTT ~180ms)과 서버 큐 대기 시간으로 인해 물리적으로 800ms 이하 단축 불가능',
      strategicImpact: '음성 실시간 대화 및 타이핑 즉시 자동완성 환경에서 끊김 없는 네이티브 경험 제공'
    },
    metaMuseHistorical: 72,
    openAiHistorical: 55,
    metaMuseGrowth: 30.6,
    openAiGrowth: 12.7,
    historicalMilestone: 'Glimmer v1.0 초기 가중치 (Speculative 디코딩 이전)',
    historicalDate: '2026.06 이전 릴리즈 실측',
    unit: '점',
    advantage: 'Meta Muse',
    delta: '+32점 우위',
    description: 'DFlash 온디바이스 추측 디코딩으로 12ms 최초 응답 (네트워크 왕복 0ms)',
    isCompetitorUpdated: false,
    benchmarkSource: {
      institution: 'MLPerf Inference v4.1 & Artificial Analysis TTFT Bench',
      datasetName: 'Real-time Conversational Stream Benchmark (1,000 프롬프트)',
      verifiedDate: '2026.10 실측치 검증 (과거: 2026.06 초기 릴리즈)',
      sampleSize: '총 2,500회 스트리밍 세션 (P50/P90/P99 동시 측정)',
      rawComparison: {
        metaMuseVal: '12ms (과거: 38ms, +216% 속도 개선)',
        openAiVal: '340ms (과거 GPT-4o: 410ms, +20% 속도 개선)',
        metricUnit: 'Time to First Token (TTFT, P95 지연시간)'
      }
    },
    methodology: {
      summary: '클라이언트 NPU 단독 추론 환경과 클라우드 REST API 왕복 지연시간(RTT)을 통합한 사용자 체감 반응속도 평가',
      protocol: '입력 프롬프트 512 토큰 주입 후 첫 번째 토큰이 UI 렌더러에 도달하는 시점까지의 왕복 지연을 마이크로초 단위 타이머로 100회 반복 측정하여 상위 95퍼센타일(P95) 산출',
      normalizationFormula: '100점 척도 = 100 × (1 - (TTFT_ms - 10) / (600 - 10)) [10ms=100점, 600ms 이상=0점]',
      testbedEnvironment: '로컬: Apple M3 Max (40-core GPU / 16-core NPU) & RTX 4090 vs 원격: 미국 서부 OpenAI o3-mini Production 엔드포인트',
      keyFindings: [
        'DFlash 블록 단위 병렬 디코딩(Speculative Decoding) 도입으로 6월 대비 TTFT 점수 72점 → 94점으로 +30.6% 비약적 상승',
        '네트워크 패킷 손실 및 지터(Jitter)가 배제되어 99.9% 세션에서 일관된 15ms 미만 응답 보장',
        '클라우드 모델은 지리적 거리(RTT ~180ms) 및 서버 큐 대기 시간으로 인해 성능 개선 폭이 제한적(+12.7%)'
      ]
    }
  },
  {
    dimension: '추론 비용 (TCO 경제성)',
    shortDimension: '추론 비용 (TCO)',
    metaMuse: 98,
    openAiLatest: 45,
    industryBaseline: 48,
    baselineHistorical: 42,
    baselineLabel: '2026 글로벌 상용 GenAI 종량 과금 API 평균 (48점)',
    relativeStrength: {
      strengthLevel: '초격차 핵심 강점 (Top Tier)',
      levelBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      relativeDelta: 50,
      relativePercent: 104.2,
      whyOutperforms: 'Meta의 오픈 가중치 배포, 주간 1억 토큰 무상 할당, 로컬 NPU 상주 구동으로 토큰당 종량제 과금 비용을 사실상 0원화',
      industryBottleneck: '상용 클라우드 모델은 쿼리 토큰 및 심층 CoT(Thinking) 생성량이 늘어날수록 기업 청구액이 기하급수적으로 폭증',
      strategicImpact: '수천 명 규모 전사 업무 자동화 도입 시 연간 수억 원대의 클라우드 API 비용을 절감하여 압도적 ROI 달성'
    },
    metaMuseHistorical: 82,
    openAiHistorical: 40,
    metaMuseGrowth: 19.5,
    openAiGrowth: 12.5,
    historicalMilestone: '클라우드 인프라 호스팅 의존 단계 (초기 프라이빗 프리뷰)',
    historicalDate: '2026.05 클라우드 호스팅 단가 기준',
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
        metaMuseVal: '월 0원 (과거: 서버 호스팅 월 $45, 사실상 100% 절감)',
        openAiVal: '월 $200~$450 (과거 GPT-4o: 월 $250~$500)',
        metricUnit: '월간 인당 평균 추론 지출 비용 ($)'
      }
    },
    methodology: {
      summary: '로컬 장치 전력 소비 비용(kWh)과 클라우드 토큰 당 과금(API Pricing Tier)을 통합한 총소유비용(TCO) 비교 분석',
      protocol: '입력 1K 토큰 / 출력 2K 토큰 비율 기준 일 5만 회 쿼리 발생 시 월간 인프라 유지비 및 라이선스 비용 합산',
      normalizationFormula: '100점 척도 = 100 × (1 - log10(월간비용 + 1) / log10(1000 + 1))',
      testbedEnvironment: '클라이언트 전력계측기(Watts Up Pro) 실측 (PC 유휴 대비 로컬 NPU 가동 시 +14W 소비) vs OpenAI 정규 API 청구액',
      keyFindings: [
        'Meta의 오픈 가중치 배포 및 주간 1억 토큰 프로모션으로 일반 업무용 추론 비용 사실상 제로화 달성 (+19.5% TCO 지수 개선)',
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
    industryBaseline: 55,
    baselineHistorical: 50,
    baselineLabel: '2026 오픈소스 30B 표준 FP16/BF16 메모리 점유 평균 (55점)',
    relativeStrength: {
      strengthLevel: '확고한 경쟁 우위 (Strong)',
      levelBadgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      relativeDelta: 34,
      relativePercent: 61.8,
      whyOutperforms: 'INT4 AWQ 양자화 커널 및 16K Context 동적 KV Cache 압축으로 30B 모델을 단일 16GB VRAM GPU/Mac에서 무손실 구동',
      industryBottleneck: '업계 표준 30B 모델은 FP16/BF16 기준 최소 60GB 이상의 VRAM을 요구하여 고가 워크스테이션 또는 듀얼 GPU 필수',
      strategicImpact: '별도 전용 GPU 서버 인프라 증설 없이 사내 일반 임직원 PC 및 Mac 환경에 즉각 온프레미스 배포 가능'
    },
    metaMuseHistorical: 68,
    openAiHistorical: 74,
    metaMuseGrowth: 30.9,
    openAiGrowth: 9.5,
    historicalMilestone: 'FP16 가중치 & 기본 KV Cache 아키텍처',
    historicalDate: '2026.06 최적화 커널 적용 이전',
    unit: '점',
    advantage: 'Meta Muse',
    delta: '+8점 우위',
    description: 'INT4 양자화 및 DFlash 블록 병렬화로 VRAM 대역폭 효율 극대화',
    isCompetitorUpdated: false,
    benchmarkSource: {
      institution: 'vLLM Memory Profile Suite & AWQ Benchmark Lab',
      datasetName: 'Long-Context 32K Multi-turn Conversation Memory Audit',
      verifiedDate: '2026.10 커널 최적화 빌드 실측 (과거: 2026.06 FP16)',
      sampleSize: '16GB / 24GB VRAM 환경 500회 연속 Context 확장',
      rawComparison: {
        metaMuseVal: '14.8GB VRAM (과거 FP16: 62.4GB VRAM 필요, 76% 메모리 절감)',
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
        'INT4 AWQ 양자화 커널 탑재 후 과거 68점에서 현재 89점으로 +30.9%의 최대 성장률 기록',
        'KV Cache 압축 알고리즘을 적용하여 16K 긴 문맥에서도 토큰당 메모리 증가율 64% 억제',
        '단일 소비자 GPU(16GB) 환경에서 구동 불가능했던 과거 한계를 완전히 극복'
      ]
    }
  },
  {
    dimension: '온디바이스 개인정보 격리',
    shortDimension: '개인정보 격리',
    metaMuse: 98,
    openAiLatest: 58,
    industryBaseline: 38,
    baselineHistorical: 32,
    baselineLabel: '2026 클라우드 AI 서비스 데이터 전송 모델 평균 (38점)',
    relativeStrength: {
      strengthLevel: '초격차 핵심 강점 (Top Tier)',
      levelBadgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      relativeDelta: 60,
      relativePercent: 157.9,
      whyOutperforms: '리눅스 6.10 커널 레벨 eBPF Taint 추적과 Secure VM 하드웨어 격리로 외부 네트워크 패킷 전송을 0 바이트로 원천 차단',
      industryBottleneck: '클라우드 AI는 데이터 비학습 약관을 내세우더라도 네트워크 전송 및 외부 서버 잔류 위험으로 금융·의료 망분리 규제 위반 불가피',
      strategicImpact: '물리적 에어갭(인터넷 케이블 분리) 환경에서도 100% 동일하게 작동하여 최고 등급 사내 기밀 정보 자율 분석 가능'
    },
    metaMuseHistorical: 91,
    openAiHistorical: 54,
    metaMuseGrowth: 7.7,
    openAiGrowth: 7.4,
    historicalMilestone: '기본 로컬 샌드박스 v1 (eBPF Taint 감사 도입 전)',
    historicalDate: '2026.05 초기 보안 아키텍처',
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
        'Secure VM 격리 및 eBPF 동적 커널 감사 모듈 추가로 91점 → 98점으로 무결점 보안 격리 달성',
        '물리적 네트워크 케이블 분리(에어갭 환경) 상태에서도 100% 동일한 온디바이스 추론 수행 가능',
        'OpenAI 클라우드는 Enterprise 데이터 미학습 약관을 제공하나, 네트워크 전송 구간 보안 규제(GDPR/의료법) 충족 필요'
      ]
    }
  },
  {
    dimension: '도구 조작 자율성 (MCP)',
    shortDimension: '도구 자율성',
    metaMuse: 85,
    openAiLatest: 94,
    industryBaseline: 60,
    baselineHistorical: 52,
    baselineLabel: '2026 GAIA 표준 다단계 에이전트 완수율 평균 (60점)',
    relativeStrength: {
      strengthLevel: '확고한 경쟁 우위 (Strong)',
      levelBadgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      relativeDelta: 25,
      relativePercent: 41.7,
      whyOutperforms: 'Anthropic 및 업계 공통 표준인 Model Context Protocol(MCP)을 네이티브 지원하여 로컬 CLI, SQLite, 브라우저를 유기적으로 체이닝',
      industryBottleneck: '일반 AI 모델은 파편화된 비표준 함수 호출(Function Calling)에 의존하여 3단계 이상 도구 연계 시 환각 및 문법 오류 급증',
      strategicImpact: '특정 플랫폼에 종속되지 않는 개방형 MCP 생태계를 통해 수천 개의 엔터프라이즈 사내 툴과 플러그앤플레이로 연동'
    },
    metaMuseHistorical: 64,
    openAiHistorical: 78,
    metaMuseGrowth: 32.8,
    openAiGrowth: 20.5,
    historicalMilestone: '단일 Function Calling (MCP 표준 연동 이전)',
    historicalDate: '2026.05 단일 JSON 도구 호출 스펙',
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
        metaMuseVal: 'MCP Atlas 75.5점 (과거: 51.2점, +47.5% 도구 정밀도 향상)',
        openAiVal: 'GAIA 84.2점 / Operator 91.5점 (과거 GPT-4o 도구 성공률: 72.0%)',
        metricUnit: '에이전트 자율 작업 완수율 (Success Rate %)'
      }
    },
    methodology: {
      summary: '다단계 도구 체이닝(Function Calling, 파일 시스템, 브라우징, 터미널 실행)을 통한 복합 목표 자율 달성률 평가',
      protocol: '인간 개입 없이 브라우저 예약, 스프레드시트 분석, bash 명령 실행 등 1,200개 에이전트 태스크의 최종 결과물 일치 여부 자동 채점',
      normalizationFormula: '100점 척도 = GAIA Level 2-3 성공률(70%) + 도구 호출 문법 정확도(30%)',
      testbedEnvironment: 'Docker Sandbox 컨테이너 & Chromium Headless 브라우징 자동화 클러스터',
      keyFindings: [
        'Model Context Protocol(MCP) 표준 클라이언트 통합으로 에이전트 자율 점수 64점 → 85점 (+32.8% 급성장)',
        'OpenAI는 Operator 릴리즈를 통해 웹 GUI 조작에서 94점으로 고도화되며 여전히 도구 자율성 1위 유지',
        'Meta Muse는 로컬 CLI 및 파일 I/O 체이닝 속도에서는 OpenAI 클라우드 지연 대비 4배 신속 완수'
      ]
    }
  },
  {
    dimension: '복합 심층 추론력 (CoT)',
    shortDimension: '심층 추론력',
    metaMuse: 83,
    openAiLatest: 96,
    industryBaseline: 64,
    baselineHistorical: 56,
    baselineLabel: '2026 글로벌 프론티어 오픈소스 모델 심층 추론 평균 (64점)',
    relativeStrength: {
      strengthLevel: '경쟁 우위 (Advantage)',
      levelBadgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      relativeDelta: 19,
      relativePercent: 29.7,
      whyOutperforms: '역추적(Backtracking) 다단계 사고 사슬과 자율 가설 검증 루프를 탑재하여 AIME 및 GPQA 과학 추론에서 83점 달성',
      industryBottleneck: '일반 경량/중형 모델은 단순 CoT 프롬프팅에 의존하여 복잡한 다단계 논리 문제에서 조기 오류 누적으로 정답률 60%대에 정체',
      strategicImpact: '초대형 클라우드 모델(OpenAI o3-mini 96점) 대비 격차가 있으나, 일반 업계 평균(64점)을 크게 상회하며 실무 분석에 충분한 추론력 확보'
    },
    metaMuseHistorical: 71,
    openAiHistorical: 85,
    metaMuseGrowth: 16.9,
    openAiGrowth: 12.9,
    historicalMilestone: 'Zero-shot Chain-of-Thought (자가 검증 루프 이전)',
    historicalDate: '2026.06 기본 CoT 프롬프팅 기준',
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
        metaMuseVal: 'DeepSearch QA 74.6% / GPQA 58.2% (과거: QA 61.0% / GPQA 47.5%)',
        openAiVal: 'DeepSearch QA 89.4% / GPQA 78.5% (과거 GPT-4o: QA 76.2% / GPQA 53.6%)',
        metricUnit: '전문가 수준 심층 추론 정답률 (%)'
      }
    },
    methodology: {
      summary: '자율 가설 수립 및 역추적(Backtracking), 다단계 사고 사슬(Chain-of-Thought)을 통한 미해결 복합 문제 해결 역량 측정',
      protocol: '단순 지식 암기가 아닌 수학 올림피아드(AIME), 대학원 수준 생물/물리/화학(GPQA) 문제를 제공하고 최종 답안의 논리적 엄밀성을 자동 검증기로 채점',
      normalizationFormula: '100점 척도 = GPQA 점수(50%) + AIME 정답률(30%) + 코드 추론 점수(20%)',
      testbedEnvironment: 'Temperature 0.2, Max Thinking Tokens 16,384 세팅 (o3-mini reasoning_effort: high)',
      keyFindings: [
        '역추적(Backtracking) 사고 사슬이 통합되며 DeepSearch QA 정확도 71점 → 83점 (+16.9% 점진적 향상)',
        'OpenAI는 o3-mini의 심층 사고 토큰 예산 자가 교정으로 96점을 기록하여 심층 추론 분야에서 확실한 격차 유지',
        'Glimmer 30B는 일상 업무와 코딩 보조에서는 충분하나 올림피아드 수준 다단계 검증에서는 지속적 튜닝 필요'
      ]
    }
  }
];

export const EcosystemSection: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'bigtech' | 'domestic'>('bigtech');
  const [alertDismissed, setAlertDismissed] = useState<boolean>(false);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<RadarTimeframe>('current');
  const [showBaseline, setShowBaseline] = useState<boolean>(true);

  // Animated radar chart state driven by Framer Motion animate()
  const [animatedChartData, setAnimatedChartData] = useState(() => 
    RADAR_METRICS.map((item) => ({
      ...item,
      activeMetaMuse: item.metaMuse,
      activeOpenAi: item.openAiLatest,
      activeBaseline: item.industryBaseline,
    }))
  );

  // Keep track of current animated values to allow seamless transition if user clicks rapidly
  const currentValuesRef = useRef(
    RADAR_METRICS.map((item) => ({
      metaMuse: item.metaMuse,
      openAi: item.openAiLatest,
      baseline: item.industryBaseline,
    }))
  );

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Smoothly interpolate radar metrics when timeframe switches between 'current' and 'historical'
  useEffect(() => {
    const fromData = currentValuesRef.current.map((v) => ({ ...v }));
    const targetData = RADAR_METRICS.map((item) => ({
      metaMuse: timeframe === 'current' ? item.metaMuse : item.metaMuseHistorical,
      openAi: timeframe === 'current' ? item.openAiLatest : item.openAiHistorical,
      baseline: timeframe === 'current' ? item.industryBaseline : item.baselineHistorical,
    }));

    setIsTransitioning(true);

    const controls = animate(0, 1, {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1], // fluid spring-like cubic bezier
      onUpdate: (progress) => {
        const nextData = RADAR_METRICS.map((item, idx) => {
          const fromItem = fromData[idx] || { 
            metaMuse: item.metaMuse, 
            openAi: item.openAiLatest, 
            baseline: item.industryBaseline 
          };
          const toItem = targetData[idx];
          const interpolatedMetaMuse = fromItem.metaMuse + (toItem.metaMuse - fromItem.metaMuse) * progress;
          const interpolatedOpenAi = fromItem.openAi + (toItem.openAi - fromItem.openAi) * progress;
          const interpolatedBaseline = fromItem.baseline + (toItem.baseline - fromItem.baseline) * progress;

          return {
            ...item,
            activeMetaMuse: Math.round(interpolatedMetaMuse * 10) / 10,
            activeOpenAi: Math.round(interpolatedOpenAi * 10) / 10,
            activeBaseline: Math.round(interpolatedBaseline * 10) / 10,
          };
        });

        currentValuesRef.current = nextData.map((d) => ({
          metaMuse: d.activeMetaMuse,
          openAi: d.activeOpenAi,
          baseline: d.activeBaseline,
        }));

        setAnimatedChartData(nextData);
      },
      onComplete: () => {
        setIsTransitioning(false);
        const finalData = RADAR_METRICS.map((item, idx) => ({
          ...item,
          activeMetaMuse: targetData[idx].metaMuse,
          activeOpenAi: targetData[idx].openAi,
          activeBaseline: targetData[idx].baseline,
        }));
        currentValuesRef.current = targetData;
        setAnimatedChartData(finalData);
      }
    });

    return () => {
      controls.stop();
    };
  }, [timeframe]);

  const activePoint = RADAR_METRICS.find((p) => p.dimension === selectedDimension || p.shortDimension === selectedDimension);

  // CSV Export states and ref
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [exportingMode, setExportingMode] = useState<string | null>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close CSV export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  // CSV cell escaping for RFC 4180 compatibility
  const escapeCsv = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    return `"${str.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
  };

  // Trigger browser download with UTF-8 BOM (\uFEFF) to guarantee Excel/Sheets Korean compatibility
  const triggerCsvDownload = (rows: (string | number)[][], fileName: string) => {
    const csvContent = '\uFEFF' + rows.map((r) => r.map(escapeCsv).join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccessMessage(`"${fileName}" 파일 다운로드가 완료되었습니다.`);
    setShowExportMenu(false);
    setTimeout(() => {
      setExportSuccessMessage(null);
      setExportingMode(null);
    }, 4500);
  };

  // Export current benchmark dataset as downloadable CSV file for external reporting
  const handleExportCsv = (mode: 'current' | 'comprehensive' | 'single', targetMetric?: RadarDataPoint) => {
    setExportingMode(mode);
    const now = new Date();
    const dateFormatted = now.toISOString().slice(0, 10);
    const timeFormatted = now.toTimeString().slice(0, 8);

    const rows: (string | number)[][] = [];

    if (mode === 'single' && (targetMetric || activePoint)) {
      const metric = targetMetric || activePoint!;
      const currentMuseScore = timeframe === 'current' ? metric.metaMuse : metric.metaMuseHistorical;
      const currentOpenAiScore = timeframe === 'current' ? metric.openAiLatest : metric.openAiHistorical;
      const currentBaselineScore = timeframe === 'current' ? metric.industryBaseline : metric.baselineHistorical;
      const deltaVsBaseline = currentMuseScore - currentBaselineScore;

      rows.push(['# META MUSE vs OPENAI 에이전트 다차원 벤치마크 심층 평가 리포트']);
      rows.push(['# 대상 지표명:', metric.dimension, '약칭:', metric.shortDimension]);
      rows.push(['# 추출 일시:', `${dateFormatted} ${timeFormatted}`, '평가 시점:', timeframe === 'current' ? '최신 실측 (2026.10)' : '이전 추이 (2026.06)']);
      rows.push(['# 공인 검증 기관:', metric.benchmarkSource.institution]);
      rows.push([]);
      rows.push(['구분 항목', 'Meta Muse (Glimmer 30B)', 'OpenAI 최신 모델', '글로벌 업계 기준선 (Industry Avg)', '상대적 격차 및 우위 분석']);
      rows.push([
        '정규화 성능 점수 (0-100)',
        currentMuseScore,
        currentOpenAiScore,
        currentBaselineScore,
        `업계 대비 +${deltaVsBaseline}pt 우위 / OpenAI 대비 ${metric.delta}`
      ]);
      rows.push([
        '실측 원본 데이터 (Raw Metric)',
        metric.benchmarkSource.rawComparison.metaMuseVal,
        metric.benchmarkSource.rawComparison.openAiVal,
        metric.baselineLabel,
        `단위: ${metric.benchmarkSource.rawComparison.metricUnit}`
      ]);
      rows.push([
        '시점별 성장률 (과거 대비)',
        `+${metric.metaMuseGrowth}%`,
        `+${metric.openAiGrowth}%`,
        `과거 ${metric.baselineHistorical}점 → 최신 ${metric.industryBaseline}점`,
        `성장 격차: +${Math.round((metric.metaMuseGrowth - metric.openAiGrowth) * 10) / 10}%p`
      ]);
      rows.push([]);
      rows.push(['[상대적 강점 및 전략 진단 항목]', '세부 분석 내용']);
      rows.push(['상대적 강점 분류 등급', metric.relativeStrength.strengthLevel]);
      rows.push(['업계 기준선 대비 상대 우위', `+${metric.relativeStrength.relativeDelta}pt (+${metric.relativeStrength.relativePercent}%)`]);
      rows.push(['Meta Muse 핵심 우위 메커니즘', metric.relativeStrength.whyOutperforms]);
      rows.push(['글로벌 업계 표준의 구조적 병목 요인', metric.relativeStrength.industryBottleneck]);
      rows.push(['엔터프라이즈 도입 전략적 가치 및 ROI', metric.relativeStrength.strategicImpact]);
      rows.push([]);
      rows.push(['[벤치마크 평가 프로토콜 및 환경 명세]', '세부 명세 내용']);
      rows.push(['평가 데이터셋', metric.benchmarkSource.datasetName]);
      rows.push(['실측 검증 일자', metric.benchmarkSource.verifiedDate]);
      rows.push(['표본 규모', metric.benchmarkSource.sampleSize]);
      rows.push(['측정 하드웨어 및 환경', metric.methodology.testbedEnvironment]);
      rows.push(['평가 프로토콜 요약', metric.methodology.protocol]);
      rows.push(['정규화 공식 및 유의성', metric.methodology.normalizationFormula]);
      rows.push(['핵심 실측 결과 및 시사점', metric.methodology.keyFindings.join('; ')]);
      rows.push([]);
      rows.push(['# 데이터 출처 및 라이선스:', 'MLPerf, Artificial Analysis, Gartner GenAI Index & Meta Muse Technical Report (2026)']);

      const fileName = `meta_muse_benchmark_${metric.shortDimension.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_${timeframe}_${dateFormatted}.csv`;
      triggerCsvDownload(rows, fileName);
      return;
    }

    if (mode === 'comprehensive') {
      rows.push(['# META MUSE vs OPENAI 차세대 에이전트 전차원 벤치마크 통합 마스터 데이터셋']);
      rows.push(['# 생성 일시:', `${dateFormatted} ${timeFormatted}`, '데이터셋 버전:', 'v2.4 (2026.10 최신 + 2026.06 히스토리컬 통합)']);
      rows.push(['# 검증 프레임워크:', 'MLPerf Inference v4.1, SPECworkstation, SWE-bench Verified, Gartner GenAI Research']);
      rows.push([]);
      rows.push([
        '지표 분류 (Dimension)',
        '약칭 (Short)',
        'Meta Muse 최신(2026.10)',
        'Meta Muse 이전(2026.06)',
        'Meta Muse 성장률(%)',
        'OpenAI 최신(2026.10)',
        'OpenAI 이전(2026.06)',
        'OpenAI 성장률(%)',
        '업계 기준선 최신(2026.10)',
        '업계 기준선 이전(2026.06)',
        '업계 대비 격차(최신 pt)',
        '업계 대비 상대우위율(%)',
        '상대적 강점 등급',
        '우위 주도 모델',
        '경쟁사 대비 격차',
        '단위',
        'Muse 실측치',
        'OpenAI 실측치',
        '업계 기준선 실측 라벨',
        '측정 원본 단위',
        '공인 검증 기관',
        '평가 데이터셋',
        '실측 검증일',
        '표본 규모',
        '평가 환경',
        '평가 프로토콜 요약',
        '정규화 공식',
        '핵심 검증 결과',
        'Muse 우위 원인',
        '업계 표준 한계 요인',
        '엔터프라이즈 전략적 가치 및 ROI'
      ]);

      RADAR_METRICS.forEach((m) => {
        const deltaVsBase = m.metaMuse - m.industryBaseline;
        rows.push([
          m.dimension,
          m.shortDimension,
          m.metaMuse,
          m.metaMuseHistorical,
          `+${m.metaMuseGrowth}%`,
          m.openAiLatest,
          m.openAiHistorical,
          `+${m.openAiGrowth}%`,
          m.industryBaseline,
          m.baselineHistorical,
          `+${deltaVsBase}pt`,
          `+${m.relativeStrength.relativePercent}%`,
          m.relativeStrength.strengthLevel,
          m.advantage,
          m.delta,
          m.unit,
          m.benchmarkSource.rawComparison.metaMuseVal,
          m.benchmarkSource.rawComparison.openAiVal,
          m.baselineLabel,
          m.benchmarkSource.rawComparison.metricUnit,
          m.benchmarkSource.institution,
          m.benchmarkSource.datasetName,
          m.benchmarkSource.verifiedDate,
          m.benchmarkSource.sampleSize,
          m.methodology.testbedEnvironment,
          m.methodology.protocol,
          m.methodology.normalizationFormula,
          m.methodology.keyFindings.join('; '),
          m.relativeStrength.whyOutperforms,
          m.relativeStrength.industryBottleneck,
          m.relativeStrength.strategicImpact
        ]);
      });

      const fileName = `meta_muse_benchmark_master_comprehensive_${dateFormatted}.csv`;
      triggerCsvDownload(rows, fileName);
      return;
    }

    // Default mode === 'current' (Export active timeframe dataset)
    const isCurrent = timeframe === 'current';
    rows.push(['# META MUSE vs OPENAI 차세대 에이전트 다차원 벤치마크 평가 데이터셋']);
    rows.push([
      '# 추출 뷰:',
      isCurrent ? '최신 실측 벤치마크 (Current View: 2026.10)' : '이전 추이 벤치마크 (Historical View: 2026.06)',
      '추출 일시:',
      `${dateFormatted} ${timeFormatted}`
    ]);
    rows.push(['# 비교 대상:', 'Meta Muse (Glimmer 30B) vs OpenAI 최신 모델 vs 2026 글로벌 업계 평균 기준선']);
    rows.push([]);
    rows.push([
      '지표 분류',
      '약칭',
      '평가 시점',
      'Meta Muse 점수',
      'OpenAI 점수',
      '업계 기준선 점수',
      '업계 기준선 대비 격차',
      '업계 대비 상대 우위율',
      '상대 강점 등급',
      '주도 모델',
      '경쟁사 대비 격차',
      'Meta Muse 실측값',
      'OpenAI 실측값',
      '업계 기준선 실측 라벨',
      '실측 측정 단위',
      '과거 대비 Muse 성장률',
      '과거 대비 OpenAI 성장률',
      '공인 검증 기관',
      '평가 데이터셋',
      '실측 검증 일자',
      '표본 규모',
      '평가 환경',
      '평가 프로토콜 요약',
      '정규화 공식',
      '핵심 분석 결과',
      '우위 핵심 메커니즘',
      '업계 표준 병목 요인',
      '비즈니스 전략적 ROI'
    ]);

    RADAR_METRICS.forEach((m) => {
      const museScore = isCurrent ? m.metaMuse : m.metaMuseHistorical;
      const openAiScore = isCurrent ? m.openAiLatest : m.openAiHistorical;
      const baselineScore = isCurrent ? m.industryBaseline : m.baselineHistorical;
      const deltaVsBase = museScore - baselineScore;

      rows.push([
        m.dimension,
        m.shortDimension,
        isCurrent ? '2026.10 (최신)' : '2026.06 (이전)',
        museScore,
        openAiScore,
        baselineScore,
        `${deltaVsBase >= 0 ? '+' : ''}${deltaVsBase}pt`,
        `+${m.relativeStrength.relativePercent}%`,
        m.relativeStrength.strengthLevel,
        m.advantage,
        m.delta,
        m.benchmarkSource.rawComparison.metaMuseVal,
        m.benchmarkSource.rawComparison.openAiVal,
        m.baselineLabel,
        m.benchmarkSource.rawComparison.metricUnit,
        `+${m.metaMuseGrowth}%`,
        `+${m.openAiGrowth}%`,
        m.benchmarkSource.institution,
        m.benchmarkSource.datasetName,
        m.benchmarkSource.verifiedDate,
        m.benchmarkSource.sampleSize,
        m.methodology.testbedEnvironment,
        m.methodology.protocol,
        m.methodology.normalizationFormula,
        m.methodology.keyFindings.join('; '),
        m.relativeStrength.whyOutperforms,
        m.relativeStrength.industryBottleneck,
        m.relativeStrength.strategicImpact
      ]);
    });

    const fileName = `meta_muse_benchmark_${timeframe}_${dateFormatted}.csv`;
    triggerCsvDownload(rows, fileName);
  };

  // Custom PolarAngleAxis Tick with click interaction and hover state
  const renderPolarAngleAxisTick = (props: any) => {
    // Destructure out recharts internal non-DOM props like verticalAnchor, visibleTicksCount, index, textAnchor
    const { payload, x, y, verticalAnchor, visibleTicksCount, textAnchor, stroke, ...rest } = props;
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
          textAnchor={textAnchor || 'middle'}
          dominantBaseline="central"
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
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    다차원 성능 비교 레이더 차트 (Meta Muse vs OpenAI 최신 모델)
                  </h3>
                  {timeframe === 'current' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      NEW BENCHMARK (2026.10)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-100/90 px-1.5 py-0.5 rounded border border-indigo-300">
                      <History className="w-3 h-3 text-indigo-600" />
                      HISTORICAL BASELINE (2026.05~06)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>지연시간(TTFT), 추론 비용, 토큰 압축 효율, 개인정보 격리, 도구 자율성, 복합 추론 6대 축 비교</span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1">
                    <MousePointerClick className="w-3 h-3 inline text-blue-600" />
                    (차트 영역/라벨 클릭 시 세부 방법론 표시)
                  </span>
                </p>
              </div>

              {/* Timeframe Toggle (Current vs Historical), Baseline Toggle & Legends */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {/* Current / Historical Toggle Buttons with Framer Motion Sliding Pill */}
                <div 
                  className="relative flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/80 shadow-2xs shrink-0 touch-manipulation"
                  role="group"
                  aria-label="벤치마크 시점 선택"
                >
                  <button
                    onClick={() => setTimeframe('current')}
                    className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors touch-manipulation ${
                      timeframe === 'current'
                        ? 'text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                    aria-pressed={timeframe === 'current'}
                  >
                    {timeframe === 'current' && (
                      <motion.span
                        layoutId="active-radar-timeframe-pill"
                        className="absolute inset-0 bg-white rounded-lg shadow-xs ring-1 ring-slate-900/5 -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>최신 (Current)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  </button>
                  <button
                    onClick={() => setTimeframe('historical')}
                    className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors touch-manipulation ${
                      timeframe === 'historical'
                        ? 'text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                    aria-pressed={timeframe === 'historical'}
                  >
                    {timeframe === 'historical' && (
                      <motion.span
                        layoutId="active-radar-timeframe-pill"
                        className="absolute inset-0 bg-white rounded-lg shadow-xs ring-1 ring-slate-900/5 -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <History className="w-3.5 h-3.5 text-indigo-600" />
                    <span>이전 추이 (Historical)</span>
                  </button>
                </div>

                {/* Industry Baseline Toggle Button */}
                <button
                  onClick={() => setShowBaseline(!showBaseline)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all touch-manipulation shadow-2xs shrink-0 ${
                    showBaseline
                      ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  aria-pressed={showBaseline}
                  title="2026 글로벌 AI 업계 평균 기준선(Baseline) 비교 표시 토글"
                >
                  <Scale className={`w-3.5 h-3.5 ${showBaseline ? 'text-cyan-300' : 'text-slate-500'}`} />
                  <span>기준선 (Baseline)</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    showBaseline 
                      ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/40' 
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {showBaseline ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* CSV Export Dropdown / Button */}
                <div className="relative" ref={exportMenuRef}>
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all touch-manipulation shadow-2xs shrink-0"
                    title="벤치마크 데이터셋 CSV 내보내기"
                    aria-expanded={showExportMenu}
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CSV 내보내기</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showExportMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 space-y-1 text-xs"
                      >
                        <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                            외부 보고용 데이터셋 내보내기
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-medium">
                            UTF-8 BOM
                          </span>
                        </div>

                        <button
                          onClick={() => handleExportCsv('current')}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-2 group"
                        >
                          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 group-hover:bg-blue-100 shrink-0 mt-0.5">
                            <Download className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span>현재 뷰 데이터셋 ({timeframe === 'current' ? '최신 2026.10' : '이전 2026.06'})</span>
                              <span className="text-[10px] font-normal text-blue-600 bg-blue-50 px-1 rounded">추천</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              현재 선택된 {timeframe === 'current' ? '최신 실측치' : '이전 추이'} 기준 6대 축 종합 데이터 및 기준선 비교 CSV
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => handleExportCsv('comprehensive')}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-2 group"
                        >
                          <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 shrink-0 mt-0.5">
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">
                              전체 시계열 통합 마스터 데이터셋
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              최신 + 과거 시점, 성장률, 원본 실측치, 방법론 전 항목 포함 종합 CSV
                            </p>
                          </div>
                        </button>

                        {activePoint && (
                          <button
                            onClick={() => handleExportCsv('single', activePoint)}
                            className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-2 group border-t border-slate-100"
                          >
                            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 shrink-0 mt-0.5">
                              <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 truncate">
                                선택 지표 심층 명세서 ({activePoint.shortDimension})
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                해당 카테고리의 프로토콜, 표본, 상대 강점 심층 진단 상세 리포트
                              </p>
                            </div>
                          </button>
                        )}

                        <div className="px-2.5 py-1.5 bg-slate-50 rounded-lg text-[10px] text-slate-500 border border-slate-100 flex items-center justify-between">
                          <span>Excel, Google Sheets 완벽 호환</span>
                          <span className="font-mono text-slate-400">.csv (RFC 4180)</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Chart Legend Summary */}
                <div className="flex flex-wrap items-center gap-3 text-xs shrink-0 pt-1 sm:pt-0">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-700">
                    <span className={`w-3 h-3 rounded-xs ${timeframe === 'current' ? 'bg-blue-600' : 'bg-blue-400 border border-blue-600 border-dashed'} inline-block`} />
                    <span>Meta Muse {timeframe === 'historical' ? '(초기 v1.0)' : '(글리머 30B)'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-amber-700">
                    <span className={`w-3 h-3 rounded-xs ${timeframe === 'current' ? 'bg-amber-500' : 'bg-amber-400 border border-amber-600 border-dashed'} inline-block`} />
                    <span>OpenAI {timeframe === 'historical' ? '(GPT-4o 초기)' : '(o3-mini/Operator)'}</span>
                    {timeframe === 'current' && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                    )}
                  </div>
                  {showBaseline && (
                    <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <span className="w-3 h-1 border-t-2 border-dashed border-slate-500 inline-block" />
                      <span>업계 기준선 {timeframe === 'historical' ? '(과거 48.0점)' : '(2026 평균 52.8점)'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Export Success Toast Notification Banner */}
            <AnimatePresence>
              {exportSuccessMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.99 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="font-bold flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        벤치마크 데이터셋 CSV 다운로드 완료
                      </span>
                      <p className="text-[11px] text-emerald-700 mt-0.5 font-mono">
                        {exportSuccessMessage}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExportSuccessMessage(null)}
                    className="p-1 text-emerald-600 hover:text-emerald-900 rounded-md hover:bg-emerald-100/60"
                    title="알림 닫기"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeframe Context & Growth Summary Banner with AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={timeframe}
                initial={{ opacity: 0, y: 6, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.995 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className={`p-2.5 sm:p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs ${
                  timeframe === 'historical' 
                    ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900' 
                    : 'bg-blue-50/60 border-blue-200 text-blue-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md ${timeframe === 'historical' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                    {timeframe === 'historical' ? <History className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold flex items-center gap-1.5">
                      {timeframe === 'historical' 
                        ? '과거 베이스라인 데이터 표시 중 (2026.05~06 실측 기준)' 
                        : '최신 벤치마크 데이터 표시 중 (2026.10 릴리즈 기준)'}
                      {isTransitioning && (
                        <span className="text-[10px] font-normal text-blue-600 animate-pulse">
                          (Framer Motion 모핑 적용 중...)
                        </span>
                      )}
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {timeframe === 'historical'
                        ? 'Glimmer 30B 초기 가중치(Speculative 이전) 및 GPT-4o 초기 시절의 에이전트 지표입니다. 상단 토글을 눌러 최신과 비교해 보세요.'
                        : '온디바이스 DFlash Speculative 디코딩 및 MCP 표준 프로토콜 적용 이후, Meta Muse는 지연시간 +30.6%, 도구 자율성 +32.8%의 성장을 기록했습니다.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    평균 에이전트 성장률: <strong className="text-blue-600">+23.1%</strong> (OpenAI +12.6%)
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Radar Chart Viewport (Fluid Height for Smartphones & Desktops) */}
            <div className="w-full h-[290px] sm:h-[370px] relative">
              {/* Transition Morphing Active Indicator Pill */}
              <AnimatePresence>
                {isTransitioning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-2 right-2 z-10 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-full border border-blue-300 shadow-xs flex items-center gap-1.5 text-[10px] font-bold text-blue-700 pointer-events-none"
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="inline-block"
                    >
                      <Activity className="w-3 h-3 text-blue-600" />
                    </motion.span>
                    <span>모핑 모션 전환 중...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  data={animatedChartData} 
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
                    name={timeframe === 'current' ? 'Meta Muse (Glimmer 30B 최신)' : 'Meta Muse (과거 베이스라인)'}
                    dataKey="activeMetaMuse"
                    stroke="#2563EB"
                    strokeDasharray={timeframe === 'historical' ? '4 4' : undefined}
                    fill="#3B82F6"
                    fillOpacity={selectedDimension ? (timeframe === 'historical' ? 0.30 : 0.42) : (timeframe === 'historical' ? 0.22 : 0.35)}
                    strokeWidth={2.5}
                    isAnimationActive={false}
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
                    name={timeframe === 'current' ? 'OpenAI (o3-mini & Operator 최신)' : 'OpenAI (과거 GPT-4o 베이스라인)'}
                    dataKey="activeOpenAi"
                    stroke="#D97706"
                    strokeDasharray={timeframe === 'historical' ? '4 4' : undefined}
                    fill="#F59E0B"
                    fillOpacity={selectedDimension ? (timeframe === 'historical' ? 0.22 : 0.32) : (timeframe === 'historical' ? 0.16 : 0.25)}
                    strokeWidth={2}
                    isAnimationActive={false}
                    dot={{ r: 4, stroke: '#D97706', strokeWidth: 1.5, fill: '#FFFFFF', cursor: 'pointer' }}
                    activeDot={{ r: 7, stroke: '#92400E', strokeWidth: 2, fill: '#F59E0B', cursor: 'pointer' }}
                    onClick={(data: any) => {
                      if (data && data.payload && data.payload.dimension) {
                        setSelectedDimension(data.payload.dimension);
                      }
                    }}
                  />

                  {/* Industry Baseline Radar (Slate Dashed) with Interactive Dots & Click Handler */}
                  {showBaseline && (
                    <Radar
                      name={timeframe === 'current' ? '업계 기준선 (Industry Baseline 2026)' : '업계 기준선 (과거 평균)'}
                      dataKey="activeBaseline"
                      stroke="#64748B"
                      strokeDasharray="4 4"
                      fill="#94A3B8"
                      fillOpacity={selectedDimension ? 0.08 : 0.12}
                      strokeWidth={1.8}
                      isAnimationActive={false}
                      dot={{ r: 3.5, stroke: '#64748B', strokeWidth: 1.5, fill: '#FFFFFF', cursor: 'pointer' }}
                      activeDot={{ r: 6, stroke: '#334155', strokeWidth: 2, fill: '#94A3B8', cursor: 'pointer' }}
                      onClick={(data: any) => {
                        if (data && data.payload && data.payload.dimension) {
                          setSelectedDimension(data.payload.dimension);
                        }
                      }}
                    />
                  )}

                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as RadarDataPoint & { 
                          activeMetaMuse?: number; 
                          activeOpenAi?: number;
                          activeBaseline?: number;
                        };
                        const museVal = timeframe === 'current' ? data.metaMuse : data.metaMuseHistorical;
                        const openAiVal = timeframe === 'current' ? data.openAiLatest : data.openAiHistorical;
                        const baselineVal = timeframe === 'current' ? data.industryBaseline : data.baselineHistorical;
                        const liveMuse = data.activeMetaMuse !== undefined ? data.activeMetaMuse : museVal;
                        const liveOpenAi = data.activeOpenAi !== undefined ? data.activeOpenAi : openAiVal;
                        const liveBaseline = data.activeBaseline !== undefined ? data.activeBaseline : baselineVal;

                        return (
                          <div className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs shadow-xl border border-slate-700 space-y-1.5 max-w-xs">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                              <span className="font-bold text-blue-400">{data.dimension}</span>
                              {timeframe === 'current' && data.isCompetitorUpdated && (
                                <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-amber-400" />
                                  10월 신규 갱신
                                </span>
                              )}
                              {timeframe === 'historical' && (
                                <span className="text-[10px] text-indigo-300 font-semibold flex items-center gap-1">
                                  <History className="w-3 h-3 text-indigo-400" />
                                  과거 베이스라인
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 pt-0.5">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-300 font-medium">Meta Muse:</span>
                                <div className="flex items-center gap-1.5 font-mono">
                                  <span className="font-bold text-blue-400">{liveMuse}점</span>
                                  {timeframe === 'current' && (
                                    <span className="text-[10px] text-emerald-400 font-semibold">
                                      (+{data.metaMuseGrowth}%)
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-300 font-medium">OpenAI:</span>
                                <div className="flex items-center gap-1.5 font-mono">
                                  <span className="font-bold text-amber-400">{liveOpenAi}점</span>
                                  {timeframe === 'current' && (
                                    <span className="text-[10px] text-amber-300 font-semibold">
                                      (+{data.openAiGrowth}%)
                                    </span>
                                  )}
                                </div>
                              </div>
                              {showBaseline && (
                                <div className="flex items-center justify-between text-slate-400 pt-0.5 border-t border-slate-800">
                                  <span className="font-medium">업계 기준선:</span>
                                  <div className="flex items-center gap-1.5 font-mono">
                                    <span className="font-bold text-slate-300">{liveBaseline}점</span>
                                    <span className="text-[10px] text-cyan-400 font-semibold">
                                      (Muse +{(liveMuse - liveBaseline).toFixed(0)}pt)
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="border-t border-slate-800 pt-1 text-[11px] text-slate-400">
                              <span className="text-slate-500">실측 수치: </span>
                              <span className="text-slate-200">{data.benchmarkSource?.rawComparison?.metaMuseVal || data.delta}</span>
                            </div>
                            <div className="text-[10px] text-blue-300/80 pt-0.5 flex items-center gap-1">
                              <MousePointerClick className="w-3 h-3 text-blue-400" />
                              <span>클릭하여 출처 및 기준선 상대 강점 확인</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Interactive Dimension Selector Pills (Mobile Friendly) */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  지표별 비교 상세 & 업계 기준선 대비 강점 (클릭 시 상대적 강점 심층 진단):
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
                  const currentItem = animatedChartData.find((d) => d.dimension === metric.dimension);
                  const currentMuseScore = Math.round(currentItem?.activeMetaMuse ?? (timeframe === 'current' ? metric.metaMuse : metric.metaMuseHistorical));
                  const currentOpenAiScore = Math.round(currentItem?.activeOpenAi ?? (timeframe === 'current' ? metric.openAiLatest : metric.openAiHistorical));
                  const currentBaselineScore = Math.round(currentItem?.activeBaseline ?? (timeframe === 'current' ? metric.industryBaseline : metric.baselineHistorical));
                  const deltaVsBaseline = currentMuseScore - currentBaselineScore;

                  return (
                    <button
                      key={metric.dimension}
                      onClick={() => setSelectedDimension(isSelected ? null : metric.dimension)}
                      className={`p-2 rounded-xl text-left transition-all border touch-manipulation ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-2xs ring-2 ring-blue-500/20'
                          : timeframe === 'current' && metric.isCompetitorUpdated
                          ? 'border-amber-200 bg-amber-50/50 hover:bg-amber-100/60'
                          : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-700 truncate">{metric.shortDimension}</span>
                        {timeframe === 'current' && metric.isCompetitorUpdated ? (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="신규 벤치마크 갱신 항목" />
                        ) : (
                          <span className="text-[9px] font-mono text-emerald-600 font-bold shrink-0">
                            +{metric.metaMuseGrowth}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
                        <span className="text-blue-700 font-black">{currentMuseScore}</span>
                        <span className="text-slate-400">vs</span>
                        <span className="text-amber-700 font-bold">{currentOpenAiScore}</span>
                        <span className="text-[9px] text-slate-500">
                          (평균:{currentBaselineScore})
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-medium truncate mt-0.5">
                        <span className="text-slate-500 truncate">{timeframe === 'current' ? metric.delta : `성장: +${metric.metaMuseGrowth}%`}</span>
                        <span className="text-cyan-700 font-bold shrink-0 ml-1">
                          +{deltaVsBaseline}pt
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Detailed Benchmark Source & Methodology Card */}
              <AnimatePresence mode="wait">
                {activePoint ? (
                <motion.div
                  key={activePoint.dimension}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="mt-4 rounded-2xl bg-white border-2 border-blue-200 shadow-md p-4 sm:p-6 space-y-5"
                >
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

                    <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                      <button
                        onClick={() => handleExportCsv('single', activePoint)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg transition-colors border border-emerald-200 shadow-2xs"
                        title="해당 지표 심층 벤치마크 명세서 CSV 다운로드"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        <span>지표 CSV 내보내기</span>
                      </button>
                      <button
                        onClick={() => setSelectedDimension(null)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        title="상세 설명 닫기"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>닫기</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 1: Raw Metrics Comparison & Growth Dynamics with Framer Motion */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={timeframe}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {/* Meta Muse Metrics */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/90 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-blue-800 flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
                            Meta Muse (Glimmer 30B)
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">
                              과거 {activePoint.metaMuseHistorical}점 →
                            </span>
                            <span className="font-mono font-black text-blue-700 text-sm">
                              {timeframe === 'current' ? activePoint.metaMuse : activePoint.metaMuseHistorical}점
                            </span>
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-300">
                              <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                              +{activePoint.metaMuseGrowth}% 성장
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-medium text-slate-700 pt-1 border-t border-blue-100/80">
                          <span className="text-slate-500 block text-[10px]">실측 측정 수치 및 과거 대비 변화</span>
                          <span className="font-semibold text-slate-900">{activePoint.benchmarkSource.rawComparison.metaMuseVal}</span>
                        </div>
                        <div className="text-[10px] text-blue-700/90 bg-blue-100/60 p-1.5 rounded-lg flex items-center justify-between">
                          <span>이전 마일스톤: {activePoint.historicalMilestone}</span>
                          <span className="font-mono">{activePoint.historicalDate}</span>
                        </div>
                      </div>

                      {/* OpenAI Metrics */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200/90 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-800 flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
                            OpenAI (o3-mini & Operator)
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">
                              과거 {activePoint.openAiHistorical}점 →
                            </span>
                            <span className="font-mono font-black text-amber-700 text-sm">
                              {timeframe === 'current' ? activePoint.openAiLatest : activePoint.openAiHistorical}점
                            </span>
                            <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-300">
                              <ArrowUpRight className="w-3 h-3 text-amber-600" />
                              +{activePoint.openAiGrowth}% 성장
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-medium text-slate-700 pt-1 border-t border-amber-100/80">
                          <span className="text-slate-500 block text-[10px]">실측 측정 수치 및 과거 대비 변화</span>
                          <span className="font-semibold text-slate-900">{activePoint.benchmarkSource.rawComparison.openAiVal}</span>
                        </div>
                        <div className="text-[10px] text-amber-800/90 bg-amber-100/60 p-1.5 rounded-lg flex items-center justify-between">
                          <span>과거 기준: GPT-4o 초기 릴리즈 대비</span>
                          <span className="font-mono">2026.05 기준</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Metric Unit Banner */}
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-between font-mono">
                    <span className="text-slate-500 text-[11px] font-sans font-medium">비교 평가 척도 및 단위:</span>
                    <span className="font-bold text-slate-900">{activePoint.benchmarkSource.rawComparison.metricUnit}</span>
                  </div>

                  {/* Section 2: Relative Strengths vs Industry Baseline */}
                  {(() => {
                    const currentPointItem = animatedChartData.find((d) => d.dimension === activePoint.dimension);
                    const activeMuseScore = Math.round(currentPointItem?.activeMetaMuse ?? (timeframe === 'current' ? activePoint.metaMuse : activePoint.metaMuseHistorical));
                    const activeOpenAiScore = Math.round(currentPointItem?.activeOpenAi ?? (timeframe === 'current' ? activePoint.openAiLatest : activePoint.openAiHistorical));
                    const activeBaselineScore = Math.round(currentPointItem?.activeBaseline ?? (timeframe === 'current' ? activePoint.industryBaseline : activePoint.baselineHistorical));
                    const relativeDelta = activeMuseScore - activeBaselineScore;
                    const relativePct = Math.round(((activeMuseScore - activeBaselineScore) / activeBaselineScore) * 100);

                    return (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md space-y-4">
                        {/* Header & Badges */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-700/80">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 shrink-0">
                              <Award className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                                  2. 업계 기준선(Industry Baseline) 대비 상대적 강점 심층 진단
                                </h5>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activePoint.relativeStrength.levelBadgeColor}`}>
                                  {activePoint.relativeStrength.strengthLevel}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-0.5">
                                글로벌 AI 업계 표준 평균({activeBaselineScore}점)과 정량 대조하여 도출된 Meta Muse의 실질적 핵심 차별화 역량
                              </p>
                            </div>
                          </div>

                          {/* Delta Badge */}
                          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                            <div className="px-3 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-left sm:text-right">
                              <span className="text-[10px] text-cyan-200 block font-medium">기준선 대비 Meta Muse</span>
                              <div className="flex items-center gap-1 text-sm font-black font-mono text-cyan-300 mt-0.5">
                                <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                                <span>+{relativeDelta}점</span>
                                <span className="text-[10px] text-emerald-400 font-bold ml-0.5">
                                  (+{relativePct}% 초과)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Comparative Visual Bars (Muse vs OpenAI vs Baseline) */}
                        <div className="space-y-3 bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/70">
                          <div className="flex items-center justify-between text-xs text-slate-300 font-medium flex-wrap gap-1">
                            <span className="flex items-center gap-1.5 font-bold">
                              <BarChart3 className="w-4 h-4 text-cyan-400" />
                              3대 모델/기준선 정량 지수 비교 (0~100 Index)
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              기준선: {activePoint.baselineLabel}
                            </span>
                          </div>

                          {/* Bar 1: Meta Muse */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-blue-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                Meta Muse (Glimmer 30B)
                              </span>
                              <div className="flex items-center gap-2 font-mono">
                                <span className="font-bold text-white text-xs">{activeMuseScore}점</span>
                                <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/90 px-1.5 py-0.5 rounded border border-cyan-800">
                                  기준선 대비 +{relativeDelta}pt ({relativePct >= 0 ? `+${relativePct}%` : `${relativePct}%`})
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-3 rounded-full bg-slate-700/80 overflow-hidden flex">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, activeMuseScore)}%` }}
                                transition={{ duration: 0.55, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 rounded-full"
                              />
                            </div>
                          </div>

                          {/* Bar 2: OpenAI */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                OpenAI ({timeframe === 'current' ? 'o3-mini & Operator 최신' : 'GPT-4o 초기'})
                              </span>
                              <div className="flex items-center gap-2 font-mono">
                                <span className="font-bold text-white text-xs">{activeOpenAiScore}점</span>
                                <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/90 px-1.5 py-0.5 rounded border border-amber-800">
                                  기준선 대비 +{activeOpenAiScore - activeBaselineScore}pt
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-3 rounded-full bg-slate-700/80 overflow-hidden flex">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, activeOpenAiScore)}%` }}
                                transition={{ duration: 0.55, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 rounded-full"
                              />
                            </div>
                          </div>

                          {/* Bar 3: Industry Baseline */}
                          <div className="space-y-1 pt-0.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-slate-400" />
                                글로벌 업계 평균 기준선 (Industry Baseline)
                              </span>
                              <div className="flex items-center gap-2 font-mono">
                                <span className="font-bold text-slate-300 text-xs">{activeBaselineScore}점</span>
                                <span className="text-[10px] text-slate-400 font-medium">산업 표준 기준점</span>
                              </div>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-700/60 overflow-hidden relative">
                              <div 
                                style={{ width: `${activeBaselineScore}%` }}
                                className="h-full bg-slate-400/90 rounded-full border-r-2 border-white shadow-xs"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 3 Pillars of Relative Strength & Strategic Diagnosis */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                          {/* Pillar 1: Why Muse Leads */}
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-cyan-500/30 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                              <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span>1. 차별화 핵심 강점 (Core Strength)</span>
                            </div>
                            <p className="text-[11px] text-slate-200 leading-relaxed">
                              {activePoint.relativeStrength.whyOutperforms}
                            </p>
                          </div>

                          {/* Pillar 2: Industry Bottleneck */}
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>2. 업계 표준 모델의 구조적 한계</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              {activePoint.relativeStrength.industryBottleneck}
                            </p>
                          </div>

                          {/* Pillar 3: Strategic Impact */}
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-indigo-500/30 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                              <TrendingUp className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>3. 기업 도입 가치 및 전략적 실익</span>
                            </div>
                            <p className="text-[11px] text-slate-200 leading-relaxed">
                              {activePoint.relativeStrength.strategicImpact}
                            </p>
                          </div>
                        </div>

                        {/* Baseline Source & Standard Note Footer */}
                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-2">
                          <span className="flex items-center gap-1">
                            <Info className="w-3 h-3 text-slate-500 inline" />
                            산출 출처: Gartner GenAI Index, Artificial Analysis & State of AI Report 2026 표준 데이터셋
                          </span>
                          <span className="font-mono text-slate-400">
                            동일 조건 40개 주요 모델 정규화 평균 기준
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Section 3: Benchmark Source & Authority Specs */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>3. 벤치마크 출처 기관 및 데이터셋 명세 (Benchmark Source)</span>
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

                  {/* Section 4: Methodology & Protocol */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Microscope className="w-4 h-4 text-blue-600" />
                      <span>4. 측정 방법론 및 평가 프로토콜 (Methodology & Protocol)</span>
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

                  {/* Section 5: Key Strategic Findings */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>5. 핵심 분석 결과 및 시사점 (Key Strategic Findings)</span>
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
                </motion.div>
                ) : (
                  /* Empty / Call to Action Card with Framer Motion */
                  <motion.div
                    key="empty-callout"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/50 via-slate-50 to-indigo-50/40 border border-dashed border-blue-300 text-xs space-y-3.5 text-slate-700"
                  >
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0">
                          <MousePointerClick className="w-4 h-4 animate-bounce" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2 flex-wrap">
                            <span>레이더 차트 상호작용 및 기준선(Baseline) 상대 강점 진단 활성화됨</span>
                            <span className="text-[10px] bg-cyan-100 text-cyan-800 border border-cyan-300 px-2 py-0.5 rounded-full font-semibold">
                              업계 평균 대비 +36.7pt 우위
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            차트의 세그먼트, 꼭짓점 점, 또는 축 라벨(예: 지연시간, 추론 비용 등)을 클릭하면 공인 출처, 측정 프로토콜 및 <strong>업계 기준선(Industry Baseline) 대비 상대적 강점 심층 진단 카드</strong>가 아래에 상세 표시됩니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Overall Baseline Relative Strength Highlight Banner */}
                    <div className="p-2.5 rounded-xl bg-white/80 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-800">
                          종합 진단: Meta Muse 평균 점수 <strong>89.5점</strong> vs 업계 기준선 <strong>52.8점</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-cyan-700 font-bold self-end sm:self-auto">
                        <span>전체 상대 강점 지수:</span>
                        <span className="bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded border border-cyan-200">
                          +36.7pt (+69.5% 상회)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-200/80">
                      <div className="flex items-center gap-2 flex-wrap">
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
                      <button
                        onClick={() => handleExportCsv('current')}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 rounded-lg border border-emerald-200 transition-colors shadow-2xs flex items-center gap-1.5 self-end sm:self-auto"
                        title="현재 시점 기준 벤치마크 데이터셋 전체 다운로드"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        <span>데이터셋 CSV 다운로드</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
