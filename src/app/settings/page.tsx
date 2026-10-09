'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Settings as SettingsIcon, 
  ArrowLeft, 
  User, 
  Monitor, 
  Radio, 
  Sliders, 
  Bell, 
  Upload, 
  Shield, 
  CreditCard, 
  Zap, 
  ChevronRight,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useVoltStore } from '@/lib/store';

export default function SettingsHubPage() {
  const router = useRouter();
  const { settings, updateSettings, userProfile, logout, isAuthenticated } = useVoltStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleThemeChange = (theme: 'oled' | 'slate' | 'light') => {
    updateSettings({ theme });
    if (typeof document !== 'undefined') {
      document.documentElement.className = `theme-${theme}`;
      document.body.className = `antialiased min-h-screen theme-${theme}`;
    }
  };

  const partitions = [
    {
      num: '01',
      id: 'account',
      href: '/settings/account',
      title: 'Account & Consumer Profile',
      desc: 'Consumer ID, registered email, tariff rate plan, JSON data export, and test account switcher.',
      icon: User,
      badge: userProfile.name,
      color: 'text-teal-400 border-teal-500/40 bg-teal-500/10'
    },
    {
      num: '02',
      id: 'theme',
      href: '/settings/theme',
      title: 'Visual Screen Theme',
      desc: 'OLED Dark (Pitch Black), Deep Slate, and Minimal Light neutral theme surface controls.',
      icon: Monitor,
      badge: settings.theme.toUpperCase(),
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
    },
    {
      num: '03',
      id: 'telemetry',
      href: '/settings/telemetry',
      title: 'Telemetry Refresh Speed',
      desc: 'Live SSE stream refresh frequency: Fast (500ms), Balanced (1000ms), Eco Saver (2000ms).',
      icon: Radio,
      badge: `${settings.refreshRate}ms`,
      color: 'text-sky-400 border-sky-500/40 bg-sky-500/10'
    },
    {
      num: '04',
      id: 'sensitivity',
      href: '/settings/sensitivity',
      title: 'Sensor & Anomaly Sensitivity',
      desc: 'Isolation Forest machine learning fire hazard cutoff score tuning (0.50 - 0.95).',
      icon: Sliders,
      badge: settings.anomalySensitivity.toFixed(2),
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    },
    {
      num: '05',
      id: 'alerts',
      href: '/settings/alerts',
      title: 'Alert Ringtones, Haptics & Vibration',
      desc: 'Siren sound selector, volume, haptic vibration pattern engine, intensity slider, and audio FX.',
      icon: Bell,
      badge: settings.alarmTone.toUpperCase(),
      color: 'text-rose-400 border-rose-500/40 bg-rose-500/10'
    },
    {
      num: '06',
      id: 'audio-upload',
      href: '/settings/audio-upload',
      title: 'Custom Audio Sound Upload',
      desc: 'Upload custom .mp3 or .wav audio tracks to replace system emergency sirens.',
      icon: Upload,
      badge: settings.customAudioDataUrl ? 'CUSTOM AUDIO SET' : 'DEFAULT',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    },
    {
      num: '07',
      id: 'privacy',
      href: '/settings/privacy',
      title: 'Privacy & Security Management',
      desc: 'Two-Factor Authentication (2FA), anonymized telemetry streaming, and session auto-lock.',
      icon: Shield,
      badge: settings.twoFactorEnabled ? '2FA ACTIVE' : '2FA DISABLED',
      color: 'text-blue-400 border-blue-500/40 bg-blue-500/10'
    },
    {
      num: '08',
      id: 'payment',
      href: '/settings/payment',
      title: 'Payment Gateway & Saved Cards',
      desc: 'Credit & Debit Card payment options only (No UPI), saved cards list, and Auto-Pay settings.',
      icon: CreditCard,
      badge: `${settings.savedCards.length} CARDS`,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    },
    {
      num: '09',
      id: 'automation',
      href: '/settings/automation',
      title: 'Smart System Automation Toggles',
      desc: 'Auto-cutoff breakers, motor inrush surge masking algorithm, siren playback, and push alerts.',
      icon: Zap,
      badge: settings.autoCutoffEnabled ? 'CUTOFF ACTIVE' : 'MANUAL',
      color: 'text-purple-400 border-purple-500/40 bg-purple-500/10'
    }
  ];

  return (
    <div className={`min-h-screen theme-${settings.theme} transition-colors duration-200`}>
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        
        {/* Hub Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 font-mono">Control Panel</div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2.5">
                <SettingsIcon className="h-7 w-7 text-teal-400" />
                <span>VoltGuard Settings & Preferences Hub</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Theme Buttons */}
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => handleThemeChange('oled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  settings.theme === 'oled' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="OLED Dark"
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('slate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  settings.theme === 'slate' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Deep Slate"
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  settings.theme === 'light' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Minimal Light"
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex items-center space-x-1.5 rounded-xl border border-rose-500/40 bg-rose-950/40 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/50 transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Large Numbered Settings Partitions Grid */}
        <div className="space-y-4">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
            Select a Settings Partition to Open Dedicated Configuration Screen:
          </div>

          <div className="flex flex-col space-y-4">
            {partitions.map((part) => {
              const Icon = part.icon;
              return (
                <Link
                  key={part.id}
                  href={part.href}
                  className="group relative flex flex-col md:flex-row md:items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-5 hover:border-teal-500 hover:bg-slate-900 transition-all duration-200 shadow-lg hover:shadow-teal-500/10 backdrop-blur-md"
                >
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 w-full">
                    <div className="flex items-center justify-between md:justify-start md:space-x-6 shrink-0">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-teal-400 font-mono text-lg font-extrabold border border-slate-800 group-hover:border-teal-500 group-hover:text-teal-300 transition-colors">
                        {part.num}
                      </span>
                      <span className={`md:hidden rounded-xl border px-2.5 py-1 text-[10px] font-extrabold font-mono ${part.color}`}>
                        {part.badge}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-lg font-extrabold text-white flex items-center space-x-2 group-hover:text-teal-300 transition-colors">
                        <Icon className="h-5 w-5 text-teal-400" />
                        <span>{part.title}</span>
                      </h2>
                      <p className="text-sm text-slate-400 mt-1.5 leading-relaxed font-sans">
                        {part.desc}
                      </p>
                    </div>

                    <div className="hidden md:flex items-center shrink-0">
                      <span className={`rounded-xl border px-3 py-1.5 text-xs font-extrabold font-mono ${part.color}`}>
                        {part.badge}
                      </span>
                    </div>
                  </div>

                  <div className="flex md:hidden items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs font-bold text-teal-400 group-hover:text-teal-300 w-full">
                    <span>Configure Partition</span>
                    <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  <div className="hidden md:flex items-center justify-end pl-6 shrink-0 text-teal-400 group-hover:text-teal-300">
                    <ChevronRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
