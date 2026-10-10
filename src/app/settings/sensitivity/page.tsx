'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders, ShieldAlert, Cpu } from 'lucide-react';
import { Header } from '@/components/Header';
import { useVoltStore } from '@/lib/store';

export default function SensitivitySettingsPage() {
  const { settings, updateSettings } = useVoltStore();

  const handleSensitivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ anomalySensitivity: parseFloat(e.target.value) });
  };

  return (
    <div className={`min-h-screen theme-${settings.theme} transition-colors duration-200`}>
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/settings"
              className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Settings Hub</span>
            </Link>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 font-mono">Partition 04</div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <Sliders className="h-6 w-6 text-amber-400" />
                <span>Sensor & Anomaly Sensitivity</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl backdrop-blur-md">
          <div className="text-xs font-semibold text-slate-300">
            Set how sensitive the fire safety system should be. If sparks, wire overheating, or high voltage spikes are detected, the system will automatically alert you and protect your appliances.
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Hazard Sensitivity Level</div>
                <div className="text-xs text-slate-400">Higher values detect smaller electrical irregularities</div>
              </div>
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 px-5 py-2 text-2xl font-extrabold text-amber-400 font-mono">
                {settings.anomalySensitivity.toFixed(2)}
              </div>
            </div>

            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.01"
              value={settings.anomalySensitivity}
              onChange={handleSensitivityChange}
              className="w-full accent-amber-400 cursor-pointer h-3 bg-slate-900 rounded-lg border border-slate-800"
            />

            <div className="grid grid-cols-3 gap-4 text-[11px] font-mono border-t border-slate-800 pt-4">
              <div className="space-y-1">
                <div className="font-bold text-teal-400">0.50 - 0.65</div>
                <div className="text-slate-400 text-[10px]">High Protection (Recommended for older homes)</div>
              </div>

              <div className="space-y-1 text-center">
                <div className="font-bold text-amber-400">0.70 - 0.80 (Default)</div>
                <div className="text-slate-400 text-[10px]">Standard Protection (Best for typical Kothrud residences)</div>
              </div>

              <div className="space-y-1 text-right">
                <div className="font-bold text-rose-400">0.85 - 0.95</div>
                <div className="text-slate-400 text-[10px]">Critical Alerts Only (Emergency hazard trips only)</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
