import React from 'react';
import { ShieldAlert, Search, Download } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSimulator: () => void;
  onOpenExportModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  onOpenSimulator,
  onOpenExportModal,
  searchQuery,
  onSearchChange,
}) => {
  const navItems = [
    { id: 'sec-overview', label: '개요' },
    { id: 'sec-features', label: '기능·하드웨어' },
    { id: 'sec-benchmark', label: '글리머 30B' },
    { id: 'sec-security', label: '보안 시뮬레이터' },
    { id: 'sec-pricing', label: '요금제 계산기' },
    { id: 'sec-canvas', label: '캔버스 비교' },
    { id: 'sec-risks', label: '주의사항' },
    { id: 'sec-ecosystem', label: '시장 전망' },
  ];

  return (
    <header 
      role="banner" 
      aria-label="메타 뮤즈 대시보드 글로벌 헤더"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200"
    >
      {/* Skip to Main Content Link for Keyboard and Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold text-xs"
      >
        본문 콘텐츠로 바로가기 (Skip to Content)
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
            {/* Zone 1: Single text element wordmark */}
          <a
            href="#sec-overview"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('sec-overview');
            }}
            className="flex items-center gap-2 shrink-0 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            aria-label="메타 뮤즈 & 에이전틱 AI 대시보드 홈으로 이동"
          >
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm group-hover:bg-blue-700 transition-colors" aria-hidden="true">
              M
            </span>
            <span className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              <span className="hidden xs:inline">Meta Muse & Agentic AI</span>
              <span className="xs:hidden">Meta Muse</span>
            </span>
          </a>

          {/* Zone 2: 4-8 clean text navigation links */}
          <nav 
            role="navigation" 
            aria-label="대시보드 주요 섹션 탐색 네비게이션"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="relative hidden xl:block w-36">
              <label htmlFor="global-search-input" className="sr-only">대시보드 검색</label>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="검색..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Download Report Button */}
            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 rounded-lg transition-colors shadow-2xs whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 group touch-manipulation min-h-[36px]"
              title="벤치마크 및 시뮬레이션 데이터를 JSON 또는 PDF로 다운로드 (단축키: Cmd/Ctrl + E)"
              aria-label="보고서 다운로드 및 내보내기 대화상자 열기 (단축키: Cmd/Ctrl + E)"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              <span className="hidden sm:inline">보고서 다운로드</span>
              <span className="sm:hidden text-[11px]">보고서</span>
              <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 border border-slate-300 ml-0.5 group-hover:bg-slate-300">
                ⌘E
              </kbd>
            </button>

            {/* Security Simulator Button */}
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation min-h-[36px]"
              aria-label="보안 시뮬레이터 섹션으로 스크롤 이동"
            >
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">보안 시뮬레이터</span>
              <span className="sm:hidden text-[11px]">시뮬레이터</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Horizontal Section Navigation Pills (visible on smartphones/tablets) */}
      <div className="lg:hidden border-t border-slate-200/80 bg-slate-50/95 overflow-x-auto scrollbar-none py-1.5 px-3">
        <nav className="flex items-center gap-1.5 min-w-max" aria-label="모바일 섹션 바로가기">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors shrink-0 touch-manipulation ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 active:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
