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
  ShieldAlert
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { BillingApplianceShare, PaymentReceipt } from '@/lib/types';

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

// High-contrast, visible hover text box for the pie chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const { name, value, payload: sliceData } = data;
    const percentage = sliceData?.percentage ?? 0;
    const color = sliceData?.color || '#14b8a6';
    const rate = 8.5;
    const estimatedCost = (Number(value) * rate).toFixed(2);

    return (
      <div className="z-50 min-w-[220px] rounded-2xl border-2 border-teal-500 bg-white p-3.5 shadow-2xl backdrop-blur-md dark:border-teal-400 dark:bg-slate-900 transition-all pointer-events-none ring-4 ring-teal-500/10">
        <div className="flex items-center space-x-2.5 border-b border-slate-200 pb-2 dark:border-slate-800">
          <span className="h-3.5 w-3.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: color }} />
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
            {name}
          </h4>
        </div>

        <div className="mt-2.5 space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Monthly Power:</span>
            <span className="font-extrabold text-teal-700 dark:text-teal-400 text-sm">{value} kWh</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Household Share:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{percentage}%</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/90 pt-1.5 dark:border-slate-800/90">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Est. Tariff Cost:</span>
            <span className="font-extrabold text-slate-950 dark:text-emerald-400">₹{estimatedCost}</span>
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
    const color = data.payload?.color || '#14b8a6';
    const rate = 8.5;
    const cost = (Number(value) * rate).toFixed(2);

    return (
      <div className="z-50 min-w-[200px] rounded-2xl border-2 border-teal-500 bg-white p-3 shadow-2xl backdrop-blur-md dark:border-teal-400 dark:bg-slate-900 pointer-events-none ring-4 ring-teal-500/10">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5 dark:border-slate-800">
          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-xs font-extrabold text-slate-900 dark:text-white">{data.payload?.name || label}</span>
        </div>
        <div className="mt-2 space-y-1 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Consumption:</span>
            <span className="font-extrabold text-teal-700 dark:text-teal-400">{value} kWh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Est. Charge:</span>
            <span className="font-extrabold text-slate-950 dark:text-emerald-400">₹{cost}</span>
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
    resetBillPayment 
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

  return (
    <div className="space-y-6">
      
      {/* 1. MSEDCL Official Billing Status & Tariff Card */}
      <div className="rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/80 p-5 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm dark:shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Utility Bill & Tariff Disaggregation</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
              isBillPaid 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40' 
                : 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/40 animate-pulse'
            }`}>
              {isBillPaid ? '✓ BILL PAID / ZERO DUES' : '● PAYMENT DUE'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consumer: <strong className="text-slate-800 dark:text-slate-200">{userProfile.name}</strong> • ID: <strong className="text-slate-800 dark:text-slate-200">{userProfile.consumerNumber}</strong> • MSEDCL Pune Kothrud Sub-division
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono w-full md:w-auto">
          <div className="rounded-xl border border-slate-200/90 bg-slate-100/90 dark:border-slate-800 dark:bg-slate-950 px-3 py-2 shadow-xs">
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Tariff Slab</div>
            <div className="text-slate-900 dark:text-slate-200 font-bold">{userProfile.billingTier}</div>
          </div>
          <div className="rounded-xl border border-slate-200/90 bg-slate-100/90 dark:border-slate-800 dark:bg-slate-950 px-3 py-2 shadow-xs">
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Total Consumed</div>
            <div className="text-teal-700 dark:text-teal-400 font-bold">{totalKwh.toFixed(1)} kWh</div>
          </div>
          <div className="rounded-xl border border-slate-200/90 bg-slate-100/90 dark:border-slate-800 dark:bg-slate-950 px-3 py-2 col-span-2 sm:col-span-1 shadow-xs">
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Net Due Amount</div>
            <div className="text-amber-600 dark:text-amber-400 font-bold text-sm">₹{projectedBill.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* 2. DIRECT RELOCATED PAYMENT GATEWAY SECTION */}
      <div className="rounded-2xl border-2 border-teal-500/50 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-6 space-y-6 shadow-xl relative overflow-hidden">
        
        {/* Decorative lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-100 text-teal-700 border border-teal-300 dark:bg-teal-500/20 dark:border-teal-500/40 dark:text-teal-400 rounded-xl shadow-xs">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono">
                Direct MSEDCL Settlement Portal
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Payment Gateway: Settle Monthly Bill
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 dark:text-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>256-Bit SSL Encrypted NPCI Gateway</span>
          </div>
        </div>

        {/* If Bill is already Paid */}
        {isBillPaid && lastPaymentReceipt ? (
          <div className="p-6 bg-emerald-950/40 border-2 border-emerald-500/50 rounded-2xl space-y-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3.5 bg-emerald-500/20 rounded-2xl border border-emerald-500/40 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Electricity Bill Paid Successfully!</h4>
                  <p className="text-xs text-emerald-300/80 mt-0.5">
                    Your account balance is cleared with MSEDCL Pune circle. Zero outstanding surcharge.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Official Receipt</span>
                </button>

                <button
                  onClick={resetBillPayment}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center space-x-1.5 transition border border-slate-700"
                  title="Simulate Reset Bill for Testing Payment Gateway"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Bill</span>
                </button>
              </div>
            </div>

            {/* Receipt Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-500/20 text-xs font-mono">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-emerald-500/20">
                <div className="text-[10px] text-slate-400">Transaction ID</div>
                <div className="text-emerald-300 font-bold truncate">{lastPaymentReceipt.transactionId}</div>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-emerald-500/20">
                <div className="text-[10px] text-slate-400">Settled Amount</div>
                <div className="text-white font-bold">₹{lastPaymentReceipt.amount.toFixed(2)}</div>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-emerald-500/20">
                <div className="text-[10px] text-slate-400">Payment Channel</div>
                <div className="text-emerald-300 font-bold">{lastPaymentReceipt.method}</div>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-emerald-500/20">
                <div className="text-[10px] text-slate-400">Settlement Date</div>
                <div className="text-slate-200 font-bold">{lastPaymentReceipt.date}</div>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Method Selector & Gateway Forms */
          <div className="space-y-6">
            
            {/* 5 Payment Methods Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-100 border border-slate-200 dark:bg-slate-950/90 dark:border-slate-800 rounded-2xl shadow-inner">
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
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-teal-500/20 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="text-xs font-bold leading-tight">{m.label}</span>
                  <span className={`text-[10px] leading-tight ${selectedMethod === m.id ? 'text-slate-900 font-semibold' : 'text-slate-500 dark:text-slate-500'}`}>
                    {m.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* FORM 1: UPI ID */}
            {selectedMethod === 'UPI' && (
              <form onSubmit={handleStartPayment} className="space-y-4 max-w-xl mx-auto bg-white/95 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
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
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setUpiVerified(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-teal-700 font-bold border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-teal-400 dark:border-slate-700 transition"
                    >
                      Verify VPA
                    </button>
                  </div>

                  {upiVerified && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 mt-2 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified: Rajesh Sharma (State Bank of India • UPI Enabled)</span>
                    </div>
                  )}

                  {/* UPI Quick Handles */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-3">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Quick Handles:</span>
                    {['@okaxis', '@okhdfcbank', '@paytm', '@ybl', '@sbi'].map((handle) => (
                      <button
                        key={handle}
                        type="button"
                        onClick={() => {
                          const base = upiId.split('@')[0] || 'rajesh.sharma';
                          setUpiId(`${base}${handle}`);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] text-slate-700 hover:border-teal-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 font-mono"
                      >
                        {handle}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{projectedBill.toFixed(2)} via UPI ID</span>
                </button>
              </form>
            )}

            {/* FORM 2: GOOGLE PAY (GPAY) */}
            {selectedMethod === 'GPAY' && (
              <div className="space-y-4 max-w-xl mx-auto bg-white/95 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-center shadow-sm">
                <div className="py-2">
                  <div className="inline-flex p-3 rounded-2xl bg-white text-slate-950 shadow-md font-bold text-lg items-center space-x-2 border border-slate-200">
                    <span className="font-extrabold text-blue-600">G</span>
                    <span className="font-bold text-slate-800">Pay</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3">Google Pay 1-Tap Utility Authorization</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Approve securely using your linked Google Account & UPI PIN with zero transaction surcharge.
                  </p>
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Payee:</span>
                    <span className="text-slate-900 dark:text-white font-bold">MSEDCL Pune Circle</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Consumer:</span>
                    <span className="text-teal-700 dark:text-teal-300 font-bold">{userProfile.consumerNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Settlement:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">₹{projectedBill.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleStartPayment}
                  className="w-full py-3 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-extrabold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
                >
                  <span>Pay ₹{projectedBill.toFixed(2)} with Google Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* FORM 3: PAYTM */}
            {selectedMethod === 'PAYTM' && (
              <form onSubmit={handleStartPayment} className="space-y-4 max-w-xl mx-auto bg-white/95 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="px-3 py-1 bg-sky-100 text-sky-800 border border-sky-300 dark:bg-sky-900/60 dark:border-sky-400/40 dark:text-sky-400 rounded-lg font-extrabold font-mono text-sm">
                    Paytm
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Paytm Wallet, Postpaid, or Net Banking
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Paytm Registered Mobile Number:
                  </label>
                  <input
                    type="text"
                    required
                    value={paytmMobile}
                    onChange={(e) => setPaytmMobile(e.target.value)}
                    placeholder="+91 98201 44821"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    A secure OTP login prompt will be requested on this number.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed via Paytm Gateway (₹{projectedBill.toFixed(2)})</span>
                </button>
              </form>
            )}

            {/* FORM 4: DEBIT CARD */}
            {selectedMethod === 'DEBIT_CARD' && (
              <form onSubmit={handleStartPayment} className="space-y-4 max-w-xl mx-auto bg-white/95 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono shadow-sm">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Select Issuing Bank:</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  >
                    <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                    <option value="Bank of Maharashtra (Pune Circle)">Bank of Maharashtra (Pune Circle)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">16-Digit Debit Card Number:</label>
                  <input
                    type="text"
                    maxLength={19}
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 8912 7741 4482"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Expiry Date:</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">CVV (3 Digits):</label>
                    <input
                      type="password"
                      maxLength={3}
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Cardholder Name:</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Rajesh Sharma"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm font-sans"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize Debit Card (₹{projectedBill.toFixed(2)})</span>
                </button>
              </form>
            )}

            {/* FORM 5: CREDIT CARD */}
            {selectedMethod === 'CREDIT_CARD' && (
              <form onSubmit={handleStartPayment} className="space-y-4 max-w-xl mx-auto bg-white/95 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono shadow-sm">
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Zero convenience surcharge on residential electricity settlements</span>
                  </div>
                  <span className="font-bold text-amber-700 dark:text-amber-300">2x Green Points</span>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Credit Card Number:</label>
                  <input
                    type="text"
                    maxLength={19}
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="5412 7512 8841 9912"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-teal-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Valid Thru:</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">CVC / CVV:</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Name on Credit Card:</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Rajesh Sharma"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm font-sans"
                >
                  <Lock className="w-4 h-4" />
                  <span>Complete Credit Card Payment (₹{projectedBill.toFixed(2)})</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>

      {/* 3. Dynamic Charts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Dynamic Donut Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/80 p-5 space-y-3 shadow-sm dark:shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Dynamic Appliance Breakdown (%)</h3>
            <span className="text-xs text-teal-600 dark:text-teal-400 font-mono font-bold">{applianceShares.length} Circuits</span>
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
                <Tooltip content={<CustomPieTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/80 p-5 space-y-3 shadow-sm dark:shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Appliance Monthly Consumption (kWh)</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Real-Time Sensor Aggregate</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applianceShares} margin={{ top: 10, right: 30, left: 0, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9, fill: '#64748b' }} interval={0} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip content={<CustomBarTooltip />} />
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

      {/* 4. Appliance Health & Energy Recommendations */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Appliance Health & Bill Saving Recommendations</h3>
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
              Master Bedroom AC used 26% more electricity this week than normal due to clogged air filters.
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
              <span><strong>Recommendation:</strong> Descale heating tank element to restore rapid heating.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bank Gateway OTP Authorization Dialog */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border-2 border-teal-500/80 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Bank 3D-Secure Authorization</h3>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Merchant:</span>
                <span className="text-slate-200 font-bold">MSEDCL Pune Circle</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Method:</span>
                <span className="text-teal-400 font-bold">{selectedMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm">
                <span className="text-slate-300 font-bold">Settlement Amount:</span>
                <span className="text-emerald-400 font-extrabold">₹{projectedBill.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-semibold">Enter Bank OTP Code:</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="6-digit bank code"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-teal-300 focus:outline-none focus:border-teal-400"
              />
              <span className="text-[10px] text-slate-400 block text-center">
                Demo code: <strong className="text-teal-400">839210</strong> (Auto-filled for testing)
              </span>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmAuthorization}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg flex items-center justify-center space-x-1.5"
              >
                {isProcessing ? (
                  <span>Contacting Gateway...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confirm & Settle</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Official Digital Payment Receipt Modal */}
      {showReceiptModal && lastPaymentReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-500/70 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Official MSEDCL Payment Receipt</h3>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-center pb-2 border-b border-slate-800">
                <h4 className="font-bold text-white text-sm">MAHARASHTRA STATE ELECTRICITY DISTRIBUTION CO. LTD</h4>
                <p className="text-[10px] text-slate-400">Kothrud Urban Circle • BU-4110 • Pune, Maharashtra</p>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Consumer Number:</span>
                  <span className="text-white font-bold">{lastPaymentReceipt.consumerNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consumer Name:</span>
                  <span className="text-white">{userProfile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="text-emerald-400 font-bold">{lastPaymentReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Channel:</span>
                  <span className="text-teal-300">{lastPaymentReceipt.method} ({lastPaymentReceipt.vpaOrMasked})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="text-slate-200">{lastPaymentReceipt.date}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-sans font-bold">
                  <span className="text-slate-200">Amount Paid:</span>
                  <span className="text-emerald-400 font-mono">₹{lastPaymentReceipt.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400 font-bold">
                  <span>Status:</span>
                  <span>SUCCESSFUL (Zero Dues)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
