import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  OutletData, 
  TelemetryFrame, 
  ForensicAlert, 
  UserSettings, 
  UserProfile, 
  ElectricianProfile,
  ElectricianSlot,
  SupportTicket,
  ChatMessage,
  EmergencyCallState,
  FaultMode, 
  BreakerState,
  SavedCard,
  UserRole,
  TicketStatus,
  TicketPriority,
  TicketType
} from './types';

export const SEEDED_CONSUMERS: UserProfile[] = [
  {
    id: 'user-rajesh',
    consumerNumber: 'MH-PUN-8921-K',
    name: 'Rajesh Sharma (Senior Resident)',
    email: 'rajesh.sharma@gmail.com',
    role: 'user',
    phone: '+91 98201 44821',
    address: 'Flat 402, Shanti Sadan, Near Karve Statue, Kothrud, Pune',
    city: 'Pune',
    blockArea: 'Kothrud (Paud Road - Block 4)',
    pincode: '411038',
    electricityDepartment: 'MSEDCL (Mahavitaran - Kothrud Sub-division)',
    accountNumber: 'PUN-KTH-8921',
    billingTier: 'Residential LT-1 (Tier 3)',
    ratePerKwh: 8.50,
    isHighRisk: false,
  },
  {
    id: 'user-priya',
    consumerNumber: 'MH-PUN-4102-K',
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    role: 'user',
    phone: '+91 98192 33410',
    address: 'Bungalow 7, Mayur Colony, Near Dashbhuja Ganpati, Kothrud, Pune',
    city: 'Pune',
    blockArea: 'Mayur Colony / Ideal Colony, Kothrud',
    pincode: '411038',
    electricityDepartment: 'MSEDCL (Mahavitaran - Pune West Circle)',
    accountNumber: 'PUN-MYR-4102',
    billingTier: 'Residential LT-1 (Tier 2)',
    ratePerKwh: 7.80,
    isHighRisk: false,
  },
  {
    id: 'user-amit',
    consumerNumber: 'MH-PUN-7731-K',
    name: 'Amit Verma',
    email: 'amit.verma@gmail.com',
    role: 'user',
    phone: '+91 97690 12345',
    address: 'Tower B-1204, Dahanukar Colony, Near Cummins College, Karve Nagar, Pune',
    city: 'Pune',
    blockArea: 'Dahanukar Colony / Karve Nagar, Pune',
    pincode: '411052',
    electricityDepartment: 'MSEDCL (Mahavitaran - Karve Nagar Sub-division)',
    accountNumber: 'PUN-KAR-7731',
    billingTier: 'Residential LT-1 (Tier 3)',
    ratePerKwh: 8.90,
    isHighRisk: true,
  },
];

