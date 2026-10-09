'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Volume2, Play, Square, Smartphone, Music, Check, VolumeX } from 'lucide-react';
import { Header } from '@/components/Header';
import { useVoltStore } from '@/lib/store';
import { audioController } from '@/lib/audioController';
import { AlarmTone, VibrationPattern } from '@/lib/types';

export default function AlertsSettingsPage() {
  const { settings, updateSettings } = useVoltStore();
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [vibrationTestMsg, setVibrationTestMsg] = useState('');

  const handleToneChange = (alarmTone: AlarmTone) => {
    updateSettings({ alarmTone });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ alarmVolume: parseFloat(e.target.value) });
  };

  const handleVibrationPatternChange = (vibrationPattern: VibrationPattern) => {
    updateSettings({ vibrationPattern });
  };

  const handleVibrationIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ vibrationIntensity: parseFloat(e.target.value) });
  };

  const handlePreviewSound = () => {
    if (isPlayingPreview) {
      audioController.stopSound();
      setIsPlayingPreview(false);
    } else {
      setIsPlayingPreview(true);
      const customDataUrl = typeof window !== 'undefined' ? localStorage.getItem('voltguard_custom_audio') || undefined : undefined;
      audioController.previewTone(settings.alarmTone, settings.alarmVolume, customDataUrl);
      setTimeout(() => {
        setIsPlayingPreview(false);
      }, 2600);
    }
  };

  const handleTestVibration = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      const duration = Math.round(settings.vibrationIntensity * 400);
      let patternArr: number[] = [duration];
      if (settings.vibrationPattern === 'pulse') patternArr = [duration, 100, duration, 100, duration];
      else if (settings.vibrationPattern === 'sos') patternArr = [100, 50, 100, 50, 100, 200, 300, 100, 300];
      else if (settings.vibrationPattern === 'continuous') patternArr = [duration * 2];
      else if (settings.vibrationPattern === 'subtle') patternArr = [80, 80, 80];

      navigator.vibrate(patternArr);
      setVibrationTestMsg(`Device vibrated (${settings.vibrationPattern} pattern, ${Math.round(settings.vibrationIntensity * 100)}% intensity)`);
    } else {
      setVibrationTestMsg('Haptic Vibration API triggered (Simulated for desktop browser)');
    }
    setTimeout(() => setVibrationTestMsg(''), 3000);
  };

  const tones: Array<{ id: AlarmTone; name: string; desc: string }> = [
    { id: 'buzzer', name: 'Industrial Buzzer', desc: 'High-frequency emergency buzzer waveform' },
    { id: 'siren', name: 'Pulse Siren', desc: 'Alternating dual-tone warning siren' },
    { id: 'chime', name: 'Soft Chime Warning', desc: 'Gentle multi-harmonic notice bell' },
    { id: 'synth', name: 'Custom Synthesizer', desc: 'Modulated analog synthesizer sweep' },
  ];

  const vibrationPatterns: Array<{ id: VibrationPattern; name: string; desc: string }> = [
    { id: 'pulse', name: 'Triple Pulse', desc: '3 sharp haptic pulses' },
    { id: 'sos', name: 'S.O.S Emergency', desc: 'Distinctive Morse code vibration' },
    { id: 'continuous', name: 'Continuous Heavy', desc: 'Sustained warning vibration' },
    { id: 'subtle', name: 'Subtle Soft', desc: 'Gentle double tap' },
  ];

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
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 font-mono">Partition 05</div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <Bell className="h-6 w-6 text-rose-400" />
                <span>Alert Ringtones, Haptics & Vibration</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Alarm Ringtones */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
              <Music className="h-4 w-4 text-rose-400" />
              <span>Emergency Alarm Ringtones</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tones.map((t) => {
                const isSelected = settings.alarmTone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleToneChange(t.id)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/40 shadow-lg'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-[11px] text-slate-400">{t.desc}</div>
                    </div>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-slate-950 font-bold shrink-0 ml-2">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Master Volume Controls */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 font-mono">
              <span className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-cyan-400" />
                <span>Alarm Master Volume</span>
              </span>
              <span className="text-cyan-400 text-base">{Math.round(settings.alarmVolume * 100)}%</span>
            </div>

            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={settings.alarmVolume}
              onChange={handleVolumeChange}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-950 rounded-lg border border-slate-800"
            />

            <button
              type="button"
              onClick={handlePreviewSound}
              className={`w-full flex items-center justify-center space-x-2 rounded-xl py-3 text-xs font-bold transition-all ${
                isPlayingPreview
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-teal-700 text-white hover:bg-teal-600 shadow-md'
              }`}
            >
              {isPlayingPreview ? (
                <>
                  <Square className="h-4 w-4 fill-slate-950" />
                  <span>Stop Sound Preview</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Test Current Alarm Sound</span>
                </>
              )}
            </button>
          </div>

          {/* Section 3: Vibration & Haptic Feedback Controls */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-purple-400" />
                <span>Haptic Feedback & Vibration Engine</span>
              </div>

              <button
                type="button"
                onClick={() => updateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.hapticsEnabled ? 'bg-purple-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {settings.hapticsEnabled && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Vibration Pattern</label>
                  <div className="grid grid-cols-2 gap-3">
                    {vibrationPatterns.map((vp) => (
                      <button
                        key={vp.id}
                        type="button"
                        onClick={() => handleVibrationPatternChange(vp.id)}
                        className={`rounded-xl border p-3 text-left text-xs font-bold transition-all ${
                          settings.vibrationPattern === vp.id
                            ? 'border-purple-500 bg-purple-500/10 text-purple-300 ring-2 ring-purple-500/40'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div>{vp.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{vp.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Vibration Intensity</span>
                    <span className="text-purple-400 font-mono">{Math.round(settings.vibrationIntensity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.1"
                    value={settings.vibrationIntensity}
                    onChange={handleVibrationIntensityChange}
                    className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-950 rounded-lg border border-slate-800"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleTestVibration}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl border border-purple-500/40 bg-purple-950/40 py-2.5 text-xs font-bold text-purple-300 hover:bg-purple-900/50 transition-all shadow-sm"
                >
                  <Smartphone className="h-4 w-4 text-purple-400" />
                  <span>Test Vibration Impulse</span>
                </button>

                {vibrationTestMsg && (
                  <div className="text-xs text-purple-300 bg-purple-950/80 border border-purple-800 rounded-xl p-2.5 text-center font-semibold font-mono">
                    {vibrationTestMsg}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 4: Audio FX Toggles */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Sound Effect Toggles</div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                <div>
                  <div className="text-xs font-bold text-slate-200">Button Click Sound Effects</div>
                  <div className="text-[10px] text-slate-400">Play subtle auditory click when interacting with UI buttons</div>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ buttonClickSoundEnabled: !settings.buttonClickSoundEnabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.buttonClickSoundEnabled ? 'bg-teal-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.buttonClickSoundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                <div>
                  <div className="text-xs font-bold text-slate-200">Breaker Trip Sound Sound Effect</div>
                  <div className="text-[10px] text-slate-400">Synthesize mechanical breaker trip sound on safety cutoffs</div>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ breakerTripSoundEnabled: !settings.breakerTripSoundEnabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.breakerTripSoundEnabled ? 'bg-teal-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.breakerTripSoundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
