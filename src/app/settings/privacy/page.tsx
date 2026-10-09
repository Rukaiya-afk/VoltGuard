'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, EyeOff, Clock, ShieldCheck, KeyRound, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { useVoltStore } from '@/lib/store';

export default function PrivacySettingsPage() {
  const { settings, updateSettings } = useVoltStore();
  const [twoFactorModal, setTwoFactorModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorSuccessMsg, setTwoFactorSuccessMsg] = useState('');

  const handleToggle2FA = () => {
    if (!settings.twoFactorEnabled) {
      setTwoFactorModal(true);
    } else {
      updateSettings({ twoFactorEnabled: false });
    }
  };

  const handleConfirm2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length >= 4) {
      updateSettings({ twoFactorEnabled: true });
      setTwoFactorModal(false);
      setTwoFactorSuccessMsg('Two-Factor Authentication (2FA) successfully enabled!');
      setTimeout(() => setTwoFactorSuccessMsg(''), 3500);
    }
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
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 font-mono">Partition 07</div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-400" />
                <span>Privacy & Security Management</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl backdrop-blur-md">
          <div className="text-xs font-semibold text-slate-300">
            Control your authentication safeguards, data anonymization policies, and console access permissions.
          </div>

          <div className="space-y-4">
            {/* 2FA Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</div>
                  <div className="text-xs text-slate-400">Require an authenticator code or SMS OTP on console login</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggle2FA}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactorEnabled ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {twoFactorSuccessMsg && (
              <div className="flex items-center space-x-2 text-xs text-blue-300 bg-blue-950/80 border border-blue-800 rounded-xl p-3 font-semibold">
                <Check className="h-4 w-4 text-blue-400 shrink-0" />
                <span>{twoFactorSuccessMsg}</span>
              </div>
            )}

            {/* Anonymized Telemetry Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                  <EyeOff className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Anonymized Cloud Telemetry</div>
                  <div className="text-xs text-slate-400">Strip personally identifiable information before streaming to ML models</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => updateSettings({ telemetryAnonymized: !settings.telemetryAnonymized })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.telemetryAnonymized ? 'bg-teal-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.telemetryAnonymized ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Session Auto Timeout Selection */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Console Session Inactivity Timeout</div>
                  <div className="text-xs text-slate-400">Automatically lock console after inactivity duration</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => updateSettings({ sessionTimeoutMinutes: mins })}
                    className={`rounded-xl border p-3 text-center text-xs font-bold transition-all ${
                      settings.sessionTimeoutMinutes === mins
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-mono ring-2 ring-amber-500/40'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2FA Enable Modal */}
        {twoFactorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl">
              <div className="flex items-center space-x-3 text-blue-400 font-extrabold text-lg">
                <ShieldCheck className="h-6 w-6" />
                <span>Enable 2FA Safeguard</span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                Scan the QR code or enter your authentication app verification code below to bind two-factor login.
              </div>

              <form onSubmit={handleConfirm2FA} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">6-Digit Authenticator Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-center text-xl font-bold font-mono tracking-widest text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setTwoFactorModal(false)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500"
                  >
                    Verify & Enable
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
