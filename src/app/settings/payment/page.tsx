'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Plus, Trash2, CheckCircle2, ShieldCheck, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { useVoltStore } from '@/lib/store';

export default function PaymentSettingsPage() {
  const { settings, updateSettings, addSavedCard, removeSavedCard } = useVoltStore();
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  // New Card Form State
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [brand, setBrand] = useState<'visa' | 'mastercard' | 'amex'>('visa');
  const [cardSuccessMsg, setCardSuccessMsg] = useState('');

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    const last4 = cleanNumber.slice(-4) || '9999';
    const masked = `•••• •••• •••• ${last4}`;

    addSavedCard({
      cardHolder: cardHolder || 'VoltGuard Customer',
      cardNumberMasked: masked,
      last4,
      expDate: expDate || '12/28',
      brand,
      isDefault: settings.savedCards.length === 0,
    });

    setCardHolder('');
    setCardNumber('');
    setExpDate('');
    setCvc('');
    setShowAddCardModal(false);

    setCardSuccessMsg('New credit/debit card successfully saved!');
    setTimeout(() => setCardSuccessMsg(''), 3500);
  };

  const handleSetDefaultCard = (id: string) => {
    const updatedCards = settings.savedCards.map((c) => ({
      ...c,
      isDefault: c.id === id,
    }));
    updateSettings({ savedCards: updatedCards });
  };

  return (
    <div className={`min-h-screen theme-${settings.theme} transition-colors duration-200`}>
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/settings"
              className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Settings Hub</span>
            </Link>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 font-mono">Partition 08</div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-emerald-400" />
                <span>Payment Gateway & Saved Cards</span>
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCardModal(true)}
            className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Card</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Card Payments Notice */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-3 text-emerald-300 font-semibold">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Payment Methods Notice: Strictly Credit & Debit Card payments are supported for utility settlements (No UPI/Wallets).</span>
            </div>
          </div>

          {cardSuccessMsg && (
            <div className="flex items-center space-x-2 text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-800 rounded-xl p-3 font-semibold">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{cardSuccessMsg}</span>
            </div>
          )}

          {/* Auto-Pay Toggle */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 flex items-center justify-between shadow-xl backdrop-blur-md">
            <div>
              <div className="text-sm font-bold text-white">Auto-Pay Utility Bills</div>
              <div className="text-xs text-slate-400">Automatically settle monthly disaggregated billing total on invoice date using default card</div>
            </div>

            <button
              type="button"
              onClick={() => updateSettings({ autoPayEnabled: !settings.autoPayEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoPayEnabled ? 'bg-emerald-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoPayEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Saved Credit / Debit Cards List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Saved Payment Cards</div>

            {settings.savedCards.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-mono">No payment cards currently saved.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings.savedCards.map((card) => (
                  <div
                    key={card.id}
                    className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                      card.isDefault
                        ? 'border-emerald-500 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 shadow-lg ring-1 ring-emerald-500/40'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="uppercase text-[11px] font-extrabold tracking-wider text-emerald-400 font-mono">
                          {card.brand}
                        </span>
                        {card.isDefault && (
                          <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Default Card</span>
                          </span>
                        )}
                      </div>

                      <div className="text-lg font-mono font-extrabold text-white tracking-widest">
                        {card.cardNumberMasked}
                      </div>

                      <div className="flex justify-between items-end text-xs font-mono">
                        <div>
                          <div className="text-[9px] uppercase text-slate-400 font-bold">Cardholder</div>
                          <div className="text-slate-200 font-bold">{card.cardHolder}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase text-slate-400 font-bold">Expires</div>
                          <div className="text-slate-200 font-bold">{card.expDate}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
                      {!card.isDefault ? (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultCard(card.id)}
                          className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          Set as Default Card
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400/80 font-bold">Primary Settlement Method</span>
                      )}

                      <button
                        type="button"
                        onClick={() => removeSavedCard(card.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Delete Card"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Card Modal */}
        {showAddCardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-emerald-400" />
                  <span>Add Credit / Debit Card</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCard} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">Card Network</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-bold"
                  >
                    <option value="visa">Visa Credit / Debit</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Rajesh Sharma"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">16-Digit Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4532 8912 7741 4921"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="08/28"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">CVC / CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddCardModal(false)}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
                  >
                    Save Card Securely
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
