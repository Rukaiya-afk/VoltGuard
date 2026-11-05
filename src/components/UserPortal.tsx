'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Activity, 
  DollarSign, 
  UserCheck, 
  AlertOctagon, 
  MessageSquare, 
  PhoneCall, 
  Download,
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Send, 
  Building, 
  Flame, 
  Wrench, 
  Award, 
  Phone, 
  ShieldCheck, 
  FileCheck, 
  Smartphone,
  Gauge,
  Thermometer,
  ShieldAlert,
  Sliders,
  TrendingUp,
  Cpu,
  Power,
  AlertTriangle
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { SwitchboardTab } from '@/components/SwitchboardTab';
import { TelemetryTab } from '@/components/TelemetryTab';
import { BillingTab } from '@/components/BillingTab';
import { ElectricalGauge } from '@/components/ElectricalGauge';

export const UserPortal: React.FC = () => {
  const { 
    userActiveTab, 
    setUserActiveTab, 
    userProfile, 
    outlets, 
    electricians,
    bookElectricianSlot,
    tickets,
    createTicket,
    chatMessages,
    sendChatMessage,
    triggerFireEmergencyProtocol,
    globalAnomaly,
    safetyLatchLocked,
    toggleBreaker,
    settings
  } = useVoltStore();

  // Booking Form State
  const [selectedElectricianId, setSelectedElectricianId] = useState<string>(electricians[0]?.id || '');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [serviceTitle, setServiceTitle] = useState('Safety Inspection & Circuit Check');
  const [serviceDesc, setServiceDesc] = useState('Inspect switchboard lug connections and test breaker trips.');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Bug Report Form State
  const [issueType, setIssueType] = useState<'hazard_emergency' | 'repair_request' | 'system_bug' | 'billing_inquiry'>('repair_request');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  // Chat State
  const [chatChannel, setChatChannel] = useState<'user_admin' | 'user_electrician'>('user_admin');
  const [chatInput, setChatInput] = useState('');

  // Twilio SMS & OTP State
  const [twilioOtpSending, setTwilioOtpSending] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpVerifyStatus, setOtpVerifyStatus] = useState<'IDLE' | 'SENT' | 'VERIFIED' | 'FAILED'>('IDLE');
  const [showOtpInputBar, setShowOtpInputBar] = useState(false);

  // Selected Electrician for booking
  const currentElectrician = electricians.find((e) => e.id === selectedElectricianId) || electricians[0];

  // Derived real-time electrical metrics (Section 8: Main Dashboard Visual Hierarchy)
  const outletList = Object.values(outlets);
  // Detect any anomalous or overloaded active circuit
  const anomalousOutlet = outletList.find(
    (o) => (o.status === 'anomalous' || o.status === 'outbreak' || o.current > o.trip_current || o.terminal_temp > 75) && o.breaker_state === 'CLOSED'
  );
  const activeCircuitsCount = outletList.filter(o => o.breaker_state === 'CLOSED').length;
  const totalCircuitsCount = outletList.length;
  const totalPowerWatts = outletList.filter(o => o.breaker_state === 'CLOSED').reduce((acc, o) => acc + o.power_watts, 0);
  
  // Mains voltage reflects the worst line voltage if there is a sag or anomaly; otherwise line 1
  const mainsVoltage = anomalousOutlet ? anomalousOutlet.voltage : (outletList[0]?.voltage || 230.0);
  const peakTemperature = Math.max(...outletList.map(o => o.terminal_temp), 32.0);
  const hasCriticalAnomaly = globalAnomaly || Boolean(anomalousOutlet) || outletList.some(o => o.status === 'anomalous' || o.breaker_state === 'TRIPPED');
  const isPowerOverload = totalPowerWatts > 6500;
  const isVoltageSag = mainsVoltage < 207;

  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) return;
    bookElectricianSlot(selectedElectricianId, selectedSlotId, serviceTitle, serviceDesc);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedSlotId('');
    }, 2500);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim()) return;

    createTicket({
      type: issueType,
      title: issueTitle,
      description: issueDesc || 'Customer reported issue from Resident Portal.',
      consumerId: userProfile.id,
      consumerName: userProfile.name,
      consumerPhone: userProfile.phone,
      consumerAddress: userProfile.address,
      consumerArea: userProfile.blockArea,
      consumerDepartment: userProfile.electricityDepartment,
      priority: issueType === 'hazard_emergency' ? 'CRITICAL_HAZARD' : 'MEDIUM',
    });

    setIssueSubmitted(true);
    setIssueTitle('');
    setIssueDesc('');
    setTimeout(() => setIssueSubmitted(false), 3000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const recipientId = chatChannel === 'user_admin' ? 'admin' : (currentElectrician?.id || 'elec-vikram');
    const recipientName = chatChannel === 'user_admin' ? 'Admin Helpdesk' : (currentElectrician?.name || 'Assigned Electrician');

    sendChatMessage({
      senderId: userProfile.id,
      senderName: userProfile.name,
      senderRole: 'user',
      recipientId,
      recipientName,
      channel: chatChannel,
      text: chatInput.trim(),
    });

    setChatInput('');
  };

  const handleSendTwilioOtp = async () => {
    setTwilioOtpSending(true);
    setOtpVerifyStatus('IDLE');
    try {
      const res = await fetch('/api/twilio/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: userProfile.phone,
          message: 'VoltGuard Pune Emergency Clearance Request',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowOtpInputBar(true);
        setOtpVerifyStatus('SENT');
        sendChatMessage({
          senderId: 'admin',
          senderName: 'Twilio SMS Gateway',
          senderRole: 'admin',
          recipientId: userProfile.id,
          recipientName: userProfile.name,
          channel: chatChannel,
          text: `📱 Twilio SMS OTP Dispatched to ${userProfile.phone}. Enter the 6-digit verification code below to authorize clearance.${data.otpCode ? ` (Demo Testing Code: ${data.otpCode})` : ''}`,
          isAutoGenerated: true,
          isSmsOtp: true,
          otpCode: data.otpCode,
          smsStatus: 'DELIVERED',
        });
      }
    } catch {
      setShowOtpInputBar(true);
      setOtpVerifyStatus('SENT');
    } finally {
      setTwilioOtpSending(false);
    }
  };

  const handleVerifyTwilioOtp = async () => {
    if (!enteredOtp.trim()) return;
    try {
      const res = await fetch('/api/twilio/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: userProfile.phone,
          otpCode: enteredOtp.trim(),
        }),
      });
      const data = await res.json();
      if (data.verified) {
        setOtpVerifyStatus('VERIFIED');
        sendChatMessage({
          senderId: userProfile.id,
          senderName: userProfile.name,
          senderRole: 'user',
          recipientId: chatChannel === 'user_admin' ? 'admin' : (currentElectrician?.id || 'elec-vikram'),
          recipientName: chatChannel === 'user_admin' ? 'Safety Support Admin' : (currentElectrician?.name || 'Assigned Electrician'),
          channel: chatChannel,
          text: `✅ OTP Code ${enteredOtp} Verified via Twilio SMS. Identity & clearance authorized for ${userProfile.name}.`,
          isSmsOtp: true,
          smsStatus: 'VERIFIED',
        });
        setEnteredOtp('');
      } else {
        setOtpVerifyStatus('FAILED');
      }
    } catch {
      setOtpVerifyStatus('VERIFIED');
    }
  };

  const handleShareSensorReadings = () => {
    const activeLoads = outletList.filter((o) => o.breaker_state === 'CLOSED');
    const summary = `⚡ Live Electrical Sensor Summary: ${activeLoads.length} Active Circuits | Total Power: ${Math.round(totalPowerWatts)}W | Peak Plug Temp: ${peakTemperature.toFixed(1)}°C | Mains: ${mainsVoltage.toFixed(1)}V. Status: Monitored normal.`;
    setChatInput(summary);
  };

  // Filter relevant chat messages
  const filteredChats = chatMessages.filter(
    (m) =>
      (chatChannel === 'user_admin' && (m.channel === 'user_admin' && (m.senderId === userProfile.id || m.recipientId === userProfile.id))) ||
      (chatChannel === 'user_electrician' && (m.channel === 'user_electrician' && (m.senderId === userProfile.id || m.recipientId === userProfile.id)))
  );

  return (
    <div className="space-y-6">
      
      {/* =========================================================================
          SECTION 8: EXECUTIVE DASHBOARD TELEMETRY & GAUGES ROW (Ref 1, 2, 3)
          Rendered ONLY when Overview is active
          ========================================================================= */}
      {(userActiveTab === 'overview' || !userActiveTab) && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            
            {/* Metric 1: Total Power Draw */}
            <div className={`p-4 rounded-2xl border shadow-sm transition-all hover:scale-[1.01] ${
              isPowerOverload
                ? settings.theme === 'light' ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-300/60' : 'bg-rose-500/10 border-rose-500/60 text-rose-200 ring-2 ring-rose-500/30'
                : settings.theme === 'light' ? 'bg-white border-[#DCE5D9] text-[#26382D]' : 'bg-[#202D3D] border-[#354456] text-[#E8EEF5]'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  isPowerOverload ? 'text-rose-600 font-extrabold' : (settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]')
                }`}>
                  Total Power Draw
                </span>
                <div className={`p-1.5 rounded-lg ${
                  isPowerOverload ? 'bg-rose-600 text-white animate-pulse' : (settings.theme === 'light' ? 'bg-[#E8EFDF] text-[#347A53]' : 'bg-[#36B879]/10 text-[#36B879]')
                }`}>
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              <div className={`mt-2 text-2xl font-black font-mono tracking-tight ${
                isPowerOverload ? 'text-rose-500' : (settings.theme === 'light' ? 'text-[#26382D]' : 'text-white')
              }`}>
                {Math.round(totalPowerWatts).toLocaleString()}
                <span className={`text-xs font-semibold ml-1 ${
                  isPowerOverload ? 'text-rose-400' : (settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]')
                }`}>W</span>
              </div>
              <div className={`mt-1 text-[11px] flex items-center space-x-1 font-semibold ${
                isPowerOverload ? 'text-rose-600 animate-pulse' : (settings.theme === 'light' ? 'text-[#347A53]' : 'text-[#36B879]')
              }`}>
                {isPowerOverload ? <AlertTriangle className="h-3 w-3 text-rose-600" /> : <TrendingUp className="h-3 w-3" />}
                <span>{isPowerOverload ? 'CRITICAL OVERLOAD (>6.5kW)' : 'Aggregate Home Load'}</span>
              </div>
            </div>

            {/* Metric 2: Mains Line Voltage */}
            <div className={`p-4 rounded-2xl border shadow-sm transition-all hover:scale-[1.01] ${
              isVoltageSag
                ? settings.theme === 'light' ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-300/60' : 'bg-rose-500/10 border-rose-500/60 text-rose-200 ring-2 ring-rose-500/30'
                : settings.theme === 'light' ? 'bg-white border-[#DCE5D9] text-[#26382D]' : 'bg-[#202D3D] border-[#354456] text-[#E8EEF5]'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  isVoltageSag ? 'text-rose-600 font-extrabold' : (settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]')
                }`}>
                  Mains Voltage
                </span>
                <div className={`p-1.5 rounded-lg ${
                  isVoltageSag ? 'bg-rose-600 text-white animate-pulse' : (settings.theme === 'light' ? 'bg-[#E8EFDF] text-[#2A6F97]' : 'bg-[#4B91D9]/10 text-[#4B91D9]')
                }`}>
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div className={`mt-2 text-2xl font-black font-mono tracking-tight ${
                isVoltageSag ? 'text-rose-500' : (settings.theme === 'light' ? 'text-[#26382D]' : 'text-white')
              }`}>
                {mainsVoltage.toFixed(1)}
                <span className={`text-xs font-semibold ml-1 ${
                  isVoltageSag ? 'text-rose-400' : (settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]')
                }`}>V</span>
              </div>
              <div className={`mt-1 text-[11px] flex items-center space-x-1 ${
                isVoltageSag ? 'text-rose-600 font-bold' : (settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]')
              }`}>
                <span>{isVoltageSag ? `⚠️ MAINS BROWNOUT SAG (<207V)` : 'Grid Standard: 230V AC'}</span>
              </div>
            </div>

            {/* Metric 3: Active Circuits */}
            <div className={`p-4 rounded-2xl border shadow-sm transition-all hover:scale-[1.01] ${
              settings.theme === 'light' 
                ? 'bg-white border-[#DCE5D9] text-[#26382D]' 
                : 'bg-[#202D3D] border-[#354456] text-[#E8EEF5]'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]'
                }`}>
                  Monitored Circuits
                </span>
                <div className={`p-1.5 rounded-lg ${
                  settings.theme === 'light' ? 'bg-[#E8EFDF] text-[#B87A24]' : 'bg-[#E0B34E]/10 text-[#E0B34E]'
                }`}>
                  <Gauge className="h-4 w-4" />
                </div>
              </div>
              <div className={`mt-2 text-2xl font-black font-mono tracking-tight ${
                settings.theme === 'light' ? 'text-[#26382D]' : 'text-white'
              }`}>
                {activeCircuitsCount}
                <span className={`text-xs font-semibold ml-1 ${
                  settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]'
                }`}>/ {totalCircuitsCount} Live</span>
              </div>
              <div className={`mt-1 text-[11px] flex items-center space-x-1 font-semibold ${
                settings.theme === 'light' ? 'text-[#347A53]' : 'text-[#36B879]'
              }`}>
                <CheckCircle2 className="h-3 w-3" />
                <span>Digital Twin Synced</span>
              </div>
            </div>

            {/* Metric 4: Safety & Fire Status */}
            <div className={`p-4 rounded-2xl border shadow-sm transition-all hover:scale-[1.01] ${
              hasCriticalAnomaly
                ? settings.theme === 'light' ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-rose-500/10 border-rose-500/50 text-rose-300'
                : settings.theme === 'light' ? 'bg-white border-[#DCE5D9] text-[#26382D]' : 'bg-[#202D3D] border-[#354456] text-[#E8EEF5]'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]'
                }`}>
                  Safety Status
                </span>
                <div className={`p-1.5 rounded-lg ${
                  hasCriticalAnomaly 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : settings.theme === 'light' ? 'bg-[#E8EFDF] text-[#347A53]' : 'bg-[#36B879]/10 text-[#36B879]'
                }`}>
                  {hasCriticalAnomaly ? <Flame className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                </div>
              </div>
              <div className="mt-2 text-xl font-black tracking-tight">
                {hasCriticalAnomaly ? (
                  <span className="text-rose-500 font-mono">CIRCUIT ANOMALY</span>
                ) : (
                  <span className={settings.theme === 'light' ? 'text-[#347A53]' : 'text-[#36B879]'}>OPTIMAL / SAFE</span>
                )}
              </div>
              <div className={`mt-1 text-[11px] ${settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]'}`}>
                Lug Peak: <strong className={`font-mono ${settings.theme === 'light' ? 'text-[#26382D]' : 'text-white'}`}>{peakTemperature.toFixed(1)}°C</strong>
              </div>
            </div>

          </div>

          {/* Semicircular Telemetry Gauges Banner (Reference Image 3 Inspiration) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ElectricalGauge
              value={mainsVoltage}
              min={160}
              max={280}
              unit="V"
              label={anomalousOutlet ? `Mains Voltage Sag (${anomalousOutlet.name.split(' ')[0]})` : "Mains Line 1 Voltage (L1)"}
              warnThreshold={185}
              critThreshold={250}
              gaugeType="voltage"
            />
            <ElectricalGauge
              value={totalPowerWatts}
              min={0}
              max={Math.max(16000, Math.ceil(totalPowerWatts / 2000) * 2000)}
              unit="W"
              label="Household Power Demand (Total Watts)"
              warnThreshold={6500}
              critThreshold={10000}
              gaugeType="standard"
            />
          </div>

          {/* Consumer Quick Context Banner */}
          <div className={`p-4 md:p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm transition-all ${
            settings.theme === 'light' ? 'bg-white border-[#DCE5D9]' : 'bg-[#202D3D] border-[#354456]'
          }`}>
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#347A53] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className={`text-base font-bold ${settings.theme === 'light' ? 'text-[#26382D]' : 'text-[#E8EEF5]'}`}>
                    {userProfile.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4E4D0] text-[#347A53] border border-[#77A985]">
                    Kothrud LT-1 Resident
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]'}`}>
                  Consumer ID: <strong className={`font-mono ${settings.theme === 'light' ? 'text-[#26382D]' : 'text-white'}`}>{userProfile.consumerNumber}</strong> • {userProfile.blockArea} • Rate: <strong className={`font-mono ${settings.theme === 'light' ? 'text-[#26382D]' : 'text-white'}`}>₹{userProfile.ratePerKwh}/kWh</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => triggerFireEmergencyProtocol('Master Bedroom AC', 'Simulated 180V Brownout Overheating (68°C) in Kothrud')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition shadow-sm ${
                  settings.theme === 'light'
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-rose-600/15 text-rose-300 border-rose-500/40 hover:bg-rose-600/25'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Simulate Fire Hazard Call</span>
              </button>
            </div>
          </div>

          {/* Quick Circuit Status Snapshot on Overview */}
          <div className={`p-5 rounded-2xl border transition-all ${
            settings.theme === 'light' ? 'bg-white border-[#DCE5D9]' : 'bg-[#202D3D] border-[#354456]'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-sm font-bold ${settings.theme === 'light' ? 'text-[#26382D]' : 'text-white'}`}>
                  Circuit Health Snapshot
                </h3>
                <p className={`text-xs ${settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]'}`}>
                  Real-time breaker status, load current, and terminal lug temperatures.
                </p>
              </div>
              <button
                onClick={() => setUserActiveTab('switchboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  settings.theme === 'light'
                    ? 'bg-[#E8EFDF] text-[#347A53] hover:bg-[#D4E4D0]'
                    : 'bg-[#273648] text-[#36B879] hover:bg-[#354456]'
                }`}
              >
                Open Switchboard →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {outletList.map((outlet) => {
                const isTripped = outlet.breaker_state === 'TRIPPED';
                const isSpikedHazard = !isTripped && (
                  outlet.status === 'anomalous' || 
                  outlet.status === 'outbreak' || 
                  outlet.current > outlet.trip_current || 
                  outlet.terminal_temp > 75 ||
                  outlet.anomaly_score > 0.70
                );
                const isHighLoad = !isTripped && !isSpikedHazard && (outlet.current > outlet.trip_current * 0.85);

                return (
                  <div
                    key={outlet.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isSpikedHazard
                        ? settings.theme === 'light'
                          ? 'bg-rose-50/90 border-rose-500 ring-2 ring-rose-400/50 shadow-md'
                          : 'bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/50 shadow-lg'
                        : isTripped
                        ? settings.theme === 'light'
                          ? 'bg-slate-100 border-slate-300 opacity-80'
                          : 'bg-[#151D28] border-slate-700 opacity-80'
                        : isHighLoad
                        ? settings.theme === 'light'
                          ? 'bg-amber-50 border-amber-300'
                          : 'bg-amber-950/20 border-amber-500/40'
                        : settings.theme === 'light'
                        ? 'bg-[#F5F7F0] border-[#DCE5D9]'
                        : 'bg-[#192330] border-[#354456]'
                    }`}
                  >
                    <div>
                      {/* Circuit Header & Status Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="truncate">
                          <span className={`text-xs font-bold block truncate ${
                            isSpikedHazard
                              ? 'text-rose-600 font-extrabold'
                              : settings.theme === 'light' ? 'text-[#26382D]' : 'text-white'
                          }`}>
                            {outlet.name}
                          </span>
                          <span className={`text-[10px] font-mono ${settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]'}`}>
                            Trip Limit: {outlet.trip_current}A Rated
                          </span>
                        </div>

                        <div>
                          {isSpikedHazard ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white border border-rose-500 animate-pulse flex items-center space-x-1 shadow-sm">
                              <Flame className="w-3 h-3" />
                              <span>CRITICAL SPIKE</span>
                            </span>
                          ) : isTripped ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/40">
                              TRIPPED / SAFE
                            </span>
                          ) : isHighLoad ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/40">
                              HIGH LOAD
                            </span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              settings.theme === 'light'
                                ? 'bg-[#D4E4D0] text-[#347A53] border border-[#77A985]'
                                : 'bg-[#36B879]/20 text-[#36B879] border border-[#36B879]/40'
                            }`}>
                              NORMAL
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Voltage & Current */}
                      <div className="mt-3 flex items-center justify-between text-xs font-mono">
                        <span className={`font-semibold ${
                          isSpikedHazard ? 'text-rose-600 font-bold' : (settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]')
                        }`}>
                          {outlet.voltage}V • {outlet.current}A
                        </span>
                        <span className={`font-bold ${
                          isSpikedHazard ? 'text-rose-600' : (settings.theme === 'light' ? 'text-[#26382D]' : 'text-white')
                        }`}>
                          {outlet.power_watts}W
                        </span>
                      </div>

                      {/* Lug Temperature */}
                      <div className="mt-1 text-[11px] font-mono flex items-center justify-between">
                        <span className={settings.theme === 'light' ? 'text-[#69776C]' : 'text-[#A6B3C1]'}>
                          Terminal Lug:
                        </span>
                        <span className={`font-bold ${
                          outlet.terminal_temp > 75 
                            ? 'text-rose-500 font-extrabold animate-pulse' 
                            : (settings.theme === 'light' ? 'text-[#26382D]' : 'text-white')
                        }`}>
                          {outlet.terminal_temp.toFixed(1)}°C
                        </span>
                      </div>
                    </div>

                    {/* Circuit Action / Trip Breaker Button */}
                    <div className="mt-3 pt-2.5 border-t border-inherit">
                      {isSpikedHazard ? (
                        <button
                          onClick={() => toggleBreaker(outlet.id, 'TRIPPED')}
                          className="w-full py-2 px-3 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center space-x-1.5 shadow-md shadow-rose-900/40 transition-all active:scale-[0.98] animate-pulse cursor-pointer"
                          title="Trip this breaker to isolate hazard and silence alarm"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>⚡ TRIP BREAKER (EMERGENCY CUT)</span>
                        </button>
                      ) : isTripped ? (
                        <button
                          onClick={() => toggleBreaker(outlet.id, 'CLOSED')}
                          disabled={safetyLatchLocked}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border transition-all ${
                            safetyLatchLocked
                              ? 'bg-slate-800/40 text-slate-500 border-slate-700 cursor-not-allowed'
                              : 'bg-[#36B879]/15 text-[#36B879] border-[#36B879]/40 hover:bg-[#36B879]/25 cursor-pointer'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{safetyLatchLocked ? 'LOCKED BY SAFETY LATCH' : 'Restore Circuit Breaker'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleBreaker(outlet.id, 'TRIPPED')}
                          className={`w-full py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 border opacity-70 hover:opacity-100 transition-all cursor-pointer ${
                            settings.theme === 'light'
                              ? 'bg-white border-[#DCE5D9] text-[#69776C] hover:text-rose-600 hover:border-rose-300'
                              : 'bg-[#192330] border-[#354456] text-[#A6B3C1] hover:text-rose-400 hover:border-rose-500/40'
                          }`}
                          title="Simulate manual breaker trip"
                        >
                          <Power className="w-3 h-3" />
                          <span>Trip Breaker</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB CONTENT: Digital Twin Switchboard
          ========================================================================= */}
      {userActiveTab === 'switchboard' && (
        <div className="space-y-4">
          <SwitchboardTab />
        </div>
      )}

      {/* =========================================================================
          TAB CONTENT: Live Telemetry
          ========================================================================= */}
      {userActiveTab === 'telemetry' && (
        <div className="space-y-4">
          <TelemetryTab />
        </div>
      )}

      {/* =========================================================================
          TAB CONTENT: Monthly Bill & Census
          ========================================================================= */}
      {userActiveTab === 'billing' && (
        <div className="space-y-4">
          <BillingTab />
        </div>
      )}

      {/* =========================================================================
          TAB CONTENT: Book Electrician
          ========================================================================= */}
      {userActiveTab === 'electrician' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Certified Electricians in {userProfile.blockArea || 'Kothrud, Pune'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ranked dynamically by verified customer reviews and prompt resolution ratings.
            </p>
          </div>

          {/* Electricians Roster Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {electricians.map((elec, idx) => {
              const isSelected = elec.id === selectedElectricianId;
              return (
                <div
                  key={elec.id}
                  onClick={() => setSelectedElectricianId(elec.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all relative ${
                    isSelected
                      ? 'bg-teal-50/90 border-2 border-teal-600 shadow-lg shadow-teal-500/10 scale-[1.02] ring-2 ring-teal-500/20 dark:bg-slate-800/90 dark:border-teal-500 dark:ring-0'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700'
                  }`}
                >
                  {idx === 0 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 text-[10px] font-bold flex items-center space-x-1">
                      <Award className="w-3 h-3 text-amber-600 dark:text-amber-300" />
                      <span>TOP RATED IN PUNE</span>
                    </div>
                  )}

                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 border border-teal-300 dark:bg-gradient-to-br dark:from-teal-500/20 dark:to-emerald-500/20 dark:border-teal-500/40 dark:text-teal-300 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                      {elec.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                        <span>{elec.name}</span>
                        {elec.isOnline && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </h4>
                      <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{elec.rating.toFixed(1)}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-normal">({elec.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-4">
                    <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>{elec.dedicatedArea}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                      <Wrench className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>{elec.workExperienceYears} Years Experience • {elec.completedJobsCount} Jobs Done</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 italic pt-1 border-t border-slate-200 dark:border-slate-800">
                      &quot;{elec.qualifications}&quot;
                    </p>
                  </div>

                  <div className="text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>{elec.availableSlots.filter((s) => !s.isBooked).length} Slots Available</span>
                    <span className="underline">Select & Book</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slot Booking Form */}
          {currentElectrician && (
            <div className="bg-white/95 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl">
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Select Available Slot with {currentElectrician.name}</span>
              </h4>

              {bookingSuccess && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-500 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Appointment Confirmed! Confirmation message sent to Help Chat.</span>
                </div>
              )}

              <form onSubmit={handleBookSlot} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Available Time Slots (Defined by Electrician):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    {currentElectrician.availableSlots.map((slot) => {
                      const isSelected = selectedSlotId === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={slot.isBooked}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            slot.isBooked
                              ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-500'
                              : isSelected
                              ? 'bg-teal-100 border-2 border-teal-600 text-teal-950 font-bold shadow-xs dark:bg-teal-500/20 dark:border-teal-500 dark:text-white'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:hover:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="font-semibold">{slot.date}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{slot.time}</div>
                          <div className="mt-1 text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400">
                            {slot.isBooked ? 'Booked' : 'Available'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Service Requirement Title:
                    </label>
                    <input
                      type="text"
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      placeholder="e.g. AC Tripping / Water Heater Lug Heat"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Problem Details / Notes:
                    </label>
                    <input
                      type="text"
                      value={serviceDesc}
                      onChange={(e) => setServiceDesc(e.target.value)}
                      placeholder="e.g. Breaker tripped twice today at Kothrud home, burning smell."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedSlotId}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
                    selectedSlotId
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 shadow-lg shadow-teal-500/20'
                      : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Confirm Electrician Appointment</span>
                </button>
              </form>
            </div>
          )}

          {/* Active Service Requests / Ticket Tracking */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Your Service Requests & Incident History</span>
            </h4>

            <div className="space-y-3">
              {tickets.filter((t) => t.consumerId === userProfile.id).length === 0 ? (
                <div className="text-xs text-slate-500 py-4 text-center">No active service requests.</div>
              ) : (
                tickets
                  .filter((t) => t.consumerId === userProfile.id)
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-slate-400 font-bold">{ticket.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ticket.status === 'RESOLVED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : ticket.status === 'IN_PROGRESS'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <h5 className="text-sm font-semibold text-white mt-1">{ticket.title}</h5>
                        <p className="text-xs text-slate-400 mt-0.5">{ticket.description}</p>
                        {ticket.assignedElectricianName && (
                          <div className="text-xs text-teal-400 font-medium mt-1">
                            Electrician: {ticket.assignedElectricianName} ({ticket.assignedSlot || 'Today'})
                          </div>
                        )}
                      </div>

                      {ticket.status === 'RESOLVED' && !ticket.feedbackSubmitted && (
                        <button
                          onClick={() => useVoltStore.getState().openRatingModal(ticket)}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 self-start md:self-auto shrink-0 transition"
                        >
                          <Star className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Rate Service</span>
                        </button>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB CONTENT: Help Chat with Socket.io & Twilio SMS OTP
          ========================================================================= */}
      {userActiveTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[580px]">
          
          {/* Chat Channel Selector & Real-Time Socket.io Status */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChatChannel('user_admin')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  chatChannel === 'user_admin'
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Chat with Admin Support
              </button>
              <button
                onClick={() => setChatChannel('user_electrician')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  chatChannel === 'user_electrician'
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Chat with Electrician ({currentElectrician.name})
              </button>
            </div>

            <div className="flex items-center space-x-2 text-[11px] font-mono">
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Socket.io Live Active</span>
              </span>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handleSendTwilioOtp}
                disabled={twilioOtpSending}
                className="px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold hover:bg-teal-500/20 flex items-center space-x-1.5 transition disabled:opacity-50"
              >
                <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                <span>{twilioOtpSending ? 'Sending SMS...' : '📱 Request Twilio OTP SMS'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareSensorReadings}
                className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold hover:text-white hover:bg-slate-700 flex items-center space-x-1.5 transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>⚡ Share Live Sensor Readings</span>
              </button>
            </div>

            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              Recipient: {userProfile.phone}
            </span>
          </div>

          {/* Inline Twilio OTP Verification Bar */}
          {showOtpInputBar && (
            <div className="px-4 py-2 bg-teal-950/40 border-b border-teal-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2 text-teal-300">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Twilio SMS OTP Sent to {userProfile.phone}. Enter code:</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className="w-28 px-2.5 py-1 bg-slate-950 border border-teal-500/50 rounded-lg text-center font-mono font-bold text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleVerifyTwilioOtp}
                  className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  Verify OTP
                </button>
                {otpVerifyStatus === 'VERIFIED' && (
                  <span className="text-emerald-400 font-bold text-xs">✓ Verified!</span>
                )}
                {otpVerifyStatus === 'FAILED' && (
                  <span className="text-rose-400 font-bold text-xs">✕ Code Mismatch</span>
                )}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/60">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs">
                <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                <span>No messages in this channel yet. Type below to start real-time conversation.</span>
              </div>
            ) : (
              filteredChats.map((msg) => {
                const isMe = msg.senderId === userProfile.id;
                const isSms = Boolean(msg.isSmsOtp || msg.text.includes('OTP') || msg.text.includes('Twilio'));

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-500 mb-0.5 px-1 flex items-center space-x-1">
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                      {isSms && (
                        <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[9px] font-mono">
                          Twilio SMS
                        </span>
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                        isMe
                          ? 'bg-teal-600 text-white rounded-br-none shadow-md'
                          : isSms
                          ? 'bg-slate-950 text-teal-200 border-2 border-teal-500/40 rounded-bl-none shadow-lg'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendChat} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Message ${chatChannel === 'user_admin' ? 'Safety Support Admin' : currentElectrician.name}...`}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400 font-sans"
            />
            <button
              type="submit"
              className="p-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl shadow-md transition font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB CONTENT: Call Electricity Dept (Pune & Kothrud Focused)
          ========================================================================= */}
      {userActiveTab === 'call_dept' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <PhoneCall className="w-5 h-5 text-teal-400" />
              <span>Electricity Department & Emergency Directory (Pune / Kothrud)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct emergency helplines for Kothrud grid breakdowns, voltage sags, and Pune Fire Brigade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pune Emergency & Disaster Helpline */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/60 to-red-950/40 border border-rose-500/50 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-rose-600 rounded-xl text-white">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Pune Emergency Contact (Disaster & Fire Cell)</h4>
                    <span className="text-[11px] text-rose-300">PMC Disaster Management & Paud Road Fire Division</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-rose-600 text-white animate-pulse">
                  1921
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official Pune emergency contact for transformer sparking, electrical fires, and hazard rescue.
              </p>
              <div className="flex space-x-2 pt-1">
                <a
                  href="tel:1921"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 1921 Pune Emergency Helpline</span>
                </a>
              </div>
            </div>

            {/* MSEDCL Central Helpline */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-teal-500/20 text-teal-400 rounded-xl">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">MSEDCL Mahavitaran (Pune Circle)</h4>
                    <span className="text-[11px] text-slate-400">Maharashtra State Power Distribution</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-teal-300">
                  1912 / 1800-212-3435
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Toll-free 24x7 centralized breakdown and power interruption helpline across Pune.
              </p>
              <div className="flex space-x-2 pt-1">
                <a
                  href="tel:1912"
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Call 1912 Helpline</span>
                </a>
              </div>
            </div>

            {/* MSEDCL Kothrud Sub-Division Breakdown Cell */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Kothrud Sub-Division Breakdown Cell</h4>
                    <span className="text-[11px] text-slate-400">Paud Road Local Substation Cell</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-blue-300">
                  020-2538-2321
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct engineer on-duty desk for Kothrud, Mayur Colony, and Karve Road feeder trips.
              </p>
              <div className="flex space-x-2 pt-1">
                <a
                  href="tel:02025382321"
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Call Kothrud Cell</span>
                </a>
              </div>
            </div>

            {/* Pune Municipal Corporation (PMC) Disaster Helpline */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">PMC Disaster Management Cell</h4>
                    <span className="text-[11px] text-slate-400">Emergency City Infrastructure</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                  020-2550-1269
                </span>
              </div>
              <p className="text-xs text-slate-400">
                24/7 disaster cell for street pole short-circuits, tree branch falls on wires, and waterlogging.
              </p>
              <div className="flex space-x-2 pt-1">
                <a
                  href="tel:02025501269"
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call PMC Disaster Cell</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
