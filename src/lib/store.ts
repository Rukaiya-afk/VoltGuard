import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  OutletData, 
  TelemetryFrame, 
  ForensicAlert, 
  UserSettings, 
  UserProfile, 
  FaultMode, 
  BreakerState,
  SavedCard
} from './types';

interface VoltGuardState {
  isAuthenticated: boolean;
  isGuest: boolean;
  isHighRiskUser: boolean;
  userProfile: UserProfile;
  login: (consumerNumber: string, email: string) => void;
  createAccount: (consumerNumber: string, email: string) => void;
  updateUserProfile: (newProfile: Partial<UserProfile>) => void;
  loginNormalUser: () => void;
  loginSpikedUser: () => void;
  logout: () => void;

  onboardingModalOpen: boolean;
  setOnboardingModalOpen: (open: boolean) => void;
  addCustomOutlet: (outlet: Partial<OutletData>) => void;
  addSavedCard: (card: Omit<SavedCard, 'id'>) => void;
  removeSavedCard: (id: string) => void;

  activeTab: 'switchboard' | 'telemetry' | 'billing' | 'ml-eval';
  setActiveTab: (tab: 'switchboard' | 'telemetry' | 'billing' | 'ml-eval') => void;

  outlets: Record<string, OutletData>;
  history: Array<{
    timestamp: string;
    V_master: number;
    I_master: number;
    T_master: number;
    Score_master: number;
    V_living: number;
    I_living: number;
    T_living: number;
    Score_living: number;
  }>;
  
  globalAnomaly: boolean;
  forensicAlert: ForensicAlert | null;
  forensicSnapshot: OutletData[] | null;
  forensicModalOpen: boolean;
  safetyLatchLocked: boolean;
  audioMuted: boolean;

  settings: UserSettings;

