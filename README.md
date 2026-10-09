# VoltGuard ⚡ | AI Residential Circuit Anomaly & Fire Mitigation Platform

VoltGuard is a production-ready, low-latency, interactive web application built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Lucide React**, **Recharts**, **Framer Motion**, **Zustand**, and an asynchronous **Python FastAPI** backend embedded with an **Isolation Forest ML model** trained on standard UCI Household Electric / PLAID datasets.

---

## 🌟 Key System Capabilities

1. **Authentication & Onboarding Portal**:
   - Seamless Auth Portal with Sign In / Sign Up modes.
   - Credentials fields: Consumer Number (`MH-MUM-8921-X`), Email, Password.
   - Prominent **"Continue with Google"** OAuth simulation.
   - **Forgot Password Flow**: Multi-step interactive wizard (Consumer ID -> OTP Verification Simulation `482910` -> Password Reset).
   - Frictionless **"Enter as Guest / Demo Consumer"** bypass button.

2. **Fixed Header & Consumer Context Bar**:
   - Active telemetry heartbeat indicator (green pulsing ping).
   - Consumer Profile Chip with Customer Name (*Rajesh Sharma*), Consumer ID (`MH-MUM-8921-X`), Account ID, Tariff Slab Rate (`₹8.50/kWh`).
   - Quick access controls: Global Safety Reset / Latch Override, Audio Alarm Toggle (Mute/Unmute), Settings Nav.

3. **Digital Twin Switchboard Matrix (Tab 1)**:
   - Real-time digital twin grid for 4 high-load circuits: *Master Bed Split AC (1.5T)*, *Living Room AC (2.0T)*, *Kitchen Geyser (25A)*, *Main Refrigerator (500L)*.
   - Live metrics per outlet: $V_{RMS}$, $I_{RMS}$, $\cos\phi$, Running Watts ($W$), Lug Terminal Temperature ($^\circ\text{C}$).
   - **Dynamic Status Badges**:
     - **Normal (Emerald pulse)**: Regular baseline operation.
     - **Inrush Transient (Blue indicator)**: Safe motor turn-on masked by algorithm.
     - **Anomalous Load / Fire Risk (Crimson flash)**: Safety cutoff triggered.
   - **Interactive Controls**: Manual Virtual Breaker Toggle (Power On / Trip), Test Fault Injector (Normal Run, Safe Inrush 300ms, Voltage Sag / Locked Rotor Stall, Micro-Arcing Loose Contact).

4. **Live Telemetry & Transient Oscilloscope (Tab 2)**:
   - Multi-axis synchronized Recharts graph updating every 1-second interval.
   - Top Graph: Current (A) vs Time with $I_{rated}$ and $I_{trip}$ boundary lines.
   - Middle Graph: Line Voltage (V) with low-voltage brownout line (<185V).
   - Bottom Graph: Lug Terminal Temperature ($^\circ\text{C}$) and continuous Isolation Forest Anomaly Score ($0.0 - 1.0$).

5. **Utility Billing Census & Slab Predictor (Tab 3)**:
   - Tariff structure details, sanctioned load (kW), billing unit code.
   - Metric cards: Current Month Consumed (kWh), Projected Monthly Bill (₹), Outlier Consumption Waste (kWh).
   - Interactive Donut & Bar Charts for appliance power disaggregation.
   - **AI Appliance Degradation & Outlier Insights**: Pinpoints abnormal continuous drag (e.g. 26% excess consumption due to clogged filters or refrigerant drag) and recommends bill-saving actions.

6. **Forensic Post-Mortem Incident & Emergency Alarming System**:
   - Automatic Breaker Trip Cutoff in sub-20ms when anomaly score exceeds $s > 0.72$ or hard thermal/voltage limits occur.
   - Flashing high-priority emergency alarm banner across the top.
   - **Web Audio API Synthesizer**: Industrial Buzzer, Pulse Siren, Soft Chime, Custom Frequency Synthesizer, or uploaded MP3/WAV alert tone.
   - **Forensic Post-Mortem Modal**: 5-second pre-trip telemetry snapshot + root-cause diagnosis.
   - **Safety Latch Lockout Protocol**: Operator must acknowledge hazard inspection before circuit power can be restored.

7. **Customization & Sound Settings Page (`/settings`)**:
   - Visual Themes: Modern OLED Dark, Deep Slate, Minimal Light.
   - Refresh rate options: 500ms (High Performance), 1s (Balanced), 2s (Eco Saver).
   - Anomaly Sensitivity Slider: 0.50 to 0.95 (default 0.75).
   - Alert Tone selection, live sound preview button, custom MP3/WAV file uploader saved to `localStorage`.

---

## 🚀 How to Run VoltGuard

### Option A: Running Next.js Frontend App
```bash
npm run dev
# App will start on http://localhost:3000
```

### Option B: Running Python FastAPI ML Backend Server (Optional)
```bash
python backend/main.py
# FastAPI server will start on http://localhost:8000
```

---

## ⚡ Deploying to Vercel

VoltGuard is completely **Vercel-ready** out of the box with zero configuration:

1. **Push to GitHub**:
   Ensure your code is pushed to your GitHub/GitLab repository.

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your VoltGuard repository.
   - Vercel automatically detects **Next.js** framework preset.
   - Click **Deploy**!

### Hybrid Architecture on Vercel
- **Zero Config Mode (Default)**: VoltGuard automatically serves telemetry, real-time SSE streaming, breaker control, and billing census via high-performance Next.js Serverless Route Handlers (`src/app/api/backend/*`). No Python server required!
- **External FastAPI Backend Mode (Optional)**: If you choose to host the Python FastAPI server separately (e.g. on Railway, Render, Fly.io, or AWS), simply add the following Environment Variable in your Vercel Project Settings:
  ```env
  BACKEND_URL=https://your-fastapi-backend-url.com
  ```
  VoltGuard will automatically proxy API requests to your remote Python backend.

