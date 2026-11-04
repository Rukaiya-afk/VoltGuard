'use client';

import React from 'react';
import { 
  Flame, 
  Clock, 
  AlertOctagon, 
  CheckSquare, 
  X,
  ShieldCheck, 
  Zap,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';

export const ForensicModal: React.FC = () => {
  const { 
    forensicModalOpen, 
    forensicAlert, 
    acknowledgeSafetyLatch, 
    setForensicModalOpen,
    settings 
  } = useVoltStore();

  if (!forensicModalOpen || !forensicAlert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-rose-500 shadow-2xl relative space-y-6 overflow-hidden p-6 sm:p-8
        bg-[#202D3D] text-[#E8EEF5]
        theme-light:bg-white theme-light:text-[#26382D]
      ">
        {/* Top Crimson Warning Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-600 animate-pulse" />

        <button
          onClick={() => setForensicModalOpen(false)}
          className="absolute top-4 right-4 text-[#A6B3C1] hover:text-white theme-light:text-[#69776C] theme-light:hover:text-[#26382D] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title Header (Reference Image 1 Alert Card Inspiration) */}
        <div className="flex items-start space-x-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <Flame className="h-7 w-7 animate-pulse text-rose-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono bg-rose-600 text-white">
                WARNMELDUNG • AUTOMATIC SAFETY CUTOFF
              </span>
              <span className="text-xs font-mono opacity-70">{forensicAlert.timestamp}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white theme-light:text-[#26382D] mt-1">
              Safety Shutoff Report: {forensicAlert.outlet_name}
            </h2>
          </div>
        </div>

        {/* Reference Image 1 Style Warning Card */}
        <div className="rounded-xl border border-rose-500/60 bg-rose-950/40 theme-light:bg-rose-50 p-4 space-y-2 text-white theme-light:text-[#26382D]">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider font-mono">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <span>Hazard Root-Cause Diagnosis</span>
          </div>
          <p className="text-sm font-semibold leading-relaxed">
            {forensicAlert.diagnosis}
          </p>
          <div className="pt-2 border-t border-rose-500/30 flex items-center justify-between text-xs font-mono text-slate-300 theme-light:text-[#69776C]">
            <span>Cutoff Response Speed: <strong className="text-[#36B879] theme-light:text-[#347A53]">{forensicAlert.trip_latency_ms}ms</strong></span>
            <span>Fire Risk Score: <strong className="text-rose-400 font-bold">{forensicAlert.anomaly_score.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Pre-Trip Captured Telemetry Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#A6B3C1] theme-light:text-[#69776C]">
            <span className="flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-[#4B91D9]" />
              <span>Metrics Captured Instant Before Safety Cutoff</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 text-center rounded-xl border
              bg-[#192330] border-[#354456]
              theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
            ">
              <div className="text-[10px] uppercase text-[#A6B3C1] theme-light:text-[#69776C]">Voltage</div>
              <div className="text-base font-extrabold text-[#E0B34E] theme-light:text-[#B87A24] mt-0.5">
                {forensicAlert.voltage}V
              </div>
            </div>

            <div className="p-3 text-center rounded-xl border
              bg-[#192330] border-[#354456]
              theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
            ">
              <div className="text-[10px] uppercase text-[#A6B3C1] theme-light:text-[#69776C]">Current Load</div>
              <div className="text-base font-extrabold text-rose-400 mt-0.5">
                {forensicAlert.current}A
              </div>
            </div>

            <div className="p-3 text-center rounded-xl border
              bg-[#192330] border-[#354456]
              theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
            ">
              <div className="text-[10px] uppercase text-[#A6B3C1] theme-light:text-[#69776C]">Power Factor</div>
              <div className="text-base font-extrabold text-[#4B91D9] theme-light:text-[#2A6F97] mt-0.5">
                {forensicAlert.cos_phi}
              </div>
            </div>

            <div className="p-3 text-center rounded-xl border
              bg-[#192330] border-[#354456]
              theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
            ">
              <div className="text-[10px] uppercase text-[#A6B3C1] theme-light:text-[#69776C]">Plug Temp</div>
              <div className="text-base font-extrabold text-rose-400 mt-0.5">
                {forensicAlert.temperature}°C
              </div>
            </div>
          </div>
        </div>

        {/* Safety Lockout Instructions & Resident Unlock */}
        <div className="p-4 rounded-xl border space-y-3
          bg-[#192330] border-[#354456]
          theme-light:bg-[#F5F7F0] theme-light:border-[#DCE5D9]
        ">
          <div className="flex items-center space-x-2 text-xs font-bold text-white theme-light:text-[#26382D]">
            <ShieldCheck className="h-4 w-4 text-[#347A53]" />
            <span>Safety Inspection Lockout Active</span>
          </div>
          <p className="text-xs text-[#A6B3C1] theme-light:text-[#69776C] leading-relaxed">
            To protect your home from fire hazards, power will remain safely disconnected until you confirm the appliance and socket have been inspected.
          </p>

          <button
            onClick={acknowledgeSafetyLatch}
            className="w-full flex items-center justify-center space-x-2 rounded-xl py-3 text-xs font-bold text-white shadow-md transition-all
              bg-[#347A53] hover:bg-[#2A6343]
            "
          >
            <CheckSquare className="h-4 w-4" />
            <span>I Have Inspected the Circuit — Unlock Breaker</span>
          </button>
        </div>

      </div>
    </div>
  );
};