  setTelemetry: (frame: TelemetryFrame) => void;
  injectFault: (outletId: string, faultMode: FaultMode) => void;
  toggleBreaker: (outletId: string, state: BreakerState) => void;
  globalSafetyReset: () => void;
  acknowledgeSafetyLatch: () => void;
  setForensicModalOpen: (open: boolean) => void;
  toggleAudioMute: () => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const defaultOutlets: Record<string, OutletData> = {
  master_ac: {
    id: 'master_ac',
    name: 'Master Bedroom AC',
    modelNumber: 'Daikin FTKF50U (1.5T Inverter)',
    location: 'Master Bedroom',
    rated_current: 12.5,
    trip_current: 20.0,
    voltage: 230.0,
    current: 6.8,
    cos_phi: 0.92,
    power_watts: 1444.0,
    terminal_temp: 38.5,
    status: 'normal',
    breaker_state: 'CLOSED',
    fault_mode: 'none',
    anomaly_score: 0.12,
    iotStatus: 'CONNECTED',
  },
  living_ac: {
    id: 'living_ac',
    name: 'Living Room AC',
    modelNumber: 'LG DualCool 2.0T',
    location: 'Living Room',
    rated_current: 16.0,
    trip_current: 25.0,
    voltage: 228.0,
    current: 9.2,
    cos_phi: 0.90,
    power_watts: 1887.0,
    terminal_temp: 42.0,
    status: 'normal',
    breaker_state: 'CLOSED',
    fault_mode: 'none',
    anomaly_score: 0.15,
    iotStatus: 'CONNECTED',
  },
  kitchen_geyser: {
    id: 'kitchen_geyser',
    name: 'Kitchen Water Heater',
    modelNumber: 'AO Smith HSE-SHS-025',
    location: 'Kitchen',
    rated_current: 15.0,
    trip_current: 22.0,
    voltage: 231.0,
    current: 11.4,
    cos_phi: 0.98,
    power_watts: 2580.0,
    terminal_temp: 45.2,
    status: 'normal',
    breaker_state: 'CLOSED',
    fault_mode: 'none',
    anomaly_score: 0.10,
    iotStatus: 'CONNECTED',
  },
  refrigerator: {
    id: 'refrigerator',
    name: 'Main Refrigerator',
    modelNumber: 'Samsung Frost Free 500L',
    location: 'Kitchen',
    rated_current: 4.0,
    trip_current: 8.0,
    voltage: 230.5,
    current: 1.2,
    cos_phi: 0.85,
    power_watts: 235.0,
    terminal_temp: 30.1,
    status: 'normal',
    breaker_state: 'CLOSED',
    fault_mode: 'none',
    anomaly_score: 0.08,
    iotStatus: 'CONNECTED',
  },
  washing_machine: {
    id: 'washing_machine',
    name: 'Washing Machine & Dryer',
    modelNumber: 'Bosch Series 6 Front Load',
    location: 'Utility Area',
    rated_current: 10.0,
    trip_current: 16.0,
    voltage: 229.0,
    current: 4.5,
    cos_phi: 0.88,
    power_watts: 908.0,
    terminal_temp: 34.0,
    status: 'normal',
    breaker_state: 'CLOSED',
    fault_mode: 'none',
    anomaly_score: 0.11,
    iotStatus: 'CONNECTED',
  },
  ev_charger: {
    id: 'ev_charger',
    name: 'EV Fast Charger (Heavy Load)',
    modelNumber: 'ABB Terra AC Wallbox 7.4kW',
    location: 'Garage',
    rated_current: 20.0,
    trip_current: 30.0,
    voltage: 225.0,
    current: 18.5,
    cos_phi: 0.94,
    power_watts: 3912.0,
    terminal_temp: 52.0,
    status: 'normal',
    breaker_state: 'CLOSED',
    fault_mode: 'none',
    anomaly_score: 0.22,
    hazard_warning: 'High power circuit — monitored continuously',
    iotStatus: 'CONNECTED',
  }
};

const defaultProfile: UserProfile = {
  consumerNumber: 'MH-MUM-8921-X',
  name: 'Rajesh Sharma',
  email: 'rajesh.sharma@voltguard.io',
  accountNumber: 'ACC-2026-9941',
  billingTier: 'Residential LT-1 (Tier 3)',
  ratePerKwh: 8.50,
  isHighRisk: false,
};

const defaultSettings: UserSettings = {
  theme: 'oled',
  refreshRate: 1000,
  anomalySensitivity: 0.75,
  alarmTone: 'buzzer',
  alarmVolume: 0.8,
  
  // Haptics & Sound FX
  hapticsEnabled: true,
  vibrationPattern: 'pulse',
  vibrationIntensity: 0.8,
  buttonClickSoundEnabled: true,
  breakerTripSoundEnabled: true,

  // Automation Toggles
  autoCutoffEnabled: true,
  inrushMaskingEnabled: true,
  sirenEnabled: true,
  autoStreamEnabled: true,
  emailAlertsEnabled: true,

  // Privacy & Security
  twoFactorEnabled: false,
  telemetryAnonymized: true,
  sessionTimeoutMinutes: 30,

  // Payment Cards
  autoPayEnabled: true,
  savedCards: [
    {
      id: 'card_1',
      cardHolder: 'Rajesh Sharma',
      cardNumberMasked: '•••• •••• •••• 4921',
      last4: '4921',
      expDate: '08/28',
      brand: 'visa',
      isDefault: true,
    },
    {
      id: 'card_2',
      cardHolder: 'Rajesh Sharma',
      cardNumberMasked: '•••• •••• •••• 8812',
      last4: '8812',
      expDate: '11/27',
      brand: 'mastercard',
      isDefault: false,
    }
  ]
};

export const useVoltStore = create<VoltGuardState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isGuest: false,
      isHighRiskUser: false,
      userProfile: defaultProfile,
      onboardingModalOpen: false,

  setOnboardingModalOpen: (open: boolean) => set({ onboardingModalOpen: open }),

  updateUserProfile: (newProfile: Partial<UserProfile>) => {
    set((state) => ({
      userProfile: { ...state.userProfile, ...newProfile }
    }));
  },

  login: (consumerNumber: string, email: string) => {
    if (consumerNumber.includes('SPIKE') || consumerNumber.includes('HAZARD')) {
      get().loginSpikedUser();
      return;
    }
    set({
      isAuthenticated: true,
      isGuest: false,
      isHighRiskUser: false,
      userProfile: {
        ...defaultProfile,
        consumerNumber: consumerNumber || defaultProfile.consumerNumber,
        email: email || defaultProfile.email,
      }
    });
  },