export const SEEDED_ELECTRICIANS: ElectricianProfile[] = [
  {
    id: 'elec-vikram',
    name: 'Vikram Jadhav',
    email: 'vikram.electrician@gmail.com',
    phone: '+91 98331 55678',
    qualifications: 'Diploma in Electrical Engineering, Maharashtra Govt Licensed Wireman (Grade A)',
    workExperienceYears: 9,
    city: 'Pune',
    dedicatedArea: 'Kothrud, Paud Road, Mayur Colony, Karve Nagar, Pune',
    pincodesServed: ['411038', '411052', '411029', '411021'],
    rating: 4.9,
    totalReviews: 148,
    reviews: [
      {
        id: 'rev-1',
        consumerName: 'Rajesh Sharma',
        consumerArea: 'Kothrud (Paud Road)',
        rating: 5,
        comment: 'Fixed our AC tripping issue within 20 mins. Very polite and respectful of senior citizens.',
        date: '2 days ago',
      },
      {
        id: 'rev-2',
        consumerName: 'Sunita Rao',
        consumerArea: 'Mayur Colony, Kothrud',
        rating: 5,
        comment: 'Excellent knowledge of high load thermal heating and MCB replacements.',
        date: '1 week ago',
      }
    ],
    specialties: ['Short Circuit & Arcing Fix', 'Thermal Wire Overheating', 'MCB Cutoff Calibration', 'Inverter Setup'],
    availableSlots: [
      { id: 'slot-1', date: 'Today', time: '02:00 PM - 03:30 PM', isBooked: false },
      { id: 'slot-2', date: 'Today', time: '04:30 PM - 06:00 PM', isBooked: false },
      { id: 'slot-3', date: 'Tomorrow', time: '10:00 AM - 11:30 AM', isBooked: false },
      { id: 'slot-4', date: 'Tomorrow', time: '03:00 PM - 04:30 PM', isBooked: false },
    ],
    isOnline: true,
    completedJobsCount: 312,
  },
  {
    id: 'elec-suresh',
    name: 'Suresh Nair',
    email: 'suresh.electrician@gmail.com',
    phone: '+91 98442 66789',
    qualifications: 'ITI Certified Electrician, Schneider Electric Certified Safety Specialist',
    workExperienceYears: 6,
    city: 'Pune',
    dedicatedArea: 'Bavdhan, Chandani Chowk, Bhurke Colony, Kothrud, Pune',
    pincodesServed: ['411021', '411038', '411058'],
    rating: 4.8,
    totalReviews: 96,
    reviews: [
      {
        id: 'rev-3',
        consumerName: 'Priya Patel',
        consumerArea: 'Mayur Colony',
        rating: 5,
        comment: 'Very prompt response when water heater sparked. Resolved immediately.',
        date: '3 days ago',
      }
    ],
    specialties: ['Water Heater Geyser Repair', 'Earthing Leakage', 'Main Panel Breakers', 'Appliance Diagnostics'],
    availableSlots: [
      { id: 'slot-5', date: 'Today', time: '03:00 PM - 04:30 PM', isBooked: false },
      { id: 'slot-6', date: 'Tomorrow', time: '11:00 AM - 12:30 PM', isBooked: false },
      { id: 'slot-7', date: 'Tomorrow', time: '04:00 PM - 05:30 PM', isBooked: false },
    ],
    isOnline: true,
    completedJobsCount: 184,
  },
  {
    id: 'elec-arun',
    name: 'Arun Kumar',
    email: 'arun.electrician@gmail.com',
    phone: '+91 98661 77890',
    qualifications: 'B.Tech Electrical Engineering, National Safety Council Certified Auditor',
    workExperienceYears: 12,
    city: 'Pune',
    dedicatedArea: 'Erandwane, Deccan Gymkhana, Law College Road, Pune',
    pincodesServed: ['411004', '411029', '411038'],
    rating: 4.9,
    totalReviews: 210,
    reviews: [
      {
        id: 'rev-4',
        consumerName: 'Amit Verma',
        consumerArea: 'Karve Nagar, Pune',
        rating: 5,
        comment: 'Handled high load EV charger installation with zero heat dissipation.',
        date: '5 days ago',
      }
    ],
    specialties: ['EV Charger Safety', 'Commercial & Multi-Phase Grid', 'Fire Hazard Audit', 'Transformer Faults'],
    availableSlots: [
      { id: 'slot-8', date: 'Today', time: '05:00 PM - 06:30 PM', isBooked: false },
      { id: 'slot-9', date: 'Tomorrow', time: '09:30 AM - 11:00 AM', isBooked: false },
      { id: 'slot-10', date: 'Tomorrow', time: '02:00 PM - 03:30 PM', isBooked: false },
    ],
    isOnline: true,
    completedJobsCount: 428,
  },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-1001',
    type: 'hazard_emergency',
    title: 'Water Heater Lug Overheating & Sparking',
    description: 'Kitchen water heater tripped automatically after temperature hit 68°C. Safety latch locked.',
    consumerId: 'user-rajesh',
    consumerName: 'Rajesh Sharma (Senior Resident)',
    consumerPhone: '+91 98201 44821',
    consumerAddress: 'Flat 402, Shanti Sadan, Near Karve Statue, Kothrud, Pune',
    consumerArea: 'Kothrud (Paud Road - Block 4)',
    consumerDepartment: 'MSEDCL (Mahavitaran - Kothrud)',
    assignedElectricianId: 'elec-vikram',
    assignedElectricianName: 'Vikram Jadhav',
    assignedSlot: 'Today 02:00 PM - 03:30 PM',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL_HAZARD',
    createdAt: 'Today, 11:30 AM',
  },
  {
    id: 'TCK-1002',
    type: 'repair_request',
    title: 'AC Inrush Transient Inspection',
    description: 'Living room AC has noticeable voltage drop of 18V during compressor turn on.',
    consumerId: 'user-priya',
    consumerName: 'Priya Patel',
    consumerPhone: '+91 98192 33410',
    consumerAddress: 'Bungalow 7, Mayur Colony, Kothrud, Pune',
    consumerArea: 'Mayur Colony / Ideal Colony, Kothrud',
    consumerDepartment: 'MSEDCL (Mahavitaran - Pune West)',
    assignedElectricianId: 'elec-suresh',
    assignedElectricianName: 'Suresh Nair',
    assignedSlot: 'Tomorrow 11:00 AM - 12:30 PM',
    status: 'ASSIGNED',
    priority: 'HIGH',
    createdAt: 'Yesterday, 04:15 PM',
  },
  {
    id: 'TCK-1003',
    type: 'system_bug',
    title: 'Exported chart timestamp offset by 1 hour',
    description: 'When viewing the 24-hour graph, the local timezone shifts by 1 hour on mobile browser.',
    consumerId: 'user-amit',
    consumerName: 'Amit Verma',
    consumerPhone: '+91 97690 12345',
    consumerAddress: 'Tower B-1204, Dahanukar Colony, Karve Nagar, Pune',
    consumerArea: 'Dahanukar Colony / Karve Nagar, Pune',
    consumerDepartment: 'MSEDCL (Mahavitaran - Karve Nagar)',
    status: 'OPEN',
    priority: 'MEDIUM',
    createdAt: '2 days ago',
  },
  {
    id: 'TCK-1004',
    type: 'repair_request',
    title: 'Refrigerator Capacitor Replacement Completed',
    description: 'Fixed abnormal compressor drag and rewound motor starting coil.',
    consumerId: 'user-rajesh',
    consumerName: 'Rajesh Sharma (Senior Resident)',
    consumerPhone: '+91 98201 44821',
    consumerAddress: 'Flat 402, Shanti Sadan, Near Karve Statue, Kothrud, Pune',
    consumerArea: 'Kothrud (Paud Road - Block 4)',
    consumerDepartment: 'MSEDCL (Mahavitaran - Kothrud)',
    assignedElectricianId: 'elec-vikram',
    assignedElectricianName: 'Vikram Jadhav',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    createdAt: '3 days ago',
    resolvedAt: '2 days ago',
    rating: 5,
    review: 'Prompt and safe work. Verified zero leakage current.',
    feedbackSubmitted: true,
  },
];

