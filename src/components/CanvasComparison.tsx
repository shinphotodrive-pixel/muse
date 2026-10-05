import React, { useState } from 'react';
import { Layers, ZoomIn, ZoomOut, Search, ExternalLink, Check, X, Sparkles, Folder } from 'lucide-react';
import { NOTE_APP_COMPARISONS } from '../data/reportData';
import { NoteAppComparison } from '../types';

export const CanvasComparison: React.FC = () => {
  const [selectedAppName, setSelectedAppName] = useState<string>('뮤즈 (Muse / 현 Allume)');
  const [activeBoardLevel, setActiveBoardLevel] = useState<number>(1);
  const [canvasSearch, setCanvasSearch] = useState<string>('');

  const selectedApp: NoteAppComparison = 
    NOTE_APP_COMPARISONS.find((a) => a.name === selectedAppName) || NOTE_APP_COMPARISONS[0];

  return (
    <section 
      id="sec-canvas" 
      role="region"
      aria-label="동명의 디지털 캔버스 앱 비교 및 중첩 보드 생태계 분석"
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8"
    >
      
      {/* Header & Disambiguation */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide uppercase">
          <span>Spatial Canvas Ecosystem & Disambiguation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          동명의 디지털 캔버스 앱: 뮤즈(Muse / 현 Allume) 비교 분석
        </h2>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-4xl">
          2026년 공개된 메타의 자율 에이전트 <strong>'메타 뮤즈(Meta Muse)'</strong>와, 
          맥/아이패드 환경에서 깊은 시각적 사고와 리서치를 지원하는 스페이셜 캔버스 앱 <strong>'뮤즈(Muse / 현 Allume)'</strong>는 
          전혀 다른 소프트웨어입니다. 혼동을 방지하기 위해 디지털 캔버스 생태계와 경쟁 앱들을 심층 대조합니다.
        </p>
      </div>

      {/* Disambiguation Contrast Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase">메타 뮤즈 (Meta Muse)</span>
            <span className="text-[10px] font-semibold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded">Action AI Agent</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">자율 행동 대리인 & 웹 브라우저 조작 엔진</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            사용자의 의도를 받아 웹 최저가 탐색, 신용카드 가상 결제, 캘린더 일정 협상, 비즈니스 예약 전화를 대신 수행하는 
            인터랙티브 자동화 플랫폼.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase">뮤즈 (Muse / 현 Allume)</span>
            <span className="text-[10px] font-semibold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">Spatial Note App</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">무한 줌 중첩 보드(Nested Boards) 지식 캔버스</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            X, 핀터레스트, PDF, 손글씨 스케치를 원본 해상도로 무한히 수집하고 중첩 보드 제스처로 정리하는 
            로컬 파일 기반 개인 연구자용 시각 씽킹 도구.
          </p>
        </div>

      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
              <th className="p-3">소프트웨어</th>
              <th className="p-3">지원 플랫폼</th>
              <th className="p-3">데이터 저장 구조</th>
              <th className="p-3">주요 특화 기능</th>
              <th className="p-3">가격 정책</th>
              <th className="p-3 text-center">상세 보기</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {NOTE_APP_COMPARISONS.map((app) => {
              const isSelected = app.name === selectedAppName;
              return (
                <tr
                  key={app.name}
                  onClick={() => setSelectedAppName(app.name)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/70 font-medium' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="p-3">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{app.name}</span>
                      {app.isAllume && (
                        <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                          비교 대상
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">
                    {app.platforms.join(', ')}
                  </td>
                  <td className="p-3">
                    <span className="text-slate-700 font-medium">{app.storageType}</span>
                  </td>
                  <td className="p-3 text-slate-600 max-w-xs truncate">
                    {app.primaryFeatures}
                  </td>
                  <td className="p-3 font-mono font-semibold text-slate-800">
                    {app.pricing}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className={`text-xs px-2.5 py-1 rounded transition-colors ${
                        isSelected ? 'bg-blue-600 text-white font-semibold' : 'text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '선택됨' : '비교'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected App Detailed Breakdown Card */}
      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h4 className="text-base font-bold text-slate-900">{selectedApp.name} 분석</h4>
            <p className="text-xs text-slate-500 mt-0.5">핵심 타깃: {selectedApp.targetAudience}</p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
            {selectedApp.pricing}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="space-y-2 p-3.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>주요 강점 & 차별점</span>
            </span>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              {selectedApp.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 p-3.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-amber-800 flex items-center gap-1.5">
              <X className="w-4 h-4 text-amber-600" />
              <span>한계점 및 사용 시 고려사항</span>
            </span>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              {selectedApp.limitations.map((l, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Interactive Spatial Canvas Demonstration */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>뮤즈(Allume) 중첩 보드(Nested Boards) 개념 체험기</span>
              </h4>
              <p className="text-xs text-slate-500">
                캔버스 내부의 보드 카드를 클릭해 하위 레이어로 줌인(Zoom-in)하는 시각적 사고 방식을 직접 조작해 보세요.
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                disabled={activeBoardLevel === 1}
                onClick={() => setActiveBoardLevel((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>상위 보드로 줌아웃</span>
              </button>
            </div>
          </div>

          {/* Interactive Visual Canvas Screen */}
          <div className="relative bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 min-h-[220px] flex flex-col justify-between overflow-hidden">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span>현재 경로:</span>
                <span className="text-blue-400">~/Research</span>
                {activeBoardLevel >= 2 && <span className="text-blue-300">/ 2026_AI_Agentic_Hardware</span>}
                {activeBoardLevel >= 3 && <span className="text-white">/ Muse_Charm_Spec</span>}
              </div>

              <div className="text-[10px] text-slate-500 font-mono">
                온디바이스 CoreML 인덱싱 상태: 정기 동기화 완료
              </div>
            </div>

            {/* Canvas Body (Swapping based on Level) */}
            <div className="py-4">
              {activeBoardLevel === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setActiveBoardLevel(2)}
                    className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 hover:border-blue-500 cursor-pointer transition-all hover:scale-[1.02] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1">
                        <Folder className="w-3.5 h-3.5 text-blue-400" /> 2026 에이전트 하드웨어
                      </span>
                      <ZoomIn className="w-3 h-3 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      뮤즈 참 및 스마트 안경 관련 수집 자료 (클릭하여 줌인)
                    </p>
                    <div className="text-[10px] text-blue-400 font-mono">8개 중첩 카드 포함</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1.5 opacity-80">
                    <span className="font-bold text-white text-xs flex items-center gap-1">
                      <Folder className="w-3.5 h-3.5 text-indigo-400" /> 로컬 LLM 벤치마크
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Glimmer 30B vs Gemma 4 논문 PDF 스크랩
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">14개 카드</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1.5 opacity-80">
                    <span className="font-bold text-white text-xs flex items-center gap-1">
                      <Folder className="w-3.5 h-3.5 text-emerald-400" /> 보안 프레임워크 설계안
                    </span>
                    <p className="text-[11px] text-slate-400">
                      eBPF 및 hatch-authd 아키텍처 다이어그램
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">5개 카드</div>
                  </div>
                </div>
              )}

              {activeBoardLevel === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setActiveBoardLevel(3)}
                    className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 hover:border-blue-500 cursor-pointer transition-all hover:scale-[1.02] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1">
                        <Folder className="w-3.5 h-3.5 text-rose-400" /> 뮤즈 참 (Muse Charm) 상세 스펙
                      </span>
                      <ZoomIn className="w-3 h-3 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      2인치 OLED, Jolly 아바타, 30% 수수료 회피 구조도 (클릭하여 줌인)
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700 space-y-1.5">
                    <span className="font-bold text-white text-xs flex items-center gap-1">
                      <Folder className="w-3.5 h-3.5 text-amber-400" /> Ray-Ban Meta 안경 시각인식
                    </span>
                    <p className="text-[11px] text-slate-400">
                      실시간 비디오 프레임 추출 및 Gaze-to-buy 음성 커맨드 테스트
                    </p>
                  </div>
                </div>
              )}

              {activeBoardLevel === 3 && (
                <div className="p-4 rounded-lg bg-slate-800/90 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">뮤즈 참(Muse Charm) 심층 메모 노트</span>
                    <span className="text-[10px] text-emerald-400 font-mono">로컬 .muse 포맷 동기화</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "애플/구글 모바일 OS의 벽을 뚫기 위해 메타가 택한 전략은 2인치 디스플레이 형태의 독자 폼팩터다. 
                    사용자는 손목이나 가방에 걸고 다니며 언제든 물리 버튼으로 음성 대화를 나누고, 
                    Stripe Link 토큰으로 모바일 인앱결제 수수료(30%) 없이 1회 결제를 수행한다."
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1">
                    인용 태그: #메타하드웨어 #에이전트생태계 #제로수수료
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Footer */}
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
              <span>제스처 안내: 핀치 인(Pinch-in) 시 상위 보드로 즉시 이동</span>
              <span>데이터는 사용자 로컬 SSD에 암호화 보관</span>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};