  createAccount: (consumerNumber: string, email: string) => {
    set({
      isAuthenticated: true,
      isGuest: false,
      isHighRiskUser: false,
      onboardingModalOpen: true,
      userProfile: {
        consumerNumber: consumerNumber || 'MH-NEW-2026-X',
        name: email.split('@')[0] || 'New Consumer',
        email: email || 'new.user@voltguard.io',
        accountNumber: `ACC-${Math.floor(1000 + Math.random() * 9000)}`,
        billingTier: 'Residential LT-1 (Tier 2)',
        ratePerKwh: 8.50,
        isHighRisk: false,
      }
    });
  },

  addCustomOutlet: (custom: Partial<OutletData>) => {
    const outlets = { ...get().outlets };
    const id = custom.id || `custom_${Date.now()}`;

    outlets[id] = {
      id,
      name: custom.name || 'Custom Appliance',
      modelNumber: custom.modelNumber || 'Smart IoT Device',
      location: custom.location || 'Main Residence',
      imageUrl: custom.imageUrl || undefined,
      rated_current: custom.rated_current || 10.0,
      trip_current: custom.trip_current || 16.0,
      voltage: custom.voltage || 230.0,
      current: custom.current || 4.2,
      cos_phi: custom.cos_phi || 0.92,
      power_watts: custom.power_watts || Math.round(230 * 4.2 * 0.92),
      terminal_temp: custom.terminal_temp || 33.5,
      status: 'normal',
      breaker_state: 'CLOSED',
      fault_mode: 'none',
      anomaly_score: 0.09,
      iotStatus: 'CONNECTED',
      isUserCreated: true,
    };

    set({ outlets, onboardingModalOpen: false });
  },

  addSavedCard: (cardData) => {
    const newCard: SavedCard = {
      ...cardData,
      id: `card_${Date.now()}`,
    };
    set((state) => ({
      settings: {
        ...state.settings,
        savedCards: [...state.settings.savedCards, newCard]
      }
    }));
  },

  removeSavedCard: (id: string) => {
    set((state) => ({
      settings: {
        ...state.settings,
        savedCards: state.settings.savedCards.filter((c) => c.id !== id)
      }
    }));
  },

  loginNormalUser: () => {
    const resetOutlets = { ...defaultOutlets };
    Object.keys(resetOutlets).forEach((key) => {
      resetOutlets[key].status = 'normal';
      resetOutlets[key].breaker_state = 'CLOSED';
      resetOutlets[key].fault_mode = 'none';
    });

    set({
      isAuthenticated: true,
      isGuest: false,
      isHighRiskUser: false,
      userProfile: defaultProfile,
      outlets: resetOutlets,
      globalAnomaly: false,
      forensicAlert: null,
      forensicModalOpen: false,
      safetyLatchLocked: false
    });
  },

  loginSpikedUser: () => {
    const outlets = { ...defaultOutlets };
    outlets.ev_charger.status = 'anomalous';
    outlets.ev_charger.breaker_state = 'TRIPPED';
    outlets.ev_charger.fault_mode = 'outbreak';
    outlets.ev_charger.terminal_temp = 74.5;
    outlets.ev_charger.voltage = 178.0;
    outlets.ev_charger.anomaly_score = 0.94;

    const highRiskAlert: ForensicAlert = {
      outlet_id: 'ev_charger',
      outlet_name: 'EV Fast Charger (Heavy Load)',
      timestamp: new Date().toLocaleTimeString(),
      voltage: 178.0,
      current: 29.8,
      cos_phi: 0.58,
      temperature: 74.5,
      anomaly_score: 0.94,
      trip_latency_ms: 12,
      diagnosis: '🔥 CRITICAL FIRE RISK: Plug temperature hit 74.5°C under 178V low-voltage stall (29.8A). Safety breaker instantly TRIPPED to prevent fire!'
    };

    set({
      isAuthenticated: true,
      isGuest: false,
      isHighRiskUser: true,
      userProfile: {
        consumerNumber: 'MH-MUM-SPIKE-44',
        name: 'Priya Patel (Spiked / High Risk)',
        email: 'priya.patel@voltguard.io',
        accountNumber: 'ACC-2026-SPIKE-44',
        billingTier: 'Residential LT-1 (High Demand)',
        ratePerKwh: 8.50,
        isHighRisk: true,
      },
      outlets,
      globalAnomaly: true,
      forensicAlert: highRiskAlert,
      forensicModalOpen: true,
      safetyLatchLocked: true,
    });
  },

