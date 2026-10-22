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
  Wifi
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { FaultMode } from '@/lib/types';
import { AddApplianceModal } from './AddApplianceModal';

export const SwitchboardTab: React.FC = () => {
  const { outlets, toggleBreaker, injectFault, safetyLatchLocked, onboardingModalOpen, setOnboardingModalOpen } = useVoltStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleFaultChange = (outletId: string, value: string) => {
    injectFault(outletId, value as FaultMode);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Appliance Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/60 p-5 backdrop-blur-md gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Home Circuit Switches</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor and control power to all major home appliances safely
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-teal-600 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Appliance / Circuit</span>
          </button>
        </div>
      </div>

      {/* Grid of Monitored Circuit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.values(outlets).map((outlet) => {
          const isTripped = outlet.breaker_state === 'TRIPPED';
          const isAnomalous = outlet.status === 'anomalous';
          const isInrush = outlet.status === 'inrush';
          const isEvHazard = outlet.id === 'ev_charger' && (isAnomalous || outlet.terminal_temp > 60 || outlet.anomaly_score > 0.6);

          return (
            <div
              key={outlet.id}
              className={`rounded-2xl border p-5 transition-all relative space-y-4 ${
                isTripped
                  ? 'border-rose-300 bg-rose-50/60 shadow-md dark:border-rose-900/60 dark:bg-slate-950/90'
                  : isEvHazard || isAnomalous
                  ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/30 glow-crimson'
                  : isInrush
                  ? 'border-blue-300 bg-blue-50/60 dark:border-blue-500/50 dark:bg-blue-950/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700'
              }`}
            >
              {/* Image thumbnail if present */}
              {outlet.imageUrl && (
                <div className="h-24 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={outlet.imageUrl} alt={outlet.name} className="h-full w-full object-cover" />
                </div>
              )}

              {/* Header: Appliance Name & Status Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <span>{outlet.name}</span>
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {outlet.modelNumber ? outlet.modelNumber : `Max Safe Load: ${outlet.trip_current}A`}
                  </div>
                </div>

                <div>
                  {isTripped ? (
                    <span className="inline-flex items-center space-x-1 rounded-full bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-500/20 dark:border-rose-500/40 px-2.5 py-0.5 text-xs font-bold dark:text-rose-400">
                      <Flame className="h-3.5 w-3.5 animate-pulse" />
                      <span>TRIPPED</span>
                    </span>
                  ) : isEvHazard || isAnomalous ? (
                    <span className="inline-flex items-center space-x-1 rounded-full bg-rose-600 border border-rose-400 px-2.5 py-0.5 text-xs font-bold text-white animate-pulse">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>FIRE HAZARD!</span>
                    </span>
                  ) : isInrush ? (
                    <span className="inline-flex items-center space-x-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-500/20 dark:border-blue-500/40 px-2.5 py-0.5 text-xs font-semibold dark:text-blue-400">
                      <Activity className="h-3.5 w-3.5 animate-spin" />
                      <span>Motor Starting</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-slate-950/80 dark:border-slate-800 px-2.5 py-0.5 text-xs font-bold dark:text-emerald-300 shadow-xs">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Safe</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Highlighted Metrics Grid (Clean, Tactile, High-Contrast) */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="rounded-xl border border-slate-200/90 bg-slate-100/90 p-2.5 text-center shadow-xs dark:border-slate-800/90 dark:bg-slate-950/80">
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Voltage</div>
                  <div className={`text-sm font-bold mt-0.5 ${outlet.voltage < 185 && !isTripped ? 'text-amber-600 dark:text-amber-400' : 'text-teal-700 dark:text-teal-400'}`}>
                    {outlet.voltage.toFixed(1)} V
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-slate-100/90 p-2.5 text-center shadow-xs dark:border-slate-800/90 dark:bg-slate-950/80">
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Current Load</div>
                  <div className={`text-sm font-bold mt-0.5 ${outlet.current > outlet.rated_current ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-200'}`}>
                    {outlet.current.toFixed(1)} A
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-slate-100/90 p-2.5 text-center shadow-xs dark:border-slate-800/90 dark:bg-slate-950/80">
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Power Draw</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {Math.round(outlet.power_watts)} W
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-slate-100/90 p-2.5 text-center shadow-xs dark:border-slate-800/90 dark:bg-slate-950/80">
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Plug Temp</div>
                  <div className={`text-sm font-bold mt-0.5 ${outlet.terminal_temp > 60 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-300'}`}>
                    {outlet.terminal_temp.toFixed(1)} °C
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => toggleBreaker(outlet.id, isTripped ? 'CLOSED' : 'TRIPPED')}
                  disabled={isTripped && safetyLatchLocked}
                  className={`w-full flex items-center justify-center space-x-2 rounded-xl py-2 text-xs font-bold transition-all ${
                    isTripped
                      ? safetyLatchLocked
                        ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                        : 'bg-teal-600 text-white hover:bg-teal-500 shadow-md'
                      : 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 font-bold dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40 dark:hover:bg-rose-500/30'
                  }`}
                >
                  <Power className="h-4 w-4" />
                  <span>{isTripped ? 'Restore Power' : 'Turn Off / Trip Circuit'}</span>
                </button>

                <div className="flex items-center space-x-1 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0 font-medium">Simulate Test:</span>
                  <select
                    value={outlet.fault_mode}
                    onChange={(e) => handleFaultChange(outlet.id, e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 shadow-xs"
                  >
                    <option value="none">Normal Running</option>
                    <option value="inrush">Motor Starting Inrush</option>
                    <option value="stall">Low Voltage Stall</option>
                    <option value="micro_arc">Sparking Loose Contact</option>
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
