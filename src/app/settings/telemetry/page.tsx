'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Radio, Zap, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { useVoltStore } from '@/lib/store';
import { RefreshRate } from '@/lib/types';

export default function TelemetrySettingsPage() {
  const { settings, updateSettings } = useVoltStore();

  const handleRefreshRateChange = (refreshRate: RefreshRate) => {
    updateSettings({ refreshRate });
  };

  const rates: Array<{ rate: RefreshRate; title: string; ms: string; desc: string }> = [
    {
      rate: 500,
      title: 'Ultra Fast',
      ms: '500 ms',
      desc: 'Real-time 2Hz streaming frequency. Highest temporal resolution for transient arc detection.'
    },
    {
      rate: 1000,
      title: 'Balanced Standard',
      ms: '1000 ms',
      desc: '1Hz stream refresh rate. Recommended for typical residential monitoring.'
    },
    {
      rate: 2000,
      title: 'Eco Power Saver',
      ms: '2000 ms',
      desc: '0.5Hz stream refresh rate. Conserves battery and minimizes network traffic.'
    }
  ];

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
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 font-mono">Partition 03</div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <Radio className="h-6 w-6 text-teal-400" />
                <span>Telemetry Refresh Speed</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl backdrop-blur-md">
          <div className="text-xs font-semibold text-slate-300">
            Configure how frequently the live circuit telemetry stream updates the dashboard charts and ML isolation forest models.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {rates.map((r) => {
              const isSelected = settings.refreshRate === r.rate;
              return (
                <button
                  key={r.rate}
                  type="button"
                  onClick={() => handleRefreshRateChange(r.rate)}
                  className={`relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/50 shadow-xl'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="rounded-lg bg-teal-950 border border-teal-800 px-2.5 py-1 text-xs font-bold text-teal-300 font-mono">
                        {r.ms}
                      </span>
                      {isSelected && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-slate-950 font-bold">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                    <div className="text-base font-extrabold text-white">{r.title}</div>
                    <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">{r.desc}</div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] font-bold font-mono text-teal-400">
                    {isSelected ? 'Active Refresh Rate' : 'Select Rate'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
