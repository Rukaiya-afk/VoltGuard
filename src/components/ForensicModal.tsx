'use client';

import React from 'react';
import { 
  Flame, 
  Clock, 
  AlertOctagon, 
  CheckSquare, 
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';

export const ForensicModal: React.FC = () => {
  const { 
    forensicModalOpen, 
    forensicAlert, 
    acknowledgeSafetyLatch, 
    setForensicModalOpen 
  } = useVoltStore();

  if (!forensicModalOpen || !forensicAlert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-rose-500 bg-slate-900 p-6 sm:p-8 shadow-2xl relative space-y-6 overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-600 animate-pulse" />

        <button
          onClick={() => setForensicModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title Header */}
        <div className="flex items-start space-x-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <Flame className="h-7 w-7 animate-pulse text-rose-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded bg-rose-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                AUTOMATIC SAFETY TRIP
              </span>
              <span className="text-xs text-slate-400 font-mono">{forensicAlert.timestamp}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Safety Shutoff Report: {forensicAlert.outlet_name}
            </h2>
          </div>
        </div>

        {/* High-Contrast Hazard Diagnosis Box */}
        <div className="rounded-xl border border-rose-500/60 bg-rose-950/60 p-4 space-y-2 text-white">
          <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
            <AlertOctagon className="h-4 w-4 text-rose-400" />
            <span>Hazard Diagnosis</span>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {forensicAlert.diagnosis}
          </p>
          <div className="pt-2 border-t border-rose-500/40 flex items-center justify-between text-xs font-mono text-slate-200">
            <span>Cutoff Response Speed: <strong className="text-teal-300">{forensicAlert.trip_latency_ms}ms</strong></span>
            <span>Fire Risk Score: <strong className="text-rose-300 font-bold">{forensicAlert.anomaly_score.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Pre-Trip Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>Metrics Captured Instant Before Shutoff</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Voltage</div>
              <div className="text-base font-extrabold text-amber-400 font-mono mt-0.5">
                {forensicAlert.voltage} V
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Current Load</div>
              <div className="text-base font-extrabold text-rose-400 font-mono mt-0.5">
                {forensicAlert.current} A
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Power Factor</div>
              <div className="text-base font-extrabold text-cyan-400 font-mono mt-0.5">
                {forensicAlert.cos_phi}
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Plug Temp</div>
              <div className="text-base font-extrabold text-rose-400 font-mono mt-0.5">
                {forensicAlert.temperature} °C
              </div>
            </div>
          </div>
        </div>

        {/* Safety Lockout Instructions */}
        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
            <ShieldCheck className="h-4 w-4 text-teal-400" />
            <span>Safety Inspection Lockout Active</span>
          </div>
          <p className="text-xs text-slate-300">
            To protect your home from fire hazards, power will remain safely disconnected until you confirm the appliance and socket have been inspected.
          </p>

          <button
            onClick={acknowledgeSafetyLatch}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md hover:bg-teal-500 transition-all"
          >
            <CheckSquare className="h-4 w-4" />
            <span>I Have Inspected the Circuit — Unlock Breaker</span>
          </button>
        </div>

      </div>
    </div>
  );
};
