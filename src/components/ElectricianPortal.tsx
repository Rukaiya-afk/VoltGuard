'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  MessageSquare, 
  AlertTriangle, 
  Star, 
  User, 
  CheckCircle2, 
  Send, 
  Plus, 
  Trash2, 
  MapPin, 
  Award, 
  Phone, 
  ShieldAlert,
  ThumbsUp
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { TicketStatus } from '@/lib/types';

export const ElectricianPortal: React.FC = () => {
  const { 
    electricianActiveTab, 
    setElectricianActiveTab, 
    electricianProfile, 
    electricians,
    tickets, 
    updateTicketStatus,
    addElectricianSlot,
    removeElectricianSlot,
    chatMessages,
    sendChatMessage,
    createTicket,
    openRatingModal
  } = useVoltStore();

  const currentElec = electricianProfile || electricians[0];

  // Slots Form State
  const [newSlotDate, setNewSlotDate] = useState('Tomorrow');
  const [newSlotTime, setNewSlotTime] = useState('02:00 PM - 03:30 PM');
  const [slotCreatedNotice, setSlotCreatedNotice] = useState(false);

  // Field Issue Report Form State
  const [fieldIssueTitle, setFieldIssueTitle] = useState('');
  const [fieldIssueDesc, setFieldIssueDesc] = useState('');
  const [fieldIssueSubmitted, setFieldIssueSubmitted] = useState(false);

  // Chat State
  const [clientChatInput, setClientChatInput] = useState('');
  const [adminChatInput, setAdminChatInput] = useState('');

  const myTickets = tickets.filter(
    (t) => t.assignedElectricianId === currentElec.id || (!t.assignedElectricianId && t.status === 'OPEN')
  );

  // Handle Add Slot
  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotDate || !newSlotTime) return;
    addElectricianSlot(currentElec.id, newSlotDate, newSlotTime);
    setSlotCreatedNotice(true);
    setTimeout(() => setSlotCreatedNotice(false), 2000);
  };

  // Handle Send Chat to Client
  const handleSendClientChat = (e: React.FormEvent, clientTicket?: (typeof tickets)[0]) => {
    e.preventDefault();
    if (!clientChatInput.trim()) return;

    const recipientId = clientTicket ? clientTicket.consumerId : 'user-rajesh';
    const recipientName = clientTicket ? clientTicket.consumerName : 'Rajesh Sharma';

    sendChatMessage({
      senderId: currentElec.id,
      senderName: `${currentElec.name} (Electrician)`,
      senderRole: 'electrician',
      recipientId,
      recipientName,
      channel: 'user_electrician',
      text: clientChatInput.trim(),
    });

    setClientChatInput('');
  };

  // Handle Send Chat to Admin
  const handleSendAdminChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatInput.trim()) return;

    sendChatMessage({
      senderId: currentElec.id,
      senderName: `${currentElec.name} (Electrician)`,
      senderRole: 'electrician',
      recipientId: 'admin',
      recipientName: 'Safety Control Desk',
      channel: 'electrician_admin',
      text: adminChatInput.trim(),
    });

    setAdminChatInput('');
  };

  // Handle Report Field Issue
  const handleReportFieldIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldIssueTitle.trim()) return;

    createTicket({
      type: 'repair_request',
      title: `[Field Report] ${fieldIssueTitle}`,
      description: fieldIssueDesc || 'Electrician logged field observation during on-site inspection.',
      consumerId: currentElec.id,
      consumerName: `${currentElec.name} (Field Technician)`,
      consumerPhone: currentElec.phone,
      consumerAddress: currentElec.dedicatedArea,
      consumerArea: currentElec.dedicatedArea,
      consumerDepartment: 'Central Grid Support',
      priority: 'HIGH',
    });

    setFieldIssueSubmitted(true);
    setFieldIssueTitle('');
    setFieldIssueDesc('');
    setTimeout(() => setFieldIssueSubmitted(false), 3000);
  };

  const clientChats = chatMessages.filter(
    (m) => (m.senderId === currentElec.id && m.channel === 'user_electrician') || (m.recipientId === currentElec.id && m.channel === 'user_electrician')
  );

  const adminChats = chatMessages.filter(
    (m) => (m.senderId === currentElec.id && m.channel === 'electrician_admin') || (m.recipientId === currentElec.id && m.channel === 'electrician_admin') || (m.channel === 'electrician_admin')
  );

  return (
    <div className="space-y-6">
      
      {/* Electrician Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-2xl shrink-0">
            ⚡
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base md:text-lg font-bold text-white">{currentElec.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                <Award className="w-3 h-3" />
                <span>Certified Field Pro</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentElec.qualifications} • Area: <strong className="text-slate-200">{currentElec.dedicatedArea}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-1 text-amber-400 font-bold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm">{currentElec.rating.toFixed(1)} ★</span>
          </div>
          <span className="text-slate-500">|</span>
          <div className="text-slate-300">
            <strong>{currentElec.completedJobsCount}</strong> Jobs Completed
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        {[
          { id: 'jobs', label: 'My Assigned Jobs', icon: Wrench },
          { id: 'slots', label: 'Set Time Slots', icon: Calendar },
          { id: 'client_chat', label: 'Client Chat', icon: MessageSquare },
          { id: 'admin_chat', label: 'Admin Desk Chat', icon: ShieldAlert },
          { id: 'report', label: 'Report Field Issue', icon: AlertTriangle },
          { id: 'reviews', label: 'Ratings & Reviews', icon: Star },
          { id: 'profile', label: 'My Profile & Area', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = electricianActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setElectricianActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Assigned Jobs */}
      {electricianActiveTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              <span>Active Service Tickets in Your Queue</span>
            </h3>
            <span className="text-xs text-slate-400">Update ticket status to trigger client rating</span>
          </div>

          <div className="space-y-3">
            {myTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-900 rounded-2xl border border-slate-800">
                No active service requests assigned to your queue at this moment.
              </div>
            ) : (
              myTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{ticket.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ticket.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : ticket.status === 'IN_PROGRESS'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {ticket.status}
                      </span>
                      {ticket.priority === 'CRITICAL_HAZARD' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          🚨 CRITICAL FIRE CUTOFF
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white">{ticket.title}</h4>
                    <p className="text-xs text-slate-300">{ticket.description}</p>

                    <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 pt-1">
                      <span>👤 Client: <strong className="text-slate-200">{ticket.consumerName}</strong></span>
                      <span>📍 Address: <strong className="text-slate-200">{ticket.consumerAddress}</strong></span>
                      <span>📞 Contact: <strong className="text-slate-200">{ticket.consumerPhone}</strong></span>
                      {ticket.assignedSlot && (
                        <span>⏰ Scheduled: <strong className="text-teal-400">{ticket.assignedSlot}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <select
                      value={ticket.status}
                      onChange={(e) => updateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                      className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
                    >
                      <option value="ASSIGNED">Status: Assigned</option>
                      <option value="IN_PROGRESS">Status: In Progress (On Site)</option>
                      <option value="RESOLVED">Status: Resolved & Fixed</option>
                      <option value="CLOSED">Status: Closed</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Set Time Slots */}
      {electricianActiveTab === 'slots' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Manage Your Available Slot Timings</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Feed in your available consultation hours so local residents can book directly.
            </p>
          </div>

          {slotCreatedNotice && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>New time slot published! Visible to residents in {currentElec.dedicatedArea}.</span>
            </div>
          )}

          {/* Add New Slot Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Available Time Slot</span>
            </h4>

            <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date:</label>
                <select
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="12 Oct (Monday)">12 Oct (Monday)</option>
                  <option value="13 Oct (Tuesday)">13 Oct (Tuesday)</option>
                  <option value="14 Oct (Wednesday)">14 Oct (Wednesday)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time Range:</label>
                <input
                  type="text"
                  required
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  placeholder="e.g. 10:00 AM - 11:30 AM"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
                >
                  Publish Time Slot
                </button>
              </div>
            </form>
          </div>

          {/* Active Slots Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-4">Your Active Slots ({currentElec.availableSlots.length})</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentElec.availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    slot.isBooked
                      ? 'bg-slate-950/80 border-slate-800 text-slate-400'
                      : 'bg-slate-950 border-amber-500/30 text-white'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{slot.date}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{slot.time}</div>
                    <div className="mt-1">
                      {slot.isBooked ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                          Booked by {slot.bookedByConsumerName || 'Client'}
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          Open for Booking
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeElectricianSlot(currentElec.id, slot.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
                    title="Remove Slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Client Chat */}
      {electricianActiveTab === 'client_chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[560px]">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Client Consultation Chat</h4>
              <span className="text-xs text-slate-400">Direct message channel with residents who booked your slots</span>
            </div>
            <span className="text-xs text-amber-400 font-mono font-bold">Field Channel</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/60">
            {clientChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs">
                <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                <span>No direct client messages yet. Type below to message active client.</span>
              </div>
            ) : (
              clientChats.map((msg) => {
                const isMe = msg.senderId === currentElec.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-slate-500 mb-0.5 px-1">{msg.senderName} • {msg.timestamp}</div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                        isMe
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none'
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

          <form onSubmit={handleSendClientChat} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={clientChatInput}
              onChange={(e) => setClientChatInput(e.target.value)}
              placeholder="Message client (e.g. On my way, ETA 15 minutes)..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button type="submit" className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md transition">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Admin Desk Chat */}
      {electricianActiveTab === 'admin_chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[560px]">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Central Admin & Grid Desk Chat</h4>
              <span className="text-xs text-slate-400">Request replacement safety components or report live voltage drops</span>
            </div>
            <span className="text-xs text-teal-400 font-mono font-bold">Admin Dispatch</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/60">
            {adminChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs">
                <ShieldAlert className="w-8 h-8 text-slate-600 mb-2" />
                <span>No messages with Admin Desk. Type below to request clearance or report grid faults.</span>
              </div>
            ) : (
              adminChats.map((msg) => {
                const isMe = msg.senderId === currentElec.id;
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

          <form onSubmit={handleSendAdminChat} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={adminChatInput}
              onChange={(e) => setAdminChatInput(e.target.value)}
              placeholder="Message Admin Desk (e.g. Verified thermal lugs on TCK-1001, requesting safety latch reset)..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
            />
            <button type="submit" className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: Report Field Issue */}
      {electricianActiveTab === 'report' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl mx-auto shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Report Grid Defect or Field Blocker</h3>
              <p className="text-xs text-slate-400">Submits an official technical notice to the Power Grid and VoltGuard Admin.</p>
            </div>
          </div>

          {fieldIssueSubmitted && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Field defect report logged! Grid dispatch alerted.</span>
            </div>
          )}

          <form onSubmit={handleReportFieldIssue} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Headline:</label>
              <input
                type="text"
                required
                value={fieldIssueTitle}
                onChange={(e) => setFieldIssueTitle(e.target.value)}
                placeholder="e.g. High neutral-to-earth leakage detected on Kothrud Paud Road feeder substation"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Field Inspection Data:</label>
              <textarea
                rows={4}
                required
                value={fieldIssueDesc}
                onChange={(e) => setFieldIssueDesc(e.target.value)}
                placeholder="Include measured voltage, earth resistance (Ohms), and transformer location..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition"
            >
              Submit Field Report to Grid Admin
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: Ratings & Reviews */}
      {electricianActiveTab === 'reviews' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>Your Customer Rating Scorecard</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Higher ratings increase your priority ranking in consumer electrician searches.
              </p>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-3xl font-extrabold text-amber-400">{currentElec.rating.toFixed(1)} ★</div>
              <div className="text-xs text-slate-400">{currentElec.totalReviews} Verified Resident Reviews</div>
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Recent Client Reviews & Feedback</h4>
            {currentElec.reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{rev.consumerName}</span>
                    <span className="text-[11px] text-slate-400">({rev.consumerArea})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating} / 5</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic">&quot;{rev.comment}&quot;</p>
                <div className="text-[10px] text-slate-500">{rev.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: My Profile & Area */}
      {electricianActiveTab === 'profile' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl mx-auto shadow-xl space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <User className="w-5 h-5 text-amber-400" />
            <span>Field Technician Profile & Certification</span>
          </h3>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div>
              <span className="text-slate-400">Full Name:</span>
              <div className="font-bold text-white text-sm mt-0.5">{currentElec.name}</div>
            </div>
            <div>
              <span className="text-slate-400">Educational & License Qualifications:</span>
              <div className="font-semibold text-slate-200 mt-0.5">{currentElec.qualifications}</div>
            </div>
            <div>
              <span className="text-slate-400">Work Experience:</span>
              <div className="font-semibold text-slate-200 mt-0.5">{currentElec.workExperienceYears} Years in Residential Fire Prevention & Load Diagnostics</div>
            </div>
            <div>
              <span className="text-slate-400">Dedicated Service City & Blocks:</span>
              <div className="font-semibold text-teal-400 mt-0.5">{currentElec.dedicatedArea}</div>
            </div>
            <div>
              <span className="text-slate-400">Covered Pincodes:</span>
              <div className="font-mono text-slate-300 mt-0.5">{currentElec.pincodesServed.join(', ')}</div>
            </div>
            <div>
              <span className="text-slate-400">Contact Number:</span>
              <div className="font-semibold text-slate-200 mt-0.5">{currentElec.phone}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
