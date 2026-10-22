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
  ShieldCheck,
  Wrench
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useVoltStore, SEEDED_CONSUMERS, SEEDED_ELECTRICIANS } from '@/lib/store';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { 
    settings,  
    userProfile, 
    updateUserProfile, 
    loginAsUser,
    loginAsElectrician,
    loginAsAdmin,
    logout,
    isAuthenticated,
    currentUserRole,
    outlets
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

  return (
    <div className={`min-h-screen theme-${settings.theme} transition-colors duration-200`}>
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-teal-400 flex items-center space-x-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-semibold">Account & Roles</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <User className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Account Profile & Role Switcher</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Currently active in <strong className="text-teal-400 capitalize">{currentUserRole} Portal</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingAccount(!isEditingAccount)}
              className="flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all shadow-sm"
            >
              <Edit3 className="h-4 w-4 text-teal-400" />
              <span>{isEditingAccount ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {isEditingAccount ? (
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Consumer Full Name:</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Consumer ID Number:</label>
                  <input
                    type="text"
                    value={editConsumerNumber}
                    onChange={(e) => setEditConsumerNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Registered Email:</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Electricity Tariff Rate (₹/kWh):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editRate}
                    onChange={(e) => setEditRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center space-x-2 rounded-xl bg-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-teal-400 transition-all shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Consumer Name</div>
                  <div className="text-sm font-bold text-white mt-1">{userProfile.name}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Consumer Number</div>
                  <div className="text-sm font-mono font-bold text-teal-400 mt-1">{userProfile.consumerNumber}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Electricity Provider</div>
                  <div className="text-sm font-bold text-slate-200 mt-1">{userProfile.electricityDepartment}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Billing Account Number</div>
                  <div className="text-sm font-mono font-bold text-slate-200 mt-1">{userProfile.accountNumber}</div>
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
                  <span>Sign Out</span>
                </button>
              </div>

              {passwordChangeMsg && (
                <div className="flex items-center space-x-2 text-xs text-teal-300 bg-teal-950/80 border border-teal-800 rounded-xl p-3 font-semibold">
                  <Check className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>{passwordChangeMsg}</span>
                </div>
              )}

              {/* Quick Role & Account Switcher */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-teal-400" />
                    <span>Switch Active Account / Portal Role</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">4 Resident Accounts Available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {SEEDED_CONSUMERS.map((c) => {
                    const isSpiked = c.id === 'user-spiked';
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          loginAsUser(c.id);
                          router.push('/');
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                          isSpiked
                            ? 'border-rose-500/50 bg-rose-950/20 hover:border-rose-500 hover:bg-rose-950/40'
                            : 'border-teal-500/30 bg-teal-950/20 hover:border-teal-500'
                        }`}
                      >
                        {isSpiked && (
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                            🚨 Spiked Load
                          </div>
                        )}
                        <div className={`font-bold ${isSpiked ? 'text-rose-300' : 'text-teal-300'}`}>
                          {c.name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{c.blockArea}</div>
                        <div className={`text-[10px] font-mono mt-1 ${isSpiked ? 'text-rose-400 font-bold' : 'text-teal-400'}`}>
                          {isSpiked ? 'Triggers Alarm →' : 'Resident Portal →'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      loginAsElectrician('elec-vikram');
                      router.push('/');
                    }}
                    className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 hover:border-amber-500 text-left transition-all"
                  >
                    <div className="font-bold text-amber-300">⚡ Vikram Jadhav (Electrician)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Kothrud, Pune Division • 4.9 ★</div>
                    <div className="text-[10px] text-amber-400 font-mono mt-1">Electrician Portal →</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      loginAsAdmin('rukaiya.admin@gmail.com');
                      router.push('/');
                    }}
                    className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 hover:border-indigo-500 text-left transition-all"
                  >
                    <div className="font-bold text-indigo-300">🛡️ Rukaiya (Admin & Safety Desk)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">rukaiya.admin@gmail.com</div>
                    <div className="text-[10px] text-indigo-400 font-mono mt-1">Admin Center →</div>
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
