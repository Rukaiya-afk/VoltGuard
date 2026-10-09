import { NextResponse } from 'next/server';
import { getBillingCensusData } from '@/lib/telemetryEngine';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = getBillingCensusData();
  return NextResponse.json(data);
}
