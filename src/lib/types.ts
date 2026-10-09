export type FaultMode = 'none' | 'inrush' | 'stall' | 'micro_arc' | 'outbreak';

export type BreakerState = 'CLOSED' | 'TRIPPED';

export type OutletStatus = 'normal' | 'inrush' | 'anomalous' | 'tripped' | 'outbreak';

export interface OutletData {
  id: string;
  name: string;
  modelNumber?: string;
  location?: string;
  imageUrl?: string;
  rated_current: number;
  trip_current: number;
  voltage: number;
  current: number;
  cos_phi: number;
  power_watts: number;
  terminal_temp: number;
  status: OutletStatus;
  breaker_state: BreakerState;
  fault_mode: FaultMode;
  anomaly_score: number;
  is_masked_inrush?: boolean;
  hazard_warning?: string;
  iotStatus?: 'CONNECTED' | 'DISCOVERING' | 'OFFLINE';
  isUserCreated?: boolean;
}

export interface ForensicAlert {
  outlet_id: string;
  outlet_name: string;
  timestamp: string;
  voltage: number;
  current: number;
  cos_phi: number;
  temperature: number;
  anomaly_score: number;
  trip_latency_ms: number;
  diagnosis: string;
}

export interface TelemetryFrame {
  timestamp: string;
  outlets: Record<string, OutletData>;
  global_anomaly: boolean;
  forensic_alert: ForensicAlert | null;
}

export type ThemeOption = 'oled' | 'slate' | 'light';
export type RefreshRate = 500 | 1000 | 2000;
export type AlarmTone = 'buzzer' | 'siren' | 'chime' | 'synth' | 'custom';
export type VibrationPattern = 'pulse' | 'sos' | 'continuous' | 'subtle';

export interface SavedCard {
  id: string;
  cardHolder: string;
  cardNumberMasked: string;
  last4: string;
  expDate: string;
  brand: 'visa' | 'mastercard' | 'amex';
  isDefault: boolean;
}

export interface UserSettings {
  theme: ThemeOption;
  refreshRate: RefreshRate;
  anomalySensitivity: number;
  alarmTone: AlarmTone;
  alarmVolume: number;
  customAudioDataUrl?: string;

  // Haptics & Vibration
  hapticsEnabled: boolean;
  vibrationPattern: VibrationPattern;
  vibrationIntensity: number; // 0.0 - 1.0
  buttonClickSoundEnabled: boolean;
  breakerTripSoundEnabled: boolean;

  // Automation Toggles
  autoCutoffEnabled: boolean;
  inrushMaskingEnabled: boolean;
  sirenEnabled: boolean;
  autoStreamEnabled: boolean;
  emailAlertsEnabled: boolean;

  // Privacy & Security
  twoFactorEnabled: boolean;
  telemetryAnonymized: boolean;
  sessionTimeoutMinutes: number;

  // Payment Methods
  autoPayEnabled: boolean;
  savedCards: SavedCard[];
}

export interface UserProfile {
  consumerNumber: string;
  name: string;
  email: string;
  accountNumber: string;
  billingTier: string;
  ratePerKwh: number;
  isHighRisk?: boolean;
}

export interface BillingApplianceShare {
  name: string;
  kwh: number;
  percentage: number;
  color: string;
}

export interface DegradationInsight {
  id: string;
  appliance: string;
  severity: 'CRITICAL' | 'WARNING' | 'OPTIMIZATION';
  excess_consumption_pct: number;
  title: string;
  description: string;
  recommendation: string;
}

export interface BillingCensus {
  consumer_number: string;
  consumer_name: string;
  bill_number: string;
  tariff_tier: string;
  rate_per_kwh: number;
  sanctioned_load_kw: number;
  billing_unit_code: string;
  month_consumed_kwh: number;
  projected_bill_inr: number;
  outlier_waste_kwh: number;
  outlier_waste_cost_inr: number;
  appliance_shares: BillingApplianceShare[];
  degradation_insights: DegradationInsight[];
}

export interface MLEvalInputs {
  voltage: number;
  current: number;
  cos_phi: number;
  dI_dt: number;
  duration_ms: number;
  temperature: number;
}

export interface MLEvalResult {
  anomalyScore: number;
  isAnomaly: boolean;
  isMaskedInrush: boolean;
  classification: 'Normal Operation' | 'Safe Motor Inrush (Masked)' | 'Anomalous Fire Hazard';
  decisionThreshold: number;
  latencyMs: number;
  featureAnalysis: {
    voltageRisk: string;
    currentRisk: string;
    thermalRisk: string;
  };
}
