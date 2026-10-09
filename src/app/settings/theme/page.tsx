'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor, Moon, Sun, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { useVoltStore } from '@/lib/store';
import { ThemeOption } from '@/lib/types';

export default function ThemeSettingsPage() {
  const { settings, updateSettings } = useVoltStore();

  const handleThemeChange = (theme: ThemeOption) => {
    updateSettings({ theme });
    if (typeof document !== 'undefined') {
      document.documentElement.className = `theme-${theme}`;
      document.body.className = `antialiased min-h-screen theme-${theme}`;
    }
  };

  const themes: Array<{ id: ThemeOption; title: string; desc: string; icon: any; bgPreview: string }> = [
    {
      id: 'oled',
      title: 'OLED Dark',
      desc: 'True pitch-black surface optimized for OLED panels and reduced eye fatigue.',
      icon: Moon,
      bgPreview: 'bg-black border-slate-800 text-teal-400'
    },
    {
      id: 'slate',
      title: 'Deep Slate',
      desc: 'Sophisticated dark slate theme with balanced contrast and high readability.',
      icon: Monitor,
      bgPreview: 'bg-slate-950 border-slate-700 text-teal-400'
    },
    {
      id: 'light',
      title: 'Minimal Light',
      desc: 'Clean, neutral light surface designed for bright environments with subtle dark accents.',
      icon: Sun,
      bgPreview: 'bg-slate-100 border-slate-300 text-teal-600'
    }
  ];

  return (
    <div className={`min-h-screen theme-${settings.theme} transition-colors duration-200`}>
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* Navigation Top Bar */}
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
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 font-mono">Partition 02</div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <Monitor className="h-6 w-6 text-teal-400" />
                <span>Visual Screen Theme</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl backdrop-blur-md">
          <div className="text-xs font-semibold text-slate-300">
            Select your preferred visual environment. The theme updates instantly across all monitoring screens.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {themes.map((t) => {
              const Icon = t.icon;
              const isSelected = settings.theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemeChange(t.id)}
                  className={`relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/50 shadow-xl'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl border ${t.bgPreview}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      {isSelected && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-slate-950 font-bold">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                    <div className="text-base font-extrabold text-white">{t.title}</div>
                    <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">{t.desc}</div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] font-bold font-mono text-teal-400">
                    {isSelected ? 'Currently Active' : 'Click to Apply'}
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
