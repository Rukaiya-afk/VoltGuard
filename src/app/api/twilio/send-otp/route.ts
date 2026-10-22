import { NextResponse } from 'next/server';
import { sendOtpSms } from '@/lib/twilioClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumber, message } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const result = await sendOtpSms(phoneNumber, message);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
