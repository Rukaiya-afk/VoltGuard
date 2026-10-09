'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  Sparkles, 
  X, 
  CheckCircle2,
  AlertCircle,
  Flame,
  Check,
  Info
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';

export const AuthPortal: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [consumerNumber, setConsumerNumber] = useState('MH-MUM-8921-X');
  const [email, setEmail] = useState('rajesh.sharma@voltguard.io');
  const [password, setPassword] = useState('VoltGuard#2026');
  const [errorMsg, setErrorMsg] = useState('');

  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const { login, createAccount, loginNormalUser, loginSpikedUser } = useVoltStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerNumber.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all credential fields.');
      return;
    }
    setErrorMsg('');
    if (isSignUp) {
      createAccount(consumerNumber, email);
    } else {
      login(consumerNumber, email);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 1) {
      setForgotStep(2);
    } else if (forgotStep === 2) {
      if (otpInput.length < 4) {
        setErrorMsg('Enter the 6-digit verification code (482910).');
        return;
      }
      setErrorMsg('');
      setForgotStep(3);
    } else {
      if (!newPassword.trim()) return;
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotSuccess(false);
        setForgotModalOpen(false);
        setForgotStep(1);
      }, 1500);
    }
  };

  const fillAccountPreset = (consumer: string, mail: string) => {
    setConsumerNumber(consumer);
    setEmail(mail);
    setPassword('VoltGuard#2026');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md space-y-6">

        {/* Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-teal-900/60 border border-teal-700/50 p-2.5 shadow-sm mb-1">
            <Zap className="h-7 w-7 text-teal-300 font-bold" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            VoltGuard Home Protection
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Smart Electrical Anomaly Detection & Fire Safety Console
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-5">
          
          <div className="grid grid-cols-2 rounded-xl bg-slate-950/70 p-1 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
              className={`rounded-lg py-2 transition-all ${
                !isSignUp
                  ? 'bg-teal-700 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
              className={`rounded-lg py-2 transition-all ${
                isSignUp
                  ? 'bg-teal-700 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Credential Helper Banner for Create Account */}
          {isSignUp && (
            <div className="rounded-xl border border-teal-500/30 bg-teal-950/30 p-3 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 text-teal-300 font-bold">
                <Info className="h-4 w-4 shrink-0" />
                <span>Account Creation Instructions:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Enter your state utility Electricity Consumer ID format (e.g., <code className="text-teal-300 font-mono">MH-MUM-8921-X</code>) and email. Creating an account immediately opens the <strong>Appliance Onboarding Wizard</strong> to register appliances & IoT sensors.
              </p>
              
              <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="text-slate-400 self-center">Presets:</span>
                <button
                  type="button"
                  onClick={() => fillAccountPreset('MH-MUM-8921-X', 'rajesh.sharma@voltguard.io')}
                  className="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 text-teal-300 hover:border-teal-500"
                >
                  MH-MUM-8921-X
                </button>
                <button
                  type="button"
                  onClick={() => fillAccountPreset('MH-DEL-4091-Y', 'priya.patel@voltguard.io')}
                  className="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 text-teal-300 hover:border-teal-500"
                >
                  MH-DEL-4091-Y
                </button>
                <button
                  type="button"
                  onClick={() => fillAccountPreset('MH-PUN-3312-Z', 'anand.verma@voltguard.io')}
                  className="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 text-teal-300 hover:border-teal-500"
                >
                  MH-PUN-3312-Z
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center space-x-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                Electricity Consumer Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  placeholder="e.g. MH-MUM-8921-X"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="consumer@example.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => { setForgotModalOpen(true); setForgotStep(1); setErrorMsg(''); }}
                    className="text-[11px] font-medium text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-teal-700 py-3 text-xs font-bold text-white shadow-md hover:bg-teal-600 transition-all"
            >
              <span>{isSignUp ? 'Create Account & Launch Appliance Setup' : 'Sign In to Home Console'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Demo Accounts Credentials Section */}
          <div className="pt-2 border-t border-slate-800 space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider font-mono">
              Quick Evaluation Credentials
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={loginNormalUser}
                className="rounded-xl border border-teal-700/50 bg-teal-950/40 p-2.5 text-left hover:bg-teal-900/40 transition-all group"
              >
                <div className="flex items-center space-x-1 text-xs font-bold text-teal-300">
                  <Check className="h-3.5 w-3.5 text-teal-400" />
                  <span>Normal Account</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">MH-MUM-8921-X</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Safe baseline readings</div>
              </button>

              <button
                type="button"
                onClick={loginSpikedUser}
                className="rounded-xl border border-rose-700/50 bg-rose-950/40 p-2.5 text-left hover:bg-rose-900/40 transition-all group"
              >
                <div className="flex items-center space-x-1 text-xs font-bold text-rose-300">
                  <Flame className="h-3.5 w-3.5 text-rose-400" />
                  <span>Spiked Account</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">MH-MUM-SPIKE-44</div>
                <div className="text-[9px] text-rose-400/80 mt-0.5">Spiked hazard reading</div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2">
              <KeyRound className="h-5 w-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">Reset Password</h3>
            </div>

            <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-2 text-slate-400">
              <span className={forgotStep === 1 ? 'text-teal-400 font-bold' : ''}>1. Consumer ID</span>
              <span>&rarr;</span>
              <span className={forgotStep === 2 ? 'text-teal-400 font-bold' : ''}>2. Code (482910)</span>
              <span>&rarr;</span>
              <span className={forgotStep === 3 ? 'text-teal-400 font-bold' : ''}>3. New Password</span>
            </div>

            {forgotSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="h-10 w-10 text-teal-400 mx-auto" />
                <div className="text-sm font-bold text-white">Password Reset Successful!</div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {forgotStep === 1 && (
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Consumer ID or Email</label>
                    <input
                      type="text"
                      value={consumerNumber}
                      onChange={(e) => setConsumerNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-teal-500"
                      required
                    />
                  </div>
                )}

                {forgotStep === 2 && (
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">
                      Verification Code (Enter <span className="text-teal-400 font-mono">482910</span>)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="482910"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-center text-sm font-mono text-teal-400"
                      required
                    />
                  </div>
                )}

                {forgotStep === 3 && (
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-teal-500"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-teal-700 py-2.5 text-xs font-bold text-white hover:bg-teal-600 transition-colors"
                >
                  {forgotStep === 1 ? 'Send Code' : forgotStep === 2 ? 'Verify Code' : 'Save New Password'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
