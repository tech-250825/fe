import { NextRequest } from 'next/server';
import https from 'https';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'video.mp4';

  if (!fileUrl) {
    return new Response('Missing file URL', { status: 400 });
  }

  return new Promise<Response>((resolve, reject) => {
    https.get(fileUrl, (fileRes) => {
      const headers = new Headers();
      headers.set('Content-Type', 'video/mp4');
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);

      // Convert IncomingMessage to ReadableStream
      const stream = new ReadableStream({
        start(controller) {
          fileRes.on('data', (chunk) => {
            controller.enqueue(chunk);
          });
          fileRes.on('end', () => {
            controller.close();
          });
          fileRes.on('error', (error) => {
            controller.error(error);
          });
        }
      });

      resolve(
        new Response(stream, {
          status: 200,
          headers,
        })
      );
    }).on('error', () => {
      reject(new Response('Download failed', { status: 500 }));
    });
  });
}
