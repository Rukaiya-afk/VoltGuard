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
  Wrench,
  Building,
  Key,
  Flame,
  Check,
  Phone
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { UserRole } from '@/lib/types';

export const AuthPortal: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [identifier, setIdentifier] = useState('rajesh.sharma@gmail.com');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Forgot Password & OTP State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('839210');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const { loginWithCredentials } = useVoltStore();

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'user') {
      setIdentifier('rajesh.sharma@gmail.com');
      setPassword('password123');
    } else if (role === 'electrician') {
      setIdentifier('vikram.electrician@gmail.com');
      setPassword('electrician123');
    } else {
      setIdentifier('rukaiya.admin@gmail.com');
      setPassword('adminpassword123');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter your login email/ID and password.');
      return;
    }

    const success = loginWithCredentials(identifier, selectedRole);
    if (success) {
      setLoginSuccess(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid login credentials for the selected portal role.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 1) {
      if (!forgotIdentifier.trim()) {
        setErrorMsg('Please enter your registered email or consumer ID.');
        return;
      }
      setErrorMsg('');
      setGeneratedOtp('839210');
      setForgotStep(2);
    } else if (forgotStep === 2) {
      if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '839210') {
        setErrorMsg('Invalid OTP code. Please enter the 6-digit code shown.');
        return;
      }
      setErrorMsg('');
      setForgotStep(3);
    } else if (forgotStep === 3) {
      if (newPassword.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      setErrorMsg('');
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotModalOpen(false);
        setForgotStep(1);
        setForgotSuccess(false);
        setOtpInput('');
        setNewPassword('');
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Lighting Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10 space-y-6 animate-fadeIn">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 shadow-md">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-mono font-bold tracking-wide text-slate-200">
              VOLTGUARD ⚡ SAFETY ECOSYSTEM
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Electrical Safety & Fire Mitigation
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto">
            Choose your portal role to access resident monitoring, electrician service queue, or safety command desk.
          </p>
        </div>

        {/* Portal Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-inner">
          <button
            type="button"
            onClick={() => handleRoleChange('user')}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
              selectedRole === 'user'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Resident</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('electrician')}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
              selectedRole === 'electrician'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Electrician</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
              selectedRole === 'admin'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Main Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">
                {selectedRole === 'user' && 'Resident Consumer Login'}
                {selectedRole === 'electrician' && 'Certified Electrician Portal'}
                {selectedRole === 'admin' && 'Admin & Developer Command'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedRole === 'user' && 'Inspect home switches, billing forecasts, and report faults'}
                {selectedRole === 'electrician' && 'Accept client repair slots, chats, and review scorecard'}
                {selectedRole === 'admin' && 'Manage multi-user safety grid, triage tickets, and live dispatch'}
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/40 rounded-xl text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {selectedRole === 'user' ? 'Email Address / Consumer ID:' : 'Registered Account Email:'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    selectedRole === 'user'
                      ? 'e.g. rajesh.sharma@gmail.com'
                      : selectedRole === 'electrician'
                      ? 'e.g. vikram.electrician@gmail.com'
                      : 'e.g. rukaiya.admin@gmail.com'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-teal-400 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Password:</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotIdentifier(identifier);
                    setForgotModalOpen(true);
                    setForgotStep(1);
                  }}
                  className="text-xs text-teal-400 hover:text-teal-300 underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-teal-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-bold text-xs md:text-sm shadow-lg flex items-center justify-center space-x-2 transition ${
                selectedRole === 'user'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 shadow-teal-500/20'
                  : selectedRole === 'electrician'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white shadow-indigo-500/20'
              }`}
            >
              <span>Sign In to {selectedRole === 'user' ? 'Resident Portal' : selectedRole === 'electrician' ? 'Electrician Queue' : 'Admin Center'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Manual Credentials Reference Card */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-300 flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Available Demo Credentials (Manual Typing Supported):</span>
            </div>

            {selectedRole === 'user' && (
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded-lg">
                  <span>👤 <strong>Rajesh Sharma</strong> (Kothrud Senior Resident):</span>
                  <span className="font-mono text-teal-300">rajesh.sharma@gmail.com / password123</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded-lg">
                  <span>👤 <strong>Priya Patel</strong> (Mayur Colony, Kothrud):</span>
                  <span className="font-mono text-teal-300">priya.patel@gmail.com / password123</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded-lg">
                  <span>👤 <strong>Amit Verma</strong> (Karve Nagar, Pune):</span>
                  <span className="font-mono text-teal-300">amit.verma@gmail.com / password123</span>
                </div>
              </div>
            )}

            {selectedRole === 'electrician' && (
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded-lg">
                  <span>⚡ <strong>Vikram Jadhav</strong> (Kothrud / Paud Road - 4.9★):</span>
                  <span className="font-mono text-amber-300">vikram.electrician@gmail.com / electrician123</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded-lg">
                  <span>⚡ <strong>Suresh Nair</strong> (Bavdhan / Kothrud - 4.8★):</span>
                  <span className="font-mono text-amber-300">suresh.electrician@gmail.com / electrician123</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded-lg">
                  <span>⚡ <strong>Arun Kumar</strong> (Erandwane / Deccan - 4.9★):</span>
                  <span className="font-mono text-amber-300">arun.electrician@gmail.com / electrician123</span>
                </div>
              </div>
            )}

            {selectedRole === 'admin' && (
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded-lg">
                  <span>🛡️ <strong>Rukaiya Admin</strong>:</span>
                  <span className="font-mono text-indigo-300">rukaiya.admin@gmail.com / adminpassword123</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password OTP Verification Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 relative">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {forgotSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Password Reset Successful!</h3>
                <p className="text-xs text-slate-400">
                  You can now sign in with your new password on the portal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Forgot Password / OTP Recovery</h3>
                    <p className="text-xs text-slate-400">Step {forgotStep} of 3</p>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/40 rounded-xl text-rose-400 text-xs">
                    {errorMsg}
                  </div>
                )}

                {forgotStep === 1 && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-300">
                      Enter your registered Email or Consumer ID. We will generate a secure OTP code.
                    </p>
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. rajesh.sharma@gmail.com / rukaiya.admin@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
                    >
                      Send 6-Digit OTP Code
                    </button>
                  </div>
                )}

                {forgotStep === 2 && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-300">
                      Enter the 6-digit verification code sent to your email / registered phone:
                    </p>

                    {/* High-Visibility Simulated OTP Box */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-teal-500/40 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Generated OTP Code:</span>
                      <button
                        type="button"
                        onClick={() => setOtpInput(generatedOtp)}
                        className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/50 rounded-lg text-sm font-mono font-bold hover:bg-teal-500/30 transition"
                      >
                        {generatedOtp} (Click to Autofill)
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 6-digit OTP (839210)"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-teal-400"
                    />

                    <button
                      type="submit"
                      className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
                    >
                      Verify OTP Code
                    </button>
                  </div>
                )}

                {forgotStep === 3 && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-300">
                      OTP Verified ✅ Please enter your new password:
                    </p>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new secure password"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
                    >
                      Confirm New Password & Sign In
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
