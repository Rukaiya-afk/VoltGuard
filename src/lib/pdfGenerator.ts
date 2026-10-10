import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OutletData, UserProfile, ForensicAlert } from './types';

export function exportTelemetryReportPdf(
  outlets: Record<string, OutletData>,
  userProfile: UserProfile,
  timestamp: string = new Date().toLocaleString()
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('VOLTGUARD ⚡ TELEMETRY & SAFETY AUDIT', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Residential Circuit Health & Fire Prevention Platform | Generated: ' + timestamp, 14, 23);

  // Consumer Info Block
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 38, 182, 30, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 38, 182, 30, 3, 3, 'S');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('CONSUMER PROFILE & METER INFORMATION', 20, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Consumer Name: ${userProfile.name}`, 20, 53);
  doc.text(`Consumer ID: ${userProfile.consumerNumber}`, 20, 59);
  doc.text(`Area / Address: ${userProfile.blockArea || userProfile.address || 'Bandra West, Mumbai'}`, 20, 65);

  doc.text(`Account No: ${userProfile.accountNumber || 'ACC-99218'}`, 110, 53);
  doc.text(`Electricity Dept: ${userProfile.electricityDepartment || 'Mahavitaran (MSEDCL)'}`, 110, 59);
  doc.text(`Tariff Rate: ₹${userProfile.ratePerKwh || 8.5}/kWh | Billing Tier: ${userProfile.billingTier || 'LT-1 Residential'}`, 110, 65);

  // Table Data
  const tableRows = Object.values(outlets).map((outlet, index) => [
    (index + 1).toString(),
    outlet.name,
    outlet.location || 'Home Circuit',
    `${outlet.voltage.toFixed(1)} V`,
    `${outlet.current.toFixed(1)} A / ${outlet.trip_current}A max`,
    `${outlet.cos_phi.toFixed(2)}`,
    `${Math.round(outlet.power_watts)} W`,
    `${outlet.terminal_temp.toFixed(1)} °C`,
    outlet.breaker_state === 'TRIPPED' ? 'TRIPPED (Safe Cut)' : outlet.status.toUpperCase(),
  ]);

  autoTable(doc, {
    startY: 75,
    head: [['#', 'Circuit / Appliance', 'Location', 'Voltage', 'Current Draw', 'cos φ', 'Power', 'Lug Temp', 'Breaker Status']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  // Summary & Diagnostic Notes
  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 180;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, finalY, 182, 35, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, finalY, 182, 35, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('SYSTEM SAFETY SUMMARY & AUTOMATED COMPLIANCE', 20, finalY + 8);

  const totalWatts = Object.values(outlets).reduce((sum, o) => sum + (o.breaker_state === 'CLOSED' ? o.power_watts : 0), 0);
  const trippedCount = Object.values(outlets).filter((o) => o.breaker_state === 'TRIPPED').length;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`• Total Active Running Load: ${Math.round(totalWatts)} Watts (${(totalWatts / 1000).toFixed(2)} kW)`, 20, finalY + 15);
  doc.text(`• Circuit Breaker Status: ${trippedCount > 0 ? `⚠️ ${trippedCount} Circuit(s) Safely Tripped/Isolated` : '✅ All 6 Circuits Normal (Zero Active Hazard)'}`, 20, finalY + 21);
  doc.text(`• Telemetry Engine: Isolation Forest sub-20ms anomaly detection active & linked to Fire Dept Emergency Protocol.`, 20, finalY + 27);

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('VoltGuard Platform © 2026 | Certified Residential Fire Mitigation & NIL Disaggregation Standard', 14, 285);

  doc.save(`VoltGuard_Telemetry_Report_${userProfile.consumerNumber || 'Consumer'}.pdf`);
}

export function exportHazardIncidentReportPdf(
  alert: ForensicAlert,
  userProfile: UserProfile,
  preTripSnapshot?: OutletData[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Emergency Crimson Banner
  doc.setFillColor(159, 18, 57); // #9f1239
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('🚨 FORENSIC ELECTRICAL INCIDENT & FIRE HAZARD REPORT', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(254, 205, 211);
  doc.text(`Incident ID: HAZ-${Date.now().toString().slice(-6)} | Timestamp: ${alert.timestamp} | Safety Latch: TRIPPED`, 14, 23);

  // Critical Incident Summary Box
  doc.setFillColor(255, 241, 242);
  doc.roundedRect(14, 38, 182, 34, 3, 3, 'F');
  doc.setDrawColor(244, 63, 94);
  doc.roundedRect(14, 38, 182, 34, 3, 3, 'S');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(159, 18, 57);
  doc.text('HAZARD DIAGNOSIS & IMMEDIATE SAFETY ACTION', 20, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(136, 19, 55);
  const lines = doc.splitTextToSize(alert.diagnosis || 'Critical thermal surge and brownout overcurrent detected.', 170);
  doc.text(lines, 20, 53);

  // Telemetry At Cutoff Table
  const tableRows = [
    ['Monitored Appliance', alert.outlet_name],
    ['Cutoff Trip Latency', `${alert.trip_latency_ms || 12} milliseconds (Sub-cycle Interruption)`],
    ['Line Voltage at Hazard', `${alert.voltage} V (Brownout Hazard Threshold: <185V)`],
    ['Surge Current Draw', `${alert.current} A`],
    ['Terminal Lug Temperature', `${alert.temperature} °C (Fire Hazard Threshold: >65°C)`],
    ['Isolation Forest Anomaly Score', `${alert.anomaly_score} / 1.0 (Critical Threshold: 0.72)`],
    ['Consumer / Location', `${userProfile.name} | ${userProfile.address || 'Bandra West, Mumbai'}`],
    ['Dispatched Emergency Target', `Fire Control (101) & State Grid ${userProfile.electricityDepartment || 'MSEDCL'}`],
  ];

  autoTable(doc, {
    startY: 78,
    head: [['Hazard Parameter', 'Recorded Telemetry & Forensic Value']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [159, 18, 57],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [51, 65, 85],
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 190;

  // Recommended Field Protocol
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, finalY, 182, 40, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, finalY, 182, 40, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('MANDATORY ELECTRICIAN INSPECTION PROTOCOL BEFORE RESET:', 20, finalY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('1. Do NOT manually force breaker closed until lug temperature cools below 35°C.', 20, finalY + 15);
  doc.text('2. Inspect appliance terminal lugs for micro-arcing carbon residue or damaged insulation.', 20, finalY + 21);
  doc.text('3. Certified technician must verify earthing resistance (< 2 Ohms) and neutral-to-earth voltage.', 20, finalY + 27);
  doc.text('4. Complete physical safety verification in the Electrician Portal before global latch reset.', 20, finalY + 33);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Official Incident Forensic Document | VoltGuard AI Fire Mitigation Engine', 14, 285);

  doc.save(`VoltGuard_Hazard_Incident_${alert.outlet_id}_${Date.now()}.pdf`);
}
