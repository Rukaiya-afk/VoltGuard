export type UserRole = 'user' | 'electrician' | 'admin';

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

  // Senior Accessibility & Visuals
  seniorMode: boolean;
  largeFonts: boolean;
  highContrast: boolean;

  // Haptics & Vibration
  hapticsEnabled: boolean;
  vibrationPattern: VibrationPattern;
  vibrationIntensity: number;
  buttonClickSoundEnabled: boolean;
  breakerTripSoundEnabled: boolean;

  // Emergency Automation
  autoCutoffEnabled: boolean;
  autoFireEmergencyCall: boolean;
  autoFireDepartmentCall: boolean;
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
  id: string;
  consumerNumber: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  city: string;
  blockArea: string;
  pincode: string;
  electricityDepartment: string;
  accountNumber: string;
  billingTier: string;
  ratePerKwh: number;
  isHighRisk?: boolean;
}

export interface ElectricianSlot {
  id: string;
  date: string; // e.g. "Today", "Tomorrow", "12 Oct"
  time: string; // e.g. "10:00 AM - 11:30 AM"
  isBooked: boolean;
  bookedByConsumerId?: string;
  bookedByConsumerName?: string;
  ticketId?: string;
}

export interface ElectricianReview {
  id: string;
  consumerName: string;
  consumerArea: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface ElectricianProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  qualifications: string; // e.g., "Diploma in Electrical Engineering, Govt Licensed Wireman Grade A"
  workExperienceYears: number; // e.g., 9
  city: string;
  dedicatedArea: string; // e.g., "Kothrud / Paud Road / Karve Nagar / Pune"
  pincodesServed: string[];
  rating: number; // e.g., 4.9
  totalReviews: number;
  reviews: ElectricianReview[];
  specialties: string[];
  availableSlots: ElectricianSlot[];
  isOnline: boolean;
  completedJobsCount: number;
}

export type TicketType = 'hazard_emergency' | 'repair_request' | 'system_bug' | 'billing_inquiry';
export type TicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'CRITICAL_HAZARD' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface SupportTicket {
  id: string;
  type: TicketType;
  title: string;
  description: string;
  consumerId: string;
  consumerName: string;
  consumerPhone: string;
  consumerAddress: string;
  consumerArea: string;
  consumerDepartment: string;
  assignedElectricianId?: string;
  assignedElectricianName?: string;
  assignedSlot?: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  rating?: number; // 1-5
  review?: string;
  feedbackSubmitted?: boolean;
}

export type ChatChannel = 'user_admin' | 'user_electrician' | 'electrician_admin' | 'general';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  channel: ChatChannel;
  ticketId?: string;
  text: string;
  timestamp: string;
  isAutoGenerated?: boolean;
}

export interface ElectricityDepartmentInfo {
  id: string;
  name: string;
  shortCode: string;
  region: string;
  helpline: string;
  emergencyNumber: string;
  whatsappSupport: string;
  website: string;
  description: string;
}

export interface EmergencyCallState {
  isActive: boolean;
  type: 'RESIDENT' | 'FIRE_DEPARTMENT' | 'POWER_GRID';
  recipientName: string;
  recipientPhone: string;
  hazardLocation: string;
  outletName: string;
  diagnosis: string;
  countdown: number;
  callStatus: 'DIALING' | 'SPEAKING' | 'DISPATCHED' | 'COMPLETED';
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
