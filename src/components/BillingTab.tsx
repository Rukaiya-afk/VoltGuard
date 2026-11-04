'use client';

import React, { useState, useMemo } from 'react';
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
  CreditCard,
  QrCode,
  CheckCircle2,
  Lock,
  ShieldCheck,
  RotateCcw,
  Receipt,
  Smartphone,
  ArrowRight,
  ShieldAlert,
  ArrowUpRight,
  Calendar,
  Layers,
  Clock
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { BillingApplianceShare, PaymentReceipt } from '@/lib/types';

const COLOR_PALETTE = [
  '#347A53', // Sage Primary
  '#77A985', // Sage Secondary
  '#4B91D9', // Blue
  '#E0B34E', // Amber
  '#36B879', // Emerald
  '#8b5cf6', // Purple
  '#E45B63', // Crimson
  '#06b6d4', // Cyan
  '#f97316', // Orange
];

// High-contrast, visible hover text box for the pie chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const { name, value, payload: sliceData } = data;
    const percentage = sliceData?.percentage ?? 0;
    const color = sliceData?.color || '#347A53';
    const rate = 8.5;
    const estimatedCost = (Number(value) * rate).toFixed(2);

    return (
      <div className="z-50 min-w-[220px] rounded-2xl border border-[#354456] bg-[#192330] p-3.5 shadow-2xl backdrop-blur-md theme-light:border-[#DCE5D9] theme-light:bg-white transition-all pointer-events-none">
        <div className="flex items-center space-x-2.5 border-b border-inherit pb-2">
          <span className="h-3.5 w-3.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: color }} />
          <h4 className="text-xs font-extrabold text-white theme-light:text-[#26382D] leading-tight">
            {name}
          </h4>
        </div>

        <div className="mt-2.5 space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#A6B3C1] theme-light:text-[#69776C]">Monthly Power:</span>
            <span className="font-extrabold text-[#36B879] theme-light:text-[#347A53] text-sm">{value} kWh</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#A6B3C1] theme-light:text-[#69776C]">Household Share:</span>
            <span className="font-bold text-[#E0B34E] theme-light:text-[#B87A24]">{percentage}%</span>
          </div>
          <div className="flex items-center justify-between border-t border-inherit pt-1.5">
            <span className="text-[11px] font-semibold text-[#A6B3C1] theme-light:text-[#69776C]">Est. Tariff Cost:</span>
            <span className="font-extrabold text-white theme-light:text-[#26382D]">₹{estimatedCost}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// High-contrast, visible hover text box for the bar chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const value = data.value;
    const color = data.payload?.color || '#347A53';
    const rate = 8.5;
    const cost = (Number(value) * rate).toFixed(2);

    return (
      <div className="z-50 min-w-[200px] rounded-2xl border border-[#354456] bg-[#192330] p-3 shadow-2xl backdrop-blur-md theme-light:border-[#DCE5D9] theme-light:bg-white pointer-events-none">
        <div className="flex items-center space-x-2 border-b border-inherit pb-1.5">
          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-xs font-extrabold text-white theme-light:text-[#26382D]">{data.payload?.name || label}</span>
        </div>
        <div className="mt-2 space-y-1 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-[11px] font-medium text-[#A6B3C1] theme-light:text-[#69776C]">Consumption:</span>
            <span className="font-extrabold text-[#36B879] theme-light:text-[#347A53]">{value} kWh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] font-medium text-[#A6B3C1] theme-light:text-[#69776C]">Est. Charge:</span>
            <span className="font-extrabold text-white theme-light:text-[#26382D]">₹{cost}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const BillingTab: React.FC = () => {
  const { 
    userProfile, 
    outlets, 
    isBillPaid, 
    lastPaymentReceipt, 
    payElectricityBill, 
    resetBillPayment,
    settings 
  } = useVoltStore();

  // Payment Gateway Tab Selection
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'GPAY' | 'PAYTM' | 'DEBIT_CARD' | 'CREDIT_CARD'>('UPI');

  // Form Fields
  const [upiId, setUpiId] = useState('rajesh.sharma@okaxis');
  const [upiVerified, setUpiVerified] = useState(true);
  const [paytmMobile, setPaytmMobile] = useState('+91 98201 44821');

  // Card Form Fields
  const [cardNumber, setCardNumber] = useState('4532 8912 7741 4482');
  const [cardHolder, setCardHolder] = useState('Rajesh Sharma');
  const [expDate, setExpDate] = useState('09/28');
  const [cvv, setCvv] = useState('482');
  const [bankName, setBankName] = useState('State Bank of India (Pune Branch)');

  // Modal / Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [otpCode, setOtpCode] = useState('839210');
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Dynamically compute appliance monthly kWh shares from active outlets in store
  const { applianceShares, totalKwh, projectedBill, outlierKwh, outlierCost } = useMemo(() => {
    const outletsList = Object.values(outlets);

    let totalCalculatedKwh = 0;
    const items: Array<{ name: string; kwh: number; color: string }> = [];

    outletsList.forEach((outlet, index) => {
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
      projectedBill: bill > 0 ? bill : 4101.25,
      outlierKwh: wasteKwh,
      outlierCost: wasteCost,
    };
  }, [outlets, userProfile.ratePerKwh]);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAuthModal(true);
  };

  const handleConfirmAuthorization = async () => {
    setIsProcessing(true);
    
    // Simulate gateway verification
    setTimeout(async () => {
      const txnId = `MSEDCL-PUN-${Date.now().toString().slice(-6)}`;
      let vpaOrMasked = '';

      if (selectedMethod === 'UPI') {
        vpaOrMasked = upiId;
      } else if (selectedMethod === 'GPAY') {
        vpaOrMasked = 'Google Pay (UPI linked)';
      } else if (selectedMethod === 'PAYTM') {
        vpaOrMasked = `Paytm Wallet (${paytmMobile})`;
      } else {
        const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '4482';
        vpaOrMasked = `•••• •••• •••• ${last4} (${bankName.split(' ')[0]})`;
      }

      await payElectricityBill({
        transactionId: txnId,
        amount: projectedBill,
        method: selectedMethod,
        consumerNumber: userProfile.consumerNumber,
        vpaOrMasked,
      });

      setIsProcessing(false);
      setShowAuthModal(false);
    }, 1200);
  };

  const isLight = settings.theme === 'light';

  return (
    <div className="space-y-6">
      
      {/* 1. Official MSEDCL Tariff & Billing Overview (Reference Image 2 Inspiration) */}
      <div className="rounded-2xl border p-5 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm
        bg-[#202D3D] border-[#354456] text-[#E8EEF5]
        theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
      ">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white theme-light:text-[#26382D]">
              Utility Billing & NIL Energy Census
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
              isBillPaid 
                ? 'bg-[#36B879]/20 text-[#36B879] border border-[#36B879]/40 theme-light:bg-[#D4E4D0] theme-light:text-[#347A53] theme-light:border-[#77A985]' 
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 theme-light:bg-rose-100 theme-light:text-rose-700 theme-light:border-rose-300 animate-pulse'
            }`}>
              {isBillPaid ? '✓ BILL CLEARED / ZERO DUES' : '● PAYMENT DUE'}
            </span>
          </div>
          <p className="text-xs text-[#A6B3C1] theme-light:text-[#69776C] mt-1">
            Consumer: <strong className="text-white theme-light:text-[#26382D]">{userProfile.name}</strong> • Account: <strong className="text-white theme-light:text-[#26382D] font-mono">{userProfile.consumerNumber}</strong> • MSEDCL Pune West Division
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono w-full md:w-auto">
          <div className="rounded-xl border px-3 py-2
            bg-[#192330] border-[#354456]
            theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
          ">
            <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C]">Tariff Category</div>
            <div className="text-white theme-light:text-[#26382D] font-bold">{userProfile.billingTier}</div>
          </div>
          <div className="rounded-xl border px-3 py-2
            bg-[#192330] border-[#354456]
            theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
          ">
            <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C]">Rate per Unit</div>
            <div className="text-[#36B879] theme-light:text-[#347A53] font-bold">₹{userProfile.ratePerKwh}/kWh</div>
          </div>
          <div className="rounded-xl border px-3 py-2 col-span-2 sm:col-span-1
            bg-[#192330] border-[#354456]
            theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
          ">
            <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C]">Projected Total</div>
            <div className="text-[#E0B34E] theme-light:text-[#B87A24] font-bold text-sm">₹{projectedBill.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Voltaware-Style Analytics KPI Tiles (Reference Image 2) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl border shadow-sm
          bg-[#202D3D] border-[#354456]
          theme-light:bg-white theme-light:border-[#DCE5D9]
        ">
          <div className="text-[11px] font-semibold text-[#A6B3C1] theme-light:text-[#69776C]">
            Average monthly consumption
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-white theme-light:text-[#26382D]">
            {totalKwh.toFixed(1)} <span className="text-xs font-normal">kWh</span>
          </div>
          <div className="mt-1 text-[11px] text-[#36B879] theme-light:text-[#347A53] font-medium">
            Based on active smart loads
          </div>
        </div>

        <div className="p-4 rounded-2xl border shadow-sm
          bg-[#202D3D] border-[#354456]
          theme-light:bg-white theme-light:border-[#DCE5D9]
        ">
          <div className="text-[11px] font-semibold text-[#A6B3C1] theme-light:text-[#69776C]">
            Highest consumption load
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-white theme-light:text-[#26382D]">
            {applianceShares[0]?.kwh ? `${applianceShares[0].kwh.toFixed(1)}` : '182.4'} <span className="text-xs font-normal">kWh</span>
          </div>
          <div className="mt-1 text-[11px] text-[#E0B34E] theme-light:text-[#B87A24] font-medium truncate">
            {applianceShares[0]?.name || 'HVAC / AC Load'}
          </div>
        </div>

        <div className="p-4 rounded-2xl border shadow-sm
          bg-[#202D3D] border-[#354456]
          theme-light:bg-white theme-light:border-[#DCE5D9]
        ">
          <div className="text-[11px] font-semibold text-[#A6B3C1] theme-light:text-[#69776C]">
            Standby / Outlier waste
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-white theme-light:text-[#26382D]">
            {outlierKwh.toFixed(1)} <span className="text-xs font-normal">kWh</span>
          </div>
          <div className="mt-1 text-[11px] text-rose-400 font-medium">
            ~₹{outlierCost.toFixed(0)} phantom cost
          </div>
        </div>

        <div className="p-4 rounded-2xl border shadow-sm
          bg-[#202D3D] border-[#354456]
          theme-light:bg-white theme-light:border-[#DCE5D9]
        ">
          <div className="text-[11px] font-semibold text-[#A6B3C1] theme-light:text-[#69776C]">
            Daily average demand
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-white theme-light:text-[#26382D]">
            {(totalKwh / 30).toFixed(2)} <span className="text-xs font-normal">kWh/day</span>
          </div>
          <div className="mt-1 text-[11px] text-[#4B91D9] font-medium">
            LT-1 Tier 3 threshold normal
          </div>
        </div>
      </div>

      {/* 2. DIRECT MSEDCL PAYMENT GATEWAY SECTION */}
      <div className="rounded-2xl border p-6 space-y-6 shadow-sm
        bg-[#202D3D] border-[#354456]
        theme-light:bg-white theme-light:border-[#DCE5D9]
      ">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-inherit pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#347A53] text-white">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#36B879] theme-light:text-[#347A53] font-mono">
                Direct MSEDCL Mahavitaran Settlement
              </div>
              <h3 className="text-lg font-extrabold text-white theme-light:text-[#26382D]">
                Payment Gateway: Settle Electricity Bill
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-[#36B879] theme-light:text-[#347A53] px-3 py-1.5 rounded-xl border
            bg-[#192330] border-[#354456]
            theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
          ">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit NPCI Instant Clearance</span>
          </div>
        </div>

        {/* If Bill is already Paid */}
        {isBillPaid && lastPaymentReceipt ? (
          <div className="p-6 rounded-2xl border space-y-4 text-center sm:text-left
            bg-[#36B879]/10 border-[#36B879]/30
            theme-light:bg-[#D4E4D0]/50 theme-light:border-[#77A985]
          ">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3.5 bg-[#36B879]/20 rounded-2xl border border-[#36B879]/40 text-[#36B879] theme-light:bg-[#347A53] theme-light:text-white">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white theme-light:text-[#26382D]">Electricity Bill Paid Successfully!</h4>
                  <p className="text-xs text-[#A6B3C1] theme-light:text-[#69776C] mt-0.5">
                    Your account balance is cleared with MSEDCL Pune circle. Zero outstanding surcharge.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#347A53] hover:bg-[#2A6343] text-white font-bold text-xs flex items-center space-x-2 shadow-md transition"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Official Receipt</span>
                </button>

                <button
                  onClick={resetBillPayment}
                  className="px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition
                    bg-[#192330] border-[#354456] text-[#A6B3C1] hover:text-white
                    theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                  "
                  title="Simulate Reset Bill for Testing Payment Gateway"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Bill</span>
                </button>
              </div>
            </div>

            {/* Receipt Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-inherit text-xs font-mono">
              <div className="p-2.5 rounded-xl border bg-[#192330] border-[#354456] theme-light:bg-white theme-light:border-[#DCE5D9]">
                <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C]">Transaction ID</div>
                <div className="text-white theme-light:text-[#26382D] font-bold truncate">{lastPaymentReceipt.transactionId}</div>
              </div>
              <div className="p-2.5 rounded-xl border bg-[#192330] border-[#354456] theme-light:bg-white theme-light:border-[#DCE5D9]">
                <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C]">Settled Amount</div>
                <div className="text-[#36B879] theme-light:text-[#347A53] font-bold">₹{lastPaymentReceipt.amount.toFixed(2)}</div>
              </div>
              <div className="p-2.5 rounded-xl border bg-[#192330] border-[#354456] theme-light:bg-white theme-light:border-[#DCE5D9]">
                <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C]">Channel</div>
                <div className="text-white theme-light:text-[#26382D] font-bold">{lastPaymentReceipt.method}</div>
              </div>
              <div className="p-2.5 rounded-xl border bg-[#192330] border-[#354456] theme-light:bg-white theme-light:border-[#DCE5D9]">
                <div className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C]">Date</div>
                <div className="text-white theme-light:text-[#26382D] font-bold">{lastPaymentReceipt.date}</div>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Method Selector & Gateway Forms */
          <div className="space-y-6">
            
            {/* 5 Payment Methods Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-2xl border
              bg-[#192330] border-[#354456]
              theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
            ">
              {[
                { id: 'UPI', label: 'UPI ID', desc: 'Any UPI / BHIM' },
                { id: 'GPAY', label: 'Google Pay', desc: 'Instant GPay' },
                { id: 'PAYTM', label: 'Paytm', desc: 'Wallet & UPI' },
                { id: 'DEBIT_CARD', label: 'Debit Card', desc: 'RuPay / Visa' },
                { id: 'CREDIT_CARD', label: 'Credit Card', desc: 'Visa / Mastercard' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id as any)}
                  className={`p-3 rounded-xl text-center transition-all duration-200 flex flex-col items-center justify-center space-y-1 ${
                    selectedMethod === m.id
                      ? 'bg-[#347A53] text-white font-extrabold shadow-sm scale-[1.02]'
                      : 'text-[#A6B3C1] hover:text-white theme-light:text-[#69776C] theme-light:hover:text-[#26382D]'
                  }`}
                >
                  <span className="text-xs font-bold leading-tight">{m.label}</span>
                  <span className="text-[10px] opacity-75">{m.desc}</span>
                </button>
              ))}
            </div>

            {/* FORM 1: UPI ID */}
            {selectedMethod === 'UPI' && (
              <form onSubmit={handleStartPayment} className="space-y-4 max-w-xl mx-auto p-5 rounded-2xl border text-xs
                bg-[#192330] border-[#354456]
                theme-light:bg-[#F5F7F0] theme-light:border-[#DCE5D9]
              ">
                <div>
                  <label className="block text-white theme-light:text-[#26382D] font-bold mb-1.5">
                    Enter Virtual Payment Address (UPI ID):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setUpiVerified(true);
                      }}
                      placeholder="username@okhdfcbank or yourname@upi"
                      className="flex-1 px-4 py-2.5 rounded-xl font-mono border
                        bg-[#111820] border-[#354456] text-white
                        theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                      "
                    />
                    <button
                      type="button"
                      onClick={() => setUpiVerified(true)}
                      className="px-3.5 py-2.5 bg-[#347A53] text-white font-bold rounded-xl"
                    >
                      {upiVerified ? '✓ Verified' : 'Verify'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#347A53] hover:bg-[#2A6343] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize UPI Payment (₹{projectedBill.toFixed(2)})</span>
                </button>
              </form>
            )}

            {/* FORM 2: GPAY */}
            {selectedMethod === 'GPAY' && (
              <form onSubmit={handleStartPayment} className="space-y-4 max-w-xl mx-auto p-5 rounded-2xl border text-xs
                bg-[#192330] border-[#354456]
                theme-light:bg-[#F5F7F0] theme-light:border-[#DCE5D9]
              ">
                <div className="text-center space-y-2 py-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#4B91D9]/20 text-[#4B91D9] flex items-center justify-center">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white theme-light:text-[#26382D]">One-Tap Google Pay</h4>
                  <p className="text-[#A6B3C1] theme-light:text-[#69776C] text-xs max-w-sm mx-auto">
                    A notification will be dispatched to your linked Google Pay account ({userProfile.phone}).
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#4B91D9] hover:bg-[#3b82f6] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Send GPay Request (₹{projectedBill.toFixed(2)})</span>
                </button>
              </form>
            )}

            {/* FORM 3: PAYTM */}
            {selectedMethod === 'PAYTM' && (
              <form onSubmit={handleStartPayment} className="space-y-4 max-w-xl mx-auto p-5 rounded-2xl border text-xs
                bg-[#192330] border-[#354456]
                theme-light:bg-[#F5F7F0] theme-light:border-[#DCE5D9]
              ">
                <div>
                  <label className="block text-white theme-light:text-[#26382D] font-bold mb-1">Registered Paytm Mobile:</label>
                  <input
                    type="text"
                    required
                    value={paytmMobile}
                    onChange={(e) => setPaytmMobile(e.target.value)}
                    placeholder="+91 98201 44821"
                    className="w-full px-4 py-2.5 rounded-xl font-mono border
                      bg-[#111820] border-[#354456] text-white
                      theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                    "
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#4B91D9] hover:bg-[#3b82f6] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed via Paytm Gateway (₹{projectedBill.toFixed(2)})</span>
                </button>
              </form>
            )}

            {/* FORM 4: DEBIT CARD */}
            {selectedMethod === 'DEBIT_CARD' && (
              <form onSubmit={handleStartPayment} className="space-y-4 max-w-xl mx-auto p-5 rounded-2xl border text-xs font-mono
                bg-[#192330] border-[#354456]
                theme-light:bg-[#F5F7F0] theme-light:border-[#DCE5D9]
              ">
                <div>
                  <label className="block text-white theme-light:text-[#26382D] font-bold mb-1">Select Bank:</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border
                      bg-[#111820] border-[#354456] text-white
                      theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                    "
                  >
                    <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                    <option value="Bank of Maharashtra (Pune Circle)">Bank of Maharashtra (Pune Circle)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white theme-light:text-[#26382D] font-bold mb-1">16-Digit Card Number:</label>
                  <input
                    type="text"
                    maxLength={19}
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 8912 7741 4482"
                    className="w-full px-4 py-2.5 rounded-xl border
                      bg-[#111820] border-[#354456] text-white
                      theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                    "
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white theme-light:text-[#26382D] font-bold mb-1">Expiry Date:</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border
                        bg-[#111820] border-[#354456] text-white
                        theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                      "
                    />
                  </div>
                  <div>
                    <label className="block text-white theme-light:text-[#26382D] font-bold mb-1">CVV:</label>
                    <input
                      type="password"
                      maxLength={3}
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3 py-2 rounded-xl border
                        bg-[#111820] border-[#354456] text-white
                        theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                      "
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#347A53] hover:bg-[#2A6343] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm font-sans"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize Debit Card (₹{projectedBill.toFixed(2)})</span>
                </button>
              </form>
            )}

            {/* FORM 5: CREDIT CARD */}
            {selectedMethod === 'CREDIT_CARD' && (
              <form onSubmit={handleStartPayment} className="space-y-4 max-w-xl mx-auto p-5 rounded-2xl border text-xs font-mono
                bg-[#192330] border-[#354456]
                theme-light:bg-[#F5F7F0] theme-light:border-[#DCE5D9]
              ">
                <div>
                  <label className="block text-white theme-light:text-[#26382D] font-bold mb-1">Credit Card Number:</label>
                  <input
                    type="text"
                    maxLength={19}
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="5412 7512 8841 9912"
                    className="w-full px-4 py-2.5 rounded-xl border
                      bg-[#111820] border-[#354456] text-white
                      theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                    "
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white theme-light:text-[#26382D] font-bold mb-1">Valid Thru:</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border
                        bg-[#111820] border-[#354456] text-white
                        theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                      "
                    />
                  </div>
                  <div>
                    <label className="block text-white theme-light:text-[#26382D] font-bold mb-1">CVC / CVV:</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3 py-2 rounded-xl border
                        bg-[#111820] border-[#354456] text-white
                        theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                      "
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#347A53] hover:bg-[#2A6343] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm font-sans"
                >
                  <Lock className="w-4 h-4" />
                  <span>Complete Credit Card Payment (₹{projectedBill.toFixed(2)})</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>

      {/* 3. Voltaware-Inspired Appliance Breakdown & Donut Chart (Reference Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Clean Donut Chart */}
        <div className="rounded-2xl border p-5 space-y-3 shadow-sm
          bg-[#202D3D] border-[#354456]
          theme-light:bg-white theme-light:border-[#DCE5D9]
        ">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white theme-light:text-[#26382D]">
              NIL Energy Consumption Breakdown (%)
            </h3>
            <span className="text-xs text-[#36B879] theme-light:text-[#347A53] font-mono font-bold">
              {applianceShares.length} Monitored Loads
            </span>
          </div>

          <div className="h-64 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applianceShares}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="kwh"
                  nameKey="name"
                >
                  {applianceShares.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Readout in Donut */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C] font-semibold uppercase">Total</span>
              <span className="text-base font-black font-mono text-white theme-light:text-[#26382D]">
                ₹{projectedBill.toFixed(0)}
              </span>
              <span className="text-[10px] text-[#36B879] theme-light:text-[#347A53] font-mono">
                {totalKwh.toFixed(0)} kWh
              </span>
            </div>
          </div>
        </div>

        {/* Voltaware-Style Horizontal Appliance Consumption Progress Bars */}
        <div className="rounded-2xl border p-5 space-y-3 shadow-sm
          bg-[#202D3D] border-[#354456]
          theme-light:bg-white theme-light:border-[#DCE5D9]
        ">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white theme-light:text-[#26382D]">
              Appliance Consumption & Share
            </h3>
            <span className="text-xs text-[#A6B3C1] theme-light:text-[#69776C] font-mono">Monthly kWh</span>
          </div>

          <div className="space-y-3.5 pt-2 max-h-72 overflow-y-auto pr-1">
            {applianceShares.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white theme-light:text-[#26382D] truncate">
                    {item.name}
                  </span>
                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span className="text-[#A6B3C1] theme-light:text-[#69776C] font-bold">{item.percentage}%</span>
                    <span className="font-bold text-white theme-light:text-[#26382D]">{item.kwh} kWh</span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-800/40 theme-light:bg-[#E8EFDF] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Appliance Health & Energy Recommendations */}
      <div className="rounded-2xl border p-6 space-y-4 shadow-sm
        bg-[#202D3D] border-[#354456]
        theme-light:bg-white theme-light:border-[#DCE5D9]
      ">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-[#E0B34E]" />
          <h3 className="text-base font-bold text-white theme-light:text-[#26382D]">
            AI NIL Disaggregation Insights & Bill Optimizations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4 space-y-2
            bg-[#192330] border-[#354456]
            theme-light:bg-[#F5F7F0] theme-light:border-[#DCE5D9]
          ">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#E0B34E] font-mono uppercase">Master Bedroom AC</span>
              <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-[#E0B34E]/15 border border-[#E0B34E]/30 text-[#E0B34E]">
                +26% Above Baseline
              </span>
            </div>
            <h4 className="text-sm font-bold text-white theme-light:text-[#26382D]">Compressor Load Drag Detected</h4>
            <p className="text-xs text-[#A6B3C1] theme-light:text-[#69776C] leading-relaxed">
              AC unit consumed 26% more energy this cycle. Clogged coil filters increase compressor runtime by 42 minutes per day.
            </p>
            <div className="pt-2 border-t border-inherit flex items-start space-x-2 text-xs text-[#36B879] theme-light:text-[#347A53] font-medium">
              <Wrench className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Clean filter coils to reduce consumption by ~₹420/month.</span>
            </div>
          </div>

          <div className="rounded-xl border p-4 space-y-2
            bg-[#192330] border-[#354456]
            theme-light:bg-[#F5F7F0] theme-light:border-[#DCE5D9]
          ">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4B91D9] font-mono uppercase">Water Heater Geyser</span>
              <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-[#4B91D9]/15 border border-[#4B91D9]/30 text-[#4B91D9]">
                High Peak Tariff Duty
              </span>
            </div>
            <h4 className="text-sm font-bold text-white theme-light:text-[#26382D]">Peak Hours Operation (7 AM - 9 AM)</h4>
            <p className="text-xs text-[#A6B3C1] theme-light:text-[#69776C] leading-relaxed">
              Running high-draw immersion element during peak morning slab incurs Tier 3 pricing.
            </p>
            <div className="pt-2 border-t border-inherit flex items-start space-x-2 text-xs text-[#36B879] theme-light:text-[#347A53] font-medium">
              <Clock className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Shift pre-heating by 30 minutes to reduce monthly surcharge.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Official PDF Receipt Modal */}
      {showReceiptModal && lastPaymentReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl
            bg-[#202D3D] border-[#354456] text-[#E8EEF5]
            theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
          ">
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-[#347A53]" />
                <h3 className="font-bold text-base text-white theme-light:text-[#26382D]">Official MSEDCL Payment Receipt</h3>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-xs font-bold text-[#A6B3C1] hover:text-white theme-light:text-[#69776C] theme-light:hover:text-[#26382D]"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-inherit">
                <span className="text-[#A6B3C1] theme-light:text-[#69776C]">Transaction ID</span>
                <span className="font-bold text-white theme-light:text-[#26382D]">{lastPaymentReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-inherit">
                <span className="text-[#A6B3C1] theme-light:text-[#69776C]">Consumer Name</span>
                <span className="font-bold text-white theme-light:text-[#26382D]">{userProfile.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-inherit">
                <span className="text-[#A6B3C1] theme-light:text-[#69776C]">Consumer Number</span>
                <span className="font-bold text-white theme-light:text-[#26382D]">{lastPaymentReceipt.consumerNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-inherit">
                <span className="text-[#A6B3C1] theme-light:text-[#69776C]">Amount Settled</span>
                <span className="font-bold text-[#36B879] theme-light:text-[#347A53] text-sm">₹{lastPaymentReceipt.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-inherit">
                <span className="text-[#A6B3C1] theme-light:text-[#69776C]">Payment Channel</span>
                <span className="text-white theme-light:text-[#26382D]">{lastPaymentReceipt.method}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#A6B3C1] theme-light:text-[#69776C]">Date & Time</span>
                <span className="text-white theme-light:text-[#26382D]">{lastPaymentReceipt.date}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceiptModal(false)}
              className="w-full py-2.5 bg-[#347A53] text-white font-bold rounded-xl text-xs"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* 6. Bank 2FA Authorization Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl
            bg-[#202D3D] border-[#354456] text-[#E8EEF5]
            theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
          ">
            <div className="flex items-center space-x-3 border-b border-inherit pb-3">
              <div className="p-2 rounded-xl bg-[#347A53] text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white theme-light:text-[#26382D]">Authorize Payment to MSEDCL</h4>
                <p className="text-[11px] text-[#A6B3C1] theme-light:text-[#69776C]">NPCI 2-Factor Bank Authentication</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border space-y-1.5 font-mono text-xs
              bg-[#192330] border-[#354456]
              theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9]
            ">
              <div className="flex justify-between">
                <span className="text-[#A6B3C1] theme-light:text-[#69776C]">Settlement Amount:</span>
                <span className="font-bold text-[#E0B34E] theme-light:text-[#B87A24]">₹{projectedBill.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A6B3C1] theme-light:text-[#69776C]">Payment Channel:</span>
                <span className="text-white theme-light:text-[#26382D]">{selectedMethod}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-white theme-light:text-[#26382D]">Enter 6-Digit Bank OTP:</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-center font-mono font-bold text-sm tracking-widest border
                  bg-[#111820] border-[#354456] text-white
                  theme-light:bg-white theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                "
              />
              <span className="text-[10px] text-[#A6B3C1] theme-light:text-[#69776C] text-center block">
                Testing Demo OTP: 839210
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="flex-1 py-2.5 rounded-xl border text-xs font-bold
                  bg-[#192330] border-[#354456] text-[#A6B3C1] hover:text-white
                  theme-light:bg-[#E8EFDF] theme-light:border-[#DCE5D9] theme-light:text-[#26382D]
                "
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAuthorization}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-[#347A53] hover:bg-[#2A6343] text-white text-xs font-bold shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                {isProcessing ? (
                  <span>Clearing...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
