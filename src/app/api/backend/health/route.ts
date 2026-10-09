import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'VoltGuard Anomaly Detection Engine (Vercel Serverless)',
    ml_model: 'IsolationForest Simulation (contamination=0.03)',
    timestamp: new Date().toISOString(),
  });
}
