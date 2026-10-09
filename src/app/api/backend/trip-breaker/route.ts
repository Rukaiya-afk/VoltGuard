import { NextResponse } from 'next/server';
import { setBreakerEngine } from '@/lib/telemetryEngine';
import { BreakerState } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { outlet_id, state } = body;

    if (!outlet_id || !state) {
      return NextResponse.json(
        { error: 'outlet_id and state are required' },
        { status: 400 }
      );
    }

    if (state !== 'CLOSED' && state !== 'TRIPPED') {
      return NextResponse.json(
        { error: 'State must be CLOSED or TRIPPED' },
        { status: 400 }
      );
    }

    const result = setBreakerEngine(outlet_id, state as BreakerState);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      outlet_id,
      state,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON request body' },
      { status: 400 }
    );
  }
}
