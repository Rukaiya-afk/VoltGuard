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
  FileText
} from 'lucide-react';
import { useVoltStore, SEEDED_CONSUMERS } from '@/lib/store';
import { exportTelemetryReportPdf, exportHazardIncidentReportPdf } from '@/lib/pdfGenerator';
import { TicketStatus } from '@/lib/types';

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

  // Chat State
  const [selectedChatUser, setSelectedChatUser] = useState<string>(SEEDED_CONSUMERS[0].id);
  const [adminChatInput, setAdminChatInput] = useState('');

  // Slot timing submission
  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotDate || !slotTime) return;
    addElectricianSlot(selectedElecForSlot, slotDate, slotTime);
    setSlotAddedNotice(true);
    setTimeout(() => setSlotAddedNotice(false), 2000);
  };

  // Chat send
  const handleAdminSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatInput.trim()) return;

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

    setAdminChatInput('');
  };

  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter !== 'ALL' && t.status !== ticketFilter) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.consumerName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeChats = chatMessages.filter(
    (m) => (m.senderId === selectedChatUser && m.recipientId === 'admin') || (m.senderId === 'admin' && m.recipientId === selectedChatUser)
  );

  return (
    <div className="space-y-6">
      
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xl shrink-0">
            🛡️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base md:text-lg font-bold text-white">{adminProfile.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Admin Control Desk
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {adminProfile.title} • {adminProfile.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportTelemetryReportPdf(outlets, userProfile)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Grid Telemetry PDF</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        {[
          { id: 'overview', label: 'Safety Overview', icon: ShieldCheck },
          { id: 'users', label: 'User Accounts', icon: Users },
          { id: 'incidents', label: 'Fire Incidents & Forensics', icon: Flame },
          { id: 'electricians', label: 'Electrician Roster & Slots', icon: Wrench },
          { id: 'tickets', label: 'Bug & Support Tickets', icon: Ticket },
          { id: 'chat', label: 'Support Desk Chat', icon: MessageSquare },
          { id: 'settings', label: 'Admin Settings', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
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
              <div className="text-2xl font-bold text-white mt-1">3 Accounts Active</div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Telemetry Online</span>
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

          {/* Quick PDF Report Generator Card */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Download Certified City Grid & Telemetry Report (PDF)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Generates a formal, printable PDF document containing all monitored circuit metrics, breaker trip logs, and tariff statistics.
              </p>
            </div>
            <button
              onClick={() => exportTelemetryReportPdf(outlets, userProfile)}
              className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 shrink-0 transition"
            >
              <Download className="w-4 h-4" />
              <span>Generate Official PDF</span>
            </button>
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
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <span>Fire Hazard Surveillance & Incident Forensics</span>
              </h3>
              <p className="text-xs text-slate-400">Pre-trip sensor telemetry snapshots, thermal escalation logs, and fire dispatch audit.</p>
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

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Recent Incident Snapshot (Kitchen Water Heater — Bandra West)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Peak Thermal Surge</div>
                <div className="text-lg font-bold text-rose-400 mt-0.5">68.5 °C</div>
                <div className="text-[10px] text-rose-300">Hazard Limit: &gt;65°C</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Line Brownout Sag</div>
                <div className="text-lg font-bold text-amber-400 mt-0.5">178.0 V</div>
                <div className="text-[10px] text-amber-300">Low Sag (&lt;185V)</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Cutoff Trip Speed</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">12 ms</div>
                <div className="text-[10px] text-emerald-300">Sub-cycle Latching</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Emergency Dispatch</div>
                <div className="text-lg font-bold text-blue-400 mt-0.5">101 Alerted</div>
                <div className="text-[10px] text-blue-300">Electrician Assigned</div>
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

      {/* TAB 6: Support Desk Chat */}
      {adminActiveTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[560px]">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-400">Chatting with Resident:</span>
              <select
                value={selectedChatUser}
                onChange={(e) => setSelectedChatUser(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-indigo-400"
              >
                {SEEDED_CONSUMERS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.consumerNumber})</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-indigo-400 font-mono font-bold">Admin Dispatch Channel</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/60">
            {activeChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs">
                <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                <span>No message history with this resident. Type a message below.</span>
              </div>
            ) : (
              activeChats.map((msg) => {
                const isMe = msg.senderId === 'admin';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-slate-500 mb-0.5 px-1">{msg.senderName} • {msg.timestamp}</div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-none'
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

          <form onSubmit={handleAdminSendChat} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={adminChatInput}
              onChange={(e) => setAdminChatInput(e.target.value)}
              placeholder="Type official safety instructions or response to resident..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
            />
            <button type="submit" className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: Admin Settings */}
      {adminActiveTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-2xl mx-auto shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Grid Operations & Security Thresholds</h3>
              <p className="text-xs text-slate-400">Adjust automated breaker tripping and emergency escalation rules.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Isolation Forest Anomaly Cutoff Sensitivity:</span>
                <span className="text-indigo-400 font-mono font-bold">{settings.anomalySensitivity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={settings.anomalySensitivity}
                onChange={(e) => updateSettings({ anomalySensitivity: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <span className="text-[11px] text-slate-500">Lower triggers earlier; 0.72 is safety standard.</span>
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
                className="w-5 h-5 accent-indigo-500 rounded"
              />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Automated Fire Brigade (101) Dispatch Gateway</div>
                <div className="text-xs text-slate-400">Initiates emergency auto-call upon thermal runaway (&gt;65°C)</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoFireEmergencyCall}
                onChange={(e) => updateSettings({ autoFireEmergencyCall: e.target.checked })}
                className="w-5 h-5 accent-rose-500 rounded"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
