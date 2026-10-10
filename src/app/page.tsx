'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { AuthPortal } from '@/components/AuthPortal';
import { UserPortal } from '@/components/UserPortal';
import { AdminPortal } from '@/components/AdminPortal';
import { ElectricianPortal } from '@/components/ElectricianPortal';
import { ForensicModal } from '@/components/ForensicModal';
import { AlarmBanner } from '@/components/AlarmBanner';
import { EmergencyCallModal } from '@/components/EmergencyCallModal';
import { RatingReviewModal } from '@/components/RatingReviewModal';
import { useVoltStore } from '@/lib/store';
import { audioController } from '@/lib/audioController';
import { TelemetryFrame } from '@/lib/types';

export default function DashboardPage() {
  const { 
    isAuthenticated, 
    currentUserRole,
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
                cos = 0.72;
                status = 'inrush';
                score = 0.28;
              } else if (fault === 'stall' || fault === 'outbreak') {
                V = 178.0 + (Math.random() * 2 - 1);
                I = 29.5 + (Math.random() * 1.5);
                cos = 0.58;
                T = Math.min(85.0, T + 3.0);
                status = 'anomalous';
                score = 0.94;
                alertObj = {
                  outlet_id: id,
                  outlet_name: outlet.name,
                  timestamp: timeStr,
                  voltage: Math.round(V * 10) / 10,
                  current: Math.round(I * 10) / 10,
                  cos_phi: 0.58,
                  temperature: Math.round(T * 10) / 10,
                  anomaly_score: 0.94,
                  trip_latency_ms: 12,
                  diagnosis: `🔥 CRITICAL FIRE OUTBREAK HAZARD: ${outlet.name} overheated to ${Math.round(T)}°C under 178V low-voltage stall. Power safely cut in 12ms!`
                };
              } else if (fault === 'micro_arc') {
                V = 208.0;
                I = outlet.rated_current + Math.random() * 6;
                cos = 0.78;
                T = Math.min(80.0, T + 2.0);
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
                  diagnosis: `Sparking Hazard Cutoff: Loose contact micro-arcing on ${outlet.name}. Power safely cut.`
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
                  globalAnomaly: true,
                  forensicSnapshot: Object.values(updatedOutlets)
                });

                if (useVoltStore.getState().settings.autoFireEmergencyCall) {
                  useVoltStore.getState().triggerFireEmergencyProtocol(
                    outlet.name,
                    alertObj.diagnosis
                  );
                }
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
      const customDataUrl = typeof window !== 'undefined' ? localStorage.getItem('voltguard_custom_audio') || undefined : undefined;
      audioController.playAlarm(settings.alarmTone, settings.alarmVolume, customDataUrl);
    } else {
      audioController.stopSound();
    }
  }, [globalAnomaly, audioMuted, settings.alarmTone, settings.alarmVolume]);

  if (!isAuthenticated) {
    return <AuthPortal />;
  }

  return (
    <div className={`min-h-screen theme-${settings.theme} ${settings.seniorMode ? 'senior-mode' : ''} transition-colors duration-200`}>
      <AlarmBanner />
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {currentUserRole === 'user' && <UserPortal />}
        {currentUserRole === 'electrician' && <ElectricianPortal />}
        {currentUserRole === 'admin' && <AdminPortal />}
      </main>

      <EmergencyCallModal />
      <RatingReviewModal />
      <ForensicModal />
    </div>
  );
}
