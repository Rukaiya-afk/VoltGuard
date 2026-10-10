'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Shield, Flame, Radio, Bell } from 'lucide-react';
import { Header } from '@/components/Header';
import { useVoltStore } from '@/lib/store';

export default function AutomationSettingsPage() {
  const { settings, updateSettings } = useVoltStore();

  type ToggleKey = 'autoCutoffEnabled' | 'inrushMaskingEnabled' | 'sirenEnabled' | 'autoStreamEnabled' | 'emailAlertsEnabled';

  const handleToggle = (key: ToggleKey) => {
    updateSettings({ [key]: !settings[key] });
  };

  const togglesList: Array<{ key: ToggleKey; label: string; desc: string; icon: any }> = [
    { 
      key: 'autoCutoffEnabled', 
      label: 'Automatic Emergency Power Cutoff', 
      desc: 'Instantly turns off the socket power when overheating (>65°C) or sparks are detected to prevent fires.',
      icon: Flame
    },
    { 
      key: 'inrushMaskingEnabled', 
      label: 'Appliance Start-Up Filter', 
      desc: 'Prevents false alarms when large appliances (refrigerator, AC motor, mixer) turn on.',
      icon: Shield
    },
    { 
      key: 'sirenEnabled', 
      label: 'Play Siren Sound on Hazard', 
      desc: 'Plays an audible warning siren from your device speakers when high fire risk is detected.',
      icon: Bell
    },
    { 
      key: 'autoStreamEnabled', 
      label: 'Live Home Monitoring', 
      desc: 'Continuously monitors voltage, current, and socket temperatures in the background.',
      icon: Radio
    },
    { 
      key: 'emailAlertsEnabled', 
      label: 'SMS & WhatsApp Emergency Alerts', 
      desc: 'Sends immediate text alerts to your registered family phone number when hazards occur.',
      icon: Zap
    },
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
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 font-mono">Partition 09</div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <Zap className="h-6 w-6 text-purple-400" />
                <span>Automatic Safety Switches</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-xl backdrop-blur-md">
          <div className="text-xs font-semibold text-slate-300">
            Customize automatic safety protections for your Kothrud residence.
          </div>

          <div className="space-y-4">
            {togglesList.map((t) => {
              const Icon = t.icon;
              const isChecked = Boolean(settings[t.key]);
              return (
                <div key={t.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{t.label}</div>
                      <div className="text-xs text-slate-400">{t.desc}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(t.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isChecked ? 'bg-purple-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isChecked ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