export const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'admin',
    senderName: 'VoltGuard Safety Control',
    senderRole: 'admin',
    recipientId: 'user-rajesh',
    recipientName: 'Rajesh Sharma',
    channel: 'user_admin',
    text: 'Namaste Mr. Sharma. We noticed your Kitchen Water Heater tripped safely on hazard cutoff. Electrician Vikram Jadhav has been dispatched to your Kothrud residence.',
    timestamp: '11:32 AM',
  },
  {
    id: 'msg-2',
    senderId: 'elec-vikram',
    senderName: 'Vikram Jadhav (Electrician)',
    senderRole: 'electrician',
    recipientId: 'user-rajesh',
    recipientName: 'Rajesh Sharma',
    channel: 'user_electrician',
    text: 'Hello sir, I have accepted your service request. I will arrive with replacement thermal ceramic connectors between 2:00 PM and 2:30 PM at Kothrud Paud Road.',
    timestamp: '11:45 AM',
  },
  {
    id: 'msg-3',
    senderId: 'elec-vikram',
    senderName: 'Vikram Jadhav (Electrician)',
    senderRole: 'electrician',
    recipientId: 'admin',
    recipientName: 'Admin Desk',
    channel: 'electrician_admin',
    text: 'Admin, please note I have reviewed the 5-second forensic telemetry snapshot for TCK-1001. Thermal lug reading reached 68°C under 180V sag. Requesting safety clearance.',
    timestamp: '11:50 AM',
  }
];

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
  },
};

interface VoltGuardState {
  isAuthenticated: boolean;
  currentUserRole: UserRole;
  userProfile: UserProfile;
  electricianProfile: ElectricianProfile | null;
  adminProfile: {
    name: string;
    email: string;
    role: 'admin';
    title: string;
  };

  // Switch Role / Login
  loginAsUser: (userId: string) => void;
  loginAsElectrician: (electricianId: string) => void;
  loginAsAdmin: (email: string) => void;
  loginWithCredentials: (emailOrConsumerId: string, role: UserRole) => boolean;
  logout: () => void;

  // Active User Navigation & Tabs
  userActiveTab: 'switchboard' | 'telemetry' | 'billing' | 'electrician' | 'report_bug' | 'chat' | 'call_dept' | 'settings';
  setUserActiveTab: (tab: 'switchboard' | 'telemetry' | 'billing' | 'electrician' | 'report_bug' | 'chat' | 'call_dept' | 'settings') => void;

