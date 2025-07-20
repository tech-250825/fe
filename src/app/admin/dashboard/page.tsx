"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WorkForm from "@/components/admin/WorkForm";
import WorkList from "@/components/admin/WorkList";

export default function DashboardPage() {
  const [refreshList, setRefreshList] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const handleWorkSuccess = () => {
    setRefreshList(true);
    setShowForm(false);
  };

  const handleRefreshComplete = () => {
    setRefreshList(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // 인증 확인 (간단한 방법)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/works");
        if (response.status === 401) {
          router.push("/admin/login");
        }
      } catch (error) {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              작품 관리 시스템
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                {showForm ? "목록 보기" : "새 작품 등록"}
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {showForm ? (
            <WorkForm onSuccess={handleWorkSuccess} />
          ) : (
            <WorkList
              refresh={refreshList}
              onRefreshComplete={handleRefreshComplete}
            />
          )}
        </div>
      </main>
    </div>
  );
}
