import { NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabase } from '@/lib/supabaseClient';

export async function GET() {
  const configured = isSupabaseConfigured();
  
  if (!configured) {
    return NextResponse.json({
      configured: false,
      database: 'PostgreSQL (Supabase)',
      status: 'offline_local_storage',
      message: 'Supabase URL/Anon key not set in .env.local. Operating in offline local storage mode.',
      help: 'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to activate cloud PostgreSQL.',
    });
  }

  try {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Client creation failed');

    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) throw error;

    return NextResponse.json({
      configured: true,
      database: 'PostgreSQL (Supabase Cloud)',
      status: 'connected',
      message: 'Successfully connected to PostgreSQL on Supabase.',
    });
  } catch (err: any) {
    return NextResponse.json({
      configured: true,
      database: 'PostgreSQL (Supabase Cloud)',
      status: 'connection_error',
      message: err.message,
    }, { status: 500 });
  }
}
