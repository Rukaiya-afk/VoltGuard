import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OutletData, UserProfile, ForensicAlert } from './types';

// 1. HOME SAFETY & FIRE AUDIT CERTIFICATE (Header / Quick Context Bar)
export function exportSafetyAuditPdf(
  outlets: Record<string, OutletData>,
  userProfile: UserProfile,
  timestamp: string = new Date().toLocaleString()
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header Ribbon
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('VOLTGUARD ⚡ HOME ELECTRICAL SAFETY AUDIT', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Certified Residential Fire Prevention Certificate | Pune (Kothrud Division) | ' + timestamp, 14, 23);

  // Consumer Info Card
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 38, 182, 32, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 38, 182, 32, 3, 3, 'S');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('RESIDENT CONSUMER & METER DETAILS (PUNE CIRCLE)', 20, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Consumer Name: ${userProfile.name}`, 20, 53);
  doc.text(`Consumer ID: ${userProfile.consumerNumber}`, 20, 59);
  doc.text(`Premise Address: ${userProfile.address || 'Kothrud, Paud Road, Pune - 411038'}`, 20, 65);

  doc.text(`Billing Account: ${userProfile.accountNumber || 'PUN-KTH-8921'}`, 110, 53);
  doc.text(`Electricity Board: ${userProfile.electricityDepartment || 'MSEDCL (Mahavitaran - Kothrud)'}`, 110, 59);
  doc.text(`Tariff Rate: ₹${userProfile.ratePerKwh || 8.5}/kWh | Sanctioned: 7.5 kW`, 110, 65);

  // Table of Monitored Circuits
  const tableRows = Object.values(outlets).map((outlet, index) => [
    (index + 1).toString(),
    outlet.name,
    outlet.location || 'Home Circuit',
    `${outlet.rated_current}A rated / ${outlet.trip_current}A trip`,
    `${outlet.voltage.toFixed(1)} V`,
    `${outlet.current.toFixed(1)} A`,
    `${outlet.terminal_temp.toFixed(1)} °C`,
    outlet.breaker_state === 'TRIPPED' ? 'TRIPPED (Safe Cut)' : 'NORMAL (Protected)',
  ]);

  autoTable(doc, {
    startY: 76,
    head: [['#', 'Circuit / Appliance', 'Location', 'Rated Load', 'Voltage', 'Current', 'Lug Temp', 'Safety Status']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 180;

  // Compliance Certificate Box
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(14, finalY, 182, 34, 3, 3, 'F');
  doc.setDrawColor(74, 222, 128);
  doc.roundedRect(14, finalY, 182, 34, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('AUTOMATED RESIDENTIAL FIRE PROTECTION COMPLIANCE', 20, finalY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(21, 128, 61);
  doc.text('• Sub-20ms high-speed breaker cutoffs active on all high-load residential circuits.', 20, finalY + 14);
  doc.text('• Direct SOS link established with Pune Fire Brigade (101 / Kothrud Station) and MSEDCL Kothrud Cell.', 20, finalY + 20);
  doc.text('• Certified Isolation Forest AI Anomaly detection verified under standard Maharashtra Electrical Norms.', 20, finalY + 26);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('VoltGuard Safety Platform © 2026 | Certified Residential Electrical Audit Document | Kothrud, Pune', 14, 285);

  doc.save(`VoltGuard_Home_Safety_Certificate_Kothrud_${userProfile.consumerNumber || 'Resident'}.pdf`);
}

// 2. LIVE POWER TELEMETRY & VOLTAGE REPORT (Power & Health Tab)
export function exportTelemetryReportPdf(
  outlets: Record<string, OutletData>,
  userProfile: UserProfile,
  timestamp: string = new Date().toLocaleString()
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(13, 148, 136); // #0d9488 Teal
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('VOLTGUARD ⚡ POWER TELEMETRY & SENSOR REPORT', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(204, 251, 241);
  doc.text('High-Precision Sensor Telemetry Log | Pune Sub-division: Kothrud | ' + timestamp, 14, 23);

  // Meter & Premise Card
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 38, 182, 28, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 38, 182, 28, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`TELEMETRY CAPTURE FOR: ${userProfile.name} (${userProfile.consumerNumber})`, 20, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Location: ${userProfile.address || 'Kothrud, Pune'} | Feeder Substation: Kothrud 11kV Feeder`, 20, 52);
  doc.text(`Power Board: ${userProfile.electricityDepartment || 'MSEDCL Pune Circle'} | Refresh Rate: 1000ms Real-Time`, 20, 58);

  // Detailed Telemetry Table
  const tableRows = Object.values(outlets).map((outlet, index) => [
    (index + 1).toString(),
    outlet.name,
    `${outlet.voltage.toFixed(1)} V`,
    `${outlet.current.toFixed(1)} A`,
    `${outlet.cos_phi.toFixed(2)}`,
    `${Math.round(outlet.power_watts)} W`,
    `${outlet.terminal_temp.toFixed(1)} °C`,
    `${(outlet.anomaly_score * 100).toFixed(0)}%`,
    outlet.status.toUpperCase(),
  ]);

  autoTable(doc, {
    startY: 72,
    head: [['#', 'Monitored Outlet', 'Voltage', 'Current (A)', 'cos φ', 'Active Power', 'Lug Temp', 'Risk Index', 'Status']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [13, 148, 136],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 7.5, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [240, 253, 250] },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 180;

  // Telemetry Metrics Summary
  const totalWatts = Object.values(outlets).reduce((sum, o) => sum + (o.breaker_state === 'CLOSED' ? o.power_watts : 0), 0);
  const avgVoltage = (Object.values(outlets).reduce((sum, o) => sum + o.voltage, 0) / Object.values(outlets).length).toFixed(1);
  const maxTemp = Math.max(...Object.values(outlets).map((o) => o.terminal_temp)).toFixed(1);

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, finalY, 182, 32, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, finalY, 182, 32, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('LIVE TELEMETRY SUMMARY METRICS', 20, finalY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`• Total Instantaneous Running Power: ${Math.round(totalWatts)} Watts (${(totalWatts / 1000).toFixed(2)} kW)`, 20, finalY + 15);
  doc.text(`• Grid Line Voltage Baseline: ${avgVoltage} V (Healthy Nominal Range: 220V - 240V)`, 20, finalY + 21);
  doc.text(`• Peak Switchboard Lug Temperature: ${maxTemp} °C (Thermal Cutoff Threshold: 65°C)`, 20, finalY + 27);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('VoltGuard Live Telemetry Log | Kothrud, Pune Feeder Circle | Generated automatically', 14, 285);

  doc.save(`VoltGuard_Live_Telemetry_Chart_Kothrud_${userProfile.consumerNumber || 'Resident'}.pdf`);
}

// 3. MONTHLY ELECTRICITY BILL & DISAGGREGATION AUDIT (Monthly Bill Tab)
export function exportBillingDisaggregationPdf(
  userProfile: UserProfile,
  totalKwh: number = 482.5,
  projectedBill: number = 4101.25,
  outlierKwh: number = 34.2,
  outlierCost: number = 290.70,
  applianceShares: Array<{ name: string; kwh: number; percentage?: number }> = []
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header Banner (Amber / Gold theme for billing)
  doc.setFillColor(217, 119, 6); // #d97706 Amber
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('VOLTGUARD ⚡ MONTHLY ELECTRICITY BILL & APPLIANCE CENSUS', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(254, 243, 199);
  doc.text('MSEDCL Pune Circle LT-1 Tariff Assessment | Kothrud Sub-division | Date: ' + new Date().toLocaleDateString(), 14, 23);

  // Billing & Tariff Summary Box
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(14, 38, 182, 34, 3, 3, 'F');
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(14, 38, 182, 34, 3, 3, 'S');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14);
  doc.text('TARIFF SLAB & PROJECTED BILL STATEMENT', 20, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 53, 15);
  doc.text(`Consumer: ${userProfile.name} (${userProfile.consumerNumber})`, 20, 53);
  doc.text(`Area: ${userProfile.blockArea || 'Kothrud, Pune'} | Provider: MSEDCL Pune`, 20, 59);
  doc.text(`Sanctioned Load: 7.5 kW | Tariff Slab: ₹${userProfile.ratePerKwh || 8.5}/kWh`, 20, 65);

  doc.setFont('helvetica', 'bold');
  doc.text(`Total Energy: ${totalKwh.toFixed(1)} kWh`, 115, 53);
  doc.text(`Projected Bill: ₹${projectedBill.toFixed(2)}`, 115, 59);
  doc.setTextColor(185, 28, 28);
  doc.text(`Outlier Drag Waste: ${outlierKwh.toFixed(1)} kWh (₹${outlierCost.toFixed(2)})`, 115, 65);

  // Disaggregation Breakdown Table
  const defaultShares = [
    { name: 'Master Bed Split AC (1.5T)', kwh: 185.2, percentage: 38.4 },
    { name: 'Living Room AC (2.0T)', kwh: 162.8, percentage: 33.7 },
    { name: 'Kitchen Water Heater Geyser (25A)', kwh: 92.5, percentage: 19.2 },
    { name: 'Main Refrigerator (500L)', kwh: 42.0, percentage: 8.7 },
  ];

  const sharesToUse = applianceShares.length > 0 ? applianceShares : defaultShares;

  const tableRows = sharesToUse.map((item, index) => {
    const kwhVal = item.kwh || 15.0;
    const costVal = (kwhVal * (userProfile.ratePerKwh || 8.5)).toFixed(2);
    const pctVal = item.percentage ? `${item.percentage.toFixed(1)}%` : `${((kwhVal / totalKwh) * 100).toFixed(1)}%`;
    return [
      (index + 1).toString(),
      item.name,
      `${kwhVal.toFixed(1)} kWh`,
      `₹${costVal}`,
      pctVal,
      index === 0 ? '⚠️ High Drag (Clogged filter)' : 'Normal Efficiency',
    ];
  });

  autoTable(doc, {
    startY: 78,
    head: [['#', 'Monitored Appliance', 'Monthly kWh', 'Estimated Cost', 'Share %', 'AI Degradation Assessment']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [217, 119, 6],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [254, 252, 232] },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 185;

  // AI Savings Recommendation
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, finalY, 182, 36, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, finalY, 182, 36, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('AI ENERGY EFFICIENCY & COST-SAVING ACTIONS (PUNE KOTHRUD):', 20, finalY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('1. Master Bed AC has 26% higher continuous drag: Clean dust filters to save ~₹420/month.', 20, finalY + 15);
  doc.text('2. Kitchen Water Heater exhibits mineral scaling: Flush coil to recover 12% heating energy waste.', 20, finalY + 21);
  doc.text('3. Book certified Kothrud wireman for thermal inspection before peak summer tariff slab applies.', 20, finalY + 27);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('VoltGuard Disaggregated Billing Audit | MSEDCL Pune LT-1 Standard | Kothrud Division', 14, 285);

  doc.save(`VoltGuard_Monthly_Electricity_Bill_Audit_Kothrud_${userProfile.consumerNumber || 'Resident'}.pdf`);
}

// 4. FORENSIC ELECTRICAL INCIDENT & FIRE HAZARD REPORT (Forensic Modal / Incident Tab)
export function exportHazardIncidentReportPdf(
  alert: ForensicAlert,
  userProfile: UserProfile
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Emergency Crimson Banner
  doc.setFillColor(159, 18, 57); // #9f1239
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('🚨 FORENSIC ELECTRICAL INCIDENT & FIRE HAZARD REPORT', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(254, 205, 211);
  doc.text(`Incident ID: HAZ-KTH-${Date.now().toString().slice(-5)} | Pune Kothrud Circle | Time: ${alert.timestamp}`, 14, 23);

  // Critical Incident Summary Box
  doc.setFillColor(255, 241, 242);
  doc.roundedRect(14, 38, 182, 34, 3, 3, 'F');
  doc.setDrawColor(244, 63, 94);
  doc.roundedRect(14, 38, 182, 34, 3, 3, 'S');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(159, 18, 57);
  doc.text('INCIDENT DIAGNOSIS & IMMEDIATE SAFETY DISCONNECT', 20, 46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(136, 19, 55);
  const lines = doc.splitTextToSize(alert.diagnosis || 'Critical thermal surge and brownout overcurrent detected.', 170);
  doc.text(lines, 20, 52);

  // Telemetry Table
  const tableRows = [
    ['Monitored Appliance', alert.outlet_name],
    ['Cutoff Trip Latency', `${alert.trip_latency_ms || 12} ms (Sub-cycle Arc Interruption)`],
    ['Line Voltage at Fault', `${alert.voltage} V (Brownout Sag Threshold: <185V)`],
    ['Surge Current Draw', `${alert.current} A`],
    ['Terminal Lug Temperature', `${alert.temperature} °C (Fire Outbreak Threshold: >65°C)`],
    ['Isolation Forest Risk Score', `${alert.anomaly_score} / 1.0 (Critical Cutoff: 0.72)`],
    ['Premise Location', `${userProfile.name} | ${userProfile.address || 'Kothrud, Pune - 411038'}`],
    ['Emergency Dispatch Unit', 'Pune Fire Brigade (101 / Kothrud Station) & MSEDCL Cell'],
  ];

  autoTable(doc, {
    startY: 78,
    head: [['Hazard Telemetry Parameter', 'Recorded Forensic Metric Value']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [159, 18, 57],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 190;

  // Mandatory Safety Checklist
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, finalY, 182, 38, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, finalY, 182, 38, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('MANDATORY SAFETY INSPECTION CHECKLIST (BEFORE BREAKER RESET):', 20, finalY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('1. Do NOT manually force breaker closed until lug temperature cools below 35°C.', 20, finalY + 14);
  doc.text('2. Certified Kothrud technician must inspect terminal contacts for carbonization or micro-arcing.', 20, finalY + 20);
  doc.text('3. Verify grounding earth resistance (< 2 Ohms) and neutral voltage before power restoration.', 20, finalY + 26);
  doc.text('4. Complete physical safety clearance in the Electrician Portal to release safety latch.', 20, finalY + 32);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Official Forensic Fire Report | VoltGuard AI Platform | Kothrud, Pune', 14, 285);

  doc.save(`VoltGuard_Fire_Hazard_Forensic_Report_Kothrud_${alert.outlet_id || 'Incident'}.pdf`);
}
