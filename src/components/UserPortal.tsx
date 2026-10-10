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
  Settings as SettingsIcon,
  Download,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  ShieldAlert,
  Send,
  Building,
  Flame,
  Wrench,
  Award,
  Phone,
  RefreshCcw,
  Sparkles
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { SwitchboardTab } from '@/components/SwitchboardTab';
import { TelemetryTab } from '@/components/TelemetryTab';
import { BillingTab } from '@/components/BillingTab';
import { exportTelemetryReportPdf } from '@/lib/pdfGenerator';
import { audioController } from '@/lib/audioController';
import { AlarmTone } from '@/lib/types';

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
    settings,
    updateSettings,
    triggerFireEmergencyProtocol
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

  // Selected Electrician for booking
  const currentElectrician = electricians.find((e) => e.id === selectedElectricianId) || electricians[0];

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

  // Filter relevant chat messages
  const filteredChats = chatMessages.filter(
    (m) =>
      (chatChannel === 'user_admin' && (m.channel === 'user_admin' && (m.senderId === userProfile.id || m.recipientId === userProfile.id))) ||
      (chatChannel === 'user_electrician' && (m.channel === 'user_electrician' && (m.senderId === userProfile.id || m.recipientId === userProfile.id)))
  );

  return (
    <div className="space-y-6">
      
      {/* Consumer Quick Context Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-lg shrink-0">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base md:text-lg font-bold text-white">{userProfile.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Resident Consumer
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ID: <strong className="text-slate-200">{userProfile.consumerNumber}</strong> | {userProfile.blockArea} | Provider: <strong className="text-slate-200">{userProfile.electricityDepartment}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportTelemetryReportPdf(outlets, userProfile)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Download PDF Report</span>
          </button>

          <button
            onClick={() => triggerFireEmergencyProtocol('Master Bedroom AC', 'Simulated 180V Brownout Overheating (68°C)')}
            className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-xs font-bold text-rose-400 flex items-center space-x-1.5 transition"
          >
            <Flame className="w-4 h-4" />
            <span>Test Fire Emergency Call</span>
          </button>
        </div>
      </div>

      {/* Senior-Friendly Basic Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        {[
          { id: 'switchboard', label: 'Main Switches', icon: Zap },
          { id: 'telemetry', label: 'Power & Health', icon: Activity },
          { id: 'billing', label: 'Monthly Bill', icon: DollarSign },
          { id: 'electrician', label: 'Book Electrician', icon: UserCheck },
          { id: 'report_bug', label: 'Report Issue', icon: AlertOctagon },
          { id: 'chat', label: 'Help Chat', icon: MessageSquare },
          { id: 'call_dept', label: 'Call Electricity Dept', icon: PhoneCall },
          { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = userActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setUserActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-teal-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Main Switches */}
      {userActiveTab === 'switchboard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-teal-400" />
              <span>Home Appliance Circuit Board</span>
            </h3>
            <span className="text-xs text-slate-400">Click breaker buttons to simulate safe cutoffs</span>
          </div>
          <SwitchboardTab />
        </div>
      )}

      {/* TAB CONTENT: Power & Health (Telemetry) */}
      {userActiveTab === 'telemetry' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-teal-400" />
                <span>Live Power Telemetry & Voltage Chart</span>
              </h3>
              <p className="text-xs text-slate-400">Updated every second from home smart sensors</p>
            </div>
            <button
              onClick={() => exportTelemetryReportPdf(outlets, userProfile)}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF Audit</span>
            </button>
          </div>
          <TelemetryTab />
        </div>
      )}

      {/* TAB CONTENT: Monthly Bill */}
      {userActiveTab === 'billing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-teal-400" />
                <span>Electricity Bill & Energy Disaggregation</span>
              </h3>
              <p className="text-xs text-slate-400">Calculated per sanctioned tariff: ₹{userProfile.ratePerKwh}/kWh</p>
            </div>
            <button
              onClick={() => exportTelemetryReportPdf(outlets, userProfile)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 rounded-xl flex items-center space-x-1.5 transition"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>Save Bill PDF</span>
            </button>
          </div>
          <BillingTab />
        </div>
      )}

      {/* TAB CONTENT: Book Electrician */}
      {userActiveTab === 'electrician' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-teal-400" />
              <span>Certified Electricians in {userProfile.blockArea || 'Your Area'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
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
                      ? 'bg-slate-800/90 border-teal-500 shadow-lg shadow-teal-500/10 scale-[1.02]'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {idx === 0 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>TOP RATED</span>
                    </div>
                  )}

                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-lg shrink-0">
                      {elec.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                        <span>{elec.name}</span>
                        {elec.isOnline && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </h4>
                      <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{elec.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({elec.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 mb-4">
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{elec.dedicatedArea}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <Wrench className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{elec.workExperienceYears} Years Experience • {elec.completedJobsCount} Jobs Done</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 italic pt-1 border-t border-slate-800">
                      &quot;{elec.qualifications}&quot;
                    </p>
                  </div>

                  <div className="text-xs font-bold text-teal-400 flex items-center justify-between pt-2 border-t border-slate-800">
                    <span>{elec.availableSlots.filter((s) => !s.isBooked).length} Slots Available</span>
                    <span className="underline">Select & Book</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slot Booking Form */}
          {currentElectrician && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h4 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-teal-400" />
                <span>Select Available Slot with {currentElectrician.name}</span>
              </h4>

              {bookingSuccess && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Appointment Confirmed! Confirmation message sent to Help Chat.</span>
                </div>
              )}

              <form onSubmit={handleBookSlot} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
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
                              ? 'opacity-40 bg-slate-950 border-slate-800 cursor-not-allowed text-slate-500'
                              : isSelected
                              ? 'bg-teal-500/20 border-teal-500 text-white font-bold shadow-md'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="font-semibold">{slot.date}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">{slot.time}</div>
                          <div className="mt-1 text-[10px] uppercase font-bold text-teal-400">
                            {slot.isBooked ? 'Booked' : 'Available'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Service Requirement Title:
                    </label>
                    <input
                      type="text"
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      placeholder="e.g. AC Tripping / Water Heater Lug Heat"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Problem Details / Notes:
                    </label>
                    <input
                      type="text"
                      value={serviceDesc}
                      onChange={(e) => setServiceDesc(e.target.value)}
                      placeholder="e.g. Breaker tripped twice today, mild burning smell."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedSlotId}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
                    selectedSlotId
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 shadow-lg shadow-teal-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
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

      {/* TAB CONTENT: Report Issue / Bug */}
      {userActiveTab === 'report_bug' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl mx-auto shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Report Electrical Fault or System Bug</h3>
              <p className="text-xs text-slate-400">Directly alerts the Admin Control Desk and creates a safety ticket.</p>
            </div>
          </div>

          {issueSubmitted && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Ticket logged successfully! Admin and on-duty technicians have been notified.</span>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Category:</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              >
                <option value="hazard_emergency">🚨 Critical Electrical Hazard / Sparking / Hot Wire</option>
                <option value="repair_request">🔧 Appliance Repair / Frequent MCB Tripping</option>
                <option value="billing_inquiry">💰 Electricity Bill / Meter Tariff Query</option>
                <option value="system_bug">💻 App Bug / Chart Display Glitch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title / Subject:</label>
              <input
                type="text"
                required
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="e.g. Refrigerator lug heating up repeatedly"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description:</label>
              <textarea
                rows={4}
                required
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                placeholder="Describe what you observed (e.g. burning smell, humming sound, voltage fluctuations)..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400 resize-none"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>📍 Registered Residence: <strong className="text-slate-200">{userProfile.address}</strong></div>
              <div>⚡ Linked Provider: <strong className="text-slate-200">{userProfile.electricityDepartment}</strong></div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl shadow-lg transition"
            >
              Submit Ticket to Admin & Safety Roster
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: Help Chat */}
      {userActiveTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[560px]">
          
          {/* Chat Channel Selector */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChatChannel('user_admin')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  chatChannel === 'user_admin'
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Chat with Admin Support
              </button>
              <button
                onClick={() => setChatChannel('user_electrician')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  chatChannel === 'user_electrician'
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Chat with Electrician ({currentElectrician.name})
              </button>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online Helpdesk</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/60">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs">
                <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                <span>No messages in this channel yet. Type below to start conversation.</span>
              </div>
            ) : (
              filteredChats.map((msg) => {
                const isMe = msg.senderId === userProfile.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-500 mb-0.5 px-1">
                      {msg.senderName} • {msg.timestamp}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                        isMe
                          ? 'bg-teal-600 text-white rounded-br-none'
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
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              className="p-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl shadow-md transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: Call Electricity Dept */}
      {userActiveTab === 'call_dept' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <PhoneCall className="w-5 h-5 text-teal-400" />
              <span>Electricity Department & Emergency Directory</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct emergency helplines for grid breakdowns, voltage sags, and fire brigade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* National Fire Emergency */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/60 to-red-950/40 border border-rose-500/50 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-rose-600 rounded-xl text-white">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Fire Brigade Emergency</h4>
                    <span className="text-[11px] text-rose-300">National Emergency Services</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                  101 / 112
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Call immediately if electrical short circuit caused smoke, sparks, or open flames.
              </p>
              <div className="flex space-x-2 pt-1">
                <a
                  href="tel:101"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 101 Now</span>
                </a>
              </div>
            </div>

            {/* Mahavitaran (MSEDCL) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-teal-500/20 text-teal-400 rounded-xl">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Mahavitaran (MSEDCL)</h4>
                    <span className="text-[11px] text-slate-400">Maharashtra State Electricity Distribution</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-teal-300">
                  1912 / 1800-212-3435
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Toll-free 24/7 centralized emergency breakdown and power interruption helpline.
              </p>
              <div className="flex space-x-2 pt-1">
                <a
                  href="tel:1912"
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Call Helpline 1912</span>
                </a>
              </div>
            </div>

            {/* Tata Power Mumbai */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Tata Power Mumbai</h4>
                    <span className="text-[11px] text-slate-400">Distribution & Power Network</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-blue-300">
                  19123 / 1800-209-5161
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dedicated 24x7 control room for Mumbai suburban power line breakdowns and transformer faults.
              </p>
              <div className="flex space-x-2 pt-1">
                <a
                  href="tel:18002095161"
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Call 1800-209-5161</span>
                </a>
              </div>
            </div>

            {/* Adani Electricity Mumbai */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Adani Electricity Mumbai</h4>
                    <span className="text-[11px] text-slate-400">Suburban Grid Operations</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                  19122 / 1800-532-9998
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Customer care & emergency high-voltage cable assistance across Mumbai.
              </p>
              <div className="flex space-x-2 pt-1">
                <a
                  href="tel:19122"
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call 19122</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT: Settings */}
      {userActiveTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-2xl mx-auto shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Safety & Visual Preferences</h3>
              <p className="text-xs text-slate-400">Customize audible alarm tones, visual themes, and senior citizen modes.</p>
            </div>
          </div>

          {/* Visual Theme Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Visual Theme:</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'oled', label: 'OLED Dark', sub: 'True Pitch Black (#000)' },
                { id: 'slate', label: 'Deep Slate', sub: 'Rich Navy Slate (#0f172a)' },
                { id: 'light', label: 'Clean Light', sub: 'High Contrast White' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => updateSettings({ theme: th.id as any })}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    settings.theme === th.id
                      ? 'bg-teal-500/20 border-teal-500 text-white font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-100">{th.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{th.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audible Alarm Tone */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Audible Alarm Tone:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'buzzer', label: 'Industrial Buzzer' },
                { id: 'siren', label: 'Pulse Siren' },
                { id: 'chime', label: 'Soft Chime' },
                { id: 'synth', label: 'Custom Synth' },
              ].map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => {
                    updateSettings({ alarmTone: tone.id as AlarmTone });
                    audioController.previewTone(tone.id as AlarmTone, settings.alarmVolume);
                  }}
                  className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                    settings.alarmTone === tone.id
                      ? 'bg-rose-500/20 border-rose-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Senior Accessibility Toggle */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Senior Citizen Mode</div>
              <div className="text-xs text-slate-400">High contrast buttons, large touch targets, simplified terminology</div>
            </div>
            <input
              type="checkbox"
              checked={settings.seniorMode}
              onChange={(e) => updateSettings({ seniorMode: e.target.checked })}
              className="w-5 h-5 accent-teal-500 rounded"
            />
          </div>

          {/* Auto Fire Call Toggle */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Automated Fire Emergency Call & Dispatch</div>
              <div className="text-xs text-slate-400">Auto-dial resident and Fire Brigade (101) upon critical thermal hazard</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoFireEmergencyCall}
              onChange={(e) => updateSettings({ autoFireEmergencyCall: e.target.checked })}
              className="w-5 h-5 accent-rose-500 rounded"
            />
          </div>
        </div>
      )}

    </div>
  );
};
