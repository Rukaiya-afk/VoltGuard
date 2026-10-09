'use client';

import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Building2,
  PieChart as PieIcon,
  Sparkles,
  Wrench,
  PlusCircle
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { BillingApplianceShare } from '@/lib/types';

const COLOR_PALETTE = [
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#6366f1', // Indigo
];

export const BillingTab: React.FC = () => {
  const { userProfile, outlets } = useVoltStore();

  // Dynamically compute appliance monthly kWh shares from active outlets in store
  const { applianceShares, totalKwh, projectedBill, outlierKwh, outlierCost } = useMemo(() => {
    const outletsList = Object.values(outlets);

    let totalCalculatedKwh = 0;
    const items: Array<{ name: string; kwh: number; color: string }> = [];

    outletsList.forEach((outlet, index) => {
      // Estimate monthly kWh based on power rating or running watts
      const runningW = outlet.power_watts > 0 ? outlet.power_watts : outlet.rated_current * 230 * 0.5;
      const estimatedMonthlyKwh = Math.round(((runningW * 8 * 30) / 1000) * 10) / 10;
      totalCalculatedKwh += estimatedMonthlyKwh;

      items.push({
        name: outlet.name,
        kwh: estimatedMonthlyKwh > 0 ? estimatedMonthlyKwh : 15.0,
        color: COLOR_PALETTE[index % COLOR_PALETTE.length],
      });
    });

    const finalShares: BillingApplianceShare[] = items.map((item) => ({
      name: item.name,
      kwh: item.kwh,
      percentage: Math.round((item.kwh / (totalCalculatedKwh || 1)) * 1000) / 10,
      color: item.color,
    }));

    const rate = userProfile.ratePerKwh || 8.50;
    const bill = Math.round(totalCalculatedKwh * rate * 100) / 100;
    const wasteKwh = Math.round(totalCalculatedKwh * 0.07 * 10) / 10;
    const wasteCost = Math.round(wasteKwh * rate * 100) / 100;

    return {
      applianceShares: finalShares,
      totalKwh: Math.round(totalCalculatedKwh * 10) / 10,
      projectedBill: bill,
      outlierKwh: wasteKwh,
      outlierCost: wasteCost,
    };
  }, [outlets, userProfile.ratePerKwh]);

  return (
    <div className="space-y-6">
      {/* Tariff Context Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Electricity Bill & Appliance Usage</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamically tracks power consumption and bill shares for all {applianceShares.length} registered home appliances
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono w-full md:w-auto">
          <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
            <div className="text-[10px] text-slate-400">Tariff Plan</div>
            <div className="text-slate-200 font-bold">{userProfile.billingTier}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
            <div className="text-[10px] text-slate-400">Connected Circuits</div>
            <div className="text-teal-400 font-bold">{applianceShares.length} Appliances</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-400">Unit Price</div>
            <div className="text-slate-300 font-bold">₹{userProfile.ratePerKwh.toFixed(2)}/kWh</div>
          </div>
        </div>
      </div>

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Monthly Electricity Used</span>
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-2">
            {totalKwh.toFixed(1)} <span className="text-sm font-normal text-slate-400">kWh</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across <span className="text-teal-300 font-bold">{applianceShares.length} active devices</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Estimated Monthly Bill</span>
            <TrendingUp className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-400 font-mono mt-2">
            ₹{projectedBill.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Calculated at rate ₹{userProfile.ratePerKwh.toFixed(2)}/kWh
          </div>
        </div>

        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-5">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-semibold">Wasted Energy Cost</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono mt-2">
            ₹{outlierCost.toFixed(2)}
          </div>
          <div className="text-[11px] text-rose-300 mt-1">
            Excess wasted energy: <span className="font-bold">{outlierKwh} kWh</span>
          </div>
        </div>
      </div>

      {/* Dynamic Donut & Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Dynamic Donut Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Dynamic Appliance Breakdown (%)</h3>
            <span className="text-xs text-teal-400 font-mono">{applianceShares.length} Devices</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applianceShares}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="kwh"
                  nameKey="name"
                >
                  {applianceShares.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(value: number) => [`${value} kWh`, 'Monthly Consumption']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Bar Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Appliance Monthly Consumption (kWh)</h3>
            <span className="text-xs text-slate-400 font-mono">Real-Time Updated</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applianceShares} margin={{ top: 10, right: 30, left: 0, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b' }} interval={0} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="kwh" name="kWh Used" radius={[8, 8, 0, 0]}>
                  {applianceShares.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Appliance Health & Energy Savings Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Appliance Health & Money Saving Recommendations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase">Master Bedroom AC</span>
              <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                +26% Extra Power
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">AC Filter or Motor Drag Detected</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Master Bedroom AC used 26% more electricity this week than usual due to clogged air filters.
            </p>
            <div className="pt-2 border-t border-amber-500/20 flex items-start space-x-2 text-xs text-teal-300 font-medium">
              <Wrench className="h-4 w-4 shrink-0 mt-0.5 text-teal-400" />
              <span><strong>Recommendation:</strong> Clean filter coils to save ~₹420/month on electricity bill.</span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase">Kitchen Water Heater</span>
              <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                +12% Extra Power
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Water Scale Build-Up</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Heater element takes 18% longer to heat water due to mineral scale build-up.
            </p>
            <div className="pt-2 border-t border-amber-500/20 flex items-start space-x-2 text-xs text-teal-300 font-medium">
              <Wrench className="h-4 w-4 shrink-0 mt-0.5 text-teal-400" />
              <span><strong>Recommendation:</strong> Descale heating tank element to improve heating speed.</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
