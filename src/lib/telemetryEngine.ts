import { OutletData, TelemetryFrame, ForensicAlert, FaultMode, BreakerState } from './types';

interface SimulatedOutlet extends OutletData {
  fault_start_time?: number;
  last_current?: number;
}

const defaultOutlets: Record<string, SimulatedOutlet> = {
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
    last_current: 6.8,
    fault_start_time: 0,
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
    last_current: 9.2,
    fault_start_time: 0,
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
    last_current: 11.4,
    fault_start_time: 0,
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
    last_current: 1.2,
    fault_start_time: 0,
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
    last_current: 4.5,
    fault_start_time: 0,
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
    last_current: 18.5,
    fault_start_time: 0,
  },
};

// Global in-memory simulation state for serverless execution
const simulatedOutlets: Record<string, SimulatedOutlet> = { ...defaultOutlets };

function calculateAnomalyScore(
  V: number,
  I: number,
  cos: number,
  temp: number,
  dI_dt: number
): number {
  let score = 0.10;
  if (I > 12.5) {
    score += (I - 12.5) * 0.035;
  }
  if (V < 210) {
    score += (210 - V) * 0.012;
  }
  if (temp > 45) {
    score += (temp - 45) * 0.018;
  }
  if (dI_dt > 5.0) {
    score += dI_dt * 0.015;
  }
  if (cos < 0.70) {
    score += (0.70 - cos) * 0.25;
  }
  return Math.max(0.05, Math.min(0.99, Math.round(score * 100) / 100));
}

export function generateTelemetryFrame(): TelemetryFrame {
  const now = Date.now();
  const timeStr = new Date().toLocaleTimeString();
  const updatedOutlets: Record<string, OutletData> = {};
  let globalAnomaly = false;
  let forensicAlert: ForensicAlert | null = null;

  Object.entries(simulatedOutlets).forEach(([id, outlet]) => {
    if (outlet.breaker_state === 'TRIPPED') {
      outlet.current = 0.0;
      outlet.power_watts = 0.0;
      outlet.terminal_temp = Math.max(25.0, Math.round((outlet.terminal_temp - 0.3) * 10) / 10);
      outlet.status = 'tripped';
      outlet.anomaly_score = 0.0;
      outlet.is_masked_inrush = false;

      updatedOutlets[id] = { ...outlet };
      return;
    }

    const baseV = 230.0 + (Math.random() * 2 - 1);
    let V = baseV;
    let I = outlet.rated_current * 0.55 + (Math.random() * 0.4 - 0.2);
    let cos = 0.92;
    let T = outlet.terminal_temp;
    let status: OutletData['status'] = 'normal';
    let isMaskedInrush = false;
    const fault = outlet.fault_mode;

    if (fault === 'none') {
      if (id === 'master_ac') {
        I = 6.8 + (Math.random() * 0.4 - 0.2);
        cos = 0.92;
        T = 38.5 + (Math.random() * 0.4 - 0.2);
      } else if (id === 'living_ac') {
        I = 9.2 + (Math.random() * 0.5 - 0.25);
        cos = 0.90;
        T = 42.0 + (Math.random() * 0.4 - 0.2);
      } else if (id === 'kitchen_geyser') {
        I = 11.4 + (Math.random() * 0.4 - 0.2);
        cos = 0.98;
        T = 45.2 + (Math.random() * 0.4 - 0.2);
      } else if (id === 'refrigerator') {
        I = 1.2 + (Math.random() * 0.2 - 0.1);
        cos = 0.85;
        T = 30.1 + (Math.random() * 0.3 - 0.15);
      } else if (id === 'washing_machine') {
        I = 4.5 + (Math.random() * 0.3 - 0.15);
        cos = 0.88;
        T = 34.0 + (Math.random() * 0.3 - 0.15);
      } else {
        I = 18.5 + (Math.random() * 0.6 - 0.3);
        cos = 0.94;
        T = 52.0 + (Math.random() * 0.5 - 0.25);
      }
    } else if (fault === 'inrush') {
      const elapsedMs = now - (outlet.fault_start_time || now);
      if (elapsedMs < 400) {
        I = outlet.rated_current * 2.2;
        cos = 0.72;
        V = baseV - 6.0;
        T = outlet.terminal_temp + 0.3;
        status = 'inrush';
        isMaskedInrush = true;
      } else {
        outlet.fault_mode = 'none';
        I = outlet.rated_current * 0.55;
        cos = 0.91;
        status = 'normal';
      }
    } else if (fault === 'stall' || fault === 'outbreak') {
      V = 178.0 + (Math.random() * 2 - 1);
      I = 29.5 + Math.random() * 1.5;
      cos = 0.58;
      T = outlet.terminal_temp + 2.5;
      status = 'anomalous';
    } else if (fault === 'micro_arc') {
      V = 208.0 + (Math.random() * 4 - 2);
      I = outlet.rated_current + Math.random() * 6;
      cos = 0.78;
      T = outlet.terminal_temp + 2.0;
      status = 'anomalous';
    }

    const dI_dt = Math.abs(I - (outlet.last_current || I)) / 0.5;
    outlet.last_current = I;

    let score = calculateAnomalyScore(V, I, cos, T, dI_dt);
    if (isMaskedInrush) {
      score = Math.min(0.28, score * 0.4);
    }

    if (score > 0.72 || T > 65.0 || (V < 185.0 && I > 15.0) || I > outlet.trip_current || status === 'anomalous') {
      status = 'anomalous';
      globalAnomaly = true;
      outlet.breaker_state = 'TRIPPED';
      outlet.current = 0.0;
      outlet.power_watts = 0.0;

      const reason = fault === 'outbreak'
        ? `🔥 CRITICAL FIRE RISK DETECTED: Overheating (${Math.round(T)}°C) and 180V brownout overload (${Math.round(I)}A). Virtual Breaker instantly TRIPPED!`
        : fault === 'stall'
        ? `Safety Cutoff: Motor rotor locked under brownout (${Math.round(V)}V); ${Math.round(I)}A heavy surge sustained. Circuit disconnected.`
        : fault === 'micro_arc'
        ? `Spark Hazard Cutoff: Sparking loose contact detected on ${outlet.name}. Power safely cut.`
        : `Overload Safety Trip: Power draw reached ${Math.round(I)}A exceeding safe limit.`;

      forensicAlert = {
        outlet_id: id,
        outlet_name: outlet.name,
        timestamp: timeStr,
        voltage: Math.round(V * 10) / 10,
        current: Math.round(I * 10) / 10,
        cos_phi: Math.round(cos * 100) / 100,
        temperature: Math.round(T * 10) / 10,
        anomaly_score: score,
        trip_latency_ms: 12,
        diagnosis: reason,
      };
    }

    outlet.voltage = Math.round(V * 10) / 10;
    outlet.current = outlet.breaker_state === 'TRIPPED' ? 0.0 : Math.round(I * 10) / 10;
    outlet.cos_phi = Math.round(cos * 100) / 100;
    outlet.power_watts = outlet.breaker_state === 'TRIPPED' ? 0.0 : Math.round(V * I * cos);
    outlet.terminal_temp = Math.round(T * 10) / 10;
    outlet.status = status;
    outlet.anomaly_score = outlet.breaker_state === 'TRIPPED' ? 0.0 : score;
    outlet.is_masked_inrush = isMaskedInrush;

    updatedOutlets[id] = { ...outlet };
  });

  return {
    timestamp: timeStr,
    outlets: updatedOutlets,
    global_anomaly: globalAnomaly,
    forensic_alert: forensicAlert,
  };
}

