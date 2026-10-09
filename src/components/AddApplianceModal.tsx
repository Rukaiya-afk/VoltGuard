'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Cpu, 
  Upload, 
  Camera, 
  Zap, 
  Wifi, 
  CheckCircle2, 
  X, 
  Sparkles,
  Search,
  HardDrive
} from 'lucide-react';
import { useVoltStore } from '@/lib/store';
import { OutletData } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddApplianceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addCustomOutlet } = useVoltStore();

  const [name, setName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [location, setLocation] = useState('Living Room');
  const [ratedCurrent, setRatedCurrent] = useState(10.0);
  const [tripCurrent, setTripCurrent] = useState(16.0);
  const [powerWatts, setPowerWatts] = useState(1200);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // IoT Discovery State
  const [isScanningIoT, setIsScanningIoT] = useState(false);
  const [iotDiscovered, setIotDiscovered] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoDiscoverIoT = () => {
    setIsScanningIoT(true);
    setIotDiscovered(false);

    setTimeout(() => {
      setIsScanningIoT(false);
      setIotDiscovered(true);
      setName('Smart Induction Cooktop');
      setModelNumber('Philips HD4938 (2100W Smart Plug)');
      setLocation('Kitchen');
      setRatedCurrent(9.5);
      setTripCurrent(15.0);
      setPowerWatts(2100);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomOutlet({
      name,
      modelNumber: modelNumber || 'Custom Appliance',
      location,
      rated_current: Number(ratedCurrent),
      trip_current: Number(tripCurrent),
      power_watts: Number(powerWatts),
      voltage: 230.0,
      current: Number(ratedCurrent) * 0.6,
      cos_phi: 0.92,
      terminal_temp: 34.0,
      imageUrl: imagePreview || undefined,
      iotStatus: 'CONNECTED',
      isUserCreated: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700/30 text-teal-300 border border-teal-500/40">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Add New Appliance / Circuit</h2>
            <p className="text-xs text-slate-400">Register specs, photos, or auto-detect via Smart IoT</p>
          </div>
        </div>

        {/* Smart IoT Auto-Discovery Banner */}
        <div className="rounded-xl border border-teal-500/40 bg-teal-950/30 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-300">
              <Wifi className="h-4 w-4 animate-pulse text-teal-400" />
              <span>Smart IoT Device Auto-Detection</span>
            </div>
            {iotDiscovered && (
              <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Detected!</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300">
            Scanning local Matter/Zigbee Mesh & Smart Plugs will automatically populate ratings and live readings.
          </p>

          <button
            type="button"
            onClick={handleAutoDiscoverIoT}
            disabled={isScanningIoT}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-teal-700/80 py-2.5 text-xs font-bold text-white hover:bg-teal-600 transition-all border border-teal-500/40 shadow-sm"
          >
            {isScanningIoT ? (
              <>
                <Search className="h-4 w-4 animate-spin text-teal-300" />
                <span>Scanning Smart Plugs & Local WiFi...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-teal-300" />
                <span>Auto-Detect Appliance via IoT</span>
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Appliance Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Microwave Oven"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Model Name / Specs</label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="e.g. IFB 25L Convection"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Room Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kitchen"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Operating Power (Watts)</label>
              <input
                type="number"
                value={powerWatts}
                onChange={(e) => setPowerWatts(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Rated Current (A)</label>
              <input
                type="number"
                step="0.5"
                value={ratedCurrent}
                onChange={(e) => setRatedCurrent(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Max Safety Trip Limit (A)</label>
              <input
                type="number"
                step="0.5"
                value={tripCurrent}
                onChange={(e) => setTripCurrent(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          {/* Image Upload / Camera Capture */}
          <div>
            <label className="block text-xs text-slate-300 mb-1">Appliance Photo (Upload or Camera)</label>
            <div className="flex items-center space-x-3">
              <label className="flex-1 flex items-center justify-center space-x-2 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-3 cursor-pointer hover:border-teal-500 transition-colors">
                <Camera className="h-4 w-4 text-teal-400" />
                <span className="text-xs text-slate-300">Take Photo or Pick Image...</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="h-12 w-12 rounded-xl border border-slate-700 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-teal-700 py-3 text-xs font-bold text-white shadow-md hover:bg-teal-600 transition-all flex items-center justify-center space-x-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Save Appliance to Switchboard</span>
          </button>
        </form>

      </div>
    </div>
  );
};
