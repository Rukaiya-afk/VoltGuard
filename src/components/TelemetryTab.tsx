'use client';

import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine, 
  ReferenceArea,
  Legend 
} from 'recharts';
import { Activity, ShieldAlert, Thermometer, Zap, Filter, Clock, Sliders, AlertTriangle } from 'lucide-react';
import { useVoltStore } from '@/lib/store';

export const TelemetryTab: React.FC = () => {
  const { history, outlets, settings } = useVoltStore();
  
  // Interactive Controls State
  const [selectedOutlet, setSelectedOutlet] = useState<string>('all');
  const [timeWindow, setTimeWindow] = useState<number>(30); // 15s, 30s, 60s
  const [customTripLimit, setCustomTripLimit] = useState<number>(20.0);

  // Filter history buffer based on time window
  const filteredHistory = history.slice(-timeWindow);

  // Detect anomalous interval for Reference Image 1 highlight area
  const anomalyInterval = useMemo(() => {
    let startIdx = -1;
    let endIdx = -1;
    for (let i = 0; i < filteredHistory.length; i++) {
      const pt = filteredHistory[i];
      const isAnom = (pt.Score_master && pt.Score_master > 0.70) || 
                     (pt.Score_living && pt.Score_living > 0.70) || 
                     (pt.V_master && pt.V_master < 185);
      if (isAnom) {
        if (startIdx === -1) startIdx = i;
        endIdx = i;
      }
    }
    if (startIdx !== -1 && endIdx !== -1) {
      return {
        x1: filteredHistory[Math.max(0, startIdx - 1)]?.timestamp || filteredHistory[startIdx].timestamp,
        x2: filteredHistory[Math.min(filteredHistory.length - 1, endIdx + 1)]?.timestamp || filteredHistory[endIdx].timestamp,
      };
    }
    return null;
  }, [filteredHistory]);

  const isLight = settings.theme === 'light';
  const gridStroke = isLight ? '#DCE5D9' : '#354456';
  const tickFill = isLight ? '#69776C' : '#A6B3C1';
  const tooltipBg = isLight ? '#FFFFFF' : '#192330';
  const tooltipBorder = isLight ? '#DCE5D9' : '#354456';
  const tooltipText = isLight ? '#26382D' : '#E8EEF5';

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border p-5 backdrop-blur-md gap-4 shadow-sm
        bg-[#202D3D] border-[#354456] text-[#E8EEF5]
        theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
      ">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold tracking-tight text-white theme-light:text-[#26382D]">
              Live SCADA Telemetry Waveforms
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-[#4B91D9]/20 text-[#4B91D9] border border-[#4B91D9]/40">
              SUB-20MS STREAM
            </span>
          </div>
          <p className="text-xs text-[#A6B3C1] theme-light:text-[#69776C] mt-1">
            Real-time voltage sag tracking, current transients, lug thermography, and Isolation Forest anomaly boundaries.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#36B879] theme-light:text-[#347A53] px-3 py-1.5 rounded-xl border bg-[#192330] border-[#354456] theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#36B879] animate-pulse"></span>
          <span className="font-bold">SSE Real-Time Synced</span>
        </div>
      </div>

      {/* Interactive Control Toolbar */}
      <div className="rounded-2xl border p-4 space-y-4 shadow-sm
        bg-[#202D3D] border-[#354456] text-[#E8EEF5]
        theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
      ">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Circuit Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-[#36B879] theme-light:text-[#347A53] shrink-0" />
            <span className="font-bold text-[#E8EEF5] theme-light:text-[#26382D] shrink-0">Filter Circuit:</span>
            <select
              value={selectedOutlet}
              onChange={(e) => setSelectedOutlet(e.target.value)}
              className="w-full md:w-auto rounded-xl px-3 py-1.5 text-xs font-mono border
                bg-[#192330] border-[#354456] text-white
                theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
              "
            >
              <option value="all">All Home Circuits</option>
              {Object.values(outlets).map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          {/* Time Range Window Selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Clock className="h-4 w-4 text-[#4B91D9] shrink-0" />
            <span className="font-bold text-[#E8EEF5] theme-light:text-[#26382D] shrink-0">Time Buffer:</span>
            <div className="grid grid-cols-3 gap-1.5 w-full md:w-auto">
              {[
                { sec: 15, label: '15s' },
                { sec: 30, label: '30s' },
                { sec: 60, label: '60s' },
              ].map((w) => (
                <button
                  key={w.sec}
                  onClick={() => setTimeWindow(w.sec)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                    timeWindow === w.sec
                      ? 'bg-[#347A53] text-white shadow-xs'
                      : isLight
                      ? 'bg-[#E8EFDF] text-[#69776C] border border-[#DCE5D9] hover:text-[#26382D]'
                      : 'bg-[#192330] text-[#A6B3C1] border border-[#354456] hover:text-white'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Safety Trip Limit Slider */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Sliders className="h-4 w-4 text-[#E45B63] shrink-0" />
            <span className="font-bold text-[#E8EEF5] theme-light:text-[#26382D] shrink-0">Adjust Trip Line:</span>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="10.0"
                max="30.0"
                step="0.5"
                value={customTripLimit}
                onChange={(e) => setCustomTripLimit(parseFloat(e.target.value))}
                className="w-24 accent-[#E45B63] cursor-pointer h-1.5 rounded-lg border border-[#354456] bg-[#192330]"
              />
              <span className="font-mono text-[#E45B63] font-bold text-xs">{customTripLimit.toFixed(1)}A</span>
            </div>
          </div>

        </div>
      </div>

      {/* Guide Cards (Section 8 & 10) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4 space-y-1.5 shadow-sm
          bg-[#202D3D] border-[#354456]
          theme-light:bg-white theme-light:border-[#DCE5D9]
        ">
          <div className="flex items-center space-x-2 text-[#4B91D9] font-bold text-xs">
            <Zap className="h-4 w-4" />
            <span>Current Waveform (RMS Amperes)</span>
          </div>
          <p className="text-xs text-[#A6B3C1] theme-light:text-[#69776C] leading-relaxed">
            Measures continuous current. Exceeding <strong>{customTripLimit}A</strong> triggers sub-20ms trip simulation cutoff.
          </p>
        </div>

        <div className="rounded-2xl border p-4 space-y-1.5 shadow-sm
          bg-[#202D3D] border-[#354456]
          theme-light:bg-white theme-light:border-[#DCE5D9]
        ">
          <div className="flex items-center space-x-2 text-[#36B879] theme-light:text-[#347A53] font-bold text-xs">
            <ShieldAlert className="h-4 w-4" />
            <span>Mains Voltage & Brownout Sag</span>
          </div>
          <p className="text-xs text-[#A6B3C1] theme-light:text-[#69776C] leading-relaxed">
            Standard residential line is <strong>230V</strong>. Sags below <strong>185V</strong> cause compressor stalls and overheating.
          </p>
        </div>

        <div className="rounded-2xl border p-4 space-y-1.5 shadow-sm
          bg-[#202D3D] border-[#354456]
          theme-light:bg-white theme-light:border-[#DCE5D9]
        ">
          <div className="flex items-center space-x-2 text-[#E45B63] font-bold text-xs">
            <Thermometer className="h-4 w-4" />
            <span>Socket Lug Heat (°C) & AI Score</span>
          </div>
          <p className="text-xs text-[#A6B3C1] theme-light:text-[#69776C] leading-relaxed">
            Tracks loose wire contact heat. Temperatures over <strong>65°C</strong> or anomaly scores &gt; <strong>0.70</strong> indicate fire outbreak hazard.
          </p>
        </div>
      </div>

      {/* CHART 1: Current Waveform (Reference Image 1 Anomaly Highlighting) */}
      <div className="rounded-2xl border p-5 space-y-3 shadow-sm
        bg-[#202D3D] border-[#354456]
        theme-light:bg-white theme-light:border-[#DCE5D9]
      ">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white theme-light:text-[#26382D]">
              1. Current Load (Amperes) vs Interactive Safety Limit Line
            </h3>
            <p className="text-[11px] text-[#A6B3C1] theme-light:text-[#69776C]">
              Continuous real-time current streaming with highlighted anomaly interval
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {anomalyInterval && (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-bold animate-pulse">
                <AlertTriangle className="h-3 w-3" />
                <span>Anomaly Highlight Active</span>
              </span>
            )}
            <span className="text-xs text-[#E45B63] font-mono font-bold">Limit: {customTripLimit}A</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="timestamp" stroke={tickFill} tick={{ fontSize: 10, fill: tickFill }} />
              <YAxis stroke={tickFill} domain={[0, 35]} tick={{ fontSize: 10, fill: tickFill }} />
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', fontSize: '11px', color: tooltipText }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />

              {/* Reference Image 1 Anomaly Highlight Region */}
              {anomalyInterval && (
                <ReferenceArea 
                  x1={anomalyInterval.x1} 
                  x2={anomalyInterval.x2} 
                  fill="#E45B63" 
                  fillOpacity={0.2} 
                  stroke="#E45B63"
                  strokeDasharray="3 3"
                  label={{ value: '⚠ Anomaly Interval', fill: '#E45B63', position: 'insideTop', fontSize: 10, fontWeight: 700 }}
                />
              )}

              <ReferenceLine y={12.5} stroke="#E0B34E" strokeDasharray="4 4" label={{ value: 'Normal Max (12.5A)', fill: '#E0B34E', fontSize: 10 }} />
              <ReferenceLine y={customTripLimit} stroke="#E45B63" strokeWidth={2.5} label={{ value: `Interactive Trip Line (${customTripLimit}A)`, fill: '#E45B63', fontSize: 10 }} />
              
              {(selectedOutlet === 'all' || selectedOutlet === 'master_ac') && (
                <Line type="monotone" dataKey="I_master" name="Master AC (A)" stroke="#4B91D9" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              )}
              {(selectedOutlet === 'all' || selectedOutlet === 'living_ac') && (
                <Line type="monotone" dataKey="I_living" name="Living AC (A)" stroke="#36B879" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: House Voltage & Brownout Sag */}
      <div className="rounded-2xl border p-5 space-y-3 shadow-sm
        bg-[#202D3D] border-[#354456]
        theme-light:bg-white theme-light:border-[#DCE5D9]
      ">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white theme-light:text-[#26382D]">
              2. House Line Voltage (Volts) & Brownout Sag Threshold
            </h3>
            <p className="text-[11px] text-[#A6B3C1] theme-light:text-[#69776C]">
              Nominal line range is 220V - 240V
            </p>
          </div>
          <span className="text-xs text-[#E0B34E] font-mono font-bold">Brownout Sag Boundary: &lt;185V</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="timestamp" stroke={tickFill} tick={{ fontSize: 10, fill: tickFill }} />
              <YAxis stroke={tickFill} domain={[160, 260]} tick={{ fontSize: 10, fill: tickFill }} />
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', fontSize: '11px', color: tooltipText }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <ReferenceLine y={185} stroke="#E45B63" strokeDasharray="3 3" strokeWidth={2} label={{ value: 'Brownout Risk (<185V)', fill: '#E45B63', fontSize: 10 }} />
              <Line type="monotone" dataKey="V_master" name="Master AC Voltage (V)" stroke="#347A53" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="V_living" name="Living AC Voltage (V)" stroke="#8b5cf6" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 3: Plug Temperature & AI Isolation Forest Anomaly Score */}
      <div className="rounded-2xl border p-5 space-y-3 shadow-sm
        bg-[#202D3D] border-[#354456]
        theme-light:bg-white theme-light:border-[#DCE5D9]
      ">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white theme-light:text-[#26382D]">
              3. Terminal Lug Temperature (°C) & Isolation Forest Anomaly Score
            </h3>
            <p className="text-[11px] text-[#A6B3C1] theme-light:text-[#69776C]">
              Thermal heat accumulation at socket lugs alongside unsupervised anomaly risk scoring
            </p>
          </div>
          <span className="text-xs text-[#E45B63] font-mono font-bold">Fire Cutoff Boundary: &gt;0.70</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="timestamp" stroke={tickFill} tick={{ fontSize: 10, fill: tickFill }} />
              <YAxis yAxisId="left" stroke="#E45B63" domain={[20, 85]} tick={{ fontSize: 10, fill: tickFill }} />
              <YAxis yAxisId="right" orientation="right" stroke="#36B879" domain={[0, 1.0]} tick={{ fontSize: 10, fill: tickFill }} />
              <Tooltip 
                contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px', fontSize: '11px', color: tooltipText }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <ReferenceLine yAxisId="right" y={0.70} stroke="#E45B63" strokeDasharray="5 5" label={{ value: 'Fire Risk Cutoff (0.70)', fill: '#E45B63', fontSize: 10 }} />
              <Line yAxisId="left" type="monotone" dataKey="T_master" name="Plug Temp (°C)" stroke="#E45B63" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line yAxisId="right" type="monotone" dataKey="Score_master" name="AI Anomaly Score" stroke="#36B879" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
