'use client';

import React, { useEffect, useState } from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  Building, 
  UserCheck, 
  AlertTriangle 
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';

export const EmergencyCallModal: React.FC = () => {
  const { emergencyCallState, dismissEmergencyCall } = useVoltStore();
  const [callProgress, setCallProgress] = useState<'DIALING' | 'SPEAKING' | 'DISPATCHED'>('DIALING');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!emergencyCallState) return;

    setCallProgress('DIALING');
    setSeconds(0);

    const dialTimer = setTimeout(() => {
      setCallProgress('SPEAKING');
    }, 2000);

    const dispatchTimer = setTimeout(() => {
      setCallProgress('DISPATCHED');
    }, 5500);

    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      clearTimeout(dialTimer);
      clearTimeout(dispatchTimer);
      clearInterval(interval);
    };
  }, [emergencyCallState]);

  if (!emergencyCallState) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-rose-500/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 glow-crimson">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-rose-600 to-red-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full animate-bounce">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide flex items-center space-x-2">
                <span>AUTOMATED FIRE EMERGENCY CALL</span>
              </h2>
              <p className="text-xs text-rose-100">VoltGuard Fire Mitigation & Dispatch Engine</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-black/30 border border-white/20 text-xs font-mono font-bold rounded-full animate-pulse">
            LIVE PROTOCOL
          </span>
        </div>

        {/* Call Animation Area */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center animate-ping absolute inset-0 opacity-75" />
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-rose-400 flex items-center justify-center relative z-10">
                <PhoneCall className="w-8 h-8 text-rose-400 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                {callProgress === 'DIALING' && 'Connecting Emergency Line...'}
                {callProgress === 'SPEAKING' && 'Automated Voice Alert in Progress...'}
                {callProgress === 'DISPATCHED' && 'Fire Control & Grid Alerted!'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Target: <span className="text-rose-400 font-semibold">{emergencyCallState.recipientName}</span> ({emergencyCallState.recipientPhone})
              </p>
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs">
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Call Duration: {seconds}s</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Power Safely Cut in 12ms</span>
              </div>
            </div>
          </div>

          {/* Hazard Summary Card */}
          <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Hazard Details Broadcasted to Fire Control:</span>
            </div>
            <p className="text-sm text-slate-300 font-medium">
              {emergencyCallState.diagnosis}
            </p>
            <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
              <span>📍 Address: <strong className="text-slate-200">{emergencyCallState.hazardLocation}</strong></span>
              <span>⚡ Circuit: <strong className="text-slate-200">{emergencyCallState.outletName}</strong></span>
            </div>
          </div>

          {/* Senior-Friendly Essential Safety Steps */}
          <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center space-x-1.5 text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Important Fire Precautions for Residents:</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300 pl-4 list-disc">
              <li><strong>Do not touch bare wires</strong> or attempt manual reset while red warning flashes.</li>
              <li><strong>Do not use water</strong> on electrical appliance hazards.</li>
              <li>If smoke or fire is visible, <strong>evacuate the room immediately</strong>.</li>
              <li>Certified emergency electrician has been notified to inspect terminal lugs.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={dismissEmergencyCall}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center justify-center space-x-2 transition"
            >
              <PhoneOff className="w-4 h-4 text-slate-400" />
              <span>Acknowledge & Close Banner</span>
            </button>
            <a
              href="tel:1921"
              className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition"
            >
              <Building className="w-4 h-4" />
              <span>Direct Dial Pune Emergency Contact (1921)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
