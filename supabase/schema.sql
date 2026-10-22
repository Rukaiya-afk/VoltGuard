-- =========================================================================
-- VoltGuard: PostgreSQL Schema for Supabase Cloud Database Integration
-- Primary Region: Pune / Kothrud Grid Circle (MSEDCL LT-1 Residential)
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & RESIDENTS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    consumer_number TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'electrician', 'admin')),
    phone TEXT,
    address TEXT,
    city TEXT DEFAULT 'Pune',
    block_area TEXT,
    pincode TEXT DEFAULT '411038',
    electricity_department TEXT DEFAULT 'MSEDCL (Mahavitaran - Kothrud)',
    account_number TEXT,
    billing_tier TEXT DEFAULT 'Residential LT-1 (Tier 3)',
    rate_per_kwh NUMERIC(6, 2) DEFAULT 8.50,
    is_high_risk BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. APPLIANCE OUTLETS & SENSORS
CREATE TABLE IF NOT EXISTS public.outlets (
    id TEXT PRIMARY KEY,
    consumer_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    model_number TEXT,
    location TEXT,
    rated_current NUMERIC(6, 2) NOT NULL DEFAULT 16.0,
    trip_current NUMERIC(6, 2) NOT NULL DEFAULT 25.0,
    voltage NUMERIC(6, 2) DEFAULT 230.0,
    current NUMERIC(6, 2) DEFAULT 0.0,
    cos_phi NUMERIC(4, 2) DEFAULT 0.92,
    power_watts NUMERIC(10, 2) DEFAULT 0.0,
    terminal_temp NUMERIC(6, 2) DEFAULT 32.0,
    status TEXT DEFAULT 'normal' CHECK (status IN ('normal', 'inrush', 'anomalous', 'tripped', 'outbreak')),
    breaker_state TEXT DEFAULT 'CLOSED' CHECK (breaker_state IN ('CLOSED', 'TRIPPED')),
    fault_mode TEXT DEFAULT 'none',
    anomaly_score NUMERIC(4, 3) DEFAULT 0.12,
    is_spiked_risk BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ELECTRICAL LIVE SENSOR LOGS (High Frequency Aggregates)
CREATE TABLE IF NOT EXISTS public.sensor_logs (
    id BIGSERIAL PRIMARY KEY,
    outlet_id TEXT REFERENCES public.outlets(id) ON DELETE CASCADE,
    voltage NUMERIC(6, 2) NOT NULL,
    current NUMERIC(6, 2) NOT NULL,
    cos_phi NUMERIC(4, 2) NOT NULL,
    power_watts NUMERIC(10, 2) NOT NULL,
    terminal_temp NUMERIC(6, 2) NOT NULL,
    anomaly_score NUMERIC(4, 3) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUPPORT & FAULT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id TEXT PRIMARY KEY,
    consumer_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    consumer_name TEXT NOT NULL,
    consumer_address TEXT,
    consumer_area TEXT,
    consumer_department TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'repair_request',
    priority TEXT NOT NULL DEFAULT 'HIGH' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL_HAZARD')),
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    assigned_electrician_id TEXT,
    assigned_electrician_name TEXT,
    scheduled_slot TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REAL-TIME CHAT & TWILIO SMS / OTP LOGS
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ticket_id TEXT REFERENCES public.support_tickets(id) ON DELETE SET NULL,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'electrician', 'admin')),
    recipient_id TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'user_admin',
    message_text TEXT NOT NULL,
    is_sms_otp BOOLEAN DEFAULT FALSE,
    sms_otp_code TEXT,
    sms_delivery_status TEXT DEFAULT 'DELIVERED',
    twilio_message_sid TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MONTHLY UTILITY BILLS & PAYMENT TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.bill_payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    consumer_number TEXT NOT NULL,
    consumer_name TEXT NOT NULL,
    billing_month TEXT NOT NULL,
    billing_tier TEXT NOT NULL DEFAULT 'Residential LT-1 (Pune Urban)',
    units_kwh NUMERIC(8, 2) NOT NULL DEFAULT 482.5,
    amount_inr NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'GPAY', 'PAYTM', 'DEBIT_CARD', 'CREDIT_CARD')),
    transaction_id TEXT UNIQUE NOT NULL,
    vpa_or_card_masked TEXT,
    status TEXT NOT NULL DEFAULT 'PAID' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    emergency_contact_contacted BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FORENSIC INCIDENT REPORTS (Pre-Trip Hazards & Thermal Runaways)
