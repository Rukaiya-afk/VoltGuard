'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  DollarSign, 
  UserCheck, 
  MessageSquare, 
  PhoneCall, 
  AlertOctagon, 
  ShieldCheck, 
  Users, 
  Flame, 
  Wrench, 
  Ticket, 
  Cpu, 
  Sliders, 
  Calendar, 
  Clock, 
  Star, 
  User, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Sun, 
  Moon, 
  Monitor, 
  Volume2, 
  VolumeX, 
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  HelpCircle,
  Radio
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { UserRole, ThemeOption } from '@/lib/types';

interface SidebarNavProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavChild {
  id: string;
  label: string;
  active: boolean;
  href?: string;
  onClick?: () => void;
}

interface NavSection {
  key: string;
  label: string;
  icon: any;
  active: boolean;
  href?: string;
  onSelect?: () => void;
  children?: NavChild[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const { 
    currentUserRole, 
    loginAsUser, 
    loginAsElectrician, 
    loginAsAdmin,
    logout,
    userProfile,
    electricianProfile,
    adminProfile,
    userActiveTab,
    setUserActiveTab,
    adminActiveTab,
    setAdminActiveTab,
    electricianActiveTab,
    setElectricianActiveTab,
    settings,
    updateSettings,
    audioMuted,
    toggleAudioMute,
    globalAnomaly,
    safetyLatchLocked
  } = useVoltStore();

  // Track expanded parent sections for nested sub-navigation
  const [expandedSection, setExpandedSection] = useState<string>('overview');

  const toggleSection = (sectionKey: string) => {
    if (collapsed) {
      onToggleCollapse(); // expand sidebar if collapsed
      setExpandedSection(sectionKey);
    } else {
      setExpandedSection(prev => prev === sectionKey ? '' : sectionKey);
    }
  };

  const handleThemeCycle = () => {
    const nextTheme: ThemeOption = settings.theme === 'slate' ? 'light' : 'slate';
    updateSettings({ theme: nextTheme });
    if (typeof document !== 'undefined') {
      document.documentElement.className = `theme-${nextTheme}`;
      document.body.className = `antialiased min-h-screen theme-${nextTheme}`;
    }
  };

  // Build role-specific navigation hierarchy
  const residentNavSections: NavSection[] = [
    {
      key: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      active: userActiveTab === 'overview',
      onSelect: () => setUserActiveTab('overview'),
      children: [
        { id: 'overview_main', label: 'Key Metrics & Status', active: userActiveTab === 'overview', onClick: () => setUserActiveTab('overview') },
      ]
    },
    {
      key: 'switchboard',
      label: 'Circuit Switchboard',
      icon: Zap,
      active: userActiveTab === 'switchboard',
      onSelect: () => setUserActiveTab('switchboard'),
      children: [
        { id: 'switchboard_breakers', label: 'Breakers & Controls', active: userActiveTab === 'switchboard', onClick: () => setUserActiveTab('switchboard') },
      ]
    },
    {
      key: 'telemetry',
      label: 'Telemetry Graphs',
      icon: Activity,
      active: userActiveTab === 'telemetry',
      onSelect: () => setUserActiveTab('telemetry'),
      children: [
        { id: 'telemetry_stream', label: 'Live Power Graphs', active: userActiveTab === 'telemetry', onClick: () => setUserActiveTab('telemetry') },
      ]
    },
    {
      key: 'billing',
      label: 'Utility Billing & Census',
      icon: DollarSign,
      active: userActiveTab === 'billing',
      onSelect: () => setUserActiveTab('billing'),
      children: [
        { id: 'billing_summary', label: 'Disaggregated Usage', active: userActiveTab === 'billing', onClick: () => setUserActiveTab('billing') },
      ]
    },
    {
      key: 'electrician',
      label: 'Book Electrician',
      icon: UserCheck,
      active: userActiveTab === 'electrician',
      onSelect: () => setUserActiveTab('electrician'),
      children: [
        { id: 'electrician_booking', label: 'Book Certified Pro', active: userActiveTab === 'electrician', onClick: () => setUserActiveTab('electrician') },
      ]
    },
    {
      key: 'chat',
      label: 'Safety Help Desk & OTP',
      icon: MessageSquare,
      active: userActiveTab === 'chat',
      onSelect: () => setUserActiveTab('chat'),
      children: [
        { id: 'help_desk_chat', label: 'Support & SMS OTP', active: userActiveTab === 'chat', onClick: () => setUserActiveTab('chat') },
      ]
    },
    {
      key: 'call_dept',
      label: 'Emergency Hotlines',
      icon: PhoneCall,
      active: userActiveTab === 'call_dept',
      onSelect: () => setUserActiveTab('call_dept'),
      children: [
        { id: 'emergency_contacts', label: 'Fire & Grid Help', active: userActiveTab === 'call_dept', onClick: () => setUserActiveTab('call_dept') },
      ]
    }
  ];

  const adminNavSections: NavSection[] = [
    {
      key: 'overview',
      label: 'Grid Overview',
      icon: ShieldCheck,
      active: adminActiveTab === 'overview',
      onSelect: () => setAdminActiveTab('overview'),
      children: [
        { id: 'overview_kpi', label: 'System Safety Status', active: adminActiveTab === 'overview', onClick: () => setAdminActiveTab('overview') },
      ]
    },
    {
      key: 'consumers',
      label: 'Consumers & Fleet',
      icon: Users,
      active: ['users', 'electricians'].includes(adminActiveTab),
      onSelect: () => setAdminActiveTab('users'),
      children: [
        { id: 'users', label: 'Resident Directory', active: adminActiveTab === 'users', onClick: () => setAdminActiveTab('users') },
        { id: 'electricians', label: 'Electrician Fleet', active: adminActiveTab === 'electricians', onClick: () => setAdminActiveTab('electricians') },
      ]
    },
    {
      key: 'incidents',
      label: 'Fire Forensics',
      icon: Flame,
      active: adminActiveTab === 'incidents',
      onSelect: () => setAdminActiveTab('incidents'),
      children: [
        { id: 'incidents_log', label: 'Thermal & Arc Reports', active: adminActiveTab === 'incidents', onClick: () => setAdminActiveTab('incidents') },
      ]
    },
    {
      key: 'tickets',
      label: 'Ticket Queue',
      icon: Ticket,
      active: ['tickets', 'chat'].includes(adminActiveTab),
      onSelect: () => setAdminActiveTab('tickets'),
      children: [
        { id: 'tickets', label: 'Consumer Tickets', active: adminActiveTab === 'tickets', onClick: () => setAdminActiveTab('tickets') },
        { id: 'chat', label: 'Live Dispatch Chat', active: adminActiveTab === 'chat', onClick: () => setAdminActiveTab('chat') },
      ]
    },
    {
      key: 'lab',
      label: 'Algorithm Lab',
      icon: Cpu,
      active: adminActiveTab === 'model_testing',
      onSelect: () => setAdminActiveTab('model_testing'),
      children: [
        { id: 'model_testing', label: 'Isolation Forest Testing', active: adminActiveTab === 'model_testing', onClick: () => setAdminActiveTab('model_testing') },
      ]
    }
  ];

  const electricianNavSections: NavSection[] = [
    {
      key: 'jobs',
      label: 'Work Queue',
      icon: Wrench,
      active: ['jobs', 'slots'].includes(electricianActiveTab),
      onSelect: () => setElectricianActiveTab('jobs'),
      children: [
        { id: 'jobs', label: 'Assigned Repair Jobs', active: electricianActiveTab === 'jobs', onClick: () => setElectricianActiveTab('jobs') },
        { id: 'slots', label: 'Booking Time Slots', active: electricianActiveTab === 'slots', onClick: () => setElectricianActiveTab('slots') },
      ]
    },
    {
      key: 'comms',
      label: 'Field Dispatch',
      icon: MessageSquare,
      active: ['client_chat', 'admin_chat'].includes(electricianActiveTab),
      onSelect: () => setElectricianActiveTab('client_chat'),
      children: [
        { id: 'client_chat', label: 'Resident Messaging', active: electricianActiveTab === 'client_chat', onClick: () => setElectricianActiveTab('client_chat') },
        { id: 'admin_chat', label: 'Safety Desk Channel', active: electricianActiveTab === 'admin_chat', onClick: () => setElectricianActiveTab('admin_chat') },
      ]
    },
    {
      key: 'field',
      label: 'Field Reports',
      icon: FileText,
      active: ['report', 'reviews', 'profile'].includes(electricianActiveTab),
      onSelect: () => setElectricianActiveTab('report'),
      children: [
        { id: 'report', label: 'Report Incident', active: electricianActiveTab === 'report', onClick: () => setElectricianActiveTab('report') },
        { id: 'reviews', label: 'Customer Ratings', active: electricianActiveTab === 'reviews', onClick: () => setElectricianActiveTab('reviews') },
        { id: 'profile', label: 'Pro Qualifications', active: electricianActiveTab === 'profile', onClick: () => setElectricianActiveTab('profile') },
      ]
    }
  ];

  const currentNav = 
    currentUserRole === 'user' ? residentNavSections :
    currentUserRole === 'admin' ? adminNavSections :
    electricianNavSections;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Vertical Rail Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r
          ${collapsed ? 'w-[74px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-[#182431] border-[#354456] text-[#E8EEF5]
          theme-light:bg-[#E2EBD9] theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
        `}
        style={{
          backgroundColor: settings.theme === 'light' ? '#E2EBD9' : '#182431',
          borderColor: settings.theme === 'light' ? '#DCE5D9' : '#354456',
        }}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-inherit shrink-0">
          <Link 
            href="/" 
            className="flex items-center space-x-3 overflow-hidden group"
            onClick={onCloseMobile}
          >
            <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl p-2 transition-transform group-hover:scale-105 shadow-sm
              ${settings.theme === 'light' ? 'bg-[#347A53] text-white' : 'bg-[#202D3D] border border-[#354456] text-[#36B879]'}
            `}>
              <Zap className="h-5 w-5 fill-current" />
              <span className={`absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full ${globalAnomaly ? 'bg-rose-500 animate-ping' : 'bg-[#36B879]'}`} />
            </div>

            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col truncate"
              >
                <div className="flex items-center space-x-1.5">
                  <span className={`text-base font-extrabold tracking-tight ${settings.theme === 'light' ? 'text-[#26382D]' : 'text-white'}`}>
                    VoltGuard
                  </span>
                  <span className={`rounded-md px-1.5 py-0.2 text-[9px] font-bold tracking-wider uppercase border
                    ${settings.theme === 'light' ? 'bg-[#D4E4D0] text-[#347A53] border-[#77A985]' : 'bg-[#273648] text-[#36B879] border-[#354456]'}
                  `}>
                    {currentUserRole === 'user' ? 'Resident' : currentUserRole === 'admin' ? 'Admin' : 'Pro'}
                  </span>
                </div>
                <span className={`text-[10px] truncate ${settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]'}`}>
                  Energy & Fire Intelligence
                </span>
              </motion.div>
            )}
          </Link>

