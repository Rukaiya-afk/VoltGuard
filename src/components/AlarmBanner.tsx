'use client';

import React from 'react';
import { Flame, RotateCcw, Eye, VolumeX, Volume2 } from 'lucide-react';
import { useVoltStore } from '@/lib/store';

export const AlarmBanner: React.FC = () => {
  const { 
    globalAnomaly, 
    forensicAlert, 
    setForensicModalOpen, 
    globalSafetyReset,
    audioMuted,
    toggleAudioMute
  } = useVoltStore();

  if (!globalAnomaly && !forensicAlert) return null;

  return (
    <div className="w-full bg-rose-600 border-b border-rose-400 px-4 py-2.5 text-white shadow-xl animate-pulse">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
        
        <div className="flex items-center space-x-2">
          <Flame className="h-5 w-5 text-white animate-bounce shrink-0" />
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="font-bold uppercase bg-slate-950/40 px-2 py-0.5 rounded border border-white/20">
              SAFETY EMERGENCY CUTOFF
            </span>
            <span>
              {forensicAlert ? `${forensicAlert.outlet_name}: Circuit Tripped to Prevent Electrical Fire!` : 'Hazard Detected - Power Disconnected'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setForensicModalOpen(true)}
            className="flex items-center space-x-1 rounded-lg bg-slate-950/60 px-3 py-1 text-[11px] font-bold text-white hover:bg-slate-950 transition-colors border border-white/20"
          >
            <Eye className="h-3.5 w-3.5 text-cyan-400" />
            <span>View Safety Report</span>
          </button>

          <button
            onClick={globalSafetyReset}
            className="flex items-center space-x-1 rounded-lg bg-white px-3 py-1 text-[11px] font-bold text-rose-950 hover:bg-slate-100 transition-colors shadow"
          >
            <RotateCcw className="h-3.5 w-3.5 text-rose-600" />
            <span>Reset Safety</span>
          </button>

          <button
            onClick={toggleAudioMute}
            className="rounded-lg bg-slate-950/60 p-1 text-white hover:bg-slate-950 transition-colors border border-white/20"
            title={audioMuted ? 'Unmute Alarm Sound' : 'Mute Alarm Sound'}
          >
            {audioMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
        </div>

      </div>
    </div>
  );
};
