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
  LogOut,
  Wrench,
  User,
  Flame
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { 
    currentUserRole,
    userProfile, 
    electricianProfile,
    adminProfile,
    logout, 
    loginAsUser,
    loginAsElectrician,
    loginAsAdmin,
    globalSafetyReset, 
    audioMuted, 
    toggleAudioMute,
    globalAnomaly,
    safetyLatchLocked,
    triggerFireEmergencyProtocol
  } = useVoltStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/40 p-2 shadow-sm transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-teal-400 font-bold" />
              <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-bold tracking-tight text-white">VoltGuard</span>
                <span className="rounded bg-teal-950/80 px-1.5 py-0.2 text-[10px] font-bold text-teal-300 border border-teal-800/40">
                  {currentUserRole === 'user' ? 'Resident' : currentUserRole === 'electrician' ? 'Electrician' : 'Admin'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Electrical Safety & Fire Protection
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Portal Switcher */}
        <div className="hidden lg:flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => loginAsUser('user-rajesh')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              currentUserRole === 'user'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Resident Portal
          </button>
          <button
            onClick={() => loginAsElectrician('elec-vikram')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              currentUserRole === 'electrician'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Electrician Queue
          </button>
          <button
            onClick={() => loginAsAdmin('rukaiya.admin@gmail.com')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              currentUserRole === 'admin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin Center
          </button>
        </div>

        {/* User / Profile Info */}
        <div className="hidden sm:flex items-center space-x-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-1.5">
          <div className="text-right text-xs">
            <div className="font-bold text-white">
              {currentUserRole === 'user' && userProfile.name}
              {currentUserRole === 'electrician' && (electricianProfile?.name || 'Vikram Jadhav')}
              {currentUserRole === 'admin' && adminProfile.name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {currentUserRole === 'user' && `${userProfile.consumerNumber} • ${userProfile.blockArea}`}
              {currentUserRole === 'electrician' && `${electricianProfile?.dedicatedArea || 'Bandra West'} • 4.9 ★`}
              {currentUserRole === 'admin' && adminProfile.email}
            </div>
          </div>
        </div>

        {/* Quick-Access Control Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Global Safety Reset */}
          <button
            onClick={globalSafetyReset}
            title="Reset Safety Latch & Restore Circuits"
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              globalAnomaly || safetyLatchLocked
                ? 'bg-rose-600 text-white hover:bg-rose-500 animate-bounce shadow-md shadow-rose-600/40'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <RotateCcw className={`h-3.5 w-3.5 ${globalAnomaly ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Safety</span>
          </button>

          {/* Mute / Unmute */}
          <button
            onClick={toggleAudioMute}
            title={audioMuted ? 'Unmute Alarms' : 'Mute Alarms'}
            className={`rounded-xl p-2 transition-colors border ${
              audioMuted
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {audioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-teal-400" />}
          </button>

          {/* Settings Nav */}
          <Link
            href="/settings"
            title="Settings"
            className={`rounded-xl p-2 transition-colors border ${
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
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
