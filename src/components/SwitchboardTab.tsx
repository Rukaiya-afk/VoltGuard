'use client';

import React, { useState } from 'react';
import { 
  Power, 
  Flame, 
  Activity, 
  Zap, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Plus, 
  Sliders,
  RotateCcw,
  Sparkles,
  Gauge
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { FaultMode } from '@/lib/types';
import { AddApplianceModal } from './AddApplianceModal';

export const SwitchboardTab: React.FC = () => {
  const { 
    outlets, 
    toggleBreaker, 
    injectFault, 
    safetyLatchLocked, 
    onboardingModalOpen, 
    setOnboardingModalOpen,
    settings 
  } = useVoltStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleFaultChange = (outletId: string, value: string) => {
    injectFault(outletId, value as FaultMode);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner with Add Appliance Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border p-5 backdrop-blur-md gap-4 shadow-sm
        bg-[#202D3D] border-[#354456] text-[#E8EEF5]
        theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
      ">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold tracking-tight text-white theme-light:text-[#26382D]">
              Digital Twin Switchboard
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-[#36B879]/15 text-[#36B879] border border-[#36B879]/30 theme-light:bg-[#D4E4D0] theme-light:text-[#347A53] theme-light:border-[#77A985]">
              ACTIVE TELEMETRY SYNC
            </span>
          </div>
          <p className="text-xs text-[#A6B3C1] theme-light:text-[#69776C] mt-1">
            Real-time sub-20ms circuit breaker tripping, load monitoring, and isolation fault diagnostics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md transition-all
              bg-[#347A53] text-white hover:bg-[#2A6343]
              theme-light:bg-[#347A53] theme-light:hover:bg-[#2A6343]
            "
          >
            <Plus className="h-4 w-4" />
            <span>Add Circuit / Load</span>
          </button>
        </div>
      </div>

      {/* Grid of Industrial Monitored Circuit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.values(outlets).map((outlet) => {
          const isTripped = outlet.breaker_state === 'TRIPPED';
          const isAnomalous = outlet.status === 'anomalous';
          const isInrush = outlet.status === 'inrush';
          const isEvHazard = outlet.id === 'ev_charger' && (isAnomalous || outlet.terminal_temp > 60 || outlet.anomaly_score > 0.6);

          // Calculate load percentage of rated capacity
          const loadPercent = Math.min(Math.round((outlet.current / outlet.trip_current) * 100), 100);

          return (
            <div
              key={outlet.id}
              className={`rounded-2xl border p-5 transition-all relative space-y-4 shadow-sm flex flex-col justify-between ${
                isTripped
                  ? 'border-rose-500/80 bg-rose-950/20 theme-light:bg-rose-50/70 theme-light:border-rose-300'
                  : isEvHazard || isAnomalous
                  ? 'border-amber-500 bg-amber-950/20 theme-light:bg-amber-50/70 theme-light:border-amber-300 glow-crimson'
                  : isInrush
                  ? 'border-blue-500/60 bg-blue-950/20 theme-light:bg-blue-50/60 theme-light:border-blue-300'
                  : 'bg-[#202D3D] border-[#354456] theme-light:bg-white theme-light:border-[#DCE5D9] hover:border-slate-400/40'
              }`}
            >
              <div className="space-y-4">
                {/* Circuit Header: Name, Model, and Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white theme-light:text-[#26382D] flex items-center space-x-1.5">
                      <span>{outlet.name}</span>
                    </h3>
                    <div className="text-[11px] text-[#A6B3C1] theme-light:text-[#69776C] font-mono mt-0.5">
                      {outlet.modelNumber ? outlet.modelNumber : `Trip Limit: ${outlet.trip_current}A Rated`}
                    </div>
                  </div>

                  <div>
                    {isTripped ? (
                      <span className="inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-rose-500/20 border border-rose-500/40 text-rose-400 theme-light:bg-rose-100 theme-light:text-rose-700 theme-light:border-rose-300 animate-pulse">
                        <Flame className="h-3.5 w-3.5" />
                        <span>TRIPPED</span>
                      </span>
                    ) : isEvHazard || isAnomalous ? (
                      <span className="inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 theme-light:bg-amber-100 theme-light:text-amber-800 theme-light:border-amber-300 animate-pulse">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>ANOMALOUS</span>
                      </span>
                    ) : isInrush ? (
                      <span className="inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-[#4B91D9]/20 border border-[#4B91D9]/40 text-[#4B91D9] theme-light:bg-blue-100 theme-light:text-blue-700 theme-light:border-blue-300">
                        <Activity className="h-3.5 w-3.5 animate-spin" />
                        <span>INRUSH SURGE</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-[#36B879]/15 border border-[#36B879]/30 text-[#36B879] theme-light:bg-[#D4E4D0] theme-light:text-[#347A53] theme-light:border-[#77A985]">
                        <span className="h-2 w-2 rounded-full bg-[#36B879] theme-light:bg-[#347A53] animate-pulse" />
                        <span>NORMAL</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Circuit Load Bar Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#A6B3C1] theme-light:text-[#69776C]">
                    <span>Current Capacity: {loadPercent}%</span>
                    <span>Max {outlet.trip_current}A</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800/40 theme-light:bg-[#DCE5D9] overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isTripped ? 'bg-slate-600' :
                        loadPercent > 85 ? 'bg-rose-500' :
                        loadPercent > 60 ? 'bg-amber-400' :
                        'bg-[#36B879] theme-light:bg-[#347A53]'
                      }`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                </div>

                {/* Detailed 6-Point Industrial Telemetry Quadrant */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  
                  {/* RMS Voltage */}
                  <div className="p-2 rounded-xl border text-center
                    bg-[#192330] border-[#354456]
                    theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
                  ">
                    <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C] font-semibold">Voltage</div>
                    <div className={`text-xs font-bold mt-0.5 ${
                      outlet.voltage < 185 && !isTripped ? 'text-amber-400 font-black' : 'text-[#4B91D9] theme-light:text-[#2A6F97]'
                    }`}>
                      {outlet.voltage.toFixed(1)}V
                    </div>
                  </div>

                  {/* RMS Current */}
                  <div className="p-2 rounded-xl border text-center
                    bg-[#192330] border-[#354456]
                    theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
                  ">
                    <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C] font-semibold">Current</div>
                    <div className={`text-xs font-bold mt-0.5 ${
                      outlet.current > outlet.rated_current ? 'text-rose-400' : 'text-white theme-light:text-[#26382D]'
                    }`}>
                      {outlet.current.toFixed(1)}A
                    </div>
                  </div>

                  {/* Running Power */}
                  <div className="p-2 rounded-xl border text-center
                    bg-[#192330] border-[#354456]
                    theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
                  ">
                    <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C] font-semibold">Power</div>
                    <div className="text-xs font-bold text-white theme-light:text-[#26382D] mt-0.5">
                      {Math.round(outlet.power_watts)}W
                    </div>
                  </div>

                  {/* Power Factor (cos φ) */}
                  <div className="p-2 rounded-xl border text-center
                    bg-[#192330] border-[#354456]
                    theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
                  ">
                    <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C] font-semibold">Power Factor</div>
                    <div className="text-xs font-bold text-[#36B879] theme-light:text-[#347A53] mt-0.5">
                      {outlet.cos_phi.toFixed(2)}
                    </div>
                  </div>

                  {/* Lug Terminal Temperature */}
                  <div className="p-2 rounded-xl border text-center
                    bg-[#192330] border-[#354456]
                    theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
                  ">
                    <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C] font-semibold">Lug Temp</div>
                    <div className={`text-xs font-bold mt-0.5 ${
                      outlet.terminal_temp > 60 ? 'text-rose-400 font-black' : 'text-white theme-light:text-[#26382D]'
                    }`}>
                      {outlet.terminal_temp.toFixed(1)}°C
                    </div>
                  </div>

                  {/* Anomaly Score */}
                  <div className="p-2 rounded-xl border text-center
                    bg-[#192330] border-[#354456]
                    theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
                  ">
                    <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C] font-semibold">AI Risk</div>
                    <div className={`text-xs font-bold mt-0.5 ${
                      outlet.anomaly_score > 0.70 ? 'text-rose-400' : 'text-[#36B879] theme-light:text-[#347A53]'
                    }`}>
                      {outlet.anomaly_score.toFixed(2)}
                    </div>
                  </div>

                </div>
              </div>

              {/* Card Actions Footer: Breaker Switch & Fault Injector */}
              <div className="pt-3 border-t border-inherit space-y-2">
                <button
                  onClick={() => toggleBreaker(outlet.id, isTripped ? 'CLOSED' : 'TRIPPED')}
                  disabled={isTripped && safetyLatchLocked}
                  className={`w-full flex items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-bold transition-all shadow-sm ${
                    isTripped
                      ? safetyLatchLocked
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed theme-light:bg-slate-200 theme-light:text-slate-400'
                        : 'bg-[#36B879] text-[#111820] hover:bg-[#2fa068] theme-light:bg-[#347A53] theme-light:text-white'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25 theme-light:bg-rose-50 theme-light:text-rose-700 theme-light:border-rose-300'
                  }`}
                >
                  <Power className="h-4 w-4" />
                  <span>{isTripped ? (safetyLatchLocked ? 'LOCKED BY SAFETY LATCH' : 'Restore Circuit Breaker') : 'Open Breaker / Cut Power'}</span>
                </button>

                <div className="flex items-center space-x-1.5 text-[11px]">
                  <span className="text-[#A6B3C1] theme-light:text-[#69776C] shrink-0 font-medium">Fault Test:</span>
                  <select
                    value={outlet.fault_mode}
                    onChange={(e) => handleFaultChange(outlet.id, e.target.value)}
                    className="w-full rounded-lg px-2 py-1 text-[11px] font-mono border
                      bg-[#192330] border-[#354456] text-white
                      theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                    "
                  >
                    <option value="none">Normal Operation</option>
                    <option value="inrush">Motor Starting Inrush Surge</option>
                    <option value="stall">Low Voltage Stall (&lt;180V)</option>
                    <option value="micro_arc">Loose Contact Micro-Arcing</option>
                    <option value="outbreak">🔥 Fire Outbreak Hazard</option>
                  </select>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <AddApplianceModal
        isOpen={isAddModalOpen || onboardingModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setOnboardingModalOpen(false);
        }}
      />
    </div>
  );
};
