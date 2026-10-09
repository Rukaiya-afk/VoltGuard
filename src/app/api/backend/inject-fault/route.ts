import { NextResponse } from 'next/server';
import { injectFaultEngine } from '@/lib/telemetryEngine';
import { FaultMode } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { outlet_id, fault_mode } = body;

    if (!outlet_id || !fault_mode) {
      return NextResponse.json(
        { error: 'outlet_id and fault_mode are required' },
        { status: 400 }
      );
    }

    const result = injectFaultEngine(outlet_id, fault_mode as FaultMode);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      outlet_id,
      fault_mode,
      message: `Fault '${fault_mode}' injected into ${outlet_id}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON request body' },
      { status: 400 }
    );
  }
}