CREATE TABLE IF NOT EXISTS public.forensic_incidents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    outlet_id TEXT NOT NULL,
    outlet_name TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    voltage NUMERIC(6, 2) NOT NULL,
    current NUMERIC(6, 2) NOT NULL,
    cos_phi NUMERIC(4, 2) NOT NULL,
    temperature NUMERIC(6, 2) NOT NULL,
    anomaly_score NUMERIC(4, 3) NOT NULL,
    trip_latency_ms INTEGER DEFAULT 12,
    emergency_number_dialed TEXT DEFAULT '1921',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forensic_incidents ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated & public demo users
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read outlets" ON public.outlets FOR SELECT USING (true);
CREATE POLICY "Public write outlets" ON public.outlets FOR ALL USING (true);
CREATE POLICY "Public read tickets" ON public.support_tickets FOR SELECT USING (true);
CREATE POLICY "Public write tickets" ON public.support_tickets FOR ALL USING (true);
CREATE POLICY "Public read chats" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Public write chats" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read payments" ON public.bill_payments FOR SELECT USING (true);
CREATE POLICY "Public write payments" ON public.bill_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read forensics" ON public.forensic_incidents FOR ALL USING (true);

-- -------------------------------------------------------------------------
-- INITIAL SEED DATA (Kothrud, Pune Ecosystem)
-- -------------------------------------------------------------------------
INSERT INTO public.profiles (id, consumer_number, name, email, role, phone, address, block_area, pincode, billing_tier, rate_per_kwh, is_high_risk)
VALUES
('user-rajesh', 'MH-PUN-8921-K', 'Rajesh Sharma (Senior Resident)', 'rajesh.sharma@gmail.com', 'user', '+91 98201 44821', 'Flat 402, Shanti Sadan, Near Karve Statue, Kothrud, Pune', 'Kothrud (Paud Road - Block 4)', '411038', 'Residential LT-1 (Tier 3)', 8.50, false),
('user-priya', 'MH-PUN-4102-K', 'Priya Patel', 'priya.patel@gmail.com', 'user', '+91 98192 33410', 'Bungalow 7, Mayur Colony, Near Dashbhuja Ganpati, Kothrud, Pune', 'Mayur Colony / Ideal Colony, Kothrud', '411038', 'Residential LT-1 (Tier 2)', 7.80, false),
('user-amit', 'MH-PUN-7731-K', 'Amit Verma', 'amit.verma@gmail.com', 'user', '+91 97690 12345', 'Tower B-1204, Dahanukar Colony, Near Cummins College, Karve Nagar, Pune', 'Dahanukar Colony / Karve Nagar, Pune', '411052', 'Residential LT-1 (Tier 3)', 8.90, true),
('user-spiked', 'MH-PUN-9999-SPIKE', 'Karan Malhotra (Spiked Load - Hazard Alert)', 'karan.malhotra@gmail.com', 'user', '+91 98220 19210', 'Penthouse 1102, Tejas Height, Near Kothrud Bus Depot, Pune', 'Kothrud Bus Stand / Paud Road, Pune', '411038', 'Residential LT-1 (Tier 3 - Overload)', 9.20, true),
('admin-rukaiya', 'ADM-PUN-001', 'Rukaiya (Chief Safety Administrator)', 'rukaiya.admin@gmail.com', 'admin', '+91 98230 19210', 'MSEDCL Central Substation Command, Kothrud Division, Pune', 'Central Grid Control Desk', '411038', 'Commercial HT-1', 11.20, false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Seed Outlets for Spiked Load Resident
INSERT INTO public.outlets (id, consumer_id, name, model_number, location, rated_current, trip_current, voltage, current, cos_phi, power_watts, terminal_temp, status, breaker_state, fault_mode, anomaly_score, is_spiked_risk)
VALUES
('outlet_spiked_geyser', 'user-spiked', 'Kitchen Heavy Geyser (25A High Surge)', 'Racold Pronto 25A Coil', 'Kitchen Utility', 16.0, 25.0, 182.0, 38.4, 0.62, 4330.0, 84.5, 'anomalous', 'CLOSED', 'stall', 0.98, true),
('outlet_spiked_ac', 'user-spiked', 'Master Bedroom AC (2.0 Ton High Current)', 'Voltas Inverter 2.0T', 'Master Bedroom', 16.0, 20.0, 228.0, 14.8, 0.88, 2969.0, 38.0, 'normal', 'CLOSED', 'none', 0.12, false)
ON CONFLICT (id) DO UPDATE SET current = EXCLUDED.current, breaker_state = EXCLUDED.breaker_state;
