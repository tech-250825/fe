'use client';

export default function DownloadPage() {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '/api/download'; // API route로 프록시 다운로드
    a.download = 'video.mp4';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">비디오 다운로드</h1>
      <button
        onClick={handleDownload}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        비디오 다운로드
      </button>
    </div>
  );
}
