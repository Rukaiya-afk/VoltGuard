import { generateTelemetryFrame } from '@/lib/telemetryEngine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let isClosed = false;

      const sendFrame = () => {
        if (isClosed) return;
        try {
          const telemetry = generateTelemetryFrame();
          const chunk = `data: ${JSON.stringify(telemetry)}\n\n`;
          controller.enqueue(encoder.encode(chunk));
        } catch {
          isClosed = true;
        }
      };

      // Send initial frame immediately
      sendFrame();

      const intervalId = setInterval(sendFrame, 1000);

      request.signal.addEventListener('abort', () => {
        isClosed = true;
        clearInterval(intervalId);
        try {
          controller.close();
        } catch {
          // Stream already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
