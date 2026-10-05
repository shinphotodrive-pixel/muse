import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileJson, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Clock, 
  Share2, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  downloadReportAsJson, 
  triggerPrintReport, 
  copySummaryToClipboard,
  generateReportData,
  getRecentExports,
  RecentExportRecord 
} from '../utils/exportReport';
import { useToast } from '../context/ToastContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState<boolean>(false);
  const [recentExports, setRecentExports] = useState<RecentExportRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setRecentExports(getRecentExports());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const reportPreview = generateReportData();

  const handleJsonDownload = () => {
    const fileName = downloadReportAsJson();
    setRecentExports(getRecentExports());
    showToast({
      type: 'success',
      title: 'JSON 보고서 다운로드 완료',
      description: `${fileName} 파일이 저장되었습니다.`
    });
  };

  const handlePdfPrint = () => {
    onClose();
    setTimeout(() => {
      const fileName = triggerPrintReport();
      showToast({
        type: 'info',
        title: 'PDF 인쇄 창 호출 완료',
        description: '브라우저 대화상자에서 PDF 파일 저장을 선택할 수 있습니다.'
      });
    }, 200);
  };

  const handleCopyClipboard = async () => {
    try {
      await copySummaryToClipboard();
      setCopied(true);
      setRecentExports(getRecentExports());
      showToast({
        type: 'success',
        title: '클립보드 복사 완료',
        description: '마크다운 형식의 보고서 요약본이 복사되었습니다.'
      });
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      showToast({
        type: 'error',
        title: '복사 실패',
        description: '클립보드 접근 권한을 확인해주세요.'
      });
    }
  };

  const handleRedownload = (item: RecentExportRecord) => {
    if (item.format === 'JSON') {
      downloadReportAsJson();
      showToast({
        type: 'success',
        title: '보고서 재다운로드 완료',
        description: `${item.fileName} 파일이 다시 저장되었습니다.`
      });
    } else if (item.format === 'PDF') {
      triggerPrintReport();
    } else {
      copySummaryToClipboard();
      showToast({
        type: 'success',
        title: '클립보드 복사 완료',
        description: '요약본 텍스트가 클립보드에 다시 복사되었습니다.'
      });
    }
  };

  const handleShareAnalysis = async (item: RecentExportRecord) => {
    const shareText = `[Meta Muse Agentic AI Report] ${item.title} (발행: ${new Date(item.timestamp).toLocaleString('ko-KR')})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: window.location.href,
        });
        showToast({
          type: 'success',
          title: '분석 보고서 공유 완료',
          description: '성공적으로 외부 채널에 공유되었습니다.'
        });
      } catch (e) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        showToast({
          type: 'info',
          title: '공유 링크 복사 완료',
          description: '클립보드에 보고서 분석 링크가 복사되었습니다.'
        });
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      showToast({
        type: 'info',
        title: '공유 링크 복사 완료',
        description: '클립보드에 보고서 분석 링크가 복사되었습니다.'
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${Math.floor(diffHours / 24)}일 전`;
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      aria-describedby="export-modal-desc"
    >
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-2xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="export-modal-title" className="font-bold text-slate-900 text-base">
                  보고서 오프라인 내보내기 & 최근 내역
                </h2>
                <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 border border-slate-300">
                  단축키: ⌘E / Ctrl+E
                </kbd>
              </div>
              <p id="export-modal-desc" className="text-xs text-slate-500">
                2026 에이전틱 AI 벤치마크, 5계층 보안 시뮬레이션 및 비용 절감 데이터
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with 2-Column Layout: Main Export Actions + Recent Exports Sidebar */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* Left Column: Export Formats & Controls (7 Cols) */}
          <div className="lg:col-span-7 p-6 space-y-5">
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Glimmer 30B 벤치마크 결과, 5대 하드웨어 성능 계산식, 프롬프트 인젝션 4대 공격 시뮬레이션 결과 
              및 클라우드 대비 비용 절감 데이터를 원하는 포맷으로 내보냅니다.
            </p>

            {/* Export Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option 1: JSON Export */}
              <div 
                onClick={handleJsonDownload}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 hover:border-blue-500 cursor-pointer transition-all space-y-2 group shadow-2xs"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleJsonDownload(); }}
                aria-label="JSON 데이터셋 다운로드"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FileJson className="w-4 h-4" />
                  </span>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                    .JSON
                  </span>
                </div>
                <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-xs sm:text-sm">
                  JSON 데이터셋 다운로드
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Python, Excel, Pandas에서 즉시 파싱할 수 있는 완전한 구조화 데이터 파일.
                </p>
                <div className="pt-1 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                  <span>파일 받기</span>
                  <Download className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Option 2: PDF Export */}
              <div 
                onClick={handlePdfPrint}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-500 cursor-pointer transition-all space-y-2 group shadow-2xs"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handlePdfPrint(); }}
                aria-label="PDF 보고서 저장 및 인쇄"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </span>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                    .PDF
                  </span>
                </div>
                <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors text-xs sm:text-sm">
                  PDF 인쇄 및 문서 저장
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  헤더와 인터랙티브 버튼이 배제된 인쇄 전용 레이아웃으로 A4 PDF 파일 저장.
                </p>
                <div className="pt-1 text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                  <span>인쇄창 열기</span>
                  <Printer className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>

            {/* Markdown Summary Action */}
            <div className="pt-1">
              <button
                onClick={handleCopyClipboard}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">클립보드에 마크다운 요약본 복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>마크다운 형식 요약 텍스트 클립보드 복사</span>
                  </>
                )}
              </button>
            </div>

            {/* Schema Summary Box */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[10px] border-b border-slate-800 pb-1.5">
                <span>내보내기 데이터 스키마 명세</span>
                <span>버전: {reportPreview.version}</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">• 벤치마크 항목:</span>
                  <span className="text-slate-200">5대 지표 (Glimmer 30B vs Gemma 4 vs Qwen 3.6)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">• 보안 시뮬레이션:</span>
                  <span className="text-slate-200">4대 공격 벡터 & 5단계 방어 로그</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">• 모델별 차등 방어:</span>
                  <span className="text-slate-200">Vanilla vs Guardrail vs Raw비교표 수록</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">• 하드웨어 연산 프리셋:</span>
                  <span className="text-slate-200">6종 GPU & DFlash 속도 수식</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 'Recent Exports' Sidebar Panel (5 Cols) */}
          <div className="lg:col-span-5 p-6 bg-slate-50/50 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>최근 내보내기 이력 (Recent Exports)</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {recentExports.length}개 기록
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                이전에 생성된 보고서입니다. 클릭하여 즉시 재다운로드하거나 동료에게 분석 결과를 공유하세요.
              </p>

              {/* List of recent exports */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {recentExports.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-colors shadow-2xs space-y-1.5 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                            item.format === 'JSON'
                              ? 'bg-blue-100 text-blue-700'
                              : item.format === 'PDF'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {item.format}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatRelativeTime(item.timestamp)}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-800 text-xs truncate" title={item.title}>
                          {item.title}
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-slate-400 shrink-0">
                        {formatFileSize(item.fileSizeBytes)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                        {item.fileName}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShareAnalysis(item)}
                          className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-0.5"
                          title="분석 결과 공유"
                          aria-label={`${item.title} 분석 결과 공유`}
                        >
                          <Share2 className="w-3 h-3" />
                          <span className="text-[10px]">공유</span>
                        </button>
                        <button
                          onClick={() => handleRedownload(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-0.5"
                          title="재다운로드"
                          aria-label={`${item.title} 재다운로드`}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span className="text-[10px]">받기</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1 text-slate-600 font-medium">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>로컬 브라우저 보안 스토리지 저장됨</span>
              </div>
              <span className="font-mono text-[10px]">AES-256 동등 분리</span>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            기준 시점: {new Date().toLocaleDateString('ko-KR')} | 오프라인 완전 격리 실행 지원
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
