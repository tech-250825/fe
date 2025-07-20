"use client";

import { useState, useEffect } from "react";

interface Work {
  id: number;
  title: string;
  description: string;
  image_url: string;
  video_url: string;
  user_info: string;
  created_at: string;
}

interface WorkListProps {
  refresh: boolean;
  onRefreshComplete: () => void;
}

export default function WorkList({
  refresh,
  onRefreshComplete,
}: WorkListProps) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorks = async () => {
    try {
      const response = await fetch("/api/works");
      const data = await response.json();

      if (response.ok) {
        setWorks(data);
      } else {
        setError("작품 목록을 불러오는데 실패했습니다");
      }
    } catch (error) {
      setError("서버 연결에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const deleteWork = async (id: number) => {
    if (!confirm("정말로 이 작품을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/works?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWorks(works.filter((work) => work.id !== id));
      } else {
        alert("작품 삭제에 실패했습니다");
      }
    } catch (error) {
      alert("서버 연결에 실패했습니다");
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchWorks();
      onRefreshComplete();
    }
  }, [refresh, onRefreshComplete]);

  if (loading) {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">등록된 작품 ({works.length}개)</h2>
      </div>

      <div className="p-6">
        {works.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            등록된 작품이 없습니다.
          </div>
        ) : (
          <div className="grid gap-6">
            {works.map((work) => (
              <div
                key={work.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{work.title}</h3>
                    {work.user_info && (
                      <p className="text-gray-600 text-sm">
                        작성자: {work.user_info}
                      </p>
                    )}
                    {work.description && (
                      <p className="text-gray-700 mt-2">{work.description}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      등록일:{" "}
                      {new Date(work.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteWork(work.id)}
                    className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {work.image_url && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        이미지:
                      </p>
                      <img
                        src={work.image_url}
                        alt={work.title}
                        className="w-full h-48 object-cover rounded border"
                      />
                    </div>
                  )}

                  {work.video_url && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        비디오:
                      </p>
                      <video
                        src={work.video_url}
                        controls
                        className="w-full h-48 rounded border"
                      >
                        브라우저가 비디오를 지원하지 않습니다.
                      </video>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
