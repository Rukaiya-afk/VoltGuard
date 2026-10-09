'use client';

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine, 
  Legend 
} from 'recharts';
import { Activity, ShieldAlert, Thermometer, Zap, Filter, Clock, Sliders, RefreshCw } from 'lucide-react';
import { useVoltStore } from '@/lib/store';

export const TelemetryTab: React.FC = () => {
  const { history, outlets } = useVoltStore();
  
  // Interactive Controls State
  const [selectedOutlet, setSelectedOutlet] = useState<string>('all');
  const [timeWindow, setTimeWindow] = useState<number>(30); // 30s, 60s, 120s
  const [customTripLimit, setCustomTripLimit] = useState<number>(20.0);

  // Filter history buffer based on time window
  const filteredHistory = history.slice(-timeWindow);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Live Interactive Power Graphs</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Filter circuits, adjust safety threshold lines, and inspect real-time electrical waveforms
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-teal-400">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse"></span>
          <span>Live SSE Stream</span>
        </div>
      </div>

      {/* Interactive Control Toolbar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Circuit / Appliance Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-teal-400 shrink-0" />
            <span className="font-bold text-slate-300 shrink-0">Filter Appliance:</span>
            <select
              value={selectedOutlet}
              onChange={(e) => setSelectedOutlet(e.target.value)}
              className="w-full md:w-auto rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-teal-500 font-mono"
            >
              <option value="all">All Home Circuits</option>
              {Object.values(outlets).map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          {/* Time Range Window Selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-bold text-slate-300 shrink-0">Time Window:</span>
            <div className="grid grid-cols-3 gap-1.5 w-full md:w-auto">
              {[
                { sec: 15, label: '15s' },
                { sec: 30, label: '30s' },
                { sec: 60, label: '1 Min' },
              ].map((w) => (
                <button
                  key={w.sec}
                  onClick={() => setTimeWindow(w.sec)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                    timeWindow === w.sec
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Safety Line Slider */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Sliders className="h-4 w-4 text-rose-400 shrink-0" />
            <span className="font-bold text-slate-300 shrink-0">Adjust Safety Limit Line:</span>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="10.0"
                max="30.0"
                step="0.5"
                value={customTripLimit}
                onChange={(e) => setCustomTripLimit(parseFloat(e.target.value))}
                className="w-24 accent-rose-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg border border-slate-800"
              />
              <span className="font-mono text-rose-400 font-bold">{customTripLimit.toFixed(1)}A</span>
            </div>
          </div>

        </div>
      </div>

      {/* Friendly Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1.5">
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
            <Zap className="h-4 w-4" />
            <span>Current Load (Amps)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Current load measures electricity pull. Exceeding <strong>{customTripLimit}A</strong> triggers immediate virtual breaker cutoff.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1.5">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
            <ShieldAlert className="h-4 w-4" />
            <span>House Voltage (Volts)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Normal household line voltage is <strong>230V</strong>. Drops below <strong>185V</strong> cause motors to stall and overheat.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1.5">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
            <Thermometer className="h-4 w-4" />
            <span>Plug Temperature (°C)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tracks heat at the wall socket. Safe range is below <strong>45°C</strong>. Temperatures above <strong>65°C</strong> pose fire hazard.
          </p>
        </div>
      </div>

      {/* Chart 1: Current Load */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">1. Current Load (Amperes) vs Interactive Safety Limit Line</h3>
            <p className="text-[11px] text-slate-400">Shows live electrical current pulled by home appliances</p>
          </div>
          <span className="text-xs text-rose-400 font-mono font-bold">Limit: {customTripLimit}A</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis stroke="#64748b" domain={[0, 35]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <ReferenceLine y={12.5} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Normal Max (12.5A)', fill: '#f59e0b', fontSize: 10 }} />
              <ReferenceLine y={customTripLimit} stroke="#f43f5e" strokeWidth={2.5} label={{ value: `Interactive Trip Line (${customTripLimit}A)`, fill: '#f43f5e', fontSize: 10 }} />
              
              {(selectedOutlet === 'all' || selectedOutlet === 'master_ac') && (
                <Line type="monotone" dataKey="I_master" name="Master AC (A)" stroke="#06b6d4" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              )}
              {(selectedOutlet === 'all' || selectedOutlet === 'living_ac') && (
                <Line type="monotone" dataKey="I_living" name="Living AC (A)" stroke="#3b82f6" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: House Voltage */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">2. House Voltage (Volts) & Brownout Threshold</h3>
            <p className="text-[11px] text-slate-400">Normal voltage is 220V - 240V</p>
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold">Brownout Warning: &lt;185V</span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis stroke="#64748b" domain={[160, 260]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <ReferenceLine y={185} stroke="#f43f5e" strokeDasharray="3 3" strokeWidth={2} label={{ value: 'Brownout Risk (<185V)', fill: '#f43f5e', fontSize: 10 }} />
              <Line type="monotone" dataKey="V_master" name="Master AC Voltage (V)" stroke="#0d9488" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="V_living" name="Living AC Voltage (V)" stroke="#8b5cf6" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Temperature & AI Score */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">3. Plug Temperature (°C) & AI Fire Risk Score</h3>
            <p className="text-[11px] text-slate-400">Heat accumulation tracking at socket lugs</p>
          </div>
          <span className="text-xs text-rose-400 font-mono font-bold">Risk Boundary: &gt;0.70</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis yAxisId="left" stroke="#e11d48" domain={[20, 80]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#0d9488" domain={[0, 1.0]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <ReferenceLine yAxisId="right" y={0.70} stroke="#f43f5e" strokeDasharray="5 5" label={{ value: 'Fire Risk Cutoff (0.70)', fill: '#f43f5e', fontSize: 10 }} />
              <Line yAxisId="left" type="monotone" dataKey="T_master" name="Plug Temp (°C)" stroke="#f43f5e" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line yAxisId="right" type="monotone" dataKey="Score_master" name="AI Risk Score" stroke="#0d9488" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
