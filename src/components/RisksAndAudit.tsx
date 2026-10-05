import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  Info, 
  CheckCircle2, 
  Lock, 
  ChevronRight 
} from 'lucide-react';
import { RISKS_AND_CONTROVERSIES } from '../data/reportData';

export const RisksAndAudit: React.FC = () => {
  const [selectedRiskId, setSelectedRiskId] = useState<string>('risk-macos-fda');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'chk-fda': true,
    'chk-fatigue': false,
    'chk-vpn': false,
    'chk-antibot': true,
    'chk-token': false,
  });

  const selectedRisk = 
    RISKS_AND_CONTROVERSIES.find((r) => r.id === selectedRiskId) || RISKS_AND_CONTROVERSIES[0];

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const auditItems = [
    {
      id: 'chk-fda',
      label: 'macOS 전체 디스크 접근(Full Disk Access) 권한 해제',
      desc: '시스템 설정 > 개인정보 보호 및 보안 > 전체 디스크 접근 권한에서 Meta Muse 비활성화',
      recommended: true,
    },
    {
      id: 'chk-fatigue',
      label: '생체 인증 승인 전 가맹점명 및 결제 금액 육안 검증',
      desc: 'Face ID / 지문 센서를 누르기 전 팝업의 결제 금액과 판매자 정보 직접 확인 습관화',
      recommended: true,
    },
    {
      id: 'chk-vpn',
      label: '지역 락(Region Lock) 우회용 VPN 단속 대비',
      desc: 'VPN 접속 시 계정 영구 차단 및 스토어 환불 불가 리스크 인지 및 서브 계정 테스트 권장',
      recommended: false,
    },
    {
      id: 'chk-antibot',
      label: '아마존/익스피디아 등 안티봇 차단 시 수동 링크 전환',
      desc: '장바구니 담기 실패 시 에이전트가 추출한 다이렉트 딥링크로 1회성 수동 결제',
      recommended: true,
    },
    {
      id: 'chk-token',
      label: '월간 토큰 소비 임계치 알림 활성화',
      desc: '의도치 않은 백그라운드 무한 루프 감시 작업으로 인한 토큰 소진 방지',
      recommended: false,
    },
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = auditItems.length;

  return (
    <section 
      id="sec-risks" 
      role="region"
      aria-label="실사용 주의사항, 프라이버시 침해 논란 및 안전 점검 체크리스트"
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8"
    >
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 tracking-wide uppercase">
          <span>Security Risks, Privacy Controversies & Safety Checklist</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          실사용 시 주의할 점, 프라이버시 침해 논란 & 안전 수칙
        </h2>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-4xl">
          에이전트에게 실제 기기 조작과 결제 권한을 위임함에 따라 발생하는 시스템 보안 침해 사례, 
          빅테크 간 트래픽 차단 분쟁, 그리고 사용자의 승인 피로도(Approval Fatigue)에 따른 금융 리스크를 점검합니다.
        </p>
      </div>

      {/* 3 Critical Risk Incidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RISKS_AND_CONTROVERSIES.map((risk) => {
          const isSelected = risk.id === selectedRiskId;
          return (
            <div
              key={risk.id}
              onClick={() => setSelectedRiskId(risk.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">{risk.category}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      risk.severity === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : risk.severity === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {risk.severity}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {risk.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {risk.incidentCase}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-semibold flex items-center justify-between">
                <span className={isSelected ? 'text-amber-800' : 'text-slate-500'}>
                  {isSelected ? '기술 분석 열람 중' : '원인 및 대응책'}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-amber-700' : 'text-slate-400'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Risk Deep-Dive Card */}
      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        
        <div className="border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="text-base font-bold text-slate-900">{selectedRisk.title}</h4>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {selectedRisk.incidentCase}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 text-[11px] block">기술적 발생 원인</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {selectedRisk.technicalRootCause}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-900 text-[11px] block">사용자 즉각 조치 수칙</span>
            <p className="text-emerald-800 text-[11px] leading-relaxed font-medium">
              {selectedRisk.userMitigation}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 space-y-1">
            <span className="font-bold text-blue-900 text-[11px] block">개발사 및 플랫폼 대응</span>
            <p className="text-blue-800 text-[11px] leading-relaxed">
              {selectedRisk.developerCountermeasure}
            </p>
          </div>

        </div>

      </div>

      {/* Interactive Safety Self-Audit Checklist */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>에이전트 사용 전 개인 보안 자가 점검표 (Security Checklist)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                안전한 에이전틱 AI 활용을 위해 필수 권한 설정 및 보안 습관을 직접 체크해 보세요.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">점검 완료율:</span>
              <span className="font-mono font-bold text-blue-700 text-sm tabular-nums">
                {completedCount} / {totalCount} ({Math.round((completedCount / totalCount) * 100)}%)
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {auditItems.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'bg-white border-slate-300'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="mt-0.5 text-blue-600 shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${isChecked ? 'text-slate-900 line-through text-slate-500' : 'text-slate-800'}`}>
                        {item.label}
                      </span>
                      {item.recommended && (
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-medium">
                          필수 점검
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </section>
  );
};