  // Admin Navigation & Tabs
  adminActiveTab: 'overview' | 'users' | 'incidents' | 'electricians' | 'tickets' | 'chat' | 'settings';
  setAdminActiveTab: (tab: 'overview' | 'users' | 'incidents' | 'electricians' | 'tickets' | 'chat' | 'settings') => void;

  // Electrician Navigation & Tabs
  electricianActiveTab: 'jobs' | 'slots' | 'client_chat' | 'admin_chat' | 'report' | 'reviews' | 'profile' | 'settings';
  setElectricianActiveTab: (tab: 'jobs' | 'slots' | 'client_chat' | 'admin_chat' | 'report' | 'reviews' | 'profile' | 'settings') => void;

  // Telemetry & Outlets
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

  // Emergency Calling Simulator
  emergencyCallState: EmergencyCallState | null;
  dismissEmergencyCall: () => void;
  triggerFireEmergencyProtocol: (outletName: string, diagnosis: string) => void;

  // Rating Modal
  ratingModalTicket: SupportTicket | null;
  openRatingModal: (ticket: SupportTicket) => void;
  closeRatingModal: () => void;

  // Electricians & Slot Booking
  electricians: ElectricianProfile[];
  bookElectricianSlot: (electricianId: string, slotId: string, ticketTitle: string, description: string) => void;
  addElectricianSlot: (electricianId: string, date: string, time: string) => void;
  removeElectricianSlot: (electricianId: string, slotId: string) => void;

  // Tickets Management
  tickets: SupportTicket[];
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus, notes?: string) => void;
  assignElectricianToTicket: (ticketId: string, electricianId: string, slot?: string) => void;
  submitTicketRating: (ticketId: string, rating: number, review: string) => void;

  // Chats
  chatMessages: ChatMessage[];
  sendChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;

  // Onboarding & Custom Outlets
  onboardingModalOpen: boolean;
  setOnboardingModalOpen: (open: boolean) => void;
  addCustomOutlet: (outlet: Partial<OutletData>) => void;
  addSavedCard: (card: Omit<SavedCard, 'id'>) => void;
  removeSavedCard: (id: string) => void;

  // Settings & Theme
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  toggleAudioMute: () => void;

  // Actions
  setTelemetry: (frame: TelemetryFrame) => void;
  injectFault: (outletId: string, faultMode: FaultMode) => void;
  toggleBreaker: (outletId: string, state: BreakerState) => void;
  globalSafetyReset: () => void;
  acknowledgeSafetyLatch: () => void;
  setForensicModalOpen: (open: boolean) => void;
  updateUserProfile: (newProfile: Partial<UserProfile>) => void;
}

