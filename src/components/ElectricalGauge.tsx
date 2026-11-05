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
}) => {
  // Clamp value between min and max
  const clampedValue = Math.min(Math.max(value, min), max);
  
  // Angle: -180 deg (left) to 0 deg (right) for top half-circle
  const percent = (clampedValue - min) / (max - min);
  const angle = -180 + percent * 180;

  // Warning thresholds defaults
  const warnPct = warnThreshold !== undefined ? (warnThreshold - min) / (max - min) : 0.70;
  const critPct = critThreshold !== undefined ? (critThreshold - min) / (max - min) : 0.88;

  // Arc math: Radius 70, center (90, 85)
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

  // 3 Colored segments: Green (0 to warnPct), Amber (warnPct to critPct), Red (critPct to 1.0)
  const greenEndAngle = -90 + warnPct * 180;
  const amberEndAngle = -90 + critPct * 180;

  const greenArc = describeArc(cx, cy, r, -90, greenEndAngle);
  const amberArc = describeArc(cx, cy, r, greenEndAngle, amberEndAngle);
  const redArc = describeArc(cx, cy, r, amberEndAngle, 90);

  const { settings } = useVoltStore();
  const isLight = settings.theme === 'light';

  // Needle tip coordinates
  const needleAngle = -90 + percent * 180;
  const needleTip = polarToCartesian(cx, cy, r - 8, needleAngle);

  // Determine current value status color
  const statusColor = 
    percent >= critPct ? '#E45B63' :
    percent >= warnPct ? (isLight ? '#B87A24' : '#E0B34E') :
    (isLight ? '#347A53' : '#36B879');

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
      isLight 
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

          {/* Green Nominal Zone */}
          <path
            d={greenArc}
            fill="none"
            stroke={isLight ? '#347A53' : '#36B879'}
            strokeWidth="13"
            strokeOpacity={isLight ? '0.95' : '0.85'}
            strokeLinecap="round"
          />

          {/* Amber Warning Zone */}
          <path
            d={amberArc}
            fill="none"
            stroke={isLight ? '#B87A24' : '#E0B34E'}
            strokeWidth="13"
            strokeOpacity={isLight ? '0.95' : '0.85'}
          />

          {/* Red Critical Zone */}
          <path
            d={redArc}
            fill="none"
            stroke={isLight ? '#C93B46' : '#E45B63'}
            strokeWidth="13"
            strokeOpacity={isLight ? '0.95' : '0.85'}
            strokeLinecap="round"
          />

          {/* Pivot Center Point */}
          <circle cx={cx} cy={cy} r="6" fill={isLight ? '#347A53' : '#36B879'} />

          {/* Needle Indicator Line */}
          <line
            x1={cx}
            y1={cy}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke={isLight ? '#26382D' : '#FFFFFF'}
            strokeWidth="3"
            strokeLinecap="round"
            className="drop-shadow-md transition-all duration-300"
          />
        </svg>
      </div>

      {/* High-Visibility Non-Overlapping Value Readout */}
      <div className="mt-2 text-center select-none">
        <div className="text-2xl font-black font-mono tracking-tight" style={{ color: statusColor }}>
          {value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          <span className={`text-xs ml-1 font-bold ${isLight ? 'text-[#69776C]' : 'text-[#A6B3C1]'}`}>
            {unit}
          </span>
        </div>

        {/* Label & Operating Range */}
        <div className={`text-xs font-bold mt-0.5 tracking-tight ${isLight ? 'text-[#26382D]' : 'text-[#E8EEF5]'}`}>
          {label}
        </div>
        <div className={`text-[10px] font-mono mt-0.5 ${isLight ? 'text-[#69776C]' : 'text-[#A6B3C1]'}`}>
          Range: {min}{unit} – {max}{unit}
        </div>
      </div>
    </div>
  );
};

