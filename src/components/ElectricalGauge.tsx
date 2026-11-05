'use client';

import React from 'react';
import { useVoltStore } from '@/lib/store';

interface ElectricalGaugeProps {
  value: number;
  min?: number;
  max?: number;
  unit: string;
  label: string;
  warnThreshold?: number;
  critThreshold?: number;
  size?: 'sm' | 'md' | 'lg';
  gaugeType?: 'standard' | 'voltage';
}

export const ElectricalGauge: React.FC<ElectricalGaugeProps> = ({
  value,
  min = 0,
  max = 100,
  unit,
  label,
  warnThreshold,
  critThreshold,
  size = 'md',
  gaugeType = unit === 'V' ? 'voltage' : 'standard',
}) => {
  const { settings } = useVoltStore();
  const isLight = settings.theme === 'light';

  // Clamp value between min and max
  const clampedValue = Math.min(Math.max(value, min), max);
  const percent = (clampedValue - min) / (max - min);

  // Arc math: Radius 65, center (90, 85)
  const cx = 90;
  const cy = 85;
  const r = 65;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 0, end.x, end.y].join(' ');
  };

  // Needle tip coordinates: -90 deg (left) to +90 deg (right)
  const needleAngle = -90 + percent * 180;
  const needleTip = polarToCartesian(cx, cy, r - 8, needleAngle);

  let statusColor = isLight ? '#347A53' : '#36B879';
  let statusBadgeText = 'NOMINAL';
  let isHazard = false;

  // Arc elements configuration
  let arcsToRender: Array<{ d: string; color: string; strokeLinecap?: 'round' | 'butt' }> = [];

  if (gaugeType === 'voltage') {
    // 5-band symmetrical Indian Grid 230V quality gauge (IS 12360)
    // < 185V: Severe Brownout Sag (Red)
    // 185V - 207V: Low Sag Warning (Amber)
    // 207V - 245V: Nominal Safe Band (Green)
    // 245V - 255V: Over-voltage Warning (Amber)
    // > 255V: Severe Surge (Red)
    const sagCritPct = (185 - min) / (max - min);
    const sagWarnPct = (207 - min) / (max - min);
    const surgeWarnPct = (245 - min) / (max - min);
    const surgeCritPct = (255 - min) / (max - min);

    const a1 = -90 + sagCritPct * 180;
    const a2 = -90 + sagWarnPct * 180;
    const a3 = -90 + surgeWarnPct * 180;
    const a4 = -90 + surgeCritPct * 180;

    const redColor = isLight ? '#C93B46' : '#E45B63';
    const amberColor = isLight ? '#B87A24' : '#E0B34E';
    const greenColor = isLight ? '#347A53' : '#36B879';

    arcsToRender = [
      { d: describeArc(cx, cy, r, -90, a1), color: redColor, strokeLinecap: 'round' },
      { d: describeArc(cx, cy, r, a1, a2), color: amberColor },
      { d: describeArc(cx, cy, r, a2, a3), color: greenColor },
      { d: describeArc(cx, cy, r, a3, a4), color: amberColor },
      { d: describeArc(cx, cy, r, a4, 90), color: redColor, strokeLinecap: 'round' },
    ];

    if (value < 185) {
      statusColor = redColor;
      statusBadgeText = '⚠️ CRITICAL BROWNOUT SAG';
      isHazard = true;
    } else if (value < 207) {
      statusColor = amberColor;
      statusBadgeText = '⚠️ LOW VOLTAGE SAG';
    } else if (value > 255) {
      statusColor = redColor;
      statusBadgeText = '⚠️ CRITICAL OVERVOLTAGE SURGE';
      isHazard = true;
    } else if (value > 245) {
      statusColor = amberColor;
      statusBadgeText = '⚠️ HIGH VOLTAGE';
    } else {
      statusColor = greenColor;
      statusBadgeText = 'NOMINAL (230V GRID QUALITY)';
    }
  } else {
    // Standard 3-segment ascending gauge (Watts / Current)
    const warnPct = warnThreshold !== undefined ? (warnThreshold - min) / (max - min) : 0.65;
    const critPct = critThreshold !== undefined ? (critThreshold - min) / (max - min) : 0.85;

    const greenEndAngle = -90 + warnPct * 180;
    const amberEndAngle = -90 + critPct * 180;

    const redColor = isLight ? '#C93B46' : '#E45B63';
    const amberColor = isLight ? '#B87A24' : '#E0B34E';
    const greenColor = isLight ? '#347A53' : '#36B879';

    arcsToRender = [
      { d: describeArc(cx, cy, r, -90, greenEndAngle), color: greenColor, strokeLinecap: 'round' },
      { d: describeArc(cx, cy, r, greenEndAngle, amberEndAngle), color: amberColor },
      { d: describeArc(cx, cy, r, amberEndAngle, 90), color: redColor, strokeLinecap: 'round' },
    ];

    if (percent >= critPct) {
      statusColor = redColor;
      statusBadgeText = '⚠️ CRITICAL OVERLOAD';
      isHazard = true;
    } else if (percent >= warnPct) {
      statusColor = amberColor;
      statusBadgeText = '⚠️ HIGH DEMAND';
    } else {
      statusColor = greenColor;
      statusBadgeText = 'OPTIMAL POWER LOAD';
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
      isHazard
        ? isLight ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-300/40' : 'bg-rose-950/20 border-rose-500/50 ring-2 ring-rose-500/20'
        : isLight 
        ? 'bg-white border-[#DCE5D9] shadow-sm' 
        : 'bg-[#202D3D] border-[#354456]'
    }`}>
      {/* Semicircular Gauge Arc & Needle */}
      <div className="w-44 h-24 flex items-end justify-center">
        <svg viewBox="0 0 180 96" className="w-full h-full overflow-visible">
          {/* Background Track */}
          <path
            d={describeArc(cx, cy, r, -90, 90)}
            fill="none"
            stroke="currentColor"
            strokeWidth="13"
            className={isLight ? 'text-[#E8EFDF]' : 'text-slate-800/40'}
            strokeLinecap="round"
          />

          {/* Render Active Threshold Arcs */}
          {arcsToRender.map((arc, idx) => (
            <path
              key={idx}
              d={arc.d}
              fill="none"
              stroke={arc.color}
              strokeWidth="13"
              strokeOpacity={isLight ? '0.95' : '0.85'}
              strokeLinecap={arc.strokeLinecap}
            />
          ))}

          {/* Pivot Center Point */}
          <circle cx={cx} cy={cy} r="6" fill={statusColor} />

          {/* Needle Indicator Line */}
          <line
            x1={cx}
            y1={cy}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke={isLight ? '#26382D' : '#FFFFFF'}
            strokeWidth="3.5"
            strokeLinecap="round"
            className="drop-shadow-md transition-all duration-300"
          />
        </svg>
      </div>

      {/* High-Visibility Non-Overlapping Value Readout */}
      <div className="mt-2 text-center select-none space-y-1">
        <div className="text-2xl font-black font-mono tracking-tight" style={{ color: statusColor }}>
          {value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          <span className={`text-xs ml-1 font-bold ${isLight ? 'text-[#69776C]' : 'text-[#A6B3C1]'}`}>
            {unit}
          </span>
        </div>

        {/* Status Chip Pill */}
        <div>
          <span 
            className={`inline-block text-[10px] font-black uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border ${
              isHazard ? 'animate-pulse' : ''
            }`}
            style={{ 
              color: statusColor, 
              backgroundColor: `${statusColor}18`,
              borderColor: `${statusColor}40`,
            }}
          >
            {statusBadgeText}
          </span>
        </div>

        {/* Label & Operating Range */}
        <div className={`text-xs font-bold pt-0.5 tracking-tight ${isLight ? 'text-[#26382D]' : 'text-[#E8EEF5]'}`}>
          {label}
        </div>
        <div className={`text-[10px] font-mono ${isLight ? 'text-[#69776C]' : 'text-[#A6B3C1]'}`}>
          Scale: {min}{unit} – {max}{unit}
        </div>
      </div>
    </div>
  );
};

