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
  const { emergencyCallState, dismissEmergencyCall, settings } = useVoltStore();
  const isLight = settings.theme === 'light';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-xl border-2 rounded-2xl shadow-2xl overflow-hidden transition-all ${
        isLight 
          ? 'bg-white border-[#C93B46] text-[#26382D]' 
          : 'bg-[#182431] border-[#E45B63] text-[#E8EEF5]'
      }`}>
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full animate-bounce">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide flex items-center space-x-2">
                <span>FIRE ALERT & EMERGENCY CALL</span>
              </h2>
              <p className="text-xs text-rose-100 font-medium">Automatic Power Cut • Emergency Help Notified</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-black/30 border border-white/20 text-xs font-mono font-bold rounded-full animate-pulse">
            SAFETY LATCH
          </span>
        </div>

        {/* Call Animation Area */}
        <div className="p-6 space-y-5">
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-1">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center animate-ping absolute inset-0 opacity-75" />
              <div className={`w-20 h-20 rounded-full border-2 border-rose-500 flex items-center justify-center relative z-10 ${
                isLight ? 'bg-rose-50' : 'bg-[#273648]'
              }`}>
                <PhoneCall className="w-8 h-8 text-rose-500 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className={`text-xl font-bold ${isLight ? 'text-[#26382D]' : 'text-white'}`}>
                {callProgress === 'DIALING' && 'Connecting Emergency Line...'}
                {callProgress === 'SPEAKING' && 'Automated Voice Alert in Progress...'}
                {callProgress === 'DISPATCHED' && 'Fire Control & Grid Alerted!'}
              </h3>
              <p className={`text-sm mt-1 ${isLight ? 'text-[#69776C]' : 'text-[#A6B3C1]'}`}>
                Target: <span className="text-rose-600 dark:text-rose-400 font-bold">{emergencyCallState.recipientName}</span> ({emergencyCallState.recipientPhone})
              </p>
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                isLight ? 'bg-[#F5F7F0] border-[#DCE5D9] text-[#26382D]' : 'bg-[#202D3D] border-[#354456] text-[#E8EEF5]'
              }`}>
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Call Duration: {seconds}s</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#347A53]/15 border border-[#347A53]/40 text-[#347A53] dark:text-[#36B879] text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Power Safely Cut in 12ms</span>
              </div>
            </div>
          </div>

          {/* Hazard Summary Card */}
          <div className={`border rounded-xl p-4 space-y-2 ${
            isLight 
              ? 'bg-rose-50/70 border-rose-200 text-[#26382D]' 
              : 'bg-[#202D3D] border-rose-500/30 text-[#E8EEF5]'
          }`}>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Hazard Details Broadcasted to Fire Control:</span>
            </div>
            <p className={`text-sm font-medium ${isLight ? 'text-rose-950' : 'text-rose-100'}`}>
              {emergencyCallState.diagnosis}
            </p>
            <div className={`text-xs flex items-center justify-between pt-2 border-t ${
              isLight ? 'border-rose-200 text-[#69776C]' : 'border-rose-500/20 text-[#A6B3C1]'
            }`}>
              <span>📍 Address: <strong className={isLight ? 'text-[#26382D]' : 'text-white'}>{emergencyCallState.hazardLocation}</strong></span>
              <span>⚡ Circuit: <strong className={isLight ? 'text-[#26382D]' : 'text-white'}>{emergencyCallState.outletName}</strong></span>
            </div>
          </div>

          {/* Senior-Friendly Essential Safety Steps */}
          <div className={`border rounded-xl p-4 text-xs space-y-2 ${
            isLight 
              ? 'bg-amber-50 border-amber-300 text-amber-950' 
              : 'bg-[#273648] border-amber-500/50 text-[#E8EEF5]'
          }`}>
            <h4 className={`font-bold flex items-center space-x-1.5 text-sm ${
              isLight ? 'text-amber-900' : 'text-amber-300'
            }`}>
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Important Fire Precautions for Residents:</span>
            </h4>
            <ul className={`space-y-1.5 pl-4 list-disc font-medium ${
              isLight ? 'text-amber-900' : 'text-[#E8EEF5]'
            }`}>
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
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition border ${
                isLight
                  ? 'bg-[#E8EFDF] hover:bg-[#D4E4D0] border-[#DCE5D9] text-[#26382D]'
                  : 'bg-[#273648] hover:bg-[#354456] border-[#354456] text-[#E8EEF5]'
              }`}
            >
              <PhoneOff className="w-4 h-4 opacity-70" />
              <span>Acknowledge & Close</span>
            </button>
            <a
              href="tel:1921"
              className="flex-1 py-3 px-4 rounded-xl bg-[#C93B46] hover:bg-[#a92b35] text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition"
            >
              <Building className="w-4 h-4" />
              <span>Direct Dial Emergency (1921)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