  logout: () => {
    set({ isAuthenticated: false, isGuest: false, isHighRiskUser: false, onboardingModalOpen: false });
  },

  activeTab: 'switchboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  outlets: defaultOutlets,
  history: [],

  globalAnomaly: false,
  forensicAlert: null,
  forensicSnapshot: null,
  forensicModalOpen: false,
  safetyLatchLocked: false,
  audioMuted: false,

  settings: defaultSettings,

  setTelemetry: (frame: TelemetryFrame) => {
    const currentOutlets = get().outlets;
    const mergedOutlets = { ...currentOutlets };

    Object.entries(frame.outlets).forEach(([id, data]) => {
      mergedOutlets[id] = { ...data };
    });

    const timeStr = frame.timestamp || new Date().toLocaleTimeString();

    const masterData = mergedOutlets.master_ac || defaultOutlets.master_ac;
    const livingData = mergedOutlets.living_ac || defaultOutlets.living_ac;

    const newHistoryPoint = {
      timestamp: timeStr,
      V_master: masterData.voltage,
      I_master: masterData.current,
      T_master: masterData.terminal_temp,
      Score_master: masterData.anomaly_score,
      V_living: livingData.voltage,
      I_living: livingData.current,
      T_living: livingData.terminal_temp,
      Score_living: livingData.anomaly_score,
    };

    const newHistory = [...get().history, newHistoryPoint].slice(-35);

    let forensicAlert = get().forensicAlert;
    let forensicModalOpen = get().forensicModalOpen;
    let safetyLatchLocked = get().safetyLatchLocked;
    let forensicSnapshot = get().forensicSnapshot;

    if (frame.forensic_alert) {
      forensicAlert = frame.forensic_alert;
      forensicModalOpen = true;
      safetyLatchLocked = true;
      forensicSnapshot = Object.values(mergedOutlets);
    }

    set({
      outlets: mergedOutlets,
      history: newHistory,
      globalAnomaly: frame.global_anomaly || Boolean(forensicAlert && safetyLatchLocked),
      forensicAlert,
      forensicModalOpen,
      safetyLatchLocked,
      forensicSnapshot
    });
  },

