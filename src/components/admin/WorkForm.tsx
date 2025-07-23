"use client";

import { useState } from "react";

interface WorkFormProps {
  onSuccess: () => void;
}

export default function WorkForm({ onSuccess }: WorkFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    userInfo: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "image") {
        setImageFile(file);
      } else {
        setVideoFile(file);
      }
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "파일 업로드 실패");
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";
      let videoUrl = "";

      // 이미지 업로드
      if (imageFile) {
        imageUrl = await uploadFile(imageFile);
      }

      // 비디오 업로드
      if (videoFile) {
        videoUrl = await uploadFile(videoFile);
      }

      // 작품 정보 저장
      const response = await fetch("/api/works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          videoUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 폼 초기화
        setFormData({ title: "", description: "", userInfo: "" });
        setImageFile(null);
        setVideoFile(null);
        onSuccess();
      } else {
        setError(data.error || "작품 등록에 실패했습니다");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError(
        error instanceof Error ? error.message : "작품 등록에 실패했습니다",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">새 작품 등록</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            작품 제목 *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            작품 설명
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            사용자 정보
          </label>
          <input
            type="text"
            name="userInfo"
            value={formData.userInfo}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이미지 파일
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {imageFile && (
            <p className="text-sm text-gray-500 mt-1">
              선택된 파일: {imageFile.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            비디오 파일
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {videoFile && (
            <p className="text-sm text-gray-500 mt-1">
              선택된 파일: {videoFile.name}
            </p>
          )}
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? "등록 중..." : "작품 등록"}
        </button>
      </form>
    </div>
  );
}
