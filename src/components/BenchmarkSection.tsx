import React, { useState } from 'react';
import { 
  BarChart3, 
  Radar, 
  Table2, 
  Cpu, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Download,
  Info,
  TrendingUp,
  TrendingDown,
  Award,
  LineChart as LineChartIcon,
  ArrowUpRight,
  Zap,
  Sparkles,
  Layers,
  History
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  LineChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend as RechartsLegend, 
  ReferenceLine 
} from 'recharts';
import { BENCHMARKS, HARDWARE_PRESETS, GLIMMER_VERSION_TRENDS, CATEGORY_DEFINITIONS } from '../data/reportData';
import { ModelVersionTrend } from '../types';
import { downloadReportAsJson } from '../utils/exportReport';
import { useToast } from '../context/ToastContext';

interface TrendBadgeProps {
  current: number;
  previous: number;
  compact?: boolean;
  showPrev?: boolean;
}

const TrendBadge: React.FC<TrendBadgeProps> = ({ 
  current, 
  previous, 
  compact = false,
  showPrev = false
}) => {
  const delta = current - previous;
  const pct = (delta / previous) * 100;
  const isUp = delta >= 0;

  return (
    <span 
      className={`inline-flex items-center gap-1 font-mono font-bold rounded-md px-1.5 py-0.5 transition-all select-none ${
        isUp 
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs hover:bg-emerald-100/70' 
          : 'bg-rose-50 text-rose-700 border border-rose-200/90 shadow-2xs hover:bg-rose-100/70'
      } ${compact ? 'text-[10px]' : 'text-xs'}`}
      title={`전주 벤치마크(${previous}점) 대비 ${isUp ? '+' : ''}${delta.toFixed(1)}점 (${isUp ? '+' : ''}${pct.toFixed(1)}%) 성장`}
    >
      {isUp ? (
        <TrendingUp className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-600 stroke-[2.5]`} />
      ) : (
        <TrendingDown className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-rose-600 stroke-[2.5]`} />
      )}
      <span>{isUp ? '+' : ''}{pct.toFixed(1)}%</span>
      {showPrev ? (
        <span className="text-[9px] text-slate-400 font-normal">
          (전주 {previous})
        </span>
      ) : !compact ? (
        <span className="text-[9px] text-emerald-800/80 font-semibold">WoW</span>
      ) : null}
    </span>
  );
};

interface ConfidenceIntervalBadgeProps {
  marginOfError: number;
  confidenceInterval: [number, number];
  confidenceLevel?: number;
  sampleSize?: number;
  compact?: boolean;
  showRange?: boolean;
  className?: string;
}

