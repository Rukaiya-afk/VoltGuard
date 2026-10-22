'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Flame, 
  Wrench, 
  Ticket, 
  MessageSquare, 
  Sliders, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Star, 
  MapPin, 
  Award, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  Activity, 
  Radio,
  FileText,
  Cpu
} from 'lucide-react';
import { useVoltStore, SEEDED_CONSUMERS } from '@/lib/store';
import { exportHazardIncidentReportPdf } from '@/lib/pdfGenerator';
import { TicketStatus } from '@/lib/types';
import { ModelTestingLab } from '@/components/ModelTestingLab';

export const AdminPortal: React.FC = () => {
  const { 
    adminActiveTab, 
    setAdminActiveTab, 
    adminProfile,
    outlets,
    electricians,
    tickets,
    updateTicketStatus,
    assignElectricianToTicket,
    addElectricianSlot,
    chatMessages,
    sendChatMessage,
    settings,
    updateSettings,
    userProfile
  } = useVoltStore();

  // Ticket Filter
  const [ticketFilter, setTicketFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Electrician slot adder state
  const [selectedElecForSlot, setSelectedElecForSlot] = useState(electricians[0]?.id || '');
  const [slotDate, setSlotDate] = useState('Tomorrow');
  const [slotTime, setSlotTime] = useState('11:00 AM - 12:30 PM');
  const [slotAddedNotice, setSlotAddedNotice] = useState(false);

  // Chat State: Target 'electrician' vs 'user'
  const [adminChatTarget, setAdminChatTarget] = useState<'electrician' | 'user'>('electrician');
  const [selectedChatElectrician, setSelectedChatElectrician] = useState<string>(electricians[0]?.id || 'elec-vikram');
  const [selectedChatUser, setSelectedChatUser] = useState<string>(SEEDED_CONSUMERS[0].id);

  // Sensor Sensitivity State (Standard baseline: 0.75 / 75)
  const [tempSensitivity, setTempSensitivity] = useState<number>(settings.anomalySensitivity || 0.75);
  const [isSensitivitySaved, setIsSensitivitySaved] = useState<boolean>(true);
  const [sensitivityNotice, setSensitivityNotice] = useState<string>('');

  const handleSensitivitySlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTempSensitivity(val);
    setIsSensitivitySaved(val === 0.75);
    setSensitivityNotice('');
  };

  const handleSaveSensitivity = () => {
    updateSettings({ anomalySensitivity: tempSensitivity });
    setIsSensitivitySaved(true);
    setSensitivityNotice(`Safety sensitivity threshold of ${tempSensitivity.toFixed(2)} saved successfully.`);
    setTimeout(() => setSensitivityNotice(''), 3000);
  };

  const handleResetSensitivity = () => {
    setTempSensitivity(0.75);
    updateSettings({ anomalySensitivity: 0.75 });
    setIsSensitivitySaved(true);
    setSensitivityNotice('Sensor sensitivity reset back to regulatory baseline (75).');
    setTimeout(() => setSensitivityNotice(''), 3000);
  };
  const [adminChatInput, setAdminChatInput] = useState('');

  // Slot timing submission
  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotDate || !slotTime) return;
    addElectricianSlot(selectedElecForSlot, slotDate, slotTime);
    setSlotAddedNotice(true);
    setTimeout(() => setSlotAddedNotice(false), 2000);
  };

  // Chat send: Bidirectional Electrician <-> Admin or User <-> Admin
  const handleAdminSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatInput.trim()) return;

    if (adminChatTarget === 'electrician') {
      const elec = electricians.find((e) => e.id === selectedChatElectrician) || electricians[0];
      sendChatMessage({
        senderId: 'admin',
        senderName: 'Rukaiya (Chief Safety Administrator)',
        senderRole: 'admin',
        recipientId: elec.id,
        recipientName: elec.name,
        channel: 'electrician_admin',
        text: adminChatInput.trim(),
      });
    } else {
      const consumer = SEEDED_CONSUMERS.find((c) => c.id === selectedChatUser) || SEEDED_CONSUMERS[0];
      sendChatMessage({
        senderId: 'admin',
        senderName: 'VoltGuard Safety Control Desk',
        senderRole: 'admin',
        recipientId: consumer.id,
        recipientName: consumer.name,
        channel: 'user_admin',
        text: adminChatInput.trim(),
      });
    }

    setAdminChatInput('');
  };

  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter !== 'ALL' && t.status !== ticketFilter) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.consumerName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeChats = chatMessages.filter((m) => {
    if (adminChatTarget === 'electrician') {
      return (
        m.channel === 'electrician_admin' &&
        ((m.senderId === 'admin' && m.recipientId === selectedChatElectrician) ||
         (m.senderId === selectedChatElectrician && m.recipientId === 'admin') ||
         (m.senderRole === 'electrician' && m.senderId === selectedChatElectrician))
      );
    } else {
      return (
        m.channel === 'user_admin' &&
        ((m.senderId === 'admin' && m.recipientId === selectedChatUser) ||
         (m.senderId === selectedChatUser && m.recipientId === 'admin'))
      );
    }
  });

  return (
    <div className="space-y-6">
      
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-blue-50 border border-indigo-200/80 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 dark:border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md dark:shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 border border-indigo-300 dark:bg-indigo-500/20 dark:border-indigo-500/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xl shrink-0 shadow-xs">
            🛡️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">{adminProfile.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/40">
                Admin Control Desk
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {adminProfile.title} • {adminProfile.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-indigo-300 font-mono flex items-center space-x-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Grid Status: Monitored Normal</span>
          </span>
        </div>
      </div>

      {/* Admin Tabs (Auto-spaced, No horizontal scroll, Hover-toggle) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 p-2 bg-white/95 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl backdrop-blur-md">
        {[
          { id: 'overview', label: 'Overview', icon: ShieldCheck },
          { id: 'users', label: 'Residents', icon: Users },
          { id: 'incidents', label: 'Fire Forensics', icon: Flame },
          { id: 'electricians', label: 'Electricians', icon: Wrench },
          { id: 'tickets', label: 'Tickets', icon: Ticket },
          { id: 'chat', label: 'Help Desk', icon: MessageSquare },
          { id: 'model_testing', label: 'Algorithm Lab', icon: Cpu },
          { id: 'settings', label: 'Settings', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminActiveTab(tab.id as any)}
              onMouseEnter={() => setAdminActiveTab(tab.id as any)}
              className={`flex items-center justify-center space-x-1.5 px-2 py-3 rounded-xl text-xs md:text-sm font-bold text-center transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/90 to-blue-600/90 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80 hover:scale-[1.01]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Safety Overview */}
      {adminActiveTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Monitored Residents</div>
              <div className="text-2xl font-bold text-white mt-1">4 Accounts Active</div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Sensors Online</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="text-xs text-slate-400 font-semibold uppercase">Active Electricians on Duty</div>
              <div className="text-2xl font-bold text-white mt-1">{electricians.length} Certified Pros</div>
              <div className="text-xs text-teal-400 mt-1">Avg Rating: 4.9 ★ (454 reviews)</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="text-xs text-slate-400 font-semibold uppercase">Open Support / Bug Tickets</div>
              <div className="text-2xl font-bold text-white mt-1">
                {tickets.filter((t) => t.status !== 'RESOLVED').length} Active
              </div>
              <div className="text-xs text-amber-400 mt-1">
                {tickets.filter((t) => t.status === 'IN_PROGRESS').length} In Progress by Technicians
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="text-xs text-slate-400 font-semibold uppercase">Fire Hazard Cutoffs Today</div>
              <div className="text-2xl font-bold text-white mt-1">0 Fatal Outbreaks</div>
              <div className="text-xs text-emerald-400 mt-1">Sub-20ms Tripping Protected</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: User Accounts & History */}
      {adminActiveTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Registered Consumer Accounts</h3>
            <span className="text-xs text-slate-400">Real-time status & linked electricity departments</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SEEDED_CONSUMERS.map((consumer) => {
              return (
                <div key={consumer.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{consumer.name}</h4>
                      <div className="text-xs text-indigo-400 font-mono mt-0.5">{consumer.consumerNumber}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      LIVE
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div>📍 {consumer.address}</div>
                    <div>⚡ Provider: <strong className="text-slate-200">{consumer.electricityDepartment}</strong></div>
                    <div>📞 Phone: <strong className="text-slate-200">{consumer.phone}</strong></div>
                    <div>💰 Tariff Slab: <strong className="text-slate-200">₹{consumer.ratePerKwh}/kWh</strong></div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        useVoltStore.getState().loginAsUser(consumer.id);
                        useVoltStore.getState().setUserActiveTab('switchboard');
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
                    >
                      Inspect Circuit Board →
                    </button>
                    <button
                      onClick={() => {
                        setSelectedChatUser(consumer.id);
                        setAdminActiveTab('chat');
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      Open Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Fire Incidents & Forensics */}
      {adminActiveTab === 'incidents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <span>Fire Hazard Surveillance & Incident Forensics</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pre-trip sensor telemetry snapshots, thermal escalation logs, and fire dispatch audit.</p>
            </div>
            <button
              onClick={() => {
                const dummyAlert = {
                  outlet_id: 'kitchen_geyser',
                  outlet_name: 'Kitchen Water Heater',
                  timestamp: new Date().toLocaleTimeString(),
                  voltage: 178.0,
                  current: 29.5,
                  cos_phi: 0.58,
                  temperature: 68.5,
                  anomaly_score: 0.94,
                  trip_latency_ms: 12,
                  diagnosis: '🔥 CRITICAL FIRE OUTBREAK HAZARD: Thermal lug temperature hit 68.5°C under low voltage stall. Virtual Breaker safely TRIPPED in 12ms!',
                };
                exportHazardIncidentReportPdf(dummyAlert, userProfile);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>Export Incident Forensic PDF</span>
            </button>
          </div>

          <div className="p-6 bg-white/95 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Recent Incident Snapshot (Kitchen Water Heater — Paud Road, Kothrud)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-100/90 rounded-xl border border-slate-200/90 dark:bg-slate-950 dark:border-slate-800 shadow-xs">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Peak Thermal Surge</div>
                <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">68.5 °C</div>
                <div className="text-[10px] font-medium text-rose-700 dark:text-rose-300">Hazard Limit: &gt;65°C</div>
              </div>
              <div className="p-3 bg-slate-100/90 rounded-xl border border-slate-200/90 dark:bg-slate-950 dark:border-slate-800 shadow-xs">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Line Brownout Sag</div>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">178.0 V</div>
                <div className="text-[10px] font-medium text-amber-700 dark:text-amber-300">Low Sag (&lt;185V)</div>
              </div>
              <div className="p-3 bg-slate-100/90 rounded-xl border border-slate-200/90 dark:bg-slate-950 dark:border-slate-800 shadow-xs">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Cutoff Trip Speed</div>
                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">12 ms</div>
                <div className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300">Sub-cycle Latching</div>
              </div>
              <div className="p-3 bg-slate-100/90 rounded-xl border border-slate-200/90 dark:bg-slate-950 dark:border-slate-800 shadow-xs">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Emergency Dispatch</div>
                <div className="text-lg font-bold text-blue-700 dark:text-blue-400 mt-0.5">1921 Alerted</div>
                <div className="text-[10px] font-medium text-blue-700 dark:text-blue-300">Electrician Assigned</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Electrician Roster & Slot Timings */}
      {adminActiveTab === 'electricians' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-indigo-400" />
                <span>Certified Electrician Network & Availability Slots</span>
              </h3>
              <p className="text-xs text-slate-400">Manage field qualifications, dedicated city blocks, and slot timings.</p>
            </div>
          </div>

          {/* Electrician Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {electricians.map((elec) => (
              <div key={elec.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center">
                      {elec.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{elec.name}</h4>
                      <div className="text-xs text-amber-400 font-bold flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{elec.rating.toFixed(1)} ★</span>
                        <span className="text-slate-400 font-normal">({elec.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1.5">
                  <div><strong>Qualifications:</strong> {elec.qualifications}</div>
                  <div><strong>Experience:</strong> {elec.workExperienceYears} Years • {elec.completedJobsCount} Jobs</div>
                  <div><strong>Assigned Block:</strong> {elec.dedicatedArea}</div>
                  <div><strong>Phone:</strong> {elec.phone}</div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-300 mb-1.5">Active Time Slots:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {elec.availableSlots.map((s) => (
                      <span
                        key={s.id}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold ${
                          s.isBooked
                            ? 'bg-slate-950 text-slate-500 border border-slate-800'
                            : 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/40'
                        }`}
                      >
                        {s.date} {s.time} {s.isBooked && '(Booked)'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Admin Slot Timing Creator */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Add / Open New Appointment Slot for Electrician</span>
            </h4>

            {slotAddedNotice && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-semibold rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Slot added! Available instantly on Resident Booking interface.</span>
              </div>
            )}

            <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Electrician:</label>
                <select
                  value={selectedElecForSlot}
                  onChange={(e) => setSelectedElecForSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
                >
                  {electricians.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} ({e.dedicatedArea})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date:</label>
                <select
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="12 Oct (Monday)">12 Oct (Monday)</option>
                  <option value="13 Oct (Tuesday)">13 Oct (Tuesday)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time Range:</label>
                <input
                  type="text"
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  placeholder="e.g. 10:00 AM - 11:30 AM"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: Bug & Support Tickets */}
      {adminActiveTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-white">Central Ticket & Incident Registry</h3>
            
            <div className="flex items-center space-x-2">
              {['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTicketFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    ticketFilter === filter
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">{ticket.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ticket.priority === 'CRITICAL_HAZARD'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    <span className="text-xs text-slate-500">• {ticket.createdAt}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{ticket.title}</h4>
                  <p className="text-xs text-slate-400">{ticket.description}</p>
                  
                  <div className="text-xs text-slate-300 pt-1 flex flex-wrap gap-x-4">
                    <span>Resident: <strong>{ticket.consumerName}</strong> ({ticket.consumerArea})</span>
                    <span>Provider: <strong>{ticket.consumerDepartment}</strong></span>
                    {ticket.assignedElectricianName && (
                      <span className="text-teal-400">Assigned: <strong>{ticket.assignedElectricianName}</strong></span>
                    )}
                  </div>

                  {ticket.review && (
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-amber-500/30 text-xs text-amber-300 mt-2">
                      ⭐ Rating: {ticket.rating} / 5 — &quot;{ticket.review}&quot;
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
                  <select
                    value={ticket.status}
                    onChange={(e) => updateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                    className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="OPEN">Status: OPEN</option>
                    <option value="ASSIGNED">Status: ASSIGNED</option>
                    <option value="IN_PROGRESS">Status: IN_PROGRESS</option>
                    <option value="RESOLVED">Status: RESOLVED</option>
                    <option value="CLOSED">Status: CLOSED</option>
                  </select>

                  {!ticket.assignedElectricianId && (
                    <select
                      onChange={(e) => assignElectricianToTicket(ticket.id, e.target.value)}
                      defaultValue=""
                      className="px-3 py-2 bg-indigo-950 border border-indigo-500/40 rounded-xl text-xs text-indigo-300 font-semibold focus:outline-none"
                    >
                      <option value="" disabled>Assign Electrician...</option>
                      {electricians.map((elec) => (
                        <option key={elec.id} value={elec.id}>{elec.name} ({elec.rating}★)</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Real-Time Field Electrician & Resident Chat */}
      {adminActiveTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[590px]">
          {/* Channel Header & Segmented Target Selector */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAdminChatTarget('electrician')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    adminChatTarget === 'electrician'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Field Electricians (Real-Time Uplink)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminChatTarget('user')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    adminChatTarget === 'user'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Resident Inquiries</span>
                </button>
              </div>

              {/* Real-Time Socket Connection Pill */}
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-300">
                  Socket.io Bridge Active (12ms)
                </span>
              </div>
            </div>

            {/* Recipient Selector & Details */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-900">
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-slate-400">
                  {adminChatTarget === 'electrician' ? 'Active Field Technician:' : 'Resident Account:'}
                </span>

                {adminChatTarget === 'electrician' ? (
                  <select
                    value={selectedChatElectrician}
                    onChange={(e) => setSelectedChatElectrician(e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
                  >
                    {electricians.map((elec) => (
                      <option key={elec.id} value={elec.id}>
                        ⚡ {elec.name} ({elec.rating}★ • {elec.city})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={selectedChatUser}
                    onChange={(e) => setSelectedChatUser(e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-indigo-400"
                  >
                    {SEEDED_CONSUMERS.map((c) => (
                      <option key={c.id} value={c.id}>
                        👤 {c.name} ({c.consumerNumber})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {adminChatTarget === 'electrician' && (
                <div className="text-[11px] text-slate-400 font-mono">
                  Channel: <span className="text-amber-400 font-bold">electrician_admin</span> (Encrypted Command Uplink)
                </div>
              )}
            </div>
          </div>

          {/* Quick Clearance Chips for Electricians */}
          {adminChatTarget === 'electrician' && (
            <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-[11px]">
              <span className="text-slate-400 shrink-0 font-semibold">Quick Clearance:</span>
              <button
                type="button"
                onClick={() => setAdminChatInput('Clearance Granted: Proceed with ceramic terminal lug replacement on TCK-1001.')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 transition"
              >
                ✅ Grant Lug Replacement
              </button>
              <button
                type="button"
                onClick={() => setAdminChatInput('Requesting live insulation & earth pit resistance test before re-arming breaker.')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 transition"
              >
                📊 Request Earth Pit Test
              </button>
              <button
                type="button"
                onClick={() => setAdminChatInput('Virtual Breaker reset approved. Stand clear of switchboard.')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 transition"
              >
                ⚡ Approve Breaker Reset
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/60">
            {activeChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs">
                <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                <span>
                  {adminChatTarget === 'electrician'
                    ? 'No message history with this electrician. Send dispatch orders or technical clearances below.'
                    : 'No message history with this resident. Type a message below.'}
                </span>
              </div>
            ) : (
              activeChats.map((msg) => {
                const isMe = msg.senderId === 'admin';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-slate-400 mb-0.5 px-1 font-mono">
                      {msg.senderName} • {msg.timestamp}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                        isMe
                          ? adminChatTarget === 'electrician'
                            ? 'bg-amber-600/90 text-slate-950 font-semibold rounded-br-none shadow-sm'
                            : 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleAdminSendChat} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={adminChatInput}
              onChange={(e) => setAdminChatInput(e.target.value)}
              placeholder={
                adminChatTarget === 'electrician'
                  ? 'Message field technician (e.g. Clearance granted, diagnostic logs confirmed)...'
                  : 'Type official safety instructions or response to resident...'
              }
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
            />
            <button 
              type="submit" 
              className={`p-2.5 rounded-xl shadow-md transition text-slate-950 font-bold ${
                adminChatTarget === 'electrician'
                  ? 'bg-amber-500 hover:bg-amber-400'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: AI Model & Algorithm Verification Lab */}
      {adminActiveTab === 'model_testing' && (
        <ModelTestingLab />
      )}

      {/* TAB 7: Admin Settings & Sensitivity Baseline */}
      {adminActiveTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-2xl mx-auto shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Grid Operations & Safety Sensor Thresholds</h3>
              <p className="text-xs text-slate-400">Adjust automated breaker tripping and emergency escalation rules.</p>
            </div>
          </div>

          {/* Strict Safety Mandate Warning Box (Requirement 4) */}
          <div className="p-4 bg-amber-950/40 border-2 border-amber-500/60 rounded-xl space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-amber-400 font-extrabold">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>STRICT SAFETY WARNING: SENSOR MUST FOLLOW A SENSITIVITY OF 75</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Under Maharashtra & Pune electrical safety regulations (IS 732 / NBC 2016), the power sensor MUST strictly follow a calibrated sensitivity threshold of <strong>75 (0.75)</strong>. 
              Altering this sensitivity risks undetected micro-arcing sparks and low-voltage cable overheating, or causes premature nuisance breaker tripping. 
              <strong>The sensor will automatically reset back to the sensitive point of 75 unless explicitly saved and authorized by the resident.</strong>
            </p>
          </div>

          {sensitivityNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{sensitivityNotice}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Electrical Safety Sensor Sensitivity:</span>
                <div className="flex items-center space-x-2 font-mono">
                  <span className={`text-sm font-bold ${tempSensitivity === 0.75 ? 'text-indigo-400' : 'text-amber-400'}`}>
                    {tempSensitivity.toFixed(2)}
                  </span>
                  {!isSensitivitySaved && (
                    <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40 animate-pulse font-sans">
                      Unsaved (Reverts to 75)
                    </span>
                  )}
                </div>
              </div>
              
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.01"
                value={tempSensitivity}
                onChange={handleSensitivitySlider}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>0.50 (HighProtection)</span>
                <span className="font-bold text-amber-400">75 (0.75 Standard Mandatory Baseline)</span>
                <span>0.95 (HighThreshold)</span>
              </div>

              {/* Action Buttons: Save or Reset to 75 */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  type="button"
                  onClick={handleSaveSensitivity}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Sensitivity (Resident Confirmation)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetSensitivity}
                  className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition"
                  title="Reset to 75 standard"
                >
                  Reset to 75
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Auto-Trip on Brownout Sag (&lt;185V sustained)</div>
                <div className="text-xs text-slate-400">Safely disengages compressors to prevent motor burning</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoCutoffEnabled}
                onChange={(e) => updateSettings({ autoCutoffEnabled: e.target.checked })}
                className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Automated Fire & Emergency (1921) Dispatch Gateway</div>
                <div className="text-xs text-slate-400">Initiates emergency auto-call upon thermal runaway (&gt;65°C) to Pune Emergency</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoFireEmergencyCall}
                onChange={(e) => updateSettings({ autoFireEmergencyCall: e.target.checked })}
                className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
