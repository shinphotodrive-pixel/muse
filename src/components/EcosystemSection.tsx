import React, { useState } from 'react';
import { Globe, Users, TrendingUp, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { ECOSYSTEM_COMPARISON, DOMESTIC_PLATFORM_IMPACT } from '../data/reportData';

export const EcosystemSection: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'bigtech' | 'domestic'>('bigtech');

  return (
    <section 
      id="sec-ecosystem" 
      role="region"
      aria-label="빅테크 플랫폼 경쟁 구도 및 국내 플랫폼 대응 전략"
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8"
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
          <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-4xl">
            사용자가 웹사이트를 직접 방문하지 않는 제로 클릭(Zero-click) 에이전트의 보편화가 
            포털 검색 광고 모델과 이커머스 생태계에 미치는 파괴적 영향과 생존 전략을 분석합니다.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 self-start md:self-auto">
          <button
            onClick={() => setSelectedTab('bigtech')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedTab === 'bigtech' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            빅테크 격돌 (Meta vs OpenAI)
          </button>
          <button
            onClick={() => setSelectedTab('domestic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedTab === 'domestic' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            국내 영향 (네이버·카카오)
          </button>
        </div>
      </div>

      {/* BIGTECH TAB */}
      {selectedTab === 'bigtech' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Meta Muse Card */}
            <div className="p-5 rounded-xl bg-blue-50/30 border border-blue-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase">대중 소비자 포털 장악</span>
                  <h3 className="text-lg font-bold text-slate-900">{ECOSYSTEM_COMPARISON.metaMuse.name}</h3>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                  B2C 포커스
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
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
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-indigo-700 uppercase">기업 지식 노동자 자동화</span>
                  <h3 className="text-lg font-bold text-slate-900">{ECOSYSTEM_COMPARISON.openAiDots.name}</h3>
                </div>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
                  B2B 포커스
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
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

          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900">시사점:</span>
            <p className="leading-relaxed text-[11px]">
              메타는 '왓츠앱'과 '인스타그램'의 수십억 모바일 사용자를 바탕으로 <strong>대중 일상(소비·쇼핑·예약)</strong>에 무상 침투한 후 
              결제 수수료와 스마트 안경 하드웨어로 생태계를 굳히는 전략이며, 
              OpenAI는 슬랙/깃허브/마이크로소프트와 손잡고 <strong>기업용 업무 자동화(고부가가치 지식 근로)</strong> 시장의 $200 프리미엄 구독을 독식하는 이원화 구도로 전개되고 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* DOMESTIC TAB */}
      {selectedTab === 'domestic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Naver Card */}
            <div className="p-5 rounded-xl bg-emerald-50/30 border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">국내 포털 1위</span>
                  <h3 className="text-lg font-bold text-slate-900">{DOMESTIC_PLATFORM_IMPACT.naver.name}</h3>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  플레이스 & AI 쇼핑
                </span>
              </div>

              <div className="space-y-3 text-xs">
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
            <div className="p-5 rounded-xl bg-amber-50/30 border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase">국민 모바일 메신저</span>
                  <h3 className="text-lg font-bold text-slate-900">{DOMESTIC_PLATFORM_IMPACT.kakao.name}</h3>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                  카나나 (Kanana)
                </span>
              </div>

              <div className="space-y-3 text-xs">
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
            <p className="text-slate-300 leading-relaxed text-[11px]">
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