const ConfidenceIntervalBadge: React.FC<ConfidenceIntervalBadgeProps> = ({ 
  marginOfError, 
  confidenceInterval, 
  confidenceLevel = 95,
  sampleSize,
  compact = false,
  showRange = false,
  className = ''
}) => {
  return (
    <span 
      className={`inline-flex items-center gap-1 font-mono font-bold rounded-md px-1.5 py-0.5 transition-all select-none border border-sky-300/80 bg-sky-50 text-sky-850 hover:bg-sky-100 shadow-2xs ${
        compact ? 'text-[10px]' : 'text-xs'
      } ${className}`}
      title={`온디바이스 평가 신뢰도: ${confidenceLevel}% 신뢰구간 [${confidenceInterval[0].toFixed(1)} ~ ${confidenceInterval[1].toFixed(1)}점], 오차범위(MoE) ±${marginOfError.toFixed(1)}점${sampleSize ? ` (반복 표본 n=${sampleSize}회)` : ''}`}
    >
      <ShieldCheck className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-sky-600 stroke-[2.2] shrink-0`} />
      <span>±{marginOfError.toFixed(1)}</span>
      <span className="text-[9px] text-sky-600 font-semibold">MoE</span>
      {showRange && (
        <span className="text-[9px] text-slate-500 font-normal ml-0.5 hidden sm:inline">
          [{confidenceInterval[0].toFixed(1)}~{confidenceInterval[1].toFixed(1)}]
        </span>
      )}
      {!compact && !showRange && (
        <span className="text-[9px] text-sky-700/80 font-medium">({confidenceLevel}% CI)</span>
      )}
    </span>
  );
};

interface CategoryTooltipBadgeProps {
  category: string;
  compact?: boolean;
  className?: string;
}

const CategoryTooltipBadge: React.FC<CategoryTooltipBadgeProps> = ({
  category,
  compact = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const def = CATEGORY_DEFINITIONS[category] || {
    category,
    nameKr: category,
    shortDesc: 'AI 모델 역량 정량 평가 항목',
    detailedDesc: '온디바이스 하드웨어 환경에서 반복 측정된 평가 지표입니다.',
    keyEvaluationPoints: ['정량적 벤치마크 점수', '반복 검증 안정성'],
    benchmarks: [],
    color: '#3B82F6',
    badgeBg: 'bg-slate-100 border-slate-200',
    badgeText: 'text-slate-700'
  };

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={`${category} (${def.nameKr}) 평가 카테고리 정의 보기`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`group inline-flex items-center gap-1 font-semibold rounded-md px-1.5 py-0.5 transition-all cursor-pointer border select-none ${def.badgeBg} ${def.badgeText} hover:brightness-95 hover:shadow-2xs ${
          compact ? 'text-[9px]' : 'text-[10px]'
        } ${className}`}
      >
        <span>{category}</span>
        <Info className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} opacity-60 group-hover:opacity-100 transition-opacity`} />
      </button>

      {/* Interactive Tooltip Popover */}
      {isOpen && (
        <div 
          role="tooltip"
          className="absolute z-50 left-0 top-full mt-1.5 w-72 sm:w-80 p-3 rounded-xl bg-slate-900 text-slate-100 text-xs shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow */}
          <div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-900 border-t border-l border-slate-700 rotate-45" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: def.color }} />
              <span className="font-bold text-white text-xs">{def.nameKr}</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
              평가 카테고리 정의
            </span>
          </div>

          {/* Concise Definition (핵심 요약) */}
          <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700/80 mb-2 relative z-10 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-sky-400">간결한 정의:</span>
              <span className="text-slate-400 font-mono text-[9px]">{def.category}</span>
            </div>
            <p className="text-[11px] text-slate-200 font-medium leading-relaxed">
              {def.shortDesc}
            </p>
          </div>

          {/* Detailed Explanation */}
          <p className="text-[10px] text-slate-300 leading-relaxed mb-2 relative z-10">
            {def.detailedDesc}
          </p>

          {/* Key Evaluation Points */}
          <div className="border-t border-slate-800 pt-1.5 mb-2 relative z-10">
            <span className="text-[10px] font-semibold text-slate-400 block mb-1">핵심 측정 기준:</span>
            <ul className="space-y-0.5 text-[10px] text-slate-300">
              {def.keyEvaluationPoints.map((pt, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Representative Benchmark */}
          {def.benchmarks && def.benchmarks.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-800 pt-1.5 text-[9px] font-mono text-slate-400 relative z-10">
              <span>대표 벤치마크:</span>
              <span className="text-emerald-400 font-semibold">{def.benchmarks.join(' · ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface CustomTrendTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTrendTooltip: React.FC<CustomTrendTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const versionData = GLIMMER_VERSION_TRENDS.find(
    (v) => v.shortVersion === label || v.version === label
  );
  if (!versionData) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-slate-100 p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-2 max-w-xs pointer-events-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <div>
          <span className="font-bold text-blue-400 text-sm">{versionData.version}</span>
          <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({versionData.releaseDate})</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-semibold border border-blue-800 font-mono">
          평균 {versionData.averageScore.toFixed(1)}점
        </span>
      </div>

      <div>
        <p className="font-semibold text-slate-200 text-[11px]">{versionData.milestoneTitle}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{versionData.milestoneDescription}</p>
      </div>

      <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[10px] space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">아키텍처 혁신:</span>
          <span className="text-blue-300 font-medium truncate max-w-[170px]" title={versionData.architectureHighlight}>
            {versionData.architectureHighlight}
          </span>
        </div>
        <div className="flex items-center justify-between font-mono">
          <span className="text-slate-400">RTX 5090 생성 속도:</span>
          <span className="text-emerald-400 font-bold">{versionData.tokPerSecRtx5090} tok/s</span>
        </div>
        <div className="flex items-center justify-between font-mono">
          <span className="text-slate-400">온디바이스 95% CI:</span>
          <span className="text-sky-300 font-semibold">오차범위 ±{versionData.marginOfError}점 (n={versionData.sampleSize})</span>
        </div>
      </div>

      {/* Values breakdown */}
      <div className="space-y-1 pt-1 text-[10px] font-mono border-t border-slate-800">
        <div className="text-[10px] text-slate-400 font-sans font-medium">항목별 평가 점수:</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">MCP Atlas:</span>
            <span className="text-emerald-400 font-bold">{versionData.mcpAtlas}점</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">DeepSearch:</span>
            <span className="text-sky-400 font-bold">{versionData.deepSearchQa}점</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">SWE-Bench:</span>
            <span className="text-amber-400 font-bold">{versionData.sweBenchPro}점</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">OSWorld:</span>
            <span className="text-purple-400 font-bold">{versionData.osWorld}점</span>
          </div>
          <div className="flex justify-between col-span-2">
            <span className="text-slate-400">AIME 2026:</span>
            <span className="text-rose-400 font-bold">{versionData.aime2026}점</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BenchmarkSection: React.FC = () => {
  const { showToast } = useToast();
  const [viewType, setViewType] = useState<'bar' | 'trend' | 'radar' | 'table'>('bar');
  const [trendMetric, setTrendMetric] = useState<
    'all' | 'average' | 'mcpAtlas' | 'deepSearchQa' | 'sweBenchPro' | 'osWorld' | 'aime2026' | 'tokSpeed'
  >('all');
  const [showBaselinesInTrend, setShowBaselinesInTrend] = useState<boolean>(true);
  const [selectedVersionMilestone, setSelectedVersionMilestone] = useState<string>('v2.5');
  const [selectedGpuId, setSelectedGpuId] = useState<string>('rtx5090');
  const [quantization, setQuantization] = useState<'4bit' | '8bit' | 'fp16'>('4bit');
  const [dflashEnabled, setDflashEnabled] = useState<boolean>(true);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [showConfidenceIntervals, setShowConfidenceIntervals] = useState<boolean>(true);

  const selectedGpu = HARDWARE_PRESETS.find((g) => g.id === selectedGpuId) || HARDWARE_PRESETS[0];

  // Quantization VRAM requirements
  const requiredVramMap = {
    '4bit': 17.2,
    '8bit': 31.4,
    'fp16': 60.5,
  };
  const requiredVram = requiredVramMap[quantization];
  const vramMargin = selectedGpu.vramGb - requiredVram;
  const isVramSufficient = vramMargin >= 0;

  // Tok/s calculation
  const speedMultiplier = quantization === '4bit' ? 1.0 : quantization === '8bit' ? 0.68 : 0.42;
  const dflashFactor = dflashEnabled ? 1.85 : 1.0;
  const calculatedSpeed = Math.round(selectedGpu.baseToksPerSec * speedMultiplier * dflashFactor * 10) / 10;

  // Radar chart mathematical geometry
  const radarMetrics = BENCHMARKS;
  const totalMetrics = radarMetrics.length;
  const radarRadius = 100;
  const radarCenter = { x: 180, y: 150 };

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 / totalMetrics) * index - Math.PI / 2;
    const distance = (value / 100) * radarRadius;
    return {
      x: radarCenter.x + distance * Math.cos(angle),
      y: radarCenter.y + distance * Math.sin(angle),
    };
  };

  const glimmerPoints = radarMetrics.map((m, i) => getCoordinates(m.glimmer30B, i));
  const gemmaPoints = radarMetrics.map((m, i) => getCoordinates(m.gemma4_31B, i));
  const qwenPoints = radarMetrics.map((m, i) => getCoordinates(m.qwen36_27B, i));

  const toSvgPath = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '') + ' Z';
  };

  const handleExportJson = () => {
    const fileName = downloadReportAsJson();
    showToast({
      type: 'success',
      title: '벤치마크 데이터셋 다운로드 완료',
      description: `${fileName} 파일이 정상 저장되었습니다.`
    });
  };

  const activeBenchmark = BENCHMARKS.find((b) => b.metric === hoveredMetric) || null;

  return (
    <section 
      id="sec-benchmark" 
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
      role="region"
      aria-label="글리머 30B 벤치마크 분석 및 로컬 하드웨어 사양 연산기"
    >
      
      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide uppercase">
            <span>On-Device Engine & Performance Benchmark</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            뮤즈 글리머(Muse Glimmer) 30B 벤치마크 분석
          </h2>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-3xl">
            29.6B 파라미터의 Apache 2.0 오픈웨이트 모델. DFlash 블록 추측 해독(Speculative Decoding) 및 
            1.8B ViT-G/14 시각 인코더가 결합되어 오프라인 환경에서도 상용 LLM급 도구 조작 능력을 실현합니다.
          </p>
        </div>

        {/* View Mode Segmented Control & Download Action */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto no-print">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="group" aria-label="벤치마크 시각화 뷰 선택">
            <button
              onClick={() => setViewType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewType === 'bar' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={viewType === 'bar'}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>막대 차트</span>
            </button>
            <button
              onClick={() => setViewType('trend')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewType === 'trend' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={viewType === 'trend'}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              <span>버전별 추이</span>
            </button>
            <button
              onClick={() => setViewType('radar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewType === 'radar' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={viewType === 'radar'}
            >
              <Radar className="w-3.5 h-3.5" />
              <span>레이더</span>
            </button>
            <button
              onClick={() => setViewType('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewType === 'table' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={viewType === 'table'}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>상세 표</span>
            </button>
          </div>

          {/* Toggle Confidence Intervals & MoE Badges */}
          <button
            onClick={() => setShowConfidenceIntervals((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              showConfidenceIntervals
                ? 'bg-sky-50 text-sky-800 border-sky-300 shadow-2xs font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="온디바이스 95% 신뢰구간(CI) 및 오차범위(MoE) 뱃지/오차 밴드 표시 전환"
            aria-pressed={showConfidenceIntervals}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">95% 신뢰구간</span>
            <span className="sm:hidden">CI</span>
            <span className={`text-[10px] px-1 py-0.2 rounded font-mono font-bold ${
              showConfidenceIntervals ? 'bg-sky-200/80 text-sky-900' : 'bg-slate-200 text-slate-600'
            }`}>
              {showConfidenceIntervals ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 shadow-2xs"
            title="현재 벤치마크 및 연산 데이터를 JSON으로 다운로드"
            aria-label="벤치마크 데이터 JSON 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">JSON 다운로드</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer + Tech Specs Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Chart Viewport (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between relative">
          
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 text-xs">
            <span className="font-semibold text-slate-700">
              {viewType === 'trend'
                ? 'Glimmer 30B 버전별 성능 진화 트렌드 분석 (v0.5 ~ v2.5)'
                : '30B급 오픈웨이트 모델 3종 벤치마크 비교'}
            </span>
            {viewType === 'trend' ? (
              <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-mono font-semibold">
                <LineChartIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>시계열 Recharts 분석</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
                  <span className="text-[11px] font-bold text-slate-800">글리머 30B</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-400 inline-block" />
                  <span className="text-[11px] font-medium text-slate-600">젬마4 31B</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 inline-block" />
                  <span className="text-[11px] font-medium text-slate-600">큐웬3.6 27B</span>
                </div>
              </div>
            )}
          </div>

          {/* Performance Growth WoW Banner & Reliability Indicator */}
          <div className="mb-3.5 p-2.5 rounded-lg bg-emerald-50/90 border border-emerald-200/90 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-emerald-100 text-emerald-700">
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
              <div>
                <span className="font-bold text-emerald-950">Glimmer 30B 주간 성능 추이:</span>
                <span className="text-emerald-800 ml-1 text-[11px]">전주 대비 5대 핵심 벤치마크 전 항목 지속 상승</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div 
                className="flex items-center gap-1 font-mono text-[10px] font-semibold text-sky-900 bg-sky-100/90 px-2 py-0.5 rounded border border-sky-300 shadow-2xs select-none"
                title="온디바이스 베어메탈 환경에서 n=80~200회 반복 측정하여 양자화 및 추측 해독 지연 분산을 통제한 95% 신뢰구간"
              >
                <ShieldCheck className="w-3 h-3 text-sky-700 stroke-[2.2]" />
                <span>온디바이스 신뢰도: 95% CI (MoE ±0.9~±1.8 pt)</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-800 bg-white/90 px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                <TrendingUp className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                <span>평균 +4.2% WoW 성장</span>
                <span className="text-[10px] text-emerald-600 font-normal">(코딩 +6.9% ▲, 도구활용 +5.2% ▲)</span>
              </div>
              <button
                onClick={() => setViewType(viewType === 'trend' ? 'bar' : 'trend')}
                className={`flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded border shadow-2xs transition-colors ${
                  viewType === 'trend'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-700 hover:bg-blue-50 border-blue-200'
                }`}
                title="Glimmer 30B 버전별(v0.5~v2.5) Recharts 트렌드 분석 차트 보기"
              >
                <LineChartIcon className="w-3 h-3 stroke-[2.5]" />
                <span>{viewType === 'trend' ? '막대 차트로 복귀' : '버전별 진화 추이'}</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* BAR VIEW WITH INFORMATIVE TOOLTIPS & TREND INDICATORS */}
          {viewType === 'bar' && (
            <div className="space-y-3.5 py-1" role="region" aria-label="벤치마크 막대 그래프">
              {BENCHMARKS.map((b) => {
                const isHovered = hoveredMetric === b.metric;
                const max = 100;
                const deltaGemma = b.glimmer30B - b.gemma4_31B;
                const deltaQwen = b.glimmer30B - b.qwen36_27B;
                const wowDelta = b.glimmer30B - b.prevWeekGlimmer30B;
                const wowPct = ((wowDelta / b.prevWeekGlimmer30B) * 100).toFixed(1);

                return (
                  <div
                    key={b.metric}
                    onMouseEnter={() => setHoveredMetric(b.metric)}
                    onMouseLeave={() => setHoveredMetric(null)}
                    className={`p-2.5 rounded-xl transition-all relative cursor-pointer border ${
                      isHovered ? 'bg-blue-50/80 border-blue-300 shadow-xs' : 'border-transparent hover:bg-slate-100/70'
                    }`}
                    tabIndex={0}
                    onFocus={() => setHoveredMetric(b.metric)}
                    onBlur={() => setHoveredMetric(null)}
                    aria-label={`${b.metric}: 글리머 30B ${b.glimmer30B}점 (95% 신뢰구간 [${b.confidenceInterval[0]}~${b.confidenceInterval[1]}점], 오차범위 ±${b.marginOfError}점), 전주 대비 +${wowPct}%, 젬마4 ${b.gemma4_31B}점, 큐웬3.6 ${b.qwen36_27B}점`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5 flex-wrap gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900">{b.metric}</span>
                        <CategoryTooltipBadge category={b.category} />
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Confidence Interval / Margin of Error Badge */}
                        {showConfidenceIntervals && (
                          <ConfidenceIntervalBadge 
                            marginOfError={b.marginOfError} 
                            confidenceInterval={b.confidenceInterval}
                            confidenceLevel={b.confidenceLevel}
                            sampleSize={b.sampleSize}
                            compact={false}
                            showRange={true}
                          />
                        )}
                        {/* Visual Trend Indicator (Up/Down Arrow with Percentage) */}
                        <TrendBadge current={b.glimmer30B} previous={b.prevWeekGlimmer30B} />
                        <span className="font-mono text-xs text-blue-700 font-black tabular-nums">
                          글리머 {b.glimmer30B.toFixed(1)}점
                        </span>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded">
                          +{deltaGemma > 0 ? deltaGemma.toFixed(1) : '0'} vs 젬마
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {/* Glimmer 30B Bar with Inlined Trend Badge and CI error range */}
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-16 font-semibold text-slate-700 truncate">글리머 30B</span>
                        <div 
                          className="flex-1 bg-slate-200 h-3 rounded-xs overflow-hidden relative"
                          title={`95% 신뢰구간: ${b.confidenceInterval[0]}점 ~ ${b.confidenceInterval[1]}점 (오차범위 ±${b.marginOfError}점, n=${b.sampleSize}회 반복 평가)`}
                        >
                          <div
                            className="bg-blue-600 h-full rounded-xs transition-all duration-300"
                            style={{ width: `${(b.glimmer30B / max) * 100}%` }}
                          />
                          {/* Visual 95% Confidence Interval error band overlay with boundary whiskers */}
                          {showConfidenceIntervals && (
                            <div
                              className="absolute top-0 bottom-0 bg-sky-300/40 border-l border-r border-sky-800/90 pointer-events-none transition-all duration-300"
                              style={{
                                left: `${(b.confidenceInterval[0] / max) * 100}%`,
                                width: `${((b.confidenceInterval[1] - b.confidenceInterval[0]) / max) * 100}%`,
                              }}
                            />
                          )}
                        </div>
                        <div className="min-w-28 text-right flex items-center justify-end gap-1 shrink-0">
                          <span className="font-mono text-blue-700 font-extrabold tabular-nums">
                            {b.glimmer30B}
                          </span>
                          {showConfidenceIntervals && (
                            <span 
                              className="inline-flex items-center text-[9px] font-mono font-bold text-sky-700 bg-sky-100/90 px-1 py-0.2 rounded border border-sky-300/80 cursor-help"
                              title={`95% 신뢰구간 오차범위 ±${b.marginOfError}점 [${b.confidenceInterval[0]}~${b.confidenceInterval[1]}]`}
                            >
                              ±{b.marginOfError}
                            </span>
                          )}
                          <span className="inline-flex items-center text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200/60" title={`전주 ${b.prevWeekGlimmer30B}점 대비 주간 성장`}>
                            <TrendingUp className="w-2.5 h-2.5 stroke-[2.5]" />
                            +{wowPct}%
                          </span>
                        </div>
                      </div>

                      {/* Gemma 4 31B Bar */}
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-16 text-slate-500 truncate">젬마4 31B</span>
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-xs overflow-hidden">
                          <div
                            className="bg-slate-400 h-full rounded-xs transition-all duration-300"
                            style={{ width: `${(b.gemma4_31B / max) * 100}%` }}
                          />
                        </div>
                        <span className="min-w-28 text-right font-mono text-slate-500 tabular-nums">
                          {b.gemma4_31B}
                        </span>
                      </div>

                      {/* Qwen 3.6 27B Bar */}
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-16 text-slate-500 truncate">큐웬 3.6</span>
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-xs overflow-hidden">
                          <div
                            className="bg-indigo-400 h-full rounded-xs transition-all duration-300"
                            style={{ width: `${(b.qwen36_27B / max) * 100}%` }}
                          />
                        </div>
                        <span className="min-w-28 text-right font-mono text-slate-500 tabular-nums">
                          {b.qwen36_27B}
                        </span>
                      </div>
                    </div>

                    {/* Rich Interactive Tooltip Overlay when hovered */}
                    {isHovered && (
                      <div 
                        className="mt-2.5 p-3 rounded-lg bg-slate-900 text-slate-200 text-xs shadow-xl border border-slate-700 animate-in fade-in duration-150 space-y-2"
                        role="tooltip"
                      >
                        <div className="flex items-center justify-between text-[11px] text-blue-400 font-semibold border-b border-slate-800 pb-1">
                          <span className="flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" />
                            <span>상세 성능 메트릭 분석: {b.metric}</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sky-300 font-mono text-[10px] bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">
                              95% CI: [{b.confidenceInterval[0]}~{b.confidenceInterval[1]}점]
                            </span>
                            <span className="text-emerald-400 font-bold">1위: 글리머 30B ({b.glimmer30B}점)</span>
                          </div>
                        </div>

                        {/* Weekly Growth Trend Box in Tooltip */}
                        <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-700/80 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                            <span>전주 벤치마크 대비 성능 성장 (WoW):</span>
                          </div>
                          <div className="font-mono text-emerald-300 font-bold">
                            전주 {b.prevWeekGlimmer30B}점 → 현재 {b.glimmer30B}점 <span className="text-emerald-400 font-black">(▲ +{wowDelta.toFixed(1)}점, +{wowPct}% 성장)</span>
                          </div>
                        </div>

                        {/* On-Device Statistical Reliability Box in Tooltip */}
                        <div className="p-2 rounded-lg bg-sky-950/70 border border-sky-800/80 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-sky-300 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 stroke-[2.5]" />
                              <span>온디바이스 평가 신뢰구간 & 오차범위 (On-Device Reliability):</span>
                            </div>
                            <span className="text-[10px] text-sky-200 font-mono bg-sky-900/60 px-1.5 py-0.2 rounded border border-sky-700">
                              신뢰수준 {b.confidenceLevel}% (MoE ±{b.marginOfError}점)
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                            <div className="bg-slate-800/90 p-1.5 rounded border border-slate-700">
                              <span className="text-slate-400 block text-[9px]">95% 신뢰구간 (Confidence Interval):</span>
                              <span className="text-sky-300 font-bold text-xs">{b.confidenceInterval[0].toFixed(1)}점 ~ {b.confidenceInterval[1].toFixed(1)}점</span>
                            </div>
                            <div className="bg-slate-800/90 p-1.5 rounded border border-slate-700">
                              <span className="text-slate-400 block text-[9px]">표본 오차범위 (Margin of Error):</span>
                              <span className="text-sky-300 font-bold text-xs">±{b.marginOfError.toFixed(1)}점 (SE ±{b.standardError ?? (b.marginOfError / 1.96).toFixed(2)})</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-300 pt-0.5">
                            <span>측정 환경: {b.evalHardware}</span>
                            <span className="text-sky-300 font-semibold">반복 측정 표본 n={b.sampleSize}회</span>
                          </div>
                        </div>

                        {/* Category Definition Box in Hover Tooltip */}
                        {CATEGORY_DEFINITIONS[b.category] && (
                          <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700/80 text-[11px] space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_DEFINITIONS[b.category].color }} />
                                <span>평가 카테고리 정의: <strong className="text-sky-300">{CATEGORY_DEFINITIONS[b.category].nameKr}</strong></span>
                              </div>
                              <span className="text-[9px] font-mono text-slate-400 bg-slate-700/60 px-1.5 py-0.2 rounded">
                                {b.category}
                              </span>
                            </div>
                            <div className="text-[10.5px] text-slate-200 font-medium pl-3 border-l-2" style={{ borderColor: CATEGORY_DEFINITIONS[b.category].color }}>
                              {CATEGORY_DEFINITIONS[b.category].shortDesc}
                            </div>
                            <div className="text-[9.5px] text-slate-400 pl-3">
                              {CATEGORY_DEFINITIONS[b.category].detailedDesc}
                            </div>
                          </div>
                        )}

                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {b.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 pt-0.5 text-[10px] font-mono">
                          <div className="p-1 rounded bg-slate-800/80 text-slate-300">
                            vs 젬마4 31B: <span className="text-emerald-400 font-bold">+{deltaGemma.toFixed(1)}점</span> ({((deltaGemma / b.gemma4_31B) * 100).toFixed(1)}% 우위)
                          </div>
                          <div className="p-1 rounded bg-slate-800/80 text-slate-300">
                            vs 큐웬3.6 27B: <span className="text-indigo-400 font-bold">+{deltaQwen.toFixed(1)}점</span> ({((deltaQwen / b.qwen36_27B) * 100).toFixed(1)}% 우위)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* RECHARTS TREND ANALYSIS VIEW: Glimmer 30B Performance Across Model Versions */}
          {viewType === 'trend' && (
            <div className="space-y-4 py-1 animate-in fade-in duration-150" role="region" aria-label="Glimmer 30B 버전별 성능 추이 분석 차트">
              
              {/* Metric filter buttons and controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200/80">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-700 shrink-0">분석 지표:</span>
                  {[
                    { id: 'all', label: '5대 지표 전체', category: null },
                    { id: 'average', label: '종합 평균', category: null },
                    { id: 'mcpAtlas', label: '도구 활용 (MCP)', category: 'Tool Use' },
                    { id: 'deepSearchQa', label: '심층 추론', category: 'Reasoning' },
                    { id: 'sweBenchPro', label: '실전 코딩', category: 'Coding' },
                    { id: 'osWorld', label: 'OS 제어', category: 'OS Control' },
                    { id: 'aime2026', label: '수학 (AIME)', category: 'Math' },
                    { id: 'tokSpeed', label: '생성 속도 (tok/s)', category: null },
                  ].map((tab) => {
                    const catDef = tab.category ? CATEGORY_DEFINITIONS[tab.category] : null;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setTrendMetric(tab.id as any)}
                        title={catDef ? `${catDef.nameKr}: ${catDef.shortDesc}` : undefined}
                        className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                          trendMetric === tab.id
                            ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {trendMetric !== 'tokSpeed' && (
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showBaselinesInTrend}
                        onChange={(e) => setShowBaselinesInTrend(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-0 w-3 h-3 cursor-pointer"
                      />
                      <span>경쟁 모델 기준선 (Gemma/Qwen)</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Recharts Chart Area */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 flex-wrap gap-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>
                      {trendMetric === 'all' && '5대 핵심 벤치마크 버전별 점수 추이 (v0.5 ~ v2.5)'}
                      {trendMetric === 'average' && 'Glimmer 30B 5대 벤치마크 종합 평균 성장 곡선'}
                      {trendMetric === 'mcpAtlas' && 'MCP Atlas (도구 활용 및 API 오케스트레이션) 진화'}
                      {trendMetric === 'deepSearchQa' && 'DeepSearch QA (다단계 웹 탐색 및 심층 추론) 진화'}
                      {trendMetric === 'sweBenchPro' && 'SWE-Bench Pro (실제 소프트웨어 공학 코딩) 진화'}
                      {trendMetric === 'osWorld' && 'OSWorld (운영체제 및 데스크톱 UI 자율 제어) 진화'}
                      {trendMetric === 'aime2026' && 'AIME 2026 (고난도 수학 및 논리적 연역 추론) 진화'}
                      {trendMetric === 'tokSpeed' && 'RTX 5090 기준 초당 생성 토큰 수 (tok/s) 진화'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span>Apache 2.0 Open Weights</span>
                    <span>·</span>
                    <span>n=60~150회 온디바이스 반복 평가</span>
                  </div>
                </div>

                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {trendMetric === 'average' ? (
                      <ComposedChart data={GLIMMER_VERSION_TRENDS} margin={{ top: 12, right: 16, left: -14, bottom: 4 }}>
                        <defs>
                          <linearGradient id="colorAvgGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="shortVersion" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                        <YAxis domain={[40, 80]} tick={{ fill: '#64748B', fontSize: 10 }} />
                        <RechartsTooltip content={<CustomTrendTooltip />} />
                        <RechartsLegend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                        <Area type="monotone" dataKey="averageScore" stroke="#2563EB" fill="url(#colorAvgGrad)" />
                        <Line
                          type="monotone"
                          dataKey="averageScore"
                          name="Glimmer 30B 종합 평균"
                          stroke="#2563EB"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                          activeDot={{ r: 7, fill: '#1D4ED8' }}
                        />
                        {showBaselinesInTrend && (
                          <>
                            <ReferenceLine
                              y={61.4}
                              stroke="#94A3B8"
                              strokeDasharray="4 4"
                              label={{ value: '젬마4 31B 평균 (61.4)', position: 'insideTopLeft', fill: '#64748B', fontSize: 10 }}
                            />
                            <ReferenceLine
                              y={68.7}
                              stroke="#6366F1"
                              strokeDasharray="4 4"
                              label={{ value: '큐웬3.6 27B 평균 (68.7)', position: 'insideBottomLeft', fill: '#4F46E5', fontSize: 10 }}
                            />
                          </>
                        )}
                      </ComposedChart>
                    ) : trendMetric === 'tokSpeed' ? (
                      <ComposedChart data={GLIMMER_VERSION_TRENDS} margin={{ top: 12, right: 16, left: -14, bottom: 4 }}>
                        <defs>
                          <linearGradient id="colorSpeedGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.03} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="shortVersion" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                        <YAxis domain={[0, 260]} tick={{ fill: '#64748B', fontSize: 10 }} />
                        <RechartsTooltip content={<CustomTrendTooltip />} />
                        <RechartsLegend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                        <Area type="monotone" dataKey="tokPerSecRtx5090" stroke="#059669" fill="url(#colorSpeedGrad)" />
                        <Line
                          type="monotone"
                          dataKey="tokPerSecRtx5090"
                          name="RTX 5090 생성 속도 (tok/s)"
                          stroke="#059669"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
                          activeDot={{ r: 7, fill: '#047857' }}
                        />
                        <ReferenceLine
                          y={62.8}
                          stroke="#94A3B8"
                          strokeDasharray="4 4"
                          label={{ value: '표준 Autoregressive 한계 (62.8 tok/s)', position: 'insideTopLeft', fill: '#64748B', fontSize: 10 }}
                        />
                        <ReferenceLine
                          x="v1.5"
                          stroke="#2563EB"
                          strokeDasharray="3 3"
                          label={{ value: 'DFlash 추측 해독 도입 (+194% 속도 점프)', position: 'top', fill: '#2563EB', fontSize: 10 }}
                        />
                      </ComposedChart>
                    ) : trendMetric === 'all' ? (
                      <LineChart data={GLIMMER_VERSION_TRENDS} margin={{ top: 12, right: 16, left: -14, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="shortVersion" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                        <YAxis domain={[20, 100]} tick={{ fill: '#64748B', fontSize: 10 }} />
                        <RechartsTooltip content={<CustomTrendTooltip />} />
                        <RechartsLegend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                        <Line
                          type="monotone"
                          dataKey="mcpAtlas"
                          name="MCP Atlas (도구)"
                          stroke="#059669"
                          strokeWidth={2.2}
                          dot={{ r: 3.5, fill: '#059669', stroke: '#fff', strokeWidth: 1.5 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="deepSearchQa"
                          name="DeepSearch QA (추론)"
                          stroke="#0284C7"
                          strokeWidth={2.2}
                          dot={{ r: 3.5, fill: '#0284C7', stroke: '#fff', strokeWidth: 1.5 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sweBenchPro"
                          name="SWE-Bench (코딩)"
                          stroke="#D97706"
                          strokeWidth={2.2}
                          dot={{ r: 3.5, fill: '#D97706', stroke: '#fff', strokeWidth: 1.5 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="osWorld"
                          name="OSWorld (OS 제어)"
                          stroke="#7C3AED"
                          strokeWidth={2.2}
                          dot={{ r: 3.5, fill: '#7C3AED', stroke: '#fff', strokeWidth: 1.5 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="aime2026"
                          name="AIME 2026 (수학)"
                          stroke="#E11D48"
                          strokeWidth={2.2}
                          dot={{ r: 3.5, fill: '#E11D48', stroke: '#fff', strokeWidth: 1.5 }}
                          activeDot={{ r: 6 }}
                        />
                        {showBaselinesInTrend && (
                          <>
                            <ReferenceLine
                              y={61.4}
                              stroke="#94A3B8"
                              strokeDasharray="4 4"
                              label={{ value: '젬마4 31B 기준선 (61.4점)', position: 'insideTopLeft', fill: '#64748B', fontSize: 10 }}
                            />
                            <ReferenceLine
                              y={68.7}
                              stroke="#6366F1"
                              strokeDasharray="4 4"
                              label={{ value: '큐웬3.6 27B 기준선 (68.7점)', position: 'insideBottomLeft', fill: '#4F46E5', fontSize: 10 }}
                            />
                          </>
                        )}
                      </LineChart>
                    ) : (
                      <LineChart data={GLIMMER_VERSION_TRENDS} margin={{ top: 12, right: 16, left: -14, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="shortVersion" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                        <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748B', fontSize: 10 }} />
                        <RechartsTooltip content={<CustomTrendTooltip />} />
                        <RechartsLegend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                        <Line
                          type="monotone"
                          dataKey={trendMetric}
                          name={`Glimmer 30B: ${trendMetric}`}
                          stroke="#2563EB"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Version Evolution Milestones Timeline Cards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-blue-600" />
                    <span>버전별 주요 마일스톤 및 기술적 진화 단계</span>
                  </span>
                  <span className="text-[10px] text-slate-500">버전 카드를 클릭하여 상세 분석 확인</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {GLIMMER_VERSION_TRENDS.map((v) => {
                    const isSelected = selectedVersionMilestone === v.shortVersion;
                    const prevV = GLIMMER_VERSION_TRENDS.find((_, idx, arr) => arr[idx + 1]?.shortVersion === v.shortVersion);
                    const delta = prevV ? v.averageScore - prevV.averageScore : 0;
                    return (
                      <button
                        key={v.shortVersion}
                        onClick={() => setSelectedVersionMilestone(v.shortVersion)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/90 border-blue-400 shadow-xs ring-1 ring-blue-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="font-bold text-slate-900 font-mono">{v.shortVersion}</span>
                          <span className="text-slate-500 font-mono text-[9px]">{v.releaseDate}</span>
                        </div>
                        <div className="font-mono text-xs font-black text-blue-700">
                          {v.averageScore.toFixed(1)}점
                          {delta > 0 && (
                            <span className="text-[9px] font-bold text-emerald-600 ml-1">+{delta.toFixed(1)}</span>
                          )}
                        </div>
                        <div className="text-[10px] font-medium text-slate-600 mt-1 line-clamp-1" title={v.milestoneTitle}>
                          {v.milestoneTitle}
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                          <span className="text-emerald-700 font-semibold">{v.tokPerSecRtx5090} tok/s</span>
                          <span>±{v.marginOfError} MoE</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Version Detail Card */}
                {(() => {
                  const currentSel = GLIMMER_VERSION_TRENDS.find(v => v.shortVersion === selectedVersionMilestone) || GLIMMER_VERSION_TRENDS[4];
                  return (
                    <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs border border-slate-700 shadow-sm space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-400 text-sm">{currentSel.version}</span>
                          <span className="text-slate-400 font-mono text-[10px]">릴리스: {currentSel.releaseDate}</span>
                          <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                            종합 평균 {currentSel.averageScore.toFixed(1)}점
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-sky-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                          <span>95% CI 오차범위 ±{currentSel.marginOfError}점 (n={currentSel.sampleSize}회)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <div className="text-slate-400 text-[10px] font-semibold">핵심 마일스톤 혁신:</div>
                          <div className="text-slate-200 font-medium mt-0.5">{currentSel.milestoneTitle}</div>
                          <div className="text-slate-400 text-[10px] mt-0.5 leading-relaxed">{currentSel.milestoneDescription}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-400 text-[10px] font-semibold">아키텍처 및 하드웨어 사양:</div>
                          <div className="p-1.5 rounded bg-slate-800/80 border border-slate-700 font-mono text-[10px] text-blue-300">
                            {currentSel.architectureHighlight}
                          </div>
                          <div className="flex items-center justify-between text-[10px] pt-0.5 font-mono">
                            <span className="text-slate-400">RTX 5090 생성 속도:</span>
                            <span className="text-emerald-400 font-bold">{currentSel.tokPerSecRtx5090} tok/s</span>
                          </div>
                        </div>
                      </div>

                      {/* 5 Metrics Badge Row */}
                      <div className="grid grid-cols-5 gap-1.5 pt-1.5 border-t border-slate-800 text-center font-mono text-[10px]">
                        <div className="p-1 rounded bg-slate-800 text-slate-300">
                          <div className="text-[9px] text-slate-400">MCP Atlas</div>
                          <div className="font-bold text-emerald-400">{currentSel.mcpAtlas}점</div>
                        </div>
                        <div className="p-1 rounded bg-slate-800 text-slate-300">
                          <div className="text-[9px] text-slate-400">DeepSearch</div>
                          <div className="font-bold text-sky-400">{currentSel.deepSearchQa}점</div>
                        </div>
                        <div className="p-1 rounded bg-slate-800 text-slate-300">
                          <div className="text-[9px] text-slate-400">SWE-Bench</div>
                          <div className="font-bold text-amber-400">{currentSel.sweBenchPro}점</div>
                        </div>
                        <div className="p-1 rounded bg-slate-800 text-slate-300">
                          <div className="text-[9px] text-slate-400">OSWorld</div>
                          <div className="font-bold text-purple-400">{currentSel.osWorld}점</div>
                        </div>
                        <div className="p-1 rounded bg-slate-800 text-slate-300">
                          <div className="text-[9px] text-slate-400">AIME 2026</div>
                          <div className="font-bold text-rose-400">{currentSel.aime2026}점</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Cumulative Growth Summary Strip */}
              <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-950">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>누적 진화 성과 요약 (v0.5 → v2.5):</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-white font-bold text-blue-800 border border-blue-200 shadow-2xs">
                    종합 평균 +24.1점 (+49.9% 성장)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white font-bold text-amber-800 border border-amber-200 shadow-2xs">
                    SWE-Bench 코딩 +79.6% 폭발적 개선
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white font-bold text-emerald-800 border border-emerald-200 shadow-2xs">
                    DFlash 4.5배 속도 혁신 (233.4 tok/s)
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* RADAR VIEW WITH INTERACTIVE VERTEX TOOLTIPS */}
          {viewType === 'radar' && (
            <div className="py-2 flex flex-col items-center relative" role="region" aria-label="벤치마크 레이더 차트">
              <svg viewBox="0 0 360 320" className="w-full max-w-[380px] h-auto overflow-visible">
                {/* Background circles */}
                {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                  <circle
                    key={i}
                    cx={radarCenter.x}
                    cy={radarCenter.y}
                    r={radarRadius * scale}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray={scale === 1 ? 'none' : '3 3'}
                  />
                ))}

                {/* Axes */}
                {radarMetrics.map((_, i) => {
                  const end = getCoordinates(100, i);
                  return (
                    <line
                      key={i}
                      x1={radarCenter.x}
                      y1={radarCenter.y}
                      x2={end.x}
                      y2={end.y}
                      stroke="#CBD5E1"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Polygons */}
                <path
                  d={toSvgPath(gemmaPoints)}
                  fill="rgba(148, 163, 184, 0.2)"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                />
                <path
                  d={toSvgPath(qwenPoints)}
                  fill="rgba(99, 102, 241, 0.2)"
                  stroke="#6366F1"
                  strokeWidth="1.5"
                />
                <path
                  d={toSvgPath(glimmerPoints)}
                  fill="rgba(37, 99, 235, 0.3)"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />

                {/* Interactive Vertex Nodes for Glimmer 30B */}
                {glimmerPoints.map((pt, i) => {
                  const m = radarMetrics[i];
                  const isHovered = hoveredMetric === m.metric;
                  return (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : 4}
                        fill="#2563EB"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredMetric(m.metric)}
                        onMouseLeave={() => setHoveredMetric(null)}
                      />
                    </g>
                  );
                })}

                {/* Label Points */}
                {radarMetrics.map((m, i) => {
                  const labelCoord = getCoordinates(120, i);
                  const isHovered = hoveredMetric === m.metric;
                  return (
                    <text
                      key={i}
                      x={labelCoord.x}
                      y={labelCoord.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[10px] cursor-pointer transition-colors ${
                        isHovered ? 'fill-blue-700 font-bold' : 'fill-slate-700 font-semibold'
                      }`}
                      onMouseEnter={() => setHoveredMetric(m.metric)}
                      onMouseLeave={() => setHoveredMetric(null)}
                    >
                      {m.category}
                    </text>
                  );
                })}
              </svg>

              {/* Floating Radar Tooltip */}
              {activeBenchmark ? (
                <div 
                  className="w-full max-w-sm mt-3 p-3 rounded-xl bg-slate-900 text-slate-200 text-xs shadow-lg border border-slate-700 space-y-2"
                  role="tooltip"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="font-bold text-blue-400">{activeBenchmark.metric}</span>
                    <CategoryTooltipBadge category={activeBenchmark.category} compact={true} />
                  </div>

                  {/* Category Definition in Radar Tooltip */}
                  {CATEGORY_DEFINITIONS[activeBenchmark.category] && (
                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[10px] space-y-0.5">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_DEFINITIONS[activeBenchmark.category].color }} />
                          {CATEGORY_DEFINITIONS[activeBenchmark.category].nameKr}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">카테고리 정의</span>
                      </div>
                      <div className="text-slate-200 text-[10px] leading-relaxed">
                        {CATEGORY_DEFINITIONS[activeBenchmark.category].shortDesc}
                      </div>
                    </div>
                  )}

                  {/* Trend Indicator in Radar Tooltip */}
                  <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/80 text-[10px] flex items-center justify-between">
                    <span className="text-emerald-300 flex items-center gap-1 font-semibold">
                      <TrendingUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                      전주 대비 주간 성장 추이(WoW):
                    </span>
                    <span className="font-mono text-emerald-300 font-bold">
                      {activeBenchmark.prevWeekGlimmer30B}점 → {activeBenchmark.glimmer30B}점 <span className="text-emerald-400 font-black">(▲ +{(((activeBenchmark.glimmer30B - activeBenchmark.prevWeekGlimmer30B) / activeBenchmark.prevWeekGlimmer30B) * 100).toFixed(1)}%)</span>
                    </span>
                  </div>

                  {/* Confidence Interval & Margin of Error in Radar Tooltip */}
                  <div className="p-1.5 rounded-lg bg-sky-950/70 border border-sky-700/80 text-[10px] flex items-center justify-between">
                    <span className="text-sky-300 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-sky-400 stroke-[2.2]" />
                      온디바이스 95% 신뢰구간 (MoE):
                    </span>
                    <span className="font-mono text-sky-300 font-bold">
                      ±{activeBenchmark.marginOfError.toFixed(1)}점 <span className="text-sky-400 font-normal">([{activeBenchmark.confidenceInterval[0].toFixed(1)} ~ {activeBenchmark.confidenceInterval[1].toFixed(1)}점], n={activeBenchmark.sampleSize}회)</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-0.5 font-mono text-[11px] text-center">
                    <div className="p-1 rounded bg-blue-900/40 text-blue-300 border border-blue-700">
                      글리머: <span className="font-bold">{activeBenchmark.glimmer30B}</span>
                    </div>
                    <div className="p-1 rounded bg-slate-800 text-slate-300">
                      젬마4: <span>{activeBenchmark.gemma4_31B}</span>
                    </div>
                    <div className="p-1 rounded bg-indigo-900/30 text-indigo-300">
                      큐웬3.6: <span>{activeBenchmark.qwen36_27B}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 pt-0.5 truncate">
                    {activeBenchmark.description}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 text-center mt-2">
                  레이더 차트의 파란색 노드나 축 레이블 위에 마우스를 올리면 정확한 지표 비교값, 95% 신뢰구간 및 주간 성장률이 표시됩니다.
                </p>
              )}
            </div>
          )}

          {/* TABLE VIEW */}
          {viewType === 'table' && (
            <div className="overflow-x-auto py-2">
              <table className="w-full text-left text-xs border-collapse" aria-label="30B급 오픈웨이트 모델 벤치마크 점수표">
                <caption className="sr-only">글리머 30B, 젬마 4 31B, 큐웬 3.6 27B 모델 간 5개 벤치마크 항목별 점수, 온디바이스 95% 신뢰구간 및 오차범위, 전주 대비 성장률 비교</caption>
                <thead>
                  <tr className="border-b border-slate-200 text-slate-700 font-semibold bg-slate-100/60">
                    <th scope="col" className="p-2">벤치마크 항목</th>
                    <th scope="col" className="p-2 text-right text-blue-700 font-bold">글리머 30B (현재)</th>
                    <th scope="col" className="p-2 text-center text-sky-700 font-bold">온디바이스 신뢰구간 (95% CI / MoE)</th>
                    <th scope="col" className="p-2 text-right text-emerald-700 font-bold">전주 대비 추이 (WoW)</th>
                    <th scope="col" className="p-2 text-right">젬마4 31B</th>
                    <th scope="col" className="p-2 text-right">큐웬3.6 27B</th>
                    <th scope="col" className="p-2 text-right">격차 vs 젬마</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {BENCHMARKS.map((b) => {
                    const delta = b.glimmer30B - b.gemma4_31B;
                    return (
                      <tr key={b.metric} className="hover:bg-blue-50/30">
                        <th scope="row" className="p-2 font-medium text-slate-800">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>{b.metric}</span>
                            <CategoryTooltipBadge category={b.category} compact={true} />
                          </div>
                          <div className="text-[10px] text-slate-500 font-normal mt-0.5">{b.evalHardware}</div>
                        </th>
                        <td className="p-2 text-right font-mono font-bold text-blue-700 tabular-nums">
                          <div className="flex items-center justify-end gap-1.5">
                            <span>{b.glimmer30B.toFixed(1)}점</span>
                            <ConfidenceIntervalBadge
                              marginOfError={b.marginOfError}
                              confidenceInterval={b.confidenceInterval}
                              confidenceLevel={b.confidenceLevel}
                              sampleSize={b.sampleSize}
                              compact={true}
                            />
                          </div>
                        </td>
                        <td className="p-2 text-center font-mono tabular-nums">
                          <span 
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-300/80 text-[10px] shadow-2xs"
                            title={`표준오차 SE ±${b.standardError ?? (b.marginOfError / 1.96).toFixed(2)}, 오차범위 ±${b.marginOfError}점`}
                          >
                            <ShieldCheck className="w-3 h-3 text-sky-600 stroke-[2.2]" />
                            <span className="font-bold">[{b.confidenceInterval[0].toFixed(1)} ~ {b.confidenceInterval[1].toFixed(1)}]</span>
                            <span className="text-slate-500 font-medium">n={b.sampleSize}</span>
                          </span>
                        </td>
                        <td className="p-2 text-right font-mono tabular-nums">
                          <TrendBadge current={b.glimmer30B} previous={b.prevWeekGlimmer30B} showPrev={true} />
                        </td>
                        <td className="p-2 text-right font-mono text-slate-600 tabular-nums">
                          {b.gemma4_31B.toFixed(1)}점
                        </td>
                        <td className="p-2 text-right font-mono text-slate-600 tabular-nums">
                          {b.qwen36_27B.toFixed(1)}점
                        </td>
                        <td className="p-2 text-right font-mono text-emerald-600 font-semibold tabular-nums">
                          +{delta.toFixed(1)}점
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>라이선스: Apache 2.0 (상업적 이용 완전 무료)</span>
            <span className="font-mono text-[11px] font-semibold text-slate-700">DFlash Block-Speculative Decoding 탑재</span>
          </div>

        </div>

        {/* Dynamic Hardware Performance & VRAM Calculator (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wide">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>하드웨어 스펙 & VRAM 계산기</span>
            </div>
            <p className="text-xs text-slate-500">
              보유 중인 GPU 및 양자화 방식을 선택하여 로컬 실행 가능 여부와 초당 토큰 생성 속도를 계산하세요.
            </p>
          </div>

          {/* GPU Selector */}
          <div className="space-y-1.5">
            <label htmlFor="gpu-select" className="text-xs font-semibold text-slate-700">하드웨어 플랫폼 선택:</label>
            <select
              id="gpu-select"
              value={selectedGpuId}
              onChange={(e) => setSelectedGpuId(e.target.value)}
              className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {HARDWARE_PRESETS.map((gpu) => (
                <option key={gpu.id} value={gpu.id}>
                  {gpu.name} ({gpu.vramGb}GB VRAM) - {gpu.description}
                </option>
              ))}
            </select>
          </div>

          {/* Quantization Mode Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">양자화 정밀도(Quantization):</span>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="양자화 정밀도 선택">
              {(['4bit', '8bit', 'fp16'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuantization(q)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    quantization === q
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  aria-pressed={quantization === q}
                >
                  {q === '4bit' ? 'INT4 (17.2GB)' : q === '8bit' ? 'INT8 (31.4GB)' : 'FP16 (60.5GB)'}
                </button>
              ))}
            </div>
          </div>

          {/* DFlash Speculative Decoding Toggle */}
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800">DFlash 블록 추측 해독 활성화</span>
              <p className="text-[11px] text-slate-500">초당 생성 속도를 약 1.85배 부스팅합니다.</p>
            </div>
            <button
              onClick={() => setDflashEnabled(!dflashEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                dflashEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
              aria-label="DFlash 추측 해독 토글"
              aria-pressed={dflashEnabled}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  dflashEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Calculated Output Stats */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs text-slate-600">필요 VRAM vs 탑재 VRAM:</span>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="font-bold text-slate-900">{requiredVram}GB</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-600">{selectedGpu.vramGb}GB</span>
              </div>
            </div>

            {/* VRAM Sufficiency Banner */}
            <div
              className={`p-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold ${
                isVramSufficient
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {isVramSufficient ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>로컬 메모리 적재 가능 (잔여 여유 {vramMargin.toFixed(1)}GB)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>VRAM 부족 ({Math.abs(vramMargin).toFixed(1)}GB 초과). INT4로 양자화 권장</span>
                </>
              )}
            </div>

            {/* Speed Output */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600">예상 추론 속도:</span>
              <div className="text-right">
                <span className="text-xl font-black font-mono text-blue-600 tracking-tight tabular-nums">
                  {isVramSufficient ? calculatedSpeed : 0}
                </span>
                <span className="text-xs text-slate-500 ml-1">tok/s</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
