'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Edit3, 
  Save, 
  LogOut, 
  Download, 
  KeyRound, 
  Check, 
  AlertCircle,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useVoltStore } from '@/lib/store';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { 
    settings,  
    userProfile, 
    updateUserProfile, 
    loginNormalUser, 
    loginSpikedUser, 
    logout,
    isAuthenticated
  } = useVoltStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editConsumerNumber, setEditConsumerNumber] = useState(userProfile.consumerNumber);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editRate, setEditRate] = useState(userProfile.ratePerKwh);
  const [passwordChangeMsg, setPasswordChangeMsg] = useState('');

  useEffect(() => {
    setEditName(userProfile.name);
    setEditConsumerNumber(userProfile.consumerNumber);
    setEditEmail(userProfile.email);
    setEditRate(userProfile.ratePerKwh);
  }, [userProfile]);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      consumerNumber: editConsumerNumber,
      email: editEmail,
      ratePerKwh: Number(editRate),
    });
    setIsEditingAccount(false);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ userProfile, settings }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `voltguard_account_${userProfile.consumerNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

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
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 font-mono">Partition 01</div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <User className="h-6 w-6 text-teal-400" />
                <span>Account & Consumer Profile</span>
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingAccount(!isEditingAccount)}
            className="flex items-center space-x-1.5 rounded-xl border border-teal-500/40 bg-teal-500/10 px-4 py-2 text-xs font-bold text-teal-300 hover:bg-teal-500/20 transition-all"
          >
            <Edit3 className="h-4 w-4" />
            <span>{isEditingAccount ? 'Cancel Editing' : 'Edit Account Info'}</span>
          </button>
        </div>

        {/* Profile Details or Edit Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl backdrop-blur-md">
          {isEditingAccount ? (
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">Consumer Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white font-bold focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">Electricity Consumer ID</label>
                  <input
                    type="text"
                    value={editConsumerNumber}
                    onChange={(e) => setEditConsumerNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white font-bold focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">Registered Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white font-bold focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">Tariff Rate (₹/kWh)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={editRate}
                    onChange={(e) => setEditRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white font-bold focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingAccount(false)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-500 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Consumer Full Name</div>
                  <div className="text-base font-extrabold text-white mt-1">{userProfile.name}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Consumer ID</div>
                  <div className="text-base font-extrabold text-teal-400 mt-1">{userProfile.consumerNumber}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Registered Email</div>
                  <div className="text-sm font-extrabold text-slate-200 mt-1 truncate">{userProfile.email}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Account Meter ID</div>
                  <div className="text-sm font-bold text-slate-300 mt-1">{userProfile.accountNumber}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Tariff Category</div>
                  <div className="text-sm font-bold text-slate-200 mt-1">{userProfile.billingTier}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Unit Tariff Rate</div>
                  <div className="text-base font-extrabold text-emerald-400 mt-1">₹{userProfile.ratePerKwh.toFixed(2)} / kWh</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-200 hover:border-teal-500 transition-all shadow-sm"
                  >
                    <Download className="h-4 w-4 text-teal-400" />
                    <span>Export Account Data (JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPasswordChangeMsg('Password reset link sent to registered email address!');
                      setTimeout(() => setPasswordChangeMsg(''), 3500);
                    }}
                    className="flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-200 hover:border-amber-500 transition-all shadow-sm"
                  >
                    <KeyRound className="h-4 w-4 text-amber-400" />
                    <span>Reset Password</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center space-x-2 rounded-xl bg-rose-600/20 border border-rose-500/50 px-5 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-600 hover:text-white transition-all shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out of Console</span>
                </button>
              </div>

              {passwordChangeMsg && (
                <div className="flex items-center space-x-2 text-xs text-teal-300 bg-teal-950/80 border border-teal-800 rounded-xl p-3 font-semibold">
                  <Check className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>{passwordChangeMsg}</span>
                </div>
              )}

              {/* Quick Preset Account Switcher */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-teal-400" />
                  <span>Quick Test Account Switcher</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      loginNormalUser();
                      router.push('/');
                    }}
                    className="flex items-center justify-between rounded-xl border border-teal-500/30 bg-teal-950/30 p-3 hover:border-teal-500 transition-all"
                  >
                    <div>
                      <div className="font-bold text-teal-300">Normal Household Account</div>
                      <div className="text-[10px] text-slate-400 font-mono">Consumer: MH-MUM-8921-X</div>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-teal-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      loginSpikedUser();
                      router.push('/');
                    }}
                    className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 hover:border-rose-500 transition-all"
                  >
                    <div>
                      <div className="font-bold text-rose-300">Spiked Hazard Test Account</div>
                      <div className="text-[10px] text-slate-400 font-mono">Simulates Breaker Trip & Alarm</div>
                    </div>
                    <AlertCircle className="h-5 w-5 text-rose-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
