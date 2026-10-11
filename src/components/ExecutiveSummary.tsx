import React from 'react';
import { ArrowUpRight, Cpu, ShieldCheck, Zap, Download, FileJson } from 'lucide-react';

interface ExecutiveSummaryProps {
  onQuickFilter: (keyword: string) => void;
  selectedTag: string;
  onOpenExportModal: () => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  onQuickFilter,
  selectedTag,
  onOpenExportModal,
}) => {
  const quickTags = [
    { id: 'all', label: '전체 보기' },
    { id: 'glimmer', label: '글리머 30B' },
    { id: 'security', label: '5계층 보안' },
    { id: 'hardware', label: '뮤즈 참 & 안경' },
    { id: 'canvas', label: 'Allume 캔버스' },
    { id: 'pricing', label: '메타 원 요금제' },
  ];

  return (
    <section 
      id="sec-overview" 
      role="region"
      aria-label="메타 뮤즈 2026 핵심 요약 및 주요 성과"
      className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-sm space-y-5 sm:space-y-6"
    >
      
      {/* Top Header & Context */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide">
            <span>2026 심층 기술 리포트</span>
            <span aria-hidden="true">·</span>
            <span>메타 AI 자율 에이전트 아키텍처</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            대화형 챗봇에서 자율 행동 대리인(Agentic AI)으로의 대전환
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed pt-1">
            2026년 9월 8일 공개된 메타의 <strong>뮤즈(Meta Muse)</strong>는 단순 텍스트 답변을 생성하는 챗봇 단계를 종식시키고, 
            사용자의 의도를 바탕으로 브라우저와 OS를 직접 제어해 상품 탐색, 최저가 결제, 일정 조율 및 비즈니스 콜링까지 자율 수행하는 
            <strong>행동 중심(Action-oriented) AI 에이전트</strong>입니다.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 text-xs text-slate-500 gap-2.5 sm:gap-3">
          <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
            <div>
              <span className="font-semibold text-slate-700 block text-[11px]">분석 기준 시점</span>
              <div className="font-mono text-slate-900 font-bold text-xs">2026.09 3주차 실데이터</div>
            </div>
            <div className="border-l border-slate-200 pl-3">
              <span className="font-semibold text-slate-700 block text-[11px]">배포 상태</span>
              <div className="text-emerald-700 font-medium text-xs">북미 정식 배포 중 (v1.3)</div>
            </div>
          </div>

          <button
            onClick={onOpenExportModal}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors shadow-2xs w-full sm:w-auto touch-manipulation min-h-[38px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>보고서 다운로드 (JSON/PDF/CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Grid (2x2 on Mobile, 4 Cols on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-medium">
            <span className="truncate">누적 다운로드</span>
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
            5,000,000<span className="text-sm font-normal text-slate-600 ml-1">건+</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-600 flex items-center gap-1">
            <span className="truncate">양대 마켓 1위</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-medium">
            <span className="truncate">로컬 온디바이스</span>
            <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-600 font-mono tracking-tight tabular-nums">
            29.6B<span className="text-xs font-medium text-slate-600 ml-1">Glimmer</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-600">
            <span className="truncate">Apache 2.0 오픈웨이트</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-medium">
            <span className="truncate">최고 추론 속도</span>
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono tracking-tight tabular-nums">
            233.4<span className="text-xs font-medium text-slate-600 ml-1">tok/s</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-600">
            <span className="truncate">RTX 5090 DFlash 적용</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-medium">
            <span className="truncate">무료 주간 한도</span>
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-600 font-mono tracking-tight tabular-nums">
            100,000,000<span className="text-xs font-medium text-slate-600 ml-1">토큰</span>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-600">
            <span className="truncate">Secure VM 무상 제공</span>
          </div>
        </div>

      </div>

      {/* Quick Interactive Filter Controls (Mobile Horizontal Scrollable) */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium w-full sm:w-auto">
          <span className="shrink-0 text-[11px] sm:text-xs">빠른 필터:</span>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 w-full sm:w-auto sm:flex-wrap">
            {quickTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onQuickFilter(tag.id)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors shrink-0 touch-manipulation min-h-[30px] ${
                  selectedTag === tag.id
                    ? 'bg-blue-600 text-white font-medium shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] sm:text-xs text-slate-500 self-end sm:self-auto">
          <span>분석 항목 </span>
          <span className="font-mono font-semibold text-slate-800">8대 핵심 주제</span>
          <span> 수록</span>
        </div>
      </div>

    </section>
  );
};
