import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Calculator, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Cpu, 
  CloudOff, 
  Cloud,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { PRICING_PLANS } from '../data/reportData';

export const PricingCalculator: React.FC = () => {
  const [tasksPerMonth, setTasksPerMonth] = useState<number>(80);
  const [taskComplexity, setTaskComplexity] = useState<'simple' | 'medium' | 'high'>('medium');
  const [hourlyWage, setHourlyWage] = useState<number>(25);
  const [hoveredPeriod, setHoveredPeriod] = useState<number | null>(null);

  // Complexity token usage multiplier (tokens per task)
  const tokensPerTask = {
    simple: 250_000,   // simple emails, basic queries
    medium: 900_000,   // multi-site shopping comparison, form filling
    high: 2_800_000,   // long async price monitoring, multi-step orchestration
  }[taskComplexity];

  // Hours saved per task
  const hoursSavedPerTask = {
    simple: 0.3, // 18 mins
    medium: 0.75, // 45 mins
    high: 2.2, // 132 mins
  }[taskComplexity];

  const totalMonthlyTokens = tasksPerMonth * tokensPerTask;
  const totalHoursSaved = Math.round(tasksPerMonth * hoursSavedPerTask);
  const totalValueSaved = Math.round(totalHoursSaved * hourlyWage);

  // Determine recommended plan
  let recommendedPlanId = 'free';
  if (totalMonthlyTokens > 2_000_000_000) {
    recommendedPlanId = 'max';
  } else if (totalMonthlyTokens > 1_000_000_000 || taskComplexity === 'high') {
    recommendedPlanId = 'premium';
  } else if (totalMonthlyTokens > 400_000_000) {
    recommendedPlanId = 'core';
  }

  const recommendedPlan = PRICING_PLANS.find((p) => p.id === recommendedPlanId) || PRICING_PLANS[0];
  const netMonthlyGain = totalValueSaved - recommendedPlan.monthlyPriceUsd;

  // Cost comparison calculations: Cloud Model vs On-Device Glimmer 30B
  // Cloud blended token rate: $3.50 per 1M tokens + $15/mo Cloud Browser VM orchestrator
  const cloudMonthlyCost = Math.round(((totalMonthlyTokens / 1_000_000) * 3.50) + 15);
  // On-device Glimmer 30B: $0 token cost + $4.50/mo electricity + Meta One recommended plan
  const onDeviceMonthlyCost = Math.round(recommendedPlan.monthlyPriceUsd + 4.50);

  const periods = [
    { months: 1, label: '1개월' },
    { months: 3, label: '3개월' },
    { months: 6, label: '6개월' },
    { months: 12, label: '12개월 (1년)' },
    { months: 24, label: '24개월 (2년)' },
  ];

  const savingsTimeline = periods.map((p) => {
    const cloudCost = cloudMonthlyCost * p.months;
    const onDeviceCost = onDeviceMonthlyCost * p.months;
    const netSavings = cloudCost - onDeviceCost;
    const savingsPercent = Math.round((netSavings / cloudCost) * 100);
    return {
      ...p,
      cloudCost,
      onDeviceCost,
      netSavings,
      savingsPercent,
    };
  });

  const maxTimelineCost = Math.max(...savingsTimeline.map((s) => s.cloudCost));

  return (
    <section 
      id="sec-pricing" 
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8"
      role="region"
      aria-label="메타 원 요금제 및 온디바이스 비용 절감 계산기"
    >
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide uppercase">
          <span>Usage Workflow & Monetization Model</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          메타 원(Meta One) 구독 등급 & 온디바이스 누적 비용 절감 계산기
        </h2>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-4xl">
          무료 사용자를 위한 주간 1억 토큰부터 하드웨어 융합 파워유저를 위한 프리미엄 플랜의 가격 구조와 
          상용 클라우드 LLM 모델 대비 온디바이스 글리머 30B 전환 시 누적 비용 절감액(TCO)을 확인하세요.
        </p>
      </div>

      {/* 4 Plans Pricing Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="group" aria-label="메타 원 구독 등급 목록">
        {PRICING_PLANS.map((plan) => {
          const isRec = plan.id === recommendedPlanId;
          return (
            <div
              key={plan.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                plan.highlighted || isRec
                  ? 'border-blue-600 bg-blue-50/20 shadow-xs relative'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              {isRec && (
                <div className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  작업량 맞춤 추천
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{plan.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{plan.target}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
                    ${plan.monthlyPriceUsd.toFixed(plan.monthlyPriceUsd === 0 ? 0 : 2)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ 월</span>
                </div>

                <div className="p-2 rounded-lg bg-white border border-slate-200/80 text-xs">
                  <span className="text-[10px] text-slate-400 font-medium block">토큰 한도</span>
                  <span className="font-bold text-blue-700 font-mono text-[11px]">{plan.tokenAllocation}</span>
                </div>

                <div className="space-y-2 text-xs pt-1">
                  <span className="text-[11px] font-bold text-slate-700 block">제공 기능:</span>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
                <span>격리 등급:</span>
                <span className="font-semibold text-slate-700">{plan.vmLevel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Task Estimator & Projected Savings Bar Chart Grid */}
      <div className="pt-4 border-t border-slate-200 space-y-6">
        
        {/* Estimator Controls Card */}
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              월간 에이전트 작업량 설정 & 실시간 ROI 시뮬레이션
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            
            {/* Left: Interactive Sliders & Controls */}
            <div className="space-y-4 text-xs">
              
              {/* Monthly Task Count Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="tasks-slider" className="font-semibold text-slate-700">월간 위임 작업 수:</label>
                  <span className="font-mono font-bold text-blue-600 text-sm tabular-nums">
                    {tasksPerMonth} 건
                  </span>
                </div>
                <input
                  id="tasks-slider"
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={tasksPerMonth}
                  onChange={(e) => setTasksPerMonth(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  aria-label="월간 위임 작업 수 조절 슬라이더"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10건 (가벼운 개인용)</span>
                  <span>250건 (전문가)</span>
                  <span>500건 (비즈니스)</span>
                </div>
              </div>

              {/* Task Complexity Selector */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-700">작업 복잡도:</span>
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="작업 복잡도 선택">
                  <button
                    onClick={() => setTaskComplexity('simple')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                      taskComplexity === 'simple'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    aria-pressed={taskComplexity === 'simple'}
                  >
                    단순 (이메일/검색)
                  </button>
                  <button
                    onClick={() => setTaskComplexity('medium')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                      taskComplexity === 'medium'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    aria-pressed={taskComplexity === 'medium'}
                  >
                    표준 (쇼핑비교/예약)
                  </button>
                  <button
                    onClick={() => setTaskComplexity('high')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                      taskComplexity === 'high'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    aria-pressed={taskComplexity === 'high'}
                  >
                    복합 (상시추적/비즈)
                  </button>
                </div>
              </div>

              {/* Hourly Wage Value */}
              <div className="space-y-1.5">
                <label htmlFor="hourly-wage-input" className="font-semibold text-slate-700">사용자 시간당 인건비 가치 (시급 기준):</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono text-sm">$</span>
                  <input
                    id="hourly-wage-input"
                    type="number"
                    min="10"
                    max="200"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(Math.max(1, Number(e.target.value)))}
                    className="w-28 p-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 text-xs font-bold"
                  />
                  <span className="text-[11px] text-slate-500">/ 시간 (기본 $25 기준)</span>
                </div>
              </div>

            </div>

            {/* Right: Calculated Output Card */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-500">산출된 월간 토큰 수요</span>
                <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                  {(totalMonthlyTokens / 1_000_000).toFixed(1)}M 토큰
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                  <div className="text-[11px] text-blue-700 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> 절감 예상 시간
                  </div>
                  <div className="text-xl font-bold font-mono text-blue-900 mt-1 tabular-nums">
                    {totalHoursSaved} 시간
                  </div>
                  <div className="text-[10px] text-blue-600 mt-0.5">월간 반복 업무 대행</div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                    <DollarSign className="w-3.5 h-3.5" /> 시간 가치 환산
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-900 mt-1 tabular-nums">
                    ${totalValueSaved.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">기회비용 회수</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">추천 최적 구독 플랜</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {recommendedPlan.name} (${recommendedPlan.monthlyPriceUsd}/월)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[11px] block">순 생산성 이익</span>
                  <span className="font-mono font-bold text-emerald-600 text-sm tabular-nums">
                    +${netMonthlyGain.toLocaleString()}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Projected Cost Savings Bar Chart (Cloud API vs On-Device Glimmer 30B) */}
        <div 
          className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-5"
          role="region"
          aria-label="클라우드 모델 대비 온디바이스 글리머 30B 누적 비용 절감 막대 차트"
        >
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  클라우드 기반 모델 대비 온디바이스(Glimmer 30B) 누적 비용 절감 추이 막대 차트
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                월 {tasksPerMonth}건(약 {(totalMonthlyTokens / 1_000_000).toFixed(1)}M 토큰) 작업 시 상용 클라우드 토큰 과금 대비 
                로컬 온디바이스 전환을 통한 실질 순 절감액(TCO) 분석.
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-400 inline-block" />
                <span className="text-slate-700 font-medium">상용 클라우드 LLM 모델</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
                <span className="text-slate-900 font-bold">온디바이스 글리머 30B</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Bars */}
          <div className="space-y-4 pt-2">
            {savingsTimeline.map((item) => {
              const isHovered = hoveredPeriod === item.months;
              return (
                <div
                  key={item.months}
                  onMouseEnter={() => setHoveredPeriod(item.months)}
                  onMouseLeave={() => setHoveredPeriod(null)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isHovered 
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-xs' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                  tabIndex={0}
                  onFocus={() => setHoveredPeriod(item.months)}
                  onBlur={() => setHoveredPeriod(null)}
                  aria-label={`${item.label}: 클라우드 $${item.cloudCost.toLocaleString()}, 온디바이스 $${item.onDeviceCost.toLocaleString()}, 순 절감액 $${item.netSavings.toLocaleString()} (${item.savingsPercent}% 절감)`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-900">{item.label} 누적 비용</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500">
                        클라우드 ${item.cloudCost.toLocaleString()} → 로컬 ${item.onDeviceCost.toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                        +${item.netSavings.toLocaleString()} 절감 ({item.savingsPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="space-y-1.5">
                    {/* Cloud Bar */}
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="w-20 text-slate-500 truncate flex items-center gap-1">
                        <Cloud className="w-3 h-3 text-slate-400" /> 클라우드
                      </span>
                      <div className="flex-1 bg-slate-100 h-3 rounded-xs overflow-hidden">
                        <div
                          className="bg-slate-400 h-full rounded-xs transition-all duration-500"
                          style={{ width: `${(item.cloudCost / maxTimelineCost) * 100}%` }}
                        />
                      </div>
                      <span className="w-16 text-right font-mono text-slate-700 font-bold tabular-nums">
                        ${item.cloudCost.toLocaleString()}
                      </span>
                    </div>

                    {/* On-device Bar */}
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="w-20 text-emerald-700 font-bold truncate flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-emerald-600" /> 글리머 30B
                      </span>
                      <div className="flex-1 bg-slate-100 h-3.5 rounded-xs overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-xs transition-all duration-500"
                          style={{ width: `${Math.max(2, (item.onDeviceCost / maxTimelineCost) * 100)}%` }}
                        />
                      </div>
                      <span className="w-16 text-right font-mono text-emerald-700 font-extrabold tabular-nums">
                        ${item.onDeviceCost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Hover Breakdown */}
                  {isHovered && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600 font-mono">
                      <span>• 상용 클라우드 토큰 요금 ($3.5/M 토큰): ${(item.cloudCost - 15 * item.months).toLocaleString()}</span>
                      <span>• 로컬 전력 요금 (~$4.5/월): ${(4.5 * item.months).toFixed(0)}</span>
                      <span className="text-emerald-700 font-bold">• 실질 순 절감 이익: +${item.netSavings.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Accessible Table Fallback for Screen Readers */}
          <div className="sr-only">
            <table>
              <caption>클라우드 모델 대비 온디바이스 글리머 30B 기간별 누적 비용 및 순 절감액 표</caption>
              <thead>
                <tr>
                  <th scope="col">기간</th>
                  <th scope="col">클라우드 비용</th>
                  <th scope="col">온디바이스 비용</th>
                  <th scope="col">순 절감액</th>
                  <th scope="col">절감율</th>
                </tr>
              </thead>
              <tbody>
                {savingsTimeline.map((item) => (
                  <tr key={item.months}>
                    <th scope="row">{item.label}</th>
                    <td>${item.cloudCost}</td>
                    <td>${item.onDeviceCost}</td>
                    <td>+${item.netSavings}</td>
                    <td>{item.savingsPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Summary Callout */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-700">
                12개월 기준 순 절감액: <strong className="text-emerald-700 font-mono text-sm">+${(savingsTimeline[3].netSavings).toLocaleString()}</strong>
              </span>
            </div>
            <span className="text-slate-500 text-[11px]">
              * 오픈웨이트 가중치 영구 소유 및 API 호출 종속성 제로화 달성
            </span>
          </div>

        </div>

      </div>

    </section>
  );
};
