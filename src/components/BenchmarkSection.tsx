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
  Award
} from 'lucide-react';
import { BENCHMARKS, HARDWARE_PRESETS } from '../data/reportData';
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

export const BenchmarkSection: React.FC = () => {
  const { showToast } = useToast();
  const [viewType, setViewType] = useState<'bar' | 'radar' | 'table'>('bar');
  const [selectedGpuId, setSelectedGpuId] = useState<string>('rtx5090');
  const [quantization, setQuantization] = useState<'4bit' | '8bit' | 'fp16'>('4bit');
  const [dflashEnabled, setDflashEnabled] = useState<boolean>(true);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

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
            <span className="font-semibold text-slate-700">30B급 오픈웨이트 모델 3종 벤치마크 비교</span>
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
          </div>

          {/* Performance Growth WoW Banner */}
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
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-800 bg-white/90 px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
              <TrendingUp className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
              <span>평균 +4.2% WoW 성장</span>
              <span className="text-[10px] text-emerald-600 font-normal">(코딩 +6.9% ▲, 도구활용 +5.2% ▲)</span>
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
                    aria-label={`${b.metric}: 글리머 30B ${b.glimmer30B}점, 전주 대비 +${wowPct}%, 젬마4 ${b.gemma4_31B}점, 큐웬3.6 ${b.qwen36_27B}점`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{b.metric}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 font-medium">
                          {b.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
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
                      {/* Glimmer 30B Bar with Inlined Trend Badge */}
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-16 font-semibold text-slate-700 truncate">글리머 30B</span>
                        <div className="flex-1 bg-slate-200 h-3 rounded-xs overflow-hidden relative">
                          <div
                            className="bg-blue-600 h-full rounded-xs transition-all duration-300"
                            style={{ width: `${(b.glimmer30B / max) * 100}%` }}
                          />
                        </div>
                        <div className="w-24 text-right flex items-center justify-end gap-1">
                          <span className="font-mono text-blue-700 font-extrabold tabular-nums">
                            {b.glimmer30B}
                          </span>
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
                        <span className="w-24 text-right font-mono text-slate-500 tabular-nums">
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
                        <span className="w-24 text-right font-mono text-slate-500 tabular-nums">
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
                          <span className="text-emerald-400 font-bold">1위: 글리머 30B ({b.glimmer30B}점)</span>
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
                    <span className="text-[10px] text-slate-400 font-mono">카테고리: {activeBenchmark.category}</span>
                  </div>

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
                  레이더 차트의 파란색 노드나 축 레이블 위에 마우스를 올리면 정확한 지표 비교값 및 주간 성장률이 표시됩니다.
                </p>
              )}
            </div>
          )}

          {/* TABLE VIEW */}
          {viewType === 'table' && (
            <div className="overflow-x-auto py-2">
              <table className="w-full text-left text-xs border-collapse" aria-label="30B급 오픈웨이트 모델 벤치마크 점수표">
                <caption className="sr-only">글리머 30B, 젬마 4 31B, 큐웬 3.6 27B 모델 간 5개 벤치마크 항목별 점수 및 전주 대비 성장률 비교</caption>
                <thead>
                  <tr className="border-b border-slate-200 text-slate-700 font-semibold bg-slate-100/60">
                    <th scope="col" className="p-2">벤치마크 항목</th>
                    <th scope="col" className="p-2 text-right text-blue-700 font-bold">글리머 30B (현재)</th>
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
                        <th scope="row" className="p-2 font-medium text-slate-800">{b.metric}</th>
                        <td className="p-2 text-right font-mono font-bold text-blue-700 tabular-nums">
                          {b.glimmer30B.toFixed(1)}점
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
