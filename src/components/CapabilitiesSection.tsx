import React, { useState } from 'react';
import { 
  Mail, 
  ShoppingBag, 
  Clock, 
  FileText, 
  Smartphone, 
  Glasses, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu, 
  Terminal 
} from 'lucide-react';
import { CAPABILITIES } from '../data/reportData';
import { CapabilityItem } from '../types';

export const CapabilitiesSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('cap-shopping');
  const selectedCap: CapabilityItem = CAPABILITIES.find((c) => c.id === selectedId) || CAPABILITIES[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mail':
        return <Mail className="w-5 h-5 text-blue-600" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-indigo-600" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-amber-600" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-rose-600" />;
      case 'Glasses':
        return <Glasses className="w-5 h-5 text-purple-600" />;
      default:
        return <Cpu className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <section 
      id="sec-features" 
      role="region"
      aria-label="메타 뮤즈 핵심 기능 및 하드웨어 융합 생태계"
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
    >
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide uppercase">
          <span>Core Capabilities & Hardware Ecosystem</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          메타 뮤즈 핵심 기능 & 하드웨어 융합 생태계
        </h2>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-4xl">
          백그라운드 상시 구동 엔진인 <strong className="text-slate-800">Muse Spark 1.3</strong>을 기반으로 작동하며,
          단순한 소프트웨어를 넘어 독자 소형 단말기 '뮤즈 참' 및 레이밴 스마트 안경과의 결합으로 물리적 현실 세계까지 행동 반경을 확장합니다.
        </p>
      </div>

      {/* 6 Capabilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAPABILITIES.map((cap) => {
          const isSelected = cap.id === selectedId;
          return (
            <div
              key={cap.id}
              onClick={() => setSelectedId(cap.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    {getIcon(cap.icon)}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {cap.category === 'hardware' ? '하드웨어 융합' : cap.category === 'payment' ? '금융·결제' : cap.category === 'memory' ? '상시 메모리' : '소프트웨어'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{cap.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                    {cap.summary}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                <span className={isSelected ? 'text-blue-700' : 'text-slate-500'}>
                  {isSelected ? '실행 파이프라인 분석 중' : '파이프라인 보기'}
                </span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-blue-700' : 'text-slate-400'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Capability Pipeline Inspector */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="bg-slate-900 text-slate-100 rounded-xl p-5 sm:p-6 shadow-md space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                {getIcon(selectedCap.icon)}
              </div>
              <div>
                <span className="text-[11px] text-blue-400 font-mono tracking-wide uppercase">실행 프로세스 정밀 검사</span>
                <h4 className="text-base font-bold text-white leading-tight">{selectedCap.title}</h4>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              핵심 프로토콜: <span className="text-slate-200">{selectedCap.keyTech}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {selectedCap.description}
          </p>

          {/* 4-Stage Execution Chain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
            
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
              <div className="text-[10px] font-mono text-blue-400 font-bold uppercase flex items-center justify-between">
                <span>01. 이벤트 입력</span>
                <Terminal className="w-3 h-3 text-blue-400" />
              </div>
              <div className="font-semibold text-white">비동기 신호 트리거</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {selectedCap.pipeline.input}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
              <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase flex items-center justify-between">
                <span>02. 인지 & 추론</span>
                <Cpu className="w-3 h-3 text-indigo-400" />
              </div>
              <div className="font-semibold text-white">Glimmer 30B / ViT 파싱</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {selectedCap.pipeline.reasoning}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center justify-between">
                <span>03. 샌드박스 액션</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="font-semibold text-white">Secure VM 격리 수행</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {selectedCap.pipeline.sandboxAction}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase flex items-center justify-between">
                <span>04. 검증 & 승인</span>
                <ShieldAlert className="w-3 h-3 text-amber-400" />
              </div>
              <div className="font-semibold text-white">Human-in-the-Loop</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {selectedCap.pipeline.verification}
              </p>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
