'use client';

import React, { useState } from 'react';
import { 
  AlertOctagon, 
  X, 
  Send, 
  CheckCircle2, 
  Flame, 
  Wrench, 
  DollarSign, 
  Laptop,
  ChevronDown,
  Minimize2,
  Maximize2,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { syncTicketToDatabase } from '@/lib/supabaseClient';

export const RightBottomBugPane: React.FC = () => {
  const { userProfile, createTicket } = useVoltStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [category, setCategory] = useState<'hazard_emergency' | 'repair_request' | 'billing_inquiry' | 'system_bug'>('hazard_emergency');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sendSmsNotification, setSendSmsNotification] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    const ticketId = `TCK-${Date.now().toString().slice(-4)}`;

    const newTicket = {
      consumerId: userProfile.id,
      consumerName: userProfile.name,
      consumerAddress: userProfile.address,
      consumerArea: userProfile.blockArea,
      consumerDepartment: userProfile.electricityDepartment,
      consumerPhone: userProfile.phone,
      title: `[${category.toUpperCase()}] ${title}`,
      description,
      type: category,
      priority: category === 'hazard_emergency' ? 'CRITICAL_HAZARD' as const : 'HIGH' as const,
    };

    // Add to Zustand state
    createTicket(newTicket);

    // Sync to Supabase PostgreSQL cloud database
    await syncTicketToDatabase({
      id: ticketId,
      consumerName: userProfile.name,
      title: newTicket.title,
      description: newTicket.description,
      type: newTicket.type,
      priority: newTicket.priority,
      status: 'OPEN',
    });

    setSubmitting(false);
    setIsSubmitted(true);
    setTitle('');
    setDescription('');

    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
    }, 2800);
  };

  return (
    <>
      {/* Right Bottom Window Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            id="open-bug-report-pane"
            className="flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-2xl shadow-rose-950/60 border border-rose-400/40 transition-all transform hover:scale-105 active:scale-95 group"
            title="Open Right-Bottom Bug & Issue Reporting Desk"
          >
            <div className="p-1 rounded-lg bg-black/20 group-hover:rotate-12 transition-transform">
              <AlertOctagon className="w-4 h-4 text-white" />
            </div>
            <span>Report Issue / Bug</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
          </button>
        )}
      </div>

      {/* Right Bottom Window Pane */}
      {isOpen && (
        <aside 
          aria-label="Bug and Issue Reporting Desk"
          className={`fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] bg-slate-950/95 border-2 border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl transition-all duration-200 overflow-hidden flex flex-col ${
          isMinimized ? 'h-14' : 'max-h-[85vh]'
        }`}>
          
          {/* Window Pane Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>Report Issue / Fault</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-teal-300 border border-slate-700 font-mono">
                    Right Bottom Pane
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title={isMinimized ? 'Expand Pane' : 'Minimize Pane'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                title="Close Pane"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pane Body Content (hidden when minimized) */}
          {!isMinimized && (
            <div className="p-4 overflow-y-auto space-y-4 text-xs font-sans">
              
              {isSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Ticket Logged & Dispatched!</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Stored in Supabase database. On-duty Pune electrical safety engineers and MSEDCL staff have been alerted.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  
                  {/* Category Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                      Select Issue Category:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCategory('hazard_emergency')}
                        className={`p-2 rounded-xl text-left border flex items-center space-x-2 transition ${
                          category === 'hazard_emergency'
                            ? 'bg-rose-950/60 border-rose-500 text-white shadow-sm ring-1 ring-rose-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="text-[10px] font-bold truncate">Fire / Spark Hazard</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCategory('repair_request')}
                        className={`p-2 rounded-xl text-left border flex items-center space-x-2 transition ${
                          category === 'repair_request'
                            ? 'bg-amber-950/60 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-[10px] font-bold truncate">Appliance Repair</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCategory('billing_inquiry')}
                        className={`p-2 rounded-xl text-left border flex items-center space-x-2 transition ${
                          category === 'billing_inquiry'
                            ? 'bg-teal-950/60 border-teal-500 text-white shadow-sm ring-1 ring-teal-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <DollarSign className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="text-[10px] font-bold truncate">Bill / Tariff Query</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCategory('system_bug')}
                        className={`p-2 rounded-xl text-left border flex items-center space-x-2 transition ${
                          category === 'system_bug'
                            ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Laptop className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="text-[10px] font-bold truncate">App / System Bug</span>
                      </button>
                    </div>
                  </div>

                  {/* Subject Title */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Issue Subject:
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Sparking near Geyser socket or Chart glitch"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Describe Observations:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mention wire heating, tripping frequency, or bug repro steps..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400 resize-none"
                    />
                  </div>

                  {/* Resident Info Badge */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[10px] text-slate-400 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>Resident:</span>
                      <strong className="text-slate-200">{userProfile.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Premise:</span>
                      <span className="text-slate-300 truncate max-w-[200px]">{userProfile.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contact:</span>
                      <span className="text-teal-300">{userProfile.phone}</span>
                    </div>
                  </div>

                  {/* Twilio SMS Notification Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px]">
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                      <span>Send Twilio SMS Ticket Copy to Phone</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={sendSmsNotification}
                      onChange={(e) => setSendSmsNotification(e.target.checked)}
                      className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Transmitting to Roster...' : 'Log Ticket to Control Desk'}</span>
                  </button>

                </form>
              )}

            </div>
          )}

        </aside>
      )}
    </>
  );
};
