import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer 
      role="contentinfo" 
      aria-label="메타 뮤즈 대시보드 푸터"
      className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="space-y-1 text-center md:text-left">
            <div className="text-white font-semibold">
              Meta Muse & Agentic AI Intelligence Dashboard
            </div>
            <p className="text-slate-500 text-[11px]">
              2026 에이전틱 AI 기술 동향, 글리머 30B 벤치마크 및 5계층 보안 아키텍처 리서치 리포트
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>데이터 기준: 2026.09 공식 보고서</span>
            <span aria-hidden="true">·</span>
            <span>Apache 2.0 Open Weights</span>
            <span aria-hidden="true">·</span>
            <span>Secure VM v1.3</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
