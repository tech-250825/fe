import { NextRequest } from 'next/server';
import https from 'https';
import { NextResponse } from 'next/server';

function getContentTypeFromUrl(url: string, filename: string): string {
  // Extract extension from filename or URL
  const extension = filename.split('.').pop()?.toLowerCase() || url.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    default:
      return 'application/octet-stream';
  }
}

function getDefaultFilename(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return `image.${extension}`;
    case 'mp4':
    case 'webm':
    case 'mov':
      return `video.${extension}`;
    default:
      return 'download.mp4';
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || getDefaultFilename(fileUrl || '');

  console.log('🚀 === 다운로드 API 호출 ===');
  console.log('📥 요청 URL:', req.url);
  console.log('🎬 파일 URL:', fileUrl);
  console.log('📝 파일명:', filename);

  if (!fileUrl) {
    console.error('❌ 파일 URL이 없습니다');
    return new Response('Missing file URL', { status: 400 });
  }

  return new Promise<Response>((resolve, reject) => {
    console.log('🌐 HTTPS 요청 시작:', fileUrl);
    
    https.get(fileUrl, (fileRes) => {
      console.log('✅ HTTPS 응답 수신:', fileRes.statusCode);
      console.log('📊 응답 헤더:', fileRes.headers);
      
      if (fileRes.statusCode !== 200) {
        console.error('❌ HTTP 상태 코드 오류:', fileRes.statusCode);
        reject(new Response(`HTTP ${fileRes.statusCode}`, { status: fileRes.statusCode || 500 }));
        return;
      }
      
      const headers = new Headers();
      const contentType = getContentTypeFromUrl(fileUrl, filename);
      headers.set('Content-Type', contentType);
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);
      
      console.log('📄 설정된 Content-Type:', contentType);
      console.log('💾 다운로드 파일명:', filename);

      // Convert IncomingMessage to ReadableStream
      const stream = new ReadableStream({
        start(controller) {
          let totalBytes = 0;
          
          fileRes.on('data', (chunk) => {
            totalBytes += chunk.length;
            controller.enqueue(chunk);
          });
          
          fileRes.on('end', () => {
            console.log('✅ 다운로드 완료! 총 바이트:', totalBytes);
            controller.close();
          });
          
          fileRes.on('error', (error) => {
            console.error('❌ 스트림 에러:', error);
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
    }).on('error', (error) => {
      console.error('❌ HTTPS 요청 실패:', error);
      reject(new Response('Download failed', { status: 500 }));
    });
  });
}
