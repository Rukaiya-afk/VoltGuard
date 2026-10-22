import { NextResponse } from 'next/server';
import { verifyOtpCode } from '@/lib/twilioClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumber, otpCode } = body;

    if (!phoneNumber || !otpCode) {
      return NextResponse.json({ error: 'Phone number and OTP code are required' }, { status: 400 });
    }

    const result = verifyOtpCode(phoneNumber, otpCode);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
