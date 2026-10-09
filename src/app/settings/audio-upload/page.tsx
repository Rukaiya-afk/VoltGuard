'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Music, Check, Trash2, Play, Square } from 'lucide-react';
import { Header } from '@/components/Header';
import { useVoltStore } from '@/lib/store';
import { audioController } from '@/lib/audioController';

export default function AudioUploadSettingsPage() {
  const { settings, updateSettings } = useVoltStore();
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const savedCustomTone = localStorage.getItem('voltguard_custom_audio_name');
    if (savedCustomTone) {
      setUploadedFileName(savedCustomTone);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('audio') && !file.name.endsWith('.mp3') && !file.name.endsWith('.wav')) {
      alert('Please select a valid .mp3 or .wav audio file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        localStorage.setItem('voltguard_custom_audio', dataUrl);
        localStorage.setItem('voltguard_custom_audio_name', file.name);
        setUploadedFileName(file.name);
        updateSettings({ alarmTone: 'custom', customAudioDataUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomAudio = () => {
    localStorage.removeItem('voltguard_custom_audio');
    localStorage.removeItem('voltguard_custom_audio_name');
    setUploadedFileName('');
    updateSettings({ alarmTone: 'buzzer', customAudioDataUrl: undefined });
  };

  const handleTestCustomAudio = () => {
    if (isPlaying) {
      audioController.stopSound();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const customDataUrl = localStorage.getItem('voltguard_custom_audio') || undefined;
      audioController.previewTone('custom', settings.alarmVolume, customDataUrl);
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    }
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
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 font-mono">Partition 06</div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <Upload className="h-6 w-6 text-emerald-400" />
                <span>Custom Audio Sound Upload</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl backdrop-blur-md">
          <div className="text-xs font-semibold text-slate-300">
            Upload custom MP3 or WAV audio tracks to replace default system siren alarm tones during emergency breaker cutoffs.
          </div>

          <label className="flex flex-col items-center justify-center space-y-3 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 p-8 cursor-pointer hover:border-emerald-500 transition-colors">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <Upload className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="text-center space-y-1">
              <div className="text-sm font-bold text-white">Click to select audio file from your device</div>
              <div className="text-xs text-slate-400 font-mono">Supported formats: .MP3, .WAV (Max recommended 5MB)</div>
            </div>
            <input
              type="file"
              accept="audio/mp3,audio/wav"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {uploadedFileName && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                    <Music className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-mono">{uploadedFileName}</div>
                    <div className="text-[10px] text-teal-400 font-bold">Currently Configured Alarm Sound</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveCustomAudio}
                  className="flex items-center space-x-1.5 rounded-xl border border-rose-500/40 bg-rose-950/40 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-900/50 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove Audio</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleTestCustomAudio}
                className={`w-full flex items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Square className="h-4 w-4 fill-slate-950" />
                    <span>Stop Playback Test</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    <span>Test Playback of Uploaded Audio</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
