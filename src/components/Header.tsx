'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Zap, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Settings, 
  UserCheck, 
  LogOut
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { 
    userProfile, 
    isGuest, 
    isHighRiskUser,
    logout, 
    globalSafetyReset, 
    audioMuted, 
    toggleAudioMute,
    globalAnomaly,
    safetyLatchLocked
  } = useVoltStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Subtle, Pretty Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-teal-900/60 border border-teal-700/50 p-2 shadow-sm transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-teal-300 font-bold" />
              <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-bold tracking-tight text-white">VoltGuard</span>
                <span className="rounded bg-teal-950/80 px-1.5 py-0.2 text-[10px] font-medium text-teal-400 border border-teal-800/40">
                  Home Shield
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Electrical Safety & Fire Protection
              </div>
            </div>
          </Link>
        </div>

        {/* Consumer Profile Chip */}
        <div className="hidden md:flex items-center space-x-4 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-1.5 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isHighRiskUser ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-teal-400'}`}>
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-200">{userProfile.name}</span>
                {isHighRiskUser ? (
                  <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[10px] text-rose-300 border border-rose-500/40 font-bold animate-pulse">
                    ⚠️ Extreme Risk Account
                  </span>
                ) : isGuest && (
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-300 border border-amber-500/30 font-medium">
                    Demo Mode
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                ID: <span className="text-teal-400 font-medium">{userProfile.consumerNumber}</span> | Tier: <span className="text-slate-300">{userProfile.billingTier}</span>
              </div>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-right text-[11px] font-mono">
            <div className="text-slate-400">Rate: ₹{userProfile.ratePerKwh.toFixed(2)}/kWh</div>
            <div className="text-slate-500 text-[10px]">Account: {userProfile.accountNumber}</div>
          </div>
        </div>

        {/* Quick-Access Control Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Global Safety Reset */}
          <button
            onClick={globalSafetyReset}
            title="Safety Reset & Restore"
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              globalAnomaly || safetyLatchLocked
                ? 'bg-rose-600 text-white hover:bg-rose-500 animate-bounce shadow-md shadow-rose-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
            }`}
          >
            <RotateCcw className={`h-3.5 w-3.5 ${globalAnomaly ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Safety</span>
          </button>

          {/* Mute / Unmute */}
          <button
            onClick={toggleAudioMute}
            title={audioMuted ? 'Unmute Alarms' : 'Mute Alarms'}
            className={`rounded-lg p-2 transition-colors border ${
              audioMuted
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {audioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-teal-400" />}
          </button>

          {/* Settings Nav */}
          <Link
            href="/settings"
            title="Settings"
            className={`rounded-lg p-2 transition-colors border ${
              pathname === '/settings'
                ? 'border-teal-500/50 bg-teal-500/10 text-teal-400'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="h-4 w-4" />
          </Link>

          {/* Sign Out */}
          <button
            onClick={logout}
            title="Sign Out"
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
