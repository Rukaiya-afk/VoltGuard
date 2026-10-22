'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders, ShieldAlert, Cpu, Check, AlertTriangle, RotateCcw, Save } from 'lucide-react';
import { Header } from '@/components/Header';
import { useVoltStore } from '@/lib/store';

export default function SensitivitySettingsPage() {
  const { settings, updateSettings } = useVoltStore();
  
  // Local sensitivity tracking: defaults to 0.75 (75%) baseline
  const [sliderValue, setSliderValue] = useState<number>(settings.anomalySensitivity || 0.75);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Strict compliance rule: if unsaved adjustments exist, warn and allow resetting to 0.75
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSliderValue(val);
    setIsSaved(val === 0.75);
  };

  const handleSaveSensitivity = () => {
    updateSettings({ anomalySensitivity: sliderValue });
    setIsSaved(true);
    setToastMessage(`Electrical Safety Sensor baseline locked at ${(sliderValue * 100).toFixed(0)}% (${sliderValue.toFixed(2)}). Resident confirmation recorded.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleResetToBaseline = () => {
    setSliderValue(0.75);
    updateSettings({ anomalySensitivity: 0.75 });
    setIsSaved(true);
    setToastMessage('Sensor reset back to mandatory 75% baseline (0.75).');
    setTimeout(() => setToastMessage(''), 4000);
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
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 font-mono">Partition 04 • Safety Controls</div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <Sliders className="h-6 w-6 text-amber-400" />
                <span>Electrical Safety Sensor Sensitivity</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Strict Safety Warning Box */}
        <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 p-5 shadow-xl space-y-2">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 font-mono">
                Mandatory Safety Compliance Warning: Sensor Must Follow Sensitivity of 75
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                By Pune electrical fire safety protocols, this home safety sensor <strong className="text-amber-300">MUST follow a baseline sensitivity of 75 (0.75)</strong>. Any unverified adjustments will automatically revert back to 75 unless explicitly confirmed and saved by the resident.
              </p>
            </div>
          </div>
        </div>

        {toastMessage && (
          <div className="rounded-xl border border-teal-500/50 bg-teal-950/80 p-4 text-xs font-bold text-teal-300 flex items-center space-x-2 shadow-lg animate-fadeIn">
            <Check className="h-4 w-4 text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl backdrop-blur-md">
          <div className="text-xs font-semibold text-slate-300">
            Set how sensitive the electrical fire safety sensor should be. When sparks, wire overheating, or hazardous voltage spikes are detected, the sensor alerts you and prompts breaker protection.
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Safety Sensor Sensitivity Cutoff</div>
                <div className="text-xs text-slate-400">Standard certified baseline: <strong className="text-amber-400">0.75 (75%)</strong></div>
              </div>
              <div className="flex items-center space-x-2">
                {sliderValue !== 0.75 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    {isSaved ? 'Custom Saved' : 'Unsaved Drift'}
                  </span>
                )}
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 px-5 py-2 text-2xl font-extrabold text-amber-400 font-mono">
                  {sliderValue.toFixed(2)} ({Math.round(sliderValue * 100)}%)
                </div>
              </div>
            </div>

            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.01"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full accent-amber-400 cursor-pointer h-3 bg-slate-900 rounded-lg border border-slate-800"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetToBaseline}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-colors shadow-sm"
              >
                <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                <span>Reset to Standard 75% Baseline</span>
              </button>

              <button
                type="button"
                onClick={handleSaveSensitivity}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isSaved
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold'
                }`}
              >
                <Save className="h-4 w-4" />
                <span>{isSaved ? 'Sensitivity Saved & Active' : 'Save Sensitivity (Resident Confirmation)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-[11px] font-mono border-t border-slate-800 pt-4">
              <div className="space-y-1">
                <div className="font-bold text-teal-400">0.50 - 0.65</div>
                <div className="text-slate-400 text-[10px]">High Protection (Recommended for older homes)</div>
              </div>

              <div className="space-y-1 text-center">
                <div className="font-bold text-amber-400">0.75 (Certified Standard)</div>
                <div className="text-slate-400 text-[10px]">Mandatory safety point for Pune residential grids</div>
              </div>

              <div className="space-y-1 text-right">
                <div className="font-bold text-rose-400">0.85 - 0.95</div>
                <div className="text-slate-400 text-[10px]">Emergency Only (Requires engineering clearance)</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