export const useVoltStore = create<VoltGuardState>()(
  persist(
    (set, get) => ({
      isAuthenticated: true,
      currentUserRole: 'user',
      userProfile: SEEDED_CONSUMERS[0],
      electricianProfile: SEEDED_ELECTRICIANS[0],
      adminProfile: {
        name: 'Rukaiya (Chief Safety Administrator)',
        email: 'rukaiya.admin@gmail.com',
        role: 'admin',
        title: 'Safety Command & Grid Operations Head',
      },

      userActiveTab: 'switchboard',
      setUserActiveTab: (tab) => set({ userActiveTab: tab }),

      adminActiveTab: 'overview',
      setAdminActiveTab: (tab) => set({ adminActiveTab: tab }),

      electricianActiveTab: 'jobs',
      setElectricianActiveTab: (tab) => set({ electricianActiveTab: tab }),

      outlets: defaultOutlets,
      history: [
        { timestamp: '12:00:00', V_master: 230.1, I_master: 6.8, T_master: 38.2, Score_master: 0.12, V_living: 228.4, I_living: 9.1, T_living: 41.8, Score_living: 0.15 },
        { timestamp: '12:00:01', V_master: 229.8, I_master: 6.9, T_master: 38.4, Score_master: 0.11, V_living: 228.1, I_living: 9.3, T_living: 42.0, Score_living: 0.16 },
        { timestamp: '12:00:02', V_master: 230.3, I_master: 6.7, T_master: 38.5, Score_master: 0.13, V_living: 228.0, I_living: 9.2, T_living: 42.1, Score_living: 0.14 },
      ],
      globalAnomaly: false,
      forensicAlert: null,
      forensicSnapshot: null,
      forensicModalOpen: false,
      safetyLatchLocked: false,
      audioMuted: false,

      emergencyCallState: null,
      dismissEmergencyCall: () => set({ emergencyCallState: null }),
      triggerFireEmergencyProtocol: (outletName: string, diagnosis: string) => {
        const user = get().userProfile;
        set({
          emergencyCallState: {
            isActive: true,
            type: 'FIRE_DEPARTMENT',
            recipientName: `Pune Fire Brigade (Kothrud Station) & ${user.name}`,
            recipientPhone: `101 / ${user.phone}`,
            hazardLocation: user.address,
            outletName,
            diagnosis,
            countdown: 3,
            callStatus: 'DIALING',
          },
        });
      },

      ratingModalTicket: null,
      openRatingModal: (ticket) => set({ ratingModalTicket: ticket }),
      closeRatingModal: () => set({ ratingModalTicket: null }),

      electricians: SEEDED_ELECTRICIANS,
      tickets: INITIAL_TICKETS,
      chatMessages: INITIAL_CHATS,

      onboardingModalOpen: false,
      setOnboardingModalOpen: (open) => set({ onboardingModalOpen: open }),

      settings: {
        theme: 'slate',
        refreshRate: 1000,
        anomalySensitivity: 0.75,
        alarmTone: 'buzzer',
        alarmVolume: 0.8,
        seniorMode: true,
        largeFonts: false,
        highContrast: false,
        hapticsEnabled: true,
        vibrationPattern: 'sos',
        vibrationIntensity: 0.8,
        buttonClickSoundEnabled: true,
        breakerTripSoundEnabled: true,
        autoCutoffEnabled: true,
        autoFireEmergencyCall: true,
        autoFireDepartmentCall: true,
        inrushMaskingEnabled: true,
        sirenEnabled: true,
        autoStreamEnabled: true,
        emailAlertsEnabled: true,
        twoFactorEnabled: false,
        telemetryAnonymized: false,
        sessionTimeoutMinutes: 30,
        autoPayEnabled: true,
        savedCards: [
          {
            id: 'card-1',
            cardHolder: 'Rajesh Sharma',
            cardNumberMasked: '•••• •••• •••• 4482',
            last4: '4482',
            expDate: '09/28',
            brand: 'visa',
            isDefault: true,
          }
        ],
      },

      loginAsUser: (userId: string) => {
        const found = SEEDED_CONSUMERS.find((c) => c.id === userId) || SEEDED_CONSUMERS[0];
        set({
          isAuthenticated: true,
          currentUserRole: 'user',
          userProfile: found,
        });
      },

      loginAsElectrician: (electricianId: string) => {
        const found = get().electricians.find((e) => e.id === electricianId) || SEEDED_ELECTRICIANS[0];
        set({
          isAuthenticated: true,
          currentUserRole: 'electrician',
          electricianProfile: found,
        });
      },

      loginAsAdmin: (email: string) => {
        set({
          isAuthenticated: true,
          currentUserRole: 'admin',
          adminProfile: {
            name: 'Rukaiya (Chief Safety Administrator)',
            email: email || 'rukaiya.admin@gmail.com',
            role: 'admin',
            title: 'Safety Command & Grid Operations Head',
          },
        });
      },

      loginWithCredentials: (emailOrConsumerId: string, role: UserRole) => {
        const val = emailOrConsumerId.trim().toLowerCase();
        if (role === 'admin') {
          get().loginAsAdmin(val || 'rukaiya.admin@gmail.com');
          return true;
        } else if (role === 'electrician') {
          const elec = get().electricians.find(
            (e) => e.email.toLowerCase() === val || e.name.toLowerCase().includes(val) || e.id === val
          ) || SEEDED_ELECTRICIANS[0];
          get().loginAsElectrician(elec.id);
          return true;
        } else {
          const usr = SEEDED_CONSUMERS.find(
            (u) => u.consumerNumber.toLowerCase() === val || u.email.toLowerCase() === val || u.id === val
          ) || SEEDED_CONSUMERS[0];
          get().loginAsUser(usr.id);
          return true;
        }
      },

      logout: () => {
        set({ isAuthenticated: false });
      },

      updateUserProfile: (newProfile) => {
        set((state) => ({
          userProfile: { ...state.userProfile, ...newProfile },
        }));
      },

      addCustomOutlet: (outlet) => {
        const id = outlet.id || `outlet_${Date.now()}`;
        const newOutlet: OutletData = {
          id,
          name: outlet.name || 'New Circuit',
          modelNumber: outlet.modelNumber || 'Custom Load',
          location: outlet.location || 'Home Circuit',
          imageUrl: outlet.imageUrl,
          rated_current: outlet.rated_current || 10.0,
          trip_current: outlet.trip_current || 16.0,
          voltage: 230.0,
          current: (outlet.rated_current || 10.0) * 0.5,
          cos_phi: 0.90,
          power_watts: Math.round(230.0 * (outlet.rated_current || 10.0) * 0.5 * 0.90),
          terminal_temp: 32.0,
          status: 'normal',
          breaker_state: 'CLOSED',
          fault_mode: 'none',
          anomaly_score: 0.10,
          isUserCreated: true,
          iotStatus: 'CONNECTED',
        };

        set((state) => ({
          outlets: { ...state.outlets, [id]: newOutlet },
        }));
      },

      addSavedCard: (card) => {
        const newCard: SavedCard = {
          ...card,
          id: `card_${Date.now()}`,
        };
        set((state) => ({
          settings: {
            ...state.settings,
            savedCards: [...state.settings.savedCards, newCard],
          },
        }));
      },

      removeSavedCard: (id) => {
        set((state) => ({
          settings: {
            ...state.settings,
            savedCards: state.settings.savedCards.filter((c) => c.id !== id),
          },
        }));
      },

      bookElectricianSlot: (electricianId, slotId, ticketTitle, description) => {
        const state = get();
        const electrician = state.electricians.find((e) => e.id === electricianId);
        const user = state.userProfile;
        if (!electrician) return;

        const slot = electrician.availableSlots.find((s) => s.id === slotId);
        const slotText = slot ? `${slot.date} ${slot.time}` : 'Earliest Slot';

        const newTicketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

        const newTicket: SupportTicket = {
          id: newTicketId,
          type: 'repair_request',
          title: ticketTitle || `Inspection & Service with ${electrician.name}`,
          description: description || `Scheduled consultation for electrical circuit safety at ${user.address}.`,
          consumerId: user.id,
          consumerName: user.name,
          consumerPhone: user.phone,
          consumerAddress: user.address,
          consumerArea: user.blockArea,
          consumerDepartment: user.electricityDepartment,
          assignedElectricianId: electrician.id,
          assignedElectricianName: electrician.name,
          assignedSlot: slotText,
          status: 'ASSIGNED',
          priority: 'HIGH',
          createdAt: 'Just now',
        };

        // Update slot to booked
        const updatedElectricians = state.electricians.map((e) => {
          if (e.id === electricianId) {
            return {
              ...e,
              availableSlots: e.availableSlots.map((s) =>
                s.id === slotId
                  ? { ...s, isBooked: true, bookedByConsumerId: user.id, bookedByConsumerName: user.name, ticketId: newTicketId }
                  : s
              ),
            };
          }
          return e;
        });

        // Add auto chat confirmation
        const newChatMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: electrician.id,
          senderName: `${electrician.name} (Electrician)`,
          senderRole: 'electrician',
          recipientId: user.id,
          recipientName: user.name,
          channel: 'user_electrician',
          ticketId: newTicketId,
          text: `Namaste ${user.name}! I have confirmed your slot for ${slotText}. I will arrive at ${user.address} with all diagnostic tools.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAutoGenerated: true,
        };

        set({
          electricians: updatedElectricians,
          tickets: [newTicket, ...state.tickets],
          chatMessages: [...state.chatMessages, newChatMsg],
          userActiveTab: 'electrician',
        });
      },

      addElectricianSlot: (electricianId, date, time) => {
        set((state) => ({
          electricians: state.electricians.map((e) => {
            if (e.id === electricianId) {
              const newSlot: ElectricianSlot = {
                id: `slot-${Date.now()}`,
                date,
                time,
                isBooked: false,
              };
              return { ...e, availableSlots: [...e.availableSlots, newSlot] };
            }
            return e;
          }),
        }));
      },

      removeElectricianSlot: (electricianId, slotId) => {
        set((state) => ({
          electricians: state.electricians.map((e) => {
            if (e.id === electricianId) {
              return {
                ...e,
                availableSlots: e.availableSlots.filter((s) => s.id !== slotId),
              };
            }
            return e;
          }),
        }));
      },

      createTicket: (ticketData) => {
        const newTicket: SupportTicket = {
          ...ticketData,
          id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'OPEN',
          createdAt: 'Just now',
        };
        set((state) => ({
          tickets: [newTicket, ...state.tickets],
        }));
      },

      updateTicketStatus: (ticketId, status, notes) => {
        set((state) => {
          const updatedTickets = state.tickets.map((t) => {
            if (t.id === ticketId) {
              const updated = {
                ...t,
                status,
                resolutionNotes: notes || t.resolutionNotes,
                resolvedAt: status === 'RESOLVED' ? new Date().toLocaleDateString() : t.resolvedAt,
              };
              // If marked resolved and consumer is logged in, trigger rating modal
              if (status === 'RESOLVED' && !updated.feedbackSubmitted && state.currentUserRole === 'user') {
                setTimeout(() => {
                  get().openRatingModal(updated);
                }, 400);
              }
              return updated;
            }
            return t;
          });
          return { tickets: updatedTickets };
        });
      },

      assignElectricianToTicket: (ticketId, electricianId, slot) => {
        const electrician = get().electricians.find((e) => e.id === electricianId);
        if (!electrician) return;

        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  assignedElectricianId: electrician.id,
                  assignedElectricianName: electrician.name,
                  assignedSlot: slot || t.assignedSlot,
                  status: 'ASSIGNED',
                }
              : t
          ),
        }));
      },

      submitTicketRating: (ticketId, rating, review) => {
        const state = get();
        const ticket = state.tickets.find((t) => t.id === ticketId);
        if (!ticket) return;

        // Update ticket
        const updatedTickets = state.tickets.map((t) =>
          t.id === ticketId
            ? { ...t, rating, review, feedbackSubmitted: true, status: 'RESOLVED' as TicketStatus }
            : t
        );

        // Update electrician's rating, reviews list, and completed count
        const updatedElectricians = state.electricians.map((e) => {
          if (e.id === ticket.assignedElectricianId) {
            const newReviews = [
              {
                id: `rev-${Date.now()}`,
                consumerName: ticket.consumerName,
                consumerArea: ticket.consumerArea,
                rating,
                comment: review || 'Fast, reliable and certified service.',
                date: 'Just now',
              },
              ...e.reviews,
            ];
            const newTotal = e.totalReviews + 1;
            const newAvgRating = Math.round(((e.rating * e.totalReviews + rating) / newTotal) * 10) / 10;

            return {
              ...e,
              rating: newAvgRating,
              totalReviews: newTotal,
              reviews: newReviews,
              completedJobsCount: e.completedJobsCount + 1,
            };
          }
          return e;
        });

        // Re-sort electricians so highest rated appear first
        updatedElectricians.sort((a, b) => b.rating - a.rating || b.totalReviews - a.totalReviews);

        set({
          tickets: updatedTickets,
          electricians: updatedElectricians,
          ratingModalTicket: null,
        });
      },

      sendChatMessage: (msgData) => {
        const newMsg: ChatMessage = {
          ...msgData,
          id: `msg-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set((state) => ({
          chatMessages: [...state.chatMessages, newMsg],
        }));

        // Simulated auto-reply for admin / support channel
        if (msgData.channel === 'user_admin' && msgData.senderRole === 'user') {
          setTimeout(() => {
            const autoReply: ChatMessage = {
              id: `msg-${Date.now() + 1}`,
              senderId: 'admin',
              senderName: 'VoltGuard Safety Helpdesk',
              senderRole: 'admin',
              recipientId: msgData.senderId,
              recipientName: msgData.senderName,
              channel: 'user_admin',
              text: `Hello ${msgData.senderName}! We have logged your query. Our on-duty electrical engineer is reviewing your telemetry. If this is an active fire emergency, please keep the Main Virtual Breaker TRIPPED.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isAutoGenerated: true,
            };
            set((state) => ({
              chatMessages: [...state.chatMessages, autoReply],
            }));
          }, 1200);
        }
      },

      setTelemetry: (frame) => {
        const history = [...get().history];
        const nowStr = frame.timestamp || new Date().toLocaleTimeString();

        const master = frame.outlets.master_ac || defaultOutlets.master_ac;
        const living = frame.outlets.living_ac || defaultOutlets.living_ac;

        history.push({
          timestamp: nowStr,
          V_master: master.voltage,
          I_master: master.current,
          T_master: master.terminal_temp,
          Score_master: master.anomaly_score,
          V_living: living.voltage,
          I_living: living.current,
          T_living: living.terminal_temp,
          Score_living: living.anomaly_score,
        });

        if (history.length > 25) {
          history.shift();
        }

        const updates: Partial<VoltGuardState> = {
          outlets: frame.outlets,
          history,
          globalAnomaly: frame.global_anomaly,
        };

        if (frame.forensic_alert) {
          updates.forensicAlert = frame.forensic_alert;
          updates.forensicModalOpen = true;
          updates.safetyLatchLocked = true;
          updates.forensicSnapshot = Object.values(frame.outlets);

          // If auto emergency call is enabled, trigger emergency protocol
          if (get().settings.autoFireEmergencyCall && !get().emergencyCallState) {
            get().triggerFireEmergencyProtocol(
              frame.forensic_alert.outlet_name,
              frame.forensic_alert.diagnosis
            );
          }
        }

        set(updates as any);
      },

      injectFault: (outletId, faultMode) => {
        const outlets = { ...get().outlets };
        const outlet = outlets[outletId];
        if (!outlet) return;

        outlet.fault_mode = faultMode;

        if (faultMode === 'stall' || faultMode === 'outbreak') {
          outlet.status = 'outbreak';
          outlet.voltage = 178.0;
          outlet.current = 29.5;
          outlet.cos_phi = 0.58;
          outlet.terminal_temp = Math.min(85.0, outlet.terminal_temp + 6.0);
          outlet.anomaly_score = 0.94;

          const alertObj: ForensicAlert = {
            outlet_id: outletId,
            outlet_name: outlet.name,
            timestamp: new Date().toLocaleTimeString(),
            voltage: 178.0,
            current: 29.5,
            cos_phi: 0.58,
            temperature: outlet.terminal_temp,
            anomaly_score: 0.94,
            trip_latency_ms: 12,
            diagnosis: `🔥 CRITICAL FIRE OUTBREAK HAZARD: ${outlet.name} overheated to ${Math.round(outlet.terminal_temp)}°C under 178V low-voltage brownout stall. Power safely cut in 12ms!`,
          };

          set({
            outlets,
            globalAnomaly: true,
            forensicAlert: alertObj,
            forensicModalOpen: true,
            safetyLatchLocked: true,
            forensicSnapshot: Object.values(outlets),
          });

          if (get().settings.autoFireEmergencyCall) {
            get().triggerFireEmergencyProtocol(outlet.name, alertObj.diagnosis);
          }

          get().toggleBreaker(outletId, 'TRIPPED');

        } else if (faultMode === 'micro_arc') {
          outlet.status = 'anomalous';
          outlet.voltage = 208.0;
          outlet.current = outlet.rated_current + 7.5;
          outlet.cos_phi = 0.76;
          outlet.terminal_temp = outlet.terminal_temp + 3.5;
          outlet.anomaly_score = 0.84;

          const alertObj: ForensicAlert = {
            outlet_id: outletId,
            outlet_name: outlet.name,
            timestamp: new Date().toLocaleTimeString(),
            voltage: 208.0,
            current: Math.round(outlet.current * 10) / 10,
            cos_phi: 0.76,
            temperature: Math.round(outlet.terminal_temp * 10) / 10,
            anomaly_score: 0.84,
            trip_latency_ms: 14,
            diagnosis: `Spark Hazard Cutoff: Loose contact micro-arcing detected on ${outlet.name}. Circuit safely tripped.`,
          };

          set({
            outlets,
            globalAnomaly: true,
            forensicAlert: alertObj,
            forensicModalOpen: true,
            safetyLatchLocked: true,
            forensicSnapshot: Object.values(outlets),
          });

          get().toggleBreaker(outletId, 'TRIPPED');

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

      toggleBreaker: (outletId, state) => {
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
          emergencyCallState: null,
        });
      },

      acknowledgeSafetyLatch: () => {
        set({
          safetyLatchLocked: false,
          forensicModalOpen: false,
        });
      },

      setForensicModalOpen: (open) => {
        set({ forensicModalOpen: open });
      },

      toggleAudioMute: () => {
        set((state) => ({ audioMuted: !state.audioMuted }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: 'voltguard-storage',
      partialize: (state) => ({
        settings: state.settings,
        userProfile: state.userProfile,
        currentUserRole: state.currentUserRole,
        isAuthenticated: state.isAuthenticated,
        tickets: state.tickets,
        electricians: state.electricians,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