          {/* Collapse/Expand Toggle Button (Desktop) */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden lg:flex items-center justify-center h-8 w-8 rounded-lg border transition-colors
              ${settings.theme === 'light' 
                ? 'border-[#DCE5D9] bg-white/80 text-[#26382D] hover:bg-white' 
                : 'border-[#354456] bg-[#202D3D] text-[#A6B3C1] hover:text-white hover:bg-[#273648]'
              }
            `}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Portal Role Selector (Expanded) */}
        {!collapsed && (
          <div className="px-3 py-2.5 border-b border-inherit shrink-0">
            <div className={`p-1 rounded-xl flex items-center space-x-1 border text-[11px] font-bold
              ${settings.theme === 'light' ? 'bg-white/80 border-[#DCE5D9]' : 'bg-[#111820] border-[#354456]'}
            `}>
              <button
                onClick={() => loginAsUser('user-rajesh')}
                className={`flex-1 py-1 px-1.5 rounded-lg text-center transition ${
                  currentUserRole === 'user' 
                    ? settings.theme === 'light' ? 'bg-[#347A53] text-white shadow-xs' : 'bg-[#36B879] text-[#111820] shadow-xs'
                    : settings.theme === 'light' ? 'text-[#69776C] hover:text-[#26382D]' : 'text-[#A6B3C1] hover:text-white'
                }`}
              >
                Resident
              </button>
              <button
                onClick={() => loginAsElectrician('elec-vikram')}
                className={`flex-1 py-1 px-1.5 rounded-lg text-center transition ${
                  currentUserRole === 'electrician'
                    ? settings.theme === 'light' ? 'bg-[#77A985] text-white shadow-xs' : 'bg-[#E0B34E] text-[#111820] shadow-xs'
                    : settings.theme === 'light' ? 'text-[#69776C] hover:text-[#26382D]' : 'text-[#A6B3C1] hover:text-white'
                }`}
              >
                Pro Fleet
              </button>
              <button
                onClick={() => loginAsAdmin('rukaiya.admin@gmail.com')}
                className={`flex-1 py-1 px-1.5 rounded-lg text-center transition ${
                  currentUserRole === 'admin'
                    ? settings.theme === 'light' ? 'bg-[#26382D] text-white shadow-xs' : 'bg-[#4B91D9] text-white shadow-xs'
                    : settings.theme === 'light' ? 'text-[#69776C] hover:text-[#26382D]' : 'text-[#A6B3C1] hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Primary & Nested Navigation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1.5 scrollbar-thin">
          {currentNav.map((section) => {
            const Icon = section.icon;
            const isSelected = section.active;
            const isExpanded = expandedSection === section.key;

            return (
              <div key={section.key} className="space-y-1">
                {/* Primary Section Button */}
                {section.href ? (
                  <Link
                    href={section.href}
                    onClick={() => {
                      onCloseMobile();
                      toggleSection(section.key);
                    }}
                    title={collapsed ? section.label : undefined}
                    className={`group flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-xs font-bold transition-all select-none
                      ${isSelected
                        ? settings.theme === 'light'
                          ? 'bg-[#347A53] text-white shadow-sm'
                          : 'bg-[#202D3D] text-[#36B879] border border-[#354456] shadow-sm'
                        : settings.theme === 'light'
                          ? 'text-[#26382D] hover:bg-[#D4E4D0]/60'
                          : 'text-[#A6B3C1] hover:text-white hover:bg-[#202D3D]/60'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${isSelected ? (settings.theme === 'light' ? 'text-white' : 'text-[#36B879]') : ''}`} />
                      {!collapsed && <span className="truncate">{section.label}</span>}
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      if (section.onSelect) section.onSelect();
                      toggleSection(section.key);
                    }}
                    title={collapsed ? section.label : undefined}
                    className={`group flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-xs font-bold transition-all select-none
                      ${isSelected
                        ? settings.theme === 'light'
                          ? 'bg-[#347A53] text-white shadow-sm'
                          : 'bg-[#202D3D] text-[#36B879] border border-[#354456] shadow-sm'
                        : settings.theme === 'light'
                          ? 'text-[#26382D] hover:bg-[#D4E4D0]/60'
                          : 'text-[#A6B3C1] hover:text-white hover:bg-[#202D3D]/60'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${isSelected ? (settings.theme === 'light' ? 'text-white' : 'text-[#36B879]') : ''}`} />
                      {!collapsed && <span className="truncate">{section.label}</span>}
                    </div>

                    {!collapsed && section.children && section.children.length > 0 && (
                      <ChevronDown 
                        className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : 'rotate-0 opacity-60'
                        }`}
                      />
                    )}
                  </button>
                )}

                {/* NESTED VERTICAL SUB-NAVIGATION (Approved nested architecture) */}
                <AnimatePresence initial={false}>
                  {!collapsed && isExpanded && section.children && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-7 pr-1 space-y-1 relative"
                    >
                      {/* Subtle vertical indicator line */}
                      <div className={`absolute left-4 top-1 bottom-1 w-px ${
                        settings.theme === 'light' ? 'bg-[#77A985]/40' : 'bg-[#354456]'
                      }`} />

                      {section.children.map((child: any) => {
                        const isChildActive = child.active;
                        return child.href ? (
                          <Link
                            key={child.id}
                            href={child.href}
                            onClick={onCloseMobile}
                            className={`block w-full text-left py-1.5 px-2.5 rounded-lg text-[11px] font-semibold transition-colors
                              ${isChildActive
                                ? settings.theme === 'light'
                                  ? 'text-[#347A53] font-bold bg-[#D4E4D0]/50'
                                  : 'text-white font-bold bg-[#273648]'
                                : settings.theme === 'light'
                                  ? 'text-[#69776C] hover:text-[#26382D]'
                                  : 'text-[#A6B3C1] hover:text-white'
                              }
                            `}
                          >
                            {child.label}
                          </Link>
                        ) : (
                          <button
                            key={child.id}
                            onClick={() => {
                              if (child.onClick) child.onClick();
                              onCloseMobile();
                            }}
                            className={`block w-full text-left py-1.5 px-2.5 rounded-lg text-[11px] font-semibold transition-colors
                              ${isChildActive
                                ? settings.theme === 'light'
                                  ? 'text-[#347A53] font-bold bg-[#D4E4D0]/50'
                                  : 'text-white font-bold bg-[#273648]'
                                : settings.theme === 'light'
                                  ? 'text-[#69776C] hover:text-[#26382D]'
                                  : 'text-[#A6B3C1] hover:text-white'
                              }
                            `}
                          >
                            {child.label}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Utility Ribbon (Theme, Mute, Profile) */}
        <div className="p-2 border-t border-inherit shrink-0 space-y-1">
          <div className="flex items-center justify-between gap-1">
            {/* Theme Toggle Button */}
            <button
              onClick={handleThemeCycle}
              title={`Switch Theme (Current: ${settings.theme === 'light' ? 'Light Theme' : 'Dark Theme'})`}
              className={`flex items-center justify-center h-8 flex-1 rounded-lg border transition-colors
                ${settings.theme === 'light'
                  ? 'border-[#DCE5D9] bg-white text-[#26382D] hover:bg-[#F5F7F0]'
                  : 'border-[#354456] bg-[#202D3D] text-[#A6B3C1] hover:text-white'
                }
              `}
            >
              {settings.theme === 'light' ? (
                <Sun className="h-3.5 w-3.5 text-[#B87A24]" />
              ) : (
                <Monitor className="h-3.5 w-3.5 text-[#36B879]" />
              )}
              {!collapsed && (
                <span className="ml-1.5 text-[10px] font-bold uppercase">
                  {settings.theme === 'light' ? 'Light' : 'Dark'}
                </span>
              )}
            </button>

            {/* Audio Alarm Mute Toggle */}
            <button
              onClick={toggleAudioMute}
              title={audioMuted ? 'Unmute Alarms' : 'Mute Alarms'}
              className={`flex items-center justify-center h-8 flex-1 rounded-lg border transition-all
                ${audioMuted
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                  : globalAnomaly
                  ? 'border-rose-500 bg-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse ring-2 ring-rose-500/40'
                  : settings.theme === 'light'
                  ? 'border-[#DCE5D9] bg-white text-[#347A53] hover:bg-[#F5F7F0]'
                  : 'border-[#354456] bg-[#202D3D] text-[#36B879] hover:text-white'
                }
              `}
            >
              {audioMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              {!collapsed && (
                <span className="ml-1.5 text-[10px] font-bold">
                  {audioMuted ? 'MUTED' : globalAnomaly ? 'ALARM' : 'SOUND'}
                </span>
              )}
            </button>

            {/* Sign Out */}
            <button
              onClick={logout}
              title="Sign Out"
              className={`flex items-center justify-center h-8 w-8 rounded-lg border transition-colors
                ${settings.theme === 'light'
                  ? 'border-[#DCE5D9] bg-white text-[#69776C] hover:text-rose-600 hover:border-rose-300'
                  : 'border-[#354456] bg-[#202D3D] text-[#A6B3C1] hover:text-rose-400 hover:border-rose-500/40'
                }
              `}
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* User profile compact badge (when expanded) */}
          {!collapsed && (
            <div className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px]
              ${settings.theme === 'light' ? 'bg-white/60 text-[#26382D]' : 'bg-[#111820]/60 text-[#E8EEF5]'}
            `}>
              <div className="truncate">
                <div className="font-bold truncate">
                  {currentUserRole === 'user' && userProfile.name}
                  {currentUserRole === 'electrician' && (electricianProfile?.name || 'Vikram Jadhav')}
                  {currentUserRole === 'admin' && adminProfile.name}
                </div>
                <div className="text-[9px] opacity-70 font-mono truncate">
                  {currentUserRole === 'user' && userProfile.consumerNumber}
                  {currentUserRole === 'electrician' && 'Certified Pro'}
                  {currentUserRole === 'admin' && 'Chief Admin'}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