  injectFault: (outletId: string, faultMode: FaultMode) => {
    const outlets = { ...get().outlets };
    const outlet = outlets[outletId];
    if (!outlet) return;

    outlet.fault_mode = faultMode;

    if (faultMode === 'stall') {
      outlet.status = 'anomalous';
      outlet.voltage = 182.0;
      outlet.current = 26.4;
      outlet.cos_phi = 0.62;
      outlet.terminal_temp = 68.4;
      outlet.anomaly_score = 0.88;
      outlet.breaker_state = 'TRIPPED';

      const alert: ForensicAlert = {
        outlet_id: outletId,
        outlet_name: outlet.name,
        timestamp: new Date().toLocaleTimeString(),
        voltage: 182.0,
        current: 26.4,
        cos_phi: 0.62,
        temperature: 68.4,
        anomaly_score: 0.88,
        trip_latency_ms: 18,
        diagnosis: `Automatic Safety Cutoff: Motor locked under 182V brownout; 26.4A overcurrent sustained. Power cut in 18ms!`
      };

      set({ 
        outlets, 
        globalAnomaly: true, 
        forensicAlert: alert, 
        forensicModalOpen: true, 
        safetyLatchLocked: true 
      });
    } else if (faultMode === 'micro_arc') {
      outlet.status = 'anomalous';
      outlet.voltage = 206.0;
      outlet.current = outlet.rated_current + 8.5;
      outlet.cos_phi = 0.74;
      outlet.terminal_temp = 62.0;
      outlet.anomaly_score = 0.82;
      outlet.breaker_state = 'TRIPPED';

      const alert: ForensicAlert = {
        outlet_id: outletId,
        outlet_name: outlet.name,
        timestamp: new Date().toLocaleTimeString(),
        voltage: 206.0,
        current: outlet.current,
        cos_phi: 0.74,
        temperature: 62.0,
        anomaly_score: 0.82,
        trip_latency_ms: 14,
        diagnosis: `Sparking Hazard Cutoff: Sparking loose contact detected on ${outlet.name}. Power safely disconnected.`
      };

      set({ 
        outlets, 
        globalAnomaly: true, 
        forensicAlert: alert, 
        forensicModalOpen: true, 
        safetyLatchLocked: true 
      });
    } else if (faultMode === 'outbreak') {
      outlet.status = 'anomalous';
      outlet.voltage = 175.0;
      outlet.current = 31.2;
      outlet.cos_phi = 0.55;
      outlet.terminal_temp = 76.8;
      outlet.anomaly_score = 0.96;
      outlet.breaker_state = 'TRIPPED';

      const alert: ForensicAlert = {
        outlet_id: outletId,
        outlet_name: outlet.name,
        timestamp: new Date().toLocaleTimeString(),
        voltage: 175.0,
        current: 31.2,
        cos_phi: 0.55,
        temperature: 76.8,
        anomaly_score: 0.96,
        trip_latency_ms: 10,
        diagnosis: `🔥 CRITICAL FIRE OUTBREAK HAZARD: Plug temp reached 76.8°C under 31.2A extreme overload! Breaker instantly TRIPPED!`
      };

      set({ 
        outlets, 
        globalAnomaly: true, 
        forensicAlert: alert, 
        forensicModalOpen: true, 
        safetyLatchLocked: true 
      });
    } else if (faultMode === 'inrush') {
      outlet.status = 'inrush';
      outlet.current = outlet.rated_current * 2.2;
      outlet.cos_phi = 0.72;
      outlet.anomaly_score = 0.28;
      set({ outlets });
    } else {
      outlet.status = 'normal';
      outlet.fault_mode = 'none';
      outlet.anomaly_score = 0.12;
      set({ outlets });
    }

    fetch('/api/backend/inject-fault', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outlet_id: outletId, fault_mode: faultMode }),
    }).catch(() => {});
  },

  toggleBreaker: (outletId: string, state: BreakerState) => {
    const outlets = { ...get().outlets };
    if (outlets[outletId]) {
      outlets[outletId].breaker_state = state;
      if (state === 'CLOSED') {
        outlets[outletId].fault_mode = 'none';
        outlets[outletId].status = 'normal';
      } else {
        outlets[outletId].current = 0;
        outlets[outletId].power_watts = 0;
        outlets[outletId].status = 'tripped';
      }
      set({ outlets });

      fetch('/api/backend/trip-breaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outlet_id: outletId, state }),
      }).catch(() => {});
    }
  },

  globalSafetyReset: () => {
    const outlets = { ...get().outlets };
    Object.keys(outlets).forEach((id) => {
      outlets[id].breaker_state = 'CLOSED';
      outlets[id].fault_mode = 'none';
      outlets[id].status = 'normal';
      outlets[id].anomaly_score = 0.1;
    });

    set({
      outlets,
      globalAnomaly: false,
      forensicAlert: null,
      forensicModalOpen: false,
      safetyLatchLocked: false,
    });
  },

  acknowledgeSafetyLatch: () => {
    set({
      safetyLatchLocked: false,
      forensicModalOpen: false,
    });
  },

  setForensicModalOpen: (open: boolean) => {
    set({ forensicModalOpen: open });
  },

  toggleAudioMute: () => {
    set((state) => ({ audioMuted: !state.audioMuted }));
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  }
}),
{
  name: 'voltguard-storage',
  partialize: (state) => ({ 
    settings: state.settings,
    userProfile: state.userProfile,
    isAuthenticated: state.isAuthenticated,
    isHighRiskUser: state.isHighRiskUser,
    outlets: state.outlets
  }),
}
));