export function injectFaultEngine(outletId: string, faultMode: FaultMode) {
  if (!simulatedOutlets[outletId]) {
    return { success: false, error: 'Outlet not found' };
  }
  simulatedOutlets[outletId].fault_mode = faultMode;
  simulatedOutlets[outletId].fault_start_time = Date.now();
  return { success: true, outlet_id: outletId, fault_mode: faultMode };
}

export function setBreakerEngine(outletId: string, state: BreakerState) {
  if (!simulatedOutlets[outletId]) {
    return { success: false, error: 'Outlet not found' };
  }
  simulatedOutlets[outletId].breaker_state = state;
  if (state === 'CLOSED') {
    simulatedOutlets[outletId].fault_mode = 'none';
    simulatedOutlets[outletId].status = 'normal';
    simulatedOutlets[outletId].anomaly_score = 0.12;
  } else {
    simulatedOutlets[outletId].current = 0;
    simulatedOutlets[outletId].power_watts = 0;
    simulatedOutlets[outletId].status = 'tripped';
    simulatedOutlets[outletId].anomaly_score = 0.0;
  }
  return { success: true, outlet_id: outletId, state };
}

export function getBillingCensusData() {
  return {
    consumer_number: 'MH-MUM-8921-X',
    consumer_name: 'Rajesh Sharma',
    bill_number: 'ACC-2026-9941',
    tariff_tier: 'Residential LT-1 (Tier 3)',
    rate_per_kwh: 8.50,
    sanctioned_load_kw: 7.5,
    billing_unit_code: 'BU-4022-MUMBAI',
    month_consumed_kwh: 482.5,
    projected_bill_inr: 4101.25,
    outlier_waste_kwh: 34.2,
    outlier_waste_cost_inr: 290.70,
    appliance_shares: [
      { name: 'Master Bed Split AC (1.5T)', kwh: 185.2, percentage: 38.4, color: '#06b6d4' },
      { name: 'Living Room AC (2.0T)', kwh: 162.8, percentage: 33.7, color: '#3b82f6' },
      { name: 'Kitchen Geyser (25A)', kwh: 92.5, percentage: 19.2, color: '#f59e0b' },
      { name: 'Main Refrigerator (500L)', kwh: 42.0, percentage: 8.7, color: '#10b981' },
    ],
    degradation_insights: [
      {
        id: 'master_ac_insight',
        appliance: 'Master Bed Split AC (1.5T)',
        severity: 'WARNING',
        excess_consumption_pct: 26,
        title: 'Abnormal Continuous Drag Detected',
        description: 'Master Bed AC has consumed 26% more energy this week compared to baseline under identical run-hours. High likelihood of clogged filters, low refrigerant pressure, or motor capacitor degradation.',
        recommendation: 'Schedule coil cleaning & refrigerant charge inspection to recover ₹420/month.',
      },
      {
        id: 'geyser_insight',
        appliance: 'Kitchen Geyser (25A)',
        severity: 'OPTIMIZATION',
        excess_consumption_pct: 12,
        title: 'Scaling & Thermal Resistance Spike',
        description: 'Element heating ramp takes 18% longer to satisfy thermostat setpoint. Mineral scaling detected on heating coil element.',
        recommendation: 'Flush tank scaling to reduce thermal resistance waste.',
      },
    ],
  };
}
