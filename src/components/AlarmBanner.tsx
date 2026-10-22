'use client';

import React from 'react';
import { Flame, RotateCcw, Eye, VolumeX, Volume2, AlertTriangle, Power, Wrench, ShieldAlert } from 'lucide-react';
import { useVoltStore } from '@/lib/store';

export const AlarmBanner: React.FC = () => {
  const { 
    globalAnomaly, 
    forensicAlert, 
    spikedHazardNotice,
    toggleBreaker,
    setForensicModalOpen, 
    globalSafetyReset,
    audioMuted,
    toggleAudioMute
  } = useVoltStore();

  if (!globalAnomaly && !forensicAlert && !spikedHazardNotice) return null;

  return (
    <div className="w-full bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 border-b-2 border-rose-400 text-white shadow-2xl animate-pulse z-30">
      
      {/* If this is the active Spiked Account hazard */}
      {spikedHazardNotice ? (
        <div className="mx-auto max-w-7xl px-4 py-3 space-y-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-black/30 border border-white/20 animate-bounce shrink-0 mt-0.5">
                <Flame className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="font-extrabold uppercase bg-black/50 px-2.5 py-0.5 rounded text-[11px] border border-amber-400/50 text-amber-300 font-mono tracking-wider">
                    ⚡ ACTIVE CURRENT SPIKE • ALARM ACTIVE
                  </span>
                  <span className="text-xs font-bold text-white">
                    Load Spiked to {spikedHazardNotice.currentAmps}A (Rating {spikedHazardNotice.ratedAmps}A Exceeded) • {spikedHazardNotice.temperature}°C
                  </span>
                </div>
                <p className="text-xs font-medium text-rose-100 mt-1 max-w-3xl leading-relaxed">
                  {spikedHazardNotice.hazard}
                </p>
                <div className="text-[11px] font-semibold text-amber-200 mt-1 flex items-center space-x-1.5">
                  <Wrench className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                  <span><strong>Immediate Action Required:</strong> {spikedHazardNotice.immediateFix}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 shrink-0 self-end md:self-center">
              <button
                onClick={() => toggleBreaker(spikedHazardNotice.outletId, 'TRIPPED')}
                id="trip-spiked-breaker-btn"
                className="flex items-center space-x-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-rose-950 hover:bg-slate-100 transition-transform transform hover:scale-105 shadow-xl border-2 border-white"
                title="Trip circuit breaker to safely cut power and silence the alarm"
              >
                <Power className="h-4 w-4 text-rose-700" />
                <span>Trip Breaker via App (Silences Alarm)</span>
              </button>

              <button
                onClick={toggleAudioMute}
                className="rounded-xl bg-black/40 p-2 text-white hover:bg-black/60 transition-colors border border-white/20"
                title={audioMuted ? 'Unmute Alarm Sound' : 'Mute Alarm Sound'}
              >
                {audioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Global Anomaly / Forensic Cutoff Banner */
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold px-4 py-2.5">
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
      )}

    </div>
  );
};
