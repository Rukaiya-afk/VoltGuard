import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase PostgreSQL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let client: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('http') && 
    !supabaseUrl.includes('your-project')
  );
};

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
};

// Database operation helpers with automatic fallback
export async function syncTicketToDatabase(ticket: {
  id: string;
  consumerName: string;
  title: string;
  description: string;
  type?: string;
  priority?: string;
  status?: string;
}) {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: true, localOnly: true, ticket };
  }

  try {
    const { data, error } = await supabase.from('support_tickets').upsert({
      id: ticket.id,
      consumer_name: ticket.consumerName,
      title: ticket.title,
      description: ticket.description,
      type: ticket.type || 'repair_request',
      priority: ticket.priority || 'HIGH',
      status: ticket.status || 'OPEN',
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    return { success: true, localOnly: false, data };
  } catch (err: any) {
    console.warn('Supabase ticket sync error, retained in local storage:', err.message);
    return { success: false, error: err.message, localOnly: true };
  }
}

export async function recordPaymentInDatabase(payment: {
  consumerNumber: string;
  consumerName: string;
  billingMonth: string;
  amount: number;
  paymentMethod: 'UPI' | 'GPAY' | 'PAYTM' | 'DEBIT_CARD' | 'CREDIT_CARD';
  transactionId: string;
  vpaOrCardMasked?: string;
}) {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: true, localOnly: true, payment };
  }

  try {
    const { data, error } = await supabase.from('bill_payments').insert({
      consumer_number: payment.consumerNumber,
      consumer_name: payment.consumerName,
      billing_month: payment.billingMonth,
      amount_inr: payment.amount,
      payment_method: payment.paymentMethod,
      transaction_id: payment.transactionId,
      vpa_or_card_masked: payment.vpaOrCardMasked,
      status: 'PAID',
      paid_at: new Date().toISOString(),
    });

    if (error) throw error;
    return { success: true, localOnly: false, data };
  } catch (err: any) {
    console.warn('Supabase payment recording error:', err.message);
    return { success: false, error: err.message, localOnly: true };
  }
}

export async function saveLiveSensorLog(log: {
  outletId: string;
  voltage: number;
  current: number;
  cosPhi: number;
  powerWatts: number;
  terminalTemp: number;
  anomalyScore: number;
}) {
  const supabase = getSupabase();
  if (!supabase) return { success: true, localOnly: true };

  try {
    const { error } = await supabase.from('sensor_logs').insert({
      outlet_id: log.outletId,
      voltage: log.voltage,
      current: log.current,
      cos_phi: log.cosPhi,
      power_watts: log.powerWatts,
      terminal_temp: log.terminalTemp,
      anomaly_score: log.anomalyScore,
    });
    if (error) throw error;
    return { success: true, localOnly: false };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
