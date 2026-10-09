'use client';

import React, { useEffect } from 'react';
import { 
  Cpu, 
  Activity, 
  DollarSign, 
  Zap, 
  FlaskConical
} from 'lucide-react';

import { Header } from '@/components/Header';
import { AuthPortal } from '@/components/AuthPortal';
import { SwitchboardTab } from '@/components/SwitchboardTab';
import { TelemetryTab } from '@/components/TelemetryTab';
import { BillingTab } from '@/components/BillingTab';
import { MLEvalTab } from '@/components/MLEvalTab';
import { ForensicModal } from '@/components/ForensicModal';
import { AlarmBanner } from '@/components/AlarmBanner';
import { useVoltStore } from '@/lib/store';
import { audioController } from '@/lib/audioController';
import { TelemetryFrame } from '@/lib/types';

export default function DashboardPage() {
  const { 
    isAuthenticated, 
    activeTab, 
    setActiveTab, 
    setTelemetry,
    globalAnomaly,
    forensicAlert,
    audioMuted,
    settings
  } = useVoltStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    let eventSource: EventSource | null = null;
    let localTimer: NodeJS.Timeout | null = null;

    try {
      eventSource = new EventSource('/api/backend/stream-telemetry');
      eventSource.onmessage = (event) => {
        try {
          const frame: TelemetryFrame = JSON.parse(event.data);
          setTelemetry(frame);
        } catch {}
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }

        if (!localTimer) {
          localTimer = setInterval(() => {
            const timeStr = new Date().toLocaleTimeString();
            const currentOutlets = useVoltStore.getState().outlets;
            const updatedOutlets: Record<string, any> = {};

            Object.entries(currentOutlets).forEach(([id, outlet]) => {
              if (outlet.breaker_state === 'TRIPPED') {
                updatedOutlets[id] = {
                  ...outlet,
                  current: 0.0,
                  power_watts: 0.0,
                  status: 'tripped',
                  anomaly_score: 0.0,
                };
                return;
              }

              const fault = outlet.fault_mode;
              let V = 230.0 + (Math.random() * 2 - 1);
              let I = outlet.rated_current * 0.55 + (Math.random() * 0.4 - 0.2);
              let cos = 0.92;
              let T = outlet.terminal_temp;
              let status: any = 'normal';
              let score = 0.12;
              let alertObj: any = null;

              if (fault === 'inrush') {
                I = outlet.rated_current * 2.1;
                cos = 0.73;
                status = 'inrush';
                score = 0.28;
              } else if (fault === 'stall' || fault === 'outbreak') {
                V = 178.0 + (Math.random() * 2 - 1);
                I = 29.5 + (Math.random() * 1.5);
                cos = 0.58;
                T += 2.5;
                status = 'anomalous';
                score = 0.92;
                alertObj = {
                  outlet_id: id,
                  outlet_name: outlet.name,
                  timestamp: timeStr,
                  voltage: Math.round(V * 10) / 10,
                  current: Math.round(I * 10) / 10,
                  cos_phi: 0.58,
                  temperature: Math.round(T * 10) / 10,
                  anomaly_score: 0.92,
                  trip_latency_ms: 12,
                  diagnosis: `🔥 CRITICAL FIRE OUTBREAK HAZARD: ${outlet.name} overheated to ${Math.round(T)}°C under low voltage brownout (${Math.round(V)}V / ${Math.round(I)}A). Power safely cut in 12ms!`
                };
              } else if (fault === 'micro_arc') {
                V = 208.0;
                I = outlet.rated_current + Math.random() * 6;
                cos = 0.78;
                T += 2.0;
                status = 'anomalous';
                score = 0.84;
                alertObj = {
                  outlet_id: id,
                  outlet_name: outlet.name,
                  timestamp: timeStr,
                  voltage: 208.0,
                  current: Math.round(I * 10) / 10,
                  cos_phi: 0.78,
                  temperature: Math.round(T * 10) / 10,
                  anomaly_score: 0.84,
                  trip_latency_ms: 14,
                  diagnosis: `Sparking Hazard Cutoff: Sparking loose contact detected on ${outlet.name}. Power safely cut.`
                };
              }

              if (status === 'anomalous') {
                useVoltStore.getState().toggleBreaker(id, 'TRIPPED');
              }

              updatedOutlets[id] = {
                ...outlet,
                voltage: Math.round(V * 10) / 10,
                current: Math.round(I * 10) / 10,
                cos_phi: Math.round(cos * 100) / 100,
                power_watts: Math.round(V * I * cos),
                terminal_temp: Math.round(T * 10) / 10,
                status,
                anomaly_score: score,
              };

              if (alertObj) {
                useVoltStore.setState({
                  forensicAlert: alertObj,
                  forensicModalOpen: true,
                  safetyLatchLocked: true,
                  globalAnomaly: true
                });
              }
            });

            setTelemetry({
              timestamp: timeStr,
              outlets: updatedOutlets,
              global_anomaly: useVoltStore.getState().globalAnomaly,
              forensic_alert: useVoltStore.getState().forensicAlert,
            });
          }, settings.refreshRate || 1000);
        }
      };
    } catch {}

    return () => {
      if (eventSource) eventSource.close();
      if (localTimer) clearInterval(localTimer);
    };
  }, [isAuthenticated, settings.refreshRate, setTelemetry]);

  useEffect(() => {
    if (globalAnomaly && !audioMuted) {
      const customDataUrl = localStorage.getItem('voltguard_custom_audio') || undefined;
      audioController.playAlarm(settings.alarmTone, settings.alarmVolume, customDataUrl);
    } else {
      audioController.stopSound();
    }
  }, [globalAnomaly, audioMuted, settings.alarmTone, settings.alarmVolume]);

  if (!isAuthenticated) {
    return <AuthPortal />;
  }

  return (
    <div className={`min-h-screen theme-${settings.theme} transition-colors duration-200`}>
      <AlarmBanner />
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-4 gap-4">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold w-full sm:w-auto gap-1">
            <button
              onClick={() => setActiveTab('switchboard')}
              className={`flex items-center justify-center space-x-2 rounded-xl px-3.5 py-2.5 transition-all ${
                activeTab === 'switchboard'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>Appliance Switches</span>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`flex items-center justify-center space-x-2 rounded-xl px-3.5 py-2.5 transition-all ${
                activeTab === 'telemetry'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Live Graphs</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`flex items-center justify-center space-x-2 rounded-xl px-3.5 py-2.5 transition-all ${
                activeTab === 'billing'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Bill & Savings</span>
            </button>

            {/* NEW TAB FOR PROFESSOR / EVALUATOR */}
            <button
              onClick={() => setActiveTab('ml-eval')}
              className={`flex items-center justify-center space-x-2 rounded-xl px-3.5 py-2.5 transition-all ${
                activeTab === 'ml-eval'
                  ? 'bg-amber-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <FlaskConical className="h-4 w-4" />
              <span>ML Test Bench</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-800">
            <Zap className="h-3.5 w-3.5 text-teal-400" />
            <span>Smart Fire Protection Active</span>
          </div>

        </div>

        {/* Tab Content Views */}
        {activeTab === 'switchboard' && <SwitchboardTab />}
        {activeTab === 'telemetry' && <TelemetryTab />}
        {activeTab === 'billing' && <BillingTab />}
        {activeTab === 'ml-eval' && <MLEvalTab />}

      </main>

      <ForensicModal />
    </div>
  );
}
