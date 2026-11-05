'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Zap, 
  RotateCcw, 
  Settings, 
  LogOut,
  Menu,
  ShieldAlert,
  Flame,
  User,
  CheckCircle2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';

interface HeaderProps {
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
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
    globalAnomaly,
    safetyLatchLocked,
    audioMuted,
    toggleAudioMute,
    settings,
    userActiveTab
  } = useVoltStore();

  // Compute breadcrumb title based on route and tab
  const getSectionTitle = () => {
    if (pathname.startsWith('/settings')) {
      return 'Settings';
    }
    if (currentUserRole === 'user') {
      switch (userActiveTab) {
        case 'overview': return 'Home Overview';
        case 'switchboard': return 'Circuit Switchboard';
        case 'telemetry': return 'Telemetry Graphs';
        case 'billing': return 'Utility Billing & Census';
        case 'electrician': return 'Book Electrician';
        case 'chat': return 'Safety Help Desk & OTP';
        case 'call_dept': return 'Emergency Hotlines';
        case 'report_bug': return 'Incident Report';
        default: return 'Home Overview';
      }
    } else if (currentUserRole === 'electrician') {
      return 'Field Pro Dispatch Queue';
    } else {
      return 'Safety Command & Control';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors
      bg-[#182431]/95 border-[#354456] text-[#E8EEF5]
      theme-light:bg-[#E2EBD9]/95 theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
    "
    style={{
      backgroundColor: settings.theme === 'light' ? 'rgba(226, 235, 217, 0.95)' : 'rgba(24, 36, 49, 0.95)',
      borderColor: settings.theme === 'light' ? '#DCE5D9' : '#354456'
    }}>
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Menu Trigger + Section Breadcrumbs */}
        <div className="flex items-center space-x-3">
          {onToggleMobileNav && (
            <button
              onClick={onToggleMobileNav}
              aria-label="Open Navigation Menu"
              className="lg:hidden p-2 rounded-xl border border-inherit text-inherit hover:bg-black/10 transition"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider font-mono
                ${settings.theme === 'light' ? 'text-[#347A53]' : 'text-[#36B879]'}
              `}>
                {currentUserRole === 'user' ? 'Resident Portal' : currentUserRole === 'electrician' ? 'Field Pro Queue' : 'Admin Center'}
              </span>
              <span className="text-slate-400 text-xs">/</span>
              <span className="text-xs font-bold text-inherit truncate">
                {getSectionTitle()}
              </span>
            </div>
            <div className="hidden sm:block text-[11px] opacity-70">
              {currentUserRole === 'user' && `${userProfile.blockArea || 'Kothrud, Pune'} • ${userProfile.electricityDepartment || 'MSEDCL LT-1'}`}
              {currentUserRole === 'electrician' && `${electricianProfile?.dedicatedArea || 'Kothrud, Pune'} • 4.9 ★ Pro Verified`}
              {currentUserRole === 'admin' && 'Central Safety & Mitigation Command Desk'}
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Global Safety Reset Button */}
          <button
            onClick={globalSafetyReset}
            title="Reset Safety Latch & Restore Circuits"
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-sm ${
              globalAnomaly || safetyLatchLocked
                ? 'bg-rose-600 text-white hover:bg-rose-500 animate-pulse ring-2 ring-rose-400/50 shadow-md shadow-rose-600/30'
                : settings.theme === 'light'
                ? 'bg-white border border-[#DCE5D9] text-[#26382D] hover:bg-[#F5F7F0]'
                : 'bg-[#202D3D] border border-[#354456] text-[#E8EEF5] hover:bg-[#273648]'
            }`}
          >
            <RotateCcw className={`h-3.5 w-3.5 ${globalAnomaly ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Safety Latch</span>
          </button>

          {/* Audio Alarm Sound Toggle */}
          <button
            onClick={toggleAudioMute}
            title={audioMuted ? 'Unmute Alarm Sound' : 'Mute Alarm Sound'}
            className={`rounded-xl p-2 transition-all border ${
              audioMuted
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                : globalAnomaly
                ? 'border-rose-500 bg-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse ring-2 ring-rose-500/40'
                : settings.theme === 'light'
                ? 'border-[#DCE5D9] bg-white text-[#347A53] hover:bg-[#F5F7F0]'
                : 'border-[#354456] bg-[#202D3D] text-[#36B879] hover:text-white hover:bg-[#273648]'
            }`}
          >
            {audioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Settings Nav Link */}
          <Link
            href="/settings"
            title="System Settings"
            className={`rounded-xl p-2 transition-colors border ${
              pathname.startsWith('/settings')
                ? settings.theme === 'light' 
                  ? 'border-[#347A53] bg-[#D4E4D0] text-[#347A53]' 
                  : 'border-[#36B879]/50 bg-[#36B879]/10 text-[#36B879]'
                : settings.theme === 'light'
                ? 'border-[#DCE5D9] bg-white text-[#26382D] hover:bg-[#F5F7F0]'
                : 'border-[#354456] bg-[#202D3D] text-[#A6B3C1] hover:text-white hover:bg-[#273648]'
            }`}
          >
            <Settings className="h-4 w-4" />
          </Link>

          {/* User Sign Out */}
          <button
            onClick={logout}
            title="Sign Out"
            className={`rounded-xl p-2 transition-colors border ${
              settings.theme === 'light'
                ? 'border-[#DCE5D9] bg-white text-[#69776C] hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600'
                : 'border-[#354456] bg-[#202D3D] text-[#A6B3C1] hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400'
            }`}
          >
            <LogOut className="h-4 w-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
